# QA and Revision

A good-looking image is not approved until it passes the photographic plausibility gates below.

## Hard gates

### 1. Identity fidelity

Pass only if:

- the face is recognizably the reference person
- proportions have not drifted into a different person
- skin tone and age impression remain credible
- hairstyle, facial hair, or head covering is consistent unless intentionally changed

Common failures:

- narrower or wider jaw than source
- changed eye spacing
- genericized nose or mouth
- beauty-retouching that erases identity

### 2. Anatomy and body mechanics

Pass only if:

- visible fingers and hands are anatomically plausible
- wrists, elbows, shoulders, and neck align naturally
- seated posture works with the chair and table
- feet and legs, when visible, carry weight realistically
- held objects have correct grip and contact

### 3. Camera plausibility

Pass only if:

- face and room geometry match the implied lens
- depth of field has a believable focus plane
- vertical and horizontal architectural lines are coherent
- scale and distance between people and objects make sense

### 4. Lighting consistency

Pass only if:

- face, hands, clothes, furniture, screens, and background agree on light direction
- shadows contact surfaces correctly
- reflections match nearby light sources
- skin highlights are not metallic or plastic

### 5. Context credibility

Pass only if:

- the viewer can understand what is happening
- major props support that moment
- branding is restrained and physically integrated
- background people behave like people in that place
- screens or signage do not contain distracting gibberish

### 6. Synthetic residue

Reject or revise if there is:

- plastic or waxy skin
- repeated faces in crowds
- cloned objects
- melted jewelry, glasses, pens, or buttons
- broken text pretending to be readable
- impossible reflections
- unexplained glow or rim light
- excessive HDR halos
- over-sharpened microtexture
- stock-photo smiles that do not fit the activity

## Soft quality checks

These are not automatic failures, but improve the result:

- expression has micro-variation rather than a frozen smile
- clothing has normal gravity and folds
- background includes small believable irregularities
- composition does not feel perfectly algorithmic
- image still reads at thumbnail size
- crop leaves useful space for the intended platform

## Revision policy

Prefer the smallest change that fixes the failure.

Use a revision request containing:

- `problem`
- `evidence`
- `change`
- `protected_regions`
- `success_check`

Example:

```json
{
  "problem": "The right hand has six visible fingers and the pen grip is impossible",
  "evidence": "The index and middle finger merge at the pen while an extra fingertip appears near the folder edge",
  "change": "Regenerate only the right hand and pen grip with a natural three-point pen hold",
  "protected_regions": ["face", "left hand", "clothing", "screen", "room geometry", "crop"],
  "success_check": "Five anatomically plausible fingers, realistic pen contact, unchanged identity and composition"
}
```

Regenerate the full frame only when the failure is global, such as wrong lens geometry, identity drift across the entire face, or lighting that cannot be corrected locally.

## Final verdict

Return exactly one internal verdict before delivery:

- `APPROVE`
- `REVISE`
- `REJECT`

Do not call a result approved while a hard gate is unresolved.
