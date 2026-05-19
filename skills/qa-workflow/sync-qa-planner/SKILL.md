---
name: sync-qa-planner
version: 2.1.0
description: >
  Generates a structured QA test plan for Syntactics Inc. from the FDD, frontend task list, and
  backend task list. Replaces sync-qa-tester. Trigger when a QA tester says "generate test plan",
  "create QA plan", "qa planner", "what do I need to test", or after sync-tdd-be and sync-tdd-fe
  complete. Maps every test case to a specific FDD rule - nothing is tested that was not built,
  nothing built is left untested. Always run after backend and frontend implementation and before
  sync-qa-runner in the QA workflow.
---

# QA Planner

Reads the FDD, frontend task list, and backend task list to produce a structured QA test plan.
Every test case maps to a specific FDD rule. The plan is the input to sync-qa-runner for execution.

Workflow: **sync-tdd-be / sync-tdd-fe - sync-qa-planner - sync-qa-runner**

> Note: sync-qa-tester (formerly in design-dev-workflow, now pm-workflow) is deprecated. Use this skill instead.

---

## Before You Start

Confirm inputs:
1. FDD files: all module `.md` files from the BA workflow
2. Frontend task list: `projects/{project-name}/pm/{project-name}-frontend-tasks.md`
3. Backend task list: `projects/{project-name}/pm/{project-name}-backend-tasks.md`

Read `references/test-plan-format.md` for the exact test case block structure.

**Version Gate** — if `projects/{project-name}/qa/qa-plan/index.md` already exists:
1. Read the FDD module file(s)' `artifact_version`, the frontend task list's `artifact_version`, and the backend task list's `artifact_version`
2. Compare them to the existing QA plan's `source_versions`
3. If any differ: **hard stop.** Name which artifact changed and say: "Regenerate the QA plan from the updated inputs before proceeding."

Do not warn-and-continue. Regeneration is required.

---

## Workflow

### Step 1 — Read All Inputs

From the FDD, extract per module:
- All validation rules and field constraints - become negative test cases
- All business rules and conditional logic - become functional test cases
- All user roles and access rules - become access control test cases
- All workflow steps (approvals, status changes) - become flow test cases

From the frontend task list, extract:
- All screens and states (loading, empty, error) - become UI test cases
- All client-side validations - become form test cases

From the backend task list, extract:
- All API endpoints - become API test cases
- All server-side validations - become validation test cases

Before deriving test cases, derive the `{module-slug}` for each module by kebab-casing the module name from the FDD (e.g. "User Management" -> `user-management`). This becomes the per-module output file name.

### Step 2 — Derive Test Cases

**Always generate:**

| Source | Test Cases Generated |
|--------|---------------------|
| Every form | Happy path submit, required field missing, invalid format, boundary values |
| Every list screen | Default load, search returns results, search returns empty, filter applied |
| Every detail screen | Valid record loads, invalid/deleted record returns 404 |
| Every create/edit endpoint | Success, duplicate record, missing required field, unauthorized role |
| Every delete/archive | Success, record not found, unauthorized role |
| Every role/permission rule | Authorized access succeeds, unauthorized access is blocked |
| Every workflow step | Forward path (approve/complete), reverse path (reject/cancel), invalid state transition |
| Every integration | Successful call, failed/timeout response, invalid credentials |
| Every notification trigger | Notification sent on trigger, not sent when condition not met |
| Auth flows | Valid login, wrong password, expired token, locked account |

### Step 3 — Classify Each Test Case

Tag every test case:
- **Type:** `Functional` / `UI` / `API` / `Access Control` / `Integration` / `Regression`
- **Priority:** `P1-critical` / `P2-high` / `P3-medium` / `P4-low`
- **Expected result:** pass/fail criteria must be explicit — no ambiguous outcomes

### Step 4 — Self-Review Before Delivering

- [ ] Every FDD validation rule has at least one negative test case
- [ ] Every user role has at least one access control test case per module
- [ ] Every API endpoint (GET, POST, PUT, DELETE) has a happy path and at least one failure case
- [ ] Every workflow step has a forward and reverse path test
- [ ] No test case has an ambiguous expected result

### Step 5 — Deliver

Write to directory: `projects/{project-name}/qa/qa-plan/`

Files to write:
- `qa-plan/index.md` - module index and test run log
- `qa-plan/{module-slug}.md` - one file per module, test cases sorted P1 first

QA IDs are global and sequential across all modules (QA-0001, QA-0002...). Do not restart per module.

**Artifact version frontmatter:** Write this YAML block at the very top of `index.md` before any other content.

Check if a previous version exists:
- No previous version: `artifact_version: 1.0.0`
- Previous version exists: read current `artifact_version`, then bump:
  - Any module added or removed → bump minor (e.g. `1.0.0` → `1.1.0`)
  - Any other test case edit → bump patch (e.g. `1.0.0` → `1.0.1`)

```yaml
---
artifact_version: {version}
generated_by: sync-qa-planner@2.1.0
generated_at: {YYYY-MM-DD}
source_versions:
  fdd_modules:
    {module-slug}: {module fdd artifact_version}
    (one entry per FDD module file read)
  frontend_tasks: {frontend-tasks artifact_version}
  backend_tasks: {backend-tasks artifact_version}
---
```

Follow `references/test-plan-format.md` for exact structure of both file types.

State the directory path, then say:

```
QA test plan generated.

Modules: {list each module-slug.md}

Next: sync-qa-runner - pass projects/{project-name}/qa/qa-plan/index.md and specify the
target environment (local, staging, or custom URL).
```

---

## Reference Files

- `references/test-plan-format.md` - Test case block structure and classification rules

