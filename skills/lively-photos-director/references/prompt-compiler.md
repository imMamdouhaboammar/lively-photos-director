# Prompt Compiler

Compile the direction into a concise instruction for an image generation or image editing tool.

## Required blocks

Use this order because it preserves priority:

1. identity reference
2. photographic intent
3. moment and action
4. environment and justified context
5. composition and body language
6. camera behavior
7. lighting
8. material and skin realism
9. hard constraints

## Template

```text
Use the supplied image as the identity reference for the primary person. Preserve the person's recognizable facial structure, skin tone, age impression, hair or head covering, and stable distinctive traits. Do not turn the person into a generic model.

Create a realistic natural photograph, not a poster, illustration, or glossy synthetic render.

Moment:
[one-sentence description of the exact moment and primary action]

Environment:
[credible location, only story-bearing props, people, architecture, or branding]

Composition and body language:
[primary focal anchor, framing structure, gaze, hands, posture, foreground/background relationship]

Camera:
[lens feel, camera height, framing distance, depth of field, perspective behavior]

Lighting:
[dominant source, fill behavior, contrast, color temperature character]

Realism:
Keep natural skin texture, plausible fabric folds, realistic hands, physically consistent shadows and reflections, believable room geometry, and restrained detail. Allow small natural asymmetries and normal environmental imperfection.

Avoid:
[only the failure modes relevant to this scene]

The final result should plausibly look like a real photograph captured in that moment.
```

## Prompt compression rules

- Prefer nouns and physical relationships over strings of style adjectives
- Do not repeat "realistic", "natural", or "photographic" more than needed
- Do not specify lens, aperture, shutter, ISO, and sensor unless each materially affects the scene
- Do not include unrelated negative prompts
- Do not request perfect symmetry, flawless skin, or impossible sharpness
- Do not add text, logos, or readable signage unless supplied or essential

## Editing an existing photo vs generating a new scene

### Existing-photo edit

When the requested change is local, protect everything outside the requested area. State exactly what may change and what must remain fixed.

Example:

```text
Keep the person's face, pose, crop, lighting direction, and background geometry unchanged. Replace only the casual jacket with a dark business jacket that fits the existing shoulders and light. Preserve all other pixels as closely as the host tool allows.
```

### New-scene generation from identity reference

When the person must be placed in a new environment, preserve identity but allow pose, clothing, framing, and background to change according to the scene brief.

## Multi-image continuity

If the user requests a photo set:

Lock across all images:

- identity
- skin rendering
- general grooming
- wardrobe unless the user asks for changes
- color response
- lighting family where the same event or session is implied

Vary deliberately:

- shot size
- camera side
- moment within the activity
- gaze
- foreground relationship
- environmental emphasis

Do not duplicate the same pose with different backgrounds.
