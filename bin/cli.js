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

const SKILLS = [
  {
    name: 'lively-photos-director',
    role: 'Smart Dynamic Router & Master Orchestrator',
    description: 'Directs end-to-end photo generation, classifies intent, and orchestrates specialized agent skills.'
  },
  {
    name: 'photo-scene-director',
    role: 'Environment, Optics & Lighting Specialist',
    description: 'Directs camera focal length, aperture depth-of-field, physical light coherence, and natural posture.'
  },
  {
    name: 'engine-prompt-compiler',
    role: 'Multi-Engine Prompt Compiler',
    description: 'Translates photographic direction into engine-tuned syntax for Midjourney v6, Flux.1, ChatGPT/DALL-E 3, and SDXL.'
  },
  {
    name: 'photo-qa-reviewer',
    role: 'Visual QA & Delta Revision Director',
    description: 'Audits generated photos against 6 Hard Realism Gates and compiles surgical bounded inpainting delta prompts.'
  },
  {
    name: 'host-workspace-operator',
    role: 'Host Workspace Operations',
    description: 'Performs safe host-native file inspection, reference photo verification, and output analysis.'
  }
];

function printSkills() {
  console.log(`\n🤖 Codex Plugin Agentic Skills Suite (${SKILLS.length} Skills):\n`);
  SKILLS.forEach((s, idx) => {
    console.log(`${idx + 1}. [${s.name}] - ${s.role}`);
    console.log(`   ${s.description}\n`);
  });
}

function routePrompt(promptText) {
  if (!promptText || !promptText.trim()) {
    console.error('❌ Please provide a prompt or idea to route. Example: lively-photos-director route "Direct a candid shot of our CEO in an office"');
    process.exit(1);
  }

  const query = promptText.toLowerCase();

  // 1. Detect Intent Category
  let intent = 'direction';
  let routedSkills = [];
  let detectedMode = 'candid-professional';
  let cameraAdvice = '50mm portrait lens, f/2.0-f/2.8, soft diffused natural daylight';

  if (query.includes('audit') || query.includes('review') || query.includes('qa') || query.includes('fix') || query.includes('deformed') || query.includes('extra finger') || query.includes('plastic')) {
    intent = 'qa-audit-and-revision';
    routedSkills = ['photo-qa-reviewer'];
  } else if (query.includes('compile') || query.includes('midjourney') || query.includes('flux') || query.includes('dall-e') || query.includes('sdxl')) {
    intent = 'engine-compilation';
    routedSkills = ['engine-prompt-compiler'];
  } else {
    intent = 'full-photo-direction';
    routedSkills = ['photo-scene-director', 'engine-prompt-compiler', 'photo-qa-reviewer'];
  }

  // 2. Detect Photography Mode
  if (query.includes('boardroom') || query.includes('executive') || query.includes('signing') || query.includes('corporate') || query.includes('partnership') || query.includes('annual report')) {
    detectedMode = 'documentary-corporate';
    cameraAdvice = '35mm-50mm prime, f/3.5-f/5.6, balanced office window daylight with soft ambient fill';
  } else if (query.includes('magazine') || query.includes('profile') || query.includes('portrait') || query.includes('editorial') || query.includes('thought leader')) {
    detectedMode = 'editorial-natural';
    cameraAdvice = '85mm f/1.8 prime, directional natural daylight, organic background depth';
  } else if (query.includes('stage') || query.includes('keynote') || query.includes('conference') || query.includes('event') || query.includes('panel') || query.includes('summit')) {
    detectedMode = 'event-documentary';
    cameraAdvice = '35mm-70mm zoom, f/2.8, motivated stage spotlight balanced with ambient auditorium';
  } else if (query.includes('cafe') || query.includes('coffee') || query.includes('travel') || query.includes('street') || query.includes('outdoor') || query.includes('lifestyle')) {
    detectedMode = 'everyday-lifestyle';
    cameraAdvice = '28mm-35mm documentary lens, f/2.8, available ambient light with natural imperfections';
  } else {
    detectedMode = 'candid-professional';
    cameraAdvice = '50mm-85mm, f/2.0-f/2.8, creamy background separation, unposed collaborative moment';
  }

  console.log(`
🧭 Smart Dynamic Router Decision:
============================================================
Input Query:      "${promptText.trim()}"
Detected Intent:  ${intent.toUpperCase()}
Primary Mode:     ${detectedMode}
Camera Optics:    ${cameraAdvice}

Dispatched Agentic Skills Sequence:
${routedSkills.map((s, idx) => `  ${idx + 1}. [${s}]`).join('\n')}

Routing Strategy:
  • Likeness: Enforce authentic subject likeness & natural skin texture via [lively-photos-director]
  • Optics:   Frame scene with ${detectedMode} parameters via [photo-scene-director]
  • Compiler: Target syntax generation without artificial slop via [engine-prompt-compiler]
  • Audit:    Verify against 6 Hard Realism Gates via [photo-qa-reviewer]
============================================================
`);
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
    case 'skills':
      printSkills();
      break;
    case 'route':
      routePrompt(args.slice(1).join(' '));
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

