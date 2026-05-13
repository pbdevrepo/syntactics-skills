---
name: sync-tdd-fe
version: 1.0.0
description: >
  TDD frontend implementation — failing test → implement → refactor loop per frontend task, anchored
  to FDD UI rules and validation. Trigger: "start frontend TDD", "implement frontend", "tdd frontend".
  Run after sync-dev-session, before sync-qa-planner.
---

# TDD - Frontend Developer

Drives frontend implementation task-by-task using a failing test - implement - refactor loop.
The FDD is the behavior contract for UI rules and validation. The frontend task list is the
execution roadmap. Both are required.

Workflow: **sync-dev-session - sync-tdd-fe - sync-qa-planner**

---

## Before You Start

Confirm inputs:
1. Module name — the specific module being implemented
2. Frontend task list: `projects/{project-name}/design-dev/{project-name}-frontend-tasks.md`
3. FDD file — the relevant module section for UI behavior and validation rules

All frontend tasks for the module must be present in the task list before proceeding.

---

## Workflow

### Step 1 — Load the Module Tasks

From `{project-name}-frontend-tasks.md`, extract all tasks for the specified module.

Group by type for implementation order:
```
1. Global layout and navigation (once per project)
2. Auth screens
3. List and index screens
4. Form screens (create and edit)
5. Detail and view screens
6. Modals and confirmations
7. Dashboard widgets
8. Error and empty states
```

### Step 2 — TDD Loop (repeat per task)

For each task, execute this loop:

**1. Write the failing test first**
- Read the FDD section for the UI behavior and validation rules this task implements
- Write a component test that asserts the expected behavior — it must fail before implementation
- For form tasks: test required field validation, format validation, and submit behavior
- For list tasks: test default load, search, filter, and empty state rendering
- For role-based tasks: test that unauthorized roles cannot see restricted elements
- For API integration tasks: mock the endpoint and test loading, success, and error states

**2. Implement the minimum code to make it pass**
- Write only enough code to satisfy the test — no extras
- Cross-reference the FDD to confirm UI behavior, field labels, and validation messages match exactly

**3. Refactor**
- Clean up without changing behavior
- Confirm tests still pass after refactor

**4. Mark the task complete before moving to the next**

### Step 3 — Self-Review Before Delivering

- [ ] Every task has a corresponding test written before implementation
- [ ] Every form test covers: happy path, required field missing, and invalid format
- [ ] Every list test covers: default load, search result, and empty state
- [ ] Every role-based view test covers: authorized access and unauthorized access
- [ ] Every API integration test covers: loading state, success, and error response
- [ ] All tests reference the FDD rule they are asserting
- [ ] All tests pass after implementation

### Step 4 — Deliver

```
Frontend implementation complete for {module}.

Next: sync-qa-planner - pass the FDD files, {project-name}-frontend-tasks.md,
and {project-name}-backend-tasks.md.
```

---

## Output Formatting

- Never use em dashes (--) in any generated .md output. Use a hyphen (-) instead.
