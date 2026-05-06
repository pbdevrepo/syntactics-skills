---
name: ba-project-intake
version: 1.0.1
description: >
  Entry point for the BA project lifecycle at Syntactics Inc. Trigger when a BA uploads a proposal
  PDF, says "start the intake" / "I have a proposal" / "we got a new project", or shares any client
  brief to begin project analysis. Always run this skill first — before database-administrator,
  sprint-planner, and final-design.
---

# BA Project Intake

Reads a proposal PDF plus any supporting input. Produces an intake `.md` file.
Does not design, spec, or estimate. Produces clarity only.

Workflow: **ba-project-intake → database-administrator → sprint-planner → final-design**

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

Then `present_files` if available, otherwise state the file path. Then say:

```
Intake done. Next: database-administrator — pass the intake doc.
```

---

## Reference Files

- `references/extraction-rules.md` — How to extract modules from proposals
- `references/question-bank.md` — Question pool for Phase 3
- `references/output-format.md` — Intake doc structure