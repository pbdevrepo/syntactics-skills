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
`ba-workflow`, `design-dev-workflow`). Each skill in a workflow consumes the previous
skill's artifact as input.
_Avoid_: pipeline, process, flow

**Artifact**:
The `.md` output file a skill produces. Artifacts are stored at
`projects/{project-name}/{workflow-phase}/{artifact-name}.md` and serve as the sole input
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

### BA Workflow Terms

**Intake Document**:
The artifact produced by `ba-project-intake`. The authoritative source of project scope
for the BA phase — all downstream BA skills read from it.
_Avoid_: brief, requirements (the BA intake is distinct from the sales requirements doc)

**Schema**:
The artifact produced by `database-administrator`. Defines all database tables, columns,
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

### Design & Dev Workflow Terms

**Design Task List**:
The artifact produced by `ui-designer`. A screen-by-screen list of Figma design tasks
derived from FDD wireframe specs, including fields, states, and role variants.
_Avoid_: design brief, wireframe list

**Frontend Task List**:
The artifact produced by `frontend-developer`. A component-level implementation task list
with API integration specs, validation rules, and Figma references.
_Avoid_: FE backlog, frontend tickets

**Backend Task List**:
The artifact produced by `backend-developer`. A priority-ordered implementation task list
covering migrations, models, endpoints, business logic, and integrations.
_Avoid_: BE backlog, backend tickets

**QA Task List / Test Cases**:
The artifact produced by `qa-tester`. Test cases mapped to FDD validation rules, FE/BE
tasks, role permissions, and workflow steps. Includes pass/fail status and test run log.
_Avoid_: test plan, QA checklist

**Bug Fix Task List**:
The artifact produced by `bug-fixer`. A prioritized list of fix tasks (P1–P4) assigned to
Frontend or Backend, derived from failed QA test cases.
_Avoid_: bug list, issue list, defect log

---

## Relationships

- A **Workflow** contains one or more **Skills** in a fixed sequence
- A **Skill** produces exactly one **Artifact** per project run
- An **Artifact** is consumed by the next **Skill** as its primary input
- A **Module** appears consistently across all artifacts — module names must not drift between skills
- A **Handoff** occurs when a skill's artifact is passed to the next skill; it is always initiated by a human
- The **FDD** is the single source of truth for the Design & Dev workflow — all D&D skills read from it
- The **Proposal** gates entry to the BA workflow — a rejected proposal does not proceed
- The **Quotation** accompanies the **Proposal** but is a separate artifact

### Workflow Sequence

```
Sales:      sync-requirement-analyzer → sync-proposal-grill → sync-proposal-writer → sync-quotation
                                                                                           ↓ (client approves)
BA:         sync-ba-project-intake → sync-database-administrator → sync-sprint-planner → sync-final-design
                                                                                           ↓ (FDD approved)
Design&Dev: sync-ui-designer → sync-frontend-developer → sync-backend-developer → sync-qa-tester ⇄ sync-bug-fixer
```

---

## Example Dialogue

> **BA:** "The client approved. Do I pass the proposal to ba-project-intake?"
> **Sales:** "Yes — the **proposal** is the source document for the **intake**. ba-project-intake reads
> it the same way it reads any client brief."

> **Designer:** "Do I need to wait for all **modules** before I start Figma?"
> **PM:** "Yes — `ui-designer` runs once across all **FDD** module files. All **modules** must be
> complete before the **handoff** to `frontend-developer`."

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
