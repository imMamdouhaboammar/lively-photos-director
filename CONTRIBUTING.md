# Contributing to Lively Photos Director

Thank you for your interest in contributing to **Lively Photos Director**! We welcome improvements to direction heuristics, photography references, schemas, test fixtures, and multi-agent distribution tooling.

## Development Setup

1. Clone the repository:
   ```bash
   git clone https://github.com/imMamdouhaboammar/lively-photos-director.git
   cd lively-photos-director
   ```

2. Install development tools:
   - [Bun](https://bun.sh) (>= 1.0.0)
   - Python 3 (>= 3.9)

3. Run the validation checks and test suite:
   ```bash
   bun test
   python3 scripts/validate_skill.py .
   ```

## Skill Authoring Guidelines

When modifying `SKILL.md` or files in `references/`:
- **Progressive Disclosure**: Keep `SKILL.md` lean (< 500 lines) as an orchestration map. Detailed photography guidelines belong in `references/`.
- **Anti-Slop Photographic Discipline**: Maintain the core philosophy—natural perspective, physically coherent light, authentic anatomy, restrained retouching, and zero synthetic residue.
- **Eval Fixtures**: If adding a new capability or mode, add positive and negative trigger cases to `evals/trigger-cases.jsonl` and behavioral criteria to `evals/behavior-cases.jsonl`.
- **No Machine-Specific Paths or Secrets**: Never include machine-specific paths or private tokens in repository files.

## Pull Request Process

1. Fork the repo and create your branch from `main`.
2. Ensure `bun test` and `python3 scripts/validate_skill.py .` pass with zero errors.
3. Open a PR with a clear description of your changes and motivation.
