#!/usr/bin/env node

import fs from 'node:fs';
import path from 'node:path';
import process from 'node:process';
import { fileURLToPath } from 'node:url';
import { spawnSync } from 'node:child_process';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, '..');

const pkg = JSON.parse(fs.readFileSync(path.join(ROOT_DIR, 'package.json'), 'utf8'));

const MODES = [
  {
    name: 'documentary-corporate',
    focus: 'Partnerships, institutional meetings, executive PR, credible office work',
    camera: 'Natural 35mm-50mm perspective, eye-level, soft ambient daylight'
  },
  {
    name: 'candid-professional',
    focus: 'Team discussions, casual workspace interactions, believable modern work moments',
    camera: '50mm-85mm, moderate depth of field, authentic unposed body language'
  },
  {
    name: 'editorial-natural',
    focus: 'Thought leadership, magazine profile, natural light portraiture with restrained aesthetic',
    camera: '50mm-85mm, controlled contrast, real skin texture preservation'
  },
  {
    name: 'everyday-lifestyle',
    focus: 'Cafe work, travel, commuting, personal candid everyday moments',
    camera: '28mm-35mm environmental, realistic available light, natural imperfections'
  },
  {
    name: 'event-documentary',
    focus: 'Conferences, panel discussions, exhibition floor, audience interactions',
    camera: '35mm-70mm, believable stage/ambient venue lighting, contextual crowds'
  }
];

function printHelp() {
  console.log(`
📷 Lively Photos Director (v${pkg.version})
Universal AI agent skill for directing photorealistic, human-first images.

USAGE:
  lively-photos-director <command> [options]
  npx lively-photos-director <command> [options]
  bunx lively-photos-director <command> [options]

COMMANDS:
  info                  Display skill metadata, supported channels, and schema locations
  modes                 List available photographic direction modes and guidelines
  view                  Print the complete SKILL.md instructions to stdout
  validate              Run structural and integrity checks on the skill package
  install [target]      Install skill into agent directories (claude, gemini, codex, cursor, all)
  help                  Show this help message

OPTIONS:
  -v, --version         Show package version
  -h, --help            Show help information

EXAMPLES:
  $ lively-photos-director modes
  $ lively-photos-director validate
  $ lively-photos-director install --all
  $ npx lively-photos-director install claude
`);
}

function printInfo() {
  console.log(`
============================================================
📸 Lively Photos Director - Specification & Channels
============================================================
Name:         ${pkg.name}
Version:      v${pkg.version}
Description:  ${pkg.description}
Author:       ${pkg.author}
License:      ${pkg.license}
Repository:   ${pkg.repository.url}
Homepage:     ${pkg.homepage}

Ecosystem Channels:
  • Skills.sh:          npx skills add imMamdouhaboammar/lively-photos-director
  • Claude Code:        ~/.claude/skills/lively-photos-director
  • Gemini/Antigravity: ~/.gemini/config/skills/lively-photos-director
  • Codex/OpenCode:     ~/.codex/skills/lively-photos-director
  • Cursor:             .cursor/skills/lively-photos-director
  • npm / npx:          npx lively-photos-director

Schemas & Assets:
  • Brief Schema:      schemas/brief.schema.json
  • Direction Schema:  schemas/direction.schema.json
  • Revision Schema:   schemas/revision.schema.json
  • Core Reference:    references/direction-rules.md
============================================================
`);
}

function printModes() {
  console.log(`\n📸 Available Photographic Direction Modes:\n`);
  MODES.forEach((m, idx) => {
    console.log(`${idx + 1}. [${m.name}]`);
    console.log(`   Focus:  ${m.focus}`);
    console.log(`   Camera: ${m.camera}\n`);
  });
}

function viewSkill() {
  const skillPath = path.join(ROOT_DIR, 'SKILL.md');
  if (!fs.existsSync(skillPath)) {
    console.error('❌ Error: SKILL.md not found at ' + skillPath);
    process.exit(1);
  }
  process.stdout.write(fs.readFileSync(skillPath, 'utf8'));
}

function runValidate() {
  const scriptPath = path.join(ROOT_DIR, 'scripts', 'validate_skill.py');
  console.log(`🔍 Running validator: python3 ${scriptPath} ${ROOT_DIR}\n`);
  const res = spawnSync('python3', [scriptPath, ROOT_DIR], { stdio: 'inherit' });
  process.exit(res.status ?? 0);
}

function runInstall(target = 'all') {
  const installScript = path.join(ROOT_DIR, 'install.sh');
  if (!fs.existsSync(installScript)) {
    console.error('❌ Error: install.sh not found at ' + installScript);
    process.exit(1);
  }
  console.log(`🚀 Executing install.sh ${target}...\n`);
  const res = spawnSync('bash', [installScript, target], { stdio: 'inherit' });
  process.exit(res.status ?? 0);
}

function main() {
  const args = process.argv.slice(2);
  const cmd = args[0];

  if (!cmd || cmd === '--help' || cmd === '-h' || cmd === 'help') {
    printHelp();
    return;
  }

  if (cmd === '--version' || cmd === '-v' || cmd === 'version') {
    console.log(`v${pkg.version}`);
    return;
  }

  switch (cmd) {
    case 'info':
      printInfo();
      break;
    case 'modes':
      printModes();
      break;
    case 'view':
    case 'cat':
      viewSkill();
      break;
    case 'validate':
      runValidate();
      break;
    case 'install':
      runInstall(args[1] || 'all');
      break;
    default:
      console.error(`Unknown command: ${cmd}`);
      printHelp();
      process.exit(1);
  }
}

main();
