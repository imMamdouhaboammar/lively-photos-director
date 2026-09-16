# OpenAI GPT Image 2.5 engine contract

Last verified against first-party OpenAI documentation: 2026-09-16

Use this reference only when the selected engine family is OpenAI GPT Image. Re-check current OpenAI documentation before changing aliases, snapshots, endpoint limits, pricing-dependent policy, or request parameters.

Primary sources:

- https://developers.openai.com/api/docs/models/gpt-image-2.5-flare
- https://developers.openai.com/api/docs/models/gpt-image-2.5-sunburst
- https://developers.openai.com/api/docs/guides/image-generation
- https://developers.openai.com/api/docs/guides/image-prompting
- https://developers.openai.com/api/reference/resources/images/methods/generate
- https://developers.openai.com/api/reference/resources/images/methods/edit

## Engine family

Treat these as model choices inside one engine family:

| Model | Current role | Default snapshot |
| --- | --- | --- |
| `gpt-image-2.5-flare` | fastest high-quality everyday generation; start here when speed is the priority | `gpt-image-2.5-flare-2026-09-08` |
| `gpt-image-2.5-sunburst` | more capable generation/editing; use when demanding quality or editing precision matters most | `gpt-image-2.5-sunburst-2026-09-08` |

Use aliases for normal current behavior. Use a dated snapshot only when reproducibility across an eval or controlled workflow matters.

Do not present Sunburst as "better" for every request. A fast everyday generation that already meets requirements does not benefit from model escalation merely because a larger model exists.

## Model-selection decision

Start with Flare when:

- speed/iteration matters
- task is ordinary photorealistic generation
- reference preservation is not unusually difficult
- edit precision is not the dominant requirement

Prefer Sunburst when:

- editing precision is central
- the request has demanding quality requirements
- several rounds of preservation-sensitive edits must stay coherent
- a difficult reference/composition task has evidence of failure on the faster path

If the user explicitly selects a model, honor that choice unless it conflicts with a documented capability or host limitation.

## Operations and API shape

### Image API

Use direct model selection with one of the two 2.5 aliases/snapshots.

- generations: create a new image from a prompt and optional reference behavior supported by the endpoint/host
- edits: modify supplied image input(s), partially or broadly

Use Image API for a bounded one-request generation/edit workflow when conversation state is unnecessary.

### Responses API image generation tool

Use a supported mainline top-level model and set the image-generation tool's model to Flare or Sunburst.

Use this path when the host needs conversational/multi-turn image work or File IDs as image inputs.

Do not assume every ChatGPT/Codex host exposes the raw API fields described here. Map only fields actually available in the current host.

## Supported quality values

Current GPT Image 2.5 values:

- `auto` default
- `low`
- `medium`
- `high`
- `xhigh`
- `max`

Selection policy:

- keep `auto` when the user has no quality/latency requirement and no failure evidence suggests changing it
- choose an explicit level when cost/latency/repeatability or visual requirements justify it
- do not select `max` as a prestige/default setting
- after a visual failure, distinguish prompt/reference/model problems from actual rendering-quality shortfall before changing this field

## Size

Use `auto` unless the output destination or composition requires a specific size.

Common current sizes include:

- `1024x1024`
- `1536x1024`
- `1024x1536`
- `2048x2048`
- `2048x1152`
- `3840x2160`
- `2160x3840`

Current custom-resolution constraints documented by OpenAI include:

- width and height divisible by 16
- aspect ratio between 1:3 and 3:1
- maximum edge 3840 px
- total pixels at least 655,360
- total pixels no more than 8,294,400

The API reference currently describes resolutions above 2560x1440 as experimental. Treat that as a current vendor warning, not a timeless repository invariant.

Validation pseudocode:

```text
if size == auto: valid
else parse WIDTHxHEIGHT
require width % 16 == 0 and height % 16 == 0
require max(width, height) <= 3840
require max(width, height) / min(width, height) <= 3
require 655360 <= width * height <= 8294400
```

Do not silently round an invalid user-requested size. Report the constraint and choose a nearby supported size only when the user delegated that decision.

## Background, format, and compression

Current background values:

- `auto`
- `opaque`
- `transparent`

Current image output formats:

- `png`
- `jpeg`
- `webp`

Rules:

- transparent output requires a transparency-supporting format: PNG or WebP
- JPEG cannot carry transparent output
- output compression is meaningful for supported WebP/JPEG output and is not a PNG quality control
- keep output format separate from prompt prose

When transparency is requested, QA should inspect alpha edges only when the actual alpha-capable asset is available, not from a flattened screenshot.

## Image inputs and references

GPT Image 2.5 accepts text and image input. Current GPT Image edit endpoint documentation supports multiple image inputs and documents up to 16 supported input images under the endpoint's file constraints.

Because endpoint limits can change, keep the exact count here rather than in the master Skill and re-check it before building API code around the limit.

Map every image by role before compilation:

```text
reference_1: identity
reference_2: wardrobe
reference_3: environment
reference_4: composition
```

Prompt language should say what each asset contributes. Do not rely on upload order alone.

For visible-person preservation, describe only supported visible appearance. Do not ask the model or agent to identify the person or derive biometric templates.

## Generation prompt structure

Use this order:

```text
RESULT
[one sentence defining the wanted photograph]

REFERENCES
[asset roles and visible traits/context to use]

SUBJECT AND MOMENT
[action, expression, body language]

ENVIRONMENT
[credible location and only story-bearing context]

COMPOSITION AND CAPTURE
[subject scale, distance, camera relationship, capture profile, visible perspective/focus cues]

LIGHT
[dominant source and credible secondary fill]

MATERIAL REALISM
[skin, hair, fabric, props, geometry, reflections]

CONSTRAINTS
[only the relevant unwanted outcomes]
```

Do not write SDXL-style comma dumps or a fake `negative_prompt` field unless the actual host API adds such a contract. GPT Image exclusions belong in clear natural-language constraints.

## Edit prompt structure

For editing, separate requested changes from protected details:

```text
RESULT
Edit the supplied image. Do not rebuild unrelated parts.

CHANGE
- replace the shirt with a dark navy overshirt

PRESERVE
- recognizable visible appearance
- expression
- body shape and pose
- crop and camera relationship
- lighting direction
- background geometry and existing objects
- previously accepted edits

REFERENCES
- reference_1: identity
- reference_2: wardrobe

SUCCESS CONDITION
The shirt changes while protected details remain stable as far as the model supports.
```

Specific change/preserve language is stronger than a vague `keep everything the same` instruction.

## Local and masked edits

Both 2.5 model pages list inpainting support.

Use local/masked editing when the defect is bounded and the host exposes the capability.

OpenAI documents mask behavior as guidance rather than a guarantee of an exact pixel boundary. Therefore:

- do not promise untouched pixels from a mask alone
- keep the preserve set explicit
- visually compare protected regions after the edit
- if exact unchanged pixels are required, composite the approved edit into the original with a host-side image operation when available

When multiple images and a mask are supplied, follow the current endpoint contract for which input receives the mask rather than guessing from memory.

## Multi-turn editing

Responses API supports iterative image editing workflows.

For each turn:

1. name the new CHANGE
2. restate critical PRESERVE constraints
3. preserve prior accepted edits unless explicitly replaced
4. inspect the returned image for drift before continuing

Do not rely only on `same as before`, especially for likeness, crop, environment, or previously approved details.

## Camera language

Use camera language as visible direction:

- subject distance/scale
- eye-level vs high/low angle
- environmental vs tight perspective
- moderate vs shallow context separation
- smartphone-like normal depth
- documentary vs editorial framing

Do not promise that specifying `50mm`, `f/2.8`, shutter, ISO, or a named camera causes exact physical simulation. Numeric camera terms may be included as creative cues when they communicate a visible target, not as measured execution parameters.

## Request packet example

```json
{
  "engine": "openai-gpt-image",
  "model": "gpt-image-2.5-sunburst",
  "operation": "local_edit",
  "quality": "high",
  "size": "auto",
  "background": "auto",
  "output_format": "png",
  "references": [
    {"asset": "source-image", "roles": ["identity", "composition", "lighting"]},
    {"asset": "wardrobe-reference", "roles": ["wardrobe"]}
  ],
  "change": ["replace only the shirt"],
  "preserve": ["visible appearance", "expression", "pose", "crop", "lighting", "background"]
}
```

This is a logical execution packet. The exact host/API serialization must match the current SDK/tool contract.

## Failure and escalation rules

- poor composition -> fix direction/prompt before model escalation
- ambiguous edit -> make CHANGE/PRESERVE explicit
- reference conflict -> resolve role precedence
- local artifact -> local edit before whole-image rerender
- difficult preservation/precision edit -> consider Sunburst
- quality shortfall with otherwise correct direction -> evaluate a higher quality setting
- repeated edit drift -> restate preservation and compare to prior accepted image
- exact pixel preservation -> external compositing
- unsupported host field -> omit/report it; never pretend it was applied

## Evidence boundary

A compiled packet proves only that the request was translated.

An API/tool success proves only that an image was produced.

Only inspection of the actual output can prove visual QA gates.

If API access or an image-generation tool is unavailable, return `NOT_EXECUTED` and never present model behavior as benchmarked in the current run.
