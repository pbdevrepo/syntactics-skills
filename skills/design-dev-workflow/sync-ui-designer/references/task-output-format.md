# Task Output Format — UI Designer

File: `projects/{project-name}/design-dev/{project-name}-design-tasks.md`

---

```markdown
# {Project Name} — Design Task List

**Project:** {project-name}
**Role:** UI/UX Designer
**Date:** {YYYY-MM-DD}
**Source:** Final Design Document (FDD) — all modules
**Status:** Ready for Designer

---

## Summary

| Module | Design Tasks | Status |
|--------|-------------|--------|
| {Module Name} | {count} | Pending |

Total Design Tasks: {N}

---

## Module: {Module Name}

### DESIGN-{N} — {Screen Name}

**Module:** {Module Name}
**Screen Type:** List / Form / Detail / Dashboard / Modal / Auth
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

**FDD Reference:** Section {X.X} — {module name} wireframe spec

**Notes:** {any specific design constraint from the FDD, or "None"}

---

{repeat DESIGN-{N} block for each task}

---

## Unresolved Items

| ID | Item | Reason |
|----|------|--------|
| UI-1 | {screen or element with unclear spec} | {why it's unclear — needs FDD update or BA clarification} |
```
