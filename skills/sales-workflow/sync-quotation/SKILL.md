---
name: sync-quotation
version: 1.0.0
description: >
  Generates an itemized project quotation for the Sales workflow at Syntactics Inc. from an approved
  proposal. Trigger when a Sales team member says "generate the quotation", "create the quote",
  "itemize the hours", "how much will this cost", or after proposal-writer completes. Produces a
  module-by-module breakdown with sub-items and placeholder hour ranges per role (Design, Frontend,
  Backend). Human finalizes the numbers before sending to the client. Always run after proposal-writer.
---

# Quotation

Reads the project proposal and produces an itemized quotation `.md` file. Lists every module,
breaks each into implementable sub-items, and assigns placeholder hour ranges per role.

Does not produce final hour commitments — Sales reviews and adjusts before sending to the client.

Workflow: **requirement-analyzer → proposal-grill → proposal-writer → quotation → [client decision]**

---

## Before You Start

1. Confirm the proposal file: `output/{project-name}/sales/{project-name}-proposal.md`
2. Read the full proposal — every module in Section 4 must appear in the quotation.
3. Read `references/hour-ranges.md` for complexity-based placeholder ranges.

---

## Workflow

### Step 1 — Extract All Modules and Sub-Items

For every module in the proposal's Scope of Work:

1. List the module name
2. Break it into discrete implementable sub-items — one sub-item = one piece of work a single person can own
3. Tag each sub-item by role: `[Design]`, `[Frontend]`, `[Backend]`, or a combination

Sub-item granularity rules:
- A sub-item should represent 4–40 hours of work — if larger, split it
- Do not combine Design + Frontend + Backend into one sub-item — separate them
- Always include setup/scaffolding tasks (project setup, DB migration, authentication base) as their own sub-items
- For CRUD modules: separate Create form, List view, Detail view, Edit, Delete into sub-items if they differ in complexity

### Step 2 — Assign Placeholder Hour Ranges

For each sub-item, assign a placeholder hour range per role using `references/hour-ranges.md`.

Rules:
- Use ranges, not single numbers (e.g., `8–16 hrs` not `12 hrs`)
- A sub-item only gets hours for the roles that touch it — don't assign Backend hours to a purely UI sub-item
- When complexity is genuinely unknown, use the `Unknown` range from `references/hour-ranges.md` and flag it

### Step 3 — Calculate Module and Grand Totals

For each module: sum the low end and high end of all sub-item ranges.
At the end: sum all module totals for a grand total range.

Format:
```
Module Total: X–Y hrs
Grand Total: X–Y hrs
```

### Step 4 — Self-Review Before Delivering

- [ ] Every module from the proposal appears in the quotation
- [ ] Every sub-item has a role tag
- [ ] Every sub-item has a placeholder hour range
- [ ] No sub-item exceeds 40 hrs on the high end without a split note
- [ ] Module totals and grand total are calculated correctly
- [ ] All `Unknown` ranges are flagged for Sales review

### Step 5 — Deliver

Write file: `output/{project-name}/sales/{project-name}-quotation.md`

Follow `references/output-format.md` for the exact structure.

State the file path, then say:

```
Quotation generated. All hour ranges are placeholders — review and adjust before sending to client.
Flag any sub-items marked [Review needed] where complexity is unknown.

Next: present proposal + quotation to client for approval.
If approved → start BA workflow with ba-project-intake, passing the proposal as the source document.
```

---

## Reference Files

- `references/hour-ranges.md` — Complexity-based placeholder hour ranges by sub-item type
- `references/output-format.md` — Quotation file structure
