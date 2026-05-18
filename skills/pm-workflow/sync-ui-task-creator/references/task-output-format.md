# Task Output Format — UI Designer

File: `projects/{project-name}/pm/{project-name}-design-tasks.md`

---

## Default Format — Compact Table

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

---

## Fallback Format — Detailed Block (complex screens only)

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
