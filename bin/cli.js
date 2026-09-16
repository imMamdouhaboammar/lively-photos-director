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
  { name: 'documentary-corporate', focus: 'Partnerships, institutional meetings, executive PR, credible office work', camera: 'Environmental or natural perspective with readable context and restrained professional light' },
  { name: 'candid-professional', focus: 'Team discussions, casual workspace interactions, believable modern work moments', camera: 'Observer-led framing, moderate context separation, task-driven body language' },
  { name: 'editorial-natural', focus: 'Thought leadership, magazine profile, natural-light portraiture with restrained polish', camera: 'Deliberate framing, controlled natural contrast, credible subject separation' },
  { name: 'everyday-lifestyle', focus: 'Cafe work, travel, commuting, beach, street and ordinary daily-life moments', camera: 'Human or phone-level environmental perspective with contextual imperfection' },
  { name: 'event-documentary', focus: 'Conferences, panels, exhibition floors and audience interactions', camera: 'Observer perspective with practical venue light and readable event context' }
];

const CAPTURE_PROFILES = [
  { name: 'phone-candid', focus: 'Casual friend/attendee capture, normal phone depth, modest framing imperfection' },
  { name: 'documentary-camera', focus: 'Intentional observer coverage with action and environment kept readable' },
  { name: 'editorial-camera', focus: 'Deliberate authored composition and controlled natural contrast' },
  { name: 'controlled-professional', focus: 'Planned clean professional photography without synthetic glamour' }
];

const SKILLS = [
  { name: 'lively-photos-director', role: 'Canonical Orchestrator', description: 'Classifies operation, references, scene, capture profile, subject scale and execution route.' },
  { name: 'photo-scene-director', role: 'Photographic Scene Specialist', description: 'Directs believable moment, body language, environment, camera cues, distance and lighting.' },
  { name: 'engine-prompt-compiler', role: 'Engine-Aware Compiler', description: 'Separates engine/model/request parameters from prompt prose and maps generation/edit packets.' },
  { name: 'photo-qa-reviewer', role: 'Visual QA & Revision Diagnostic', description: 'Reviews actual image evidence, classifies defects and selects the smallest justified repair.' },
  { name: 'host-workspace-operator', role: 'Host Workspace Operations', description: 'Performs safe host-native file/reference/output operations when the host exposes them.' }
];

function printHelp() {
  console.log(`
📷 Lively Photos Director (v${pkg.version})
Natural-photography direction and engine-aware image workflow skill.

USAGE:
  lively-photos-director <command> [options]
  npx lively-photos-director <command> [options]
  bunx lively-photos-director <command> [options]

COMMANDS:
  info                  Display package metadata and contract locations
  modes                 List scene modes and capture profiles
  skills                List the five public Plugin Skills
  route <request>       Show deterministic routing classifications for a request
  view                  Print the portable root SKILL.md
  validate              Run structural and integrity checks
  install [target]      Install into supported agent directories
  help                  Show this help message

OPTIONS:
  -v, --version         Show package version
  -h, --help            Show help information

EXAMPLES:
  $ lively-photos-director route "Friend took this from 12 meters away on a normal beach"
  $ lively-photos-director route "Change only my shirt and preserve the rest"
  $ lively-photos-director route "Compile this for GPT Image 2.5"
  $ lively-photos-director validate
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

Core Contracts:
  • Portable Skill:     SKILL.md
  • Canonical Skill:    skills/lively-photos-director/SKILL.md
  • Direction Rules:    references/direction-rules.md
  • Prompt Compiler:    references/prompt-compiler.md
  • OpenAI Engine:      references/engines/openai-gpt-image-2.5.md
  • QA & Revision:      references/qa.md
============================================================
`);
}

function printModes() {
  console.log(`\n📸 Scene Modes:\n`);
  MODES.forEach((mode, idx) => {
    console.log(`${idx + 1}. [${mode.name}]`);
    console.log(`   Focus:  ${mode.focus}`);
    console.log(`   Cues:   ${mode.camera}\n`);
  });

  console.log(`📱 Capture Profiles:\n`);
  CAPTURE_PROFILES.forEach((profile, idx) => {
    console.log(`${idx + 1}. [${profile.name}]`);
    console.log(`   ${profile.focus}\n`);
  });
}

function printSkills() {
  console.log(`\n🤖 Codex Plugin Skills (${SKILLS.length} public Skills):\n`);
  SKILLS.forEach((skill, idx) => {
    console.log(`${idx + 1}. [${skill.name}] - ${skill.role}`);
    console.log(`   ${skill.description}\n`);
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

function containsAny(query, terms) {
  return terms.some((term) => query.includes(term));
}

function detectOperation(query) {
  const explicitRepairIntent = containsAny(query, [
    'repair', 'fix only', 'fix the', 'fix this', 'correct the', 'correct this'
  ]);
  const explicitEditIntent = containsAny(query, [
    'edit', 'change only', 'replace only', 'remove the', 'continue editing', 'continue from the approved',
    'keep my face', 'preserve the rest'
  ]);
  const existingImageCue = containsAny(query, [
    'this photo', 'this image', 'existing photo', 'existing image', 'generated photo', 'generated image'
  ]);
  const mutationIntent = containsAny(query, [
    'make ', 'brighten', 'darken', 'change ', 'replace ', 'remove ', 'add ', 'adjust ', 'crop ', 'blur ', 'sharpen ', 'recolor ', 'retouch '
  ]);
  const editIntent = explicitEditIntent || (existingImageCue && mutationIntent);
  const auditIntent = containsAny(query, [
    'audit', 'review', 'qa', 'check this generated', 'check this image', 'check this photo'
  ]);

  if (explicitRepairIntent) return 'repair_generated_image';
  if (containsAny(query, ['three photos', '3 photos', 'photo series', 'image series', 'same session', 'same meeting', 'photo set'])) return 'create_series';
  if (auditIntent && !editIntent) return 'audit_only';
  if (containsAny(query, ['compile', 'prompt only', 'do not generate', "don't generate"])) return 'compile_only';
  if (editIntent) return 'edit_existing_image';
  if (auditIntent) return 'audit_only';
  return 'generate_new_scene';
}

function detectMode(query) {
  if (containsAny(query, ['boardroom', 'executive', 'signing', 'corporate', 'partnership', 'annual report', 'institutional'])) return 'documentary-corporate';
  if (containsAny(query, ['magazine', 'profile', 'portrait', 'editorial', 'thought leader', 'linkedin portrait'])) return 'editorial-natural';
  if (containsAny(query, ['stage', 'keynote', 'conference', 'event', 'panel', 'summit', 'exhibition'])) return 'event-documentary';
  if (containsAny(query, ['cafe', 'coffee', 'travel', 'street', 'outdoor', 'lifestyle', 'beach', 'home', 'commute'])) return 'everyday-lifestyle';
  return 'candid-professional';
}

function detectCaptureProfile(query, mode) {
  if (containsAny(query, ['iphone', 'phone photo', 'phone candid', 'friend took', 'randomly', 'casual snapshot', 'regular phone'])) return 'phone-candid';
  if (containsAny(query, ['editorial', 'magazine', 'authored portrait'])) return 'editorial-camera';
  if (containsAny(query, ['headshot', 'controlled professional', 'planned professional', 'studio-natural'])) return 'controlled-professional';
  if (mode === 'editorial-natural' && containsAny(query, ['portrait', 'profile'])) return 'editorial-camera';
  return 'documentary-camera';
}

function detectSubjectScale(query) {
  if (containsAny(query, ['meters away', 'metres away', 'far away', 'distant', 'small in frame'])) return 'distant-candid';
  if (containsAny(query, ['full-body', 'full body', 'head to toe'])) return 'full-body';
  if (containsAny(query, ['close portrait', 'close-up', 'close up', 'headshot'])) return 'close-portrait';
  if (containsAny(query, ['wide shot', 'environmental portrait', 'show the whole place', 'environment matters'])) return 'environmental';
  if (containsAny(query, ['three-quarter', 'three quarter'])) return 'three-quarter';
  return 'medium';
}

function detectEngine(query) {
  if (containsAny(query, ['gpt image', 'gpt-image', 'openai image', 'flare', 'sunburst'])) return 'openai-gpt-image';
  if (query.includes('midjourney')) return 'midjourney';
  if (query.includes('flux')) return 'flux';
  if (query.includes('sdxl')) return 'sdxl';
  return 'host-default';
}

function detectOpenAIModel(query, operation, engine) {
  if (engine !== 'openai-gpt-image') return null;
  if (query.includes('sunburst')) return 'gpt-image-2.5-sunburst';
  if (query.includes('flare')) return 'gpt-image-2.5-flare';

  const precisionSensitive = containsAny(query, [
    'precision', 'preserve', 'exact', 'difficult', 'cannot drift', "can't drift", 'multi-turn',
    'continue editing', 'pixel-identical', 'pixel identical'
  ]);
  const demandingQuality = containsAny(query, ['demanding quality', 'highest quality', 'quality matters most']);

  if (operation === 'edit_existing_image' && precisionSensitive) return 'gpt-image-2.5-sunburst';
  if (operation === 'repair_generated_image' && precisionSensitive) return 'gpt-image-2.5-sunburst';
  if (demandingQuality) return 'gpt-image-2.5-sunburst';
  return 'gpt-image-2.5-flare';
}

function cameraCue(mode, captureProfile, subjectScale) {
  if (captureProfile === 'phone-candid') {
    if (subjectScale === 'distant-candid') return 'Distant casual smartphone framing, subject small in frame, normal phone depth and distance-consistent detail';
    return 'Casual smartphone-height framing, normal phone depth, modest exposure and natural small framing imperfection';
  }
  if (captureProfile === 'editorial-camera') return 'Deliberate natural perspective, controlled context separation and authored framing without synthetic glamour';
  if (captureProfile === 'controlled-professional') return 'Clean planned perspective, stable framing and simple credible professional light';
  if (mode === 'event-documentary') return 'Observer perspective with moderate context retention and practical venue light';
  if (mode === 'documentary-corporate') return 'Natural environmental perspective with readable room context and restrained office light';
  return 'Observer-led natural perspective with moderate context and task-driven framing';
}

function routedSkills(operation) {
  switch (operation) {
    case 'audit_only': return ['photo-qa-reviewer'];
    case 'compile_only': return ['engine-prompt-compiler'];
    case 'repair_generated_image': return ['photo-qa-reviewer', 'engine-prompt-compiler'];
    case 'edit_existing_image': return ['engine-prompt-compiler', 'photo-qa-reviewer'];
    case 'create_series':
    case 'generate_new_scene':
    default: return ['photo-scene-director', 'engine-prompt-compiler', 'photo-qa-reviewer'];
  }
}

function routePrompt(promptText) {
  if (!promptText || !promptText.trim()) {
    console.error('❌ Please provide a request. Example: lively-photos-director route "Friend took this from 12 meters away on a normal beach"');
    process.exit(1);
  }

  const query = promptText.toLowerCase();
  const operation = detectOperation(query);
  const mode = detectMode(query);
  const captureProfile = detectCaptureProfile(query, mode);
  const subjectScale = detectSubjectScale(query);
  const engine = detectEngine(query);
  const model = detectOpenAIModel(query, operation, engine);
  const skills = routedSkills(operation);
  const cue = cameraCue(mode, captureProfile, subjectScale);

  const preservation = ['edit_existing_image', 'repair_generated_image'].includes(operation)
    ? 'Explicit CHANGE and PRESERVE sets required before execution'
    : operation === 'create_series'
      ? 'Lock intended identity/wardrobe/session continuity; vary shot deliberately'
      : 'Reference roles stay explicit through compilation';

  const qa = operation === 'compile_only'
    ? 'No image execution or visual QA claim'
    : 'Visual approval requires actual produced image evidence';

  console.log(`
🧭 Lively Photos Routing Decision
============================================================
Input:            "${promptText.trim()}"
Operation:        ${operation}
Scene Mode:       ${mode}
Capture Profile:  ${captureProfile}
Subject Scale:    ${subjectScale}
Target Engine:    ${engine}${model ? `\nOpenAI Model:     ${model}` : ''}
Camera Cue:       ${cue}
Preservation:     ${preservation}
QA Boundary:      ${qa}

Dispatched Skills:
${skills.map((skill, idx) => `  ${idx + 1}. [${skill}]`).join('\n')}

Notes:
  • Scene mode says what is happening; capture profile says how it feels photographed.
  • Camera cues describe visible behavior, not guaranteed physical lens simulation.
  • Model/quality/size/background/format belong to the engine request contract, not decorative prompt prose.
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
    case 'info': printInfo(); break;
    case 'modes': printModes(); break;
    case 'skills': printSkills(); break;
    case 'route': routePrompt(args.slice(1).join(' ')); break;
    case 'view':
    case 'cat': viewSkill(); break;
    case 'validate': runValidate(); break;
    case 'install': runInstall(args[1] || 'all'); break;
    default:
      console.error(`Unknown command: ${cmd}`);
      printHelp();
      process.exitCode = 1;
  }
}

main();
