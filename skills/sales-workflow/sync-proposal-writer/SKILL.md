---
name: sync-proposal-writer
version: 1.0.0
description: >
  Writes a client-facing project proposal for the Sales workflow at Syntactics Inc. from a grilled
  requirements document. Trigger when a Sales team member says "write the proposal", "generate the
  proposal", "create the project proposal", or after proposal-grill completes. Produces a
  professional, client-ready proposal .md file. Always run after proposal-grill and before quotation.
outputs: projects/{project-name}/sales/{project-name}-proposal.md
triggers: projects/{project-name}/sales/{project-name}-requirements.md
approval: true
next: sync-ba-project-intake
---

# Proposal Writer

Reads the grilled requirements document and writes a professional, client-facing project proposal.
Does not estimate hours — that is handled by quotation. Focuses on clarity, completeness, and
presenting the project scope in terms the client understands.

Workflow: **requirement-analyzer → proposal-grill → proposal-writer → quotation**

---

## Before You Start

1. Confirm the requirements doc: `projects/{project-name}/sales/{project-name}-requirements.md`
2. Read the full requirements document including all resolved grilling items.
3. Do not write the proposal until all `Ambiguous` and `Inferred` modules are resolved — if any remain, flag them and ask Sales to resolve before proceeding.

---

## Writing Rules

- **Client-facing language.** No technical jargon unless the client is technical. Use business terms.
- **Confident scope.** State what is included clearly. State what is excluded clearly.
- **Module-by-module.** Each module gets its own section with a plain-language description.
- **No estimates in the proposal.** Hour estimates belong in the quotation — keep them separate.
- **No implementation details.** The proposal is what will be built, not how it will be built.

---

## Workflow

### Step 1 — Check for Unresolved Items

Before writing, scan for:
- Any module still marked `Ambiguous` → stop and flag to Sales
- Any Open Item in Section 10 of the requirements doc → stop and ask if it blocks the proposal

If all items are resolved, update the requirements doc **Status:** from `Grilled` to `Approved`, then proceed to Step 2.

### Step 2 — Draft the Proposal

Follow `references/template-structure.md` exactly.

Structure:
1. Cover / Introduction
2. Project Overview
3. Objectives
4. Scope of Work — one section per module
5. Out of Scope
6. Assumptions
7. Deliverables
8. Next Steps

### Step 3 — Self-Review Before Delivering

- [ ] Every module from the requirements doc is represented in Scope of Work
- [ ] Out of Scope section explicitly names deferred or excluded items
- [ ] No hour estimates appear anywhere in the document
- [ ] No implementation technology names unless client-specified
- [ ] Language is professional and client-appropriate
- [ ] Assumptions section covers all inferred decisions made during grilling

### Step 4 — Deliver

Write file: `projects/{project-name}/sales/{project-name}-proposal.md`

State the file path, then say:

```
Proposal ready for client review.

Next: quotation — pass {project-name}-proposal.md to generate the itemized quotation with hour estimates.
```

---

## Reference Files

- `references/template-structure.md` — Full proposal template with section-by-section guidance


---

## Output Formatting

- Never use em dashes (--) in any generated .md output. Use a hyphen (-) instead.
