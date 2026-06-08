# Changelog

All notable changes to syntactics-skills are documented here.

## [Unreleased] - 2026-06-08

### Added
- `ba-workflow`: `sync-database-designer` `references/laravel-packages.md` - new reference covering spatie/laravel-permission (never recreate Spatie tables, permission seed design, morph map, multi-tenancy consideration) and spatie/laravel-activitylog (activity_log table reference, decision matrix for activitylog vs custom history table, log name strategy, properties column query examples, combined-package usage)

### Changed
- `ba-workflow`: `sync-database-designer` v1.3.0 -> v1.4.0 - added Spatie Packages subsection to ORM Compatibility with schema impact rules for spatie/laravel-permission and spatie/laravel-activitylog; updated Step 6 to check for activitylog before designing audit tables; added laravel-packages.md to Reference Files table
- `ba-workflow`: `sync-database-designer` `references/triggers.md` - added row to "Avoid Triggers For" table: audit logging on Eloquent models when spatie/laravel-activitylog is installed should use LogsActivity trait instead of DB triggers
- `ba-workflow`: `sync-database-designer` `references/schema-output-format.md` - added Packages field to document header; added third-party managed tables, models using activitylog, and permission-gated models rows to Design Overview table; split Audit / Log Tables section into Pattern A (spatie/laravel-activitylog - document audit trail inline on the parent table using a standard annotation block, no custom table) and Pattern B (custom history table for non-Eloquent writes, financial ledgers, or structured status-transition queries)

- `pm-workflow`: `sync-backend-task-creator` v1.2.0 -> v1.3.0 - added architecture detection step (api-only vs full-stack) before deriving tasks; expanded "Always generate" table with full-stack-only backend artifacts: Job, Event, Listener, Observer, Schedule, Command, Service, FormRequest, Mailable, Broadcast; added four full-stack checklist items in Step 3; bumped `generated_by` version in frontmatter template
- `pm-workflow`: `sync-backend-task-creator` `references/task-output-format.md` - expanded Type values to include full-stack types (Command, Event, Listener, Observer, Schedule, Service, FormRequest, Mailable, Broadcast); expanded Detail column documentation with per-type guidance; added nine full-stack table row examples (Service, FormRequest, Event, Listener, Observer, Job, Command, Schedule, Mailable)

## [Unreleased] - 2026-06-03

### Changed
- `sales-workflow`: `sync-proposal-writer` v1.5.0 -> v1.6.0 - replaced one-pass Self-Review with a Validate and Fix Loop; writer now fixes each failing check in the proposal file immediately and restarts the checklist from the top; hard gate prevents proceeding to Step 4 until all 12 checks pass; escape hatch added - if the same check fails twice after a fix attempt, stop and flag to Sales before proceeding
- `sales-workflow`: `sync-proposal-writer` v1.4.0 -> v1.5.0 - replaced flat Key Features bullet list in Scope of Work with a 3-level hierarchy: module (H3) → sub-feature/screen/flow (H4) with 1-2 sentence description → UI elements as plain-noun bullets; when a sub-feature contains multiple named forms, bold form name precedes its element list; User Roles line stays at module level; updated Module-by-module Writing Rule to describe the new hierarchy; added two self-review checklist items (H4 sub-feature sections present, UI elements listed per sub-feature)
- `sales-workflow`: `sync-proposal-writer` `references/template-structure.md` - replaced Section 4 module template with hierarchical H3/H4 structure showing module description + User Roles, H4 sub-feature sections with descriptions, optional bold form-name header before element lists, and plain-noun UI element bullets; removed Key Features block

## [Unreleased] - 2026-06-02

### Added
- `salesperson-workflow`: `sync-deal-qualify` v1.0.0 - qualifies new leads before investing BA hours; asks five questions one at a time (budget, decision-maker, timeline, competition, problem clarity), scores each Green/Yellow/Red using scoring-guide.md, and outputs a Deal Scorecard with a go/no-go recommendation to chat; Red budget or 3+ Red dimensions triggers a hold recommendation with explicit risk statement
- `salesperson-workflow`: `sync-sales-discovery` v1.0.0 - qualification-first discovery skill that researches the domain (same four tracks as sync-client-discovery) then structures the call around pain and qualification before scope; outputs a discovery brief with three parts: Pre-Meeting Intel (pre-filled), Call Agenda (first-10-minutes script including targeted questions for any Yellow dimensions from the Deal Scorecard), and Discovery Questions with a Deal Health block the rep fills before the call ends
- `salesperson-workflow`: `sync-proposal-seller` v1.0.0 - adds the sales narrative layer on top of the BA proposal from sync-proposal-writer; prompts the rep for a specific outcome sentence and a specific differentiator (blocks generic answers), then writes a Proposal Cover prepended to the existing proposal file with three sections: The Outcome, Why Syntactics, and What Happens Next
- `salesperson-workflow`: `sync-deal-followup` v1.0.0 - drives the deal forward after the proposal is sent; generates a Day 2/5/10 follow-up schedule with distinct message angles; handles four objection types (price, scope, timing, ghosted) plus competitor-named via objection-playbook.md; ends every follow-up conversation by locking a specific next step with an owner and date

### Changed
- `sales-workflow`: `sync-client-discovery` v2.1.0 -> v2.2.0 - replaced fixed per-flow question template with research-driven generation; added explicit Question Generation Rules to Step 4 (floor questions always included, no ceiling on research-driven questions); questions per flow now derived from distinct roles, handoffs, and exception cases found in research; hypotheses from intel brief inject targeted probe questions into the relevant section; named compliance requirements (HIPAA, GDPR, ISO, etc.) each get a dedicated compliance block instead of collapsing into the generic scope compliance question; high-risk integration watch points trigger additional targeted questions beyond floor integrations
- `sales-workflow`: `sync-client-discovery` `references/output-format.md` - restructured Discovery Questions section to zone [FLOOR] vs [RESEARCH-GENERATED] vs [RESEARCH-TRIGGERED] content; removed identical 4-question template from each flow section; per-flow sections now carry generation instructions instead of static questions; added Compliance block template (conditional, one block per named requirement); added inline comments guiding competitor probe and high-risk integration question injection
- `sales-workflow`: `sync-client-discovery` v1.1.0 -> v2.1.0 - full rewrite to research-first, single-path discovery; removed Interactive/Document mode split entirely; skill now produces one fillable discovery brief per session (Pre-Meeting Intel pre-filled from research, answer spaces for rep to complete during the client meeting); added mandatory pre-discovery research phase across four tracks (domain intelligence, competitive landscape, process flow mapping, integration points) targeting credible sources (Gartner, Forrester, APQC, industry associations, ISO standards); replaced static question bank with process-flow-anchored questions generated dynamically from research; added `[PRE-DISCOVERY INTEL]` brief shown to sales rep before file is written; added conditional sub-questions per answer type (manual / existing tool / not done yet / competitor named) embedded in the output file; industry/sector is now a required input to drive compliance and standards research
- `sales-workflow`: `sync-client-discovery` `references/output-format.md` - full rewrite to fillable discovery brief template; Pre-Meeting Intel section (pre-filled: competitive landscape table, process flows table, hypotheses, watch points); Discovery Questions section (process-flow-anchored with WHY annotations and answer spaces; conditional sub-questions inline); Post-Meeting Summary section (rep fills after meeting: root cause, success definition, confirmed modules, hypotheses confirmed/denied); single file feeds directly to sync-requirement-analyzer

### Removed
- `sales-workflow`: `sync-client-discovery` `references/question-bank.md` - removed entirely; replaced by research-driven dynamic question generation in SKILL.md

## [Unreleased] - 2026-05-25

### Changed
- `scripts/install.ps1` - suppress default `Invoke-WebRequest` byte counter; add ASCII progress bar `[====  ] 67%` during skill copy loop
- `scripts/install.sh` - add ASCII progress bar `[====  ] 67%` during skill copy loop
- `ba-workflow`: `sync-final-design` v2.0.0 -> v2.1.0 - introduced `docs/fdd/index.md` as the single home for General Instructions, Figma link, and a linked module directory; removed General Instructions block from individual module files; index.md carries the same artifact version frontmatter as module files and is included in the Version Gate check; module list in index.md is rewritten fresh on each run

## [Unreleased] - 2026-05-22

### Added
- `pm-workflow`: `sync-design-to-stories` v1.0.0 - analyzes design mockup images (PNG/JPG/PDF) and generates structured user stories and acceptance criteria per page with MP/US/AC IDs; standalone skill with no dependency on other pm-workflow skills; outputs `docs/pm/{project-name}-user-stories.md`

### Added
- `pm-workflow`: `pm-task-orchestrator` agent v1.0.0 - replaces `sync-design-to-tasks`; orchestrates the full task-creation pipeline in two stages: Stage 1 generates backend tasks and UI design tasks independently (both read directly from FDD), Stage 2 generates frontend tasks after both Stage 1 outputs exist; includes an approval gate between stages; backend tasks now reference FDD + database schema with no dependency on frontend tasks; frontend tasks reference named backend endpoints from Stage 1 output with no TBD endpoints

### Removed
- `pm-workflow`: `sync-design-to-tasks` skill - replaced by `pm-task-orchestrator` agent

### Changed
- `pm-workflow`: `sync-backend-task-creator` v1.1.0 -> v1.2.0 - removed `frontend-tasks.md` as input; added `database-schema.md` as required input; removed TBD endpoint resolution step (was reading from frontend tasks); updated self-review checklist to verify all FDD-implied endpoints are explicitly named; updated `source_versions` frontmatter (removed `frontend_tasks`, added `database_schema`)
- `pm-workflow`: `sync-ui-task-creator` v1.1.0 -> v1.2.0 - updated workflow notation to reflect parallel Stage 1 structure; updated handoff message to include `backend-tasks.md` for downstream frontend task generation
- `pm-workflow`: `sync-frontend-task-creator` v1.1.0 -> v1.2.0 - added `backend-tasks.md` as required input; updated Step 3 Depends On instruction to read named endpoint from backend task list (flag as data error if missing, never TBD); added `backend_tasks` to `source_versions` frontmatter; updated handoff message
- `sales-workflow`: `sync-proposal-grill` v1.0.0 -> v1.1.0 - inherited three patterns from `sync-grill-with-docs`: sharpen fuzzy language rule (propose canonical terms when vague ones appear), concrete scenario stress-testing (invent failure scenarios per module), and inline document updates (update requirements doc as each item is resolved rather than batching at the end); added hard-to-reverse scope decision flagging; updated Grilling Summary to include flagged decisions
- `sales-workflow`: `sync-client-discovery` v1.0.0 -> v1.1.0 - added sharpen fuzzy language rule with concrete examples for Interactive Mode; added concrete scenario probing rule to force precise answers on broad feature descriptions; fixed em dashes and arrow characters throughout
- `sales-workflow`: `sync-proposal-revision` v1.0.0 -> v1.1.0 - added sharpen fuzzy language rule for parsing client feedback (propose canonical interpretation before classifying); strengthened flag-ambiguity rule to explicitly block applying any change that Sales cannot resolve; fixed em dashes and arrow characters throughout
- `sales-workflow`: `sync-proposal-writer` v1.2.0 -> v1.3.0 - added rule to surface hard-to-reverse scope decisions in the Assumptions section with a one-line rationale; updated self-review checklist to verify Assumptions coverage; tightened Writing Rules tone (no hedging, no implementation details); fixed em dashes and arrow characters throughout
- `sales-workflow`: `sync-quotation` v1.0.0 -> v1.1.0 - added explicit note that ranges exist so Sales can see the spread and adjust with confidence (do not compress); added no-single-number-estimates check to self-review; tightened sub-item rules tone; fixed em dashes and arrow characters throughout
- `sales-workflow`: `sync-requirement-analyzer` v1.0.0 -> v1.1.0 - added sharpen fuzzy terms rule in Phase 3 with concrete examples; added cross-reference note in Phase 1 to flag inconsistent terminology across the document; fixed em dashes and arrow characters throughout

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
