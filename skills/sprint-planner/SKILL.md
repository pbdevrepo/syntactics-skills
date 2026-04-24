---
name: sprint-planner
description: >
  Use this skill to convert an approved Database Schema into a ready-to-assign development task list for Syntactics Inc. Trigger whenever the user says "create the sprint plan", "plan the sprint", "task breakdown", "what tasks do we need", "generate the dev tasks", "break down the schema into tasks", or shares a DB schema and asks what to build. Also trigger when a PM says "prepare the tasks for the dev team", "what's the build order", or "create the task list for [project]". Output is a plain markdown file organized by priority and dependency order — ready for the PM to assign directly to developers. Always use this skill after the database-administrator skill has produced its approved schema output.
---

# Sprint Planner Skill

Reads the approved **Database Schema** (and optionally the BA Intake Document) and produces a **Sprint Task List** as a `.md` file. Output is organized by build order (dependency-first), tagged by role, and linked back to the source table or module that generated each task.

The PM uses this to assign work directly. No estimation — hours are already in the quotation. No tool-specific formatting — plain markdown throughout.

## Before You Start

1. Read `references/task-output-format.md` — exact markdown structure, task block format, and tagging conventions.
2. Read `references/dependency-rules.md` — standard build order, dependency logic, and how to derive tasks from the DB schema.
3. Confirm the DB schema file is available before proceeding. If the BA Intake Document is also provided, use it to enrich module context — but the schema is the primary source.

---

## Workflow

### Step 1 — Read Input Documents

Accept as uploaded files, pasted content, or prior conversation output.

**Required — DB Schema (`{project-name}-database-schema.md`):**
- All table names and their types (core entity, lookup, junction, audit/history)
- FK relationships → determines migration order (parent before child)
- Which tables are lookup/config tables → determines which need seeders
- Column details → informs what backend logic and validations are needed

**Optional — BA Intake Document (`{project-name}-intake.md`):**
- Module names and descriptions → use for task labeling and grouping
- User roles → informs RBAC tasks
- Non-functional requirements → may add tasks (e.g., performance, export, notifications)
- Open questions → flag any that block task definition

If no intake doc is provided, derive module names from the table names in the schema.

### Step 2 — Derive All Tasks

For every table in the DB schema, generate tasks using `references/dependency-rules.md`.

One task = one discrete, assignable unit of work a single developer can own.

**From the DB Schema — always generated:**

| Source | Tasks Generated |
|--------|----------------|
| Every table | 1x `[BE]` migration task |
| Every table with FK relationships | 1x `[BE]` Eloquent model + relationships task |
| Lookup / config tables (roles, statuses, categories) | 1x `[BE]` seeder task |
| Core entity tables | 1x `[BE]` API endpoint task + 1x `[FE]` list/detail page task |
| Core entity tables with write operations | 1x `[BE]` create/update/delete logic + 1x `[FE]` form page task |
| Core entity tables with validations | 1x `[BE]` server-side validation + 1x `[FE]` client-side validation |
| Auth-related tables (users, roles, sessions) | Full auth task set — see Priority 2 in dependency-rules.md |
| Junction tables | No extra tasks — covered by parent module tasks |
| Audit / history tables | 1x `[BE]` trigger or logging task |

**From the Intake Document (if available):**
- Module names → use for task labels (e.g., "— User Management" suffix)
- RBAC rules from user roles section → 1x `[BE]` middleware/policy task per module
- Export/report requirements → 1x `[BE]` export task + 1x `[FE]` trigger task
- Notification requirements → 1x `[BE]` notification task

### Step 3 — Assign Priority and Dependencies

Using `references/dependency-rules.md`, sequence all tasks into the standard build order:

```
Priority 1 — DB Migrations + Models + Seeders
Priority 2 — Authentication & RBAC
Priority 3 — Core entity modules
Priority 4 — Dependent feature modules
Priority 5 — Reporting, exports, notifications
Priority 6 — QA prep tasks
```

For each task, identify:
- **Depends on:** which task(s) must be done first
- **Blocks:** which task(s) cannot start until this is done

Flag ambiguous dependencies with ⚠️ Dependency Note.

### Step 4 — Generate the Markdown File

Use `create_file`. File name: `{project-name}-sprint-tasks.md` (kebab-case, lowercase).

Follow the exact structure in `references/task-output-format.md`.

### Step 5 — Self-Review Before Delivering

- [ ] Every table in the DB schema has a migration task
- [ ] Every table with FKs has an Eloquent model task
- [ ] Every lookup table has a seeder task
- [ ] Every core entity has at least one BE and one FE task
- [ ] No task is missing a role tag (`[BE]`, `[FE]`, `[UI]`)
- [ ] Priority 1 tasks have no dependencies on other tasks
- [ ] Every task is specific enough to assign — not "implement user management" but "implement GET /api/users with pagination and search filters"
- [ ] Unresolved items section is populated if any gaps were found

### Step 6 — Deliver

Use `present_files`. After presenting, add inline:

```
PM: assign role columns directly. Tasks are ordered by dependency —
Priority 1 must complete before Priority 2 begins, and so on.

Next: final-design — pass both the intake doc ({project-name}-intake.md)
and the schema doc ({project-name}-database-schema.md).
```

---

## What This Skill Does NOT Do

- **No hour estimation** — already in the quotation breakdown
- **No person assignment** — PM decides based on team availability
- **No tool formatting** — plain markdown only
- **No sprint splitting** — PM distributes tasks across sprints based on capacity
- **No FDD required** — tasks are derived from the DB schema; FDD is a downstream output

---

## Reference Files

- `references/task-output-format.md` — Full markdown output structure and task block format
- `references/dependency-rules.md` — Build order rules, schema-to-task derivation, dependency patterns