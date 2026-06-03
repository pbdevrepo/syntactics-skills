---
name: sync-qa-to-ticket
version: 1.3.0
description: >
  Converts QA test failures and manual findings into structured GitHub issues for Syntactics Inc.
  Trigger when a QA tester says "create tickets", "generate issues", "qa to ticket", "log bugs",
  or after sync-qa-runner marks test cases as failed. Supports Direct mode (GitHub issue URL +
  run log) and Legacy mode (qa-plan index). Creates child bug issues via GitHub MCP with FDD
  references, parent issue link, and out-of-scope flags. Never provides fix suggestions.
  Always run after sync-qa-runner and before sync-dev-to-fix in the QA workflow.
---

# QA to Ticket

Read the failed test cases from the QA run and any manual QA findings. Create structured
child bug issues via GitHub MCP. Each issue is anchored to the FDD and linked to the parent
QA tracking issue. No fixes - only clear, scoped problem statements.

Direct workflow: **sync-qa-runner (Direct mode) - sync-qa-to-ticket - sync-dev-to-fix**

Legacy workflow: **sync-qa-runner - sync-qa-to-ticket - sync-dev-to-fix**

---

## Before You Start

### Detect mode

**If a GitHub issue URL is passed as the first argument:**
- Set mode: **Direct**
- Capture the parent issue URL (the `ready-for-qa` tracking issue)
- Read failures from the QA run log: `docs/qa/qa-runs/{Task-ID}-*.md` (most recent file)

**If no URL is passed:**
- Set mode: **Legacy**
- Read failures from: `docs/qa/qa-plan/index.md`

### Confirm remaining inputs

1. GitHub repository (org/repo format)
2. Manual QA findings — ask:

```
Do you have any additional bugs or issues found outside the automated test run?
If yes, paste them now. If no, type "none".
```

---

## Workflow

### Step 1 — Verify Labels Exist

Via GitHub MCP, check that the following labels exist in the repository:

`bug`, `out-of-scope`, `regression`, `needs-triage`, `ready-for-dev`, `ongoing`, `ready-for-qa`, `verified`, `for-ba-confirmation`, `needs-info`, `area:fe`, `area:be`, `area:fs`, `P1-critical`, `P2-high`, `P3-medium`, `P4-low`

If any are missing, halt immediately and tell the user:

```
Required labels are missing from this repository. Run /sync-dev-setup to create them before proceeding.
Missing: {list the missing label names}
```

Do not create labels here. Label setup is owned by sync-dev-setup.

### Step 2 — Process Failed Test Cases

**Direct mode:** Read `docs/qa/qa-runs/{Task-ID}-*.md`. Collect all test case blocks where `**Status:** Fail`.

**Legacy mode:** Read `index.md` to get the module list. For each module, read `{module-slug}.md` and collect all test cases where `Status: Fail`.

For each failed test case:

1. Read the QA-{NNNN} block: observed behavior, expected result, FDD ref, priority
2. Check if the FDD ref flags the behavior as out-of-scope
3. Create a GitHub issue (see Step 4 for format)

### Step 3 — Process Manual Findings

For each item in the QA tester's manual findings:

1. Map it to a FDD module and section if possible
2. Flag as out-of-scope if the FDD explicitly excludes this behavior
3. Create a GitHub issue (see Step 4 for format)

### Step 4 — Classify Area and Confirm

For each collected failure (from both the QA plan and manual findings), read the **Observed Behavior**
field and apply this rule:

| Signal in Observed Behavior | Area |
|-----------------------------|------|
| Wrong display, missing UI element, bad validation message, form field error, layout broken, label/text incorrect | `area:fe` |
| Wrong API response, missing or incorrect record, failed save, incorrect data returned, auth failure, server error | `area:be` |
| Both UI and data/API symptoms present in the same case | `area:fs` |

Build a classification table and present it to the QA tester:

```
Area Classification — please review before issues are created:

| Ref        | Description                        | Classified Area |
|------------|------------------------------------|-----------------|
| QA-0001    | {short description}                | area:fe         |
| QA-0002    | {short description}                | area:be         |
| Manual-001 | {short description}                | area:fs         |

To correct a classification, reply with: QA-NNNN: area:fe (or area:be / area:fs)
To correct a manual finding, reply with: Manual-NNN: area:be
If all classifications are correct, reply: confirmed
```

Wait for the QA tester's response. Apply all corrections, then proceed to Step 5.

### Step 5 — Create GitHub Issues

Via GitHub MCP, create one issue per failure. Use this structure:

**Title:** `[{Module}] {concise description of what is broken}`

**Body:**
```
## Parent Issue
{Direct mode: GitHub issue URL - Task-ID: task description}
{Legacy mode: omit this section}

## Observed Behavior
{what actually happens - specific and reproducible}

## Expected Behavior
{what the FDD says should happen}

## FDD Reference
Section {X.X} - {rule or spec name}
File: {fdd file path}

## Test Case Ref
{QA-NNNN if from automated run, or "Manual finding" if reported by QA}

## Steps to Reproduce
1. {step 1}
2. {step 2}
3. {step 3}

## Out-of-Scope Note
{If the FDD flags this as out-of-scope, add: "Note: This behavior is marked out-of-scope in the FDD
(Section X.X). This ticket requires BA confirmation before implementation."}
{If in-scope, omit this section entirely.}
```

**Labels to apply on creation:**
- Type: `bug` (or `regression` if previously passing, `out-of-scope` if FDD excludes it)
- Priority: `P1-critical` / `P2-high` / `P3-medium` / `P4-low` (match QA plan priority)
- Status: `needs-triage`
- Escalation: `for-ba-confirmation` only if out-of-scope flag is present
- Area: `area:fe` / `area:be` / `area:fs` (resolved in Step 4)

**Never include fix suggestions in any issue body.**

### Step 6 — Update Run Record with Issue Links

**Direct mode:** In `docs/qa/qa-runs/{Task-ID}-*.md`, update the `**Bug Ref:**` field of each
failed test case with the GitHub child issue URL.

**Legacy mode:** In each `qa-plan/{module-slug}.md`, update the Bug Ref field of each failed
test case with the GitHub issue URL.

### Step 7 — Deliver

State the issue count, then say:

```
{N} child bug issues created.

{Direct mode:}
Run log updated: docs/qa/qa-runs/{Task-ID}-{date}.md
Parent issue: {parent issue URL}

{Legacy mode:}
QA plan updated with issue links: docs/qa/qa-plan/

Next: sync-dev-to-fix - developers pick up issues labeled `ready-for-dev` and invoke
/sync-dev-to-fix {issue URL}.
```

