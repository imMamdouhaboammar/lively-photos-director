# Solution: Engine-Aware Lively Photos Director

Status: implemented in the GPT Image 2.5 upgrade branch
Design date: 2026-09-16

## Problem

The earlier Plugin had useful photography concepts but its engine layer behaved like a static prompt-syntax table. It mixed scene direction with vendor syntax, presented exact camera metadata as if the generator simulated real optics, treated negative prompting as broadly portable, and still described DALL-E 3 as an active OpenAI engine.

The root Skill and nested Plugin Skill also carried overlapping behavioral contracts that could drift independently.

## Resulting architecture

The public surface remains five Skills:

1. `lively-photos-director`: canonical request classifier/orchestrator
2. `photo-scene-director`: photographic moment, capture character, subject scale, camera cues, light and context
3. `engine-prompt-compiler`: engine/model/operation/request parameter mapping and prompt compilation
4. `photo-qa-reviewer`: image-evidence gates, failure diagnosis and revision strategy
5. `host-workspace-operator`: host-native asset/file operations

GPT Image 2.5 is not a sixth public Skill. Its changing vendor contract lives under `references/engines/openai-gpt-image-2.5.md` and is loaded by the engine compiler when relevant.

## Canonical behavior

`skills/lively-photos-director/SKILL.md` is the canonical full orchestrator contract.

Root `SKILL.md` is the portable registry entrypoint and points to the canonical nested Skill plus progressive references. This removes the need to keep two full orchestration manuals synchronized.

## Decision model

The orchestrator classifies independent axes that materially change downstream behavior:

- operation: generation, edit, repair, series, audit or compile
- reference strength and role
- scene mode
- capture profile
- subject scale/distance
- execution capability

Scene mode answers what is happening. Capture profile answers how the image feels photographed. Subject scale protects explicit distance from being overwritten by portrait defaults.

## Reference contract

Multiple references are mapped explicitly to roles such as identity, wardrobe, environment, composition, lighting, style, background or prop.

Visible-person preservation uses user-supplied visible appearance as evidence. It does not identify the person or construct biometric templates.

## OpenAI engine contract

The current adapter separates:

- Flare vs Sunburst model selection
- generation vs editing operation
- quality
- size
- background
- output format/compression
- reference map
- prompt body
- CHANGE/PRESERVE sets

Request parameters remain structured controls rather than decorative prose.

The adapter supports multi-turn preservation rules and acknowledges that mask-guided edits do not guarantee exact unchanged pixels. Pixel-identical preservation routes to host-side compositing when available.

## Photography realism

Camera vocabulary describes visible perspective, subject scale, focus/context retention and camera relationship. It does not claim exact physical lens/sensor simulation.

Capture profiles introduce controlled imperfection where it belongs. A phone candid can be slightly off-center with normal phone depth and ordinary environmental clutter without becoming intentionally degraded.

## QA

Six base gates remain recognizable:

- likeness
- anatomy
- perspective
- lighting
- context
- synthetic residue

Conditional gates cover:

- requested edit happened
- preserve set remained stable
- no unrelated edit drift
- transparency edges
- requested text
- multi-turn continuity
- series continuity

Without an actual output image, the visual verdict is `UNVERIFIED`.

## Revision strategy

The repair loop now classifies the failure before changing anything. Local artifacts prefer local edits. Prompt ambiguity is fixed in wording. Composition problems return to direction. Model or quality changes require evidence that those choices are the actual bottleneck. Exact protected pixels use compositing rather than a prompt-only promise.

## Validation

`validate_skill.py` now checks:

- five-Skill public surface
- canonical nested orchestrator presence
- required GPT Image 2.5 engine reference
- semantic eval breadth
- structured schema contract fields
- synchronized package/manifest/submission versions
- required Flare/Sunburst aliases and snapshots
- absence of active DALL-E 3 capability claims
- secret/machine-path cleanliness

CI runs Bun tests, CLI smoke checks, Skill validation, Plugin validation, deterministic packaging twice, byte comparison and validation of a newly extracted package.

## Submission evidence

`submission/reviewer_tests.json` contains reviewer test definitions and expected behavior. It explicitly does not represent executed-result evidence for 1.2.0 until the exact packaged version is run and evidence references are populated.

## Deliberate non-goals

- no sixth GPT-specific public Skill
- no new runtime framework/dependency
- no generated sync layer for Skill copies
- no hard-coded current claims for third-party engine flags that were not re-verified
- no automatic max-quality routing
- no prompt-only pixel-preservation guarantee
