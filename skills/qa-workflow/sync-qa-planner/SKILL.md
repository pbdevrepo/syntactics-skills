---
name: sync-qa-planner
version: 3.0.0
description: >
  Generates a structured QA test plan for Syntactics Inc. from split FDD module files, frontend task
  list, and backend task list. Replaces sync-qa-tester. Trigger when a QA tester says "generate test
  plan", "create QA plan", "qa planner", "what do I need to test", or after sync-tdd-be and
  sync-tdd-fe complete. Processes one module at a time to handle large codebases. Accepts an optional
  module filter: /sync-qa-planner user-management invoicing. Always run after backend and frontend
  implementation and before sync-qa-runner in the QA workflow.
---

# QA Planner

Read split FDD module files, the frontend task list, and the backend task list. Produce a
structured QA test plan. Every test case maps to a specific FDD rule. Process one module at a time
to stay within context on large codebases. The plan is the input to sync-qa-runner for execution.

Workflow: **sync-tdd-be / sync-tdd-fe - sync-qa-planner - sync-qa-runner**

> Note: sync-qa-tester (formerly in design-dev-workflow, now pm-workflow) is deprecated. Use this skill instead.

---

## Before You Start

### Check invocation arguments

If module slugs were passed as arguments (e.g. `/sync-qa-planner user-management invoicing`), capture
them as the **module filter**. If no arguments were passed, the run targets all modules.

### Confirm inputs

1. FDD module files: `docs/fdd/{module-slug}.md` — one file per module (required, see format check below)
2. Frontend task list: `docs/pm/{project-name}-frontend-tasks.md`
3. Backend task list: `docs/pm/{project-name}-backend-tasks.md`

Read `references/test-plan-format.md` for the exact test case block structure.

### FDD format check — hard requirement

List the files in `docs/fdd/`. If a single monolithic FDD file is found instead of one file per
module, **hard stop** immediately:

```
The QA planner requires one FDD file per module in docs/fdd/.
A monolithic FDD was detected. Split it into per-module files before running this skill.
Expected format: docs/fdd/{module-slug}.md (one file per module)
```

Do not warn-and-continue. The split is required.

### Version Gate

If `docs/qa/qa-plan/index.md` already exists:

1. Determine the target modules — either the module filter (if passed) or all modules
2. For each target module only, read its FDD file's `artifact_version` and compare it to the
   existing QA plan's `source_versions` entry for that module
3. Also compare the frontend task list's `artifact_version` and backend task list's
   `artifact_version` against `source_versions`
4. If any differ: **hard stop.** Name which artifact changed and say: "Regenerate the QA plan from
   the updated inputs before proceeding."

Do not check non-targeted modules. Do not warn-and-continue. Regeneration is required.

---

## Workflow

### Step 1 — Build the module list

List all files in `docs/fdd/`. Derive the module list in directory order.

If a module filter was passed, restrict the list to only those slugs. If a slug in the filter does
not match any file in `docs/fdd/`, hard stop and name the unrecognised slug.

### Step 2 — Process each module

For each module in the list, execute Steps 2a through 2d before moving to the next module.
Never load multiple module files into context at once.

#### Step 2a — Read inputs for this module

Read:
- `docs/fdd/{module-slug}.md`
- `docs/pm/{project-name}-frontend-tasks.md` (filter to sections for this module)
- `docs/pm/{project-name}-backend-tasks.md` (filter to sections for this module)

#### Step 2b — Derive test cases

From the FDD module file, extract:
- All validation rules and field constraints - become negative test cases
- All business rules and conditional logic - become functional test cases
- All user roles and access rules - become access control test cases
- All workflow steps (approvals, status changes) - become flow test cases

From the frontend task list (this module's sections), extract:
- All screens and states (loading, empty, error) - become UI test cases
- All client-side validations - become form test cases

From the backend task list (this module's sections), extract:
- All API endpoints - become API test cases
- All server-side validations - become validation test cases

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

#### Step 2c — Classify each test case

Tag every test case:
- **Type:** `Functional` / `UI` / `API` / `Access Control` / `Integration` / `Regression`
- **Priority:** `P1-critical` / `P2-high` / `P3-medium` / `P4-low`
- **Expected result:** pass/fail criteria must be explicit - no ambiguous outcomes

#### Step 2d — Self-review before writing

- [ ] Every FDD validation rule has at least one negative test case
- [ ] Every user role has at least one access control test case
- [ ] Every API endpoint (GET, POST, PUT, DELETE) has a happy path and at least one failure case
- [ ] Every workflow step has a forward and reverse path test
- [ ] No test case has an ambiguous expected result

Write `docs/qa/qa-plan/{module-slug}.md` with test cases sorted P1 first.

QA IDs are global and sequential across all modules (QA-0001, QA-0002...). Do not restart per module.
Continue from the highest existing ID when adding to an existing plan.

Print one progress line immediately after writing:

```
[{n}/{total}] {module-slug}.md — {count} test cases written
```

### Step 3 — Write the index

After all modules are processed, write `docs/qa/qa-plan/index.md`.

**Artifact version frontmatter:** Write this YAML block at the very top of `index.md` before any other content.

Check if a previous version exists:
- No previous version: `artifact_version: 1.0.0`
- Previous version exists: read current `artifact_version`, then bump:
  - Any module added or removed → bump minor (e.g. `1.0.0` → `1.1.0`)
  - Any other test case edit → bump patch (e.g. `1.0.0` → `1.0.1`)

```yaml
---
artifact_version: {version}
generated_by: sync-qa-planner@3.0.0
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

### Step 4 — Deliver

```
QA test plan generated.

Modules: {list each module-slug.md}
Total test cases: {N}

Next: sync-qa-runner - pass docs/qa/qa-plan/index.md and specify the
target environment (local, staging, or custom URL).
```

---

## Reference Files

- `references/test-plan-format.md` - Test case block structure and classification rules
