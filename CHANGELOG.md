# Changelog

All notable changes to syntactics-skills are documented here.

## [Unreleased] - 2026-05-21

### Fixed
- `engineering-workflow`: `sync-dev-setup` Section A explainer - replaced generic skill names (`to-issues`, `triage`, `to-prd`, `qa`) with sync equivalents (`sync-qa-to-ticket`, `sync-qa-runner`, `sync-dev-session`, `sync-dev-tdd`)
- `engineering-workflow`: `sync-dev-setup` domain.md - replaced `grill-with-docs` references with `sync-grill-with-docs`
- `README`: added `sync-dev-diagnose`, `sync-improve-codebase-architecture`, and `sync-grill-with-docs` to Engineering skill table; removed `sync-grill-with-docs` from Must-Have table (now lives in `engineering-workflow`)

### Changed
- `ba-workflow`: `sync-final-design` v1.2.0 → v2.0.0 — breaking change: now outputs one markdown file per module to `docs/fdd/{module-slug}.md` instead of a single monolithic `{system-name}-final-design.md`; each file is self-contained with system context and its own `artifact_version` frontmatter; Version Gate checks per-module files instead of a single file; processes one module at a time with per-module progress line
- `qa-workflow`: `sync-qa-planner` v2.1.0 → v3.0.0 — breaking change: now requires one FDD file per module in `docs/fdd/` (hard rejects monolithic FDD); processes one module at a time to stay within context on large codebases; accepts optional module filter at invocation (`/sync-qa-planner user-management invoicing`) to target a subset of modules; Version Gate now checks only selected modules instead of all; prints per-module progress line after each write; QA IDs continue from highest existing ID on partial runs; output path updated from `projects/{project-name}/qa/qa-plan/` to `docs/qa/qa-plan/`
- `qa-workflow`: `sync-qa-runner` v1.1.0 → v1.5.0 — detects the project's active test framework from package.json, composer.json, go.mod, or Gemfile before running or generating any tests; Step 2 API tests now follow detect-first logic: runs existing PHPUnit/Pest/Jest tests if found, falls back to HTTP requests against Swagger YAML only when no framework tests exist, flags Manual when neither exists; Step 2 UI/E2E uses detected framework instead of hardcoded Playwright; Step 3 generates specs in the detected framework's format; updated input and output paths from `projects/{project-name}/qa/qa-plan/` to `docs/qa/qa-plan/`
- `qa-workflow`: `sync-qa-to-ticket` v1.2.0 — updated QA plan path references from `projects/{project-name}/qa/qa-plan/` to `docs/qa/qa-plan/`

## [Unreleased] - 2026-05-20

### Fixed
- `scripts/install.sh` — replaced `declare -A` associative arrays with bash 3.2-compatible equivalents (`find_skill_path` function and `array_contains` helper); fixes crash on macOS where the default `/bin/bash` is v3.2 and does not support associative arrays

## [Unreleased] - 2026-05-19

### Changed
- `ba-workflow`: `sync-database-administrator` renamed to `sync-database-designer` — name now reflects the skill's actual function (schema design, normalization, ERD); updated all internal references across ba-workflow skills and reference files
- `qa-workflow`: `sync-qa-to-ticket` v1.1.0 → v1.2.0 — added area label classification (area:fe, area:be, area:fs); skill auto-classifies each failure by observed behavior symptom (UI symptoms → FE, data/API symptoms → BE, both → FS); new Step 4 presents classified table to QA tester for review and correction before GitHub issues are created; area label bootstrapped in Step 1 with distinct teal colors; area label applied to every created issue

### Added
- `pm-workflow`: `sync-design-to-tasks` v1.0.0 — orchestrator skill that chains sync-ui-task-creator → sync-frontend-task-creator → sync-backend-task-creator in sequence after FDD is complete; gates each stage on the previous output file existing before proceeding
- `docs/adr/0001-version-mismatch-hard-block.md` — ADR: hard-block (not warn-and-gate) on artifact version mismatch; consuming artifact must be regenerated before skill proceeds
- `docs/adr/0002-immediate-upstream-version-check.md` — ADR: each skill checks immediate upstream version only, not full ancestry; cascade propagates one step at a time
- `CONTEXT.md` — added terms: Artifact Version, Source Version, Version Chain, Version Gate, Approval Gate; updated Workflow Sequence diagram with Approval Gate annotation and auto-trigger notation; added Version Chain diagram under Relationships

### Changed
- `sales-workflow`: `sync-proposal-writer` v1.1.0 → v1.2.0 — revision mode now reads only the Revision History section and delta-flagged modules from the requirements file; unchanged modules are copied verbatim from the prior proposal (token optimization)
- `ba-workflow`: `sync-ba-project-intake` v1.0.1 → v1.1.0 — artifact version frontmatter writing added to Phase 4 output; removed per-skill Output Formatting section (now covered by global CLAUDE.md rule)
- `ba-workflow`: `sync-database-administrator` v1.2.0 → v1.3.0 — Version Gate added (hard-blocks if intake doc version changed since last schema generation); artifact version frontmatter writing added to Step 7; removed per-skill Output Formatting section
- `ba-workflow`: `sync-sprint-planner` v1.1.0 → v1.2.0 — Version Gate added (hard-blocks if schema version changed since last sprint task generation); artifact version frontmatter writing added to Step 5; removed per-skill Output Formatting section
- `ba-workflow`: `sync-final-design` v1.1.0 → v1.2.0 — Version Gate added (hard-blocks if sprint tasks or schema changed); progressive reference loading (template-structure.md always; behavior-validation-guide.md deferred to Step 2a; database-standards.md deferred to Step 2c); Approval Gate added to Step 5 (waits for explicit "approve FDD" before triggering sync-design-to-tasks); artifact version frontmatter writing added to Step 4
- `pm-workflow`: `sync-design-to-tasks` v1.0.0 → v1.1.0 — Sprint Map built once in Before You Start and passed to sub-skills; sub-skills skip Step 0 when Sprint Map already in context
- `pm-workflow`: `sync-ui-task-creator` v1.0.0 → v1.1.0 — Version Gate added; Sprint Map skip note added to Step 0; artifact version frontmatter writing added to Step 4; removed per-skill Output Formatting section
- `pm-workflow`: `sync-frontend-task-creator` v1.0.0 → v1.1.0 — Version Gate added; Sprint Map skip note added to Step 0; artifact version frontmatter writing added to Step 5; removed per-skill Output Formatting section
- `pm-workflow`: `sync-backend-task-creator` v1.0.0 → v1.1.0 — Version Gate added; Sprint Map skip note added to Step 0; artifact version frontmatter writing added to Step 4; removed per-skill Output Formatting section
- `qa-workflow`: `sync-qa-planner` v2.0.0 → v2.1.0 — Version Gate added (hard-blocks if FDD, frontend tasks, or backend tasks changed); artifact version frontmatter writing added to Step 5 index.md output; removed per-skill Output Formatting section
- `engineering-workflow`: `sync-dev-session` v1.1.0 → v1.2.0 — Version Gate added (hard-blocks if task list or FDD changed since last session); removed per-skill Output Formatting section
- `engineering-workflow`: `sync-dev-tdd` — added version: 1.1.0 to frontmatter (was missing); updated internal file references from root-relative to `references/` path (tests.md, mocking.md, deep-modules.md, interface-design.md, refactoring.md)
- `CLAUDE.md` — added global Output Formatting rule (no em dashes); added Project Setup copyable block for applying the rule to client project CLAUDE.md files

### Removed
- `deprecated-workflow/` — deleted entirely; `sync-tdd-be` and `sync-tdd-fe` were superseded by `sync-dev-tdd` in engineering-workflow
- Per-skill `## Output Formatting` sections removed from all BA, PM, QA, and Engineering skills — rule now lives globally in CLAUDE.md

### Moved
- `engineering-workflow/sync-dev-tdd`: deep-modules.md, interface-design.md, mocking.md, refactoring.md, tests.md → moved into `references/` subfolder


## [Unreleased] - 2026-05-18

### Changed
- `ba-workflow`: `sync-final-design` v1.0.0 -> v1.1.0 — added explicit module-type classification step (Auth/CRUD/Dashboard/Settings/Approval/Import-Export/File Upload/Notifications); added draft-review gate (Step 3) before Write; added Tables To Use elicitation questions; tightened Pending enforcement rule; defined gather-all-modules-then-write sequencing; moved em-dash and formatting rules into Step 4; clarified Output/Print-out field as export/print only; module list now derived from sprint tasks file (`### {Module Name}` headings) rather than asked — user confirms extracted list before proceeding; Step 1 now reads all three upstream docs (sprint tasks, intake doc, DB schema) before asking anything — each mapped to the FDD fields it pre-populates; Step 2c updated to derive Tables To Use from the schema directly rather than eliciting from the user
- `references/template-structure.md` (`sync-final-design`) — added Output/Print-out field guidance with examples and blank rule
- `references/behavior-validation-guide.md` (`sync-final-design`) — added three new module patterns: Import/Export, File Upload, Notifications

- `design-dev-workflow` renamed to `pm-workflow` — workflow is now run by the PM to generate role-specific task lists for the team
- `sync-ui-designer` renamed to `sync-ui-task-creator`
- `sync-frontend-developer` renamed to `sync-frontend-task-creator`
- `sync-backend-developer` renamed to `sync-backend-task-creator`
- All three skill descriptions updated to trigger on PM phrases and reference pm-workflow ordering
- Artifact output paths updated from `projects/{project-name}/design-dev/` to `projects/{project-name}/pm/`

## [Unreleased] - 2026-05-15

### Added
- `engineering-workflow`: `sync-dev-tdd` — unified TDD skill covering red-green-refactor philosophy, tracer bullets, and vertical slicing; detects session type (BE/FE/FS) and generates Swagger YAML (`docs/api/{module}/{feature}_api.yaml`) for backend and full-stack sessions; frontend-only sessions skip Swagger output
- `references/swagger-output-format.md` (`sync-dev-tdd`) — full OpenAPI 3.0.3 YAML template with shared response schemas and security scheme

### Changed
- `design-dev-workflow`: `sync-ui-designer` — now reads `{project-name}-sprint-tasks.md` from the BA workflow (Step 0); maps Priority N to Sprint N; groups design tasks by sprint in output; delivery message instructs sprint-by-sprint handoff to frontend-developer; removed qa-tester and bug-fixer from workflow chain
- `design-dev-workflow`: `sync-frontend-developer` — now reads sprint plan as required input (Step 0); sprint-by-sprint gate replaces all-design-complete gate; tasks grouped by sprint in output; removed qa-tester and bug-fixer from workflow chain
- `design-dev-workflow`: `sync-backend-developer` — now reads sprint plan as required input (Step 0); tasks grouped by sprint in output; delivery message hands off to sync-dev-session; removed qa-tester and bug-fixer from workflow chain
- `references/task-output-format.md` (`sync-ui-designer`) — summary and task list restructured with sprint sections (Sprint 1, Sprint 2, ...); source header updated to include sprint plan
- `references/task-output-format.md` (`sync-frontend-developer`) — summary and task list restructured with sprint sections; source header updated to include sprint plan
- `references/task-output-format.md` (`sync-backend-developer`) — summary restructured with sprint/category rows; task list split into sprint sections; source header updated to include sprint plan
- `engineering-workflow`: `sync-dev-session` — frontmatter and Step 5 handoffs updated from sync-tdd-be/sync-tdd-fe to sync-dev-tdd
- `engineering-workflow`: `sync-dev-session` v1.0.0 -> v1.1.0 — task-level invocation added (`/sync-dev-session BE-0001 users-module @tasks.md @fdd.md`); session type auto-derived from Task ID prefix and task file; module-scope invocation still supported; session summary filename now uses Task ID when provided (`{Task-ID}-{date}.md`) or module name for module-scope sessions; handoff message updated to task-level `/sync-dev-tdd` invocation
- `engineering-workflow`: `sync-dev-tdd` — description updated with invocation pattern, trigger phrases, and session auto-detect behavior; Before You Start section added; Step 0 replaced with auto-derive session type + scope detection + session mode vs standalone mode logic; session mode loads prior session summary as implementation baseline; standalone mode reads task row + FDD directly
- `references/session-summary-format.md` (`sync-dev-session`) — added `Task ID` field to Context section; filename convention updated to `{Task-ID or module}-{date}.md`
- `qa-workflow`: `sync-qa-planner` v1.0.0 -> v2.0.0 — output changed from a single `{project-name}-qa-plan.md` to a `qa-plan/` directory with `index.md` (module index + test run log) and one `{module-slug}.md` per module (test cases sorted P1 first); QA IDs remain global sequential across all modules; resolves context window, parallel work, navigation, and traceability issues on large projects
- `references/test-plan-format.md` (`sync-qa-planner`) — replaced with two templates: index file format and per-module file format; added numbering rules (global IDs, no restart per module) and module slug derivation rule (kebab-case)
- `qa-workflow`: `sync-qa-runner` v1.0.0 -> v1.1.0 — added Step 0 to read `index.md` and loop one module file at a time; Test Run Log appended to `index.md` after all modules complete; delivery messages updated to reference `index.md`
- `qa-workflow`: `sync-qa-to-ticket` v1.0.0 -> v1.1.0 — reads module list from `index.md` then processes each `{module-slug}.md` for failures; updates Bug Ref in per-module files; delivery message updated to reference `qa-plan/` directory

## [Unreleased] - 2026-05-13

### Added
- `sales-workflow`: `sync-proposal-revision` — handles client feedback and revision rounds on an existing proposal; reads client comments, diffs against the latest requirements version (not always v1), produces a new versioned `{project-name}-requirements-v{N}.md` with a Revision History section and delta summary, then chains to `sync-proposal-writer` and `sync-quotation`

### Changed
- `sales-workflow`: `sync-proposal-writer` v1.0.0 -> v1.1.0 — revision-aware versioning; detects existing proposals to determine the next version number; writes `{project-name}-proposal-v{N}.md` for revisions (first proposal retains no suffix for backward compatibility); adds a "Revision Summary" section to v2+ proposals; self-review checklist includes version label consistency check
- `references/template-structure.md` (`sync-proposal-writer`) — `Version: 1.0` replaced with `Version: {proposal-version}` placeholder; added Revision Summary block template (with note to omit for the initial proposal)

## [Unreleased] - 2026-05-12

### Added
- `engineering-workflow`: `sync-dev-session` — implementation grilling session anchored to FDD; asks BE, FE, or Full-Stack session type; saves structured summary to `docs/sessions/{be|fe|fullstack}/{topic}-{date}.md`; ends with explicit handoff to `sync-tdd-be` or `sync-tdd-fe`
- `engineering-workflow`: `sync-tdd-be` — TDD-driven backend implementation loop per task; generates full Swagger YAML for all API endpoints in the module at once to `docs/api/{module}/{feature}_api.yaml`
- `engineering-workflow`: `sync-tdd-fe` — TDD-driven frontend implementation loop per task; mirrors `sync-tdd-be` pattern without Swagger output
- `engineering-workflow`: `sync-dev-to-fix` — TDD-driven bug fix loop invoked with a GitHub issue link; fetches issue via GitHub MCP, runs failing test - fix - verify cycle, posts completion comment, applies `ready-for-qa` label; blocks on `out-of-scope` issues with `for-ba-confirmation` label
- `qa-workflow`: `sync-qa-planner` — generates structured QA test plan from FDD + frontend/backend task lists; replaces deprecated `sync-qa-tester`; output to `projects/{project-name}/qa/{project-name}-qa-plan.md`
- `qa-workflow`: `sync-qa-runner` — executes test plan live via Playwright MCP (UI/E2E) and HTTP requests (API); marks PASS/FAIL inline; generates reusable Playwright regression spec files to `docs/qa/{module}/{feature}.spec.ts`; supports local, staging, and custom URL environments
- `qa-workflow`: `sync-qa-to-ticket` — converts QA failures and manual findings into GitHub issues via GitHub MCP; auto-bootstraps full label set on first run; applies type + priority + `needs-triage` on creation; never provides fix suggestions; flags out-of-scope issues with `for-ba-confirmation`
- `references/session-summary-format.md` (`sync-dev-session`) — structured session summary template with Context, Decisions Made, Constraints Identified, Open Questions, Next Steps, Risks, and References sections
- `references/swagger-output-format.md` (`sync-tdd-be`) — full OpenAPI 3.0.3 YAML template with shared response schemas and security scheme
- `references/test-plan-format.md` (`sync-qa-planner`) — test case block structure with Execution Type and Test Run Log fields
- Label convention: Type (`bug`, `out-of-scope`, `regression`), Status (`needs-triage`, `ready-for-dev`, `in-fix`, `ready-for-qa`, `verified`), Escalation (`for-ba-confirmation`, `needs-info`), Priority (`P1-critical` through `P4-low`)

### Removed
- `design-dev-workflow`: `sync-qa-tester` — deprecated and removed; replaced by `sync-qa-planner` in `qa-workflow`
- `design-dev-workflow`: `sync-bug-fixer` — removed; replaced by `sync-qa-to-ticket` (issue creation) and `sync-dev-to-fix` (TDD fix execution)

### Changed
- `README.md` — added `engineering-workflow` and `qa-workflow` skill tables; updated workflow sequence diagram to reflect new engineering chain
- `CONTEXT.md` — updated Design&Dev and Engineering workflow sequences

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
