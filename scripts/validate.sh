#!/usr/bin/env bash
set -euo pipefail

SKILLS_DIR="$(cd "$(dirname "$0")/.." && pwd)/skills"
errors=0
count=0

if [ ! -d "$SKILLS_DIR" ]; then
  echo "ERROR: skills/ directory not found at $SKILLS_DIR" >&2
  exit 1
fi

for workflow_dir in "$SKILLS_DIR"/*-workflow/; do
  [ -d "$workflow_dir" ] || continue
  workflow="$(basename "$workflow_dir")"

  for skill_dir in "$workflow_dir"*/; do
    [ -d "$skill_dir" ] || continue
    skill="$(basename "$skill_dir")"
    skill_file="$skill_dir/SKILL.md"
    label="$workflow/$skill"

    if [ ! -f "$skill_file" ]; then
      echo "[FAIL] $label: SKILL.md missing" >&2
      errors=$((errors + 1))
      continue
    fi

    # extract frontmatter block (between first --- pair)
    fm=$(awk '/^---/{found++; if(found==2) exit; next} found==1{print}' "$skill_file")

    # check required fields
    for field in name version description; do
      if ! echo "$fm" | grep -qE "^${field}[[:space:]]*:"; then
        echo "[FAIL] $label: missing frontmatter field: $field" >&2
        errors=$((errors + 1))
      fi
    done

    # check name matches directory
    fm_name=$(echo "$fm" | grep -E '^name[[:space:]]*:' | sed 's/^name[[:space:]]*:[[:space:]]*//' | tr -d '"' | tr -d "'" | tr -d '[:space:]')
    if [ -n "$fm_name" ] && [ "$fm_name" != "$skill" ]; then
      echo "[FAIL] $label: name \"$fm_name\" does not match directory \"$skill\"" >&2
      errors=$((errors + 1))
    fi

    # check semver
    fm_version=$(echo "$fm" | grep -E '^version[[:space:]]*:' | sed 's/^version[[:space:]]*:[[:space:]]*//' | tr -d '"' | tr -d "'" | tr -d '[:space:]')
    if [ -n "$fm_version" ] && ! echo "$fm_version" | grep -qE '^[0-9]+\.[0-9]+\.[0-9]+$'; then
      echo "[FAIL] $label: invalid semver: $fm_version" >&2
      errors=$((errors + 1))
    fi

    # check at least one ## section
    if ! grep -q '^##' "$skill_file"; then
      echo "[FAIL] $label: missing ## section" >&2
      errors=$((errors + 1))
    fi

    if [ $errors -eq 0 ]; then
      echo "[OK]   $label: v$fm_version — valid"
    fi
    count=$((count + 1))
  done
done

if [ "$count" -eq 0 ]; then
  echo "No skills found. Ensure skills live under *-workflow/ subdirectories." >&2
  exit 1
fi

if [ "$errors" -gt 0 ]; then
  echo ""
  echo "$errors error(s) found. Fix before deploying." >&2
  exit 1
else
  echo ""
  echo "All $count skills valid."
fi
