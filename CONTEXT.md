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

### Salesperson Workflow Terms

**Deal Scorecard**:
The chat-only output of `sync-deal-qualify`. A table scoring five qualification dimensions (budget,
decision-maker, timeline, competition, problem clarity) as Green / Yellow / Red, with an overall
go/no-go recommendation. Not written to file - it exists in chat as the qualification record.
_Avoid_: lead score, qualification report, CRM entry

**Deal Health**:
A block inside the discovery brief produced by `sync-sales-discovery`. The rep fills this in
during or immediately after the client meeting, recording budget signal, decision-maker status,
timeline urgency, competitive situation, and an overall Green / Yellow / Red rating. Gates
progression to `sync-requirement-analyzer`.
_Avoid_: deal status, call notes, CRM update

**Call Agenda**:
The structured first-10-minutes script inside the discovery brief produced by `sync-sales-discovery`.
Sequences the call around rapport, pain, and qualification before transitioning to scope and process
questions. Contains targeted questions for any Yellow dimensions flagged in the Deal Scorecard.
_Avoid_: meeting outline, call script, agenda template

**Proposal Cover**:
The sales narrative block prepended to the scope proposal by `sync-proposal-seller`. Contains three
sections: The Outcome (business result from the client's perspective), Why Syntactics (one or more
specific differentiators relevant to this project), and What Happens Next (concrete next action and
Syntactics-side response). Must be written with rep-provided specifics - not AI-generated.
_Avoid_: cover letter, executive summary, intro section

### Sales Workflow Terms

**Discovery Brief**:
The artifact produced by `client-discovery`. A structured summary of a client's goals, project
type, budget, timeline, and tech/design preferences — produced before any requirements exist.
Feeds directly into `requirement-analyzer` as its client input.
_Avoid_: intake notes, pre-brief, onboarding form

**Requirements Document**:
The artifact produced by `requirement-analyzer`. Contains all client modules, user roles,
integrations, constraints, and open items extracted from raw client input.
_Avoid_: brief, notes, client request

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
A new versioned requirements artifact produced by `proposal-revision` when the client
provides feedback on an existing proposal. The revision diffs client comments against the
latest requirements version (not always the original) and produces
`{project-name}-requirements-v{N}.md` with a Revision History section. Triggers a new
versioned proposal and quotation.
_Avoid_: amendment, update, change request (when referring to a formal revision round)

**Delta Summary**:
The list of changes between two consecutive requirements versions, classified as `Added`,
`Removed`, or `Updated`. Produced by `proposal-revision` and surfaced in the Revision
Summary section of the revised proposal.
_Avoid_: diff, changelog (when referring to the client-facing change summary)

### BA Workflow Terms

**Intake Document**:
The artifact produced by `ba-project-intake`. The authoritative source of project scope
for the BA phase — all downstream BA skills read from it.
_Avoid_: brief, requirements (the BA intake is distinct from the sales requirements doc)

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

**Turnover**:
A failed re-run of a QA test case on a ticket that was previously marked `ready-for-qa` after a dev fix. Indicates the fix did not resolve the issue. The ticket is automatically moved back to `ready-for-dev`.
_Avoid_: bounce, re-open, regression (regression is a separate label type for previously passing tests)

**Turnover Count**:
The number of times a ticket has been turned over, tracked via a `turnover:N` label on the GitHub issue. The label is replaced (not accumulated) on each turnover — only one `turnover:N` label exists on a ticket at any time.
_Avoid_: retry count, fix attempts, cycle count

### PM Workflow Terms

**Design Task List**:
The artifact produced by `sync-ui-task-creator`. A screen-by-screen list of Figma design tasks
derived from FDD wireframe specs and the BA sprint plan. Tasks are grouped by sprint —
Sprint N corresponds to Priority N in the BA sprint plan.
_Avoid_: design brief, wireframe list

**Frontend Task List**:
The artifact produced by `sync-frontend-task-creator`. A component-level implementation task list
with API integration specs, validation rules, Figma references, and named backend endpoints. Tasks
are grouped by sprint — sprint-by-sprint gate applies (Sprint N design must complete before Sprint
N FE begins). No TBD endpoints — every API call references a named endpoint from the Backend Task
List.
_Avoid_: FE backlog, frontend tickets

**Backend Task List**:
The artifact produced by `sync-backend-task-creator`. A sprint-grouped implementation task list
covering migrations, models, endpoints, business logic, and integrations. Derived from FDD +
database schema with no dependency on design or frontend tasks. Build order within each sprint
follows Priority 1-6 categories. Serves as the endpoint reference for frontend task generation.
_Avoid_: BE backlog, backend tickets

**Task Pipeline**:
The automated orchestration of all three PM task-creation skills (UI, frontend, backend) in two
stages, triggered by `pm-task-orchestrator` agent. Stage 1 generates backend tasks and UI design
tasks in parallel - both read directly from the FDD with no dependency on each other. Stage 2
generates frontend tasks after both Stage 1 outputs exist — frontend references named endpoints
from backend tasks and Figma IDs from design tasks. Replaces the sequential `sync-design-to-tasks`
skill.
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
The ordered sequence of artifacts whose versions are checked at each handoff:
Intake Document → Schema → Sprint Task List → FDD → PM Task Lists → QA Plan → Dev Session.
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
- The **Proposal** gates entry to the BA workflow — a rejected proposal does not proceed
- The **Quotation** accompanies the **Proposal** but is a separate artifact
- The **salesperson-workflow** bookends the **sales-workflow**: `sync-deal-qualify` and `sync-sales-discovery` run before the scope pipeline; `sync-proposal-seller` and `sync-deal-followup` run after `sync-quotation` before the deal signs
- A **Proposal Cover** (from `proposal-seller`) is a separate layer prepended to the scope proposal - it does not replace the scope content
- A **Proposal Revision** re-enters the sales loop — it produces a new versioned requirements file and a new versioned proposal without restarting from `requirement-analyzer`
- A **Delta Summary** is always diffed against the prior version, never against v1, so revision round 3 captures only what changed from round 2

### Workflow Sequence

```
Salesperson: sync-deal-qualify → sync-sales-discovery
                                         ↓
Sales:       sync-requirement-analyzer → sync-proposal-grill → sync-proposal-writer → sync-quotation
                                                                        ↓ (client revisions)
                                                                sync-proposal-revision → sync-proposal-writer → sync-quotation
                                         ↓ (client approves)
Salesperson: sync-proposal-seller → sync-deal-followup
                                         ↓ (deal signed)
BA:          sync-ba-project-intake → sync-database-designer → sync-sprint-planner → sync-final-design
                                                                                           ↓ (FDD approved — Approval Gate)
PM:         pm-task-orchestrator [Stage 1: sync-backend-task-creator + sync-ui-task-creator (parallel, both from FDD) → Stage 2: sync-frontend-task-creator]
            (agent triggered after FDD approval gate; Stage 1 approval gate before Stage 2; tasks grouped by sprint; no TBD endpoints)
                                                                                           ↓
QA:         sync-qa-planner → sync-qa-runner → sync-qa-to-ticket
Engineering (one-time setup): sync-dev-setup
Engineering (per-task loop):  sync-dev-session → sync-dev-tdd → sync-dev-to-fix → sync-qa-runner (re-run)
```

### Version Chain

```
Intake Doc (v) → Schema (v, checks intake_v)
              → Sprint Task List (v, checks schema_v)
                → FDD (v, checks sprint_tasks_v + schema_v)
                  → PM Task Lists (v, checks fdd_v + sprint_tasks_v)
                    → QA Plan (v, checks fdd_v + frontend_tasks_v + backend_tasks_v)
                      → Dev Session (checks task_v + fdd_v)
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

- "requirements" was used for both the sales `requirement-analyzer` output and the BA intake —
  resolved: **Requirements Document** = sales artifact; **Intake Document** = BA artifact. These are distinct.
- "module" was sometimes used to mean a Figma page, a DB table group, or a feature area —
  resolved: **Module** always means a functional area of the system. Figma pages and DB table groups
  are organized by module but are not modules themselves.
- "estimate" was used for both the quotation hours and sprint task effort — resolved:
  **Quotation** contains hour estimates for Sales; **Sprint Task List** contains no estimates
  (hours are already captured in the quotation).
