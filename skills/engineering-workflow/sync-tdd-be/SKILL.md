---
name: sync-tdd-be
version: 1.0.0
description: >
  TDD backend implementation — failing test → implement → refactor loop per backend task, anchored
  to FDD. Generates Swagger YAML after tests pass. Trigger: "start backend TDD", "implement backend",
  "tdd backend". Run after sync-dev-session, before sync-qa-planner.
---

# TDD - Backend Developer

Drives backend implementation task-by-task using a failing test - implement - refactor loop.
The FDD is the behavior contract. The backend task list is the execution roadmap. Both are required.

Workflow: **sync-dev-session - sync-tdd-be - sync-qa-planner**

---

## Before You Start

Confirm inputs:
1. Module name — the specific module being implemented
2. Backend task list: `projects/{project-name}/design-dev/{project-name}-backend-tasks.md`
3. FDD file — the relevant module section for expected behavior

All backend tasks for the module must be present in the task list before proceeding.

---

## Workflow

### Step 1 — Load the Module Tasks

From `{project-name}-backend-tasks.md`, extract all tasks for the specified module in priority order:
```
Priority 1 - Migrations and Models
Priority 2 - Authentication and RBAC
Priority 3 - Core API Endpoints
Priority 4 - Business Logic and Workflows
Priority 5 - Integrations and Third-Party
Priority 6 - Notifications and Background Jobs
```

### Step 2 — TDD Loop (repeat per task)

For each task, execute this loop:

**1. Write the failing test first**
- Read the FDD section for the expected behavior this task implements
- Write a test that asserts the expected behavior — it must fail before implementation
- For API tasks: write an integration test covering happy path + at least one failure case
- For model/migration tasks: write a unit test covering constraints and relationships
- For business logic: write a unit test per business rule from the FDD

**2. Implement the minimum code to make it pass**
- Write only enough code to satisfy the test — no extras
- Cross-reference the FDD to confirm behavior matches the spec exactly

**3. Refactor**
- Clean up without changing behavior
- Confirm tests still pass after refactor

**4. Mark the task complete before moving to the next**

### Step 3 — Generate Swagger YAML (API tasks only)

After all tasks in the module are complete, generate the full Swagger YAML for all API endpoints
in the module at once.

Output file: `docs/api/{module}/{feature}_api.yaml`

Follow `references/swagger-output-format.md` for the exact YAML structure.

Include for each endpoint:
- Path, method, summary, and description
- Request body schema (with required fields and validation rules from FDD)
- Response schemas: 200/201 success, 400 validation error, 401 unauthorized, 403 forbidden, 404 not found, 500 server error
- Security scheme (Bearer token where RBAC applies)
- Tags matching the module name

### Step 4 — Self-Review Before Delivering

- [ ] Every task has a corresponding test written before implementation
- [ ] Every test references the FDD rule it is asserting
- [ ] All tests pass after implementation
- [ ] Every API endpoint has a Swagger entry with at least 3 response schemas
- [ ] No business logic exists without a test covering it

### Step 5 — Deliver

State the Swagger file path, then say:

```
Backend implementation complete for {module}.
Swagger: docs/api/{module}/{feature}_api.yaml

Next: sync-qa-planner - pass the FDD files, {project-name}-frontend-tasks.md,
and {project-name}-backend-tasks.md.
```

---

## Reference Files

- `references/swagger-output-format.md` - Swagger YAML structure and field conventions

---

## Output Formatting

- Never use em dashes (--) in any generated .md output. Use a hyphen (-) instead.
