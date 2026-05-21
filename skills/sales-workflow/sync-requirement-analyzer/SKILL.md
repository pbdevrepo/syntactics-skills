---
name: sync-requirement-analyzer
version: 1.0.0
description: >
  Entry point for the Sales workflow at Syntactics Inc. when a client has provided a brief, notes,
  or RFP. Analyzes client requirements from a PDF upload or free-form text and produces a structured
  requirements document. Trigger when a Sales team member says "analyze client requirements",
  "we have a new client", "I have client notes", "start the sales workflow", or shares any client
  brief, email, or RFP. If the client has no brief or direction at all, run sync-client-discovery
  first. Always run before proposal-grill, proposal-writer, and quotation.
---

# Requirement Analyzer

Reads client requirements from a PDF or free-form text. Produces a structured requirements `.md` file.
Does not write a proposal. Does not estimate. Produces clarity only.

Workflow: **requirement-analyzer → proposal-grill → proposal-writer → quotation**

---

## Before You Start

Ask: **"What is the project name?"** — kebab-case, lowercase (e.g., `client-portal`). This name is used for all output file paths in this workflow.

Accept input as: PDF upload, pasted text, email thread, meeting notes, or RFP document.

---

## Phase 1 — Read

Read everything provided. No output yet. While reading, note internally:

- Every module/feature — explicit or implied
- Every user role — explicit or implied
- Every integration or third-party dependency — explicit or implied
- Every constraint — tech stack, timeline, budget, compliance
- Every gap, ambiguity, or contradiction

See `references/extraction-rules.md` for how to extract modules from unstructured client input.

---

## Phase 2 — Module Inventory

Post inline in chat. Not a file yet.

| # | Module | Description (1 line) | Source | Confidence |
|---|--------|----------------------|--------|------------|
| 1 | User Authentication | Login, logout, password reset | Page 2 | Clear |
| 2 | Dashboard | Summary view for logged-in users | Implied | Inferred |
| 3 | Reports | Export data — format unspecified | Meeting notes | Ambiguous |

Confidence: `Clear` = fully described · `Inferred` = implied, not named · `Ambiguous` = mentioned but scope unclear

End with: `X modules found. Y clear, Z ambiguous, N inferred.`

---

## Phase 3 — Clarifying Questions

Ask only what the input does not answer. See `references/question-bank.md` for the pool.

**If zero ambiguous/inferred modules and all roles are defined:** state no questions are needed and skip to Phase 4.

Rules: no generic questions · one sentence each · group by category · use Q-IDs · **aim for 5–10 questions max, never more than 15** — prioritize ambiguous modules and missing role definitions first

```
## Clarifying Questions

**Modules & Scope**
**User Roles**
**Integrations & Third Parties**
**Business Rules**
**Technical Constraints**
**Timeline & Budget**
**Ambiguous or Inferred Modules**
Q-ID: [one-line question per category as needed]
```

Wait for answers before Phase 4.

---

## Phase 4 — Generate Requirements Document

After Q&A is answered (or Sales says "skip — proceed"):

File: `docs/sales/{project-name}-requirements.md`

Follow `references/output-format.md` for the exact structure.

Then state the file path and say:

```
Requirements captured. Next: proposal-grill — pass {project-name}-requirements.md to stress-test scope before writing the proposal.
```

---

## Reference Files

- `references/extraction-rules.md` — How to extract modules from unstructured client input
- `references/question-bank.md` — Question pool for Phase 3
- `references/output-format.md` — Requirements doc structure

