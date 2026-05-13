---
name: sync-qa-planner
version: 1.0.0
description: >
  Generates a structured QA test plan for Syntactics Inc. from the FDD, frontend task list, and
  backend task list. Replaces sync-qa-tester. Trigger when a QA tester says "generate test plan",
  "create QA plan", "qa planner", "what do I need to test", or after sync-tdd-be and sync-tdd-fe
  complete. Maps every test case to a specific FDD rule - nothing is tested that was not built,
  nothing built is left untested. Always run after backend and frontend implementation and before
  sync-qa-runner in the QA workflow.
outputs: projects/{project-name}/qa/{project-name}-qa-plan.md
triggers: projects/{project-name}/design-dev/{project-name}-backend-tasks.md
approval: false
next: sync-qa-runner
---

# QA Planner

Reads the FDD, frontend task list, and backend task list to produce a structured QA test plan.
Every test case maps to a specific FDD rule. The plan is the input to sync-qa-runner for execution.

Workflow: **sync-tdd-be / sync-tdd-fe - sync-qa-planner - sync-qa-runner**

> Note: sync-qa-tester in design-dev-workflow is deprecated. Use this skill instead.

---

## Before You Start

Confirm inputs:
1. FDD files: all module `.md` files from the BA workflow
2. Frontend task list: `projects/{project-name}/design-dev/{project-name}-frontend-tasks.md`
3. Backend task list: `projects/{project-name}/design-dev/{project-name}-backend-tasks.md`

Read `references/test-plan-format.md` for the exact test case block structure.

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

Write file: `projects/{project-name}/qa/{project-name}-qa-plan.md`

Follow `references/test-plan-format.md` for exact structure.

State the file path, then say:

```
QA test plan generated.

Next: sync-qa-runner - pass {project-name}-qa-plan.md and specify the target environment
(local, staging, or custom URL).
```

---

## Reference Files

- `references/test-plan-format.md` - Test case block structure and classification rules

---

## Output Formatting

- Never use em dashes (--) in any generated .md output. Use a hyphen (-) instead.
