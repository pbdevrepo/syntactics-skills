---
name: sync-design-to-tasks
version: 1.1.0
description: >
  Orchestrates the full PM task-generation pipeline for Syntactics Inc. after the Final Design
  Document (FDD) is complete. Trigger when a PM says "generate all tasks", "run task creators",
  "kick off task pipeline", "design to tasks", or "create tasks from FDD". Reads the FDD and
  chains sync-ui-task-creator → sync-frontend-task-creator → sync-backend-task-creator in order,
  gating each step on the previous output. Always run after sync-final-design completes and before
  sync-dev-session in the pm workflow.
---

# Design-to-Tasks Orchestrator

Runs the full task-creation pipeline from a completed FDD. Chains:

**sync-ui-task-creator → sync-frontend-task-creator → sync-backend-task-creator**

Each step gates on the previous output file existing before proceeding.

---

## Before You Start

Ask the user:

1. **Project name** — used to locate all files under `projects/{project-name}/`
2. **FDD location** — path(s) to module `.md` files, or confirm they are already at `projects/{project-name}/ba/`

Confirm sprint plan exists at `projects/{project-name}/ba/{project-name}-sprint-tasks.md`. If missing, stop and ask the user to run `sync-sprint-planner` first.

Do not proceed until both FDD files and sprint plan are confirmed present.

**Sprint Map — build once here.** Read `projects/{project-name}/ba/{project-name}-sprint-tasks.md`. For each Priority section (Priority 1 through Priority 6), map modules to their sprint number: Priority N = Sprint N. Flag unresolved modules (no match) → assign to last sprint. Pass this sprint map in context to all three sub-skills so they skip their Step 0.

---

## Pipeline

### Stage 1 — UI Design Tasks (`sync-ui-task-creator`)

Load and execute `sync-ui-task-creator` in full.

**Input:** FDD module files + sprint plan
**Output:** `projects/{project-name}/pm/{project-name}-design-tasks.md`

Announce before starting:
> "Stage 1 of 3 — Generating UI design tasks..."

Run the full `sync-ui-task-creator` workflow. Do not skip any of its steps.

Gate: confirm `{project-name}-design-tasks.md` was written before continuing.

---

### Stage 2 — Frontend Tasks (`sync-frontend-task-creator`)

Load and execute `sync-frontend-task-creator` in full.

**Input:** FDD module files + sprint plan + `{project-name}-design-tasks.md`
**Output:** `projects/{project-name}/pm/{project-name}-frontend-tasks.md`

Announce before starting:
> "Stage 2 of 3 — Generating frontend development tasks..."

Run the full `sync-frontend-task-creator` workflow. Do not skip any of its steps.

Gate: confirm `{project-name}-frontend-tasks.md` was written before continuing.

---

### Stage 3 — Backend Tasks (`sync-backend-task-creator`)

Load and execute `sync-backend-task-creator` in full.

**Input:** FDD module files + sprint plan + `{project-name}-frontend-tasks.md`
**Output:** `projects/{project-name}/pm/{project-name}-backend-tasks.md`

Announce before starting:
> "Stage 3 of 3 — Generating backend development tasks..."

Run the full `sync-backend-task-creator` workflow. Do not skip any of its steps.

---

## Deliver

After all three stages complete, report:

```
Pipeline complete.

  Design tasks:   projects/{project-name}/pm/{project-name}-design-tasks.md
  Frontend tasks: projects/{project-name}/pm/{project-name}-frontend-tasks.md
  Backend tasks:  projects/{project-name}/pm/{project-name}-backend-tasks.md

Next: sync-dev-session (backend) or sync-dev-session (frontend)
```

---

## Handoff Chain

| Step | Skill | Input Needed |
|------|-------|--------------|
| <- Upstream | `sync-final-design` | Completed FDD module files |
| Stage 1 | `sync-ui-task-creator` | FDD + sprint plan |
| Stage 2 | `sync-frontend-task-creator` | FDD + sprint plan + design tasks |
| Stage 3 | `sync-backend-task-creator` | FDD + sprint plan + frontend tasks |
| -> Downstream | `sync-dev-session` | Backend or frontend task list |
