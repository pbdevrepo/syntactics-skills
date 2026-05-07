# SEO Layer

Apply to every piece of content produced. SEO and AI optimization are complementary — what helps Google understand content also helps AI agents cite it.

## On-Page SEO Checklist

| Element | Requirement |
|---|---|
| **Title tag** | Contains primary keyword. Under 60 chars. Unique per page. |
| **Meta description** | 140–155 chars. Contains primary keyword. Answers "what will I find here?" |
| **H1** | One per page. Contains primary keyword. Matches search intent. |
| **H2s / H3s** | Use secondary keywords and question-phrased headings naturally. |
| **Primary keyword** | Appears in first 100 words of body content. |
| **Keyword density** | Natural — target keyword 2–4x per 1,000 words. Never stuffed. |
| **Internal links** | At least 2–3 per page with descriptive anchor text. |
| **Image alt text** | Descriptive, keyword-relevant. Never "image1.jpg". |
| **URL slug** | Short, keyword-rich, hyphenated. No stop words. |
| **Schema markup** | Correct type applied (see schema section below). |
| **Word count** | Informational articles: 800–1,500 words min. Pillar pages: 2,000+. |

---

## Keyword Strategy

Always establish for every page:

1. **Primary keyword** — one per page
2. **Secondary keywords** — related terms and synonyms, woven into H2s and body
3. **LSI keywords** — latent semantic terms Google expects to find on this topic
4. **Long-tail variants** — used in FAQ questions (these are exactly what people ask AI agents)

**Example — Web Design Service Page:**
- Primary: `web design services Philippines`
- Secondary: `website development Philippines`, `custom web design`
- LSI: `WordPress`, `responsive design`, `UI/UX`, `eCommerce`
- Long-tail (FAQs): `how much does web design cost in the Philippines`, `how long does a website take to build`

---

## Search Intent Matching

| Intent | Type | What the page must do |
|---|---|---|
| Informational | Blog, guide, how-to | Answer a question completely |
| Navigational | Homepage, About | Clearly identify the brand |
| Commercial | Service page, comparison | Build trust + show options |
| Transactional | Landing page, contact | Remove friction, drive action |

Mixing intent types on one page hurts both SEO and conversions. Service pages are commercial intent — move informational content to blog articles.

---

## E-E-A-T Signals

Google and AI agents both weight Experience, Expertise, Authoritativeness, Trustworthiness:

- **Experience:** Real project data, client outcomes, years doing specific work
- **Expertise:** Author bylines on articles with role/credentials. Technical accuracy.
- **Authoritativeness:** Clutch badges, awards, certifications cited with verification links
- **Trustworthiness:** Real address, phone, privacy policy, SSL, consistent NAP data

For articles:
- Always include author name + title
- Include "Last updated" date
- Link out to 1–2 authoritative external sources
- Include original data, opinions, or examples — not just restated common knowledge

---

## URL Structure

```
✅ /services/web-design-philippines
✅ /blog/how-long-does-a-website-take-to-build
✅ /portfolio/ecommerce-website-woocommerce

❌ /services/page?id=42
❌ /blog/post-1
```

---

## Schema Markup

Note which type applies (for developer handoff — do not write JSON-LD unless asked):

- **Homepage / About:** `Organization` — name, url, logo, foundingDate, address, contactPoint
- **Service pages:** `Service` + `FAQPage`
- **Blog posts / Articles:** `Article` + `FAQPage` if FAQs included
- **Portfolio entries:** `CreativeWork`
- **Local business:** `LocalBusiness` with geo coordinates

Full JSON-LD templates → `references/schema-snippets.md`
