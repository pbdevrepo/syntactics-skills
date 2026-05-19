---
name: sync-qa-runner
version: 1.1.0
description: >
  Executes the QA test plan for Syntactics Inc. using live Playwright MCP for UI/E2E tests and HTTP
  requests for API tests. Marks each test case PASS or FAIL inline in the plan. Generates reusable
  Playwright regression spec files. Trigger when a QA tester says "run tests", "execute test plan",
  "qa runner", "start qa run", or after sync-qa-planner completes. Supports local, staging, and
  custom URL environments. Always run after sync-qa-planner and before sync-qa-to-ticket in the
  QA workflow. Also used for re-runs after sync-dev-to-fix applies a fix.
---

# QA Runner

Executes the QA test plan live — UI tests via Playwright MCP, API tests via HTTP against the
generated Swagger YAML. Marks each test case inline and generates regression spec files as a
side artifact.

Workflow: **sync-qa-planner - sync-qa-runner - sync-qa-to-ticket**

Re-run workflow: **sync-dev-to-fix - sync-qa-runner (targeted re-run)**

---

## Before You Start

Confirm inputs:
1. QA test plan index: `projects/{project-name}/qa/qa-plan/index.md`
2. Environment target — ask if not specified:

```
Which environment should tests run against?
- Local (http://localhost:{port})
- Staging ({staging URL})
- Custom URL
```

3. Swagger YAML files for API tests: `docs/api/{module}/{feature}_api.yaml`

---

## Workflow

### Step 0 — Load Module List

Read `qa-plan/index.md`. Extract the list of module files from the Module Index table.
Execute Steps 1-3 once per module file in the order listed in the index.
Complete all test cases in one module before moving to the next.

### Step 1 — Set Environment

Confirm the base URL for this run. All Playwright navigation and API requests use this base URL.

Log the environment at the top of the Test Run Log in `qa-plan/index.md`.

### Step 2 — Execute Tests

Process test cases in priority order: P1-critical first, then P2, P3, P4.

**For UI and E2E test cases (Type: UI, Functional, Access Control, Integration):**

Use Playwright MCP to:
1. Navigate to the target URL
2. Execute each step in the test case
3. Assert the expected result
4. Mark the test case `Pass` or `Fail` inline in qa-plan.md
5. If `Fail`: capture the observed behavior and note it in the Bug Ref field

**For API test cases (Type: API):**

Use HTTP requests against the Swagger YAML spec to:
1. Send the request with the specified method, path, and body
2. Assert the response status code and body match the expected result
3. Mark the test case `Pass` or `Fail` inline in qa-plan.md
4. If `Fail`: capture the actual response and note it in the Bug Ref field

**Manual test cases:**

Flag cases that cannot be automated (e.g. email delivery, third-party OAuth) as `Manual`.
Pause and prompt the QA tester to execute and report the result before continuing.

### Step 3 — Generate Regression Spec Files

As tests execute, generate Playwright spec files for all automated UI and E2E test cases.

Output path: `docs/qa/{module}/{feature}.spec.ts`

Each spec file contains:
- One `describe` block per module
- One `test` block per automated test case, named with the QA-{NNNN} ID and test case name
- Setup (navigation, auth, preconditions) at the top of each test
- Assertions matching the expected result from the test plan

These files can be run independently for regression testing without re-running sync-qa-runner.

### Step 4 — Update the Test Run Log

After all modules are complete, append one row to the Test Run Log in `qa-plan/index.md`:

```
| {run #} | {date} | {environment} | {tester} | {total pass} | {total fail} | {notes} |
```

### Step 5 — Deliver

State the updated index path and spec file paths, then say:

**If failures exist:**
```
Test run complete. {N} test cases failed across {M} modules.

Spec files written to docs/qa/{module}/

Next: sync-qa-to-ticket - pass projects/{project-name}/qa/qa-plan/index.md for issue creation.
```

**If all tests pass:**
```
Test run complete. All {N} test cases passed across {M} modules.

Spec files written to docs/qa/{module}/

QA phase is complete for this run. Issues can be closed by QA.
```

