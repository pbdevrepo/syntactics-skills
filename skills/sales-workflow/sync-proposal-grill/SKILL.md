---
name: sync-proposal-grill
version: 1.0.0
description: >
  Stress-tests a client requirements document for the Sales workflow at Syntactics Inc. before a
  proposal is written. Trigger when a Sales team member says "grill the requirements", "stress-test
  the scope", "review requirements before proposal", or after requirement-analyzer completes. Asks
  targeted questions one at a time focused on missed modules, ambiguous scope, unstated integrations,
  and edge cases that would surface in BA. Always run after requirement-analyzer and before
  proposal-writer.
---

# Proposal Grill

Reads the requirements document from `requirement-analyzer` and interrogates it relentlessly until
every branch of scope is resolved. Focused on what Sales missed — not on what the client said.

Workflow: **requirement-analyzer → proposal-grill → proposal-writer → quotation**

---

## Before You Start

1. Confirm the requirements doc file path: `projects/{project-name}/sales/{project-name}-requirements.md`
2. Read the full document before asking anything.
3. Build an internal list of every gap, assumption, and risk — then work through them one question at a time.

---

## Grilling Rules

- **One question at a time.** Wait for the answer before asking the next.
- **Never ask generic questions.** Every question must reference a specific module, role, or item in the requirements doc.
- **Lead with your recommendation.** Format: question first, then "My recommendation: [answer]."
- **Explore every branch.** For each answer, determine if it opens a new gap — if so, follow it before moving on.
- **Stop when satisfied.** When every module has clear scope, every role is defined, and every integration is named — declare the requirements grilled and proceed.

---

## Grilling Checklist

Work through each category. Skip categories with no gaps.

### Missed Modules
See `references/question-bank.md` — Missed Modules section.
- Are all implied modules explicitly listed? (auth, RBAC, notifications, audit log, file upload)
- Does each user role have at least one dedicated module or view?
- Are there workflow steps (approvals, escalations) that imply an additional module?

### Ambiguous Scope
See `references/question-bank.md` — Ambiguous Scope section.
- For each `Ambiguous` confidence module: what exactly is in scope?
- For each `Inferred` module: is it confirmed in or confirmed out?
- Are CRUD operations (create, read, update, delete) specified per module?

### Unstated Integrations
See `references/question-bank.md` — Integrations section.
- Does any module require data from outside the system?
- Are there payment, messaging, or storage needs not yet named?
- Does any module need to push data to an external system?

### Edge Cases & Business Rules
See `references/question-bank.md` — Business Rules section.
- What happens when [key action] fails or is rejected?
- Are there automated triggers (reminders, escalations, status changes)?
- Are there data constraints not yet captured (uniqueness, required fields, expiry)?

### Role Completeness
- Does every module have an assigned owner role?
- Are permissions (view, edit, approve, delete) defined per role per module?
- Is there a Super Admin or system owner role?

---

## After Grilling

When all gaps are resolved:

### Step 1 — Update the Requirements Document

Apply all findings directly to `projects/{project-name}/sales/{project-name}-requirements.md`:

- Add any new modules to Section 4 (Module List) and Section 5 (Module Details)
- Change `Ambiguous` → `Clear` for resolved modules; update their descriptions
- Change `Inferred` → `Clear` or remove if confirmed out of scope
- Add confirmed integrations to Section 6
- Close resolved Open Items in Section 10 (mark Status: Resolved)
- Change document **Status:** from `Draft` to `Grilled`

### Step 2 — Post Grilling Summary inline in chat

```
## Grilling Summary — {project-name}

**Modules added:** {list any new modules discovered, or "None"}
**Scope clarified:** {list ambiguous items now resolved}
**Integrations confirmed:** {list integrations now named}
**Open items remaining:** {list anything still unresolved, or "None"}

Requirements doc updated and marked Grilled.

Next: proposal-writer — pass {project-name}-requirements.md to write the client proposal.
```

---

## Reference Files

- `references/question-bank.md` — Targeted question pool by category

