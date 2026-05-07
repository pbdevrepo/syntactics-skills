# Test Case Format — QA Tester

File: `output/{project-name}/design-dev/{project-name}-qa-tasks.md`

---

```markdown
# {Project Name} — QA Test Case List

**Project:** {project-name}
**Role:** QA Tester
**Date:** {YYYY-MM-DD}
**Source:** FDD (all modules) + Frontend Tasks + Backend Tasks
**Status:** Ready for Testing

---

## Summary

| Module | Test Cases | P1 Critical | P2 High | P3 Medium | P4 Low |
|--------|-----------|-------------|---------|-----------|--------|
| {Module Name} | {count} | {count} | {count} | {count} | {count} |

Total Test Cases: {N}

---

## Module: {Module Name}

### QA-{NNNN} — {Test Case Name}

**Module:** {Module Name}
**Type:** Functional / UI / API / Access Control / Integration / Regression
**Priority:** P1 — Critical / P2 — High / P3 — Medium / P4 — Low
**Feature Ref:** FE-{NNNN} / BE-{NNNN} — {task name}
**FDD Ref:** Section {X.X} — {rule or spec being tested}

**Preconditions:**
- {what must be true before this test runs}
- {required data, role, or system state}

**Steps:**
1. {action 1}
2. {action 2}
3. {action 3}

**Expected Result:** {exact observable outcome — pass criteria}
**Fail Criteria:** {what makes this test fail}

**Status:** Pending / Pass / Fail
**Bug Ref:** {BUG-NNNN if failed, or "—"}

---

{repeat QA-{NNNN} block for each test case}

---

## Failed Test Cases

| ID | Test Case | Priority | Bug Description | Assigned To |
|----|-----------|----------|----------------|-------------|
| QA-{NNNN} | {test name} | P{N} | {brief description of failure} | Frontend / Backend |

---

## Test Run Log

| Run # | Date | Tester | Pass | Fail | Notes |
|-------|------|--------|------|------|-------|
| 1 | {date} | {name} | {count} | {count} | Initial run |
```
