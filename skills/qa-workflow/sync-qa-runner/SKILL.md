---
name: sync-qa-runner
version: 1.5.0
description: >
  Executes the QA test plan for Syntactics Inc. using the project's detected test framework for
  both UI/E2E and API tests. Detects the active framework from package.json, composer.json,
  go.mod, or Gemfile first. For UI tests: uses detected framework, falls back to Playwright. For
  API tests: runs existing framework tests if found, falls back to HTTP requests against Swagger
  YAML if no tests exist, flags Manual if neither exists. Generates new specs in the detected
  framework's format only when no coverage exists. Trigger when a QA tester says "run tests",
  "execute test plan", "qa runner", "start qa run", or after sync-qa-planner completes. Supports
  local, staging, and custom URL environments. Always run after sync-qa-planner and before
  sync-qa-to-ticket in the QA workflow. Also used for re-runs after sync-dev-to-fix applies a fix.
---

# QA Runner

Executes the QA test plan live — UI tests via the project's detected test framework, API tests via
HTTP against the generated Swagger YAML. Marks each test case inline and generates regression spec
files in the detected framework's format as a side artifact.

Workflow: **sync-qa-planner - sync-qa-runner - sync-qa-to-ticket**

Re-run workflow: **sync-dev-to-fix - sync-qa-runner (targeted re-run)**

---

## Before You Start

Confirm inputs:
1. QA test plan index: `docs/qa/qa-plan/index.md`
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

Use the framework detected in Step 3a. If Playwright or Cypress is detected, drive the browser via the MCP tool. Otherwise execute via the runner command. For each test case:
1. Navigate to the target URL
2. Execute each step in the test case
3. Assert the expected result
4. Mark the test case `Pass` or `Fail` inline in qa-plan.md
5. If `Fail`: capture the observed behavior and note it in the Bug Ref field

**For API test cases (Type: API):**

Use the framework detected in Step 3a. Apply in this order:

1. **Existing API tests found** (PHPUnit, Pest, Jest, Vitest, etc.) - run them via the detected runner command, report each result (PASS / FAIL) inline in qa-plan.md, capture error output on failure
2. **No existing API tests + Swagger YAML exists** (`docs/api/{module}/{feature}_api.yaml`) - fall back to raw HTTP requests: send the specified method, path, and body; assert the response status code and body match the YAML spec; mark `Pass` or `Fail` inline; capture the actual response on failure
3. **No existing API tests + no Swagger YAML** - flag as `Manual`, pause and prompt the QA tester to execute and report the result before continuing

**Manual test cases:**

Flag cases that cannot be automated (e.g. email delivery, third-party OAuth) as `Manual`.
Pause and prompt the QA tester to execute and report the result before continuing.

### Step 3 — Detect Framework, Discover and Handle Test Files

#### Step 3a — Detect the test framework

Read the following files in the project root to identify what testing packages are in use:

| File | Packages to look for |
|---|---|
| `package.json` (dependencies + devDependencies) | `playwright`, `@playwright/test`, `cypress`, `vitest`, `jest`, `mocha`, `jasmine` |
| `composer.json` (require-dev) | `phpunit/phpunit`, `pestphp/pest` |
| `go.mod` | `github.com/stretchr/testify` (built-in `testing` package assumed) |
| `Gemfile` | `rspec`, `minitest` |

Also check for framework config files as confirmation: `playwright.config.ts`, `jest.config.ts`, `vitest.config.ts`, `cypress.config.ts`.

Resolve to one primary framework per test type:

| Test Type | Detected Framework | Runner Command |
|---|---|---|
| UI / E2E | Playwright | `npx playwright test` |
| UI / E2E | Cypress | `npx cypress run` |
| Unit / Integration | Vitest | `npx vitest run` |
| Unit / Integration | Jest | `npx jest` |
| Unit / Integration | PHPUnit | `./vendor/bin/phpunit` |
| Unit / Integration | Pest | `./vendor/bin/pest` |
| Unit / Integration | Go test | `go test ./...` |
| Unit / Integration | RSpec | `bundle exec rspec` |

If no framework is detected, default to Playwright for UI/E2E and note the assumption.

#### Step 3b — Discover existing tests

Search for test files matching the detected framework's conventions:

- **Playwright / Cypress / Vitest / Jest / Mocha**: `*.spec.ts`, `*.spec.js`, `*.test.ts`, `*.test.js`, `*.e2e.ts`
- **PHPUnit / Pest**: `*Test.php`, `tests/**/*.php`
- **Go**: `*_test.go`
- **RSpec**: `*_spec.rb`

#### Step 3c — Run or generate

**If existing tests are found for the feature:**
1. Run them using the detected runner command
2. Report each result (PASS / FAIL) inline in the qa-plan module file
3. On failure: capture the error output and note it in the Bug Ref field
4. Do not generate a new spec file - the existing file is the regression artifact
5. Add a `Spec File:` reference line in the qa-plan module file pointing to the existing file path

**If no existing tests are found:**
1. Resolve the output path from the detected framework's config (e.g. `testDir` in `playwright.config.ts`, `roots` in `jest.config.ts`) — fall back to `tests/e2e/{module}/{feature}.spec.ts` if no config found
2. Generate a spec file in the detected framework's format at the resolved path:
   - One `describe` block per module
   - One `test` / `it` block per automated test case, named with the QA-{NNNN} ID and test case name
   - Setup (navigation, auth, preconditions) at the top of each test
   - Assertions matching the expected result from the test plan
3. Add a `Spec File:` reference line in the qa-plan module file pointing to the generated path
4. Do not write a separate `.md` log - the qa-plan is the source of truth for results

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

Spec files: {list each spec file path, or "existing tests used" per module}

Next: sync-qa-to-ticket - pass docs/qa/qa-plan/index.md for issue creation.
```

**If all tests pass:**
```
Test run complete. All {N} test cases passed across {M} modules.

Spec files: {list each spec file path, or "existing tests used" per module}

QA phase is complete for this run. Issues can be closed by QA.
```

