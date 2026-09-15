import { describe, expect, test } from "bun:test";
import { spawnSync } from "node:child_process";
import path from "node:path";

const ROOT_DIR = path.resolve(__dirname, "..");
const CLI_PATH = path.join(ROOT_DIR, "bin", "cli.js");

describe("lively-photos-director CLI", () => {
  test("shows help output with --help", () => {
    const res = spawnSync("bun", [CLI_PATH, "--help"], { encoding: "utf8" });
    expect(res.status).toBe(0);
    expect(res.stdout).toContain("Lively Photos Director");
    expect(res.stdout).toContain("COMMANDS:");
    expect(res.stdout).toContain("modes");
    expect(res.stdout).toContain("validate");
  });

  test("shows version with --version", () => {
    const res = spawnSync("bun", [CLI_PATH, "--version"], { encoding: "utf8" });
    expect(res.status).toBe(0);
    expect(res.stdout.trim()).toBe("v1.0.0");
  });

  test("shows info with info command", () => {
    const res = spawnSync("bun", [CLI_PATH, "info"], { encoding: "utf8" });
    expect(res.status).toBe(0);
    expect(res.stdout).toContain("Ecosystem Channels:");
    expect(res.stdout).toContain("Skills.sh:");
    expect(res.stdout).toContain("Claude Code:");
  });

  test("shows photography modes with modes command", () => {
    const res = spawnSync("bun", [CLI_PATH, "modes"], { encoding: "utf8" });
    expect(res.status).toBe(0);
    expect(res.stdout).toContain("documentary-corporate");
    expect(res.stdout).toContain("candid-professional");
    expect(res.stdout).toContain("editorial-natural");
    expect(res.stdout).toContain("everyday-lifestyle");
    expect(res.stdout).toContain("event-documentary");
  });

  test("runs validation with validate command", () => {
    const res = spawnSync("bun", [CLI_PATH, "validate"], { encoding: "utf8" });
    expect(res.status).toBe(0);
    expect(res.stdout).toContain("PASS: lively-photos-director structural validation");
  });
});
