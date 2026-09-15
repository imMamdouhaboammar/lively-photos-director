---
name: identity-face-lock
description: "Use when analyzing reference photos of real people, extracting immutable facial landmarks, preserving authentic skin texture and micro-features, and preventing AI beautification, plastic skin, or identity drift. Do NOT use when generating purely imaginary characters, illustrations, stylized avatars, or requests where real-person identity preservation is not required."
---

# Identity Face Lock: Identity Preservation & Facial Anchor Specialist

Specialized agentic skill dedicated to locking, maintaining, and repairing the recognizable identity of a real person across generated photographs.

North star: the person in the final photo must look unmistakably like the real individual provided in the reference, with authentic physical human details.

## Core Identity Anchor Matrix

When ingesting a reference photo, isolate and record these immutable biometric anchors:

1. **Cranial & Facial Bone Structure**:
   - Cranial shape, forehead slope, brow ridge prominence.
   - Cheekbone height, zygomatic width, and jawline contour (angular, square, oval, soft).
   - Chin projection, cleft presence, and jaw-to-neck transition.

2. **Ocular Geometry & Gaze**:
   - Eye shape (almond, hooded, round, monolid, deep-set).
   - Inter-pupillary distance ratio relative to facial width.
   - Iris coloration, limbal ring definition, and natural tear trough depth.
   - Natural eyelid folds and asymmetry between left and right eyes.

3. **Nasal & Perioral Architecture**:
   - Nasal bridge profile (straight, convex, concave, aquiline), tip shape, and nostril flare.
   - Philtrum depth and distance from nose base to upper lip vermilion.
   - Lip fullness ratio (upper vs. lower), cupid's bow definition, and natural resting lip line.

4. **Micro-Features & Unique Identifiers**:
   - Freckles, moles, birthmarks, and permanent skin characteristics.
   - Natural smile lines, forehead furrows, and age-consistent crows feet.
   - Authentic hair texture, natural hairline recision or widow's peak, eyebrow thickness and arch.

## Anti-Drift & Anti-Plastic Guidelines

### 1. Reject Porcelain & Airbrushed Skin
- Always explicitly request natural skin grain, micro-texture, subtle pores, and realistic sebum reflection.
- Forbid "smooth skin", "perfect porcelain complexion", "hyper-detailed digital doll", or beauty filter diffusion.

### 2. Guard Age & Ethnicity Consistency
- Maintain the apparent chronological age of the subject. Never de-age a 45-year-old executive into a 25-year-old model unless explicitly instructed.
- Strictly preserve natural ethnic heritage, skin undertones (warm olive, cool rosy, neutral golden, deep melanin), and cultural markers.

### 3. Weak Reference Compensation
When the input reference is low-resolution, taken at an extreme angle, or poorly lit:
- Anchor firmly on the visible structural landmarks (silhouette, eye spacing, nose profile).
- Fill in environmental context conservatively without inventing dramatic new features.
- Note any uncertainty in the brief and avoid committing to unverified details.

## Surgical Delta Facial Inpainting Prompt Template

When an image exhibits facial drift or uncanny plastic textures, generate an inpainting delta prompt:

```text
[TARGET: Bounded Face Region]
Preserve exact bone structure, jawline, and eye distance from reference photo [REF_ID].
Replace synthetic plastic skin with authentic human skin texture: visible fine pores, natural dermal imperfections, soft realistic specular highlight on forehead and cheekbone, subtle under-eye crease.
Remove artificial glow, porcelain smoothing, and stylized symmetrical jawline. Match original ear shape and natural hairline transition.
```
