---
name: ai-content-writer
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

# AI Content Writer Skill

Writes web content optimized for AI agent citation and human conversion — balancing factual
clarity (for AI) with marketing effectiveness (for humans). Also provides content audits and
strategic recommendations.

---

## The Core Principle

AI agents don't read like humans. They scan for **citable facts** — specific, standalone,
unambiguous statements they can pull into answers. Most agency and business websites are written
for human impression, not AI extraction. This skill bridges that gap.

**The dual goal:** Every piece of content should:
1. Give AI agents a clear, quotable fact or answer
2. Give humans a compelling reason to trust and act

These goals are not in conflict — factual clarity *is* compelling to humans, too.

---

## Modes

This skill operates in four modes. Identify which one applies before starting.

### Mode 1: Write New Content (Static / Marketing Pages)
User wants a homepage, service page, about page, landing page, FAQ section, or portfolio entry.
→ Follow the **Content Templates A–E** section.

### Mode 2: Write Articles & Blog Posts
User wants a blog post, how-to guide, listicle, opinion piece, news article, or long-form content.
→ Follow **Template F: Article & Blog Writing** and the **SEO Layer** section.
→ Also read `references/article-writing.md` for full article frameworks and examples.

### Mode 3: Rewrite / Optimize Existing Content
User shares existing copy or a URL and wants it improved.
→ Follow the **Content Audit & Rewrite** section.

### Mode 4: Content Strategy Recommendations
User wants to know what to write, fix, or prioritize.
→ Follow the **Content Recommendations** section.

---

## AI Readability Rules (Apply to All Modes)

These rules must be applied to every piece of content produced by this skill.

### Rule 1: Lead with Facts, Not Feelings
Every page, section, and answer must open with a factual statement, not a marketing phrase.

| ❌ AI-Invisible | ✅ AI-Citable |
|---|---|
| "Elevate your business with our expert solutions..." | "Syntactics Inc. provides web design, digital marketing, and custom software development services." |
| "We're passionate about helping you grow." | "Founded in 1999, Syntactics has completed over 5,800 projects for clients worldwide." |
| "Your success is our mission." | "Syntactics offers post-launch support, SEO, and maintenance packages for all websites we build." |

### Rule 2: Q&A Structure for Service/Feature Content
Format service descriptions so the heading is a question and the first sentence is a direct answer.
```
What does [Service] include?
[Company] provides [specific deliverables] including [list]. We use [tech/method] and offer [support/extras].
```

### Rule 3: FAQ Sections Are Non-Negotiable
Every service page, about page, and major landing page needs a FAQ section. FAQs:
- Map directly to how people ask AI agents questions
- Are eligible for FAQPage JSON-LD schema (surfaces in Google AI Overviews)
- Each answer: 2–4 sentences, factual, self-contained

### Rule 4: Explicit Over Implied
AI agents cannot infer. Every important fact must be stated directly.
- Don't say "26 years of experience" → Say "Founded in 1999"
- Don't say "global clients" → Say "clients across 20+ countries"
- Don't say "top-rated" → Say "Clutch-verified top agency in the Philippines"

### Rule 5: Plain HTML Text for Key Facts
Remind clients: any fact meant for AI agents must be in plain HTML — not inside images,
SVG graphics, or JavaScript-injected content. Flag this in audits.

### Rule 6: Each Page Must Stand Alone
AI agents cite individual pages, not entire sites. Every page needs:
- A clear entity description (what this page is about + who the company is)
- Enough context to be understood without reading other pages
- Specific, scannable facts near the top

---

## Content Templates

### Template A: Service Page

**Structure:**
1. **Hero Statement** — 1–2 sentences, factual, answers "what does this service include?"
2. **Service Overview** — Q&A format, 3–5 questions with direct answers
3. **Who It's For** — specific use cases or industries
4. **What's Included** — bulleted list of deliverables (also human-scannable)
5. **Technology/Methods** — explicit tech stack or methodology
6. **FAQ Section** — 5–8 questions (see FAQ template below)
7. **CTA** — action-oriented, specific (not "Contact Us" → "Request a Free Web Design Quote")

**Sample Hero Statement:**
```
Syntactics' web design service includes UI/UX design, frontend and backend development,
QA testing, and post-launch support. We build on WordPress, WooCommerce, and custom
Laravel-based platforms for clients in the Philippines and worldwide.
```

---

### Template B: About Page / Entity Description

Must include a **clean entity paragraph** near the top — the single most important block for AI:

```
[Company] is a [industry] company founded in [year] and headquartered in [location].
The company [core service summary] and has [key proof point — projects, clients, years].
[Company] serves [target market] and is [notable credential or verification].
```

Then:
- Timeline or milestones (factual, dated)
- Team overview (roles, not just names)
- Values — stated as behaviors, not buzzwords
- FAQ: "What is [Company]?", "Where is [Company] located?", "How long has [Company] been operating?"

---

### Template C: Homepage "At a Glance" Block

Place this high on the homepage, below the hero. It's the single highest-ROI AI optimization.

```
📍 Based in:        [City, Country]
📅 Founded:         [Year] ([X] years in operation)
✅ Projects:        [Number]+
🌍 Clients:         [Region/Worldwide]
🛠 Services:        [Core service list]
💻 Tech stack:      [Technologies]
📞 Contact:         [Phone] | [Email]
```

Pair with Organization schema (JSON-LD).

---

### Template D: FAQ Section

**For each FAQ item:**
- Question: phrased as a human would ask an AI agent
- Answer: 2–4 sentences, factual, self-contained, includes company name

**Standard FAQ questions by page type:**

*Service pages:*
- "What does [Company]'s [Service] include?"
- "How long does a [service] project take at [Company]?"
- "How much does [service] cost at [Company]?"
- "What technologies does [Company] use for [service]?"
- "Can [Company] work with clients outside [location]?"
- "Does [Company] offer support after [service] is complete?"

*About page:*
- "What is [Company]?"
- "When was [Company] founded?"
- "Where is [Company] located?"
- "What industries does [Company] serve?"

*Blog posts:*
- "What is the key takeaway from this article?"
- (Add a TL;DR block at the top or bottom)

---

### Template E: Portfolio / Case Study Entry

AI agents cannot read images. Every portfolio entry needs text:

```
**Client:** [Name or industry if confidential]
**Industry:** [Industry]
**What was built:** [Specific deliverable, e.g., "eCommerce site on WooCommerce"]
**Challenge:** [1–2 sentences on the problem or goal]
**Solution:** [What was done and how]
**Outcome:** [Result — traffic, conversions, timeline — if client permits]
**Technologies:** [Stack used]
```

---

### Template F: Article & Blog Post

Article writing has its own full framework. Read `references/article-writing.md` for:
- Article type frameworks (how-to, listicle, opinion, news, pillar/hub)
- Full structural templates per type
- Intro and conclusion formulas
- AI citation optimization for articles
- Before/after article rewrites

**Quick structure for all article types:**

1. **Target Keyword + Search Intent** — Establish before writing. What is the reader trying to learn or do? What would they type into Google or ask an AI?
2. **TL;DR / Key Takeaway block** — 2–3 sentences at the very top (or bottom). Non-negotiable. AI agents prefer articles that state their conclusion upfront.
3. **SEO Title** — Includes primary keyword, ideally near the front. Under 60 characters.
4. **Meta Description** — 140–155 characters. Contains primary keyword. Answers "what will I learn?"
5. **Intro (Hook → Problem → Promise)** — First 100 words must state what the article covers and why it matters.
6. **Body with Question-Based H2s** — Each major section answers a sub-question of the main topic.
7. **Conclusion with CTA** — Restates the key answer. Links to a relevant service page or next article.
8. **Internal links** — At least 2–3 descriptive-anchor-text links to related site pages.
9. **Article schema** — `Article` JSON-LD. Add `FAQPage` schema if article includes a FAQ.

→ For full article templates, word counts, and E-E-A-T requirements, read `references/article-writing.md`.

---

## Content Audit & Rewrite

When given existing content to improve:

### Step 1: Score the Content
Rate 1–5 on each dimension:

**AI Readability**
- **AI Extractability** — Can an AI agent pull a citable fact from the first paragraph?
- **Factual Density** — Are there specific numbers, dates, tech names, credentials?
- **Q&A Structure** — Are headings framed as questions with direct answers?
- **FAQ Presence** — Does a FAQ section exist?

**SEO Health**
- **Title & Meta** — Do they contain the primary keyword and match search intent?
- **H1/H2 Structure** — One H1, keyword-relevant H2s, question-based where appropriate?
- **Keyword Presence** — Primary keyword in first 100 words?
- **Internal Linking** — At least 2 descriptive internal links?
- **Schema** — Correct schema type applied?

**Human / Conversion**
- **Human Clarity** — Is it scannable? Does the value proposition land quickly?
- **CTA Specificity** — Does the CTA name a specific action?
- **E-E-A-T Signals** — Author, dates, credentials, trust indicators present?

### Step 2: Flag Problem Patterns
- Marketing phrases with no factual content ("elevate," "transform," "empower")
- Implied facts that should be stated (e.g., "years of experience" without a founding year)
- Key facts only in images or JS-rendered elements
- Generic anchor text ("click here," "learn more")
- Missing FAQ sections
- Portfolio entries without text descriptions
- Missing or keyword-absent title tags and meta descriptions
- No author byline or publish date on articles
- Missing schema markup

### Step 3: Produce Rewrites
For each flagged section, produce a side-by-side:
- **Original** (labeled)
- **Rewritten** (labeled, with AI-optimization and SEO notes)

Always preserve brand voice. Optimization ≠ stripping personality. Facts can be stated warmly.

---

## Content Recommendations

When asked what to write or prioritize, use this framework:

### Priority Matrix

| Priority | Content Type | AI Impact | SEO Impact | Effort |
|---|---|---|---|---|
| 🔴 P1 | Homepage "At a Glance" block | Very High | High | Low |
| 🔴 P1 | About page entity paragraph | Very High | High | Low |
| 🔴 P1 | Title tags + meta descriptions (all pages) | High | Very High | Low |
| 🟠 P2 | Service page intro rewrites (top 5 pages) | High | High | Medium |
| 🟠 P2 | FAQ sections + FAQPage schema (top 5 pages) | High | High | Medium |
| 🟠 P2 | Pillar blog articles for core service keywords | Medium | Very High | High |
| 🟡 P3 | Portfolio entry text descriptions | Medium | Medium | Medium |
| 🟡 P3 | Blog TL;DR blocks (new articles going forward) | Medium | Low | Low |
| 🟡 P3 | Author bylines + publish dates on all articles | Medium | High | Low |
| 🟢 P4 | Full blog archive TL;DR + schema retrofit | Low | Medium | High |
| 🟢 P4 | Internal link anchor text audit | Medium | High | High |

### Article Content Strategy

When recommending blog content, prioritize topics by:

1. **Commercial intent keywords** — Topics that attract readers close to hiring ("web design agency Philippines", "how to choose a web developer")
2. **Informational keywords with high volume** — Educational topics that build authority ("what is Laravel", "WordPress vs custom website")
3. **Long-tail FAQ topics** — Exact questions people ask AI agents about the client's services
4. **Competitor gap topics** — Topics competitors rank for that the client doesn't

Recommend at minimum:
- 1 pillar article per core service (2,000+ words)
- 4–6 supporting cluster articles per pillar (800–1,200 words each)
- Monthly news/update articles to signal freshness

### How to Frame Recommendations

Always explain the *reason* for each recommendation:
- What AI behavior or Google ranking factor it addresses
- What human benefit it also provides
- What it takes to implement
- What to write first (the "quick win" version)

### Red Flags to Always Call Out
- No entity description paragraph on About page
- Phone/address only in image or footer JS
- Portfolio with images only, no text
- No FAQ sections anywhere on site
- All anchor text is generic
- No author bylines or dates on articles
- Missing title tags or meta descriptions
- Blog posts with no internal links to service pages
- No schema markup on any page

---

## Anchor Text Rules

| ❌ Generic | ✅ Descriptive |
|---|---|
| "Click here" | "view our WordPress development portfolio" |
| "Learn more" | "read about our digital marketing services" |
| "Get Started" | "request a free web design quote" |
| "See our work" | "browse case studies for eCommerce clients" |

---

## SEO Layer (Apply to All Content)

SEO and AI optimization are deeply complementary. What helps Google understand your content
also helps AI agents cite it. Apply this layer to every piece of content produced.

### On-Page SEO Checklist

For every page or article, confirm:

| Element | Requirement |
|---|---|
| **Title tag** | Contains primary keyword. Under 60 chars. Unique per page. |
| **Meta description** | 140–155 chars. Contains primary keyword. Answers "what will I find here?" |
| **H1** | One per page. Contains primary keyword. Matches search intent. |
| **H2s / H3s** | Use secondary keywords and question-phrased headings naturally. |
| **Primary keyword** | Appears in first 100 words of body content. |
| **Keyword density** | Natural — target keyword appears 2–4x per 1,000 words. Never stuffed. |
| **Internal links** | At least 2–3 per page with descriptive anchor text. |
| **Image alt text** | Descriptive, keyword-relevant. Never "image1.jpg". |
| **URL slug** | Short, keyword-rich, hyphenated. No stop words. |
| **Schema markup** | Correct type applied (see Schema section). |
| **Word count** | Informational articles: 800–1,500 words min. Pillar pages: 2,000+. |

### Keyword Strategy

When writing content, always establish:

1. **Primary keyword** — The main search term this page targets. One per page.
2. **Secondary keywords** — Related terms and synonyms. Naturally woven into H2s and body.
3. **LSI keywords** — Latent semantic terms Google expects to find on this topic.
4. **Long-tail variants** — Used in FAQ questions (these are exactly what people ask AI agents).

**Example — Web Design Service Page:**
- Primary: `web design services Philippines`
- Secondary: `website development Philippines`, `custom web design`
- LSI: `WordPress`, `responsive design`, `UI/UX`, `eCommerce`
- Long-tail (FAQs): `how much does web design cost in the Philippines`, `how long does a website take to build`

### Search Intent Matching

Every page must match its intent type — or it won't rank regardless of optimization:

| Intent | Type | What the page must do |
|---|---|---|
| Informational | Blog, guide, how-to | Answer a question completely |
| Navigational | Homepage, About | Clearly identify the brand |
| Commercial | Service page, comparison | Build trust + show options |
| Transactional | Landing page, contact | Remove friction, drive action |

Mixing intent types on one page hurts both SEO and conversions. Service pages are commercial
intent — don't bloat them with informational content. Move that to blog articles.

### E-E-A-T Signals (Critical for AI Citation + Google Trust)

Google and AI agents both weight **Experience, Expertise, Authoritativeness, Trustworthiness**:

- **Experience:** Include real project data, client outcomes, years doing specific work
- **Expertise:** Author bylines on articles with role/credentials. Technical accuracy.
- **Authoritativeness:** Clutch badges, awards, certifications cited with verification links
- **Trustworthiness:** Real address, phone, privacy policy, SSL, consistent NAP data

For articles specifically:
- Always include author name + title
- Include "Last updated" date
- Link out to authoritative external sources (1–2 per article)
- Include original data, opinions, or examples — not just restated common knowledge

### URL Structure Rules

```
✅ /services/web-design-philippines
✅ /blog/how-long-does-a-website-take-to-build
✅ /portfolio/ecommerce-website-woocommerce

❌ /services/page?id=42
❌ /blog/post-1
❌ /wp-content/uploads/new-page-final-v3
```

### Schema Markup Reminders

Always note which schema applies (for developer handoff):

- **Homepage / About:** `Organization` schema — name, url, logo, foundingDate, address, contactPoint
- **Service pages:** `Service` schema + `FAQPage` schema
- **Blog posts / Articles:** `Article` schema + `FAQPage` if FAQs included
- **Portfolio entries:** `CreativeWork` schema
- **Local business (if applicable):** `LocalBusiness` schema with geo coordinates

Full JSON-LD templates → `references/schema-snippets.md`

Do not write the JSON-LD yourself unless asked — note which type is needed for dev handoff.

---

## Human-Marketing Balance

AI optimization must not erase brand voice. Apply these checks:

- **Facts can be warm.** "Since 1999, Syntactics has helped over 5,800 businesses build their online presence — from local shops in Cagayan de Oro to clients across 20 countries." ← factual AND human.
- **Q&A doesn't mean cold.** The question heading is neutral; the answer can carry personality.
- **CTAs should still convert.** Specific ≠ robotic. "Request your free website quote today" is both AI-readable and conversion-friendly.
- **Don't over-optimize.** If a page reads like a data sheet, it's gone too far. Every page still needs a human reason to care.

---

## Reference Files

- `references/article-writing.md` — Full article frameworks by type (how-to, listicle, opinion, pillar, news), structural templates, intro/conclusion formulas, E-E-A-T guidance, and before/after examples
- `references/sample-rewrites.md` — Before/after rewrites for static page types (service, about, portfolio, homepage)
- `references/faq-bank.md` — Reusable FAQ question templates by industry and page type
- `references/schema-snippets.md` — JSON-LD schema templates for Organization, FAQPage, Article, Service, CreativeWork

Read the relevant reference file when producing content for a specific content type or when the user asks for examples.