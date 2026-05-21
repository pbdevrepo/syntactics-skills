# Test Plan Format - QA Planner

Output directory: `docs/qa/qa-plan/`

Two file types: one index file and one per-module file per module.

Module slug: kebab-case the module name from the FDD (e.g. "User Management" -> `user-management`).

---

## Index File: `qa-plan/index.md`

```markdown
# {Project Name} - QA Test Plan

**Project:** {project-name}
**Role:** QA Planner
**Date:** {YYYY-MM-DD}
**Source:** FDD (all modules) + Frontend Tasks + Backend Tasks
**Status:** Ready for Execution

---

## Module Index

| Module | File | Test Cases | P1-critical | P2-high | P3-medium | P4-low |
|--------|------|-----------|-------------|---------|-----------|--------|
| {Module Name} | [{module-slug}.md]({module-slug}.md) | {count} | {count} | {count} | {count} | {count} |

Total: {N} test cases across {M} modules

---

## Test Run Log

| Run # | Date | Environment | Tester | Pass | Fail | Notes |
|-------|------|-------------|--------|------|------|-------|
| 1 | {date} | {local/staging/url} | {name} | {count} | {count} | Initial run |
```

---

## Per-Module File: `qa-plan/{module-slug}.md`

```markdown
# {Module Name} - QA Test Cases

**Project:** {project-name}
**Module:** {Module Name}
**FDD Source:** {module FDD file name}
**Plan Index:** [index.md](index.md)

---

## Test Cases

### QA-{NNNN} - {Test Case Name}

**Module:** {Module Name}
**Type:** Functional / UI / API / Access Control / Integration / Regression
**Priority:** P1-critical / P2-high / P3-medium / P4-low
**Feature Ref:** FE-{NNNN} / BE-{NNNN} - {task name}
**FDD Ref:** Section {X.X} - {rule or spec being tested}

**Preconditions:**
- {what must be true before this test runs}
- {required data, role, or system state}

**Steps:**
1. {action 1}
2. {action 2}
3. {action 3}

**Expected Result:** {exact observable outcome - pass criteria}
**Fail Criteria:** {what makes this test fail}

**Execution Type:** Automated (Playwright) / Automated (API) / Manual
**Status:** Pending / Pass / Fail
**Bug Ref:** {issue URL if failed, or "-"}

---

{repeat QA-{NNNN} block for each test case in this module, sorted P1 first}

---

## Failed Test Cases

| ID | Test Case | Priority | Observed | Assigned To |
|----|-----------|----------|----------|-------------|
| QA-{NNNN} | {test name} | P{N} | {brief description of failure} | Frontend / Backend |
```

---

## Numbering Rules

- QA IDs are global and sequential across all modules: QA-0001, QA-0002, QA-0003...
- Do not restart numbering per module.
- Within each module file, sort test cases P1-critical first, then P2, P3, P4.
