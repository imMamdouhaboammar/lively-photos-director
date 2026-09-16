---
name: photo-scene-director
description: "Use when a believable photographic request needs scene, environment, body-language, framing, subject-distance, camera-cue, capture-profile, or lighting decisions before engine compilation. Direct real-world corporate, professional, editorial, event, and everyday moments without turning ordinary scenes into glossy stock photography. Do NOT use for engine API/model selection, image QA after generation, illustration, CGI, typography-led graphics, or non-photographic art."
---

# Photo Scene Director

Design the photograph before an engine tries to render it.

North star: the moment, framing, light, people, and environment should make sense to someone who believes a real camera was present.

## Inputs that change the direction

Use the smallest relevant set:

- intended use
- scene mode
- capture profile
- subject scale or explicit distance
- subject count
- primary action
- location scale and character
- desired candidness
- available/requested light
- background importance
- subject movement
- full-body visibility
- hands and object interaction
- must-include / must-avoid constraints

If a missing fact has two materially different photographic outcomes, surface the ambiguity. Otherwise choose the least surprising option.

## Separate scene from capture

### Scene mode: what is happening

| Mode | Typical job | Direction bias |
| --- | --- | --- |
| `documentary-corporate` | meetings, signings, executive/institutional work | context readable, restrained branding, formal but unstaged behavior |
| `candid-professional` | working, explaining, reviewing, collaborating | subject engaged in task, observer framing, natural interaction |
| `editorial-natural` | profile, founder feature, thought leadership | deliberate composition, simpler environment, restrained polish |
| `everyday-lifestyle` | cafe, street, home, beach, travel, commuting | ordinary context, available-light feel, relaxed posture |
| `event-documentary` | conferences, panels, launches, networking, awards | visible event context, credible crowd behavior, practical venue light |

### Capture profile: how it feels photographed

| Profile | Visible cues | Avoid |
| --- | --- | --- |
| `phone-candid` | casual camera height, normal phone sharpness, modest dynamic range, natural exposure, occasional small framing imperfection, subject may be small in frame | fake portrait-mode halos, cinematic grading, artificially damaged image |
| `documentary-camera` | observer perspective, contextual depth, moderate focus separation, practical exposure, action over posing | beauty-shoot polish, impossible stage glow |
| `editorial-camera` | intentional framing, controlled natural contrast, useful negative space, more deliberate subject separation | fashion exaggeration when not requested |
| `controlled-professional` | planned clean framing, stable posture, simple light, credible professional finish | plastic retouching, showroom/luxury defaults |

Never let scene mode silently choose capture profile. The user may want `event-documentary + phone-candid` or `everyday-lifestyle + editorial-camera`.

## Subject scale and distance

Honor the requested relationship between camera and person:

- `close-portrait`: face/shoulders dominate
- `medium`: upper body and task context
- `three-quarter`: body language plus environment
- `full-body`: feet/posture/contact with ground must make sense
- `environmental`: person is one strong element inside a readable place
- `distant-candid`: subject is relatively small; setting, intervening space, and normal detail loss matter

Explicit physical distance outranks aesthetic preference. A person photographed from 7 to 15 meters away should not have close-portrait detail or extreme background blur.

## Camera direction is a visual cue

Use camera language only to communicate visible consequences:

- perspective width/compression
- camera height and angle
- framing distance
- focus-plane behavior
- depth/context retention
- motion character
- exposure character

Useful phrases:

- `35mm-style environmental perspective`
- `50mm-style natural perspective`
- `moderate documentary depth of field`
- `normal smartphone depth, most of the scene readable`
- `eye-level observer framing`
- `distant full-body candid with ordinary detail falloff`

Do not claim to calculate or guarantee a true focal length, aperture, shutter speed, ISO, sensor response, or optical simulation inside a generative model. Add a numeric photography cue only when the user asks for it or the visible consequence matters.

## Body language follows the action

Hands, gaze, shoulders, and weight must explain the moment.

- signing: one hand stabilizes or interacts with the document; the other performs the action
- presenting: body orientation connects speaker, audience, and any screen/prop that is actually being used
- meeting: shoulders/gaze relate to another person, object, or conversation rather than the camera
- walking: stride, arm swing, clothing, and balance agree
- desk work: wrists/elbows/chair/screen geometry are physically usable
- beach/street/cafe candid: posture may be relaxed and imperfect, but not anatomically careless

Do not hide hands merely to avoid generation difficulty unless the composition naturally hides them.

## Lighting logic

Choose one dominant logic and only add secondary sources that the environment supports.

- daylight exterior: sun/sky direction is consistent with shadows and face exposure
- window interior: one obvious directional source plus plausible room fill
- office: daylight and/or neutral practical ambient with restrained contrast
- event: stage/practical spill follows actual fixture logic; mixed temperatures are allowed when credible
- ordinary phone candid: accept imperfect exposure balance when normal for the moment; do not add unexplained rim lights

Faces, hands, reflective surfaces, windows, screens, and cast shadows must tell the same lighting story.

## Ordinary-location rule

If the user asks for an ordinary Egyptian beach, neighborhood cafe, home, street, office, airport, hotel corridor, or Saudi workplace/event, keep the requested everyday character.

Use concrete visible context rather than stereotypes:

- ordinary beach: slightly messy sand, simple chairs/umbrellas, normal crowd spacing, practical bags/towels, realistic local water/weather character when supplied
- workplace: usable furniture, believable documents/screens, practical lighting, normal wear and spacing
- conference: real attendee density, badges/signage only when justified, practical venue construction and lighting
- cafe: actual table/seat relationship, ordinary objects, plausible customer background rather than influencer styling

Do not infer culture, religion, income, or occupation from a person's appearance. Context comes from the user request and visible scene requirements.

## Composition decision rules

Prefer one focal anchor and one readable action.

Use foreground/context only when it explains depth or story. Common structures:

- context sandwich: foreground edge/object -> subject/action -> contextual background
- observer asymmetry: subject off-center with action flowing into open space
- controlled symmetry: formal setting with human asymmetry preserved
- editorial negative space: deliberate room for crop/layout without embedding copy
- distant candid: larger share of environment, normal obstructions/people/objects may intersect peripheral frame

Avoid decorative clutter. Every major prop should answer why it is present.

## Natural imperfection policy

Imperfection is contextual, not an effect pack.

For phone-candid/everyday work, allow some of:

- slightly imperfect centering
- normal environmental clutter
- minor exposure imbalance
- plausible motion softness away from the face
- casual posture asymmetry
- foreground edge/obstruction that a friend might not carefully remove

Do not intentionally add severe blur, sensor noise, crooked horizons, compression damage, or anatomical flaws just to prove the image is casual.

## Failure taxonomy

- `scene-contradiction`: action and environment do not support each other
- `capture-mismatch`: requested casual/documentary/editorial character was replaced by another profile
- `scale-mismatch`: framing/distance conflicts with the request
- `prop-noise`: major objects do not explain the moment
- `pose-performance`: body/gaze reads as staged stock imagery
- `light-contradiction`: sources/shadows/highlights cannot coexist
- `context-gloss`: ordinary place was replaced by aspirational/luxury styling
- `camera-overprecision`: metadata sounds exact but adds no visible direction

Fix the owning decision instead of adding more adjectives.

## Output contract

Return a scene-direction packet with:

- `scene_mode`
- `capture_profile`
- `subject_scale`
- `moment`
- `environment`
- `composition`
- `body_language`
- `camera_cues`
- `lighting`
- `context_constraints`
- `must_include`
- `must_avoid`

The packet is engine-neutral. Engine/model/API parameters belong to `engine-prompt-compiler`.

## Completion criteria

- scene and capture profile are explicit and not conflated
- subject scale/distance matches the request
- action, hands, gaze, and posture are coherent
- camera vocabulary describes visible behavior rather than fake simulation
- light has a plausible dominant logic
- ordinary settings remain ordinary when requested
- each major contextual object has a reason to exist
- no engine-specific syntax leaked into the scene packet
