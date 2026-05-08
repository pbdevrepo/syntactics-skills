# Task Output Format — Backend Developer

File: `projects/{project-name}/design-dev/{project-name}-backend-tasks.md`

---

```markdown
# {Project Name} — Backend Task List

**Project:** {project-name}
**Role:** Backend Developer
**Date:** {YYYY-MM-DD}
**Source:** FDD (all modules) + Frontend Task List ({project-name}-frontend-tasks.md)
**Status:** Ready for Backend Dev

---

## Summary

| Priority | Category | Tasks | Status |
|----------|----------|-------|--------|
| 1 | Migrations & Models | {count} | Pending |
| 2 | Authentication & RBAC | {count} | Pending |
| 3 | Core API Endpoints | {count} | Pending |
| 4 | Business Logic & Workflows | {count} | Pending |
| 5 | Integrations | {count} | Pending |
| 6 | Notifications & Background Jobs | {count} | Pending |

Total Backend Tasks: {N}

---

## Priority 1 — Migrations & Models

### BE-0001 — {Entity Name} Migration

**Role:** [BE]
**Priority:** 1
**Module:** {Module Name}
**Description:** Create migration for `{table_name}` table with all columns, indexes, and foreign keys.

**Columns:**
- `{column_name}`: {type} — {nullable/required, FK reference if any}

**Depends on:** {parent table migration ID, or "None"}
**Blocks:** {model task ID, endpoint task IDs}

---

### BE-0002 — {Entity Name} Model & Relationships

**Role:** [BE]
**Priority:** 1
**Module:** {Module Name}
**Description:** Create Eloquent model for `{Entity}` with fillable fields, casts, and relationships.

**Relationships:**
- {belongsTo / hasMany / belongsToMany}: {related model}

**Depends on:** BE-0001
**Blocks:** {endpoint tasks that use this model}

---

## Priority 2 — Authentication & RBAC

### BE-{NNNN} — {Auth or Policy Task}

**Role:** [BE]
**Priority:** 2
**Module:** Auth / {Module Name}
**Description:** {specific auth or policy description}
**Depends on:** {migration/model task IDs}
**Blocks:** {endpoint tasks that require auth}

---

## Priority 3 — Core API Endpoints

### BE-{NNNN} — {HTTP Method} {Endpoint Path}

**Role:** [BE]
**Priority:** 3
**Module:** {Module Name}
**Method:** GET / POST / PUT / PATCH / DELETE
**Endpoint:** `/api/{resource}`
**Description:** {what this endpoint does}

**Request:**
- Params / Body: {field: type, validation rule}

**Response:**
- Success: {HTTP status} — {response shape}
- Error: {HTTP status} — {error cases}

**Business Rules:** {validation, permission checks, side effects}
**Frontend Ref:** FE-{NNNN} — {frontend task that consumes this endpoint}
**Depends on:** {model task ID(s)}
**Blocks:** {frontend or QA tasks that depend on this}

---

{repeat blocks for Priority 4, 5, 6}

---

## Unresolved Items

| ID | Item | Reason |
|----|------|--------|
| BE-U1 | {task or endpoint with unclear spec} | {why — needs FDD clarification} |
```
