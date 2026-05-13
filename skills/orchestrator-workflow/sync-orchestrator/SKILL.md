---
name: sync-orchestrator
version: 1.0.0
description: >
  Runs the Syntactics skill pipeline end-to-end, chaining skills automatically and pausing at
  approval gates for human review. Trigger when a user says "run the pipeline", "orchestrate",
  "start the full workflow", "auto-run the pipeline", or "continue the pipeline for [project]".
  Handles full runs from requirement-analyzer through qa-to-ticket, and mid-pipeline resumptions
  from any step. Reads outputs/triggers/approval/next fields from each skill's SKILL.md to build
  and walk the chain. Never skips an approval gate without explicit human sign-off.
outputs: ~
triggers: ~
approval: false
next: ~
---

# Orchestrator

Chains the Syntactics pipeline end-to-end. Auto-runs low-stakes steps. Pauses at approval gates.
Resumes from any point.

**Pipeline:**
```
sync-requirement-analyzer [GATE]
  → sync-proposal-writer [GATE]
    → sync-ba-project-intake [GATE]
      → sync-final-design [GATE]
        → sync-ui-designer
          → sync-frontend-developer
            → sync-backend-developer
              → sync-qa-planner
                → sync-qa-runner
                  → sync-qa-to-ticket [GATE]
```

---

## Phase 1 — Setup

Ask the user:

1. **Project name** — kebab-case (e.g. `client-portal`). All artifact paths use this token.
2. **Entry point** — which skill to start from. Default: `sync-requirement-analyzer`. Accept any skill name in the pipeline to resume mid-run.
3. **Skills base path** — where skills are installed. Default: `~/.claude/skills/` (Windows: `%USERPROFILE%\.claude\skills\`). Accept override if non-standard.

Store: `{project}`, `{start}`, `{skills-root}`.

---

## Phase 2 — Build Pipeline Map

Walk the `next:` chain starting from `{start}`:

1. Read `{skills-root}/{current-skill}/SKILL.md`
2. Extract frontmatter fields: `outputs`, `triggers`, `approval`, `next`
3. Substitute `{project-name}` → `{project}` in all path fields
4. Append step to pipeline map
5. If `next: ~` → end of chain. Stop.
6. Else set `current-skill` = value of `next` and repeat.

Display the resolved pipeline map before walking it:

```
Pipeline for project: {project}
Starting at: {start}

  1. sync-requirement-analyzer  [GATE]   → projects/{project}/sales/{project}-requirements.md
  2. sync-proposal-writer        [GATE]   → projects/{project}/sales/{project}-proposal.md
  3. sync-ba-project-intake      [GATE]   → projects/{project}/ba/{project}-intake.md
  4. sync-final-design           [GATE]   → projects/{project}/ba/FDD-{module}.md
  5. sync-ui-designer                     → projects/{project}/design-dev/{project}-design-tasks.md
  6. sync-frontend-developer              → projects/{project}/design-dev/{project}-frontend-tasks.md
  7. sync-backend-developer               → projects/{project}/design-dev/{project}-backend-tasks.md
  8. sync-qa-planner                      → projects/{project}/qa/{project}-qa-plan.md
  9. sync-qa-runner                       → projects/{project}/qa/{project}-qa-plan.md (updated)
 10. sync-qa-to-ticket           [GATE]   → github-issues
```

Ask: **"Start the pipeline? (yes / start from step N)"**. Do not proceed without confirmation.

---

## Phase 3 — Walk the Pipeline

For each step in order:

### 3a — Pre-flight check

If the step has `triggers:` (not `~`):
- Check if the trigger artifact file exists on disk.
- If missing: **stop**. Tell the user which file is missing and which skill produces it. Do not skip.

### 3b — Auto step (`approval: false`)

```
▶ Auto-running: {skill-name}
  Input:  {triggers path}
  Output: {outputs path}
```

Invoke the skill by loading it and running it fully with `{project}` as the project context.
When the skill finishes and writes its output file, confirm the file exists.

```
✓ {skill-name} complete → {outputs path}
  Proceeding to {next-skill}...
```

Move to next step immediately. No human input needed.

### 3c — Gate step (`approval: true`)

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
⏸  GATE: {skill-name}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

1. Run the skill (same as auto step — invoke and let it complete).
2. When the skill finishes, display:
   - Artifact path
   - A short summary (≤5 bullet points) of what the artifact contains
3. Wait for one of:

| Input | Action |
|---|---|
| `approve` | Proceed to next step |
| `reject` | Stop pipeline. Ask if user wants to re-run this step or abort. |
| `edit` | Pause. User edits the artifact file manually. Resume when user types `done`. |
| `abort` | Stop pipeline entirely. Print resume command. |

**Never auto-advance past a gate.** If the user doesn't type one of the above, re-prompt.

Resume command to show on abort or reject:
```
/sync-orchestrator  (then specify project: {project}, start from: {skill-name})
```

---

## Phase 4 — Completion

When `next: ~` is reached and the final gate is approved:

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
✓ Pipeline complete: {project}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Artifacts written:
  projects/{project}/sales/{project}-requirements.md
  projects/{project}/sales/{project}-proposal.md
  projects/{project}/ba/{project}-intake.md
  projects/{project}/ba/FDD-*.md
  projects/{project}/design-dev/{project}-design-tasks.md
  projects/{project}/design-dev/{project}-frontend-tasks.md
  projects/{project}/design-dev/{project}-backend-tasks.md
  projects/{project}/qa/{project}-qa-plan.md
  GitHub issues created

Next: sync-dev-to-fix for any FAIL tickets, or close the project.
```

---

## Rules

- **Never skip a gate.** `approval: true` always requires a human response before continuing.
- **Never invent artifact content.** Each skill generates its own output — the orchestrator only invokes and monitors.
- **Stop on missing trigger.** A missing prerequisite file means the upstream skill did not complete. Do not fabricate the file.
- **Preserve project name exactly.** All path substitutions use the exact `{project}` string the user provided — no casing changes.
- **Mid-pipeline start.** When resuming from a non-entry step, skip the trigger check for the first step only (assume the user has verified the prerequisite exists).
