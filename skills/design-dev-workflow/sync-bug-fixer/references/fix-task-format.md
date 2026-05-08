# Fix Task Format — Bug Fixer

File: `projects/{project-name}/design-dev/{project-name}-bugfix-tasks.md`

---

```markdown
# {Project Name} — Bug Fix Task List

**Project:** {project-name}
**Role:** Frontend / Backend Developer
**Date:** {YYYY-MM-DD}
**Source:** QA Task List — Failed Cases ({project-name}-qa-tasks.md)
**QA Run #:** {run number this list was generated from}
**Status:** Ready for Fix

---

## Summary

| Priority | Fix Tasks | Status |
|----------|-----------|--------|
| P1 — Critical | {count} | Pending |
| P2 — High | {count} | Pending |
| P3 — Medium | {count} | Pending |
| P4 — Low | {count} | Pending |

Total Fix Tasks: {N}

---

## P1 — Critical

### BUG-{NNNN} — {Fix Task Name}

**Priority:** P1 — Critical
**Role:** [FE] / [BE] / [FE + BE]
**Module:** {Module Name}
**QA Refs:** QA-{NNNN}, QA-{NNNN} (all test cases this fix resolves)

**Failure Observed:**
{exact description of what went wrong — what the tester saw}

**Expected Behavior:**
{what the FDD or spec says should happen}
**FDD Ref:** Section {X.X} / Task Ref: FE-{NNNN} / BE-{NNNN}

**Root Cause (if known):** {brief diagnosis or "Unknown — needs investigation"}

**Fix Steps (if known):**
1. {step 1}
2. {step 2}

**Depends on:** {other fix task ID that must be resolved first, or "None"}
**Status:** Pending / In Progress / Fixed / Verified

---

## P2 — High

### BUG-{NNNN} — {Fix Task Name}

{same block structure as P1}

---

## P3 — Medium

{same block structure}

---

## P4 — Low

{same block structure}

---

## Fix Log

| Bug ID | Fixed By | Fix Date | Verified By | QA Re-run Date | Result |
|--------|----------|----------|-------------|----------------|--------|
| BUG-{NNNN} | {name} | {date} | {QA tester} | {date} | Pass / Fail |
```
