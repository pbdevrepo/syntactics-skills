---
name: sync-frontend-developer
version: 1.0.0
description: >
  Generates a module-by-module frontend development task list for Syntactics Inc. from the Final
  Design Document (FDD) and the completed design task list. Trigger when a frontend developer says
  "generate frontend tasks", "what do I need to build on the frontend", "frontend task list",
  "create frontend tasks", or after ui-designer completes. Reads FDD module specs, validation rules,
  and design tasks to produce an implementation task list. Always run after ui-designer and before
  backend-developer in the design-dev workflow.
outputs: projects/{project-name}/design-dev/{project-name}-frontend-tasks.md
triggers: projects/{project-name}/design-dev/{project-name}-design-tasks.md
approval: false
next: sync-backend-developer
---

# Frontend Developer

Reads the FDD and the completed design task list to produce a structured frontend implementation
task list. Tasks are component-level, assignable, and reference the FDD and Figma screens.

Workflow: **ui-designer → frontend-developer → backend-developer → qa-tester → bug-fixer**

---

## Before You Start

Confirm inputs:
1. FDD files: all module `.md` files from the BA workflow
2. Design task list: `projects/{project-name}/design-dev/{project-name}-design-tasks.md`

All UI design tasks must be marked complete before this skill runs.

Read `references/task-output-format.md` for the exact task block structure before generating.

---

## Workflow

### Step 1 — Read All Inputs

From the FDD per module, extract only what is needed for implementation tasks:
- Screen/view names and their types (list, form, detail, modal, dashboard, auth)
- Field names, types, and validation rule per field — rule only, not full prose
- API method + endpoint per screen (or note TBD if not yet scoped)
- Which roles access each screen and what action they can take
- Any explicit conditional logic flags (note that it exists; do not copy full behavior prose)

From the design task list, extract:
- DESIGN-{N} ID and screen name per screen — for Figma Ref column only

### Step 2 — Derive Frontend Tasks

One task = one discrete, implementable unit a single frontend developer can own.

**Always generate:**

| Source | Frontend Tasks Generated |
|--------|------------------------|
| Every list/index screen | 1x list component with table, search, filter, pagination |
| Every form screen (create) | 1x create form with client-side validation |
| Every form screen (edit) | 1x edit form (or note it reuses create form) |
| Every detail/view screen | 1x detail page component |
| Delete/archive action | 1x confirmation modal component |
| Dashboard | 1x dashboard layout + 1x per widget/KPI card |
| Auth screens | 1x per screen (login, register, forgot password) |
| Role-based views | 1x per role variant if screens differ |
| API integration per screen | 1x API call setup (GET, POST, PUT, DELETE) per screen |
| Global layout | 1x navigation, sidebar, header/footer (once per project) |
| Error / empty states | 1x per screen that requires it |

### Step 3 — Tag Each Task

Every task must be tagged:
- **Role:** `[FE]`
- **Module:** module name from FDD
- **Depends on:** which backend API endpoint it needs (flag if not yet built)
- **Figma ref:** corresponding DESIGN-{N} task ID

### Step 4 — Self-Review Before Delivering

- [ ] Every design task has a corresponding frontend implementation task
- [ ] Every form task lists all fields and validation rules from the FDD
- [ ] Every API call task names the endpoint (or flags it as TBD if backend not yet scoped)
- [ ] Navigation and global layout tasks are included
- [ ] No task is vague — "implement paginated user list with search and role filter" not "build user list"

### Step 5 — Deliver

Write file: `projects/{project-name}/design-dev/{project-name}-frontend-tasks.md`

Follow `references/task-output-format.md` for exact structure. Use the **compact table format** by default. Use the detailed block only for tasks with complex conditional logic, 5+ API calls, or role-specific UI branching that a table row cannot express.

State the file path, then say:

```
Frontend tasks generated. Complete all frontend tasks before proceeding.

Next: backend-developer — pass the FDD files and {project-name}-frontend-tasks.md.
```

---

## Reference Files

- `references/task-output-format.md` — Task block structure and markdown format


---

## Output Formatting

- Never use em dashes (--) in any generated .md output. Use a hyphen (-) instead.
