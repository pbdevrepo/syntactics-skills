---
name: ba-project-intake
version: 1.0.0
description: >
  Entry point for the BA project lifecycle at Syntactics Inc. Trigger when a BA says "start the
  intake", "I have a proposal", "run the intake", "gather requirements", "read this proposal", or
  uploads a PDF to begin project analysis. Also trigger for "new project from Sales", "client sent
  a proposal", or "what do we need to build this". Always run this skill first — before
  database-administrator, sprint-planner, and final-design.
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

Rules: no generic questions · one sentence each · group by category · use Q-IDs

```
## Clarifying Questions

**Modules & Scope**
Q-001: [question]

**User Roles**
Q-002: [question]

**Technical**
Q-003: [question]

**Business Rules**
Q-004: [question]
```

Wait for answers before Phase 4.

---

## Phase 4 — Generate Intake Document

After Q&A is answered (or BA says "skip — proceed"):

File: `{project-name}-intake.md` · Use `create_file` · Follow `references/output-format.md`

Then `present_files`. Then say:

```
Intake done. Next: database-administrator — pass the intake doc.
```

---

## What This Skill Does NOT Do

No wireframes · No ERD · No sprint tasks · No FDD · No estimates · No tech stack picks

---

## Handoff Chain

| Step | Skill | Needs |
|------|-------|-------|
| 1 | `database-administrator` | Intake doc |
| 2 | `sprint-planner` | DB schema doc |
| 3 | `final-design` | Intake doc + DB schema doc |

---

## Reference Files

- `references/extraction-rules.md` — How to extract modules from proposals
- `references/question-bank.md` — Question pool for Phase 3
- `references/output-format.md` — Intake doc structure