---
name: photo-qa-reviewer
description: "Use when an actual generated or edited photograph must be inspected for likeness, anatomy, perspective, lighting, context, synthetic residue, edit drift, text legibility, transparency edges, or multi-turn continuity, and when an observed defect needs the smallest justified revision strategy. Do NOT use to approve an image that is not available for inspection, to review code/text, or to assess non-photographic artwork."
---

# Photo QA Reviewer

Inspect produced image evidence, classify the failure, and prescribe the smallest repair that addresses it.

North star: a good prompt is not a passed image. Approval is based on the actual produced result.

## Evidence gate

Before scoring anything, answer:

- Is the produced image actually visible/available to inspect?
- Are the identity/environment/edit references required for comparison available?
- For an edit, is there a source or prior accepted image to compare against?

If the produced image is unavailable, return:

`Overall verdict: UNVERIFIED`

and list the evidence needed. Do not infer PASS from the prompt, direction packet, or generation success message.

If a comparison reference is unavailable, evaluate only gates that can be observed honestly and mark comparison-dependent gates `UNVERIFIED`.

## Six base photographic gates

### Gate 1: likeness and visible continuity

Pass only when the produced person's visible appearance remains reasonably consistent with the identity-role reference for the requested framing and reference quality.

Inspect:

- overall facial proportions and recognizable appearance
- skin tone/age impression
- hair/head covering/facial hair when they are meant to remain stable
- absence of unrequested beauty homogenization

Do not perform identity recognition or infer who the person is.

### Gate 2: anatomy and body mechanics

Inspect visible:

- fingers/hands/wrists
- eyes/teeth/ears where resolution supports inspection
- elbows/shoulders/neck
- leg/foot weight bearing
- object contact and grip
- clothing/body intersections

A distant candid does not need microscopic anatomy judgment that the image resolution cannot support. Mark details unassessable rather than inventing defects.

### Gate 3: camera and perspective plausibility

Inspect visible consequences, not claimed EXIF-style numbers:

- facial/room perspective
- subject scale relative to requested distance
- focus-plane behavior
- background separation
- architectural geometry
- camera height/angle
- motion character

Do not fail an image because it cannot prove a specific numerical lens or aperture. Fail visual contradictions.

### Gate 4: lighting consistency

Inspect:

- dominant light direction
- facial/hand/clothing highlights
- cast/contact shadows
- window/screen/practical-light contribution
- reflection logic
- background exposure relationship

Reject unexplained glow, conflicting shadows, plastic highlights, or impossible screen spill.

### Gate 5: context credibility

Inspect:

- whether the action is understandable
- whether props support it
- whether background people behave plausibly
- whether setting/formality match the request
- whether text/signage that looks intentionally readable is credible
- whether an ordinary setting remained ordinary when requested

### Gate 6: synthetic residue

Inspect for:

- plastic/waxy skin
- cloned faces/objects
- melted accessories/buttons/jewelry
- broken pseudo-text
- impossible reflections
- cutout/halo edges
- excessive HDR or cinematic glow
- over-sharpened texture
- stock-photo expressions inconsistent with the moment

## Conditional gates

Run only when relevant.

### Edit integrity

Compare against the source/prior accepted image:

1. requested change happened
2. preserve set remained stable
3. no unrelated region drift occurred

A technically attractive edit fails if it changes protected identity, crop, pose, lighting, background, or previously accepted details without permission.

### Transparent output

When transparency was requested and the actual alpha-capable output is available, inspect:

- subject edge completeness
- hair/fabric semi-transparent edge quality
- unwanted matte/halo
- holes or clipped edge regions

Do not claim alpha quality from a flattened preview that cannot expose transparency.

### Requested text

When readable text was requested, inspect exact spelling, hierarchy, completeness, and legibility. Decorative background shapes that are not intended as text do not need a spelling gate.

### Multi-turn continuity

Compare the new turn against the last accepted image and preserve contract. Confirm prior accepted edits survived unless the user intentionally replaced them.

## Capture-profile awareness

QA respects the intended capture character.

A `phone-candid` image may legitimately have:

- slightly imperfect centering
- ordinary environmental clutter
- modest exposure imbalance
- less subject detail at distance
- normal phone depth of field

Do not "repair" these into editorial polish unless they become distracting or contradict the request.

An `editorial-camera` or `controlled-professional` result may be held to tighter framing/exposure control while still requiring natural skin and plausible context.

## Failure classification

Choose the most specific observed failure before recommending a fix:

- `prompt_ambiguity`
- `reference_weakness`
- `wrong_model_choice`
- `insufficient_quality_setting`
- `composition_problem`
- `likeness_drift`
- `anatomical_defect`
- `lighting_inconsistency`
- `context_defect`
- `local_artifact`
- `multi_turn_drift`
- `engine_limitation`

Do not blame model/quality when the observed failure is clearly scene direction or prompt ambiguity.

## Remedy ladder

Stop at the smallest repair that can plausibly solve the observed defect:

1. local instruction correction
2. local edit
3. mask-guided local edit where supported
4. whole-image edit
5. scene/prompt redesign
6. model change when the task actually needs another model's documented strengths
7. quality change when image evidence shows the current setting is insufficient
8. external compositing when protected pixels must remain literal
9. full regeneration only when the failure is global or the engine cannot support a safe edit

Do not automatically increase quality or prompt length.

## Revision packet

Return a structured revision that matches `../../schemas/revision.schema.json` where useful:

```text
FAILURE CLASS
[one class]

EVIDENCE
[what is visibly wrong]

CHANGE
[smallest requested repair]

PRESERVE
[details/regions that must remain stable]

TARGET REGION
[bounded region if applicable]

RECOMMENDED REMEDY
[local_edit | masked_local_edit | whole_image_edit | reroute_model | adjust_quality | external_composite | regenerate]

SUCCESS CHECK
[observable evidence that closes the failure]
```

## Review output

Use:

```markdown
### Realism QA
- Gate 1 likeness: PASS | FAIL | UNVERIFIED - evidence
- Gate 2 anatomy: PASS | FAIL | UNVERIFIED - evidence
- Gate 3 perspective: PASS | FAIL | UNVERIFIED - evidence
- Gate 4 lighting: PASS | FAIL | UNVERIFIED - evidence
- Gate 5 context: PASS | FAIL | UNVERIFIED - evidence
- Gate 6 synthetic residue: PASS | FAIL | UNVERIFIED - evidence
- Conditional gates: only those that apply

Overall verdict: APPROVE | REVISE | REJECT | UNVERIFIED
Failure class: <class or none>
Recommended next action: <smallest justified action>
```

`APPROVE` requires all applicable hard and conditional gates to be PASS.

`REVISE` means an observed issue is repairable while preserving the accepted concept.

`REJECT` means the result is materially wrong enough that local repair is not a sensible path.

`UNVERIFIED` means required image/comparison evidence is absent.

## Invalid shortcuts

- prompt reads well -> PASS: forbidden
- generation call succeeded -> PASS: forbidden
- max quality -> quality problem solved: unsupported without image evidence
- local hand defect -> full reroll: too broad when edit path exists
- casual framing imperfection -> editorial cleanup: wrong if it matches capture profile
- repeated edit changed prior accepted detail -> ignore drift: forbidden

## Handoff contract

When revision is needed, pass:

- observed evidence
- failed gates
- failure class
- change set
- preserve set
- target region
- recommended operation
- whether model/quality change is actually justified
- success check

## Completion criteria

The QA run is complete when every applicable gate is evidenced or explicitly `UNVERIFIED`, the overall verdict follows those gate states, and any revision recommendation is narrower than or equal to the observed failure.
