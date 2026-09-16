# GPT Image 2.5 Engine Upgrade Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development where available or superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Add first-class GPT Image 2.5 generation/editing behavior, stronger photographic routing, evidence-aware QA, and consistent Plugin packaging without increasing the five-Skill public surface.

**Architecture:** Keep the existing five public Skills. Make the nested `lively-photos-director` the canonical orchestration contract, keep root `SKILL.md` as a compact portable entrypoint, place OpenAI vendor facts in one progressive engine reference, and extend the current three schemas instead of creating a new framework.

**Tech Stack:** Markdown Skills/references, JSON Schema draft 2020-12, Node/Bun CLI, Python standard-library validators, GitHub Actions.

**Spec:** `docs/superpowers/specs/2026-09-16-gpt-image-2-5-engine-upgrade-design.md`

## Global constraints

- Do not mutate `main`; work on `feat/gpt-image-2-5-engine-upgrade`.
- Keep exactly five public Skills.
- Do not reintroduce biometric face-template extraction or identity inference.
- Use current first-party OpenAI documentation for GPT Image claims.
- Keep `SKILL.md` files under 500 lines and use progressive references for depth.
- Treat image QA as unverified when no produced image can be inspected.
- Separate API/request parameters from prompt prose.
- Preserve backward compatibility where practical and use version `1.2.0` across package metadata.
- No new runtime dependencies unless an existing tool cannot satisfy a demonstrated requirement.

---

### Task 1: Lock the research and architecture

**Files:**
- Create: `docs/research/gpt-image-2-5-2026-09-16.md`
- Create: `docs/superpowers/specs/2026-09-16-gpt-image-2-5-engine-upgrade-design.md`
- Create: `docs/superpowers/plans/2026-09-16-gpt-image-2-5-engine-upgrade.md`

**Interfaces:**
- Consumes: current OpenAI model pages, image generation guide, prompting guide, current repository behavior.
- Produces: one durable source of external facts and one approved repository design.

- [ ] Record model aliases/snapshots, operations, quality, output controls, size constraints, preservation guidance, and DALL-E 3 retirement.
- [ ] Separate verified vendor facts from repository decisions.
- [ ] Record blocked runtime evidence explicitly.
- [ ] Commit the research/design/plan as a documentation-only slice.

### Task 2: Deepen the canonical Skill contracts and engine references

**Files:**
- Modify: `SKILL.md`
- Modify: `skills/lively-photos-director/SKILL.md`
- Modify: `skills/photo-scene-director/SKILL.md`
- Modify: `skills/engine-prompt-compiler/SKILL.md`
- Modify: `skills/photo-qa-reviewer/SKILL.md`
- Modify: `references/direction-rules.md`
- Modify: `references/prompt-compiler.md`
- Modify: `references/qa.md`
- Create: `references/engines/openai-gpt-image-2.5.md`

**Interfaces:**
- Consumes: classifications and policies from the design spec.
- Produces: canonical routing, scene direction, engine compilation, and QA decision contracts.

- [ ] Make root Skill a compact portable entrypoint to the nested canonical orchestrator.
- [ ] Add operation, reference strength/role, capture profile, subject scale, and execution-capability routing.
- [ ] Replace exact camera-calculation claims with visual camera cues that materially affect the result.
- [ ] Make `engine-prompt-compiler` portable and engine-aware; remove universal negative-token assumptions.
- [ ] Add first-class Flare/Sunburst model and operation selection in the OpenAI reference.
- [ ] Add `CHANGE` and `PRESERVE` edit structure, reference roles, multi-turn preservation, and pixel-identical compositing fallback.
- [ ] Add conditional QA gates and failure-to-remedy routing.
- [ ] Confirm every public Skill has trigger/refusal boundaries, classifications, evidence expectations, failure modes, invariants, shortcuts, and completion/handoff behavior.

### Task 3: Extend structured contracts and semantic evals

**Files:**
- Modify: `schemas/brief.schema.json`
- Modify: `schemas/direction.schema.json`
- Modify: `schemas/revision.schema.json`
- Modify: `evals/trigger-cases.jsonl`
- Modify: `evals/behavior-cases.jsonl`

**Interfaces:**
- Consumes: canonical classifications from Task 2.
- Produces: machine-readable packets and semantic decision fixtures used by validators and future behavioral evaluation.

- [ ] Extend schemas additively with operation, capture profile, subject scale, reference roles, preserve/change sets, engine model, and output parameters.
- [ ] Keep previous required fields valid unless a breaking change is explicitly justified.
- [ ] Add at least ten distinct behavior families plus adversarial evidence-pressure cases.
- [ ] Add positive triggers for editing/multi-reference/phone-candid work and keep non-photographic negative boundaries.
- [ ] Keep expected behavior engine-aware and avoid claims of executed image QA.

### Task 4: Upgrade the CLI router and unit tests

**Files:**
- Modify: `bin/cli.js`
- Modify: `tests/cli.test.ts`

**Interfaces:**
- Consumes: operation/scene/capture/subject/model classifications.
- Produces: deterministic CLI routing output that demonstrates the major decision seams without pretending to execute image generation.

- [ ] Add operation detection for generate/edit/repair/series/audit/compile.
- [ ] Add capture-profile and subject-scale detection.
- [ ] Detect OpenAI engine requests and select Flare vs Sunburst by documented task requirements.
- [ ] Remove DALL-E 3 from current routing vocabulary except optional historical/migration wording where clearly labeled.
- [ ] Replace fake aperture/shutter calculation output with camera-cue output.
- [ ] Make version test read the package version or assert 1.2.0 after manifest synchronization.
- [ ] Add unit tests for phone-candid, local edit, Sunburst precision edit, and compile-only routes.

### Task 5: Strengthen deterministic validation and CI

**Files:**
- Modify: `scripts/validate_skill.py`
- Modify: `.github/workflows/ci.yml`

**Interfaces:**
- Consumes: Skills, schemas, evals, package metadata, Plugin artifact.
- Produces: fail-closed structural/version/staleness checks and GitHub-hosted execution evidence.

- [ ] Verify canonical nested Skill and OpenAI engine reference exist.
- [ ] Verify package/manifest/submission version declarations agree.
- [ ] Reject active DALL-E 3 capability claims on current surfaces while allowing clearly historical research/migration notes.
- [ ] Verify current GPT Image 2.5 model IDs appear in the engine reference.
- [ ] Raise behavior-eval minimum to reflect semantic breadth and validate unique IDs.
- [ ] Add schema contract checks for key classification fields.
- [ ] Run Plugin validator in CI.
- [ ] Build Plugin ZIP twice in CI and compare bytes for deterministic packaging.

### Task 6: Reconcile metadata, submission semantics, and documentation

**Files:**
- Modify: `package.json`
- Modify: `.codex-plugin/plugin.json`
- Modify: `.claude-plugin/plugin.json`
- Modify: `.skills.json`
- Modify: `marketplace.json`
- Modify: `submission/listing.json`
- Modify: `submission/reviewer_tests.json`
- Modify: `README.md`
- Modify: `docs/solutions/codex-plugin-agentic-router.md`

**Interfaces:**
- Consumes: implemented product behavior and current-version test definitions.
- Produces: consistent version 1.2.0 metadata and truthful public documentation.

- [ ] Synchronize version 1.2.0.
- [ ] Replace current DALL-E-era capabilities with GPT Image 2.5 wording.
- [ ] Describe Flare/Sunburst in user-friendly terms without requiring the user to choose a model manually.
- [ ] Document generation, edits, multi-reference, multi-turn preservation, and known runtime-evidence limitation.
- [ ] Mark reviewer cases as definitions/expected behavior unless current-version execution evidence exists. Do not label expected behavior as a passed result.
- [ ] Keep the public promise centered on believable natural photography, not model branding.

### Task 7: Verify, simplify, review, and deliver

**Files:** all changed files, no new behavior unless review finds a real defect.

**Interfaces:**
- Consumes: complete branch diff and CI evidence.
- Produces: reviewable PR plus exact verification status.

- [ ] Run GitHub Actions through an opened PR because the local authorized desktop is unavailable.
- [ ] Require Bun tests, CLI smoke checks, Skill validation, Plugin validation, and deterministic package comparison.
- [ ] Apply Ponytail review: remove any new file/field/abstraction that does not change behavior, verification, or maintainability.
- [ ] Run independent diff review against the user mission and the five quality axes.
- [ ] Classify findings as REAL, ALREADY FIXED, STALE, FALSE POSITIVE, or NEEDS DECISION.
- [ ] Fix REAL in-scope findings and rerun affected checks.
- [ ] Report Plugin Eval, Qodo, and live GPT Image runtime benchmark as blocked if their required local/authenticated execution surfaces remain unavailable.
- [ ] Do not merge automatically. Leave the PR reviewable with CI evidence and exact residual limitations.
