---
name: lively-photos-director
description: "Use when directing or editing believable real-world photographs from one or more real-person reference photos, including natural corporate, editorial, event, professional, and everyday scenes, consistent photo series, and realism repair. Classify the operation, reference roles, scene, capture profile, subject scale, execution capability, and downstream specialist route. Do NOT use for illustration, fantasy, surreal composites, text-led graphic design, or requests where a photographic result is not the primary job."
---

# Lively Photos Director: Canonical Orchestrator

Turn a casual image request plus reference assets into one explicit photographic direction and execution route.

North star: preserve recognizable visible appearance while making the requested result feel like a plausible photograph from a believable moment.

## Map of content

Use progressive resources rather than copying their detail here:

- `../../references/direction-rules.md` for scene/capture/reference decisions
- `../../references/prompt-compiler.md` for portable execution packets
- `../../references/engines/openai-gpt-image-2.5.md` when the target is OpenAI GPT Image 2.5
- `../../references/qa.md` after an actual image exists or a revision must be diagnosed
- `../../references/examples.md` for worked examples
- `../../prompts/AWESOME_PROMPTS.md` when the user asks for scene ideas

Neighboring Skills:

- `photo-scene-director` owns the photographic moment, camera cues, light, body language, and environmental credibility
- `engine-prompt-compiler` owns engine/model selection, request parameters, reference mapping, and engine-specific compilation
- `photo-qa-reviewer` owns image-evidence review and the repair strategy
- `host-workspace-operator` owns host-native asset/file operations when the host exposes them

## 1. Classify the request

Classify only fields that alter behavior.

### Operation

Choose one:

- `generate_new_scene`: create a new photograph using references as evidence
- `edit_existing_image`: preserve the current image while changing requested content
- `repair_generated_image`: fix observed defects in a produced image
- `create_series`: direct multiple images with explicit continuity and variation
- `audit_only`: inspect a produced image without generating a replacement
- `compile_only`: translate an accepted direction into an engine-ready packet

### Reference strength

- `strong`: clear, usable view of the stable visible appearance needed for the task
- `usable`: enough evidence for a reasonable preservation attempt, but not complete
- `weak`: tiny, blurred, filtered, occluded, or extreme-angle evidence
- `conflicting`: references disagree about a trait that the requested result depends on
- `multiple-role`: several images intentionally supply different kinds of evidence

Do not equate a named person with visual verification. Do not perform face recognition.

### Reference roles

Assign every image a role before engine compilation:

- `identity`
- `wardrobe`
- `product_or_prop`
- `environment`
- `composition`
- `lighting`
- `style`
- `background`

One asset may carry multiple roles when the user intends that. If references conflict, preserve the explicitly assigned role boundaries instead of blending them by default.

### Scene mode

Choose one primary mode:

- `documentary-corporate`
- `candid-professional`
- `editorial-natural`
- `everyday-lifestyle`
- `event-documentary`

### Capture profile

Choose how the moment should feel photographed:

- `phone-candid`: casual observer, ordinary exposure, modest sharpness, imperfect framing where credible
- `documentary-camera`: observer-led professional coverage with context and restrained polish
- `editorial-camera`: deliberate composition, controlled natural light, stronger visual authorship
- `controlled-professional`: planned professional photo with clean execution but without synthetic glamour

Scene and capture profile are independent. A conference image may be `event-documentary + phone-candid`; a cafe founder profile may be `everyday-lifestyle + editorial-camera`.

### Subject scale

Choose one:

- `close-portrait`
- `medium`
- `three-quarter`
- `full-body`
- `environmental`
- `distant-candid`

Distance instructions override aesthetic habits. If the user says the subject is 12 meters away, do not silently convert it into a medium portrait.

### Execution capability

Classify the current host:

- `native-image-tool`
- `api-capable-host`
- `text-only`
- `unknown`

This controls whether the workflow may execute, may emit request parameters, or must return text-only instructions.

## 2. Build the reference contract

For every reference record:

- asset identifier or host reference
- role(s)
- strength
- facts to preserve from that role
- facts that may change

For identity-role assets, preserve recognizable visible facial structure, skin tone, age impression, hair or head covering, facial hair, and stable visible traits supported by the source. Do not invent hidden details from weak evidence.

For multi-reference requests, make roles explicit before scene direction. Example:

- image 1: identity
- image 2: wardrobe
- image 3: environment

The person comes from image 1, clothing guidance from image 2, and location guidance from image 3. No asset silently takes over another role.

## 3. Route the operation

| Operation | Route | Completion evidence |
| --- | --- | --- |
| `generate_new_scene` | scene director -> engine compiler -> host execution when available -> QA | image evidence for visual approval, otherwise execution packet only |
| `edit_existing_image` | define CHANGE/PRESERVE -> engine compiler -> bounded edit when available -> QA drift checks | requested change plus preserve-set comparison |
| `repair_generated_image` | QA failure classification -> smallest repair -> engine compiler if needed -> QA | observed defect removed without new material drift |
| `create_series` | continuity contract -> scene variants -> engine compiler per shot -> QA per accepted output | identity/wardrobe continuity plus deliberate shot variation |
| `audit_only` | photo QA reviewer | actual image observations; never prompt-only approval |
| `compile_only` | engine prompt compiler | complete portable/engine packet, no generation claim |

## 4. Direct the photographic moment

Delegate scene decisions to `photo-scene-director` with:

- intended use
- scene mode
- capture profile
- subject scale/distance
- subject count
- action
- environment
- available or requested light character
- background importance
- movement
- hands/object interaction
- must-include and must-avoid constraints

Camera vocabulary is visual guidance. Ask for a `50mm-style natural perspective` or `moderate documentary depth` when useful; do not claim the generator numerically simulates a lens, shutter, or sensor.

Ordinary environments must stay ordinary when requested. Do not replace a local cafe, beach, street, home, office, or venue with a luxury or cinematic setting merely to make the image look polished.

## 5. Compile for the actual engine

Delegate to `engine-prompt-compiler` with the accepted direction packet.

For OpenAI GPT Image 2.5, the compiler must consult `../../references/engines/openai-gpt-image-2.5.md` and keep these separate:

- model choice
- operation
- quality
- size
- background
- output format/compression
- ordered references and roles
- prompt body
- change set
- preserve set

Do not force the user to understand Flare vs Sunburst unless they explicitly want model control. Choose from current requirements and explain only when the choice matters.

## 6. Edit with an explicit preservation boundary

For any edit, create two lists before execution:

`CHANGE`: only the requested modifications

`PRESERVE`: identity, expression, pose, body shape, crop, camera relationship, light, background, objects, prior accepted edits, or other details that must remain stable

Use the smallest available operation. A malformed hand does not justify replacing the whole scene when a bounded edit is available.

A mask is guidance, not a promise of exact unchanged pixels. When the user requires literal pixel identity outside a region, route toward host-side compositing of the approved edited region when that capability exists.

For multi-turn edits, restate critical preservation constraints on each turn and verify previously accepted changes after the new output.

## 7. Review only from image evidence

After an image is produced, `photo-qa-reviewer` checks the six base gates:

1. likeness
2. anatomy/body mechanics
3. camera/perspective plausibility
4. lighting consistency
5. context credibility
6. synthetic residue

Conditional gates apply to edit drift, transparency, requested text, and multi-turn continuity.

If the image cannot be inspected, return `UNVERIFIED` for visual QA. Never infer a PASS from a well-written prompt.

## Failure classes

Use the failure class to choose a remedy:

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

Do not respond to every failure by making the prompt longer.

## Invariants

- reference roles remain explicit from ingest through compilation
- identity-role evidence is visible-appearance evidence, not biometric identification
- scene mode does not silently determine capture profile
- subject distance/scale is not sacrificed for a prettier portrait
- request parameters remain separate from prompt prose where the engine supports them
- engine-specific exclusions are not represented as one universal negative-prompt mechanism
- a generation/edit/QA claim requires actual host evidence
- visual approval requires image evidence
- previously accepted regions are protected during bounded revisions as far as the engine/host can support

## Invalid shortcuts

| Temptation | Binding rule |
| --- | --- |
| Make a casual photo more cinematic to make it better | Follow requested capture profile and environment credibility |
| Treat every uploaded image as generic style inspiration | Assign explicit reference roles |
| Add exact aperture/shutter values to sound photographic | Use only visible camera cues that affect the desired result |
| Select `max` quality by default | Choose quality from requirements/evidence; higher is not automatically the right choice |
| Keep saying `same as before` in a long edit chain | Restate the critical preserve set |
| Approve from the prompt because the result is not visible | Return `UNVERIFIED` |
| Repair a local artifact with a full rerender | Use the smallest supported repair first |

## Handoff packet

When another specialist/host owns the next step, pass:

- operation
- scene mode
- capture profile
- subject scale
- reference assets and roles
- reference strength/conflicts
- accepted moment/environment/composition/light
- change and preserve sets
- engine/model decision if already made
- execution capability
- evidence available
- unresolved risk

## Completion criteria

The orchestrator is complete when:

- request classifications materially determine the route
- each reference has an explicit role when multiple images exist
- scene and capture profile are coherent with the user's wording
- the engine packet separates parameters from prose
- edits have explicit CHANGE/PRESERVE boundaries
- unsupported execution is labeled rather than simulated
- any produced image is routed through evidence-based QA before approval
