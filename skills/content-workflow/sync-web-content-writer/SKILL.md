---
name: sync-web-content-writer
version: 1.0.0
description: >
  Write and optimize static web pages - homepages, service pages, about pages, landing pages,
  FAQ sections, and portfolio or case study entries - so they rank on Google AND get cited by
  AI agents (ChatGPT Browse, Perplexity, Claude, Google AI Overviews). Use when the user wants
  to write or rewrite website copy, create FAQ sections, build portfolio entries, optimize title
  tags, meta descriptions, or headings, or make a page "better for AI search" or "better for
  Google." Also trigger when the user shares a page draft or existing static page copy and asks
  how to improve it.
---

# Web Content Writer

## Before You Write

1. Gather client context - `references/intake.md`
2. Read `references/templates.md` for the page type
3. Apply `references/seo-layer.md`

---

## Core Rules

### Lead with Facts, Not Feelings

| ❌ AI-Invisible | ✅ AI-Citable |
|---|---|
| "Elevate your business with our expert solutions..." | "Syntactics Inc. provides web design, digital marketing, and custom software development." |
| "We're passionate about helping you grow." | "Founded in 1999, Syntactics has completed over 5,800 projects for clients worldwide." |

### FAQ Sections Are Non-Negotiable

Every service page, about page, and major landing page needs a FAQ section:
- Maps to how people ask AI agents questions
- Eligible for FAQPage JSON-LD schema
- Each answer: 2-4 sentences, factual, self-contained

### Explicit Over Implied

AI agents cannot infer. State facts directly.
- Don't say "26 years of experience" - Say "Founded in 1999"
- Don't say "global clients" - Say "clients across 20+ countries"

### Plain HTML for Key Facts

Facts meant for AI agents must be in plain HTML - not inside images, SVG, or JS-injected content.

### Each Page Must Stand Alone

Every page needs a clear entity description, enough context to be understood without reading other
pages, and specific scannable facts near the top.

---

## Anchor Text Rules

| ❌ Generic | ✅ Descriptive |
|---|---|
| "Click here" | "view our WordPress development portfolio" |
| "Learn more" | "read about our digital marketing services" |
| "Get Started" | "request a free web design quote" |

---

## Human-Marketing Balance

Facts can be warm. Don't over-optimize - if a page reads like a data sheet, it's gone too far.

> "Since 1999, Syntactics has helped over 5,800 businesses build their online presence - from
> local shops in Cagayan de Oro to clients across 20 countries." - factual AND human.

---

## Output Format

Deliver: **Title tag** | **Meta description** | **H1** | **Body sections** | **FAQ** | **Schema type note**

