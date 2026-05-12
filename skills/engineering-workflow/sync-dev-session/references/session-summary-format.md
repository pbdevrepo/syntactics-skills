# Session Summary Format

File: `docs/sessions/{be|fe|fullstack}/{topic}-{YYYY-MM-DD}.md`

---

```markdown
# Session: {Topic} - {BE | FE | Full-Stack} - {YYYY-MM-DD}

## Context

- **FDD Reference:** {file path}
- **Module:** {module name}
- **Session Type:** Backend | Frontend | Full-Stack
- **Developer:** {name if provided}

---

## Decisions Made

- {Confirmed implementation decision — specific and actionable}
- {e.g. "JWT stored in httpOnly cookie, not localStorage"}
- {e.g. "Role check enforced at service layer, not controller"}

---

## Constraints Identified

- {Rule, limit, or FDD requirement surfaced during grilling}
- {e.g. "Email must be unique across all user roles per FDD Section 3.2"}

---

## Open Questions

| # | Question | Owner | Due |
|---|----------|-------|-----|
| 1 | {unresolved item} | {dev / BA / PM} | {date or "TBD"} |

---

## Next Steps

- {What the dev should do immediately after this session}
- {e.g. "Proceed to sync-tdd-be: user-management module"}

---

## Risks

- {Implementation concern flagged during grilling}
- {e.g. "API contract for notifications not finalized - frontend may need stub"}

---

## References

- {FDD section, ADR, related session file, or external doc}
- {e.g. "docs/sessions/be/auth-2025-01-15.md - prior auth session decisions apply"}
```
