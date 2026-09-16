<div align="center">

# Lively Photos Director

### Natural-photography direction, editing, and QA from real-person reference photos

**Reference roles · Capture profiles · GPT Image 2.5 · Bounded edits · Evidence-based QA**

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg?style=flat-square)](LICENSE)
[![Bun](https://img.shields.io/badge/Runtime-Bun%20%3E%3D1.0-FBF0DF?style=flat-square&logo=bun&logoColor=black)](https://bun.sh)
[![Version](https://img.shields.io/badge/version-1.2.0-2563EB?style=flat-square)](package.json)

</div>

## What this is

Lively Photos Director is a portable Skill/Plugin for a specific job: take real-person reference photos plus a casually described idea and turn them into a clear direction for a believable photograph or precise photo edit.

It is designed for requests such as:

- "Use my photo and make it look like I was naturally photographed during a partnership signing"
- "My friend took this from far away at a normal beach. Keep me small in frame and make it feel like an ordinary phone photo"
- "Photo 1 is me, photo 2 is the jacket, photo 3 is the office"
- "Change only the shirt and keep my face, pose, crop, light and background stable"
- "Audit this generated image for hand artifacts, lighting problems and edit drift"

The product goal is not a glossy AI portrait. The goal is a photograph whose subject scale, body language, light, environment and small imperfections make sense together.

## What changed in 1.2.0

Version 1.2.0 replaces the old engine-string model with an engine-aware workflow.

Key changes:

- first-class GPT Image 2.5 Flare and Sunburst generation/editing guidance
- explicit generation, edit, repair, series, audit and compile operations
- explicit multi-reference roles instead of treating every input as generic inspiration
- scene mode separated from capture profile
- subject scale and distance treated as first-class direction
- engine request parameters separated from prompt prose
- edits use explicit `CHANGE` and `PRESERVE` sets
- multi-turn edits restate important preservation constraints
- image QA cannot PASS without an actual output to inspect
- conditional edit-drift, transparency, text and continuity gates
- version-consistency and stale-engine checks in validation
- deterministic Plugin package verification in CI

The current OpenAI research record is in [`docs/research/gpt-image-2-5-2026-09-16.md`](docs/research/gpt-image-2-5-2026-09-16.md).

## The workflow

```text
casual request + reference images
        |
        v
classify operation
        |
        +--> map reference roles and strength
        |
        +--> choose scene mode
        |
        +--> choose capture profile
        |
        +--> choose subject scale / honor distance
        v
photographic scene direction
        v
engine-aware compilation
        |
        +--> model / operation / request parameters
        +--> reference map
        +--> prompt body
        +--> CHANGE / PRESERVE for edits
        v
host execution when available
        v
actual-image QA
        |
        +--> smallest justified repair
        +--> repeat only if image evidence requires it
```

If the host cannot generate/edit images, the workflow stops at a complete execution packet and reports `NOT_EXECUTED` plus `UNVERIFIED` visual QA. It does not simulate tool success.

## Five public Skills

The public surface intentionally stays small.

### `lively-photos-director`

Canonical orchestrator. Classifies operation, reference strength/roles, scene, capture profile, subject scale and execution capability, then routes to the specialist that owns the next decision.

### `photo-scene-director`

Owns the believable moment: action, environment, body language, subject distance, framing, camera cues, light and ordinary-context credibility.

### `engine-prompt-compiler`

Owns engine/model selection, operation mapping, structured request parameters, reference mapping and engine-specific prompt compilation.

### `photo-qa-reviewer`

Owns actual-image review, failure classification and the smallest repair strategy. It does not approve images it cannot inspect.

### `host-workspace-operator`

Uses host-native file/reference/output capabilities when available. The Plugin does not pretend it owns a universal filesystem API.

## Scene mode is not capture style

Two independent decisions are used because they change different things.

Scene modes:

- `documentary-corporate`
- `candid-professional`
- `editorial-natural`
- `everyday-lifestyle`
- `event-documentary`

Capture profiles:

- `phone-candid`
- `documentary-camera`
- `editorial-camera`
- `controlled-professional`

Examples:

```text
event-documentary + phone-candid
everyday-lifestyle + phone-candid
documentary-corporate + documentary-camera
editorial-natural + editorial-camera
```

This prevents a casual beach snapshot from receiving the same framing and polish as an editorial portrait simply because both contain the same person.

## Subject scale and distance

Supported direction scales:

- `close-portrait`
- `medium`
- `three-quarter`
- `full-body`
- `environmental`
- `distant-candid`

Explicit distance wins over aesthetic defaults. If the user asks for a person photographed from 12 meters away, the direction keeps the subject relatively small and does not invent close-portrait detail or extreme background blur.

## Reference roles

Multiple images are not automatically blended together.

Supported roles include:

- identity
- wardrobe
- product or prop
- environment
- composition
- lighting
- style
- background

Example:

```text
reference 1 -> identity
reference 2 -> wardrobe
reference 3 -> environment
```

The direction preserves visible appearance from reference 1, garment guidance from reference 2 and location cues from reference 3.

Reference handling is based on user-supplied visible evidence. The Skill does not identify people from appearance or create biometric identity templates.

## GPT Image 2.5

Lively Photos Director treats OpenAI GPT Image as one engine family with two current 2.5 model choices.

### Flare

`gpt-image-2.5-flare`

The current OpenAI documentation positions Flare as the faster model for high-quality everyday generation. It is the default starting point when speed matters and the task does not justify the more demanding edit/quality path.

### Sunburst

`gpt-image-2.5-sunburst`

The current OpenAI documentation positions Sunburst as the more capable generation/editing choice when demanding quality or editing precision matters most.

Users normally should not need to pick between them manually. The compiler makes the decision from the request unless the user explicitly selects a model.

Exact current aliases, snapshots, quality values, output controls and size constraints live in [`references/engines/openai-gpt-image-2.5.md`](references/engines/openai-gpt-image-2.5.md), not repeated throughout the Plugin.

## Request parameters stay out of decorative prose

For engines that expose structured fields, Lively keeps controls such as these separate:

```json
{
  "engine": "openai-gpt-image",
  "model": "gpt-image-2.5-flare",
  "operation": "generation",
  "quality": "auto",
  "size": "auto",
  "background": "auto",
  "output_format": "png"
}
```

The prompt describes the visible image. API/tool fields configure the request.

## Editing: CHANGE and PRESERVE

A bounded edit should not be expressed as "keep everything else the same" and hope for the best.

Example:

```text
CHANGE
- replace only the casual shirt with a dark navy overshirt

PRESERVE
- recognizable visible appearance
- expression
- body shape and pose
- crop and camera relationship
- lighting direction
- background geometry and existing objects
- prior accepted edits
```

When the user requires literal pixel identity outside an edited region, the workflow does not promise that prompting or a mask can guarantee it. It recommends host-side compositing of the approved edited region when that capability exists.

## Multi-turn edits

Each new edit turn repeats the critical preservation contract and checks that earlier accepted changes survived.

```text
new CHANGE
+ critical PRESERVE
+ previous accepted edits
+ output comparison
```

A vague "same as before" is not enough when likeness, crop, lighting or an earlier edit matters.

## Camera direction without fake precision

The Skill uses photography vocabulary to communicate visible consequences:

- environmental vs tight perspective
- eye-level vs high/low camera
- distant vs close subject scale
- moderate vs shallow context separation
- normal phone depth
- documentary vs editorial framing

A phrase such as `50mm-style natural perspective` may be useful creative direction. It is not presented as proof that an image generator numerically simulated a real 50mm lens, aperture, shutter or sensor.

## Visual QA

Six base gates:

1. visible likeness continuity
2. anatomy and body mechanics
3. camera/perspective plausibility
4. lighting consistency
5. context credibility
6. synthetic residue

Conditional gates are added only when relevant:

- edit change/preserve/drift
- transparent alpha edges
- requested readable text
- multi-turn continuity
- photo-series continuity

Verdicts:

- `APPROVE`
- `REVISE`
- `REJECT`
- `UNVERIFIED`

`UNVERIFIED` is mandatory when material image evidence is unavailable.

## Revision strategy

Failures are classified before repair:

- prompt ambiguity
- reference weakness
- wrong model choice
- insufficient quality setting
- composition problem
- likeness drift
- anatomical defect
- lighting inconsistency
- context defect
- local artifact
- multi-turn drift
- engine limitation

The workflow then takes the narrowest justified action: clarify, local edit, mask-guided edit, whole-image edit, direction redesign, model reroute, quality change, external compositing or full regeneration.

## Installation

### Skills.sh

```bash
npx skills add imMamdouhaboammar/lively-photos-director
```

### Claude Code

```bash
mkdir -p ~/.claude/skills
git clone https://github.com/imMamdouhaboammar/lively-photos-director.git ~/.claude/skills/lively-photos-director
```

### Gemini CLI / Antigravity

```bash
mkdir -p ~/.gemini/config/skills
git clone https://github.com/imMamdouhaboammar/lively-photos-director.git ~/.gemini/config/skills/lively-photos-director
```

### Codex

```bash
mkdir -p ~/.codex/skills
git clone https://github.com/imMamdouhaboammar/lively-photos-director.git ~/.codex/skills/lively-photos-director
```

### Cursor project skill

```bash
mkdir -p .cursor/skills
git clone https://github.com/imMamdouhaboammar/lively-photos-director.git .cursor/skills/lively-photos-director
```

### CLI

```bash
npx lively-photos-director --help
bunx lively-photos-director modes
```

## CLI

```bash
lively-photos-director info
lively-photos-director modes
lively-photos-director skills
lively-photos-director route "Friend took this from 12 meters away on a normal beach"
lively-photos-director route "Change only my shirt and preserve the rest"
lively-photos-director route "Use GPT Image 2.5 for a precision edit that cannot drift"
lively-photos-director validate
```

`route` is a deterministic decision probe. It does not generate images and does not claim visual QA.

## Structured contracts

- [`schemas/brief.schema.json`](schemas/brief.schema.json): user brief and optional reference/output preferences
- [`schemas/direction.schema.json`](schemas/direction.schema.json): engine-neutral direction packet plus optional engine request section
- [`schemas/revision.schema.json`](schemas/revision.schema.json): evidence-linked revision request

The schemas are optional host contracts. Natural-language users do not need to fill them manually.

## Evals

- [`evals/trigger-cases.jsonl`](evals/trigger-cases.jsonl): positive and negative discovery/routing cases
- [`evals/behavior-cases.jsonl`](evals/behavior-cases.jsonl): semantic decision families including phone-candid distance, multi-reference roles, model routing, local edits, multi-turn continuity, weak references, exact-pixel preservation and evidence pressure

Reviewer cases in [`submission/reviewer_tests.json`](submission/reviewer_tests.json) are test definitions, not executed-result evidence. The file records that distinction explicitly.

## Verification

Local commands:

```bash
bun test
python3 scripts/validate_skill.py .
python3 scripts/validate_plugin.py .
```

Build a Plugin archive outside the repository root:

```bash
python3 scripts/package_plugin.py . /tmp/lively-photos-director.zip
```

CI additionally:

- runs CLI smoke paths
- verifies manifest/version consistency
- rejects stale active DALL-E 3 claims
- checks semantic eval breadth
- validates the Codex Plugin contract
- builds the ZIP twice and byte-compares the archives
- extracts a fresh ZIP and validates the extracted Plugin again

## Repository structure

```text
lively-photos-director/
├── .codex-plugin/plugin.json
├── skills/
│   ├── lively-photos-director/
│   ├── photo-scene-director/
│   ├── engine-prompt-compiler/
│   ├── photo-qa-reviewer/
│   └── host-workspace-operator/
├── references/
│   ├── engines/openai-gpt-image-2.5.md
│   ├── direction-rules.md
│   ├── prompt-compiler.md
│   ├── qa.md
│   └── examples.md
├── schemas/
├── evals/
├── submission/
├── scripts/
├── tests/
├── docs/research/
├── docs/superpowers/
├── bin/cli.js
└── SKILL.md
```

## Limitations

- The Skill can compile a correct image workflow without having image execution access. In that case execution is explicitly not performed.
- Visual QA needs an actual generated/edited image. A prompt alone cannot pass the visual gates.
- Reference preservation is probabilistic model behavior, not a biometric identity guarantee.
- Masks guide edits but are not treated as a pixel-exact boundary guarantee.
- Exact third-party engine flags should be refreshed from that vendor's current documentation before being relied upon.
- Live Flare-vs-Sunburst benchmarks require authenticated image-generation execution and are not inferred from documentation.

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md) and [CODE_OF_CONDUCT.md](CODE_OF_CONDUCT.md).

## License

MIT. See [LICENSE](LICENSE).
