# QA and Revision

A produced image is not approved until the applicable evidence gates are inspected. Prompt quality and successful generation are not substitutes for visual evidence.

## 1. Evidence state

Use one of:

- `IMAGE_AVAILABLE`: produced result is inspectable
- `COMPARISON_AVAILABLE`: source/prior accepted image is available where comparison is required
- `PARTIAL_EVIDENCE`: result exists but required comparison/alpha/original asset is missing
- `NO_IMAGE_EVIDENCE`: no produced image is available

If `NO_IMAGE_EVIDENCE`, visual verdict is `UNVERIFIED`.

Do not invent observations.

## 2. Six hard photographic gates

### Likeness

Inspect recognizable visible continuity against the identity-role reference, within the limits of source/output scale.

Check:

- overall facial proportions/appearance
- skin tone and age impression
- hair/head covering/facial hair when meant to remain stable
- absence of generic beautification drift

If the source is weak or the result is too distant for reliable comparison, mark the gate `UNVERIFIED` or note limited confidence rather than overclaiming.

### Anatomy and body mechanics

Inspect what is actually visible:

- fingers/hands/wrists
- eyes/teeth/ears at appropriate scale
- elbows/shoulders/neck
- legs/feet/weight bearing
- object contact/grip
- clothing-body intersections

Do not demand close-up hand detail from a distant candid.

### Camera and perspective plausibility

Inspect:

- subject scale vs requested distance
- facial/room perspective
- focus-plane behavior
- background separation
- architecture lines and object scale
- camera height/angle
- motion behavior

Judge visible plausibility, not whether a numeric camera setting can be proven.

### Lighting consistency

Inspect:

- dominant source direction
- face/hand/clothing highlights
- cast/contact shadows
- reflection logic
- screen/practical-light contribution
- background exposure relationship

### Context credibility

Inspect:

- whether the moment is understandable
- whether major objects support it
- crowd/background behavior
- requested formality/location character
- credible readable signage/text when it is meant to be read
- whether ordinary settings remained ordinary when requested

### Synthetic residue

Reject/revise for material artifacts such as:

- plastic/waxy skin
- cloned faces/objects
- fused/melted accessories
- broken intended text
- impossible reflections
- cutout edges/halos
- unexplained cinematic glow
- excessive HDR or micro-sharpening
- task-inappropriate stock smiles

## 3. Conditional gates

### Edit integrity

Requires source/prior accepted image comparison.

Check:

1. requested change occurred
2. preserve set remained stable
3. no unrelated region drift appeared

If the original is unavailable, do not claim the preserve gate passed.

### Transparency

Only when transparent output was requested and the alpha-capable output is inspectable.

Check edge completeness, hair/fabric transitions, matte/halo, accidental holes, and clipped regions.

A flattened JPEG/screenshot cannot prove alpha quality.

### Requested text

Only when exact readable text was part of the job.

Check spelling, completeness, legibility, and placement against supplied copy.

### Multi-turn continuity

Compare with the last accepted result. Verify prior accepted edits survived unless intentionally replaced.

### Series continuity

Across an intended set, inspect only continuity constraints that are meant to persist: visible appearance, grooming, wardrobe, location/event cues, and color/light family as applicable.

## 4. Capture-profile tolerance

QA must not erase the requested photographic character.

`phone-candid` may legitimately contain slight off-centering, ordinary clutter, modest exposure imbalance, normal smartphone depth, and reduced subject detail at distance.

`documentary-camera` may retain context and practical venue light rather than polished portrait separation.

`editorial-camera` and `controlled-professional` can require tighter framing/light control while still rejecting synthetic polish.

Do not label intentional ordinary imperfection as a defect merely because a cleaner commercial image is possible.

## 5. Failure taxonomy

Classify before choosing a remedy.

### `prompt_ambiguity`

Signal: output follows one reasonable interpretation but not the intended one.

Action: clarify the specific instruction; do not change engine/quality first.

### `reference_weakness`

Signal: source evidence does not contain enough visible information for the requested preservation.

Action: use conservative direction or stronger reference if fidelity is essential.

### `wrong_model_choice`

Signal: task requires a documented capability/precision level not suited to the selected path, or repeated evidence shows a model mismatch.

Action: route to the more appropriate documented model.

### `insufficient_quality_setting`

Signal: direction/reference/model are sound but rendering detail/quality remains below requirement.

Action: evaluate a higher supported quality level. Do not diagnose this from prompt text alone.

### `composition_problem`

Signal: subject scale, frame balance, perspective, or context relationship is wrong.

Action: revise scene/framing direction.

### `likeness_drift`

Signal: identity-role reference comparison shows material visible appearance drift.

Action: strengthen reference/preserve instruction and use an edit/model path suited to preservation difficulty.

### `anatomical_defect`

Signal: visible body mechanics are implausible.

Action: local edit when bounded; broader edit only when failure spans the pose/body.

### `lighting_inconsistency`

Signal: sources/shadows/reflections cannot coexist.

Action: local edit for bounded light artifact or broader rerender/edit for scene-wide contradiction.

### `context_defect`

Signal: wrong/unjustified props, text, crowd behavior, location character.

Action: remove/replace only the offending context when possible.

### `local_artifact`

Signal: bounded unwanted object/texture/edge defect.

Action: local or mask-guided edit.

### `multi_turn_drift`

Signal: a new edit changed a previously accepted protected detail.

Action: restate preserve set, use prior accepted image/reference, and repair only the drift.

### `engine_limitation`

Signal: requested property cannot be guaranteed by prompt/model alone, such as literal unchanged pixels.

Action: report the limit and use a host-side compositing/tool step when available.

## 6. Remedy ladder

Try the narrowest justified path:

1. instruction clarification
2. local edit
3. mask-guided local edit
4. whole-image edit
5. scene/prompt redesign
6. model reroute
7. quality adjustment
8. external compositing
9. full regeneration

Skip upward only when the narrower operation cannot solve the observed failure.

## 7. Revision packet

Use the current revision schema where structured output helps:

```json
{
  "failure_class": "anatomical_defect",
  "problem": "Right hand has an extra fingertip near the cup handle",
  "evidence": "Six visible fingertips are present while the wrist/forearm are otherwise correct",
  "change": "Repair only the right hand and cup grip",
  "change_set": ["right hand", "cup grip"],
  "preserve_set": ["face", "expression", "body pose", "clothing", "crop", "lighting", "background"],
  "protected_regions": ["face", "torso", "left arm", "background"],
  "target_region": "right hand and cup handle",
  "recommended_remedy": "local_edit",
  "success_check": "Five plausible fingers and natural grip with all protected details visually stable"
}
```

## 8. Verdict

Use:

- `APPROVE`: all applicable hard/conditional gates PASS
- `REVISE`: observed repairable failure
- `REJECT`: result is globally/materially wrong enough that local repair is not sensible
- `UNVERIFIED`: evidence required for material gates is absent

A mixed result with any hard gate FAIL cannot be `APPROVE`.

## 9. QA report

```text
Evidence state: <state>

Gate 1 likeness: PASS | FAIL | UNVERIFIED - observation
Gate 2 anatomy: PASS | FAIL | UNVERIFIED - observation
Gate 3 perspective: PASS | FAIL | UNVERIFIED - observation
Gate 4 lighting: PASS | FAIL | UNVERIFIED - observation
Gate 5 context: PASS | FAIL | UNVERIFIED - observation
Gate 6 synthetic residue: PASS | FAIL | UNVERIFIED - observation
Conditional gates: <only applicable gates>

Overall verdict: APPROVE | REVISE | REJECT | UNVERIFIED
Failure class: <class or none>
Next action: <smallest justified remedy>
```

## 10. Anti-rationalization rules

- successful tool call is not visual QA
- good prompt is not visual QA
- high/max quality is not evidence that defects are absent
- local failure does not justify full rerender when edit is available
- mask is not a pixel-exact guarantee
- distant/casual character should not be "fixed" into editorial polish
- prior accepted changes must not disappear silently in multi-turn work
