#!/usr/bin/env python3
from __future__ import annotations

import json
import re
import sys
from pathlib import Path

PRODUCT_SKILLS = {
    "lively-photos-director",
    "photo-scene-director",
    "engine-prompt-compiler",
    "photo-qa-reviewer",
}

VERSION_FILES = {
    "package.json": ("version",),
    ".codex-plugin/plugin.json": ("version",),
    ".claude-plugin/plugin.json": ("version",),
    ".skills.json": ("version",),
    "marketplace.json": ("version",),
    "submission/listing.json": ("version",),
    "submission/reviewer_tests.json": ("version",),
}

ACTIVE_ENGINE_SURFACES = [
    "README.md",
    "SKILL.md",
    "skills/lively-photos-director/SKILL.md",
    "skills/photo-scene-director/SKILL.md",
    "skills/engine-prompt-compiler/SKILL.md",
    "skills/photo-qa-reviewer/SKILL.md",
    "bin/cli.js",
    ".codex-plugin/plugin.json",
    ".claude-plugin/plugin.json",
    ".skills.json",
    "marketplace.json",
    "submission/listing.json",
    "submission/reviewer_tests.json",
    "docs/solutions/codex-plugin-agentic-router.md",
]

REQUIRED_FILES = [
    "references/direction-rules.md",
    "references/prompt-compiler.md",
    "references/qa.md",
    "references/examples.md",
    "references/engines/openai-gpt-image-2.5.md",
    "schemas/brief.schema.json",
    "schemas/direction.schema.json",
    "schemas/revision.schema.json",
    "evals/trigger-cases.jsonl",
    "evals/behavior-cases.jsonl",
    "skills/lively-photos-director/SKILL.md",
]

STALE_ENGINE_PATTERN = re.compile(r"dall[\-· ]?e\s*3", re.IGNORECASE)
EXPLANATORY_STALE_MARKERS = {
    "historical",
    "retired",
    "deprecated",
    "stale",
    "remove",
    "removed",
    "reject",
    "rejects",
    "absence",
    "former",
    "previous",
    "old",
    "migration",
    "earlier",
}


def fail(message: str) -> None:
    raise SystemExit(f"FAIL: {message}")


def parse_frontmatter(text: str) -> dict[str, str]:
    if not text.startswith("---\n"):
        fail("SKILL.md must start with YAML frontmatter")
    end = text.find("\n---\n", 4)
    if end == -1:
        fail("SKILL.md frontmatter is not closed")
    data: dict[str, str] = {}
    for raw in text[4:end].splitlines():
        if not raw.strip() or raw.lstrip().startswith("#"):
            continue
        if ":" not in raw:
            fail(f"unsupported frontmatter line: {raw}")
        key, value = raw.split(":", 1)
        value = value.strip()
        if value.startswith(('"', "'")) and value.endswith(value[:1]):
            value = value[1:-1]
        data[key.strip()] = value
    return data


def read_json(path: Path) -> dict:
    try:
        data = json.loads(path.read_text(encoding="utf-8"))
    except Exception as exc:
        fail(f"invalid JSON in {path}: {exc}")
    if not isinstance(data, dict):
        fail(f"JSON root must be object: {path}")
    return data


def validate_jsonl(path: Path) -> list[dict]:
    rows: list[dict] = []
    for number, line in enumerate(path.read_text(encoding="utf-8").splitlines(), 1):
        if not line.strip():
            continue
        try:
            row = json.loads(line)
        except Exception as exc:
            fail(f"invalid JSONL in {path.name}:{number}: {exc}")
        if not isinstance(row, dict):
            fail(f"JSONL row must be object in {path.name}:{number}")
        rows.append(row)
    return rows


def nested_value(data: dict, keys: tuple[str, ...], path: str) -> str:
    current: object = data
    for key in keys:
        if not isinstance(current, dict) or key not in current:
            fail(f"missing {'.'.join(keys)} in {path}")
        current = current[key]
    if not isinstance(current, str) or not current:
        fail(f"version must be non-empty string in {path}")
    return current


def validate_skill_file(path: Path, require_negative_boundary: bool) -> tuple[int, int]:
    text = path.read_text(encoding="utf-8")
    meta = parse_frontmatter(text)
    name = meta.get("name", "")
    description = meta.get("description", "")

    if path.name != "SKILL.md":
        fail(f"unexpected skill filename: {path}")
    if not re.fullmatch(r"[a-z0-9]+(?:-[a-z0-9]+)*", name):
        fail(f"invalid kebab-case skill name in {path}: {name}")
    if path.parent.parent.name == "skills" and name != path.parent.name:
        fail(f"frontmatter name '{name}' must match directory '{path.parent.name}' in {path}")
    if not description:
        fail(f"description missing in {path}")
    if len(description) > 1024:
        fail(f"description too long in {path}: {len(description)} chars")
    if "Use when" not in description:
        fail(f"description must include positive 'Use when' boundary in {path}")
    if require_negative_boundary and "Do NOT use" not in description:
        fail(f"product skill description must include 'Do NOT use' boundary in {path}")

    lines = text.splitlines()
    if len(lines) >= 500:
        fail(f"SKILL.md must stay under 500 lines: {path} has {len(lines)}")
    return len(lines), len(description)


def validate_schema_contract(root: Path) -> None:
    brief = read_json(root / "schemas/brief.schema.json")
    direction = read_json(root / "schemas/direction.schema.json")
    revision = read_json(root / "schemas/revision.schema.json")
    expected = {
        "schemas/brief.schema.json": (brief, {"operation", "reference_images", "capture_profile", "subject_scale"}),
        "schemas/direction.schema.json": (
            direction,
            {"operation", "capture_profile", "subject_scale", "reference_assets", "change_set", "preserve_set", "engine"},
        ),
        "schemas/revision.schema.json": (revision, {"failure_class", "change_set", "preserve_set", "recommended_remedy"}),
    }
    for rel, (schema, required_properties) in expected.items():
        properties = schema.get("properties")
        if not isinstance(properties, dict):
            fail(f"properties object missing in {rel}")
        missing = sorted(required_properties - properties.keys())
        if missing:
            fail(f"contract properties missing in {rel}: {', '.join(missing)}")


def validate_versions(root: Path) -> str:
    versions: dict[str, str] = {}
    for rel, keys in VERSION_FILES.items():
        path = root / rel
        if not path.is_file():
            fail(f"versioned file missing: {rel}")
        versions[rel] = nested_value(read_json(path), keys, rel)
    if len(set(versions.values())) != 1:
        details = ", ".join(f"{path}={version}" for path, version in sorted(versions.items()))
        fail(f"version drift: {details}")
    return next(iter(versions.values()))


def is_explanatory_stale_mention(line: str) -> bool:
    lowered = line.lower()
    return any(marker in lowered for marker in EXPLANATORY_STALE_MARKERS)


def validate_engine_contract(root: Path) -> None:
    ref = (root / "references/engines/openai-gpt-image-2.5.md").read_text(encoding="utf-8")
    required_tokens = [
        "gpt-image-2.5-flare",
        "gpt-image-2.5-sunburst",
        "gpt-image-2.5-flare-2026-09-08",
        "gpt-image-2.5-sunburst-2026-09-08",
        "CHANGE",
        "PRESERVE",
        "transparent",
        "3840",
    ]
    for token in required_tokens:
        if token not in ref:
            fail(f"OpenAI engine reference missing required contract token: {token}")

    for rel in ACTIVE_ENGINE_SURFACES:
        path = root / rel
        if not path.is_file():
            fail(f"active engine surface missing: {rel}")
        for number, line in enumerate(path.read_text(encoding="utf-8", errors="ignore").splitlines(), 1):
            if STALE_ENGINE_PATTERN.search(line) and not is_explanatory_stale_mention(line):
                fail(f"active retired-engine capability claim remains in {rel}:{number}")


def validate_evals(root: Path) -> tuple[int, int, int]:
    triggers = validate_jsonl(root / "evals/trigger-cases.jsonl")
    labels = {row.get("expected") for row in triggers}
    if labels != {"trigger", "do_not_trigger"}:
        fail("trigger evals must contain both trigger and do_not_trigger cases")
    if len(triggers) < 20:
        fail(f"trigger eval set is too small: {len(triggers)}")
    trigger_ids = [row.get("id") for row in triggers]
    if None in trigger_ids or len(trigger_ids) != len(set(trigger_ids)):
        fail("trigger eval IDs must be present and unique")

    behavior = validate_jsonl(root / "evals/behavior-cases.jsonl")
    if len(behavior) < 12:
        fail(f"behavior eval set is too small: {len(behavior)}")
    behavior_ids = [row.get("id") for row in behavior]
    if None in behavior_ids or len(behavior_ids) != len(set(behavior_ids)):
        fail("behavior eval IDs must be present and unique")
    families = {row.get("family") for row in behavior if row.get("family")}
    if len(families) < 10:
        fail(f"behavior evals need at least 10 semantic families, found {len(families)}")
    for row in behavior:
        if not row.get("must_include") or not row.get("must_avoid"):
            fail(f"behavior case {row.get('id')} needs must_include and must_avoid")
    return len(triggers), len(behavior), len(families)


def validate_cleanliness(root: Path) -> None:
    corpus_files = [
        p for p in root.rglob("*")
        if p.is_file()
        and p.name != Path(__file__).name
        and ".git" not in p.parts
        and "node_modules" not in p.parts
        and "__pycache__" not in p.parts
        and "dist" not in p.parts
    ]
    corpus = "\n".join(p.read_text(encoding="utf-8", errors="ignore") for p in corpus_files)
    forbidden_patterns = [
        r"/Users/[^\s]+",
        r"/home/[^\s]+",
        r"sk-[A-Za-z0-9_-]{16,}",
        r"gh[pousr]_[A-Za-z0-9]{20,}",
        r"AKIA[0-9A-Z]{16}",
    ]
    for pattern in forbidden_patterns:
        if re.search(pattern, corpus):
            fail(f"possible secret or machine-specific path matched: {pattern}")


def main() -> None:
    root = Path(sys.argv[1] if len(sys.argv) > 1 else ".").resolve()
    root_skill = root / "SKILL.md"
    if not root_skill.is_file():
        fail("SKILL.md missing")

    root_lines, root_desc = validate_skill_file(root_skill, require_negative_boundary=True)
    root_meta = parse_frontmatter(root_skill.read_text(encoding="utf-8"))
    if root_meta.get("name") != root.name:
        fail(f"root frontmatter name '{root_meta.get('name')}' must match directory '{root.name}'")
    if "skills/lively-photos-director/SKILL.md" not in root_skill.read_text(encoding="utf-8"):
        fail("root SKILL.md must point to canonical nested orchestrator")

    for rel in REQUIRED_FILES:
        if not (root / rel).is_file():
            fail(f"required file missing: {rel}")

    nested_skills = sorted((root / "skills").glob("*/SKILL.md"))
    if len(nested_skills) != 5:
        fail(f"expected exactly 5 public nested Skills, found {len(nested_skills)}")
    for path in nested_skills:
        validate_skill_file(path, require_negative_boundary=path.parent.name in PRODUCT_SKILLS)

    validate_schema_contract(root)
    trigger_count, behavior_count, family_count = validate_evals(root)
    version = validate_versions(root)
    validate_engine_contract(root)
    validate_cleanliness(root)

    print("PASS: lively-photos-director structural validation")
    print(f"  version: {version}")
    print(f"  root SKILL.md lines: {root_lines}")
    print(f"  root description chars: {root_desc}")
    print(f"  public nested Skills: {len(nested_skills)}")
    print(f"  trigger cases: {trigger_count}")
    print(f"  behavior cases: {behavior_count}")
    print(f"  semantic behavior families: {family_count}")
    print("  schemas: contract fields present in 3 valid JSON files")
    print("  OpenAI engine: GPT Image 2.5 Flare/Sunburst contract present")
    print("  stale active retired-engine claims: none")
    print("  manifest/submission versions: synchronized")


if __name__ == "__main__":
    main()
