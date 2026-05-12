# Roadmap

## Planned: Agent Pipeline Automation

**Goal:** Chain skills end-to-end so an orchestrator agent hands off between workflow steps without manual triggering.

### How it works today

Each skill runs in a human-in-the-loop session. A human triggers the skill, reviews its artifact output, then manually triggers the next skill. The pipeline is:

```
sync-requirement-analyzer
  → sync-proposal-writer
    → sync-ba-project-intake
      → sync-final-design
        → sync-ui-designer
          → sync-frontend-developer
            → sync-backend-developer
              → sync-qa-planner
                → sync-qa-runner
                  → sync-qa-to-ticket
```

### What needs to be built

1. **Orchestrator skill** — reads the artifact produced by skill N and triggers skill N+1 automatically
2. **Trigger conditions** — each skill declares what artifact it produces and what artifact triggers the next (e.g., when `FDD.md` is written, start `sync-ui-designer`)
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
