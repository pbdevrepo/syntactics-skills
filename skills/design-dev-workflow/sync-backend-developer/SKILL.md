---
name: sync-backend-developer
version: 1.0.0
description: >
  Generates a module-by-module backend development task list for Syntactics Inc. from the Final
  Design Document (FDD) and the completed frontend task list. Trigger when a backend developer says
  "generate backend tasks", "what do I need to build on the backend", "backend task list",
  "create backend tasks", "API tasks", or after frontend-developer completes. Reads FDD module
  specs, database schema, business rules, and frontend task API requirements to produce an
  implementation task list. Always run after frontend-developer and before qa-tester in the
  design-dev workflow.
outputs: projects/{project-name}/design-dev/{project-name}-backend-tasks.md
triggers: projects/{project-name}/design-dev/{project-name}-frontend-tasks.md
approval: false
next: sync-qa-planner
---

# Backend Developer

Reads the FDD and the frontend task list to produce a structured backend implementation task list.
Tasks cover API endpoints, business logic, database interactions, and integrations — ordered by
dependency so migrations and models are built before endpoints.

Workflow: **ui-designer → frontend-developer → backend-developer → qa-tester → bug-fixer**

---

## Before You Start

Confirm inputs:
1. FDD files: all module `.md` files from the BA workflow
2. Frontend task list: `projects/{project-name}/design-dev/{project-name}-frontend-tasks.md`

Read `references/task-output-format.md` for the exact task block structure before generating.

---

## Workflow

### Step 1 — Read All Inputs

From the FDD per module, extract only what is needed for implementation tasks:
- Entity names and their field list (name, type, nullable/required) — no prose
- RBAC rules: which role can perform which action per module
- Workflow/status transitions (e.g., draft → pending → approved) — as a list, not narrative
- Integration names and trigger events (not full integration docs)

From the frontend task list, extract:
- Every endpoint marked TBD — task ID, associated resource, and HTTP method — to resolve and name them

### Step 2 — Derive Backend Tasks

Build order — always follow this sequence:

```
Priority 1 — Migrations & Models
Priority 2 — Authentication & RBAC
Priority 3 — Core API Endpoints (per module)
Priority 4 — Business Logic & Workflows
Priority 5 — Integrations & Third-Party
Priority 6 — Notifications & Background Jobs
```

**Always generate:**

| Source | Backend Tasks Generated |
|--------|------------------------|
| Every entity/table in FDD | 1x migration task + 1x model + relationships |
| Lookup/config tables | 1x seeder task |
| Auth requirement | Full auth task set (login, register, token, middleware) |
| RBAC requirement | 1x policy/middleware task per module |
| Every list endpoint | 1x GET list with filter, search, pagination |
| Every detail endpoint | 1x GET single record |
| Every create form | 1x POST with server-side validation |
| Every edit form | 1x PUT/PATCH with server-side validation |
| Every delete action | 1x DELETE or archive endpoint |
| Every approval/workflow step | 1x status-change endpoint + business logic |
| Every notification trigger | 1x notification task |
| Every integration | 1x integration setup task |
| Every export/report | 1x export endpoint |

### Step 3 — Self-Review Before Delivering

- [ ] Every entity from the FDD has a migration and model task
- [ ] Every TBD endpoint in the frontend task list is now named and scoped
- [ ] Every endpoint has server-side validation specified
- [ ] Priority 1 tasks have no dependencies on Priority 2+ tasks
- [ ] Every RBAC rule from the FDD is covered by a policy task
- [ ] No task is vague — "implement POST /api/users with validation for email uniqueness and role assignment" not "build user API"

### Step 4 — Deliver

Write file: `projects/{project-name}/design-dev/{project-name}-backend-tasks.md`

Follow `references/task-output-format.md` for exact structure. Use the **compact table format** by default. Use the detailed block only for endpoints with complex business rules, multi-step side effects, or 5+ request fields that a table row cannot express.

State the file path, then say:

```
Backend tasks generated. Complete all backend tasks before proceeding.

Next: qa-tester — pass the FDD files, {project-name}-frontend-tasks.md, and {project-name}-backend-tasks.md.
```

---

## Reference Files

- `references/task-output-format.md` — Task block structure and markdown format


---

## Output Formatting

- Never use em dashes (--) in any generated .md output. Use a hyphen (-) instead.
