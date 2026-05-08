# Task Output Format — Frontend Developer

File: `projects/{project-name}/design-dev/{project-name}-frontend-tasks.md`

---

```markdown
# {Project Name} — Frontend Task List

**Project:** {project-name}
**Role:** Frontend Developer
**Date:** {YYYY-MM-DD}
**Source:** FDD (all modules) + Design Task List ({project-name}-design-tasks.md)
**Status:** Ready for Frontend Dev

---

## Summary

| Module | Frontend Tasks | Status |
|--------|---------------|--------|
| {Module Name} | {count} | Pending |

Total Frontend Tasks: {N}

---

## Global / Project-Level Tasks

### FE-0001 — Project Scaffolding & Global Layout

**Role:** [FE]
**Module:** Global
**Description:** Set up project structure, routing, navigation, sidebar, header, footer, and auth guards.
**Depends on:** None
**Figma Ref:** {Figma page for global layout}
**Notes:** Complete before any module tasks begin.

---

## Module: {Module Name}

### FE-{NNNN} — {Task Name}

**Role:** [FE]
**Module:** {Module Name}
**Screen Type:** List / Form / Detail / Dashboard / Modal / Component
**Figma Ref:** DESIGN-{N} — {screen name}
**Description:** {specific implementation description — what to build, not how}

**Fields / Validation (if form):**
- {field name}: {type} — {validation rule from FDD}

**API Integration:**
- Method: {GET / POST / PUT / DELETE}
- Endpoint: {endpoint path or "TBD — pending backend task BE-{N}"}
- Payload: {brief description or "N/A"}

**States to Implement:**
- [ ] Default / loaded
- [ ] Loading (skeleton or spinner)
- [ ] Empty state
- [ ] Error / validation state

**Depends on:** {task ID(s) that must be done first, or "None"}
**Blocks:** {task ID(s) that cannot start until this is done, or "None"}

---

{repeat FE-{NNNN} block for each task}

---

## Unresolved Items

| ID | Item | Reason |
|----|------|--------|
| FE-U1 | {task or screen with unclear spec} | {why — needs FDD clarification or design update} |
```
