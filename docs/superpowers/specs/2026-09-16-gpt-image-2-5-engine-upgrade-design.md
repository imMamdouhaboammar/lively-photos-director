# GPT Image 2.5 engine upgrade design

Date: 2026-09-16
Status: approved by user mission
Baseline: `main` at `0d4efd5a9dcec214d2407f622a3aba135b29d7b3`

## Goal

Make Lively Photos Director a maintainable natural-photography director with first-class GPT Image 2.5 generation and editing support, explicit reference roles, capture realism, operation-aware QA, and engine-aware compilation without expanding the public Skill surface.

## Design principles

1. One job per public Skill.
2. Deep vendor facts live in progressive references, not repeated across orchestrators.
3. Portable photographic intent is separate from vendor request parameters.
4. Visible likeness preservation is reference-based. Never identify a person from appearance and never extract biometric identity templates.
5. Camera language describes the intended visual result. It does not promise exact lens simulation.
6. Generation, edit, repair, series, audit, and compile are different operations and must route differently.
7. Scene mode describes what is happening. Capture profile describes how the moment feels photographed.
8. Revision starts from failure classification, then chooses the smallest remedy.
9. Visual QA requires an actual produced image. Prompt review alone cannot pass image gates.
10. Evidence state is explicit: planned, structurally validated, runtime verified, or blocked.

## Public Skill architecture

Keep exactly five public Skills:

### `lively-photos-director`
Class: orchestrator

Owns request classification and routing. It determines operation, reference strength, reference roles, scene mode, capture profile, subject scale, execution capability, and the required downstream Skills.

It does not own vendor model tables or detailed camera rules.

### `photo-scene-director`
Class: domain expert

Owns believable moment design, environment, framing, body language, camera cues, light, subject distance, and natural imperfection. It reasons from use case and capture profile rather than selecting fixed aperture values from a scene-name lookup table.

### `engine-prompt-compiler`
Class: engine-aware procedure/orchestrator

Owns portable execution packets, engine selection, operation selection, reference mapping, request parameter separation, and vendor-specific prompt compilation. OpenAI GPT Image 2.5 is its deepest current adapter.

### `photo-qa-reviewer`
Class: diagnostic

Owns the six photographic plausibility gates plus conditional operation-specific gates. It classifies failure before choosing local edit, prompt correction, model escalation, quality change, full rerender, or external compositing.

### `host-workspace-operator`
Class: host adapter

Retain existing responsibility. No new engine logic belongs here.

## Canonical Skill ownership

The current repository has behavioral drift between root `SKILL.md` and `skills/lively-photos-director/SKILL.md`.

Decision:

- `skills/lively-photos-director/SKILL.md` becomes the canonical full orchestrator contract for the Codex Plugin suite.
- root `SKILL.md` remains the portable entrypoint for registries that expect a root Skill. It stays concise and explicitly delegates full behavior to the canonical nested contract plus repository references.
- `scripts/validate_skill.py` verifies the canonical path exists and that active surfaces do not reintroduce stale DALL-E 3 claims.

This removes manual duplication without adding a code-generation sync layer.

## Core classification model

### Operation

- `generate_new_scene`
- `edit_existing_image`
- `repair_generated_image`
- `create_series`
- `audit_only`
- `compile_only`

### Reference strength

- `strong`
- `usable`
- `weak`
- `conflicting`
- `multiple-role`

### Reference role

Each input image may contribute one or more explicit roles:

- `identity`
- `wardrobe`
- `product_or_prop`
- `environment`
- `composition`
- `lighting`
- `style`
- `background`

Conflicts are resolved by role priority supplied in the packet. An identity reference never silently becomes a wardrobe or environment source.

### Scene mode

- `documentary-corporate`
- `candid-professional`
- `editorial-natural`
- `everyday-lifestyle`
- `event-documentary`

### Capture profile

- `phone-candid`
- `documentary-camera`
- `editorial-camera`
- `controlled-professional`

### Subject scale

- `close-portrait`
- `medium`
- `three-quarter`
- `full-body`
- `environmental`
- `distant-candid`

### Execution capability

- `native-image-tool`
- `api-capable-host`
- `text-only`
- `unknown`

Each classification must alter routing, output shape, or constraints. Decorative fields are excluded.

## Portable execution packet

Extend the existing direction schema rather than adding a new framework. The packet carries:

- operation
- scene mode
- capture profile
- subject scale
- reference assets with explicit role and strength
- moment
- environment
- composition
- camera cues
- lighting
- portable constraints and exclusions
- preserve set
- change set
- target engine/model when chosen
- request parameters when supported

API parameters such as model, quality, size, background, output format, and compression are not embedded inside prose.

## OpenAI GPT Image 2.5 adapter

Add `references/engines/openai-gpt-image-2.5.md` as the single deep current source for the OpenAI engine family.

The adapter decides:

### Model

- Flare for fast, high-quality general generation when the task does not justify the higher-quality path.
- Sunburst for demanding quality, difficult preservation, or precision editing.
- A dated snapshot may be selected for repeatable evals.

### Operation

- generation
- full-image edit
- local or mask-guided edit
- multi-reference composition/edit
- multi-turn edit through an appropriate host workflow
- external compositing when pixel-identical preservation is required

### Request parameters

- quality: `auto | low | medium | high | xhigh | max`
- size: `auto` or validated supported custom resolution
- background: `auto | opaque | transparent`
- output format: `png | jpeg | webp`
- compression only where supported

The adapter validates incompatible combinations such as transparent JPEG.

### Prompt body

Prompt prose follows a stable order:

1. desired result
2. reference roles
3. subject
4. moment
5. environment
6. composition/framing
7. capture profile and visible camera cues
8. lighting
9. materials/skin realism
10. `CHANGE` set for edits
11. `PRESERVE` set for edits
12. relevant exclusions

Multi-turn edits restate critical preservation constraints instead of relying on `same as before`.

## Editing and preservation policy

Use the smallest operation that can solve the problem.

- local defect with bounded edit available: edit the local region
- mask available: use it as guidance, not a pixel-exact guarantee
- repeated edit drift: restate preserve set and inspect accepted details
- pixel-identical requirement: composite the approved edited region into the original where host capabilities permit
- global scene/camera problem: rerender or whole-image edit

Never promise exact unchanged pixels from prompt text alone.

## QA model

Keep six base gates:

1. likeness
2. anatomy/body mechanics
3. camera/perspective plausibility
4. lighting consistency
5. context credibility
6. synthetic residue

Add conditional gates:

### Edit
- requested change occurred
- preserve set remained stable
- no unrelated region drift

### Transparent output
- alpha edge quality is visually checked

### Requested text
- spelling and legibility are visually checked

### Multi-turn
- prior accepted edits survived the new turn

QA cannot return PASS without an actual image to inspect. If no image is accessible, status is `UNVERIFIED`.

## Failure taxonomy and remedy

| Failure | Default remedy |
| --- | --- |
| prompt ambiguity | rewrite only the ambiguous instruction |
| reference weakness | use conservative likeness guidance or request stronger reference when fidelity is essential |
| wrong model choice | route between Flare and Sunburst based on task requirements |
| insufficient quality | change quality only when visual evidence justifies it |
| composition problem | revise scene/framing direction |
| likeness drift | strengthen reference role and preserve set; consider Sunburst for demanding edit/preservation |
| anatomical defect | bounded local edit when possible |
| lighting inconsistency | bounded edit if local; rerender when scene-wide |
| context defect | remove or replace unsupported prop/background element |
| local artifact | local edit |
| multi-turn drift | restate preserve set and compare to prior accepted state |
| engine limitation | report limitation or use a host-side compositing step |

## Schema strategy

Extend current schemas additively.

`brief.schema.json` gains operation, reference asset objects, capture preference, subject scale, and engine/output preferences while preserving `idea` and existing fields.

`direction.schema.json` gains operation, capture profile, subject scale, reference assets, preserve/change sets, engine selection, and request parameters.

`revision.schema.json` gains failure class, operation, change/preserve sets, target region, and recommended remedy while preserving current required fields for compatibility.

No new schema is introduced unless a later implementation proves the current three cannot express the contract.

## Eval strategy

Expand behavior cases across distinct decisions rather than paraphrases:

1. strong-reference generation
2. distant phone-candid ordinary beach
3. demanding preservation that selects Sunburst
4. local edit preserving most of the source
5. multi-reference role mapping
6. multi-turn preservation
7. weak reference
8. multi-shot continuity
9. non-photographic negative trigger
10. text-only host compilation
11. exact-pixel preservation requiring compositing
12. pressure to claim QA without image evidence

CLI tests cover routing classifications and version consistency. Structural validation checks version drift, stale OpenAI engine claims, required OpenAI reference, and eval breadth.

## Versioning

This change keeps public Skill names and the primary product job intact while adding backward-compatible routing and engine depth. Target version: `1.2.0`.

All manifests and submission metadata must agree on the same version.

## Verification

Repository-native CI becomes the execution proof because the authorized local desktop is unavailable in this session.

CI must run:

- Bun unit tests
- CLI smoke commands
- Skill validator
- Plugin validator
- deterministic package build twice and byte comparison

Runtime GPT Image 2.5 benchmark remains a separate evidence gate requiring authenticated API/tool execution. It must not block structural release preparation, but the final report must mark it blocked if unavailable.

## Non-goals

- no new public GPT-specific Skill
- no custom engine framework dependency
- no ZzzOps project machinery for this single-PR change
- no guessed 2026 Midjourney/Flux/SDXL flags
- no biometric face-template extraction
- no claim that prompt camera metadata produces exact physical simulation
- no claim that reviewer fixtures were executed unless current-version evidence exists
