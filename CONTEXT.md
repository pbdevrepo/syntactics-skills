# Syntactics Skills — Project Context

This repo contains Claude Code skills for the Syntactics Inc. project delivery lifecycle. Skills are
markdown-based agents that guide each team role through their phase of work, producing structured
artifact files that the next role consumes.

---

## Language

### Workflow Concepts

**Skill**:
A markdown agent (`SKILL.md`) that guides a team member through a specific phase of work and
produces a structured artifact file.
_Avoid_: command, tool, plugin, script

**Workflow**:
An ordered sequence of skills belonging to one team role (e.g., `sales-workflow`,
`ba-workflow`, `pm-workflow`). Each skill in a workflow consumes the previous
skill's artifact as input.
_Avoid_: pipeline, process, flow

**Artifact**:
The `.md` output file a skill produces. Artifacts are stored at
`docs/{workflow-phase}/{artifact-name}.md` and serve as the sole input
to the next skill in the sequence.
_Avoid_: output, document, file, deliverable

**Handoff**:
The moment a skill's artifact is passed to the next skill in the workflow. Handoffs are
always explicit — each skill's "Next Step" section names the next skill and the artifact
path to pass.
_Avoid_: transition, pass-off, trigger

**Module**:
A discrete area of functionality within a project (e.g., User Authentication, Dashboard,
Reporting). Modules are the primary unit of organization across all workflow artifacts —
every skill structures its output by module.
_Avoid_: feature, section, component (when referring to a functional area of the system)

**Project Name**:
A kebab-case lowercase identifier for a client project (e.g., `client-portal`). Set once
by the first skill in each workflow and inherited by all downstream skills via the artifact.
_Avoid_: project ID, slug, code name

### Sales Workflow Terms

**Discovery Brief**:
The artifact produced by `client-discovery`. A structured summary of a client's goals, project
type, budget, timeline, and tech/design preferences — produced before any requirements exist.
Feeds directly into `project-intake` as its client input.
_Avoid_: intake notes, pre-brief, onboarding form

**Proposal**:
The client-facing artifact produced by `proposal-writer`. Describes what will be built in
business language — no estimates, no implementation details.
_Avoid_: quote, contract, scope document (when referring to the proposal specifically)

**Quotation**:
The artifact produced by `quotation`. An itemized list of modules and sub-items with
placeholder hour ranges per role (Design, Frontend, Backend). Human-reviewed before
sending to the client.
_Avoid_: estimate, invoice, pricing sheet

**Proposal Revision**:
A new versioned intake artifact produced by `proposal-revision` when the client provides
feedback on an existing proposal. The revision diffs client comments against the latest intake
version (not always the original) and produces `docs/ba/{project-name}-intake-v{N}.md` with
a Revision History section. Triggers a new versioned proposal and quotation.
_Avoid_: amendment, update, change request (when referring to a formal revision round)

**Delta Summary**:
The list of changes between two consecutive intake versions, classified as `Added`,
`Removed`, or `Updated`. Produced by `proposal-revision` and surfaced in the Revision
Summary section of the revised proposal.
_Avoid_: diff, changelog (when referring to the client-facing change summary)

### BA Workflow Terms

**Intake Document**:
The artifact produced by `project-intake`. The single authoritative source of project scope
from first client input through database design. Used in two modes: Pre-Proposal (Draft status,
from client brief/RFP — feeds proposal-grill) and Post-Approval (Approved status, from approved
proposal — feeds database-designer). Stored at `docs/ba/{project-name}-intake.md`.
_Avoid_: brief, requirements, requirements document

**Schema**:
The artifact produced by `database-designer`. Defines all database tables, columns,
relationships, and constraints in `.md` + `.sql` format.
_Avoid_: data model, ERD (when referring to the schema artifact specifically)

**Sprint Task List**:
The artifact produced by `sprint-planner`. An ordered, role-tagged, dependency-sequenced
list of development tasks derived from the schema.
_Avoid_: backlog, ticket list, task breakdown

**FDD (Final Design Document)**:
The artifact produced by `final-design`. The authoritative project specification — contains
module specs, wireframe specs, validation rules, database table usage, and access rules.
Generated per module (one file per module) to stay within model context limits, but
delivered as a complete set.
_Avoid_: spec, design doc, requirements doc (the FDD is the definitive downstream reference)

### Engineering and QA Workflow Terms

**FDD Compliance Check**:
The automated structural audit run at the end of `sync-dev-tdd` (informational) and as the gate
in `dev-orchestrator` Phase 3 (blocking). Scans test files for coverage of each FDD business rule,
validation rule, RBAC rule, and workflow transition. Categorizes gaps as red (zero coverage, hard
block), yellow (partial/indirect coverage, requires confirmation), or green (covered). Blocks GitHub
issue creation when red items exist.
_Avoid_: test coverage report, coverage gate, compliance scan

**Ready-for-QA Issue**:
The GitHub issue created by `dev-orchestrator` Phase 3 after the FDD compliance check passes.
Tracks a single task through QA. Parent to all child bug issues created by `sync-qa-to-ticket`.
Labeled `ready-for-qa` on creation, `verified` on a full-pass QA run, or has child issues labeled
`ready-for-dev` on failure.
_Avoid_: QA ticket, tracking issue, QA parent

**Direct Mode (sync-qa-runner)**:
The invocation mode where `sync-qa-runner` receives a GitHub issue URL and FDD file, derives test
cases inline from the FDD without a pre-generated qa-plan file, and manages issue labels
(`ready-for-qa` to `verified` on all pass). Preferred for all new work. Distinguished from Legacy
Mode, which reads an existing `docs/qa/qa-plan/index.md`.
_Avoid_: new mode, issue-based mode

**QA Run Log**:
The artifact written by `sync-qa-runner` in Direct mode at `docs/qa/qa-runs/{Task-ID}-{date}.md`.
Records derived test cases, execution results, and Bug Ref URLs for any failures. Written after the
run (not before). Replaces the qa-plan file in the new workflow. Used by the turnover mechanism.
_Avoid_: test report, run results, qa-plan (the qa-plan artifact is legacy-only)

**Turnover**:
A failed re-run of a QA test case on a ticket that was previously marked `ready-for-qa` after a dev fix. Indicates the fix did not resolve the issue. The ticket is automatically moved back to `ready-for-dev`.
_Avoid_: bounce, re-open, regression (regression is a separate label type for previously passing tests)

**Turnover Count**:
The number of times a ticket has been turned over, tracked via a `turnover:N` label on the GitHub issue. The label is replaced (not accumulated) on each turnover — only one `turnover:N` label exists on a ticket at any time.
_Avoid_: retry count, fix attempts, cycle count

### PM Workflow Terms

**Design Task List**:
The artifact produced by `task-orchestrator` Stage 1b. A screen-by-screen list of Figma design
tasks derived from FDD wireframe specs and the BA sprint plan. Tasks are grouped by sprint —
Sprint N corresponds to Priority N in the BA sprint plan.
_Avoid_: design brief, wireframe list

**Frontend Task List**:
The artifact produced by `task-orchestrator` Stage 2. A component-level implementation task list
with API integration specs, validation rules, Figma references, and named backend endpoints. Tasks
are grouped by sprint — sprint-by-sprint gate applies (Sprint N design must complete before Sprint
N FE begins). No TBD endpoints — every API call references a named endpoint from the Backend Task
List.
_Avoid_: FE backlog, frontend tickets

**Backend Task List**:
The artifact produced by `task-orchestrator` Stage 1a. A sprint-grouped implementation task list
covering migrations, models, endpoints, business logic, and integrations. Derived from FDD +
database schema with no dependency on design or frontend tasks. Build order within each sprint
follows Priority 1-6 categories. Serves as the endpoint reference for frontend task generation.
_Avoid_: BE backlog, backend tickets

**Task Pipeline**:
The automated two-stage task-generation pipeline run by the `task-orchestrator` agent. Auto-triggered
by `sync-final-design` after FDD approval — no manual PM step required. Detects FDD version drift
on startup and reruns the full pipeline automatically. Stage 1 generates backend tasks and UI design
tasks in parallel - both read directly from the FDD. Stage 2 generates frontend tasks after both
Stage 1 outputs exist — frontend references named endpoints from backend tasks and Figma IDs from
design tasks.
_Avoid_: task batch, bulk task generation, auto-tasks

**Artifact Version**:
A semver identifier (`major.minor.patch`) embedded in every artifact's YAML frontmatter.
Auto-bumped by the producing skill on every write — patch for field edits, minor for adding
or removing modules. Stored as `artifact_version` in the frontmatter block.
_Avoid_: revision number, document version, file version

**Source Version**:
The version of an upstream artifact recorded in a consuming artifact's frontmatter at
generation time (`source_versions:` block). Used by the next downstream skill to detect
whether its input has changed since the consuming artifact was last generated.
_Avoid_: dependency version, input version

**Version Chain**:
The ordered sequence of artifacts whose versions are checked at each handoff.
New path: Intake Document (`docs/ba/`) → Schema → Sprint Task List → FDD → PM Task Lists → Dev Session → QA Run Log.
Legacy path: Intake Document → Schema → Sprint Task List → FDD → PM Task Lists → QA Plan → Dev Session.
Each link checks its immediate upstream only — not the full ancestry.
_Avoid_: version graph, dependency tree, audit trail

**Version Gate**:
A hard block enforced by a skill when its immediate upstream artifact's version does not
match the `source_versions` recorded in the consuming artifact. The consuming artifact must
be regenerated before the skill proceeds. There is no warn-and-continue option.
_Avoid_: version check, staleness warning, version lock

**Approval Gate**:
An explicit confirmation prompt a skill surfaces before auto-triggering the next skill in the
pipeline. Required at high-stakes handoffs where a bad artifact would poison the most
downstream work. The FDD-to-task-pipeline transition is the primary approval gate.
_Avoid_: review step, human-in-the-loop, confirmation dialog

---

## Relationships

- A **Workflow** contains one or more **Skills** in a fixed sequence
- A **Skill** produces exactly one **Artifact** per project run
- An **Artifact** is consumed by the next **Skill** as its primary input
- A **Module** appears consistently across all artifacts — module names must not drift between skills
- A **Handoff** occurs when a skill's artifact is passed to the next skill; it is always initiated by a human
- The **FDD** is the single source of truth for the PM workflow — all PM skills read from it
- The **Proposal** gates entry to the BA design phase — a rejected proposal does not proceed
- The **Quotation** accompanies the **Proposal** but is a separate artifact
- A **Proposal Revision** re-enters the proposal loop — it produces a new versioned intake file (`docs/ba/{project-name}-intake-v{N}.md`) and a new versioned proposal without restarting from `project-intake`
- A **Delta Summary** is always diffed against the prior version, never against v1, so revision round 3 captures only what changed from round 2

### Workflow Sequence

```
Sales:       sync-client-discovery
                      ↓
BA/Sales:    sync-project-intake [Pre-Proposal] → sync-proposal-grill → sync-proposal-writer → sync-quotation
                                                                                ↓ (client revisions)
                                                              sync-proposal-revision → sync-proposal-writer → sync-quotation
                                         ↓ (client approves)
BA:          sync-project-intake [Post-Approval] → sync-database-designer → sync-sprint-planner → sync-final-design
                                                                                           ↓ (FDD approved — Approval Gate)
PM:         task-orchestrator [Stage 1: backend tasks + UI design tasks (parallel, both from FDD) → Stage 2: frontend tasks]
            (auto-triggered after FDD approval; detects FDD drift and reruns automatically; Stage 1 approval gate before Stage 2; no TBD endpoints)
                                                                                           ↓
Engineering (one-time setup): sync-dev-setup
Engineering (per-task loop):  sync-dev-session → sync-dev-tdd [FDD compliance summary]
            dev-orchestrator Phase 3 [FDD compliance gate → GitHub issue: ready-for-qa]
            sync-qa-runner {issue URL} @{fdd}.md [derive from FDD, run, apply verified label]
            → failures: sync-qa-to-ticket (child bug issues) → sync-dev-to-fix → sync-qa-runner (re-run)
            → all pass: issue labeled verified
```

### Version Chain

```
Intake Doc (v, docs/ba/{project-name}-intake.md) → Schema (v, checks intake_v)
                                                 → Sprint Task List (v, checks schema_v)
                                                   → FDD (v, checks sprint_tasks_v + schema_v)
                                                     → PM Task Lists (v, checks fdd_v + sprint_tasks_v)
                                                       → Dev Session (checks task_v + fdd_v)
                                                         → GitHub Issue: ready-for-qa (compliance check against FDD)
                                                           → QA Run Log (docs/qa/qa-runs/{Task-ID}-{date}.md)

Legacy path (existing qa-plan files):
                                                     → PM Task Lists → QA Plan (v, checks fdd_v + frontend_tasks_v + backend_tasks_v)
```

Each skill checks its immediate upstream only. A mismatch triggers a Version Gate — hard block, no warn-and-continue.

---

## Example Dialogue

> **BA:** "The client approved. Do I pass the proposal to ba-project-intake?"
> **Sales:** "Yes — the **proposal** is the source document for the **intake**. ba-project-intake reads
> it the same way it reads any client brief."

> **Designer:** "Do I need to finish all Figma screens before the frontend developer starts?"
> **PM:** "No — work sprint by sprint. Finish Sprint 1 screens first, then hand off to
> `frontend-developer` for Sprint 1 tasks. Sprint 2 design and Sprint 2 FE can follow in sequence."

> **Dev:** "The backend task references FE-0023 as a dependency — does that mean I can't start?"
> **PM:** "No — the **dependency** means FE-0023 needs the endpoint this task produces. You build
> the endpoint first; the frontend task depends on you, not the other way around."

---

## Flagged Ambiguities

- "requirements" was used for both the sales requirements artifact and the BA intake —
  resolved: **Intake Document** is the single artifact for both phases. `sync-project-intake` replaces both `sync-requirement-analyzer` and `sync-ba-project-intake`. The Requirements Document artifact no longer exists.
- "module" was sometimes used to mean a Figma page, a DB table group, or a feature area —
  resolved: **Module** always means a functional area of the system. Figma pages and DB table groups
  are organized by module but are not modules themselves.
- "estimate" was used for both the quotation hours and sprint task effort — resolved:
  **Quotation** contains hour estimates for Sales; **Sprint Task List** contains no estimates
  (hours are already captured in the quotation).
