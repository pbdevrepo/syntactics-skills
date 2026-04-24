# Task Output Format Reference

## File Naming

`{project-name}-sprint-tasks.md` — kebab-case, lowercase

Examples: `lundgreens-sprint-tasks.md`, `quotation-app-sprint-tasks.md`

---

## Full Document Structure

~~~markdown
# {Project Name} — Sprint Task List

**Project:** {Project / System Name}
**Prepared by:** {PM or BA Name}
**Date:** {date}
**Source:** {FDD filename} + {DB Schema filename}
**Status:** Draft | Ready for Assignment

---

## Summary

| Role | Total Tasks |
|---|---|
| UI/UX | {count} |
| Front-end | {count} |
| Back-end | {count} |
| **Total** | {count} |

> Tasks are ordered by build dependency — complete Priority 1 before starting Priority 2.
> Assign based on team availability. Hours are in the quotation document.

---

## Priority 1 — DB Migrations

{task blocks}

## Priority 2 — Authentication & RBAC

{task blocks}

## Priority 3 — Core Modules

{task blocks}

## Priority 4 — Dependent Modules

{task blocks}

## Priority 5 — Reporting, Exports & Notifications

{task blocks — omit section if not applicable}

## Priority 6 — QA Preparation

{task blocks}

---

## Dependency Map

{see format below}

---

## Open Items

{flags and notes for PM — see format below}
~~~

---

## Task Block Format

Each task is one row in a table under its priority section.
Tasks are grouped by module within each priority section.

~~~markdown
### {Module Name}
> FDD reference: {module name as it appears in the FDD}

| ID | Task | Role | Depends On | Blocks |
|---|---|---|---|---|
| T-001 | {specific, assignable task description} | BE | — | T-008, T-012 |
| T-002 | {task description} | FE | T-001 | T-009 |
| T-003 | {task description} | UI/UX | — | T-002 |
~~~

### Task ID Convention

Format: `T-{sequential number}` — numbered globally across the entire document, not per module.

Start at `T-001` and increment. Never restart per section or module.

### Role Tags

Use exactly these three values — no variations:

| Tag | Meaning |
|---|---|
| `UI/UX` | Design work — wireframe implementation, component design |
| `FE` | Front-end development — React/Vue/Blade UI implementation |
| `BE` | Back-end development — Laravel controllers, models, migrations, APIs |

A single task gets ONE role tag. If a task requires two roles (e.g., an API endpoint AND a UI component), split it into two separate tasks.

### Task Description Rules

- Start with an action verb: "Implement", "Create", "Build", "Set up", "Add", "Configure"
- Be specific enough that a developer knows exactly what to build
- Reference the module and entity by name

**Too vague:**
- "User management backend"
- "Implement login"

**Correct:**
- "Create `users` migration with all columns per DB schema"
- "Implement POST `/api/auth/login` endpoint with email + password validation and session creation"
- "Build user list page with data table, search input, and status filter dropdown"
- "Add `can:manage-users` middleware to all User Management routes"

### Depends On / Blocks Columns

- Use task IDs: `T-001`, `T-002`
- Multiple dependencies: `T-001, T-003`
- No dependency: `—`
- A task with no dependencies can start immediately
- A task that blocks nothing: `—` in the Blocks column

---

## Dependency Map Section

A plain-text summary of the critical path — the chain of tasks that must complete sequentially.

~~~markdown
## Dependency Map

**Critical path:**
T-001 (users migration) → T-004 (auth login API) → T-005 (login UI) → T-009 (dashboard)

**Can run in parallel after T-001:**
- T-002 roles migration → T-003 permissions migration → T-006 (RBAC middleware)
- T-007 products migration → T-008 (product list API) → T-010 (product list UI)

**No dependencies (can start immediately):**
T-001, T-002, T-007
~~~

---

## Open Items Section

Flags for the PM — things that need a decision before a task can be assigned or started.

~~~markdown
## Open Items

| # | Item | Source | Action Required | Owner |
|---|---|---|---|---|
| OI-001 | {description of the blocker or question} | {FDD module or DB schema} | {what needs to happen} | PM / BA / Client |
~~~

Examples:
- FDD module has `Pending` in System Behavior — task can't be written until behavior is confirmed
- DB schema has `TBD` tables — migration task can't be ordered until tables are defined
- Two modules share a table not yet in the schema — dependency can't be resolved

---

## DB Migration Task Format

Migration tasks always go in Priority 1. Each table in the schema gets its own task.
Order them so parent tables (no FKs) appear before child tables (have FKs pointing elsewhere).

~~~markdown
### DB Migrations
> Source: {DB schema filename}

| ID | Task | Role | Depends On | Blocks |
|---|---|---|---|---|
| T-001 | Create `roles` migration | BE | — | T-003, T-006 |
| T-002 | Create `users` migration | BE | T-001 | T-004, T-008 |
| T-003 | Create `permissions` migration | BE | T-001 | T-006 |
| T-004 | Create `role_user` pivot migration | BE | T-001, T-002 | T-007 |
| T-005 | Seed default roles and permissions | BE | T-003, T-004 | T-007 |
~~~

Seeder tasks come after all migrations they depend on. Mark clearly as "Seed" not "Create migration".

---

## QA Prep Task Format

Priority 6 tasks are not feature tasks — they're setup tasks for QA handoff.

~~~markdown
### QA Preparation
> To be completed before UAT begins

| ID | Task | Role | Depends On | Blocks |
|---|---|---|---|---|
| T-NNN | Set up staging environment and seed test data | BE | All P1–P5 tasks | UAT |
| T-NNN | Write Postman collection for all API endpoints | BE | All BE tasks | UAT |
| T-NNN | Cross-browser test all UI screens (Chrome, Firefox, Safari) | FE | All FE tasks | UAT |
| T-NNN | Verify all role-based access restrictions function correctly | BE | T-RBAC tasks | UAT |
~~~