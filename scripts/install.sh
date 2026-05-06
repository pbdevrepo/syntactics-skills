#!/usr/bin/env bash
# Optional: Install Syntactics Skills from GitHub releases
# This is not required - users can run: npx syntactics-skills@latest add syntactics-skills/skills

set -e

step() { echo "==> $1"; }
ok()   { echo "    ✓ $1"; }
err()  { echo "    ✗ $1" >&2; exit 1; }

step "Installing Syntactics Skills"
command -v npx >/dev/null 2>&1 || err "Node.js/npm not found"

npx syntactics-skills@latest add syntactics-skills/skills

ok "Installation complete!"
ok "Restart Claude to load the skills."
const cmd = $(printf '%s' "$HOOK_CMD" | node -e "process.stdout.write(JSON.stringify(require('fs').readFileSync('/dev/stdin','utf8')))");
const s = JSON.parse(fs.readFileSync(p, 'utf8') || '{}');
s.hooks = s.hooks || {};
s.hooks.UserPromptSubmit = s.hooks.UserPromptSubmit || [];
s.hooks.UserPromptSubmit.push({ hooks: [{ type: 'command', command: cmd }] });
fs.writeFileSync(p, JSON.stringify(s, null, 2));
console.log('    OK: Hook added');
EOF
fi

echo ""
echo "Install complete."
echo "Skills auto-update every 30 min when Claude Code is open."
echo "Restart Claude Code now to load the skills."
