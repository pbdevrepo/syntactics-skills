# Output Format — Quotation

File: `docs/sales/{project-name}-quotation.md`

---

```markdown
# Project Quotation — {Project Name}

**Prepared for:** {Client Name}
**Prepared by:** Syntactics Inc.
**Date:** {YYYY-MM-DD}
**Version:** 1.0
**Status:** Draft — Pending Sales Review

> Hour ranges are estimates. Final figures are subject to Sales review before client delivery.

---

## Summary

| Role | Total Hours (Low) | Total Hours (High) |
|------|-------------------|--------------------|
| Design | X hrs | Y hrs |
| Frontend | X hrs | Y hrs |
| Backend | X hrs | Y hrs |
| **Grand Total** | **X hrs** | **Y hrs** |

---

## Module Breakdown

### 1. {Module Name}

| # | Sub-Item | Role | Hours (Low) | Hours (High) | Notes |
|---|----------|------|-------------|--------------|-------|
| 1.1 | {e.g., Login / Logout} | Frontend, Backend | 4 | 8 | |
| 1.2 | {e.g., Password Reset} | Frontend, Backend | 8 | 14 | |
| 1.3 | {e.g., RBAC setup} | Backend | 8 | 16 | [Review needed — permissions scope unclear] |

**Module Total: X–Y hrs**

---

### 2. {Module Name}

| # | Sub-Item | Role | Hours (Low) | Hours (High) | Notes |
|---|----------|------|-------------|--------------|-------|
| 2.1 | ... | ... | ... | ... | |

**Module Total: X–Y hrs**

---

{repeat for each module}

---

## Items Flagged for Review

| Module | Sub-Item | Reason |
|--------|----------|--------|
| {Module} | {Sub-Item} | Complexity unknown — needs scoping call |

---

## Notes for Sales

- Adjust all hour ranges based on team velocity and known project complexity before sending.
- Items marked `[Review needed]` require a follow-up scoping call or clarification with the client.
- Hours do not include project management, QA, or deployment unless listed explicitly.
- This quotation covers the scope defined in `{project-name}-proposal.md` only.
```
