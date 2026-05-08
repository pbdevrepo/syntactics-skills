# Task Output Format Reference

## File Naming

`{project-name}-sprint-tasks.md` — kebab-case, lowercase

---

## Document Structure

~~~markdown
# {Project Name} — Sprint Task List

**Project:** {Project / System Name}
**Prepared by:** {PM or BA Name}
**Date:** {date}
**Source:** {DB Schema filename}
**Status:** Draft | Ready for Assignment

---

## Summary

| Role | Total Tasks |
|---|---|
| UI/UX | {count} |
| FE | {count} |
| BE | {count} |
| **Total** | {count} |

> Tasks are ordered by build dependency — complete Priority 1 before starting Priority 2.

---

## Priority 1 — DB Migrations, Models & Seeders

{task blocks}

## Priority 2 — Authentication & RBAC

{task blocks}

## Priority 3 — Core Modules

{task blocks}

## Priority 4 — Dependent Modules

{task blocks}

## Priority 5 — Reporting, Exports & Notifications

{task blocks — omit section if not applicable}

## Priority 6 — QA Preparation

{task blocks}

---

## Dependency Map

{see format below}

---

## Open Items

{see format below}
~~~

---

## Task Block Format

Tasks are grouped by module within each priority section.

~~~markdown
### {Module Name}
> Source: {table name or module from DB schema}

| ID | Task | Role | Depends On | Blocks |
|---|---|---|---|---|
| T-001 | {specific, assignable task description} | BE | — | T-008, T-012 |
| T-002 | {task description} | FE | T-001 | T-009 |
| T-003 | {task description} | UI/UX | — | T-002 |
~~~

**Task ID:** `T-{number}` — numbered globally across the full document, starting at `T-001`. Never restart per section.

**Role tags** — exactly one per task:

| Tag | Meaning |
|---|---|
| `BE` | Back-end — Laravel controllers, models, migrations, APIs |
| `FE` | Front-end — React/Vue/Blade UI implementation |
| `UI/UX` | Design — wireframes, component design |

If a task requires two roles, split it into two tasks.

**Depends On / Blocks:** use task IDs (`T-001, T-003`) or `—` for none.

---

## Dependency Map Format

~~~markdown
## Dependency Map

**Critical path:**
T-001 (roles migration) → T-002 (users migration) → T-005 (auth login API) → T-006 (login UI)

**Can run in parallel after T-001:**
- T-003 permissions migration → T-007 (RBAC middleware)
- T-004 products migration → T-008 (product list API) → T-010 (product list UI)

**No dependencies (can start immediately):**
T-001, T-003, T-004
~~~

---

## Open Items Format

~~~markdown
## Open Items

| # | Item | Source | Action Required | Owner |
|---|---|---|---|---|
| OI-001 | {blocker or question description} | {table or module} | {what must happen} | PM / BA / Client |
~~~

Use for: unresolved schema TBDs, pending module behavior, unresolvable dependencies.
