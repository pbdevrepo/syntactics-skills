#!/usr/bin/env bash
set -euo pipefail

REPO_ROOT="$(cd "$(dirname "$0")/.." && pwd)"
SKILLS_DIR="$REPO_ROOT/skills"
RELEASE_TYPE="${1:-patch}"

if [[ ! "$RELEASE_TYPE" =~ ^(patch|minor|major)$ ]]; then
  echo "Invalid release type: $RELEASE_TYPE. Use patch, minor, or major." >&2
  exit 1
fi

changed_files=$(git -C "$REPO_ROOT" diff --name-only origin/main...HEAD 2>/dev/null || true)

if [ -z "$changed_files" ]; then
  echo "No skill changes detected. Nothing to bump."
  exit 0
fi

declare -A seen
bumped=0

while IFS= read -r f; do
  # match skills/{workflow}-workflow/{skill}/...
  if [[ "$f" =~ ^skills/([^/]+-workflow)/([^/]+)/ ]]; then
    workflow="${BASH_REMATCH[1]}"
    skill="${BASH_REMATCH[2]}"
    key="$workflow/$skill"
    [ "${seen[$key]+set}" ] && continue
    seen[$key]=1

    skill_file="$SKILLS_DIR/$workflow/$skill/SKILL.md"
    [ -f "$skill_file" ] || continue

    current=$(grep -m1 '^version:' "$skill_file" | sed 's/version:[[:space:]]*//' | tr -d '"' | tr -d "'" | tr -d '[:space:]')

    IFS='.' read -r major minor patch <<< "$current"

    case "$RELEASE_TYPE" in
      patch) patch=$((patch + 1)) ;;
      minor) minor=$((minor + 1)); patch=0 ;;
      major) major=$((major + 1)); minor=0; patch=0 ;;
    esac

    next="$major.$minor.$patch"

    # use temp file for compatibility (macOS sed -i requires extension)
    tmp=$(mktemp)
    sed "s/^version:[[:space:]].*/version: $next/" "$skill_file" > "$tmp"
    mv "$tmp" "$skill_file"

    echo "  $workflow/$skill: $current → $next"
    bumped=$((bumped + 1))
  fi
done <<< "$changed_files"

if [ "$bumped" -eq 0 ]; then
  echo "No skill changes detected. Nothing to bump."
else
  echo ""
  echo "Version bump complete ($bumped skill(s)). Stage and commit these changes."
fi
