---
name: sync-ui-designer
version: 1.0.0
description: >
  Generates a module-by-module design task list for the UI/UX Designer at Syntactics Inc. from the
  Final Design Document (FDD). Trigger when a designer says "start the design tasks", "what do I
  need to design", "generate design tasks", "design task list", or after final-design completes and
  the project moves to the Design & Dev phase. Reads FDD wireframe specs and validation rules to
  produce a structured Figma task list per module. Always run first in the design-dev workflow —
  before frontend-developer, backend-developer, qa-tester, and bug-fixer.
---

# UI Designer

Reads the Final Design Document (FDD) and produces a structured design task list for the UI/UX
Designer. The designer uses this to build Figma screens — one task per screen or component.

Workflow: **ui-designer → frontend-developer → backend-developer → qa-tester → bug-fixer**

---

## Before You Start

Ask: **"What is the project name?"** and **"Where are the FDD files located?"**

Accept FDD as: file path(s), uploaded `.md` files, or pasted content. If the FDD is split per
module, collect all module files before proceeding — all modules must be completed before
frontend-developer begins.

Read `references/task-output-format.md` for the exact task block structure before generating.

---

## Workflow

### Step 1 — Read All FDD Modules

For each module FDD, extract only what is needed to generate design tasks:
- Screen/view names and their types (list, form, detail, modal, dashboard, auth)
- User roles per screen
- Field names and required/optional status — field names only, not validation prose
- Explicit design constraints or UI notes stated in the FDD

Do not carry full behavior or validation narrative into context — that detail lives in the FDD and is not needed for design tasks.

### Step 2 — Derive Design Tasks

For each module, generate one design task per distinct screen or component.

**Always generate:**

| Source | Design Tasks Generated |
|--------|----------------------|
| List/index view | 1x list screen with table, search, filter, pagination |
| Detail/view page | 1x detail screen showing all fields |
| Create form | 1x create form with all required/optional fields |
| Edit form | 1x edit form (can reference create form if identical) |
| Delete/archive | 1x confirmation modal or inline action |
| Dashboard / summary | 1x dashboard screen per role that has one |
| Login / auth screens | 1x per auth flow (login, register, forgot password) |
| Modal or drawer | 1x per distinct modal interaction |
| Empty states | 1x empty state per list screen |
| Error states | 1x error/validation state per form |

**Role-based views:** if different roles see different versions of the same screen, generate one
task per role variant.

### Step 3 — Self-Review Before Delivering

- [ ] Every module in the FDD has at least one design task
- [ ] Every form task includes a list of fields from the FDD
- [ ] Every screen task references its module and FDD section
- [ ] Role-specific variants are listed separately
- [ ] No task is vague — "design user list screen" not "design user module"

### Step 4 — Deliver

Write file: `projects/{project-name}/design-dev/{project-name}-design-tasks.md`

Follow `references/task-output-format.md` for exact structure. Use the **compact table format** by default. Use the detailed block only for screens with complex design constraints (multi-step flows, conditional layouts, role-specific layout variants) that a table row cannot express.

State the file path, then say:

```
Design tasks generated. Complete all Figma screens before proceeding.

Next: frontend-developer — pass the FDD files and {project-name}-design-tasks.md.
```

---

## Reference Files

- `references/task-output-format.md` — Task block structure and markdown format
