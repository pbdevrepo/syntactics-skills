---
name: qa-tester
version: 1.0.0
description: >
  Generates a module-by-module QA test case list for Syntactics Inc. from the Final Design Document
  (FDD), frontend task list, and backend task list. Trigger when a QA tester says "generate test
  cases", "what do I need to test", "QA tasks", "create test plan", "test case list", or after
  backend-developer completes. Maps test cases directly to implemented features and FDD validation
  rules. Always run after backend-developer and before bug-fixer in the design-dev workflow.
---

# QA Tester

Reads the FDD, frontend task list, and backend task list to produce a structured QA test case list.
Every test case maps to a specific feature from the FDD — nothing is tested that wasn't built,
nothing built is left untested.

Workflow: **ui-designer → frontend-developer → backend-developer → qa-tester → bug-fixer**

---

## Before You Start

Confirm inputs:
1. FDD files: all module `.md` files from the BA workflow
2. Frontend task list: `output/{project-name}/design-dev/{project-name}-frontend-tasks.md`
3. Backend task list: `output/{project-name}/design-dev/{project-name}-backend-tasks.md`

Read `references/test-case-format.md` for the exact test case block structure.

---

## Workflow

### Step 1 — Read All Inputs

From the FDD, extract per module:
- All validation rules and field constraints → become negative test cases
- All business rules and conditional logic → become functional test cases
- All user roles and access rules → become access control test cases
- All workflow steps (approvals, status changes) → become flow test cases

From the frontend task list, extract:
- All screens and states (loading, empty, error) → become UI test cases
- All client-side validations → become form test cases

From the backend task list, extract:
- All API endpoints → become API test cases
- All server-side validations → become validation test cases

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
- **Priority:** `P1 — Critical` / `P2 — High` / `P3 — Medium` / `P4 — Low`
- **Expected result:** pass/fail criteria must be explicit — no ambiguous outcomes

### Step 4 — Self-Review Before Delivering

- [ ] Every FDD validation rule has at least one negative test case
- [ ] Every user role has at least one access control test case per module
- [ ] Every API endpoint (GET, POST, PUT, DELETE) has a happy path and at least one failure case
- [ ] Every workflow step has a forward and reverse path test
- [ ] No test case has an ambiguous expected result

### Step 5 — Deliver

Write file: `output/{project-name}/design-dev/{project-name}-qa-tasks.md`

Follow `references/test-case-format.md` for exact structure.

State the file path, then say:

```
QA test cases generated. Run all tests against the built system.

If bugs are found: next is bug-fixer — pass {project-name}-qa-tasks.md with failed cases marked.
If all tests pass: the Design & Dev phase is complete.
```

---

## Reference Files

- `references/test-case-format.md` — Test case block structure and classification rules
