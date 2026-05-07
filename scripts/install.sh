#!/usr/bin/env bash
set -euo pipefail

REPO="pbdevrepo/syntactics-skills"
SKILLS_DIR="$HOME/.claude/skills"
TMP_ZIP="/tmp/syntactics-skills-$$.zip"
TMP_DIR="/tmp/syntactics-skills-$$"

WORKFLOWS=()
SKILLS=()

while [[ $# -gt 0 ]]; do
    case $1 in
        --workflow) WORKFLOWS+=("$2"); shift 2 ;;
        --skill)    SKILLS+=("$2");    shift 2 ;;
        *)          echo "Unknown option: $1" >&2; exit 1 ;;
    esac
done

cleanup() { rm -f "$TMP_ZIP"; rm -rf "$TMP_DIR"; }
trap cleanup EXIT

if ! command -v python3 &>/dev/null; then
    echo "Error: python3 is required but not found." >&2
    exit 1
fi

echo "Downloading latest skills..."
curl -fsSL "https://github.com/${REPO}/releases/latest/download/syntactics-skills.zip" -o "$TMP_ZIP"
mkdir -p "$TMP_DIR"
unzip -q -o "$TMP_ZIP" -d "$TMP_DIR"

MANIFEST="$TMP_DIR/manifest.json"

# Old release without manifest — install everything flat
if [[ ! -f "$MANIFEST" ]]; then
    echo "No manifest found; installing all skills..."
    mkdir -p "$SKILLS_DIR"
    find "$TMP_DIR" -maxdepth 1 -mindepth 1 -type d -exec cp -r {} "$SKILLS_DIR/" \;
    echo ""
    echo "Done. Restart Claude Code to load the skills."
    exit 0
fi

wf_skills() {
    local wf="${1/-workflow/}"
    python3 - <<EOF
import json
m = json.load(open('$MANIFEST'))
for s in m['workflows'].get('$wf', []):
    print(s)
EOF
}

# must-have skills are always installed
MUST_HAVE=()
while IFS= read -r skill; do
    [[ -n "$skill" ]] && MUST_HAVE+=("$skill")
done < <(python3 -c "import json; m=json.load(open('$MANIFEST')); [print(s) for s in m['workflows'].get('must-have', [])]")

SELECTED=()

if [[ ${#SKILLS[@]} -gt 0 ]]; then
    for skill in "${SKILLS[@]}"; do
        [[ $skill != sync-* ]] && skill="sync-$skill"
        SELECTED+=("$skill")
    done

elif [[ ${#WORKFLOWS[@]} -gt 0 ]]; then
    for wf in "${WORKFLOWS[@]}"; do
        while IFS= read -r skill; do
            [[ -n "$skill" ]] && SELECTED+=("$skill")
        done < <(wf_skills "$wf")
    done

else
    # Interactive menu — must-have is hidden (always installed)
    WF_NAMES=()
    while IFS= read -r wf; do
        [[ "$wf" != "must-have" && -n "$wf" ]] && WF_NAMES+=("$wf")
    done < <(python3 -c "import json; m=json.load(open('$MANIFEST')); [print(k) for k in m['workflows'].keys()]")

    WF_COUNT=${#WF_NAMES[@]}
    ALL_NUM=$((WF_COUNT + 1))

    echo ""
    echo "Available workflows:"
    for i in "${!WF_NAMES[@]}"; do
        wf="${WF_NAMES[$i]}"
        cnt=$(python3 -c "import json; m=json.load(open('$MANIFEST')); print(len(m['workflows'].get('$wf', [])))")
        echo "  [$((i+1))] ${wf}-workflow ($cnt skills)"
    done
    echo "  [$ALL_NUM] All (default)"

    read -rp $'\nEnter numbers separated by commas ['"$ALL_NUM"']: ' ANSWER || true
    ANSWER="${ANSWER:-$ALL_NUM}"

    if [[ "$ANSWER" == "$ALL_NUM" || -z "$ANSWER" ]]; then
        for wf in "${WF_NAMES[@]}"; do
            while IFS= read -r skill; do
                [[ -n "$skill" ]] && SELECTED+=("$skill")
            done < <(wf_skills "$wf")
        done
    else
        IFS=',' read -ra PICKS <<< "$ANSWER"
        for pick in "${PICKS[@]}"; do
            idx=$(( ${pick// /} - 1 ))
            if [[ $idx -ge 0 && $idx -lt $WF_COUNT ]]; then
                wf="${WF_NAMES[$idx]}"
                while IFS= read -r skill; do
                    [[ -n "$skill" ]] && SELECTED+=("$skill")
                done < <(wf_skills "$wf")
            fi
        done
    fi
fi

# Merge must-have + selected, deduplicated (bash 3 compatible)
ALL_SELECTED=()
for skill in "${MUST_HAVE[@]}" "${SELECTED[@]}"; do
    already=0
    for existing in "${ALL_SELECTED[@]+"${ALL_SELECTED[@]}"}"; do
        [[ "$existing" == "$skill" ]] && already=1 && break
    done
    [[ $already -eq 0 ]] && ALL_SELECTED+=("$skill")
done

mkdir -p "$SKILLS_DIR"
COUNT=0
for skill in "${ALL_SELECTED[@]+"${ALL_SELECTED[@]}"}"; do
    src="$TMP_DIR/$skill"
    if [[ -d "$src" ]]; then
        cp -r "$src" "$SKILLS_DIR/"
        COUNT=$((COUNT + 1))
    else
        echo "Warning: skill not found in package: $skill" >&2
    fi
done

echo ""
echo "Installed $COUNT skill(s) to $SKILLS_DIR"
echo "Previously installed skills were not removed."
echo "Restart Claude Code to load the skills."
