# Task Output Format — Frontend Task Creator

File: `projects/{project-name}/pm/{project-name}-frontend-tasks.md`

---

## Default Format — Compact Table

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

---

## Fallback Format — Detailed Block (complex tasks only)

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
