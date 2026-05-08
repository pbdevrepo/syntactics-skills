# Task Output Format — UI Designer

File: `projects/{project-name}/design-dev/{project-name}-design-tasks.md`

---

## Default Format — Compact Table

Use this for all tasks. One row per screen or component.

```markdown
# {Project Name} — Design Task List

**Project:** {project-name}
**Role:** UI/UX Designer
**Date:** {YYYY-MM-DD}
**Source:** Final Design Document (FDD) — all modules
**Status:** Ready for Designer

---

## Summary

| Module | Tasks | Status |
|--------|-------|--------|
| {Module Name} | {count} | Pending |

**Total Design Tasks: {N}**

---

## Task List

| ID | Module | Screen | Type | Roles | Key Fields | States | Notes |
|----|--------|--------|------|-------|------------|--------|-------|
| DESIGN-1 | {Module} | {Screen Name} | {Type} | {Roles} | {field1, field2, ...} | {D,E,V,L} | {constraint or "—"} |
| DESIGN-2 | ... | ... | ... | ... | ... | ... | ... |

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

Use a detailed block **only** when a screen has non-obvious design constraints that cannot be expressed in a table row — e.g., multi-step wizards, conditional field logic, or role-specific layout differences. Replace the relevant table row with this block below the table.

```markdown
### DESIGN-{N} — {Screen Name}  *(complex screen — see detail below)*

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

**FDD Reference:** {module name} — wireframe spec
**Design Constraint:** {specific constraint from FDD that warranted the detail block}
```
