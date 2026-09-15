---
name: lively-photos-director
description: "Use when a user provides one or more real-person reference photos and wants a new image that should look naturally photographed: corporate, professional, editorial-natural, event, or everyday lifestyle scenes. Preserve recognizable identity while directing believable camera, light, body language, environment, and context. Do NOT use for posters, illustration, fantasy art, text-led key visuals, surreal composites, or requests where photorealism is not the primary goal."
---

# Lively Photos Director

Direct natural, human-first image generation from a real-person reference photo and a casually described idea.

North star: the result should plausibly look like a real photograph someone could have taken.

## Map of content

Use these references only when their branch applies:

- `references/direction-rules.md` - intent interpretation, identity fidelity, scene modes, camera, lighting, composition, and contextual realism
- `references/prompt-compiler.md` - convert the direction into a concise execution instruction for the host image tool
- `references/qa.md` - final review gates, failure diagnosis, and bounded revision rules
- `references/examples.md` - representative inputs and expected direction behavior
- `schemas/brief.schema.json` - optional structured brief contract
- `schemas/direction.schema.json` - optional structured direction packet
- `schemas/revision.schema.json` - optional targeted revision request
- `evals/trigger-cases.jsonl` - routing fixtures
- `evals/behavior-cases.jsonl` - behavior fixtures

## Operating contract

### 1. Interpret the user's idea

**Action:** Turn casual wording into one clear photographic moment.

**Key point:** Infer only what is needed to make the scene coherent: activity, setting, formality, camera relationship, and intended use.

**Why:** Users should not need to know photography vocabulary or write a production brief.

Choose one primary mode:

- `documentary-corporate`
- `candid-professional`
- `editorial-natural`
- `everyday-lifestyle`
- `event-documentary`

If the user explicitly asks for a style outside these modes, do not force this Skill.

### 2. Lock identity before styling

**Action:** Treat the supplied photo as an identity reference, not as loose inspiration.

**Key point:** Preserve recognizable face structure, skin tone, age impression, hair or head covering, and distinctive stable traits. Do not infer or announce a real person's identity from appearance.

**Why:** A photorealistic scene is unsuccessful if the person stops looking like the supplied reference.

Before execution, check:

- [ ] identity source is visible enough to anchor the face
- [ ] requested wardrobe or scene does not require unnecessary face changes
- [ ] beautification is restrained unless explicitly requested
- [ ] no unsupported identity claim is introduced

Read `references/direction-rules.md` for identity rules and weak-reference handling.

### 3. Build one believable moment

**Action:** Define a single action that could plausibly happen in the chosen environment.

**Key point:** Use only props, people, signage, screens, furniture, and architecture that explain the moment.

**Why:** Random scene filler is one of the strongest signals of synthetic imagery.

Prefer:

- one clear human focal anchor
- foreground, subject, and background depth when useful
- natural asymmetry or controlled symmetry
- context that can be understood without a graphic overlay
- body language appropriate to the action

Avoid adding a laptop, microphone, signing folder, presentation screen, crowd, flag, product, or branded wall unless the scene needs it.

### 4. Direct the camera, not a renderer

**Action:** Describe plausible lens, camera height, distance, focus behavior, and exposure character.

**Key point:** Use photographic language only where it changes the result. Default to natural perspective rather than spectacle.

**Why:** Camera plausibility is what separates a credible photograph from a polished synthetic render.

Default guidance:

- 35mm to 50mm for environmental scenes
- 50mm to 85mm for tighter professional portraits
- eye level or slightly elevated camera unless the story calls for another angle
- moderate depth of field for documentary scenes
- realistic background separation, not excessive blur
- straight, believable architectural lines

Read `references/direction-rules.md` for scenario-specific camera and lighting rules.

### 5. Keep light physically coherent

**Action:** Choose a believable dominant light source and let the environment support it.

**Key point:** Faces, shadows, screens, windows, reflective surfaces, and background exposure must agree.

**Why:** Contradictory light directions make a scene feel synthetic immediately.

Prefer soft daylight, window light, office ambient light, restrained event light, or simple studio-natural light. Avoid neon glow, arbitrary rim lights, heavy teal-orange grading, and unexplained cinematic contrast unless explicitly requested.

### 6. Compile a bounded image instruction

**Action:** Convert the direction into one execution prompt using `references/prompt-compiler.md`.

**Key point:** Keep the identity lock, action, environment, camera, light, and failure constraints explicit. Do not bury the image tool in decorative prose.

**Why:** A shorter structured instruction is easier to obey than a long list of aesthetic adjectives.

If the host provides an image generation or image editing tool, execute with the supplied photo as the reference asset. If the host does not provide such a tool, return the compiled instruction and state that execution was not performed.

Do not claim an image was generated, inspected, or revised without host evidence.

### 7. Review before approval

**Action:** Inspect the result against `references/qa.md`.

**Key point:** Identity fidelity, anatomy, camera plausibility, light consistency, context credibility, and synthetic residue are hard gates.

**Why:** A visually attractive result can still fail as a believable photograph.

Reject or revise when any hard gate fails. Use a targeted revision request rather than regenerating unrelated regions when the host supports bounded editing.

## Default naturalness rules

Unless the user asks otherwise:

- keep real skin texture and small asymmetries
- use relaxed, task-appropriate facial expression rather than a stock-photo grin
- allow normal fabric folds, posture variation, and minor environmental imperfection
- keep hands doing something plausible or resting naturally
- keep branding secondary to the human moment
- avoid text inside the image unless the user supplies exact copy or readable text is essential
- if a contextual screen is needed but no exact copy is supplied, prefer a simple credible interface or non-text visual rather than invented gibberish
- do not over-sharpen pores, hair, fabric, jewelry, or room detail

## Corporate documentary pattern

For partnership, signing, institutional meeting, or executive PR scenes, a strong default is:

- human subjects in the lower-middle portion of frame
- contextual proof in the upper-middle background, such as a real screen or branded wall
- vertical framing elements at the sides when natural to the location
- desk, documents, or another justified foreground anchor for depth
- neutral environment with restrained brand accents
- soft documentary light
- natural 50mm-style perspective
- formal but unstaged body language

Do not copy a reference image literally. Preserve the composition logic, not the original people, logos, room, or proprietary details.

## Anti-rationalization guardrails

| Temptation | Binding rule | Reason |
|---|---|---|
| "More cinematic means more realistic" | Prefer physically plausible light and camera behavior | Drama often exposes synthetic lighting and grading |
| "The background needs more things" | Add only story-bearing context | Decorative clutter weakens credibility |
| "Perfect skin looks premium" | Preserve natural texture unless retouching is requested | Plastic skin is a common synthetic cue |
| "A big smile makes the person approachable" | Match expression to the actual activity | Generic smiles read as stock photography |
| "The prompt should mention every visual detail" | Specify only identity, story, camera, light, context, and hard constraints | Long prompts dilute priorities |
| "The first good-looking output is done" | Pass every hard QA gate | Beauty is not the same as photographic plausibility |

## Completion criteria

A run is complete only when:

- [ ] the scene expresses one understandable moment
- [ ] the supplied person remains recognizably the same person
- [ ] anatomy and body language are plausible
- [ ] camera perspective and depth of field make physical sense
- [ ] lighting is internally consistent
- [ ] every major prop and background element has a reason to exist
- [ ] no major synthetic residue remains
- [ ] the result matches the requested level of formality and use case
- [ ] any image-generation claim is backed by actual host tool execution
