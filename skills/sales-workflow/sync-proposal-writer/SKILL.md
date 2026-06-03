---
name: sync-proposal-writer
version: 1.5.0
description: >
  Writes a client-facing project proposal for the Sales workflow at Syntactics Inc. from a grilled
  requirements document. Trigger when a Sales team member says "write the proposal", "generate the
  proposal", "create the project proposal", or after proposal-grill completes. Also handles
  proposal revisions when triggered by sync-proposal-revision. Produces a professional,
  client-ready proposal .md file with automatic version numbering. Always run after proposal-grill
  and before quotation.
---

# Proposal Writer

Read the grilled requirements document. Write a professional, client-facing project proposal. Do not estimate hours - that belongs in the quotation. Focus on clarity, completeness, and scope the client understands.

Detect existing proposals and write the next version automatically.

Workflow: **requirement-analyzer -> proposal-grill -> proposal-writer -> quotation**
Revision workflow: **proposal-revision -> proposal-writer -> quotation**

---

## Before You Start

1. Determine the requirements source and proposal version:
   - Check `docs/sales/` for existing `{project-name}-proposal.md` and any `{project-name}-proposal-v*.md` files.
   - If no proposal exists yet: requirements source is `{project-name}-requirements.md`, output will be `{project-name}-proposal.md`, version label is `1.0`.
   - If a proposal already exists: find the highest existing version (v2, v3, etc.), use the matching requirements file (`{project-name}-requirements-v{N}.md`) as the source, and write `{project-name}-proposal-v{N+1}.md` with version label `{N+1}.0`.
2. Read the requirements document - scope depends on run type:
   - **First proposal (no prior proposal exists):** Read the full requirements document.
   - **Revision (prior proposal exists):** Read only the Revision History section and the modules listed in the delta (`Added` and `Updated` entries only). Copy unchanged module sections verbatim from the prior proposal file.
3. Do not write the proposal until all `Ambiguous` and `Inferred` modules are resolved. If any remain, stop - flag them to Sales and wait for resolution before proceeding.

---

## Writing Rules

- **Client-facing language.** No technical jargon unless the client is explicitly technical. Use business terms throughout.
- **Confident scope.** State what is included. State what is excluded. No hedging.
- **Module-by-module.** Each module gets its own section (H3) with a 1-3 sentence description and a User Roles line. Within each module, every distinct screen, flow, or feature gets its own sub-section (H4) with a 1-2 sentence description. Under each sub-feature, list UI elements (fields, buttons, links) as plain-noun bullets. If a sub-feature contains multiple named forms or screens, bold the form name before its element list. Keep language plain — no technical jargon unless the client is explicitly technical.
- **No estimates in the proposal.** Hour estimates belong in the quotation - keep them out of this document entirely.
- **No implementation details.** The proposal covers what will be built, not how. Architecture, tech stack, and framework choices do not belong here unless the client specified them.
- **Revision context.** When writing a revision, include a brief "Revision Summary" section immediately after the cover noting what changed from the prior version, sourced from the delta in the requirements file.
- **Surface hard-to-reverse decisions in Assumptions.** Any scope boundary that was a genuine trade-off during grilling - and that would surprise a reader who didn't attend that conversation - must appear in the Assumptions section with a one-line rationale. Do not bury these in module descriptions.

---

## Workflow

### Step 1 - Check for Unresolved Items

Before writing, scan for:
- Any module still marked `Ambiguous` - stop and flag to Sales
- Any Open Item in Section 10 of the requirements doc - stop and ask if it blocks the proposal

If all items are resolved, update the requirements doc **Status:** from `Grilled` to `Approved`, then proceed to Step 2.

### Step 2 - Draft the Proposal

Follow `references/template-structure.md` exactly. Use the resolved version label and file path from "Before You Start".

Structure:
1. Cover / Introduction
2. Revision Summary (only for v2 and above - summarize delta from prior version)
3. Project Overview
4. Objectives
5. Scope of Work - one section per module
6. Out of Scope
7. Assumptions
8. Deliverables
9. Next Steps

### Step 3 - Self-Review Before Delivering

- [ ] Every module from the requirements doc is represented in Scope of Work
- [ ] Each module contains H4 sub-feature sections for every distinct screen or flow
- [ ] Each sub-feature lists its UI elements as bullets
- [ ] Recommended Deployment Stack section is present and derives from the grilled constraints (or states the assumption used if no constraints were given)
- [ ] Deployment stack rationale is in business terms - no framework names, no code-level details
- [ ] Out of Scope section explicitly names deferred or excluded items
- [ ] No hour estimates appear anywhere in the document
- [ ] No implementation technology names unless client-specified
- [ ] Language is professional and client-appropriate throughout
- [ ] Assumptions section covers all hard-to-reverse scope decisions made during grilling
- [ ] Version label in the cover matches the file version (e.g. file is `proposal-v2.md` -> cover says `Version: 2.0`)
- [ ] Revision Summary present and accurate (for v2 and above only)

### Step 4 - Deliver

Write file using the versioned path resolved in "Before You Start":
- First proposal: `docs/sales/{project-name}-proposal.md`
- Revisions: `docs/sales/{project-name}-proposal-v{N}.md`

State the file path, then say:

```
Proposal v{N} ready for client review.

Next: quotation - pass {project-name}-proposal[-v{N}].md to generate the itemized quotation with hour estimates.
```

---

## Reference Files

- `references/template-structure.md` - Full proposal template with section-by-section guidance
