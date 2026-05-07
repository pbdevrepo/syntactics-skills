# Output Format — Requirements Document

File: `output/{project-name}/sales/{project-name}-requirements.md`

---

```markdown
# {Project Name} — Client Requirements

**Project:** {project-name}
**Date:** {YYYY-MM-DD}
**Prepared by:** Sales Team — Syntactics Inc.
**Status:** Draft

---

## 1. Project Overview

{2–4 sentence summary of what the client wants to build, who it's for, and why.}

---

## 2. Client Information

| Field | Value |
|-------|-------|
| Client Name | {name} |
| Industry | {industry} |
| Target Users | {who will use the system} |
| Delivery Type | Web / Mobile / Both |

---

## 3. User Roles

| Role | Description | Access Level |
|------|-------------|--------------|
| Admin | Full system access | Full |
| {Role} | {description} | {Read / Write / Full} |

---

## 4. Module List

| # | Module | Description | Priority | Confidence |
|---|--------|-------------|----------|------------|
| 1 | {Module Name} | {one-line description} | Must-have / Nice-to-have | Clear / Inferred / Ambiguous |

---

## 5. Module Details

### {Module Name}

**Description:** {what this module does}
**User Roles Involved:** {which roles interact with this module}
**Key Features:**
- {feature 1}
- {feature 2}
**Business Rules:**
- {rule 1}
**Open Questions:** {any remaining ambiguities, or "None"}

---

## 6. Integrations & Third-Party Dependencies

| Integration | Purpose | Provider (if known) |
|-------------|---------|---------------------|
| {e.g., Payment Gateway} | {purpose} | {e.g., Stripe / TBD} |

---

## 7. Technical Constraints

- **Tech Stack:** {preferred stack or "Open"}
- **Hosting:** {cloud / on-premise / TBD}
- **Performance:** {e.g., "Must support 500 concurrent users" or "No specific requirement"}
- **Compliance:** {e.g., "GDPR" or "None stated"}
- **Browsers / Devices:** {e.g., "Modern browsers, mobile-responsive" or "TBD"}

---

## 8. Timeline & Budget

- **Target Launch:** {date or "TBD"}
- **Delivery Approach:** {Phased / All at once / TBD}
- **Budget Range:** {range or "Not disclosed"}

---

## 9. Out of Scope (This Phase)

- {item explicitly excluded or deferred to a future phase}

---

## 10. Open Items

| ID | Item | Status |
|----|------|--------|
| OI-1 | {unresolved question or dependency} | Pending |
```
