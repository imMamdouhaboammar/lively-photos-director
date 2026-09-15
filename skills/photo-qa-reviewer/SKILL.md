---
name: photo-qa-reviewer
description: "Use when evaluating generated photos against photographic realism standards, checking identity fidelity against references, verifying anatomical plausibility, auditing optical/lighting physics, detecting synthetic AI slop residue, and compiling surgical delta revision instructions. Do NOT use for code review, text copywriting evaluation, or assessing non-photographic artwork."
---

# Photo QA Reviewer: Visual QA, Realism Audit & Delta Revision Director

Specialized agentic skill that provides rigorous, evidence-based quality assurance for generated images, auditing them against 6 Hard Realism Gates and producing surgical delta revision briefs when defects are found.

North star: never approve an image with plastic skin, anatomical failures, or identity drift. If it fails, isolate the defect and direct a targeted fix.

## The 6 Hard Realism Gates

Every generated photo must be systematically audited against these 6 gates:

### Gate 1: Identity Fidelity
- **Audit**: Does the subject's face match the reference photo's bone structure, jawline contour, eye geometry, and nose bridge?
- **Failure Flags**: Model homogenization, facial drift, altered ethnicity, unrequested de-aging or beautification.

### Gate 2: Anatomical Plausibility
- **Audit**: Are hands, fingers, nails, ears, teeth, and eyes biologically plausible?
- **Failure Flags**: 6 fingers, fused knuckles, wandering pupils, asymmetrical iris shapes, uncanny teeth rows.

### Gate 3: Optical & Camera Physics
- **Audit**: Does the depth-of-field falloff match a real optical lens? Are architectural vertical lines upright?
- **Failure Flags**: Artificial Gaussian blur, sharp cutout edges around hair (halo effect), impossible depth where shoulders are sharp but neck is blurred.

### Gate 4: Coherent Illumination & Shadows
- **Audit**: Do facial highlights, nose cast shadows, and eye catchlights match the primary environmental light source?
- **Failure Flags**: Multiple conflicting shadow directions without multiple lamps, glowing faces in dim rooms, missing eye catchlights.

### Gate 5: Contextual Credibility
- **Audit**: Are props, furniture, attire, and background signage plausible for the scene?
- **Failure Flags**: Unexplained laptops in keynote speeches, impossible text gibberish on background posters, inappropriate formalwear in casual settings.

### Gate 6: Synthetic Residue & AI Slop
- **Audit**: Is the skin texture authentic? Is color grading restrained?
- **Failure Flags**: Porcelain airbrushed skin, wax figurine sheen, oversaturated orange-teal grading, unnatural hyper-symmetrical features.

## QA Audit Scorecard Format

Produce an explicit scorecard for every review:

```markdown
### 📸 Realism QA Scorecard
- **Gate 1: Identity Fidelity** [PASS / FAIL]: <Specific observation>
- **Gate 2: Anatomical Plausibility** [PASS / FAIL]: <Hands, eyes, facial balance>
- **Gate 3: Optical Physics** [PASS / FAIL]: <Focal length & depth of field>
- **Gate 4: Illumination Coherence** [PASS / FAIL]: <Shadows & catchlights>
- **Gate 5: Context Credibility** [PASS / FAIL]: <Props, setting & attire>
- **Gate 6: Synthetic Slop** [PASS / FAIL]: <Skin texture & saturation>

**Overall Verdict**: [APPROVED / REVISION REQUIRED]
```

## Surgical Delta Revision Compiler

When an audit fails, never re-roll the entire prompt blindly. Compile a **Bounded Delta Revision Instruction**:

```text
REVISION TARGET: [Region, e.g. Bounded Right Hand & Forearm]
DEFECT: Sixth finger artifact and unnatural knuckle fusion.
SURGICAL FIX: Repaint hand resting flat on mahogany conference table. Five natural fingers, visible knuckle wrinkles, subtle skin texture, natural thumbnail curvature. Match ambient room lighting and cast soft downward shadow onto table.
```
