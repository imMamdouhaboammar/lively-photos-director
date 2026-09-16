---
name: lively-photos-director
description: "Use when a user provides one or more real-person reference photos and wants a believable natural photograph, photo edit, repair, or consistent photo series across corporate, editorial, event, professional, or everyday scenes. Preserve recognizable visible appearance while directing scene, capture character, engine execution, and image QA. Do NOT use for illustration, fantasy art, text-led key visuals, surreal composites, or work where photography is not the primary medium."
---

# Lively Photos Director

Portable entrypoint for natural, human-first image direction from reference photos.

North star: the result should plausibly look like a photograph that could have been captured in the requested moment.

## Canonical contract

The full orchestrator contract lives at:

`skills/lively-photos-director/SKILL.md`

Read that Skill before making routing, generation, edit, series, or QA decisions. This root file stays intentionally small so registry installs and the Codex Plugin use one behavioral source instead of two divergent copies.

## Progressive resources

Load only the branch needed for the request:

- `references/direction-rules.md` for scene mode, capture profile, subject scale, body language, lighting, reference quality, and contextual realism
- `references/prompt-compiler.md` for the portable execution packet and generation/edit prompt structure
- `references/engines/openai-gpt-image-2.5.md` for current GPT Image 2.5 model and request-parameter behavior
- `references/qa.md` for image evidence gates, failure diagnosis, and revision strategy
- `references/examples.md` for worked direction examples
- `prompts/AWESOME_PROMPTS.md` when the user asks for ideas rather than a specific scene
- `schemas/brief.schema.json`, `schemas/direction.schema.json`, and `schemas/revision.schema.json` when structured packets help the host
- `evals/trigger-cases.jsonl` and `evals/behavior-cases.jsonl` for routing and behavior evaluation

## Portable operating rules

1. Treat each supplied image as evidence with an explicit role such as identity, wardrobe, environment, composition, lighting, style, background, or product/prop.
2. Preserve visible appearance conservatively. Never identify a person from appearance or infer sensitive traits from a reference photo.
3. Separate what is happening from how the image feels captured. Scene mode and capture profile are different decisions.
4. Use camera terms only when they communicate visible framing, perspective, focus, distance, or exposure character. Do not promise exact physical lens simulation.
5. Separate generation from editing. For edits, state what may change and what must remain stable.
6. Keep model, quality, size, background, output format, and compression as engine/request parameters when the target supports them. Do not bury them inside decorative prompt prose.
7. Do not assume every engine has a negative-prompt channel. Express portable constraints first, then let the engine adapter map them.
8. Never claim an image was generated, inspected, revised, or approved without actual host evidence.
9. If the host cannot execute images, return a complete execution packet and mark execution and visual QA as unverified.
10. Prefer the smallest repair that addresses the observed failure instead of blindly rerolling the frame or lengthening the prompt.

## Completion

A run is complete only when the canonical Skill's branch-specific completion conditions are met. Structural prompt quality is not evidence that a produced image passed visual QA.
