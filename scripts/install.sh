#!/usr/bin/env bash
# Syntactics Skills - One-time install script (Mac/Linux)
# Usage: bash scripts/install.sh

set -e

REPO_URL="https://github.com/pbdevrepo/syntactics-skills.git"
INSTALL_DIR="$HOME/.syntactics-skills"
CLAUDE_SETTINGS="$HOME/.claude/settings.json"

HOOK_CMD='STAMP="$HOME/.syntactics-skills/.last-pull"; NOW=$(date +%s); LAST=$(cat "$STAMP" 2>/dev/null || echo 0); if [ $((NOW-LAST)) -gt 1800 ]; then cd "$HOME/.syntactics-skills" && git pull --ff-only --quiet 2>/dev/null && node scripts/deploy-local.js 2>/dev/null; echo $NOW > "$STAMP"; fi'

step() { echo "==> $1"; }
ok()   { echo "    OK: $1"; }
err()  { echo "    ERROR: $1" >&2; exit 1; }

# --- prereq checks ---
step "Checking prerequisites"
command -v git  >/dev/null 2>&1 || err "git not found"
command -v node >/dev/null 2>&1 || err "node not found"
ok "git and node found"

# --- clone or update ---
step "Installing skills repo to $INSTALL_DIR"
if [ -d "$INSTALL_DIR/.git" ]; then
    ok "Repo exists, pulling latest"
    git -C "$INSTALL_DIR" pull --ff-only --quiet
else
    git clone "$REPO_URL" "$INSTALL_DIR" --quiet
    ok "Cloned"
fi

# --- install deps + initial deploy ---
step "Installing dependencies"
npm ci --prefix "$INSTALL_DIR" --silent

step "Deploying skills to ~/.claude/skills/"
node "$INSTALL_DIR/scripts/deploy-local.js"

# --- wire up auto-update hook ---
step "Configuring auto-update hook in $CLAUDE_SETTINGS"
mkdir -p "$(dirname "$CLAUDE_SETTINGS")"

# init settings.json if missing
if [ ! -f "$CLAUDE_SETTINGS" ]; then
    echo '{}' > "$CLAUDE_SETTINGS"
fi

# skip if hook already present
if grep -q "syntactics-skills" "$CLAUDE_SETTINGS" 2>/dev/null; then
    ok "Hook already present, skipping"
else
    # use node to safely merge into existing JSON
    node - <<EOF
const fs = require('fs');
const path = '$CLAUDE_SETTINGS';
const cmd = $(printf '%s' "$HOOK_CMD" | node -e "process.stdout.write(JSON.stringify(require('fs').readFileSync('/dev/stdin','utf8')))");
const s = JSON.parse(fs.readFileSync(path, 'utf8') || '{}');
s.hooks = s.hooks || {};
s.hooks.UserPromptSubmit = s.hooks.UserPromptSubmit || [];
s.hooks.UserPromptSubmit.push({ hooks: [{ type: 'command', command: cmd }] });
fs.writeFileSync(path, JSON.stringify(s, null, 2));
console.log('    OK: Hook added');
EOF
fi

echo ""
echo "Install complete."
echo "Skills auto-update every 30 min when Claude Code is open."
echo "Restart Claude Code now to load the skills."
