# Task Output Format

Reference for all three task files produced by `task-orchestrator`.

---

## Backend Tasks (`docs/pm/{project-name}-backend-tasks.md`)

### Default Format — Compact Table

Use this for all tasks. One row per implementable unit. Tasks are grouped by sprint — the sprint
number maps directly to the Priority group in `{project-name}-sprint-tasks.md` (Priority 1 = Sprint 1).
Within each sprint, build order follows Priority 1-6 categories.

```markdown
# {Project Name} — Backend Task List

**Project:** {project-name}
**Role:** Backend Developer
**Date:** {YYYY-MM-DD}
**Source:** FDD (all modules) + Sprint Plan ({project-name}-sprint-tasks.md)
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

### Fallback Format — Detailed Block (complex tasks only)

Use a detailed block **only** when a task has non-obvious requirements that cannot fit a table row — e.g., endpoints with complex business rules, multi-step side effects, approval workflows, or 5+ request fields. Replace the relevant table row with this block below the table.

```markdown
### BE-{NNNN} — {Task Name}  *(complex — see detail below)*

**Role:** [BE]
**Priority:** {1-6}
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

---

## Design Tasks (`docs/pm/{project-name}-design-tasks.md`)

### Default Format — Compact Table

Use this for all tasks. One row per screen or component. Tasks are grouped by sprint — the sprint
number maps directly to the Priority group in `{project-name}-sprint-tasks.md` (Priority 1 = Sprint 1).

```markdown
# {Project Name} — Design Task List

**Project:** {project-name}
**Role:** UI/UX Designer
**Date:** {YYYY-MM-DD}
**Source:** FDD (all modules) + Sprint Plan ({project-name}-sprint-tasks.md)
**Status:** Ready for Designer

---

## Summary

| Sprint | Module | Tasks | Status |
|--------|--------|-------|--------|
| Sprint 1 | {Module Name} | {count} | Pending |
| Sprint 2 | {Module Name} | {count} | Pending |

**Total Design Tasks: {N}**

---

## Sprint 1

| ID | Module | Screen | Type | Roles | Key Fields | States | Notes |
|----|--------|--------|------|-------|------------|--------|-------|
| DESIGN-1 | {Module} | {Screen Name} | {Type} | {Roles} | {field1, field2, ...} | {D,E,V,L} | {constraint or "-"} |

## Sprint 2

| ID | Module | Screen | Type | Roles | Key Fields | States | Notes |
|----|--------|--------|------|-------|------------|--------|-------|
| DESIGN-{N} | {Module} | {Screen Name} | {Type} | {Roles} | {field1, field2, ...} | {D,E,V,L} | {constraint or "-"} |

**Type values:** List · Form · Detail · Dashboard · Modal · Auth
**States codes:** `D` = Default/loaded · `E` = Empty state · `V` = Validation/error · `L` = Loading/async

---

## Unresolved Items

| ID | Item | Reason |
|----|------|--------|
| UI-1 | {screen or element} | {needs FDD update or BA clarification} |
```

### Fallback Format — Detailed Block (complex screens only)

Use a detailed block **only** when a screen has non-obvious design constraints that cannot be
expressed in a table row — e.g., multi-step wizards, conditional field logic, or role-specific
layout differences. Replace the relevant table row with this block below the sprint section.

```markdown
### DESIGN-{N} — {Screen Name}  *(complex screen — see detail below)*

**Sprint:** {N}
**Module:** {Module Name}
**Screen Type:** {Type}
**User Roles:** {which roles see this screen}
**Figma Page:** {suggested Figma page name}

**Fields / Elements to Design:**
- {field or UI element 1}
- {field or UI element 2}

**States to Include:**
- [ ] Default / loaded state
- [ ] Empty state (if list)
- [ ] Validation / error state (if form)
- [ ] Loading state (if async data)

**FDD Reference:** {module name} - wireframe spec
**Design Constraint:** {specific constraint from FDD that warranted the detail block}
```

---

## Frontend Tasks (`docs/pm/{project-name}-frontend-tasks.md`)

### Default Format — Compact Table

Use this for all tasks. One row per implementable unit. Tasks are grouped by sprint — the sprint
number maps directly to the Priority group in `{project-name}-sprint-tasks.md` (Priority 1 = Sprint 1).

```markdown
# {Project Name} — Frontend Task List

**Project:** {project-name}
**Role:** Frontend Developer
**Date:** {YYYY-MM-DD}
**Source:** FDD (all modules) + Design Task List ({project-name}-design-tasks.md) + Sprint Plan ({project-name}-sprint-tasks.md)
**Status:** Ready for Frontend Dev

---

## Summary

| Sprint | Module | Tasks | Status |
|--------|--------|-------|--------|
| Sprint 1 | Global | {count} | Pending |
| Sprint 1 | {Module Name} | {count} | Pending |
| Sprint 2 | {Module Name} | {count} | Pending |

**Total Frontend Tasks: {N}**

---

## Sprint 1

| ID | Module | Task | Type | Figma Ref | API | States | Depends On | Notes |
|----|--------|------|------|-----------|-----|--------|------------|-------|
| FE-0001 | Global | Project scaffolding & global layout | Component | {Figma page} | - | D | - | Do first |
| FE-{N} | {Module} | {Task name} | {Type} | DESIGN-{N} | {METHOD /path or TBD} | {D,L,E,V} | {FE-N or -} | {constraint or -} |

## Sprint 2

| ID | Module | Task | Type | Figma Ref | API | States | Depends On | Notes |
|----|--------|------|------|-----------|-----|--------|------------|-------|
| FE-{N} | {Module} | {Task name} | {Type} | DESIGN-{N} | {METHOD /path or TBD} | {D,L,E,V} | {FE-N or -} | {constraint or -} |

**Type values:** List · Form · Detail · Dashboard · Modal · Auth · Component
**States codes:** `D` = Default/loaded · `L` = Loading · `E` = Empty state · `V` = Validation/error
**API column:** write `GET /path`, `POST /path`, etc., or `TBD` if endpoint not yet scoped

---

## Unresolved Items

| ID | Item | Reason |
|----|------|--------|
| FE-U1 | {task or screen} | {needs FDD clarification or design update} |
```

### Fallback Format — Detailed Block (complex tasks only)

Use a detailed block **only** when a task has non-obvious implementation requirements that cannot
fit a table row — e.g., multi-step forms with conditional field logic, complex role-based UI
branching, or tasks with 5+ API calls. Replace the relevant table row with this block below the
sprint section.

```markdown
### FE-{NNNN} — {Task Name}  *(complex - see detail below)*

**Sprint:** {N}
**Role:** [FE]
**Module:** {Module Name}
**Screen Type:** {Type}
**Figma Ref:** DESIGN-{N} - {screen name}
**Description:** {specific implementation description - what to build, not how}

**Fields / Validation (if form):**
- {field name}: {type} - {validation rule}

**API Integration:**
- {METHOD} {endpoint} - {brief payload note or "N/A"}

**States to Implement:**
- [ ] Default / loaded
- [ ] Loading (skeleton or spinner)
- [ ] Empty state
- [ ] Error / validation state

**Depends on:** {task ID(s) or "None"}
**Blocks:** {task ID(s) or "None"}
**Complexity note:** {why this task warranted a detail block}
```
