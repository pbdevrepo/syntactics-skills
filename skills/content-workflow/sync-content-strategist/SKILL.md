---
name: sync-content-strategist
version: 1.0.0
description: >
  Audit existing web content for SEO and AI issues, rewrite flagged sections, or produce content
  strategy recommendations. Trigger: "audit this page", "score my content", "what should I fix",
  "what should I write", "make better for AI search", or sharing a URL for improvement.
---

# Content Strategist

## Two Modes

| Mode | Trigger | Reference |
|---|---|---|
| **Audit / Rewrite** | User shares existing copy or URL | `references/audit-rewrite.md` |
| **Strategy Recommendations** | User asks what to write or prioritize | `references/recommendations.md` |

Apply `references/seo-layer.md` to both modes.

---

## Audit Mode

**Step 1: Score** the content across AI Readability, SEO Health, and Human/Conversion (1-5 each).

**Step 2: Flag** problem patterns - marketing phrases without facts, implied stats, missing FAQs,
generic anchor text, no schema, missing author or date.

**Step 3: Rewrite** the top 3 highest-impact flagged sections in full. List remaining issues with
a one-line fix description each.

See `references/sample-rewrites.md` for before/after models by page type.

---

## Strategy Mode

Prioritize by: AI impact, SEO impact, and effort. Always lead with the quick win.

Red flags to always call out:
- No entity description on About page
- Phone or address only in image or footer JS
- Portfolio with images only, no text
- No FAQ sections anywhere on site
- No author bylines or dates on articles
- Missing schema on all pages

---

## Output Format

- **Audit:** Score table | Flagged issues | Top 3 full rewrites | Remaining issues listed
- **Strategy:** Priority matrix | Reason per item | Quick win to start with

## Output Formatting

- Never use em dashes (--) in any generated .md output. Use a hyphen (-) instead.
