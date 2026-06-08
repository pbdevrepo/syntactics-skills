---
name: sync-project-intake
version: 1.0.0
description: >
  Entry point for both the proposal and BA lifecycle at Syntactics Inc. Accepts any client input
  (brief, RFP, meeting notes, or approved proposal) and produces a single structured intake document
  used from proposal writing through database design. Trigger when a BA or Sales team member says
  "analyze client requirements", "start the intake", "we have a new project", "I have client notes",
  "we got a proposal", or shares any client brief, email, RFP, or proposal PDF. Works in two modes:
  Pre-Proposal (from client brief - feeds proposal-grill and proposal-writer) and Post-Approval
  (from approved proposal - feeds database-designer). Always run before proposal-grill,
  database-designer, sprint-planner, and final-design. If the client has no brief or direction at
  all, run sync-client-discovery first.
---

# Project Intake

Read the client input. Produce the intake document. Do not design, spec, or estimate. Produce clarity only.

Proposal workflow: **project-intake -> proposal-grill -> proposal-writer -> quotation**
BA design workflow: **project-intake -> database-designer -> sprint-planner -> final-design**

---

## Before You Start

**Step 1 - Project name:** Ask `"What is the project name?"` - kebab-case, lowercase (e.g., `client-portal`). All output file paths use this name.

**Step 2 - Mode detection:** Ask:
> "Are you working from a client brief / RFP / meeting notes (pre-proposal), or from a client-approved proposal (post-approval)?"

- **Pre-Proposal:** Client brief, RFP, email, meeting notes - intake status: `Draft` - next skill: `proposal-grill`
- **Post-Approval:** Client-approved proposal - intake status: `Approved` - next skill: `database-designer`

Accept input as: PDF upload, pasted text, email thread, meeting notes, or RFP document.

---

## Phase 1 - Read

Read everything provided. No output yet. While reading, note internally:

- Every module/feature - explicit or implied
- Every user role - explicit or implied
- Every integration or third-party dependency - explicit or implied
- Every constraint - tech stack, timeline, budget, compliance
- Every gap, ambiguity, or contradiction
- Every term used in two different ways, or used loosely where precision will matter

When the same concept appears under different names (e.g., "users" in one section and "members" in another), flag the inconsistency internally. Surface it in Phase 3 - do not silently pick one.

If more than 15 modules are found, show the first 15 in the Phase 2 table and summarize the remainder in a note below (e.g., "8 additional modules identified - listed in intake doc").

See `references/extraction-rules.md` for how to extract modules from unstructured client input.

---

## Phase 2 - Module Inventory

Post inline in chat. Not a file yet.

| # | Module | Description (1 line) | Source | Confidence |
|---|--------|----------------------|--------|------------|
| 1 | User Authentication | Login, logout, password reset | Page 2 | Clear |
| 2 | Dashboard | Summary view for logged-in users | Implied | Inferred |
| 3 | Reports | Export data - format unspecified | Meeting notes | Ambiguous |

Confidence: `Clear` = fully described - `Inferred` = implied, not named - `Ambiguous` = mentioned but scope unclear

End with: `X modules found. Y clear, Z ambiguous, N inferred.`

---

## Phase 3 - Clarifying Questions

Ask only what the input does not answer. See `references/question-bank.md` for the pool.

**If zero ambiguous/inferred modules and all roles are defined:** state no questions are needed and skip to Phase 4.

Rules: no generic questions - one sentence each - group by category - use Q-IDs - **aim for 5-10 questions max, never more than 15** - prioritize ambiguous modules and missing role definitions first.

**Sharpen fuzzy terms before closing questions.** If the input uses a vague or overloaded term, include a sharpening question that proposes a precise interpretation. Do not leave it for grilling to catch.

Examples:
- Input says "admin area" - ask: "Does 'admin area' mean internal Syntactics staff only, or does the client's own admin team also log in? That changes the role model."
- Input says "notifications" - ask: "Are notifications email only, in-app only, or both? Each adds scope."
- Input says "reports" - ask: "Are reports a live filtered view or a generated export (PDF/CSV)? Those are different modules."

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

## Phase 4 - Generate Intake Document

After Q&A is answered (or user says "skip - proceed"):

File: `docs/ba/{project-name}-intake.md`

Follow `references/output-format.md` for the exact structure. Set `Status` to `Draft` (Pre-Proposal mode) or `Approved` (Post-Approval mode).

**Artifact version frontmatter:** Write this YAML block at the very top of the file before any other content.

Check if a previous version exists at the output path:
- No previous version: `artifact_version: 1.0.0`
- Previous version exists: read the current `artifact_version`, then bump:
  - Any module added or removed - bump minor (e.g. `1.0.0` -> `1.1.0`)
  - Any other field edit - bump patch (e.g. `1.0.0` -> `1.0.1`)

```yaml
---
artifact_version: {version}
generated_by: sync-project-intake@1.0.0
generated_at: {YYYY-MM-DD}
---
```

State the file path, then say:

**Pre-Proposal mode:**
```
Intake document ready. Next: proposal-grill - pass docs/ba/{project-name}-intake.md to stress-test scope before writing the proposal.
```

**Post-Approval mode:**
```
Intake document ready. Next: database-designer - pass docs/ba/{project-name}-intake.md to begin schema design.
```

---

## Reference Files

- `references/extraction-rules.md` - How to extract modules from unstructured client input
- `references/question-bank.md` - Question pool for Phase 3
- `references/output-format.md` - Intake doc structure
