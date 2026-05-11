---
name: sync-bug-fixer
version: 1.0.0
description: >
  Generates a prioritized bug fix task list for Syntactics Inc. from the QA test case results.
  Trigger when a QA tester or developer says "fix the bugs", "generate fix tasks", "bug fix list",
  "prioritize the bugs", "what needs to be fixed", or after qa-tester marks test cases as failed.
  Reads failed QA test cases and produces a fix task list assigned to frontend or backend with
  priority order. Always run after qa-tester in the design-dev workflow. Loops back to qa-tester
  after fixes are complete.
---

# Bug Fixer

Reads the QA test case list (failed cases only) and produces a prioritized fix task list assigned
to the correct role (Frontend or Backend). Fixes are ordered by severity so P1 blockers are
resolved before P3 polish issues.

Workflow: **qa-tester → bug-fixer → [qa-tester re-run]**

---

## Before You Start

Confirm input:
- QA task list with failed cases marked: `projects/{project-name}/design-dev/{project-name}-qa-tasks.md`

Read only the **Failed Test Cases** section and the individual failed `QA-{NNNN}` blocks.

Read `references/fix-task-format.md` for the exact fix task block structure.

---

## Workflow

### Step 1 — Triage Failed Test Cases

For each failed test case:
1. Identify whether the failure is a **Frontend**, **Backend**, or **Both** issue
2. Confirm the priority matches the test case priority — escalate if the failure blocks other features
3. Group failures by root cause where possible (e.g., multiple failures from one missing endpoint)

**Escalation rules:**
- If a P2 failure blocks a P1 feature from being tested → escalate to P1
- If multiple failures share the same root cause → create one fix task, not multiple

### Step 2 — Derive Fix Tasks

One fix task = one discrete, assignable unit of work to resolve one or more related failures.

For each fix task:
- Reference all QA test case IDs it resolves
- Assign to `[FE]`, `[BE]`, or `[FE + BE]`
- State the exact failure observed and the expected behavior from the FDD
- Include the FDD or task reference so the dev knows what "correct" looks like

### Step 3 — Order by Priority

```
P1 — Critical: system is broken, data is lost, or a core flow cannot complete
P2 — High: a feature doesn't work correctly but a workaround exists
P3 — Medium: incorrect behavior but doesn't block primary use
P4 — Low: cosmetic, copy, or minor UX issue
```

P1 fixes must be resolved and re-tested before P2 work begins.

### Step 4 — Self-Review Before Delivering

- [ ] Every failed QA test case is referenced by at least one fix task
- [ ] Every fix task is assigned to a role (`[FE]`, `[BE]`, or `[FE + BE]`)
- [ ] Every fix task references the expected behavior from the FDD
- [ ] P1 fix tasks have no unresolved dependencies
- [ ] No fix task is vague — "fix POST /api/users returning 500 when email is duplicate" not "fix user API"

### Step 5 — Deliver

Write file: `projects/{project-name}/design-dev/{project-name}-bugfix-tasks.md`

Follow `references/fix-task-format.md` for exact structure.

State the file path, then say:

```
Fix tasks generated. Resolve all P1 tasks first, then P2, P3, P4.

Next: qa-tester — re-run failed test cases after fixes are applied to verify resolution.
```

---

## Reference Files

- `references/fix-task-format.md` — Fix task block structure and priority classification


---

## Output Formatting

- Never use em dashes (--) in any generated .md output. Use a hyphen (-) instead.
