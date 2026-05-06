#!/usr/bin/env bash
set -euo pipefail

SKILLS_DIR="$(cd "$(dirname "$0")/.." && pwd)/skills"
DEST_DIR="$HOME/.claude/skills"

mkdir -p "$DEST_DIR"
count=0

echo "Deploying skills to $DEST_DIR"
echo ""

for workflow_dir in "$SKILLS_DIR"/*-workflow/; do
  [ -d "$workflow_dir" ] || continue
  workflow="$(basename "$workflow_dir")"

  for skill_dir in "$workflow_dir"*/; do
    [ -d "$skill_dir" ] || continue
    skill="$(basename "$skill_dir")"

    rm -rf "$DEST_DIR/$skill"
    cp -r "$skill_dir" "$DEST_DIR/$skill"
    echo "  deployed: $workflow/$skill"
    count=$((count + 1))
  done
done

echo ""
echo "Done. $count skills deployed. Restart Claude to pick up changes."
