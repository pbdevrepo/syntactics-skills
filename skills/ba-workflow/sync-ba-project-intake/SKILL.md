---
name: sync-ba-project-intake
version: 1.1.0
description: >
  Entry point for the BA project lifecycle at Syntactics Inc. Trigger when a BA uploads a proposal
  PDF, says "start the intake" / "I have a proposal" / "we got a new project", or shares any client
  brief to begin project analysis. Always run this skill first — before database-designer,
  sprint-planner, and final-design.
---

# BA Project Intake

Read the proposal and any supporting input. Produce the intake document. Do not design, spec, or estimate. Produce clarity only.

Workflow: **ba-project-intake → database-designer → sprint-planner → final-design**

---

## Phase 1 — Read

Accept: PDF proposal (primary), supporting docs, emails, notes, transcripts.

Read everything. No output yet. While reading, note internally:
- Every module/feature — explicit or implied
- Every user role — explicit or implied
- Every constraint — tech, timeline, budget, compliance
- Every gap, ambiguity, or contradiction

See `references/extraction-rules.md` for how to extract modules from messy proposals.

---

## Phase 2 — Module Inventory

Post inline in chat. Not a file yet.

If the proposal has more than 15 modules, show the first 15 in the table and summarize the remainder in a note below (e.g., "8 additional modules identified — listed in intake doc").

| # | Module | Description (1 line) | Source | Confidence |
|---|--------|----------------------|--------|------------|
| 1 | User Authentication | Login, logout, password reset | Page 3 | Clear |
| 2 | Dashboard | Summary view for logged-in users | Implied | Inferred |
| 3 | Reports | Export data — format unspecified | Page 7 | Ambiguous |

Confidence: `Clear` = fully described · `Inferred` = implied, not named · `Ambiguous` = mentioned but scope unclear

End with: `X modules found. Y clear, Z ambiguous, N inferred.`

---

## Phase 3 — Clarifying Questions

Ask only what the proposal does not answer. See `references/question-bank.md` for the pool.

**If zero ambiguous/inferred modules and all roles are defined:** state no questions are needed and skip to Phase 4.

Rules: no generic questions · one sentence each · group by category · use Q-IDs · **aim for 5–10 questions max, never more than 15** — prioritize ambiguous modules and missing role definitions first

**If answers reveal new gaps:** run a follow-up Phase 3b with only the new questions before proceeding.

```
## Clarifying Questions

**Modules & Scope**
**User Roles**
**Business Rules**
**Data & Integrations**
**Technical**
**Timeline**
**Ambiguous or Inferred Modules**
Q-ID: [one-line question per category as needed]
```

Wait for answers before Phase 4.

---

## Phase 4 — Generate Intake Document

After Q&A is answered (or BA says "skip — proceed"):

File: `{project-name}-intake.md` · Use `create_file` · Follow `references/output-format.md`

**Artifact version frontmatter:** Write this YAML block at the very top of the file before any other content.

Check if a previous version exists at the output path:
- No previous version: `artifact_version: 1.0.0`
- Previous version exists: read the current `artifact_version`, then bump:
  - Any module added or removed → bump minor (e.g. `1.0.0` → `1.1.0`)
  - Any other field edit → bump patch (e.g. `1.0.0` → `1.0.1`)

```yaml
---
artifact_version: {version}
generated_by: sync-ba-project-intake@1.1.0
generated_at: {YYYY-MM-DD}
---
```

Then `present_files` if available, otherwise state the file path. Then say:

```
Intake done. Next: database-designer — pass the intake doc.
```

---

## Reference Files

- `references/extraction-rules.md` — How to extract modules from proposals
- `references/question-bank.md` — Question pool for Phase 3
- `references/output-format.md` — Intake doc structure

