---
name: sync-qa-runner
version: 2.0.0
description: >
  Executes QA verification for Syntactics Inc. Supports two modes: Direct mode (preferred) accepts
  a GitHub issue URL and FDD file, derives test cases inline from the FDD, runs them, and applies
  the `verified` label when all pass. Legacy mode reads an existing qa-plan index for backward
  compatibility with pre-existing qa-plan files. Detects the active test framework from package.json,
  composer.json, go.mod, or Gemfile. Trigger when a QA tester says "run tests", "verify issue",
  "qa runner", "start qa run", or after dev-orchestrator Phase 3 creates a ready-for-qa issue.
  Direct mode: /sync-qa-runner {GitHub issue URL} @{fdd-file}.md
  Legacy mode: /sync-qa-runner [module-slug ...]
  Also used for re-runs after sync-dev-to-fix applies a fix.
---

# QA Runner

Verifies implemented features against the FDD. In Direct mode, derives test cases from the GitHub
issue and FDD directly - no pre-generated qa-plan file needed. In Legacy mode, reads an existing
qa-plan index. Detects the project's test framework and runs UI and API tests.

Direct workflow: **dev-orchestrator Phase 3 - sync-qa-runner - sync-qa-to-ticket**

Legacy workflow: **sync-qa-runner - sync-qa-to-ticket**

Re-run workflow: **sync-dev-to-fix - sync-qa-runner (targeted re-run)**

---

## Before You Start

### Detect invocation mode

**If a GitHub issue URL is passed as the first argument** (starts with `https://github.com/`):
- Set mode: **Direct**
- Capture the issue URL
- Require an FDD file passed with `@` — halt if not provided: "Direct mode requires an FDD file: /sync-qa-runner {issue URL} @{fdd}.md"
- Skip Step 0 (no qa-plan index). Proceed to Step 0b.

**If no URL is passed:**
- Set mode: **Legacy**
- Capture any module slugs as the **module filter** (e.g. `/sync-qa-runner user-management activity-logs`)
- Require `docs/qa/qa-plan/index.md` to exist — halt if not found: "No qa-plan index found. Use Direct mode: /sync-qa-runner {issue URL} @{fdd}.md"
- Proceed to Step 0 (existing behavior).

### Confirm environment

Ask if not specified:

```
Which environment should tests run against?
- Local (http://localhost:{port})
- Staging ({staging URL})
- Custom URL
```

---

## Workflow

### Step 0b — Derive Test Cases from Issue + FDD (Direct mode only)

Fetch the GitHub issue via GitHub MCP or `gh issue view {number} --json labels,body,title`.

**Guard:** Check that the issue has the `ready-for-qa` label. If not, halt:
"Issue {URL} does not have the `ready-for-qa` label. Direct mode expects a QA tracking issue
created by dev-orchestrator Phase 3. Check the URL and retry."

Extract from the issue body:
- Task ID (from `## Task Reference`)
- Module name
- Session Type (Backend / Frontend / Full-Stack)
- FDD file path (as a cross-check against the `@` argument)
- Swagger file path (from `## Artifacts`, if present)
- Compliance Notes (from `## Compliance Notes`, if present - yellow items to scrutinise)

**Module/FDD mismatch check:** If the module in the issue body does not match the FDD file passed,
warn: "Issue references module '{X}' but FDD file appears to be for '{Y}'. Confirm before proceeding."
Wait for confirmation.

Read the FDD file. Derive test cases from:

| FDD Source | Test Case Type | Example |
|---|---|---|
| Validation rules - required fields | Negative: submit without required field | VAL-01: login fails without email |
| Validation rules - format constraints | Negative: submit with invalid format | VAL-02: login fails with non-email format |
| Business rules | Functional: happy path through rule | BR-03: approved order advances to shipping |
| Business rules - conditionals | Functional: each branch | BR-04: discount only applies above threshold |
| RBAC rules - allowed | Access control: allowed role can act | RBAC-01: admin can delete users |
| RBAC rules - denied | Access control: denied role is blocked | RBAC-02: viewer cannot delete users |
| Workflow transitions - forward | Flow: valid transition succeeds | WF-01: draft advances to submitted |
| Workflow transitions - reverse | Flow: invalid reversal is blocked | WF-02: shipped cannot revert to draft |

Assign each derived test case:
- A sequential ID: `QA-{NNNN}` (continue from last used ID, or start at QA-0001)
- Priority: P1 for RBAC + core business rules, P2 for validation + workflow, P3/P4 for edge cases
- Flag any test case corresponding to a yellow item in Compliance Notes for extra scrutiny

Print a summary and ask to proceed:

```
Module: {module name}
Task:   {Task-ID}
Test cases derived: {N} (P1: {n}, P2: {n}, P3: {n}, P4: {n})

Yellow-flagged items from compliance notes: {list, or "none"}

Reply "yes" to execute all tests.
Reply "filter {type}" to restrict (e.g. "filter P1" or "filter RBAC").
```

Wait for confirmation.

### Step 0 — Load Module List (Legacy mode only)

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

After all test cases are executed, check if this is a targeted re-run triggered after `sync-dev-to-fix`.

**Direct mode:** A re-run is detected when child bug issues (from a prior `sync-qa-to-ticket` run) have a Bug Ref URL in the QA run log at `docs/qa/qa-runs/{Task-ID}-*.md`.

**Legacy mode:** A re-run is detected when a failing test case has a GitHub issue URL in its Bug Ref field in the qa-plan module file.

For each failing test case with a Bug Ref URL, via GitHub MCP or `gh issue edit`:

1. Read the current labels on the issue
2. Find any existing `turnover:N` label (e.g. `turnover:1`, `turnover:2`)
3. Calculate the next count: if no `turnover:N` exists, next = 1; otherwise next = N + 1
4. Remove the existing `turnover:N` label (if present)
5. Create `turnover:{next}` label if it does not exist — color: `#ff6b35`
6. Apply `turnover:{next}` to the issue
7. Remove label `ready-for-qa`
8. Apply label `ready-for-dev`

Skip this step entirely on a first-run (no Bug Ref URLs present in any failing test case).

### Step 4 — Write Run Record

**Direct mode:** Write a QA run log to `docs/qa/qa-runs/{Task-ID}-{YYYY-MM-DD}.md`:

```markdown
---
generated_by: sync-qa-runner@2.0.0
generated_at: {YYYY-MM-DD}
source_issue: {GitHub issue URL}
source_fdd: {fdd file path}
task_id: {Task-ID}
---

# QA Run: {Task-ID} - {YYYY-MM-DD}

**Issue:** {GitHub issue URL}
**FDD:** {fdd file path}
**Environment:** {local | staging | url}
**Framework:** {detected framework}
**Execution Mode:** {MCP | CLI}

## Test Cases

### {QA-NNNN} - {Test Case Name}
**Type:** {type}
**Priority:** {priority}
**FDD Ref:** {section or rule ID}
**Status:** Pass / Fail
**Bug Ref:** {child issue URL or "-"}

---

## Summary
Pass: {N} | Fail: {N} | Manual: {N}
```

**Legacy mode:** Append one row to the Test Run Log in `qa-plan/index.md`:

```
| {run #} | {date} | {environment} | {tester} | {total pass} | {total fail} | {notes} |
```

### Step 5 — Deliver

**Direct mode — all tests pass:**

Via GitHub MCP or `gh issue edit`:
1. Remove label `ready-for-qa`
2. Apply label `verified`
3. Post comment: "QA run complete. All {N} test cases passed. Issue verified."

```
All {N} test cases passed.
Issue {URL} labeled `verified`.
Run log: docs/qa/qa-runs/{Task-ID}-{date}.md

QA complete. No further action required.
```

**Direct mode — failures exist (first run):**

```
Test run complete. {N} test cases failed.
Execution mode: {MCP | CLI}

Run log: docs/qa/qa-runs/{Task-ID}-{date}.md
Parent issue: {issue URL}

Next: sync-qa-to-ticket - pass {issue URL} and the run log path for child issue creation.
```

**Direct mode — failures exist (re-run, turnover detected):**

```
Test run complete. {N} test cases failed.
Execution mode: {MCP | CLI}

Turnover updates applied:
{For each turned-over ticket:}
- {issue URL} - now turnover:{N}, moved back to ready-for-dev

Run log updated: docs/qa/qa-runs/{Task-ID}-{date}.md

Next: sync-dev-to-fix - developers pick up issues labeled ready-for-dev.
```

**Legacy mode — failures exist (first run):**
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

**Legacy mode — failures exist (re-run — turnover detected):**
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

**Legacy mode — all tests pass:**
```
Test run complete. All {N} test cases passed across {M} modules.
Execution mode: {MCP | CLI}

{If CLI mode:}
Spec files: {list each spec file path, or "existing tests used" per module}
{If MCP mode:}
Tests executed via Playwright MCP — no spec files generated. Results recorded in qa-plan.md.

QA phase is complete for this run. Issues can be closed by QA.
```

