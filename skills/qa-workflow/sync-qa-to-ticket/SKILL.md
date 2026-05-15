---
name: sync-qa-to-ticket
version: 1.1.0
description: >
  Converts QA test failures and manual findings into structured GitHub issues for Syntactics Inc.
  Trigger when a QA tester says "create tickets", "generate issues", "qa to ticket", "log bugs",
  or after sync-qa-runner marks test cases as failed. Creates GitHub issues via GitHub MCP with FDD
  references and out-of-scope flags. Auto-bootstraps required labels if they do not exist. Never
  provides fix suggestions. Always run after sync-qa-runner and before sync-dev-to-fix in the
  QA workflow.
---

# QA to Ticket

Reads the failed test cases from the QA plan and any manual QA findings, then creates structured
GitHub issues via GitHub MCP. Each issue is anchored to the FDD. No fixes — only clear, scoped
problem statements.

Workflow: **sync-qa-runner - sync-qa-to-ticket - sync-dev-to-fix**

---

## Before You Start

Confirm inputs:
1. Updated QA plan index with failures marked: `projects/{project-name}/qa/qa-plan/index.md`
2. GitHub repository (org/repo format)
3. Manual QA findings — ask:

```
Do you have any additional bugs or issues found outside the automated test run?
If yes, paste them now. If no, type "none".
```

---

## Workflow

### Step 1 — Bootstrap Labels

Via GitHub MCP, check if the required labels exist in the repository. Create any that are missing:

**Type labels:**
- `bug` — color: `#d73a4a`
- `out-of-scope` — color: `#e4e669`
- `regression` — color: `#f9d0c4`

**Status labels:**
- `needs-triage` — color: `#ededed`
- `ready-for-dev` — color: `#0075ca`
- `in-fix` — color: `#6f42c1`
- `ready-for-qa` — color: `#0e8a16`
- `verified` — color: `#2cbe4e`

**Escalation labels:**
- `for-ba-confirmation` — color: `#fbca04`
- `needs-info` — color: `#d93f0b`

**Priority labels:**
- `P1-critical` — color: `#b60205`
- `P2-high` — color: `#e11d48`
- `P3-medium` — color: `#f97316`
- `P4-low` — color: `#84cc16`

### Step 2 — Process Failed Test Cases

Read `index.md` to get the module list. For each module, read `{module-slug}.md` and collect
all test cases where `Status: Fail`.

For each failed test case:

1. Read the QA-{NNNN} block: observed behavior, expected result, FDD ref, priority
2. Check if the FDD ref flags the behavior as out-of-scope
3. Create a GitHub issue (see Step 4 for format)

### Step 3 — Process Manual Findings

For each item in the QA tester's manual findings:

1. Map it to a FDD module and section if possible
2. Flag as out-of-scope if the FDD explicitly excludes this behavior
3. Create a GitHub issue (see Step 4 for format)

### Step 4 — Create GitHub Issues

Via GitHub MCP, create one issue per failure. Use this structure:

**Title:** `[{Module}] {concise description of what is broken}`

**Body:**
```
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

**Never include fix suggestions in any issue body.**

### Step 5 — Update QA Plan with Issue Links

In each `qa-plan/{module-slug}.md`, update the Bug Ref field of each failed test case with the
GitHub issue URL.

### Step 6 — Deliver

State the issue count, then say:

```
{N} GitHub issues created.

QA plan updated with issue links: projects/{project-name}/qa/qa-plan/

Next: sync-dev-to-fix - developers pick up issues labeled `ready-for-dev` and invoke
/sync-dev-to-fix {issue URL}.
```

---

## Output Formatting

- Never use em dashes (--) in any generated .md output. Use a hyphen (-) instead.
