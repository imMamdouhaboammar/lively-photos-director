# Direction Rules

Use this reference to turn a loose request into an engine-neutral photographic direction packet.

## 1. Capture only decisions that change the result

Useful fields:

- `subject_count`
- `primary_action`
- `setting`
- `scene_mode`
- `capture_profile`
- `subject_scale`
- explicit camera distance when supplied
- `formality`
- `camera_relationship`: candid, aware, posed-natural
- `intended_use`
- background importance
- movement
- hands/object interaction
- available/requested light
- `must_include`
- `must_avoid`

Do not ask for photography vocabulary the user does not need to know. Infer the least surprising value when only one interpretation fits the job.

## 2. Reference evidence

Every supplied image should have a role before it reaches the engine compiler.

Roles:

- `identity`
- `wardrobe`
- `product_or_prop`
- `environment`
- `composition`
- `lighting`
- `style`
- `background`

### Reference strength

`strong`: the visible traits needed for the assigned role are clear

`usable`: enough evidence for a reasonable attempt with some uncertainty

`weak`: blur, tiny subject, occlusion, filter, crop, or angle removes important evidence

`conflicting`: references assigned to the same role disagree on a material detail

`multiple-role`: different images intentionally own different evidence roles

### Visible-person preservation

For an identity-role reference, preserve visible stable appearance supported by the source:

- overall facial proportions and recognizable appearance
- eye/nose/mouth relationships visible at the source quality
- skin tone and age impression
- hairline/hairstyle, facial hair, or head covering when stable
- distinctive visible traits that are not temporary source artifacts

Do not preserve automatically:

- source background
- exact source pose
- temporary lighting cast
- camera distortion
- sharpening/filter artifacts
- details hidden by occlusion

Never identify an unknown person from appearance or infer sensitive traits.

For weak references, be conservative. Prefer a scene angle compatible with visible evidence and avoid promises of exact likeness.

## 3. Scene mode: what is happening

### `documentary-corporate`

Use for meetings, partnerships, signings, institutional work, executive PR, or office decisions.

Bias:

- readable environment
- restrained branding
- task-led posture
- low visual drama
- plausible office/venue illumination

### `candid-professional`

Use for working, explaining, reviewing, collaborating, whiteboards, or professional moments that should feel unstaged.

Bias:

- observer relationship
- off-center or lightly asymmetrical framing
- expression follows the task
- props only when used

### `editorial-natural`

Use for refined personal-brand/profile photography that must still read as a real photograph.

Bias:

- deliberate framing
- controlled but natural light
- useful negative space where needed
- restrained grooming and background separation

### `everyday-lifestyle`

Use for cafes, streets, home, beach, travel, commuting, and daily life.

Bias:

- ordinary environmental evidence
- relaxed posture
- available-light character
- imperfection appropriate to capture profile

### `event-documentary`

Use for conferences, panels, launches, workshops, networking, talks, awards, and exhibition floors.

Bias:

- visible event context
- believable crowd density/behavior
- practical venue lighting
- gestures/reactions over camera-facing smiles

## 4. Capture profile: how it feels photographed

### `phone-candid`

Use when a friend/colleague/attendee casually took the image or the user explicitly wants ordinary phone photography.

Visible cues:

- normal smartphone depth, not exaggerated portrait blur
- modest dynamic range
- casual camera height
- small framing imperfections that make sense
- ordinary sharpness/detail for subject distance
- environmental clutter left when it belongs to the scene

Do not add fake low quality. Casual is not damaged.

### `documentary-camera`

Use for intentional observer coverage.

Visible cues:

- action/context priority
- moderate separation
- practical exposure
- stable geometry
- no beauty-shoot posing

### `editorial-camera`

Use for deliberate authored portrait/profile work.

Visible cues:

- intentional frame geometry
- controlled natural contrast
- purposeful negative space
- stronger but still credible subject separation

### `controlled-professional`

Use for planned professional images that should look clean without looking synthetic.

Visible cues:

- stable framing
- simple planned light
- controlled posture
- clean environment with normal material detail

## 5. Subject scale and distance

`close-portrait`: face/shoulders are the dominant information

`medium`: upper body plus immediate task context

`three-quarter`: broader posture/body language

`full-body`: feet, ground contact, clothing drape, and stance all matter

`environmental`: place is a major part of the story

`distant-candid`: subject is relatively small and local detail naturally decreases

If the user specifies distance, honor it. At 7 to 15 meters, do not render close-up facial detail or portrait-depth behavior that contradicts the camera relationship.

## 6. Body language

Body language should explain the activity.

- signing: document/contact/pen logic is plausible
- presenting: gesture connects speaker, audience, and any actually used screen
- meeting: gaze/shoulders relate to people or task, not all to camera
- walking: stride phase, arm swing, balance, clothing motion agree
- desk work: chair/screen/wrist/elbow geometry is usable
- beach/cafe/street candid: relaxed asymmetry is acceptable, anatomy is not optional

Avoid hiding every difficult hand. Hide a hand only when framing/action naturally does so.

## 7. Camera grammar

Describe visible output, not fictitious physical certainty.

Useful cues:

| Situation | Perspective cue | Focus/context cue |
| --- | --- | --- |
| meeting/signing | 35mm to 50mm-style environmental/natural perspective | moderate depth; room remains readable |
| portrait/profile | 50mm to 85mm-style normal portrait perspective | moderate or shallow context separation |
| event | observer perspective from realistic audience/venue position | moderate focus separation |
| lifestyle | human/phone-level environmental perspective | context generally readable |
| distant candid | long working distance and small subject scale | ordinary detail falloff; avoid fake extreme bokeh |

Numeric lens/aperture values may be used as creative shorthand when the user asks for them. They are not guarantees that a generative model simulates exact optics.

## 8. Lighting grammar

Select one dominant logic.

### Outdoor daylight

- sky/sun relationship explains facial exposure and ground shadows
- weather character matches user-provided context
- avoid unexplained fill/rim sources

### Office

- window daylight and/or neutral practical ambient
- screen light remains local
- highlights/shadows respect fixtures/windows

### Window interior

- visible directional source
- realistic falloff
- background exposure remains plausible

### Event

- practical venue/stage sources
- mixed temperatures allowed when physically credible
- no synthetic neon wash unless the venue actually has it

### Phone candid

- accept normal imperfect exposure balance
- do not invent studio fill just to beautify the face

## 9. Ordinary environment rules

The user may intentionally want a place that is not aspirational.

### Beach

Possible credible details when requested/contextually appropriate:

- normal sand texture with footprints/towels/bags
- simple or mismatched umbrellas/chairs
- families/beachgoers at believable scale
- ordinary sea color/weather rather than tropical fantasy
- small waves and normal shoreline clutter

### Cafe

- practical chairs/tables
- ordinary cups/bags/phones only when people use them
- mixed customer background
- avoid influencer-table styling by default

### Office/workplace

- actual working distances
- usable furniture
- restrained screens/documents
- practical cables/wear/storage where visible and appropriate

### Conference/event

- attendee spacing and sightlines make sense
- badges/signage only when justified
- stage/booth light comes from believable fixtures

Context should come from the request, not stereotypes about nationality, class, religion, profession, or appearance.

## 10. Composition patterns

Use one primary focal anchor.

`context sandwich`: foreground edge/object -> subject/action -> contextual background

`observer asymmetry`: subject off-center, action flows into open space

`controlled symmetry`: formal structural balance with human/object asymmetry retained

`editorial negative space`: deliberate clean area for later layout without embedding copy

`distant candid`: environment takes more frame area and minor foreground interruption may be natural

Every major prop must answer: why is it here?

## 11. Natural imperfection

Use imperfection only where the capture profile calls for it.

Good candidates:

- slight off-centering
- ordinary clutter
- normal posture variation
- modest exposure imbalance
- plausible motion softness
- peripheral foreground intrusion

Bad candidates:

- deliberate anatomical error
- extreme noise/compression
- arbitrary crooked horizon
- fake lens dirt
- excessive blur
- invented low-resolution artifacts

## 12. Direction output

Return an engine-neutral packet:

```text
scene_mode
capture_profile
subject_scale
moment
environment
composition
body_language
camera_cues
lighting
reference_contract
constraints
```

Model/quality/size/format belong to the engine compiler, not here.
