---
name: sync-proposal-grill
version: 1.2.0
description: >
  Stress-tests an intake document at Syntactics Inc. before a proposal is written. Trigger when a
  BA or Sales team member says "grill the requirements", "stress-test the scope", "review before
  proposal", or after project-intake completes. Asks targeted questions one at a time focused on
  missed modules, ambiguous scope, unstated integrations, deployment constraints, and edge cases.
  Always run after project-intake and before proposal-writer.
---

# Proposal Grill

Read the intake document from `project-intake`. Interrogate it relentlessly until every branch of scope is resolved. Focus on what was missed - not on what the client said.

Workflow: **project-intake -> proposal-grill -> proposal-writer -> quotation**

---

## Before You Start

1. Confirm the intake doc file path: `docs/ba/{project-name}-intake.md`
2. Read the full document before asking anything.
3. Build an internal list of every gap, assumption, and risk - then work through them one question at a time.

---

## Grilling Rules

- **One question at a time.** Wait for the answer before asking the next.
- **Never ask generic questions.** Every question must reference a specific module, role, or item in the intake doc.
- **Lead with your recommendation.** Format: question first, then "My recommendation: [answer]."
- **Explore every branch.** For each answer, determine if it opens a new gap - if so, follow it before moving on.
- **Sharpen fuzzy language.** When the client or team uses a vague or overloaded term, propose a precise canonical name. Example: "You said 'reports' - do you mean a live dashboard the user filters, or a generated PDF export? Those are different modules." Resolve the term before moving on.
- **Stress-test with concrete scenarios.** When scoping a module or role, invent a specific scenario that probes the boundary. Example: "What happens if a Supervisor approves a request that a Manager already rejected?" Force a precise answer rather than accepting a general description.
- **Stop when satisfied.** When every module has clear scope, every role is defined, and every integration is named - declare the intake grilled and proceed.

---

## During the Grill

### Update the intake doc inline

When a term or scope item is resolved, update `docs/ba/{project-name}-intake.md` right there. Don't batch these up - capture them as they happen:

- Resolved ambiguous module? Change `Ambiguous` to `Clear` and update its description immediately.
- New module confirmed in scope? Add it to Section 3 (Module Inventory) and Section 5 (Functional Requirements) now.
- Integration named? Add it to Section 7 now.

This keeps the document current and lets later questions reference already-resolved items without re-litigating them.

### Flag hard-to-reverse scope decisions

When a resolved item meets all three of these, note it explicitly for the proposal writer:

1. **Hard to reverse** - changing this later carries real cost (architecture, contract, timeline)
2. **Surprising without context** - a future reader would wonder "why was this included/excluded?"
3. **A real trade-off** - there were genuine alternatives and a specific reason drove the choice

If any of the three is missing, skip the flag. Not every clarification needs to be called out.

---

## Grilling Checklist

Work through each category. Skip categories with no gaps.

### Missed Modules
See `references/question-bank.md` - Missed Modules section.
- Are all implied modules explicitly listed? (auth, RBAC, notifications, audit log, file upload)
- Does each user role have at least one dedicated module or view?
- Are there workflow steps (approvals, escalations) that imply an additional module?

### Ambiguous Scope
See `references/question-bank.md` - Ambiguous Scope section.
- For each `Ambiguous` confidence module: what exactly is in scope?
- For each `Inferred` module: is it confirmed in or confirmed out?
- Are CRUD operations (create, read, update, delete) specified per module?

### Unstated Integrations
See `references/question-bank.md` - Integrations section.
- Does any module require data from outside the system?
- Are there payment, messaging, or storage needs not yet named?
- Does any module need to push data to an external system?

### Edge Cases and Business Rules
See `references/question-bank.md` - Business Rules section.
- What happens when [key action] fails or is rejected?
- Are there automated triggers (reminders, escalations, status changes)?
- Are there data constraints not yet captured (uniqueness, required fields, expiry)?
- Invent at least one concrete failure scenario per core module and ask the client to resolve it.

### Role Completeness
- Does every module have an assigned owner role?
- Are permissions (view, edit, approve, delete) defined per role per module?
- Is there a Super Admin or system owner role?

### Deployment Constraints
See `references/question-bank.md` - Deployment Constraints section.
- Does the client have an existing hosting contract or cloud provider preference?
- Are there data residency, compliance, or regulatory requirements (HIPAA, GDPR, local data laws)?
- What is the expected user load - roughly how many concurrent users at peak?
- Does the client have an in-house technical team to manage infrastructure, or will Syntactics handle it?
- Are there budget signals that indicate a preference for cost-optimized vs. managed/premium hosting?

When answers are captured, add a `## Deployment Constraints` block to the intake doc (append after Section 11). Record:
- Client hosting preference (if any)
- Compliance requirements (if any)
- Expected scale (user count, concurrent load, data volume)
- Infrastructure ownership (client-managed vs. Syntactics-managed)
- Budget tier signal (startup/SMB/mid-market/enterprise)

If the client has no stated preference on any of these, record "No constraints stated - standard recommendation applies."

---

## After Grilling

When all gaps are resolved:

### Step 1 - Verify the intake document

Confirm all inline updates were applied:

- All new modules added to Section 3 (Module Inventory) and Section 5 (Functional Requirements)
- All `Ambiguous` -> `Clear` changes made; descriptions updated
- All `Inferred` modules confirmed in or removed
- All integrations added to Section 7
- All resolved Open Questions closed in Section 10 (Status: Resolved)
- Deployment Constraints block appended
- Document **Status:** changed from `Draft` to `Grilled`

### Step 2 - Post Grilling Summary inline in chat

```
## Grilling Summary - {project-name}

**Modules added:** {list any new modules discovered, or "None"}
**Scope clarified:** {list ambiguous items now resolved}
**Integrations confirmed:** {list integrations now named}
**Hard-to-reverse decisions flagged:** {list any flagged scope decisions, or "None"}
**Deployment constraints captured:** {list hosting preference, compliance requirements, scale signals, or "No constraints stated - standard recommendation applies"}
**Open items remaining:** {list anything still unresolved, or "None"}

Intake doc updated and marked Grilled.

Next: proposal-writer - pass docs/ba/{project-name}-intake.md to write the client proposal.
```

---

## Reference Files

- `references/question-bank.md` - Targeted question pool by category
