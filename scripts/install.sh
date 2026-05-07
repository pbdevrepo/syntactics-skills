#!/usr/bin/env bash
set -euo pipefail

REPO="pbdevrepo/syntactics-skills"
SKILLS_DIR="$HOME/.claude/skills"
TMP_ZIP="/tmp/syntactics-skills-$$.zip"
TMP_DIR="/tmp/syntactics-skills-$$"

echo "Downloading latest skills..."
curl -fsSL "https://github.com/${REPO}/releases/latest/download/syntactics-skills.zip" -o "$TMP_ZIP"

echo "Installing to $SKILLS_DIR..."
mkdir -p "$SKILLS_DIR"
mkdir -p "$TMP_DIR"
unzip -q -o "$TMP_ZIP" -d "$TMP_DIR"
cp -r "$TMP_DIR/." "$SKILLS_DIR/"

rm -f "$TMP_ZIP"
rm -rf "$TMP_DIR"

echo "Done. Restart Claude Code to load the skills."
