---
name: sync-dev-session
version: 1.0.0
description: >
  Implementation grilling session for Syntactics Inc. developers. Grounds a dev in a specific module
  before coding by challenging implementation decisions against the FDD. Trigger when a developer says
  "dev session", "implementation session", "grill me on implementation", "start dev session", or
  invokes with a topic and FDD reference (e.g. "/sync-dev-session user-management @final-design.md").
  Always run before sync-dev-tdd. Saves a structured session summary to
  docs/sessions/{be|fe|fullstack}/{topic}-{date}.md and ends with an explicit handoff to the TDD skill.
---

# Dev Session

Grills a developer on their implementation plan for a specific module, anchored to the FDD. Surfaces
gaps, constraints, and risks before a single line of code is written. Saves a structured summary so
decisions are traceable.

Workflow: **sync-dev-session - sync-dev-tdd**

---

## Before You Start

Confirm inputs:
1. Topic — the module or feature being implemented (e.g. `user-management`)
2. FDD file reference — the Final Design Document for this project
3. Session type — ask the developer before proceeding:

```
Is this a Backend, Frontend, or Full-Stack session?
```

Read the relevant module section from the FDD before starting the grilling session.

---

## Workflow

### Step 1 — Identify Session Type

Ask:

```
Is this a Backend, Frontend, or Full-Stack session?
- Backend (BE) - API, business logic, database
- Frontend (FE) - UI, components, client-side logic
- Full-Stack (FS) - both BE and FE decisions in one session
```

### Step 2 — Read the FDD Module

From the FDD, extract for the specified module:
- Entity fields, types, and validation rules
- Business rules and conditional logic
- User roles and access control
- Workflow steps and status transitions
- API endpoints (if BE or FS)
- Screen/component specs (if FE or FS)

### Step 3 — Grill on Implementation

Challenge the developer's implementation plan against the FDD. Focus on:

**For BE / FS sessions:**
- How each business rule maps to a specific layer (controller, service, model)
- Validation strategy (where server-side validation lives)
- RBAC enforcement points
- Error handling for each endpoint
- Database design decisions that deviate from the FDD schema

**For FE / FS sessions:**
- Component breakdown and state management approach
- How client-side validation maps to FDD rules
- API contract assumptions (endpoint not yet built = flag as risk)
- Role-based rendering logic
- Edge states (loading, empty, error) coverage

Ask questions one at a time. Provide a recommended answer for each question before waiting for the
developer's response. Surface contradictions between the developer's plan and the FDD immediately.

### Step 4 — Write Session Summary

Write file: `docs/sessions/{be|fe|fullstack}/{topic}-{YYYY-MM-DD}.md`

Follow `references/session-summary-format.md` for the exact structure.

### Step 5 — Deliver Handoff

After writing the summary, output the appropriate handoff:

**BE session:**
```
Session complete. Summary saved to docs/sessions/be/{topic}-{date}.md

Proceed to: /sync-dev-tdd {module} @{project-name}-backend-tasks.md
```

**FE session:**
```
Session complete. Summary saved to docs/sessions/fe/{topic}-{date}.md

Proceed to: /sync-dev-tdd {module} @{project-name}-frontend-tasks.md
```

**Full-Stack session:**
```
Session complete. Summary saved to docs/sessions/fullstack/{topic}-{date}.md

Proceed to: /sync-dev-tdd {module} @{project-name}-backend-tasks.md @{project-name}-frontend-tasks.md
```

---

## Reference Files

- `references/session-summary-format.md` - Structured session summary format

---

## Output Formatting

- Never use em dashes (--) in any generated .md output. Use a hyphen (-) instead.
