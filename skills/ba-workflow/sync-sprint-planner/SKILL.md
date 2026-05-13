---
name: sync-sprint-planner
version: 1.1.0
description: >
  Converts an approved Database Schema into a ready-to-assign sprint task list for Syntactics Inc. Trigger when user says "create the sprint plan", "plan the sprint", "task breakdown", "what tasks do we need", "generate the dev tasks", "break down the schema into tasks", "prepare the tasks for the dev team", "what's the build order", or shares a DB schema and asks what to build. Output is a plain markdown file organized by priority and dependency order — ready for the PM to assign directly to developers.
---

# Sprint Planner

Reads the approved **Database Schema** (and optionally the BA Intake Document) and produces `{project-name}-sprint-tasks.md`. Organized by build order, tagged by role.

> Always runs after **sync-database-administrator** has produced an approved schema.

**Before generating tasks:** read `references/dependency-rules.md` and `references/task-output-format.md`.

---

## Workflow

**1 — Accept inputs**
- Required: DB Schema — tables, types, FK relationships, columns
- Optional: BA Intake Document — module names, RBAC rules, export/notification requirements
- If no intake doc: derive module names from table names

**2 — Derive tasks**
Apply the derivation table in `references/dependency-rules.md` to every table in the schema. One task = one assignable unit of work for a single developer.

If the intake doc is available: add RBAC middleware tasks per module, export tasks, notification tasks.

**3 — Sequence by priority**
Assign priorities 1–6 and populate `Depends On` / `Blocks` columns per `references/dependency-rules.md`.

**4 — Self-review before delivering**
- [ ] Every table has a migration task
- [ ] Every table with FKs has an Eloquent model task
- [ ] Every lookup table has a seeder task
- [ ] Every core entity has at least one BE and one FE task
- [ ] All tasks have exactly one role tag (`BE`, `FE`, `UI/UX`)
- [ ] P1 tasks have no dependencies on other tasks
- [ ] Every task description starts with an action verb and names the specific entity/endpoint

**5 — Deliver**
Output the file using the exact structure in `references/task-output-format.md`. After presenting, add:

```
PM: assign role columns directly. Tasks are ordered by dependency —
Priority 1 must complete before Priority 2 begins, and so on.

Next: sync-final-design — pass both the intake doc and the schema doc.
```

## Constraints

No hour estimation · No person assignment · No tool-specific formatting · No sprint splitting


---

## Output Formatting

- Never use em dashes (--) in any generated .md output. Use a hyphen (-) instead.
