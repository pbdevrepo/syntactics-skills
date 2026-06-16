# Roadmap

## Planned: Agent Pipeline Automation

**Goal:** Chain skills end-to-end so an orchestrator agent hands off between workflow steps without manual triggering.

### How it works today

Each skill runs in a human-in-the-loop session. A human triggers the skill, reviews its artifact output, then manually triggers the next skill. The pipeline is:

```
sync-project-intake
  → sync-proposal-writer
    → sync-final-design
        → sync-ui-task-creator
          → sync-frontend-task-creator
            → sync-backend-task-creator
              → sync-qa-planner
                → sync-qa-runner
                  → sync-qa-to-ticket
```

### What needs to be built

1. **Orchestrator skill** — reads the artifact produced by skill N and triggers skill N+1 automatically
2. **Trigger conditions** — each skill declares what artifact it produces and what artifact triggers the next (e.g., when `FDD.md` is written, start `sync-ui-task-creator`)
3. **Approval gates** — pause for human review at high-stakes handoffs: requirements → FDD → sprint plan

### Recommended approach: hybrid pipeline

| Mode | When to use |
|---|---|
| Auto-run | Low-stakes steps (task list generation, quotation formatting) |
| Approval gate | High-stakes steps (requirements doc, FDD, sprint plan) |

This prevents a bad artifact at step 2 from silently poisoning all downstream steps.

### Scope

- New `sync-orchestrator` skill in a new `orchestrator-workflow/` directory
- Each existing skill gets an `outputs:` and `triggers:` field in its YAML frontmatter
- Orchestrator reads those fields to build and walk the pipeline
- Gates are declared per-skill as `approval: true/false`

---

## Implemented: Artifact Versioning + Workflow Lean-up (2026-05-19)

**Goal:** Make all artifacts version-tracked so downstream skills detect staleness and hard-block before generating output from a superseded spec. Reduce token waste from redundant reads and repeated inline rules.

### Artifact versioning

Every versioned artifact gets YAML frontmatter on write:

```yaml
---
artifact_version: 1.0.0
generated_by: sync-final-design@1.1.0
generated_at: 2026-05-19
source_versions:
  sprint_tasks: 1.0.0
  schema: 1.2.0
---
```

Rules: patch bump for field edits, minor bump for adding/removing modules. Auto-applied by the producing skill on every write — no manual bump.

**Artifacts to version:** Intake Document, Schema, Sprint Task List, FDD, PM Task Lists (design, frontend, backend), QA Plan.

**Version Gate:** Each skill checks its immediate upstream `source_versions` on run. Mismatch = hard block. No warn-and-continue. The consuming artifact must be regenerated before the skill proceeds. See `docs/adr/0001-version-mismatch-hard-block.md`.

**Version chain (immediate upstream only):**
```
Intake Doc → Schema → Sprint Task List → FDD → PM Task Lists → QA Plan → Dev Session
```
See `docs/adr/0002-immediate-upstream-version-check.md`.

### Skill changes

- `sync-final-design` — add approval gate prompt before auto-triggering `sync-design-to-tasks`; progressive reference loading (template-structure.md always, behavior-validation-guide.md after module type identified in Step 2a, database-standards.md at Step 2c Tables only)
- `sync-design-to-tasks` — build Sprint Map once at orchestrator level; sub-skills skip Step 0 if sprint map already in context
- `sync-qa-planner` — add version frontmatter and Version Gate check on FDD + task list versions
- `sync-dev-session` — add Version Gate check on task file version + FDD version

### Cleanup

- `deprecated-workflow/` — delete entirely (sync-tdd-be and sync-tdd-fe superseded by sync-dev-tdd in engineering-workflow)
- `engineering-workflow/sync-dev-tdd` — move loose files (deep-modules.md, interface-design.md, mocking.md, refactoring.md, tests.md) into references/ subfolder
- `CLAUDE.md` — add global output formatting rule (no em dashes); add copyable project-setup reference block for applying the rule to client project CLAUDE.md files; remove per-skill `## Output Formatting` sections once global rule is in place
