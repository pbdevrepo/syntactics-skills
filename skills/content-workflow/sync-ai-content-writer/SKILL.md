---
name: sync-ai-content-writer
version: 1.0.0
description: >
  Write and optimize web content — static pages, articles, and blog posts — so they rank
  on Google AND get cited by AI agents (ChatGPT Browse, Perplexity, Claude, Google AI
  Overviews), without sacrificing brand voice or marketing effectiveness. Use this skill
  whenever the user wants to: write or rewrite website copy (homepages, service pages, about
  pages, landing pages), write blog posts or articles (how-to guides, listicles, opinion
  pieces, pillar content, news articles), create FAQ sections, build portfolio or case study
  entries, audit or score existing content for AI-readability or SEO health, get keyword
  strategy or content recommendations, or optimize title tags, meta descriptions, headings,
  and schema markup. Also trigger when the user shares a URL, page draft, or existing copy
  and asks how to improve it, optimize it, or make it "better for AI search" or "better for
  Google." If content, copywriting, blogging, SEO, or AI discoverability is involved in any
  way — use this skill immediately.
---

# AI Content Writer

## Modes

Identify which mode applies before starting.

| Mode | Trigger | Reference |
|---|---|---|
| **1 — Write Static / Marketing Pages** | Homepage, service page, about, landing page, FAQ, portfolio | `references/templates.md` |
| **2 — Write Articles & Blog Posts** | Blog post, how-to, listicle, opinion, news, long-form | `references/article-writing.md` |
| **3 — Rewrite / Audit Existing Content** | User shares copy or URL and wants it improved | `references/audit-rewrite.md` |
| **4 — Content Strategy Recommendations** | User wants to know what to write, fix, or prioritize | `references/recommendations.md` |

Read the relevant reference file before producing output.

Apply `references/seo-layer.md` to all modes.

---

## Core Rules (Apply to All Modes)

### Lead with Facts, Not Feelings

| ❌ AI-Invisible | ✅ AI-Citable |
|---|---|
| "Elevate your business with our expert solutions..." | "Syntactics Inc. provides web design, digital marketing, and custom software development." |
| "We're passionate about helping you grow." | "Founded in 1999, Syntactics has completed over 5,800 projects for clients worldwide." |

### Q&A Structure for Service Content

```
What does [Service] include?
[Company] provides [specific deliverables] including [list]. We use [tech/method] and offer [support/extras].
```

### FAQ Sections Are Non-Negotiable

Every service page, about page, and major landing page needs a FAQ section:
- Maps to how people ask AI agents questions
- Eligible for FAQPage JSON-LD schema
- Each answer: 2–4 sentences, factual, self-contained

### Explicit Over Implied

AI agents cannot infer. State facts directly.
- Don't say "26 years of experience" → Say "Founded in 1999"
- Don't say "global clients" → Say "clients across 20+ countries"

### Plain HTML for Key Facts

Remind clients: facts meant for AI agents must be in plain HTML — not inside images, SVG, or JS-injected content. Flag this in audits.

### Each Page Must Stand Alone

Every page needs a clear entity description, enough context to be understood without reading other pages, and specific scannable facts near the top.

---

## Anchor Text Rules

| ❌ Generic | ✅ Descriptive |
|---|---|
| "Click here" | "view our WordPress development portfolio" |
| "Learn more" | "read about our digital marketing services" |
| "Get Started" | "request a free web design quote" |

---

## Human-Marketing Balance

Facts can be warm. Q&A doesn't mean cold. CTAs should still convert. Don't over-optimize — if a page reads like a data sheet, it's gone too far.

> "Since 1999, Syntactics has helped over 5,800 businesses build their online presence — from local shops in Cagayan de Oro to clients across 20 countries." ← factual AND human.
