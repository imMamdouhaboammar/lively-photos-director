import { describe, expect, test } from "bun:test";
import { spawnSync } from "node:child_process";
import path from "node:path";

const ROOT_DIR = path.resolve(__dirname, "..");
const CLI_PATH = path.join(ROOT_DIR, "bin", "cli.js");

function run(...args: string[]) {
  return spawnSync("bun", [CLI_PATH, ...args], { encoding: "utf8" });
}

describe("lively-photos-director CLI", () => {
  test("shows help output with --help", () => {
    const res = run("--help");
    expect(res.status).toBe(0);
    expect(res.stdout).toContain("Lively Photos Director");
    expect(res.stdout).toContain("COMMANDS:");
    expect(res.stdout).toContain("route <request>");
    expect(res.stdout).toContain("validate");
  });

  test("shows synchronized version with --version", () => {
    const res = run("--version");
    expect(res.status).toBe(0);
    expect(res.stdout.trim()).toBe("v1.2.0");
  });

  test("shows info with canonical and engine contracts", () => {
    const res = run("info");
    expect(res.status).toBe(0);
    expect(res.stdout).toContain("Canonical Skill:");
    expect(res.stdout).toContain("OpenAI Engine:");
    expect(res.stdout).toContain("references/engines/openai-gpt-image-2.5.md");
  });

  test("shows scene modes and capture profiles", () => {
    const res = run("modes");
    expect(res.status).toBe(0);
    expect(res.stdout).toContain("documentary-corporate");
    expect(res.stdout).toContain("everyday-lifestyle");
    expect(res.stdout).toContain("phone-candid");
    expect(res.stdout).toContain("editorial-camera");
  });

  test("shows five public skills", () => {
    const res = run("skills");
    expect(res.status).toBe(0);
    expect(res.stdout).toContain("5 public Skills");
    expect(res.stdout).toContain("lively-photos-director");
    expect(res.stdout).toContain("photo-scene-director");
    expect(res.stdout).toContain("engine-prompt-compiler");
    expect(res.stdout).toContain("photo-qa-reviewer");
    expect(res.stdout).toContain("host-workspace-operator");
  });

  test("routes corporate generation through full direction pipeline", () => {
    const res = run("route", "Direct a candid shot of our CEO in an executive boardroom signing a deal");
    expect(res.status).toBe(0);
    expect(res.stdout).toContain("Operation:        generate_new_scene");
    expect(res.stdout).toContain("Scene Mode:       documentary-corporate");
    expect(res.stdout).toContain("photo-scene-director");
    expect(res.stdout).toContain("engine-prompt-compiler");
    expect(res.stdout).toContain("photo-qa-reviewer");
  });

  test("preserves distance and phone-candid capture character", () => {
    const res = run("route", "My friend took this randomly from 12 meters away on a normal Egyptian beach. Keep me small in frame.");
    expect(res.status).toBe(0);
    expect(res.stdout).toContain("Scene Mode:       everyday-lifestyle");
    expect(res.stdout).toContain("Capture Profile:  phone-candid");
    expect(res.stdout).toContain("Subject Scale:    distant-candid");
    expect(res.stdout).toContain("subject small in frame");
  });

  test("routes bounded edits with explicit preservation boundary", () => {
    const res = run("route", "Change only my shirt and keep my face, pose, crop, lighting and background unchanged.");
    expect(res.status).toBe(0);
    expect(res.stdout).toContain("Operation:        edit_existing_image");
    expect(res.stdout).toContain("CHANGE and PRESERVE");
    expect(res.stdout).toContain("engine-prompt-compiler");
    expect(res.stdout).toContain("photo-qa-reviewer");
  });

  test("routes ordinary mutation of an existing photo as an edit", () => {
    const res = run("route", "Make the background brighter in this photo");
    expect(res.status).toBe(0);
    expect(res.stdout).toContain("Operation:        edit_existing_image");
    expect(res.stdout).toContain("CHANGE and PRESERVE");
    expect(res.stdout).toContain("engine-prompt-compiler");
    expect(res.stdout).toContain("photo-qa-reviewer");
  });

  test("selects Sunburst for preservation-sensitive GPT Image edit", () => {
    const res = run("route", "Use GPT Image 2.5 for a precision edit. Change only the jacket and preserve every accepted detail that cannot drift.");
    expect(res.status).toBe(0);
    expect(res.stdout).toContain("Target Engine:    openai-gpt-image");
    expect(res.stdout).toContain("OpenAI Model:     gpt-image-2.5-sunburst");
  });

  test("selects Flare for ordinary GPT Image generation", () => {
    const res = run("route", "Compile this ordinary natural cafe photo for GPT Image 2.5");
    expect(res.status).toBe(0);
    expect(res.stdout).toContain("Operation:        compile_only");
    expect(res.stdout).toContain("OpenAI Model:     gpt-image-2.5-flare");
    expect(res.stdout).toContain("No image execution or visual QA claim");
  });

  test("routes generic review wording to audit only", () => {
    const res = run("route", "Review the generated portrait for artifacts");
    expect(res.status).toBe(0);
    expect(res.stdout).toContain("Operation:        audit_only");
    expect(res.stdout).toContain("photo-qa-reviewer");
    expect(res.stdout).not.toContain("photo-scene-director");
  });

  test("routes generic QA wording to audit only", () => {
    const res = run("route", "QA my photo for lighting and anatomy");
    expect(res.status).toBe(0);
    expect(res.stdout).toContain("Operation:        audit_only");
    expect(res.stdout).toContain("photo-qa-reviewer");
  });

  test("routes combined audit and repair as repair", () => {
    const res = run("route", "Audit this generated photo and fix only the malformed right hand");
    expect(res.status).toBe(0);
    expect(res.stdout).toContain("Operation:        repair_generated_image");
    expect(res.stdout).toContain("photo-qa-reviewer");
    expect(res.stdout).toContain("engine-prompt-compiler");
  });

  test("routes audit-only request without generation skills", () => {
    const res = run("route", "Audit this generated photo for anatomy and lighting problems");
    expect(res.status).toBe(0);
    expect(res.stdout).toContain("Operation:        audit_only");
    expect(res.stdout).toContain("photo-qa-reviewer");
    expect(res.stdout).not.toContain("  2. [engine-prompt-compiler]");
  });

  test("runs validation with validate command", () => {
    const res = run("validate");
    expect(res.status).toBe(0);
    expect(res.stdout).toContain("PASS: lively-photos-director structural validation");
  });
});
