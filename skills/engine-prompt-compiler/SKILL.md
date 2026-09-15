---
name: engine-prompt-compiler
description: "Use when translating photographic scene briefs and facial identity anchors into engine-specific optimized prompts for Midjourney, Flux.1, ChatGPT/DALL-E 3, SDXL, or Imagen 3. Formats exact parameter flags, aspect ratios, style weights, and anti-slop negative tokens. Do NOT use for general prose writing, code generation, or text tasks unrelated to image synthesis prompt compilation."
---

# Engine Prompt Compiler: Multi-Engine Photographic Synthesis

Specialized agentic skill that translates photographic direction, camera optics, and identity anchors into syntactically perfect, engine-tuned prompts for major image synthesis models.

North star: maximize image fidelity, identity consistency, and photographic plausibility according to each generator's distinct prompting behavior.

## Supported Engine Compilers

### 1. ChatGPT Native / DALL-E 3
- **Behavior**: Responds best to coherent narrative prose and explicit optical details rather than disjointed keyword tags.
- **Syntax Rules**:
  - Lead with the core subject and identity anchor reference.
  - Specify lens focal length, aperture, lighting direction, and scene context in descriptive sentences.
  - Explicitly request authentic skin texture, natural pores, and relaxed expression.
  - Negative constraints (phrased positively): "Captured on professional 35mm film or digital sensor with realistic dynamic range, no digital smoothing or artificial glow."

### 2. Midjourney v6 / v6.1
- **Behavior**: Highly sensitive to parameter flags, style flags, and character reference weighting.
- **Recommended Parameters**:
  - `--style raw`: Mandatory for bypassing Midjourney's default glossy artistic rendering.
  - `--v 6.1`: Current photorealistic generation pipeline.
  - `--ar 16:9` (landscape), `--ar 4:5` (social/portrait), `--ar 1:1` (square), or `--ar 3:2` (editorial).
  - `--cref [URL]`: Character reference URL for identity locking.
  - `--cw 20` to `40`: Lower character weight focuses identity strictly on facial bone structure while allowing natural clothing/posture changes.
  - `--s 50` to `100`: Low stylization prevents synthetic exaggeration.

### 3. Flux.1 (Dev / Pro)
- **Behavior**: State-of-the-art prompt adherence and natural human anatomy. Excels with physical lens descriptions.
- **Prompt Structure**:
  - `[Subject description with authentic skin texture and identity anchor] [Action / Pose] in [Environment] shot on [Camera Model / Lens, e.g. Leica M11 with 50mm Summilux f/1.4], [Lighting setup: soft directional morning window light], natural film grain, authentic color gradation, unedited raw documentary photography.`

### 4. SDXL (Stable Diffusion XL)
- **Behavior**: Requires balanced positive optical prompts and robust negative embeddings/tokens.
- **Positive Prompt**:
  - `award-winning editorial photograph of [Subject], authentic skin micro-texture, fine pores, catchlights in eyes, shot on Sony A7R V with 85mm f/1.8 lens, natural lighting, sharp focus, atmospheric depth.`
- **Negative Prompt**:
  - `deformed, bad anatomy, bad hands, extra fingers, missing fingers, plastic skin, porcelain, airbrushed, cartoon, 3d render, illustration, oversaturated, neon glow, blur, fake smile, beauty filter, watermark.`

## Compiler Output Contract

When compiling a prompt, always output:
1. **Target Engine & Aspect Ratio**
2. **Compiled Execution String** (ready to copy or send to host tool)
3. **Camera & Lens Metadata**
4. **Negative / Slop Guard Tokens**
