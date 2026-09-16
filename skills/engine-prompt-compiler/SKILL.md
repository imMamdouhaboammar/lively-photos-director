---
name: engine-prompt-compiler
description: "Use when an accepted photographic direction must be translated into an engine-ready generation or edit packet, including target engine/model selection, ordered reference roles, request parameters, prompt compilation, change/preserve boundaries, or text-only handoff. Do NOT use for initial scene direction, post-generation visual QA, general prose, code generation, or assuming one universal negative-prompt syntax across image engines."
---

# Engine Prompt Compiler

Translate a portable photographic direction into the smallest engine-specific execution packet that preserves the user's priorities.

North star: engine differences belong here, while photographic intent remains portable.

## Progressive engine references

Load only the target engine reference that is current and available.

- OpenAI GPT Image 2.5: `../../references/engines/openai-gpt-image-2.5.md`

For other engines, compile only from current verified vendor behavior available in the session or from an existing repository reference that is still current. Do not reproduce stale Midjourney, Flux, SDXL, or other parameter folklore from memory.

If vendor-specific facts cannot be verified, return the portable packet plus a clear `engine_specific_contract_unverified` note rather than inventing syntax.

## Input contract

Consume the accepted direction and preserve these concepts separately:

- operation
- scene mode
- capture profile
- subject scale
- moment/action
- environment/context
- composition/body language
- camera cues
- lighting
- reference assets and roles
- change set
- preserve set
- portable constraints/exclusions
- execution capability
- requested engine/model/output needs

Do not infer a reference role from upload order when the user or orchestrator already assigned one.

## 1. Select the engine family

Use an explicitly requested engine when supported and current.

When the user has not chosen an engine:

- prefer the host's native image capability when it satisfies the task
- prefer an available API-capable path when exact request parameters or reproducible evaluation matter
- if only text output is possible, compile without claiming execution

Engine selection is not scene direction. Do not change the photographic brief merely because an engine uses different syntax.

## 2. Select operation before model

Operations:

- `generation`: new scene from text and optional references
- `whole_image_edit`: edit the existing image broadly while preserving defined details
- `local_edit`: change a bounded target with explicit protected details
- `masked_local_edit`: use a supplied mask as guidance where supported
- `multi_reference`: combine explicitly mapped evidence from multiple inputs
- `multi_turn_edit`: continue an accepted image-edit state while restating critical preservation constraints
- `external_composite`: host-side composition when unchanged pixels are a hard requirement

The requested change determines the operation. Do not choose a full generation when the task is a local edit unless the engine cannot solve the edit and the limitation is reported.

## 3. Map references by role

Emit an ordered reference table before the prompt:

| Asset | Role(s) | Preserve from this asset | May change |
| --- | --- | --- | --- |
| reference-1 | identity | visible stable appearance | pose/background unless protected |
| reference-2 | wardrobe | garment shape/material/color | wearer pose/scene |
| reference-3 | environment | location/layout cues | people/temporary objects unless protected |

Use actual asset identifiers in real packets. The table above is illustrative.

When two references conflict on the same role, flag the conflict instead of averaging them silently.

## 4. Keep request parameters outside prompt prose

When the target engine exposes structured controls, represent them as parameters, for example:

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

Do not write `use max quality, 2048x2048, PNG` inside the prompt as a substitute for actual request parameters when the host can pass those fields separately.

Parameter values must come from the current target-engine contract. Never generalize one engine's controls to another.

## 5. Compile the prompt body

Use this priority order because it matches the user's visual intent rather than engine implementation detail:

1. desired result
2. reference roles
3. subject and visible preservation requirements
4. moment/action
5. environment/context
6. composition, framing, and subject scale
7. capture profile and visible camera cues
8. lighting
9. materials, skin, fabric, and environmental realism
10. `CHANGE` block for edits
11. `PRESERVE` block for edits
12. relevant constraints/exclusions

Use concise physical relationships and visible outcomes. Avoid adjective piles.

### Generation shape

```text
RESULT
Create [one clear photographic result].

REFERENCES
[asset -> role mapping and what each contributes]

MOMENT
[one action]

ENVIRONMENT
[credible setting and story-bearing context]

FRAMING AND CAPTURE
[subject scale, distance, camera relationship, capture profile, visible perspective/focus cues]

LIGHT
[dominant source and plausible fill/contrast]

REALISM
[natural skin/fabric/material behavior, anatomy, context]

CONSTRAINTS
[only relevant failure modes]
```

### Edit shape

```text
RESULT
Edit the supplied image rather than rebuilding unrelated parts.

CHANGE
- [requested change 1]
- [requested change 2]

PRESERVE
- [identity/appearance requirements]
- [pose/crop/camera/light/background/objects/prior accepted edits that must remain stable]

REFERENCES
[explicit roles]

QUALITY CHECK
The requested change must be visible while protected details remain stable as far as the engine supports.
```

Do not depend on vague phrases such as `same as before` for high-value preservation.

## 6. Express exclusions per engine

The portable packet may contain:

- constraints
- exclusions
- known failure modes

The engine adapter decides how to express them.

Some engines may provide a dedicated negative-prompt field. Others may require natural-language constraints. Never expose a universal `negative_tokens` contract merely because one engine uses one.

## OpenAI GPT Image 2.5 route

When the target is OpenAI GPT Image 2.5, read `../../references/engines/openai-gpt-image-2.5.md` before selecting the model or parameters.

High-level route:

- speed/general everyday generation -> start with Flare
- demanding quality or precision editing/preservation -> Sunburst
- local edit -> use edit/inpainting-capable path when available, with explicit CHANGE/PRESERVE
- multi-turn workflow -> use a compatible conversational image workflow and repeat critical preserve constraints
- pixel-identical protected area -> external compositing rather than a prompt-only promise

Do not automatically select `max` quality. The quality level is a requirement/cost/latency decision and may be changed after visual evidence, not as a prestige label.

## Execution capability behavior

### `native-image-tool`

Map the packet to the host's actual image tool contract. Use only fields the host exposes.

### `api-capable-host`

Return/call the documented request shape with validated parameters. Do not invent credentials or hidden defaults.

### `text-only`

Return:

- engine/model recommendation if evidence supports one
- operation
- parameters
- ordered reference-role table
- compiled prompt
- QA requirements
- `execution_status: NOT_EXECUTED`

### `unknown`

Produce the portable packet and make tool-dependent fields conditional.

## Failure taxonomy

- `unsupported-engine-contract`: target engine facts cannot be verified
- `unsupported-parameter`: requested option is not in the current engine contract
- `reference-role-conflict`: two assets compete for the same role without precedence
- `operation-mismatch`: full generation selected for a bounded edit or vice versa
- `preservation-overpromise`: request expects pixel identity the model cannot promise
- `model-choice-mismatch`: task requirements do not fit selected model tradeoff
- `prompt-parameter-leak`: API controls were buried in prose instead of request fields
- `constraint-translation-error`: portable exclusions were mapped to syntax the engine does not support

Fix the contract or route. Do not hide these failures by adding prompt length.

## Invariants

- portable intent survives engine translation
- operation is explicit before compilation
- reference roles remain explicit
- structured engine parameters are separate from prompt prose
- model selection follows current vendor evidence
- exclusions are engine-specific in expression
- edit packets carry CHANGE and PRESERVE
- no execution or QA claim is made without host evidence

## Handoff packet

Return:

- target engine
- target model/snapshot when chosen
- operation
- structured request parameters
- ordered reference map
- compiled prompt
- change/preserve sets
- host execution requirement
- current limitations
- evidence state

## Completion criteria

Compilation is complete when the packet can be executed by the available host without guessing the user's visual priorities or the engine's request parameters. Execution itself is a separate evidence event.
