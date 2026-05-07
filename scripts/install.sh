#!/usr/bin/env bash
set -euo pipefail

# Replace POINTER_PAGE_ID with the WordPress page ID from setup step 1.
# Do not upload this script to WordPress until you have done that.
POINTER_URL="https://development.websiteprojectupdates.com/wiki/wp-json/wp/v2/pages/POINTER_PAGE_ID?_fields=content"
SKILLS_DIR="$HOME/.claude/skills"
TMP_ZIP="/tmp/syntactics-skills-$$.zip"
TMP_DIR="/tmp/syntactics-skills-$$"

echo "Fetching latest skills..."
RESPONSE=$(curl -fsSL "$POINTER_URL" 2>/dev/null) || {
    echo "Error: Could not reach pointer page. Check your connection or contact your admin." >&2
    exit 1
}

ZIP_URL=$(echo "$RESPONSE" | grep -oE 'https?://[^"<[:space:]]+\.zip' | head -1)
if [ -z "$ZIP_URL" ]; then
    echo "Error: No ZIP URL found in pointer page. Contact your admin." >&2
    exit 1
fi

echo "Downloading skills..."
curl -fsSL "$ZIP_URL" -o "$TMP_ZIP"

echo "Installing to $SKILLS_DIR..."
mkdir -p "$SKILLS_DIR"
mkdir -p "$TMP_DIR"
unzip -q -o "$TMP_ZIP" -d "$TMP_DIR"
cp -r "$TMP_DIR/." "$SKILLS_DIR/"

rm -f "$TMP_ZIP"
rm -rf "$TMP_DIR"

echo "Done. Restart Claude Code to load the skills."
