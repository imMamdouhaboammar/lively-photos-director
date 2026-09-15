#!/usr/bin/env python3
from __future__ import annotations

import json
import re
import sys
from pathlib import Path


def fail(message: str) -> None:
    raise SystemExit(f"FAIL: {message}")


def parse_frontmatter(text: str) -> dict[str, str]:
    if not text.startswith("---\n"):
        fail("SKILL.md must start with YAML frontmatter")
    end = text.find("\n---\n", 4)
    if end == -1:
        fail("SKILL.md frontmatter is not closed")
    block = text[4:end]
    data: dict[str, str] = {}
    for raw in block.splitlines():
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


def validate_json(path: Path) -> None:
    try:
        json.loads(path.read_text(encoding="utf-8"))
    except Exception as exc:
        fail(f"invalid JSON in {path.relative_to(path.parents[1])}: {exc}")


def validate_jsonl(path: Path) -> list[dict]:
    rows = []
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


def main() -> None:
    root = Path(sys.argv[1] if len(sys.argv) > 1 else ".").resolve()
    skill = root / "SKILL.md"
    if not skill.is_file():
        fail("SKILL.md missing")

    text = skill.read_text(encoding="utf-8")
    meta = parse_frontmatter(text)

    name = meta.get("name", "")
    description = meta.get("description", "")
    if name != root.name:
        fail(f"frontmatter name '{name}' must match directory '{root.name}'")
    if not re.fullmatch(r"[a-z0-9]+(?:-[a-z0-9]+)*", name):
        fail("name must be kebab-case")
    if not description:
        fail("description missing")
    if len(description) > 1024:
        fail(f"description too long: {len(description)} chars")
    if "Use when" not in description or "Do NOT use" not in description:
        fail("description must include positive and negative trigger boundaries")

    lines = text.splitlines()
    if len(lines) >= 500:
        fail(f"SKILL.md must stay under 500 lines, found {len(lines)}")

    required = [
        "references/direction-rules.md",
        "references/prompt-compiler.md",
        "references/qa.md",
        "references/examples.md",
        "schemas/brief.schema.json",
        "schemas/direction.schema.json",
        "schemas/revision.schema.json",
        "evals/trigger-cases.jsonl",
        "evals/behavior-cases.jsonl",
    ]
    for rel in required:
        if not (root / rel).is_file():
            fail(f"required file missing: {rel}")

    for rel in ["schemas/brief.schema.json", "schemas/direction.schema.json", "schemas/revision.schema.json"]:
        validate_json(root / rel)

    triggers = validate_jsonl(root / "evals/trigger-cases.jsonl")
    labels = {row.get("expected") for row in triggers}
    if labels != {"trigger", "do_not_trigger"}:
        fail("trigger evals must contain both trigger and do_not_trigger cases")
    if len(triggers) < 12:
        fail("trigger eval set is too small")

    behavior = validate_jsonl(root / "evals/behavior-cases.jsonl")
    if len(behavior) < 6:
        fail("behavior eval set is too small")
    for row in behavior:
        if not row.get("must_include") or not row.get("must_avoid"):
            fail(f"behavior case {row.get('id')} needs must_include and must_avoid")

    corpus_files = [
        p for p in root.rglob("*")
        if p.is_file()
        and p.name != Path(__file__).name
        and ".git" not in p.parts
        and "node_modules" not in p.parts
        and "__pycache__" not in p.parts
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

    print("PASS: lively-photos-director structural validation")
    print(f"  SKILL.md lines: {len(lines)}")
    print(f"  description chars: {len(description)}")
    print(f"  trigger cases: {len(triggers)}")
    print(f"  behavior cases: {len(behavior)}")
    print("  schemas: 3 valid JSON files")


if __name__ == "__main__":
    main()
