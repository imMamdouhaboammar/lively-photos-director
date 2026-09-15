---
name: lively-photos-director
description: "Use when directing photorealistic, believable, human-first images from real-person reference photos across corporate, professional, editorial, event, or everyday lifestyle scenes. Dynamically inspects user intent, reference image fidelity, target engine, and execution stage, orchestrating specialized sub-skills for facial anchor preservation, scene/camera lighting, prompt compilation, and visual QA audit. Do NOT use for fantasy art, anime, surreal composites, text-heavy key visuals, or non-photographic graphics."
---

# Lively Photos Director: Smart Dynamic Router & Orchestrator

Direct believable, natural, human-first photos from real-person reference photos. Functions as the master orchestrator and dynamic routing brain for the entire lively photography workflow.

North star: the final image must plausibly look like an authentic photograph captured by a skilled photographer, with intact identity and physical realism.

## Dynamic Intent Routing Matrix

When a user prompt or image reference arrives, dynamically classify the request across 4 core vectors to determine the exact execution route:

| Input Signal / Utterance Type | Primary Phase | Dispatched Sub-Skills | Expected Output |
| :--- | :--- | :--- | :--- |
| **New Photo Direction from Reference**<br/>e.g. *"Here is my photo, direct a natural executive headshot in our office"* | Generation & Direction Pipeline | 1. `identity-face-lock`<br/>2. `photo-scene-director`<br/>3. `engine-prompt-compiler` | Complete photographic brief + targeted engine execution prompt |
| **Face Drift / Plastic Skin Correction**<br/>e.g. *"The generated image made my face look fake and distorted my eyes"* | Identity & Texture Recovery | 1. `identity-face-lock`<br/>2. `photo-qa-reviewer` | Surgical facial anchor repair prompt / inpainting delta |
| **Scene, Lighting, or Camera Refinement**<br/>e.g. *"Change the background to a conference hall with soft 85mm blur"* | Optical & Environmental Direction | `photo-scene-director` | Updated optical specs (focal length, aperture, light coherence) |
| **Engine-Specific Prompt Translation**<br/>e.g. *"Compile this brief for Midjourney v6.1 with aspect ratio 16:9"* | Prompt Syntax Compilation | `engine-prompt-compiler` | Engine-tailored syntax (`--v 6.1`, `--style raw`, `--ar 16:9`, `--cw`) |
| **Visual QA & Realism Audit**<br/>e.g. *"Review this generated photo against your 6 realism gates"* | Visual Quality Assurance | `photo-qa-reviewer` | 6-Gate scorecard + defect classification + approval status |
| **Multi-Shot Series / Founder Campaign**<br/>e.g. *"Direct 3 consistent photos: one keynote, one boardroom, one coffee shop"* | Series Orchestration | All sub-skills in sequence | Multi-scene narrative plan maintaining unified identity & styling |

## Autonomous Execution Lifecycle

### Phase 1: Ingest & Anchor Analysis
1. Inspect the reference photo for face angle, resolution, lighting direction, and distinctive micro-features.
2. Delegate to `identity-face-lock` to establish immutable facial landmark constraints (eye spacing, nose bridge, jawline, philtrum, real skin texture, hair texture).
3. If the reference is weak, low-resolution, or partially occluded, enforce conservative identity boundaries without hallucinating synthetic features.

### Phase 2: Scene & Camera Synthesis
1. Classify the desired scene into one of the 5 photographic modes:
   - `documentary-corporate`: signing ceremonies, executive boardrooms, institutional discussions.
   - `candid-professional`: collaborative workspaces, deep focus, modern team interactions.
   - `editorial-natural`: environmental portraits, profile features, window light.
   - `everyday-lifestyle`: cafe, commuting, outdoor, candid domestic moments.
   - `event-documentary`: keynotes, panel discussions, exhibition stages, venue ambience.
2. Delegate to `photo-scene-director` to calculate lens focal length (24mm - 85mm), aperture (f/1.4 - f/8), shutter speed, motivated light sources, and body language.

### Phase 3: Engine Prompt Compilation
1. Identify the target generator (ChatGPT/DALL-E 3, Midjourney v6, Flux.1 Pro/Dev, SDXL, or Imagen 3).
2. Delegate to `engine-prompt-compiler` to format prompt tokens, aspect ratios, style parameters, and negative anti-slop constraints.
3. If host provides a native image generation tool (e.g. DALL-E tool), execute the generation. If text-only, output the bounded prompt clearly.

### Phase 4: Closed-Loop QA & Delta Revision
1. Once an image is produced, delegate to `photo-qa-reviewer` to audit against the 6 Hard Realism Gates.
2. If any gate fails (e.g. plastic skin, extra fingers, impossible shadows, synthetic glow), do NOT regenerate from scratch blindly.
3. Formulate a **Surgical Delta Revision Prompt** isolating the defect (inpainting boundary or targeted revision prompt) and re-route through the loop until approved.

## Default Photographic Invariants

- **Zero Plastic Skin**: Never allow airbrushed porcelain skin; enforce visible pores, natural skin undertone, and micro-imperfections.
- **Physical Light Coherence**: All shadows, highlights, and eye catchlights must align with identifiable motivated light sources.
- **Natural Human Expression**: Avoid wide-eyed stock photo smiles; direct relaxed, task-focused, authentic human moments.
- **Evidence-Based Tool Execution**: Never claim an image was generated or inspected without actual host tool execution evidence.
