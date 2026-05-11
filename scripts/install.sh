#!/usr/bin/env bash
set -euo pipefail

REPO="pbdevrepo/syntactics-skills"
TMP_ZIP="/tmp/syntactics-skills-$$.zip"
TMP_DIR="/tmp/syntactics-skills-$$"

WORKFLOWS=()
SKILLS=()
INSTALL_SCOPE=""

while [[ $# -gt 0 ]]; do
    case $1 in
        --workflow) WORKFLOWS+=("$2"); shift 2 ;;
        --skill)    SKILLS+=("$2");    shift 2 ;;
        --global)   INSTALL_SCOPE="global"; shift ;;
        --local)    INSTALL_SCOPE="local"; shift ;;
        *)          echo "Unknown option: $1" >&2; exit 1 ;;
    esac
done

cleanup() { rm -f "$TMP_ZIP"; rm -rf "$TMP_DIR"; }
trap cleanup EXIT

echo "Downloading latest skills..."
curl -fsSL "https://github.com/${REPO}/archive/refs/heads/main.zip" -o "$TMP_ZIP"
mkdir -p "$TMP_DIR"
unzip -q -o "$TMP_ZIP" -d "$TMP_DIR"

SKILLS_ROOT="$TMP_DIR/syntactics-skills-main/skills"

# Determine install location
if [[ "$INSTALL_SCOPE" == "local" ]]; then
    SKILLS_DIR="$(pwd)/.claude/skills"
elif [[ "$INSTALL_SCOPE" == "global" ]]; then
    SKILLS_DIR="$HOME/.claude/skills"
else
    echo ""
    echo "Install location:"
    echo "  [1] Global — available in all projects (~/.claude/skills) (default)"
    echo "  [2] Local  — current project only (./.claude/skills)"
    read -rp $'\nEnter number [1]: ' LOC_ANSWER || true
    LOC_ANSWER="${LOC_ANSWER:-1}"
    if [[ "${LOC_ANSWER// /}" == "2" ]]; then
        SKILLS_DIR="$(pwd)/.claude/skills"
    else
        SKILLS_DIR="$HOME/.claude/skills"
    fi
fi

get_wf_skills() {
    find "$1" -mindepth 1 -maxdepth 1 -type d -name 'sync-*' | sort | while read -r d; do basename "$d"; done
}

# must-have skills are always installed
MUST_HAVE=()
if [[ -d "$SKILLS_ROOT/must-have-workflow" ]]; then
    while IFS= read -r skill; do
        [[ -n "$skill" ]] && MUST_HAVE+=("$skill")
    done < <(get_wf_skills "$SKILLS_ROOT/must-have-workflow")
fi

# Discover workflow dirs (excluding must-have-workflow), sorted
WF_DIRS=()
while IFS= read -r dir; do
    [[ -n "$dir" ]] && WF_DIRS+=("$dir")
done < <(find "$SKILLS_ROOT" -mindepth 1 -maxdepth 1 -type d -name '*-workflow' | grep -v 'must-have-workflow' | sort)

SELECTED=()

if [[ ${#SKILLS[@]} -gt 0 ]]; then
    for skill in "${SKILLS[@]}"; do
        [[ $skill != sync-* ]] && skill="sync-$skill"
        SELECTED+=("$skill")
    done

elif [[ ${#WORKFLOWS[@]} -gt 0 ]]; then
    for wf in "${WORKFLOWS[@]}"; do
        wf_key="${wf%-workflow}-workflow"
        wf_path="$SKILLS_ROOT/$wf_key"
        if [[ ! -d "$wf_path" ]]; then
            avail=$(for d in "${WF_DIRS[@]+"${WF_DIRS[@]}"}"; do basename "$d" | sed 's/-workflow$//'; done | paste -sd ', ')
            echo "Warning: workflow not found: ${wf%-workflow}  (available: $avail)" >&2
        else
            while IFS= read -r skill; do
                [[ -n "$skill" ]] && SELECTED+=("$skill")
            done < <(get_wf_skills "$wf_path")
        fi
    done

else
    WF_COUNT=${#WF_DIRS[@]}
    ALL_NUM=$((WF_COUNT + 1))

    echo ""
    echo "Available workflows:"
    for i in "${!WF_DIRS[@]}"; do
        wf_dir="${WF_DIRS[$i]}"
        wf_name=$(basename "$wf_dir" | sed 's/-workflow$//')
        cnt=$(get_wf_skills "$wf_dir" | wc -l | tr -d ' ')
        echo "  [$((i+1))] ${wf_name}-workflow ($cnt skills)"
    done
    echo "  [$ALL_NUM] All (default)"

    read -rp $'\nEnter numbers separated by commas ['"$ALL_NUM"']: ' ANSWER || true
    ANSWER="${ANSWER:-$ALL_NUM}"

    if [[ "$ANSWER" == "$ALL_NUM" || -z "$ANSWER" ]]; then
        for wf_dir in "${WF_DIRS[@]+"${WF_DIRS[@]}"}"; do
            while IFS= read -r skill; do
                [[ -n "$skill" ]] && SELECTED+=("$skill")
            done < <(get_wf_skills "$wf_dir")
        done
    else
        IFS=',' read -ra PICKS <<< "$ANSWER"
        for pick in "${PICKS[@]}"; do
            idx=$(( ${pick// /} - 1 ))
            if [[ $idx -ge 0 && $idx -lt $WF_COUNT ]]; then
                while IFS= read -r skill; do
                    [[ -n "$skill" ]] && SELECTED+=("$skill")
                done < <(get_wf_skills "${WF_DIRS[$idx]}")
            fi
        done
    fi
fi

# Merge must-have + selected, deduplicated
ALL_SELECTED=()
for skill in "${MUST_HAVE[@]+"${MUST_HAVE[@]}"}" "${SELECTED[@]+"${SELECTED[@]}"}"; do
    already=0
    for existing in "${ALL_SELECTED[@]+"${ALL_SELECTED[@]}"}"; do
        [[ "$existing" == "$skill" ]] && already=1 && break
    done
    [[ $already -eq 0 ]] && ALL_SELECTED+=("$skill")
done

mkdir -p "$SKILLS_DIR"
COUNT=0
for skill in "${ALL_SELECTED[@]+"${ALL_SELECTED[@]}"}"; do
    for wf_dir in "$SKILLS_ROOT"/*/; do
        src="${wf_dir}${skill}"
        if [[ -d "$src" ]]; then
            dest="$SKILLS_DIR/$skill"
            [[ -d "$dest" ]] && rm -rf "$dest"
            cp -r "$src" "$SKILLS_DIR/"
            COUNT=$((COUNT + 1))
            break
        fi
    done
done

echo ""
echo "Installed $COUNT skill(s) to $SKILLS_DIR"
echo "Previously installed skills were not removed."
echo "Restart Claude Code to load the skills."
