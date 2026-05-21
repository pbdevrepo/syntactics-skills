# Task Output Format — Backend Task Creator

File: `docs/pm/{project-name}-backend-tasks.md`

---

## Default Format — Compact Table

Use this for all tasks. One row per implementable unit. Tasks are grouped by sprint — the sprint
number maps directly to the Priority group in `{project-name}-sprint-tasks.md` (Priority 1 = Sprint 1).
Within each sprint, build order follows Priority 1-6 categories.

```markdown
# {Project Name} — Backend Task List

**Project:** {project-name}
**Role:** Backend Developer
**Date:** {YYYY-MM-DD}
**Source:** FDD (all modules) + Frontend Task List ({project-name}-frontend-tasks.md) + Sprint Plan ({project-name}-sprint-tasks.md)
**Status:** Ready for Backend Dev

---

## Summary

| Sprint | Category | Tasks | Status |
|--------|----------|-------|--------|
| Sprint 1 | Migrations & Models | {count} | Pending |
| Sprint 1 | Authentication & RBAC | {count} | Pending |
| Sprint 2 | Core API Endpoints | {count} | Pending |
| Sprint 2 | Business Logic & Workflows | {count} | Pending |
| Sprint 3 | Integrations | {count} | Pending |
| Sprint 3 | Notifications & Background Jobs | {count} | Pending |

**Total Backend Tasks: {N}**

---

## Sprint 1

| ID | P | Module | Task | Type | Detail | Depends On | Blocks |
|----|---|--------|------|------|--------|------------|--------|
| BE-0001 | 1 | {Module} | {entity_name} migration | Migration | cols: id, name:str, user_id:FK, timestamps, soft_delete | - | BE-0002 |
| BE-0002 | 1 | {Module} | {Entity} model & relationships | Model | belongsTo: User; hasMany: Items | BE-0001 | BE-0010 |
| BE-0003 | 2 | Auth | Login endpoint + session middleware | Auth | POST /api/auth/login; roles: all | BE-0001 | BE-0010+ |
| BE-0004 | 2 | {Module} | {Module} policy (RBAC) | Policy | Admin: CRUD; Manager: CR; Viewer: R | BE-0002 | BE-0010 |

## Sprint 2

| ID | P | Module | Task | Type | Detail | Depends On | Blocks |
|----|---|--------|------|------|--------|------------|--------|
| BE-0010 | 3 | {Module} | GET /api/{resource} | Endpoint | filter: status, search: name; paginated | BE-0002,BE-0004 | FE-{N} |
| BE-0011 | 3 | {Module} | POST /api/{resource} | Endpoint | body: name*, category_id*, status*; unique: name | BE-0002,BE-0004 | FE-{N} |
| BE-0012 | 3 | {Module} | PUT /api/{resource}/{id} | Endpoint | same as POST; owner check | BE-0011 | FE-{N} |
| BE-0013 | 3 | {Module} | DELETE /api/{resource}/{id} | Endpoint | soft-delete; Admin only | BE-0002,BE-0004 | FE-{N} |

**P column:** Priority 1-6 matching the build order within a sprint
**Type values:** Migration · Model · Auth · Policy · Endpoint · Seeder · Integration · Notification · Job
**Detail column:** For Migrations - key columns summary. For Models - relationships. For Endpoints - method/path + key validation. For Auth/Policy - role-action mapping.
**Blocks column:** FE-{N} = unblocks this frontend task; BE-{N} = unblocks this backend task

---

## Unresolved Items

| ID | Item | Reason |
|----|------|--------|
| BE-U1 | {task or endpoint} | {needs FDD clarification} |
```

---

## Fallback Format — Detailed Block (complex tasks only)

Use a detailed block **only** when a task has non-obvious requirements that cannot fit a table row — e.g., endpoints with complex business rules, multi-step side effects, approval workflows, or 5+ request fields. Replace the relevant table row with this block below the table.

```markdown
### BE-{NNNN} — {Task Name}  *(complex — see detail below)*

**Role:** [BE]
**Priority:** {1–6}
**Module:** {Module Name}
**Type:** {Migration / Model / Auth / Policy / Endpoint / Integration / Job}

*For Endpoint tasks:*
**Method:** GET / POST / PUT / PATCH / DELETE
**Endpoint:** `/api/{resource}`
**Description:** {what this endpoint does}

**Request:**
- {field}: {type} — {validation rule}

**Response:**
- Success: {HTTP status} — {response shape}
- Error: {HTTP status} — {error cases}

**Business Rules:** {validation, permission checks, side effects}
**Frontend Ref:** FE-{NNNN}
**Depends on:** {task ID(s) or "None"}
**Blocks:** {task ID(s) or "None"}
**Complexity note:** {why this task warranted a detail block}
```
