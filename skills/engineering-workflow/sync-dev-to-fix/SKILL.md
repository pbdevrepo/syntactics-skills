---
name: sync-dev-to-fix
version: 1.0.0
description: >
  TDD-driven bug fix skill for Syntactics Inc. Fetches a GitHub issue created by sync-qa-to-ticket,
  reads the FDD for expected behavior, and guides the developer through a failing test - fix - verify
  loop. Trigger when a developer says "fix this issue", "dev to fix", "start bug fix", or invokes
  with a GitHub issue link (e.g. "/sync-dev-to-fix https://github.com/org/repo/issues/123").
  Always run after sync-qa-to-ticket. Does NOT close issues - QA closes after sync-qa-runner confirms
  the fix passes.
---

# Dev to Fix

Fetch the GitHub issue. Read the FDD for expected behavior. Drive a TDD fix loop. The issue is the problem statement. The FDD is the definition of correct. The fix is not done until a test proves it.

Workflow: **sync-qa-to-ticket - sync-dev-to-fix - sync-qa-runner (re-run)**

---

## Before You Start

Confirm input:
- GitHub issue link (e.g. `https://github.com/org/repo/issues/123`)

Fetch the issue via GitHub MCP. Read:
- Issue title and description (observed vs. expected behavior)
- FDD reference in the issue body
- Labels applied (type, priority, scope flags)

---

## Workflow

### Step 1 — Check for Out-of-Scope Flag

If the issue has the `out-of-scope` label:

1. Do NOT proceed with implementation
2. Add the label `for-ba-confirmation` to the issue via GitHub MCP
3. Post a comment on the issue:

```
This issue is flagged as out-of-scope in the FDD. Implementation is blocked pending
BA confirmation. Label `for-ba-confirmation` has been applied.

Please have the BA review and either:
- Update the FDD to include this behavior, then remove `out-of-scope` and `for-ba-confirmation`
- Confirm it is intentionally out of scope, then close this issue as wontfix
```

4. Stop. Do not continue until the out-of-scope flag is resolved.

### Step 2 — Identify Fix Type

Determine whether this is a BE or FE fix:
- Check issue labels for `[BE]`, `[FE]`, or `[FE+BE]` if present
- If not labeled, ask the developer:

```
Is this a Backend, Frontend, or Full-Stack fix?
```

### Step 3 — Read the FDD

From the FDD reference in the issue, read the exact rule or spec being violated.
This is the definition of "fixed" — the test must assert this behavior.

### Step 3b — Mark Ongoing

Via GitHub MCP:
1. Remove label `ready-for-dev` (if present)
2. Apply label `ongoing`

### Step 4 — TDD Fix Loop

**1. Write the failing test that reproduces the bug**
- The test must fail on the current codebase (confirms the bug is real)
- Assert the expected behavior from the FDD, not a workaround
- For BE: write an integration or unit test targeting the failing endpoint or logic
- For FE: write a component test targeting the failing UI behavior or validation

**2. Implement the fix**
- Write only enough code to make the test pass
- Do not refactor unrelated code
- Confirm the fix does not break existing passing tests

**3. Verify**
- All tests pass
- The fix matches the FDD expected behavior exactly

### Step 5 — Update the GitHub Issue

Via GitHub MCP:

1. Post a comment on the issue:

```
Fix applied.

- Test written: [brief description of the test]
- Fix: [brief description of what was changed]
- FDD ref: [section from the FDD]
- All tests passing.

Ready for QA re-run via sync-qa-runner.
```

2. Remove label `ongoing`
3. Apply label `ready-for-qa`
4. Do NOT close the issue — QA closes it after sync-qa-runner confirms the fix passes

