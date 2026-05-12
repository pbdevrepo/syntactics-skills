# Test Plan Format — QA Planner

File: `projects/{project-name}/qa/{project-name}-qa-plan.md`

---

```markdown
# {Project Name} - QA Test Plan

**Project:** {project-name}
**Role:** QA Planner
**Date:** {YYYY-MM-DD}
**Source:** FDD (all modules) + Frontend Tasks + Backend Tasks
**Status:** Ready for Execution

---

## Summary

| Module | Test Cases | P1-critical | P2-high | P3-medium | P4-low |
|--------|-----------|-------------|---------|-----------|--------|
| {Module Name} | {count} | {count} | {count} | {count} | {count} |

Total Test Cases: {N}

---

## Module: {Module Name}

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

{repeat QA-{NNNN} block for each test case}

---

## Failed Test Cases

| ID | Test Case | Priority | Observed | Assigned To |
|----|-----------|----------|----------|-------------|
| QA-{NNNN} | {test name} | P{N} | {brief description of failure} | Frontend / Backend |

---

## Test Run Log

| Run # | Date | Environment | Tester | Pass | Fail | Notes |
|-------|------|-------------|--------|------|------|-------|
| 1 | {date} | {local/staging/url} | {name} | {count} | {count} | Initial run |
```
