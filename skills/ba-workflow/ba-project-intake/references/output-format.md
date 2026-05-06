# Output Format — BA Project Intake Document

File name: `{project-name}-intake.md`

Plain markdown. No HTML. No special formatting beyond standard markdown.

---

## Document Structure

```
# [Project Name] — BA Intake Document

**Prepared by:** [BA Name if known, otherwise "Syntactics BA Team"]
**Date:** [today's date]
**Source:** [list of input documents used]
**Status:** Draft — Pending Client Clarification / Ready for DB Design

---

## 1. Project Overview

[2–4 sentences. What is this system? Who uses it? What problem does it solve?
Plain language. No jargon. No copy-paste from the proposal.]

---

## 2. Module Inventory

| # | Module | Description | Source | Confidence | Notes |
|---|--------|-------------|--------|------------|-------|
| 1 | [Name] | [1-line description] | Page X / Implied | Clear / Inferred / Ambiguous | [any note] |

**Total:** X modules (Y clear, Z ambiguous, N inferred)

---

## 3. User Roles

| Role | Description | Key Capabilities |
|---|---|---|
| [Role] | [who this is] | [what they can do — top 3–5 things] |

---

## 4. Functional Requirements (by Module)

For each module from Section 2:

### [Module Name]

**Type:** CRUD / Read-only / Workflow / Report / Integration / Auth
**User Roles with Access:** [list roles]

**The system shall:**
- REQ-[module]-001: [specific, testable requirement]
- REQ-[module]-002: [specific, testable requirement]
- REQ-[module]-003: [specific, testable requirement]

**Out of scope for this module:** [anything explicitly excluded, or "None identified"]

---

## 5. Non-Functional Requirements

| # | Requirement | Detail |
|---|---|---|
| NFR-001 | Performance | [e.g., page load < 3s under normal load] |
| NFR-002 | Security | [e.g., all passwords hashed; HTTPS required] |
| NFR-003 | Device Support | [e.g., desktop and mobile responsive] |
| NFR-004 | Uptime | [e.g., 99.9% uptime SLA] |

Add or remove rows as needed. If not specified in proposal, write: "Not specified — to be confirmed with client."

---

## 6. Integrations

| Integration | Type | Direction | Notes |
|---|---|---|---|
| [System name] | API / File import / Webhook | Inbound / Outbound / Both | [detail] |

If none: `No integrations identified at this stage.`

---

## 7. Out of Scope

List everything explicitly excluded, or things implied but clearly not intended for v1.

- [Item 1]
- [Item 2]

If nothing identified: `No explicit out-of-scope items stated in proposal.`

---

## 8. Assumptions

Things treated as true that were never explicitly confirmed.

| # | Assumption | Impact if Wrong |
|---|---|---|
| A-001 | [assumption] | [what breaks if this is false] |

---

## 9. Open Questions

Items still unresolved after the Q&A session.

| Q-ID | Question | Asked To | Status |
|---|---|---|---|
| Q-001 | [question] | Client / BA / PM | Open / Resolved |

---

## 10. Handoff Notes

**→ Database Administrator:**
- Tables likely needed: [quick list based on modules]
- Key relationships to design: [e.g., users ↔ orders ↔ products]
- Confirmed dialect: [MySQL / PostgreSQL — based on proposal or default to MySQL for Laravel]

**→ Sprint Planner:**
Requires: Approved DB Schema (from database-administrator)

**→ Final Design:**
Requires: This intake doc + approved DB Schema
```

---

## Tone Rules

- Active voice: "The system shall allow…" not "Users will be permitted to…"
- Specific: "Admins can create, edit, and deactivate users" not "user management"
- No filler: no "robust", "seamless", "scalable", "world-class"
- Req IDs follow the format: `REQ-[MODULE ABBREV]-[3-digit number]` e.g. `REQ-AUTH-001`
- If inferring, be transparent: "Based on the proposal, the system is expected to…"