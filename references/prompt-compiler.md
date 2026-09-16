# Portable Prompt and Execution Compiler

Use this reference after scene direction is accepted. It defines the portable execution packet before any engine adapter applies vendor-specific syntax or request fields.

## 1. Keep four layers separate

### Photographic intent

What image should exist: person, moment, environment, framing, capture character, light, realism.

### Reference map

Which supplied asset contributes identity, wardrobe, prop, environment, composition, lighting, style, or background evidence.

### Request parameters

Structured engine controls such as model, quality, size, background, output format, compression, seed, or other supported fields.

### Prompt body

Natural-language instruction describing the visible result and change/preserve constraints.

Do not merge request parameters into prompt prose when the engine/host exposes real fields.

## 2. Portable execution packet

Use this logical shape where structured output helps:

```json
{
  "operation": "generate_new_scene",
  "engine": "openai-gpt-image",
  "model": "gpt-image-2.5-flare",
  "request_parameters": {
    "quality": "auto",
    "size": "auto",
    "background": "auto",
    "output_format": "png"
  },
  "references": [],
  "direction": {},
  "change": [],
  "preserve": [],
  "constraints": []
}
```

The exact fields sent to a host/API must match that host's current contract. This packet is the behavioral handoff, not a promise that every host accepts this exact JSON.

## 3. Reference-map rules

For each asset emit:

- stable asset identifier
- role(s)
- evidence to use
- details allowed to change
- strength/conflict note when relevant

Example:

```text
reference-1
role: identity
use: recognizable visible appearance, hair/facial hair, skin tone, age impression
may change: pose, crop, location, wardrobe unless separately protected

reference-2
role: wardrobe
use: dark green overshirt cut/material and white t-shirt layering
may change: pose and lighting to fit the target scene

reference-3
role: environment
use: ordinary local beach character and chair/umbrella density
may change: exact people and temporary objects
```

Do not make the environment image overwrite the identity evidence or vice versa.

## 4. Generation prompt order

Use this order to preserve priority:

1. result
2. references
3. subject
4. moment/action
5. environment
6. composition and subject scale
7. capture profile and camera cues
8. lighting
9. material/skin/fabric realism
10. constraints

Template:

```text
RESULT
Create a believable natural photograph of [subject/result].

REFERENCES
[asset-role mapping and visible evidence to use]

MOMENT
[one clear action]

ENVIRONMENT
[credible location and only story-bearing context]

COMPOSITION AND CAPTURE
[subject scale, camera relationship, distance, framing, capture profile, visible perspective/focus behavior]

LIGHT
[dominant source and plausible secondary fill/exposure character]

REALISM
Keep visible appearance consistent with the identity reference, natural skin/fabric/material texture, plausible anatomy/contact, coherent room/scene geometry, and normal small asymmetries appropriate to the capture profile.

CONSTRAINTS
[only relevant failures to avoid]
```

## 5. Edit prompt order

Edits always state what may change and what must remain stable.

```text
RESULT
Edit the supplied image rather than rebuilding unrelated content.

CHANGE
- [requested modification]

PRESERVE
- [visible identity/appearance]
- [expression]
- [body shape and pose]
- [crop/camera relationship]
- [lighting]
- [background/objects]
- [prior accepted edits]

REFERENCES
[any identity/wardrobe/environment references and their roles]

SUCCESS CONDITION
The requested change is clearly present while protected details remain stable as far as the engine supports.
```

Do not substitute `keep everything else the same` for an important preserve set.

## 6. Operation selection

### New-scene generation

Use when the pose/environment/composition may legitimately change to create a new moment.

### Whole-image edit

Use when the existing image is the base state but the requested change is broad enough to affect several regions.

### Local edit

Use when one bounded object/body part/garment/region should change and the host supports local editing.

### Mask-guided local edit

Use where a mask is available and the engine supports it. Treat the mask as guidance, not a guarantee of pixel-exact protection.

### Multi-reference

Use when different inputs intentionally supply different roles. Make the role map explicit in both the packet and prompt.

### Multi-turn edit

Restate critical preserve details each turn and include prior accepted edits in the preserve set.

### External composite

Use when the user requires literal pixel identity outside the approved edit and the host can composite the edited region back into the original.

## 7. Constraint translation

Portable constraints are semantic:

- no plastic skin
- no unexplained glow
- no unrelated object changes
- no generic stock-photo grin
- no fake portrait blur for a distant phone candid
- no readable text unless requested/supplied

Do not expose a universal `negative prompt` field. Each engine adapter translates constraints into the mechanism it actually supports.

## 8. Prompt compression

Prefer:

- nouns
- actions
- spatial relationships
- visible material/light behavior
- explicit change/preserve rules

Avoid:

- repeated `realistic/natural/photographic` synonyms
- long aesthetic adjective chains
- camera metadata that has no visible consequence
- irrelevant failure lists
- perfect symmetry
- flawless/airbrushed skin
- artificial micro-detail requests that conflict with subject distance

## 9. Series continuity

Lock only what the series is supposed to share:

- identity-role evidence
- grooming
- wardrobe when the same session implies it
- event/location continuity when applicable
- accepted color/light family when the sequence is one occasion

Vary deliberately:

- shot size
- camera side/height
- moment within the activity
- gaze
- foreground relationship
- environmental emphasis

Do not create the same pose with changed backgrounds.

## 10. Engine dispatch

### OpenAI GPT Image 2.5

Read `engines/openai-gpt-image-2.5.md` before choosing model/quality/size/background/format or edit behavior.

### Other engines

Use a current verified engine reference if one exists. If not, retain the portable packet and state that vendor-specific syntax requires current documentation. Do not resurrect remembered version flags as facts.

## 11. Text-only handoff

When image execution is unavailable, return:

- operation
- selected engine/model if justified
- structured request parameters
- reference-role map
- prompt body
- change/preserve sets
- visual QA requirements
- `execution_status: NOT_EXECUTED`
- `visual_qa_status: UNVERIFIED`

This is a complete compilation result, not a generated-image result.
