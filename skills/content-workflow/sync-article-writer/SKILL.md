---
name: sync-article-writer
version: 1.0.0
description: >
  Write and optimize blog posts — how-to guides, listicles, pillar content, news articles —
  for Google SEO and AI discoverability. Trigger: "write a blog post", "article", "how-to guide",
  "listicle", "pillar article", or "content for SEO".
---

# Article Writer

## Before You Write

1. Gather client context - `references/intake.md`
2. Identify article type and read the matching framework in `references/article-writing.md`
3. Apply `references/seo-layer.md`

---

## Article Types

| Type | Use For | Word Count |
|---|---|---|
| How-To / Guide | Teaching a process | 1,000-2,000 |
| Listicle | Tips, tools, options | 1,000-1,800 |
| Pillar / Comprehensive | Hub for a topic cluster | 2,000-4,000+ |
| Opinion / Thought Leadership | Brand authority | 800-1,500 |
| News / Update | Industry news, algorithm changes | 400-800 |

---

## Core Rules

### TL;DR Is Non-Negotiable

Every article must open with a TL;DR block (2-3 sentences). AI agents cite summaries, not buried
conclusions.

### Hook - Problem - Promise

First 100 words must:
1. **Hook** - a question, stat, or observation the reader recognizes
2. **Problem** - name the specific pain point
3. **Promise** - state exactly what the article delivers

### Question-Based H2s

Phrase headings as questions people actually search:
- ❌ "Web Design Pricing"
- ✅ "How Much Does Web Design Cost in the Philippines?"

### E-E-A-T on Every Article

- Author name + title (required)
- Publish date + "Last updated" date
- 1-2 external links to authoritative sources
- Original data, opinion, or examples - not restated common knowledge

---

## Output Format

Deliver: **Title tag** | **Meta description** | **URL slug** | **H1** | **Article body** | **FAQ** | **Schema type note**

## Output Formatting

- Never use em dashes (--) in any generated .md output. Use a hyphen (-) instead.
