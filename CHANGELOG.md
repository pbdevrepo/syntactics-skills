# Changelog

All notable changes to syntactics-skills are documented here.

## [1.1.4] - 2026-04-24

### Changed
- `database-administrator` v1.0.2 → v1.0.3
  - Added fallback for `ask_user_input_v0`: ask as plain numbered list in chat when tool unavailable
  - Added fallback for `present_files`: state full file path when tool unavailable
  - Fixed duplicate "Use this workflow when the user provides an existing schema" header in Schema Review Mode
  - Added Claude Code path guidance alongside hardcoded `/mnt/user-data/outputs/` (Claude.ai-only path)
  - Fixed Step 5 skip logic contradiction: "check ALL" vs "if ANY is YES" — reworded to "skip if ALL are NO"
  - Removed redundant "Same PK strategy everywhere" anti-pattern entry (fully covered by UUID vs SERIAL guide)

## [1.1.3] - 2026-04-24

### Changed
- `database-administrator` v1.0.1 → v1.0.2
  - Removed ERD text output format — BA will create ERDs manually using a visual tool
  - Removed `## ERD Text Format` section and Step 3 instruction to output ERD text
  - Updated description: removed "ERD creation", "ER diagrams", "entity-relationship modeling" trigger phrases

## [1.1.2] - 2026-04-24

### Changed
- `database-administrator` v1.0.0 → v1.0.1
  - Enforced strict 7-column table format (`Field Name | Data Type | Length | Default Value | Nullable | Description | Constraints`) in `Schema Output Format` section
  - Added wrong-format callout (`| Column | Type | Nullable | Default | Notes |`) as explicit violation with correct alternative
  - Added wrong column table format to Anti-Patterns Checklist

## [1.1.1] - 2026-04-24

### Changed
- `ba-project-intake` v1.0.0 → v1.0.1
  - Description: added trigger phrases (`"project requirements"`, `"client brief"`, `"we got a new project"`)
  - Phase 2: cap inline table at 15 modules; summarize remainder
  - Phase 3: all-clear shortcut (skip questions when no ambiguity), 5–10 question limit, Phase 3b re-loop for answers that open new gaps
  - Phase 4: graceful fallback when `present_files` unavailable
  - `references/question-bank.md`: question limit + prioritization order at top

## [1.1.0] - 2026-04-24

### Added
- `scripts/install.ps1` — Windows one-time install: clones repo, deploys skills, injects auto-update hook into `~/.claude/settings.json`
- `scripts/install.sh` — Mac/Linux equivalent; uses node to safely merge JSON settings
- Auto-update hook: `git pull --ff-only` + `deploy-local.js` fires via `UserPromptSubmit` hook, timestamp-gated to 30-min intervals

## [1.0.0] - 2026-04-24

### Added
- `package.json` with npm scripts: `validate`, `build`, `deploy:local`, `dev`, `bump`
- `scripts/validate-skills.js` — validates frontmatter fields (`name`, `description`, `version`) and semver format; blocks CI on failure
- `scripts/deploy-local.js` — copies all skills to `~/.claude/skills/` for local development
- `scripts/watch.js` — file watcher (chokidar); auto-validates and deploys on `.md` change
- `scripts/bump-version.js` — detects changed skills via git diff, bumps semver in SKILL.md frontmatter
- `scripts/build-skills.js` — packages each skill into a `dist/*.skill` ZIP for distribution
- `.github/workflows/sync-skills.yml` — CI pipeline: validate → bump patch version → build ZIPs → create GitHub Release with skill assets

### Changed
- All 5 `skills/*/SKILL.md` — added `version: 1.0.0` to frontmatter

### Skills
- `ai-content-writer` v1.0.0
- `ba-project-intake` v1.0.0
- `database-administrator` v1.0.0
- `final-design` v1.0.0
- `sprint-planner` v1.0.0
