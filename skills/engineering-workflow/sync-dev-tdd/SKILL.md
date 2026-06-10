---
name: sync-dev-tdd
version: 1.3.0
description: >
  Execute a red-green-refactor loop for a specific task or module, anchored to the FDD. Auto-detects a prior dev session summary and loads it as the
  implementation baseline; runs standalone if no session exists. Trigger when a developer says
  "start tdd", "implement", "tdd this task", "run tdd", or after sync-dev-session completes.
  Invoked as: /sync-dev-tdd {Task-ID} {module} @{task-file}.md @{fdd-file}.md. Generates Swagger
  YAML for backend and full-stack sessions. Always run after sync-dev-session when a session exists.
---

# Test-Driven Development

**Invocation:**
```
/sync-dev-tdd BE-0001 users-module @{project-name}-backend-tasks.md @fdd-{module}.md
/sync-dev-tdd FE-0010 users-module @{project-name}-frontend-tasks.md @fdd-{module}.md
/sync-dev-tdd users-module @{project-name}-backend-tasks.md @fdd-{module}.md  (module-scope)
```

---

## Before You Start

Required inputs:
1. Task ID (recommended) or module name — the scope of this TDD session
2. Module name — ties the session to the sprint module
3. Task file — `{project-name}-backend-tasks.md` or `{project-name}-frontend-tasks.md`
4. FDD file — always required; used for standalone mode and to verify behavior

Do NOT ask for session type — it is auto-derived in Step 0.

---

## Philosophy

**Core principle**: Tests should verify behavior through public interfaces, not implementation details. Code can change entirely; tests shouldn't.

**Good tests** are integration-style: they exercise real code paths through public APIs. They describe _what_ the system does, not _how_ it does it. A good test reads like a specification - "user can checkout with valid cart" tells you exactly what capability exists. These tests survive refactors because they don't care about internal structure.

**Bad tests** are coupled to implementation. They mock internal collaborators, test private methods, or verify through external means (like querying a database directly instead of using the interface). The warning sign: your test breaks when you refactor, but behavior hasn't changed. If you rename an internal function and tests fail, those tests were testing implementation, not behavior.

See [tests.md](references/tests.md) for examples and [mocking.md](references/mocking.md) for mocking guidelines.

## Anti-Pattern: Horizontal Slices

**DO NOT write all tests first, then all implementation.** This is "horizontal slicing" - treating RED as "write all tests" and GREEN as "write all code."

This produces **crap tests**:

- Tests written in bulk test _imagined_ behavior, not _actual_ behavior
- You end up testing the _shape_ of things (data structures, function signatures) rather than user-facing behavior
- Tests become insensitive to real changes - they pass when behavior breaks, fail when behavior is fine
- You outrun your headlights, committing to test structure before understanding the implementation

**Correct approach**: Vertical slices via tracer bullets. One test → one implementation → repeat. Each test responds to what you learned from the previous cycle. Because you just wrote the code, you know exactly what behavior matters and how to verify it.

```
WRONG (horizontal):
  RED:   test1, test2, test3, test4, test5
  GREEN: impl1, impl2, impl3, impl4, impl5

RIGHT (vertical):
  RED→GREEN: test1→impl1
  RED→GREEN: test2→impl2
  RED→GREEN: test3→impl3
  ...
```

## Workflow

### 0. Setup — Derive Type, Scope, and Mode

**Do not ask for session type.** Derive it from inputs:
- Task ID starts with `BE-` and task file is backend tasks → **Backend** (generate Swagger)
- Task ID starts with `FE-` and task file is frontend tasks → **Frontend** (skip Swagger)
- Both backend and frontend task files passed → **Full-Stack** (generate Swagger)
- Module-scope with backend task file → **Backend**; with frontend task file → **Frontend**

**Determine scope:**
- Task ID provided → read that specific task row from the task file (Task, Type, Detail, Depends On)
- Module name only → read all tasks in that module from the task file

**Detect mode** — check for an existing session summary:
- If Task ID provided: look for `docs/sessions/{be|fe|fullstack}/{Task-ID}-*.md`
- If module-scope: look for `docs/sessions/{be|fe|fullstack}/{module}-*.md`
- Most recent file wins if multiple exist

**Session mode** (summary found): Load the session summary as the implementation baseline.
Decisions Made and Constraints Identified in the summary are treated as confirmed — do not
re-litigate them. Open Questions flagged in the summary must be resolved before coding begins.

**Standalone mode** (no summary found): Read the task row from the task file and the relevant
FDD module section to build context. Proceed directly to Planning (Step 1). Note in the TDD
output that no prior dev session was found.

**Tool Discovery:**

**Tier 1 - Synthesized registry (preferred):** Read `docs/agents/tools.md` if it exists (generated
by `sync-dev-setup`). Extract Framework MCPs, local skills, and docs-lookup MCPs from it directly.

**Tier 2 - Direct fallback (when `docs/agents/tools.md` is absent):** Read raw config sources in
this order and merge results:

| Source | What to extract |
|--------|----------------|
| `.mcp.json` (project root) | `mcpServers` object keys |
| `.claude/settings.json` (project root) | `mcpServers` object keys |
| `boost.json` (project root) | presence alone - classify as `framework:laravel` |
| `.claude/skills/` (directory listing) | subdirectory names = installed local skills |
| `.claude/agents/` (directory listing) | subdirectory names = invokable local agents |

Classify each discovered MCP server name:
- name contains `laravel`, or `boost.json` present - `framework:laravel`
- name contains `shadcn` - `framework:shadcn`
- name contains `wordpress` or `wp` - `framework:wordpress`
- name contains `context7` - `docs:lookup`
- name contains `playwright` or `cypress` - `testing:e2e`
- otherwise - `other`

Log the discovered tools at the top of the TDD session header:
```
Tools available: MCPs: {names or "none"} | Skills: {names or "none"} | Agents: {names or "none"}
```

Enforce the following during this session:

| Discovered tool | Enforce during this session |
|-----------------|-----------------------------|
| `framework:laravel` | Follow Laravel conventions: Eloquent models, Form Requests, Resource classes, service-layer pattern. Do not implement raw SQL or ad-hoc validation outside Request classes. |
| `framework:shadcn` | Use shadcn/ui components for all UI elements. Do not implement custom base components (Button, Input, Dialog, etc.) that shadcn already provides. Invoke the `/shadcn` skill if component generation is needed. |
| `framework:wordpress` | Follow WordPress coding standards: hooks/filters over direct overrides, WP_Query over raw SQL, capability checks before any privileged action. |
| `docs:lookup` (context7) | Before implementing a call to any third-party library, use the context7 MCP to pull current docs for that library. Do not rely on training-data knowledge for library APIs. |
| Local project skills (`.claude/skills/`) | Surface relevant skill names to the developer at the start of Planning so they can invoke them. Example: "This project has `/laravel-boost` available - consider invoking it during implementation." |
| Local project agents (`.claude/agents/`) | Surface agent names to the developer at the start of Planning. These are fully invokable via the `Agent` tool during this session. Example: "This project has a `backend-task-writer` agent available - consider delegating task scaffolding to it." |

If no tools are discovered from any source, proceed with default behavior.

### 1. Planning

When exploring the codebase, use the project's domain glossary so that test names and interface vocabulary match the project's language, and respect ADRs in the area you're touching.

Before writing any code:

- [ ] Confirm with user what interface changes are needed
- [ ] Confirm with user which behaviors to test (prioritize)
- [ ] Brainstorm and list specific Edge Cases based on the FDD (e.g., boundary limits, empty inputs, token/payload overflows, authorization bypasses).
- [ ] Identify opportunities for [deep modules](references/deep-modules.md) (small interface, deep implementation)
- [ ] Design interfaces for [testability](references/interface-design.md)
- [ ] List the behaviors to test (not implementation steps)
- [ ] Get user approval on the plan

Ask: "What should the public interface look like? Which behaviors are most important to test? Here are the edge cases I've identified for this module - should we write tests for all of them?"

**You can't test everything.** Confirm with the user exactly which behaviors matter most. Focus testing effort on critical paths and complex logic, not every possible edge case.

### 2. Tracer Bullet

Write ONE test that confirms ONE thing about the system:

```
RED:   Write test for first behavior → test fails
GREEN: Write minimal code to pass → test passes
```

This is your tracer bullet - proves the path works end-to-end.

### 3. Incremental Loop

For each remaining behavior:

```
RED:   Write next test → fails
GREEN: Minimal code to pass → passes
```

Rules:

- One test at a time
- Only enough code to pass current test
- Don't anticipate future tests
- Keep tests focused on observable behavior

### 4. Refactor & Verification

After all tests pass, look for [refactor candidates](references/refactoring.md):

- [ ] Extract duplication
- [ ] Deepen modules (move complexity behind simple interfaces)
- [ ] Apply SOLID principles where natural
- [ ] Consider what new code reveals about existing code
- [ ] Run tests after each refactor step

**Never refactor while RED.** Get to GREEN first.

#### CRITICAL GATE: Smoke Testing
Once the local TDD loop is 100% GREEN and refactoring is complete, you must simulate or execute a **Smoke Test** (System Integration Check). 

Verify the following:
- [ ] **Verify Schema/Contract:** Ensure any new public methods or API routes match the project's global formatting rules and tool expectations.
- [ ] **Execute "Happy Path" E2E:** Trigger a live local build/execution of the module to verify dependencies hook up correctly (no circular dependencies or initialization crashes).

**Smoke Test Outcomes:**
**PASSED:** Proceed directly to Swagger Output and FDD Compliance Summary.
**FAILED (RED STATE):** Treat this as a hard workflow failure. You are now structurally **RED**. You must:
  1. Capture the exact system breakdown or integration error log.
  2. Re-enter the **Incremental Loop**.
  3. Modify the implementation code to fix the integration environment breakdown.
  4. Run your local unit tests and re-smoke test until the output status resolves to **PASSED**.

## Swagger Output (Backend / Full-Stack only)

After all tests pass and refactoring is complete, generate a Swagger YAML file for every API endpoint implemented in this session.

Output file: `docs/api/{module}/{feature}_api.yaml`

Follow the format in [swagger-output-format.md](references/swagger-output-format.md).

Skip this step for frontend-only sessions.

## FDD Compliance Summary (all session types)

After Swagger generation (BE/FS) or after the Refactor pass (FE), run a structural coverage audit.
This is informational only in standalone mode - the gate lives in `dev-orchestrator` Phase 3.
If running through the orchestrator, this step is a preview; the orchestrator re-runs it as the gate.

Read the FDD file for this module. Extract all named requirements:
- **Business rules** - numbered items or `BR-` IDs under any `## Business Rules` section
- **Validation rules** - field constraint tables or `VAL-` IDs under `## Validation` sections
- **RBAC rules** - role-permission tables under `## Access Control` or `## Roles` sections
- **Workflow transitions** - status transition tables or workflow step lists

For each requirement, Grep the test files written in this session. Look for the rule ID (e.g. `BR-03`) or a 3-5 word key phrase from the rule in test names and comments (`*.spec.*`, `*Test.*`, `*_test.*`, `*_spec.*`).

Classify each item:
- **Green** - rule ID or key phrase found in a test name or `describe`/`it`/`test` block
- **Yellow** - found only in comments or implementation code, not in a test name
- **Red** - nothing found in any test file

Present the result as a compliance table:

```
| Rule                     | Type       | Coverage Found        | Rating |
|--------------------------|------------|-----------------------|--------|
| {rule text}              | Business   | {test name or "none"} | Green  |
| {rule text}              | Validation | {none}                | Red    |
```

**If Red items exist:** "Red items indicate FDD requirements with no test coverage.
These will block GitHub issue creation in the orchestrated flow.
Recommend adding tests for: {list reds}"

**If Yellow items exist:** "Yellow items will require explicit confirmation before issue creation."

**If all Green:** "All FDD requirements appear covered. Handoff is unblocked."

Tip: name tests with FDD rule IDs (e.g. `BR-03`, `VAL-07`) for more accurate detection.

## Checklist Per Cycle

```
[ ] Test describes behavior, not implementation
[ ] Test uses public interface only
[ ] Test would survive internal refactor
[ ] Code is minimal for this test
[ ] No speculative features added
```

## Execution Rules & Guardrails

1. **Strict Linearity:** You must execute this skill sequentially (0 → 1 → 2 → 3 → 4). You are explicitly blocked from generating Swagger YAML or the FDD Compliance Summary out of order.
2. **The Smoke Test Blockade:** The Smoke Test in Step 4 is a non-negotiable structural gate. 
   * **IF** the Smoke Test returns an initialization error, type crash, or runtime exception, **THEN** you must halt all forward momentum immediately. 
   * You are strictly forbidden from writing or outputting the `docs/api/..._api.yaml` file or the final `FDD Compliance Summary` table while the workflow status remains in a Smoke Test RED STATE.
   * Your immediate priority must pivot entirely to logging the environment error trace and debugging the implementation files.
3. **No Muted Errors:** If a local project skill, terminal command, or tool invocation prints an error or environmental warning, you must print it in full and address it immediately. Do not assume upstream orchestration or production layers will catch it.