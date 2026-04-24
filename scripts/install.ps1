#!/usr/bin/env pwsh
# Syntactics Skills - One-time install script (Windows)
# Usage: powershell -ExecutionPolicy Bypass -File scripts\install.ps1

$REPO_URL   = "https://github.com/pbdevrepo/syntactics-skills.git"
$INSTALL_DIR = "$HOME\.syntactics-skills"
$CLAUDE_SETTINGS = "$HOME\.claude\settings.json"

$HOOK_COMMAND = 'STAMP="$HOME/.syntactics-skills/.last-pull"; NOW=$(date +%s); LAST=$(cat "$STAMP" 2>/dev/null || echo 0); if [ $((NOW-LAST)) -gt 1800 ]; then cd "$HOME/.syntactics-skills" && git pull --ff-only --quiet 2>/dev/null && node scripts/deploy-local.js 2>/dev/null; echo $NOW > "$STAMP"; fi'

function Write-Step($msg) { Write-Host "==> $msg" -ForegroundColor Cyan }
function Write-OK($msg)   { Write-Host "    $msg" -ForegroundColor Green }
function Write-Err($msg)  { Write-Host "    ERROR: $msg" -ForegroundColor Red; exit 1 }

# --- prereq checks ---
Write-Step "Checking prerequisites"
if (-not (Get-Command git -ErrorAction SilentlyContinue))  { Write-Err "git not found. Install from https://git-scm.com" }
if (-not (Get-Command node -ErrorAction SilentlyContinue)) { Write-Err "node not found. Install from https://nodejs.org" }
Write-OK "git and node found"

# --- clone or update ---
Write-Step "Installing skills repo to $INSTALL_DIR"
if (Test-Path "$INSTALL_DIR\.git") {
    Write-OK "Repo exists, pulling latest"
    git -C $INSTALL_DIR pull --ff-only --quiet
} else {
    git clone $REPO_URL $INSTALL_DIR --quiet
    Write-OK "Cloned"
}

# --- install deps + initial deploy ---
Write-Step "Installing dependencies"
npm ci --prefix $INSTALL_DIR --silent

Write-Step "Deploying skills to ~/.claude/skills/"
node "$INSTALL_DIR\scripts\deploy-local.js"

# --- wire up auto-update hook ---
Write-Step "Configuring auto-update hook in $CLAUDE_SETTINGS"

$dir = Split-Path $CLAUDE_SETTINGS
if (-not (Test-Path $dir)) { New-Item -ItemType Directory -Path $dir -Force | Out-Null }

# load or init settings
if (Test-Path $CLAUDE_SETTINGS) {
    $settings = Get-Content $CLAUDE_SETTINGS -Raw | ConvertFrom-Json
} else {
    $settings = [PSCustomObject]@{}
}

# ensure hooks structure exists
if (-not $settings.PSObject.Properties['hooks']) {
    $settings | Add-Member -NotePropertyName hooks -NotePropertyValue ([PSCustomObject]@{})
}
if (-not $settings.hooks.PSObject.Properties['UserPromptSubmit']) {
    $settings.hooks | Add-Member -NotePropertyName UserPromptSubmit -NotePropertyValue @()
}

# check if hook already present
$hookObj = [PSCustomObject]@{ hooks = @(@{ type = "command"; command = $HOOK_COMMAND }) }
$alreadyAdded = $settings.hooks.UserPromptSubmit | Where-Object {
    $_.hooks -and ($_.hooks | Where-Object { $_.command -like "*syntactics-skills*" })
}

if ($alreadyAdded) {
    Write-OK "Hook already present, skipping"
} else {
    $settings.hooks.UserPromptSubmit += $hookObj
    $settings | ConvertTo-Json -Depth 10 | Set-Content $CLAUDE_SETTINGS -Encoding utf8
    Write-OK "Hook added"
}

Write-Host ""
Write-Host "Install complete." -ForegroundColor Green
Write-Host "Skills auto-update every 30 min when Claude Code is open."
Write-Host "Restart Claude Code now to load the skills."
