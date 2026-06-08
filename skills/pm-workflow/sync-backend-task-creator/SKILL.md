---
name: sync-backend-task-creator
version: 1.3.0
description: >
  Generates a module-by-module backend development task list for Syntactics Inc. from the Final
  Design Document (FDD) and the database schema. Trigger when a PM says "generate backend tasks",
  "what does the backend developer need to build", "backend task list", "create backend tasks",
  or "API tasks". Reads FDD module specs, database schema, and business rules to produce an
  implementation task list covering API endpoints and full-framework backend artifacts (Artisan
  commands, Jobs, Events, Listeners, Observers, Scheduled tasks, Service classes, FormRequests).
  Runs in parallel with sync-ui-task-creator — both read directly from the FDD. Frontend tasks
  are generated after both complete.
---

# Backend Task Creator

Read the FDD and the database schema. Produce a structured backend implementation task list.
Tasks cover API endpoints, business logic, database interactions, and integrations - ordered by
dependency so migrations and models are built before endpoints.

Workflow: **Stage 1 (parallel): sync-backend-task-creator + sync-ui-task-creator → Stage 2: sync-frontend-task-creator**

---

## Before You Start

Confirm inputs:
1. FDD files: all module `.md` files from the BA workflow
2. Sprint plan: `docs/ba/{project-name}-sprint-tasks.md`
3. Database schema: `docs/ba/{project-name}-database-schema.md`

Read `references/task-output-format.md` for the exact task block structure before generating.

**Architecture Detection** — before deriving tasks, identify the backend type from the FDD or project notes:

- `api-only` — headless/SPA backend; generate only API endpoint tasks
- `full-stack` — Laravel monorepo with web routes, Blade/Livewire, console commands, queued jobs, events; generate API tasks **plus** all framework-specific backend artifacts

If the architecture type is not stated in the FDD, ask: "Is this an API-only project or a full Laravel monorepo with console commands, jobs, and event listeners?"

**Version Gate** — if `{project-name}-backend-tasks.md` already exists:
1. Read each FDD module file's `artifact_version`, the sprint task list's `artifact_version`, and the database schema's `artifact_version`
2. Compare them to the existing backend task list's `source_versions`
3. If any differ: **hard stop.** Name which artifact changed and say: "Regenerate the backend task list from the updated inputs before proceeding."

Do not warn-and-continue. Regeneration is required.

---

## Workflow

### Step 0 — Build Sprint Map

> If Sprint Map has already been built and shared in context by `sync-design-to-tasks`, skip this step.

Read `docs/ba/{project-name}-sprint-tasks.md`.

For each Priority section (Priority 1 through Priority 6), note which modules appear. Map each
module to its sprint number: Priority 1 = Sprint 1, Priority 2 = Sprint 2, and so on.

If a module has no matching entry in the sprint plan, flag it as unresolved and assign it to the
last sprint.

### Step 1 — Read All Inputs

From the FDD per module, extract only what is needed for implementation tasks:
- Entity names and their field list (name, type, nullable/required) — no prose
- RBAC rules: which role can perform which action per module
- Workflow/status transitions (e.g., draft → pending → approved) — as a list, not narrative
- Integration names and trigger events (not full integration docs)

From the database schema, extract:
- Table names, column definitions, and relationships — cross-reference against FDD entities to catch any schema additions or deviations

### Step 2 — Derive Backend Tasks

Tag every task with the sprint number from the map built in Step 0. Build order within each sprint
always follows this sequence:

```
Priority 1 — Migrations & Models
Priority 2 — Authentication & RBAC
Priority 3 — Core API Endpoints (per module)
Priority 4 — Business Logic & Workflows
Priority 5 — Integrations & Third-Party
Priority 6 — Notifications & Background Jobs
```

**Always generate (API-only and full-stack):**

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

**Full-stack only — also generate:**

| Source | Backend Tasks Generated |
|--------|------------------------|
| Every async/deferred operation | 1x Job class task (queue, payload, retry policy) |
| Every domain event or side-effect trigger | 1x Event class + 1x Listener class per subscriber |
| Every model with audit, cache, or cascade logic | 1x Observer task (creating/updating/deleting hooks) |
| Every recurring automated task | 1x Schedule entry in Kernel + 1x backing Command or Job |
| Every CLI operation (import, sync, cleanup) | 1x Artisan Command task (signature, arguments, options) |
| Every controller action with 3+ validated fields | 1x FormRequest class task (rules, authorize method) |
| Every module with reusable cross-cutting logic | 1x Service class task (methods, injected dependencies) |
| Every mail notification | 1x Mailable class task (template, constructor params) |
| Every real-time feature | 1x Broadcast event task (channel, payload, auth) |

### Step 3 — Self-Review Before Delivering

- [ ] Every entity from the FDD has a migration and model task
- [ ] Every task has a sprint number assigned
- [ ] Every endpoint implied by FDD entities and business rules is explicitly named
- [ ] Every endpoint has server-side validation specified
- [ ] Priority 1 tasks have no dependencies on Priority 2+ tasks
- [ ] Every RBAC rule from the FDD is covered by a policy task
- [ ] No task is vague — "implement POST /api/users with validation for email uniqueness and role assignment" not "build user API"
- [ ] *(full-stack only)* Every async operation has a Job class task with queue and retry policy
- [ ] *(full-stack only)* Every domain event has a matching Event + Listener pair
- [ ] *(full-stack only)* Every scheduled automation has both a Schedule entry and a Command or Job backing it
- [ ] *(full-stack only)* Every Artisan command has its signature, arguments, and options specified

### Step 4 — Deliver

Write file: `docs/pm/{project-name}-backend-tasks.md`

**Artifact version frontmatter:** Write this YAML block at the very top of the file before any other content.

Check if a previous version exists at the output path:
- No previous version: `artifact_version: 1.0.0`
- Previous version exists: read current `artifact_version`, then bump:
  - Any module added or removed → bump minor (e.g. `1.0.0` → `1.1.0`)
  - Any other task edit → bump patch (e.g. `1.0.0` → `1.0.1`)

```yaml
---
artifact_version: {version}
generated_by: sync-backend-task-creator@1.3.0
generated_at: {YYYY-MM-DD}
source_versions:
  fdd_modules:
    {module-slug}: {module fdd artifact_version}
    (one entry per FDD module file read)
  sprint_tasks: {sprint-tasks artifact_version}
  database_schema: {database-schema artifact_version}
---
```

Follow `references/task-output-format.md` for exact structure. Use the **compact table format** by default. Use the detailed block only for endpoints with complex business rules, multi-step side effects, or 5+ request fields that a table row cannot express.

State the file path, then say:

```
Backend tasks generated. Tasks are grouped by sprint.

Next: sync-frontend-task-creator — pass the FDD files, {project-name}-sprint-tasks.md,
{project-name}-database-schema.md, {project-name}-design-tasks.md, and {project-name}-backend-tasks.md.
```

---

## Reference Files

- `references/task-output-format.md` — Task block structure and markdown format


