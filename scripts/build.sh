#!/usr/bin/env bash
set -euo pipefail

REPO_ROOT="$(cd "$(dirname "$0")/.." && pwd)"
SKILLS_DIR="$REPO_ROOT/skills"
DIST_DIR="$REPO_ROOT/dist"

mkdir -p "$DIST_DIR"

count=0

echo "Building skills → dist/"
echo ""

for workflow_dir in "$SKILLS_DIR"/*-workflow/; do
  [ -d "$workflow_dir" ] || continue
  workflow="$(basename "$workflow_dir")"

  for skill_dir in "$workflow_dir"*/; do
    [ -d "$skill_dir" ] || continue
    skill="$(basename "$skill_dir")"
    zip_path="$DIST_DIR/${skill}.skill"

    (cd "$workflow_dir" && zip -r "$zip_path" "$skill/" --quiet)
    echo "  built: dist/${skill}.skill  [$workflow]"
    count=$((count + 1))
  done
done

echo ""
echo "Building workflow bundles → dist/"
echo ""

for workflow_dir in "$SKILLS_DIR"/*-workflow/; do
  [ -d "$workflow_dir" ] || continue
  workflow="$(basename "$workflow_dir")"

  skill_zips=()
  for skill_dir in "$workflow_dir"*/; do
    [ -d "$skill_dir" ] || continue
    skill="$(basename "$skill_dir")"
    skill_zip="${skill}.skill"
    if [ -f "$DIST_DIR/$skill_zip" ]; then
      skill_zips+=("$skill_zip")
    fi
  done

  if [ ${#skill_zips[@]} -eq 0 ]; then
    echo "  skip: $workflow — no .skill files found"
    continue
  fi

  bundle_zip="$DIST_DIR/${workflow}.zip"
  (cd "$DIST_DIR" && zip "$bundle_zip" "${skill_zips[@]}" --quiet)
  echo "  built: dist/${workflow}.zip  [${skill_zips[*]}]"
done

echo ""
echo "Build complete. $count skills packaged."
