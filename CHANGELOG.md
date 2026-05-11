# Changelog

All notable changes to syntactics-skills are documented here.

## [Unreleased] - 2026-05-11

### Added
- `content-workflow`: `sync-web-content-writer` - write and optimize static web pages (homepages, service pages, about pages, landing pages, FAQ sections, portfolio entries) for Google and AI agent citation
- `content-workflow`: `sync-article-writer` - write and optimize blog posts and articles (how-to guides, listicles, opinion pieces, pillar content, news articles) for Google and AI agent citation
- `content-workflow`: `sync-content-strategist` - audit existing content for SEO and AI readability issues, rewrite top flagged sections, and produce prioritized content strategy recommendations
- `references/intake.md` (all content skills) - pre-writing intake checklist: required client context before any content is produced, with mode-specific fields and `[FILL IN]` fallback convention

### Changed
- `content-workflow` references: deliverable format defined per skill (title tag, meta, H1, body, FAQ, schema type note)
- `references/audit-rewrite.md`: default rewrite scope added (top 3 flagged sections in full; remaining issues listed with one-line fix each)
- `references/schema-snippets.md`: usage gate added - templates only for explicit JSON-LD requests or full audits
- `references/article-writing.md`: removed hardcoded "26 years" from opinion piece template; replaced with `[X] years` placeholder

### Removed
- `content-workflow`: `sync-ai-content-writer` - replaced by the three focused skills above

## [Unreleased] - 2026-05-11

### Added
- `sales-workflow`: `sync-client-discovery` — pre-requirement discovery skill for clients with no brief; generates structured questions across business goals, project type, budget/timeline, and tech/design preferences; produces a `{project-name}-discovery.md` artifact that feeds into `sync-requirement-analyzer`

## [Unreleased] - 2026-05-06

### Added
- `sales-workflow`: `requirement-analyzer`, `proposal-grill`, `proposal-writer`, `quotation` — full Sales lifecycle from client requirements to itemized quotation
- `design-dev-workflow`: `ui-designer`, `frontend-developer`, `backend-developer`, `qa-tester`, `bug-fixer` — full Design & Dev lifecycle from FDD to verified build
- `CONTEXT.md` — canonical domain language, workflow relationships, and terminology across all three workflows
- Artifact path convention: `projects/{project-name}/{workflow-phase}/{artifact}.md`
- CLI tool (`bin/cli.js`) for one-command installation: `npx syntactics-skills@latest add pbdevrepo/syntactics-skills`
- GitHub Actions workflow to build and release with source code ZIP
- Simplified installation: no local scripts needed, just npx command downloads from GitHub releases

### Removed
- `scripts/build.sh`, `scripts/deploy-local.sh`, `scripts/validate.sh`, `scripts/bump-version.sh` - replaced with CLI and CI
- `scripts/link-skills.sh`, `scripts/list-skills.sh` - replaced with direct CLI functionality
- Local build and versioning scripts - now handled entirely through GitHub releases

### Changed
- `final-design` — updated Handoff Chain to point downstream to `ui-designer`
- Installation simplified to single npx command that downloads and installs skills from GitHub releases
- CI/CD now creates releases with default source code ZIP instead of building individual `.skill` ZIPs
- Removed npm publishing - skills distributed via GitHub releases only

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
