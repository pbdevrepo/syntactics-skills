---
name: sync-qa-runner
version: 1.6.0
description: >
  Executes the QA test plan for Syntactics Inc. using the project's detected test framework for
  both UI/E2E and API tests. Detects the active framework from package.json, composer.json,
  go.mod, or Gemfile first. For UI tests: uses detected framework, falls back to Playwright. For
  API tests: runs existing framework tests if found, falls back to HTTP requests against Swagger
  YAML if no tests exist, flags Manual if neither exists. Generates new specs in the detected
  framework's format only when no coverage exists. Trigger when a QA tester says "run tests",
  "execute test plan", "qa runner", "start qa run", or after sync-qa-planner completes. Supports
  local, staging, and custom URL environments. Accepts an optional module filter:
  /sync-qa-runner user-management activity-logs. Always run after sync-qa-planner and before
  sync-qa-to-ticket in the QA workflow. Also used for re-runs after sync-dev-to-fix applies a fix.
---

# QA Runner

Executes the QA test plan live — detects the project's test framework once up front, then runs UI
and API tests using that framework. Falls back to Swagger YAML HTTP requests for API cases with no
existing coverage. Marks each test case inline and generates regression spec files as a side artifact.

Workflow: **sync-qa-planner - sync-qa-runner - sync-qa-to-ticket**

Re-run workflow: **sync-dev-to-fix - sync-qa-runner (targeted re-run)**

---

## Before You Start

### Check invocation arguments

If module slugs were passed as arguments (e.g. `/sync-qa-runner user-management activity-logs`),
capture them as the **module filter**. If no arguments were passed, the run targets all modules.

### Confirm inputs

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

If a module filter was passed, restrict the list to only those slugs. If a slug in the filter
does not match any module in the index, hard stop and name the unrecognised slug.

Execute Steps 2-3 once per module file in the order listed in the index.
Complete all test cases in one module before moving to the next.

### Step 1 — Set Environment

Confirm the base URL for this run. All browser navigation and API requests use this base URL.

Log the environment at the top of the Test Run Log in `qa-plan/index.md`.

### Step 1b — Detect Test Framework and Execution Mode

**Read project config files** to identify what testing packages are installed:

| File | Packages to look for |
|---|---|
| `package.json` (dependencies + devDependencies) | `playwright`, `@playwright/test`, `cypress`, `vitest`, `jest`, `mocha`, `jasmine` |
| `composer.json` (require-dev) | `phpunit/phpunit`, `pestphp/pest` |
| `go.mod` | `github.com/stretchr/testify` (built-in `testing` package assumed) |
| `Gemfile` | `rspec`, `minitest` |

Also check for framework config files as confirmation: `playwright.config.ts`, `jest.config.ts`, `vitest.config.ts`, `cypress.config.ts`.

Resolve to one primary framework per test type:

| Test Type | Detected Framework | CLI Runner Command |
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

**Determine Playwright/Cypress execution mode** (applies only when Playwright or Cypress is the detected UI/E2E framework):

Read `docs/agents/tools.md` if it exists. Check the MCP Servers table for any entry with capability tier `testing:e2e`.

- If a `testing:e2e` MCP is registered → set **execution mode: MCP**
- If no `testing:e2e` MCP is registered, or `docs/agents/tools.md` does not exist → set **execution mode: CLI**

| Execution Mode | How tests run | Spec files |
|----------------|--------------|------------|
| **MCP** | Direct MCP browser tool calls per test step | Not generated — qa-plan.md is the sole record |
| **CLI** | Spec files generated, then `npx playwright test` / `npx cypress run` | Generated per module |

Log at the top of the Test Run Log:
```
Framework: {detected framework}
Execution mode: {MCP | CLI} {(MCP server: {name}) if MCP mode}
```

### Step 2 — Execute Tests

Process test cases in priority order: P1-critical first, then P2, P3, P4.

**For UI and E2E test cases (Type: UI, Functional, Access Control, Integration):**

Branch on execution mode set in Step 1b.

**MCP mode:**
Drive each test case step-by-step using MCP browser tool calls. No spec files are written.

For each test case:
1. `browser_navigate` — navigate to the target URL
2. Per step: `browser_click`, `browser_fill_form`, `browser_type`, `browser_select_option`, `browser_press_key` as needed
3. After the final step: `browser_snapshot` or `browser_evaluate` to assert the expected DOM state
4. On assertion failure: `browser_take_screenshot` to capture evidence; note observed vs expected in the Bug Ref field
5. Mark the test case `Pass` or `Fail` inline in qa-plan.md
6. Set `Spec File:` to `"Executed via MCP — no spec file"` in the qa-plan module file

Pause for `Manual` test cases (email delivery, OAuth redirects, or any step that cannot be driven by browser tools) — prompt the QA tester and wait for their result before continuing.

**CLI mode:**
Execute via the detected CLI runner. Steps 3a-3b (spec file discovery and generation) apply.

For each test case:
1. Check for existing spec coverage (Step 3a)
2. If coverage exists: run it and report results
3. If no coverage: generate a spec file (Step 3b), then run it
4. Mark the test case `Pass` or `Fail` inline in qa-plan.md
5. If `Fail`: capture the error output and note it in the Bug Ref field

**For API test cases (Type: API):**

Use the framework detected in Step 1b. Apply in this order:

1. **Existing API tests found** (PHPUnit, Pest, Jest, Vitest, etc.) - run them via the detected runner command, report each result (PASS / FAIL) inline in qa-plan.md, capture error output on failure
2. **No existing API tests + Swagger YAML exists** (`docs/api/{module}/{feature}_api.yaml`) - fall back to raw HTTP requests: send the specified method, path, and body; assert the response status code and body match the YAML spec; mark `Pass` or `Fail` inline; capture the actual response on failure
3. **No existing API tests + no Swagger YAML** - flag as `Manual`, pause and prompt the QA tester to execute and report the result before continuing

**Manual test cases:**

Flag cases that cannot be automated (e.g. email delivery, third-party OAuth) as `Manual`.
Pause and prompt the QA tester to execute and report the result before continuing.

### Step 3 — Discover and Handle Test Files

**If execution mode = MCP: skip Steps 3a and 3b entirely.** Spec files are not generated or run in MCP mode. The qa-plan.md is the sole artifact of the test run.

**If execution mode = CLI: proceed with Steps 3a and 3b below.**

#### Step 3a — Discover existing tests

Search for test files matching the detected framework's conventions:

- **Playwright / Cypress / Vitest / Jest / Mocha**: `*.spec.ts`, `*.spec.js`, `*.test.ts`, `*.test.js`, `*.e2e.ts`
- **PHPUnit / Pest**: `*Test.php`, `tests/**/*.php`
- **Go**: `*_test.go`
- **RSpec**: `*_spec.rb`

#### Step 3b — Run or generate

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

### Step 3c — Handle Re-run Failures (Turnover)

After all test cases are executed, check if this is a targeted re-run (i.e. the run was triggered after `sync-dev-to-fix`). A re-run is detected when a failing test case has a GitHub issue URL in its Bug Ref field.

For each failing test case with a Bug Ref URL, via GitHub MCP:

1. Read the current labels on the issue
2. Find any existing `turnover:N` label (e.g. `turnover:1`, `turnover:2`)
3. Calculate the next count: if no `turnover:N` exists, next = 1; otherwise next = N + 1
4. Remove the existing `turnover:N` label (if present)
5. Create `turnover:{next}` label if it does not exist — color: `#ff6b35`
6. Apply `turnover:{next}` to the issue
7. Remove label `ready-for-qa`
8. Apply label `ready-for-dev`

Skip this step entirely on a first-run (no Bug Ref URLs present in any failing test case).

### Step 4 — Update the Test Run Log

After all modules are complete, append one row to the Test Run Log in `qa-plan/index.md`:

```
| {run #} | {date} | {environment} | {tester} | {total pass} | {total fail} | {notes} |
```

### Step 5 — Deliver

State the updated index path and spec file paths (or MCP mode note), then say:

**If failures exist (first run):**
```
Test run complete. {N} test cases failed across {M} modules.
{If module filter was active: "Targeted run: {list slugs}"}
Execution mode: {MCP | CLI}

{If CLI mode:}
Spec files: {list each spec file path, or "existing tests used" per module}
{If MCP mode:}
Tests executed via Playwright MCP — no spec files generated. Results recorded in qa-plan.md.

Next: sync-qa-to-ticket - pass docs/qa/qa-plan/index.md for issue creation.
```

**If failures exist (re-run — turnover detected):**
```
Test run complete. {N} test cases failed across {M} modules.
Execution mode: {MCP | CLI}

Turnover updates applied:
{For each turned-over ticket:}
- {issue URL} - now turnover:{N}, moved back to ready-for-dev

{If CLI mode:}
Spec files: {list each spec file path, or "existing tests used" per module}
{If MCP mode:}
Tests executed via Playwright MCP — no spec files generated. Results recorded in qa-plan.md.

Next: sync-dev-to-fix - developers pick up issues labeled ready-for-dev.
```

**If all tests pass:**
```
Test run complete. All {N} test cases passed across {M} modules.
Execution mode: {MCP | CLI}

{If CLI mode:}
Spec files: {list each spec file path, or "existing tests used" per module}
{If MCP mode:}
Tests executed via Playwright MCP — no spec files generated. Results recorded in qa-plan.md.

QA phase is complete for this run. Issues can be closed by QA.
```

