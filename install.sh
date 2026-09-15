#!/usr/bin/env bash
set -e

SKILL_NAME="lively-photos-director"
REPO_URL="https://github.com/imMamdouhaboammar/lively-photos-director"
RAW_BASE="https://raw.githubusercontent.com/imMamdouhaboammar/lively-photos-director/main"

# Determine source directory
if [ -f "SKILL.md" ] && [ -d "references" ]; then
  SOURCE_DIR="$(pwd)"
  IS_REMOTE=false
else
  SOURCE_DIR="$(mktemp -d -t skill-install-XXXXXX)"
  IS_REMOTE=true
  echo "📥 Fetching latest ${SKILL_NAME} from GitHub..."
  git clone --depth 1 "${REPO_URL}.git" "$SOURCE_DIR" >/dev/null 2>&1 || {
    echo "❌ Failed to clone repository. Ensure git and network access are available."
    exit 1
  }
fi

cleanup() {
  if [ "$IS_REMOTE" = true ] && [ -d "$SOURCE_DIR" ]; then
    rm -rf "$SOURCE_DIR"
  fi
}
trap cleanup EXIT

TARGET="${1:-all}"

install_to() {
  local dest="$1"
  local label="$2"
  mkdir -p "$dest"
  rm -rf "${dest:?}/${SKILL_NAME}"
  mkdir -p "${dest}/${SKILL_NAME}"

  # Copy essential skill files
  cp -r "$SOURCE_DIR/SKILL.md" "${dest}/${SKILL_NAME}/"
  cp -r "$SOURCE_DIR/references" "${dest}/${SKILL_NAME}/"
  cp -r "$SOURCE_DIR/schemas" "${dest}/${SKILL_NAME}/"
  cp -r "$SOURCE_DIR/scripts" "${dest}/${SKILL_NAME}/"
  cp -r "$SOURCE_DIR/evals" "${dest}/${SKILL_NAME}/"

  echo "  ✅ Installed for ${label} -> ${dest}/${SKILL_NAME}"
}

echo "📦 Installing ${SKILL_NAME} across AI agent environments..."

case "$TARGET" in
  --claude|claude)
    install_to "$HOME/.claude/skills" "Claude Code"
    ;;
  --gemini|gemini|--antigravity|antigravity)
    install_to "$HOME/.gemini/config/skills" "Antigravity & Gemini CLI"
    ;;
  --codex|codex|--opencode|opencode)
    install_to "$HOME/.codex/skills" "Codex & OpenCode"
    ;;
  --cursor|cursor)
    install_to "$HOME/.cursor/skills" "Cursor"
    ;;
  --kernel|kernel|--agents|agents)
    install_to "$HOME/.agents/skills" "Universal Agent Kernel"
    ;;
  --all|all|*)
    # 1. Claude Code
    if [ -d "$HOME/.claude" ] || command -v claude >/dev/null 2>&1; then
      install_to "$HOME/.claude/skills" "Claude Code"
    fi

    # 2. Antigravity / Gemini CLI
    if [ -d "$HOME/.gemini" ]; then
      install_to "$HOME/.gemini/config/skills" "Antigravity & Gemini CLI"
    fi

    # 3. Codex / OpenCode
    if [ -d "$HOME/.codex" ]; then
      install_to "$HOME/.codex/skills" "Codex & OpenCode"
    fi

    # 4. Cursor
    if [ -d "$HOME/.cursor" ]; then
      install_to "$HOME/.cursor/skills" "Cursor (User)"
    fi
    if [ -d ".cursor" ]; then
      install_to ".cursor/skills" "Cursor (Project)"
    fi

    # 5. Global Universal Agent Kernel (~/.agents/skills)
    install_to "$HOME/.agents/skills" "Universal Agent Kernel"
    ;;
esac

echo ""
echo "🎉 Successfully installed ${SKILL_NAME}!"
echo "💡 Usage: Refer to the skill in your prompts (e.g., 'direct this reference photo using lively-photos-director')."
