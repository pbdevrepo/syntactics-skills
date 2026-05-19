---
name: sync-dev-session
version: 1.2.0
description: >
  Implementation grilling session for Syntactics Inc. developers. Grounds a dev in a specific task
  or module before coding by challenging implementation decisions against the FDD. Trigger when a
  developer says "dev session", "implementation session", "grill me on implementation", "start dev
  session", or invokes with a Task ID and module (e.g. "/sync-dev-session BE-0001 users-module
  @backend-tasks.md @fdd-users.md"). Task ID is recommended over module scope. Session type is
  auto-derived from the Task ID prefix and task file. Always run before sync-dev-tdd. Saves a
  structured session summary to docs/sessions/{be|fe|fullstack}/{Task-ID or topic}-{date}.md and
  ends with an explicit handoff to sync-dev-tdd.
---

# Dev Session

Grills a developer on their implementation plan for a specific task or module, anchored to the FDD.
Surfaces gaps, constraints, and risks before a single line of code is written. Saves a structured
summary so decisions are traceable.

Workflow: **sync-dev-session - sync-dev-tdd**

**Recommended invocation:**
```
/sync-dev-session BE-0001 users-module @{project-name}-backend-tasks.md @fdd-{module}.md
/sync-dev-session FE-0010 users-module @{project-name}-frontend-tasks.md @fdd-{module}.md
```

**Module-scope invocation (broader sessions):**
```
/sync-dev-session users-module @{project-name}-backend-tasks.md @fdd-{module}.md
```

---

## Before You Start

Confirm inputs:
1. Task ID (recommended) or module name — the scope of this session
2. Module name — always required; ties the session to the sprint module
3. Task file — `{project-name}-backend-tasks.md` or `{project-name}-frontend-tasks.md`
4. FDD file — the Final Design Document module file for this project

Do NOT ask the developer for session type — derive it in Step 1.

**Version Gate** — if a previous session summary already exists for this Task ID or module:
1. Read the task file's `artifact_version` and the FDD module file's `artifact_version`
2. Compare them to the existing session summary's `source_versions.task_list` and `source_versions.fdd`
3. If either differs: **hard stop.** Name which artifact changed and say: "The session summary was generated from older inputs. Regenerate the session using the current task list and FDD before proceeding."

Do not warn-and-continue. Regeneration is required.

---

## Workflow

### Step 1 — Derive Session Type and Scope

**Session type** — derive from inputs, do not ask:
- Task ID starts with `BE-` and task file is backend tasks → **Backend**
- Task ID starts with `FE-` and task file is frontend tasks → **Frontend**
- Both a backend and frontend task file are passed → **Full-Stack**
- Module-scope session with backend task file → **Backend**
- Module-scope session with frontend task file → **Frontend**

**Session scope** — derive from inputs:
- Task ID provided → read that specific task row from the task file to get: Task, Type, Detail,
  Depends On. The grilling session is scoped to that task.
- Module name only → read all tasks in that module from the task file. The session covers the
  full module.

### Step 2 — Read the FDD Module

From the FDD, extract for the scoped module:
- Entity fields, types, and validation rules
- Business rules and conditional logic
- User roles and access control
- Workflow steps and status transitions
- API endpoints (if Backend or Full-Stack)
- Screen/component specs (if Frontend or Full-Stack)

If Task ID was provided, focus on the section of the FDD that corresponds to the specific task
type (e.g. for a Migration task, focus on entity fields and schema; for an Endpoint task, focus
on business rules and RBAC).

### Step 3 — Grill on Implementation

Challenge the developer's implementation plan against the FDD. Focus on:

**For Backend / Full-Stack sessions:**
- How each business rule maps to a specific layer (controller, service, model)
- Validation strategy (where server-side validation lives)
- RBAC enforcement points
- Error handling for each endpoint
- Database design decisions that deviate from the FDD schema

**For Frontend / Full-Stack sessions:**
- Component breakdown and state management approach
- How client-side validation maps to FDD rules
- API contract assumptions (endpoint not yet built = flag as risk)
- Role-based rendering logic
- Edge states (loading, empty, error) coverage

Ask questions one at a time. Provide a recommended answer before waiting for the developer's
response. Surface contradictions between the developer's plan and the FDD immediately.

### Step 4 — Write Session Summary

Determine the filename:
- Task ID provided → `docs/sessions/{be|fe|fullstack}/{Task-ID}-{YYYY-MM-DD}.md`
- Module scope → `docs/sessions/{be|fe|fullstack}/{module-name}-{YYYY-MM-DD}.md`

Follow `references/session-summary-format.md` for the exact structure. Include the Task ID in
the Context section if one was provided.

### Step 5 — Deliver Handoff

**Backend session (task-level):**
```
Session complete. Summary saved to docs/sessions/be/{Task-ID}-{date}.md

Proceed to: /sync-dev-tdd {Task-ID} {module} @{project-name}-backend-tasks.md @{fdd-file}.md
```

**Frontend session (task-level):**
```
Session complete. Summary saved to docs/sessions/fe/{Task-ID}-{date}.md

Proceed to: /sync-dev-tdd {Task-ID} {module} @{project-name}-frontend-tasks.md @{fdd-file}.md
```

**Full-Stack session (task-level):**
```
Session complete. Summary saved to docs/sessions/fullstack/{Task-ID}-{date}.md

Proceed to: /sync-dev-tdd {Task-ID} {module} @{project-name}-backend-tasks.md @{project-name}-frontend-tasks.md @{fdd-file}.md
```

**Module-scope session:**
```
Session complete. Summary saved to docs/sessions/{type}/{module}-{date}.md

Proceed to: /sync-dev-tdd {module} @{task-file}.md @{fdd-file}.md
```

---

## Reference Files

- `references/session-summary-format.md` - Structured session summary format

