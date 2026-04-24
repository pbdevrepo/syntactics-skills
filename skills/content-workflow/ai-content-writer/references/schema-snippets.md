# Schema Markup Snippets

JSON-LD templates for common page types. Fill in the bracketed values and hand off to the
developer for implementation in the `<head>` or before `</body>`.

---

## Organization Schema (Homepage / About Page)

```json
{
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "[Company Name]",
  "url": "[https://www.yoursite.com]",
  "logo": "[https://www.yoursite.com/logo.png]",
  "foundingDate": "[YYYY]",
  "description": "[1–2 sentence factual description of the company]",
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "[Street Address]",
    "addressLocality": "[City]",
    "addressRegion": "[Province/State]",
    "postalCode": "[Postal Code]",
    "addressCountry": "[PH / US / AU etc.]"
  },
  "contactPoint": {
    "@type": "ContactPoint",
    "telephone": "[+63-88-856-2242]",
    "contactType": "customer service",
    "availableLanguage": "English"
  },
  "sameAs": [
    "[https://www.facebook.com/yourpage]",
    "[https://www.linkedin.com/company/yourcompany]",
    "[https://clutch.co/profile/yourcompany]"
  ]
}
```

---

## FAQPage Schema (Service Pages / About Page)

```json
{
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "[Question text exactly as it appears on the page]",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "[Answer text exactly as it appears on the page]"
      }
    },
    {
      "@type": "Question",
      "name": "[Second question]",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "[Second answer]"
      }
    }
  ]
}
```

**Note:** The `name` and `text` values must match the visible page content exactly.
Add one `mainEntity` block per FAQ item.

---

## Service Schema (Service Pages)

```json
{
  "@context": "https://schema.org",
  "@type": "Service",
  "name": "[Service Name, e.g., Web Design Services]",
  "provider": {
    "@type": "Organization",
    "name": "[Company Name]",
    "url": "[https://www.yoursite.com]"
  },
  "description": "[Factual 1–2 sentence description of the service]",
  "areaServed": "[e.g., Philippines, Worldwide]",
  "serviceType": "[e.g., Web Design and Development]"
}
```

---

## Article Schema (Blog Posts)

```json
{
  "@context": "https://schema.org",
  "@type": "Article",
  "headline": "[Article title]",
  "description": "[TL;DR or summary — 1–2 sentences]",
  "datePublished": "[YYYY-MM-DD]",
  "dateModified": "[YYYY-MM-DD]",
  "author": {
    "@type": "Person",
    "name": "[Author Name]"
  },
  "publisher": {
    "@type": "Organization",
    "name": "[Company Name]",
    "logo": {
      "@type": "ImageObject",
      "url": "[https://www.yoursite.com/logo.png]"
    }
  },
  "image": "[https://www.yoursite.com/blog/article-image.jpg]"
}
```

---

## CreativeWork Schema (Portfolio / Case Studies)

```json
{
  "@context": "https://schema.org",
  "@type": "CreativeWork",
  "name": "[Project Name]",
  "creator": {
    "@type": "Organization",
    "name": "[Company Name]"
  },
  "description": "[1–2 sentence factual description of the project]",
  "keywords": "[e.g., WordPress, eCommerce, WooCommerce, Philippines]",
  "dateCreated": "[YYYY]"
}
```

---

## Implementation Notes for Developers

- Place JSON-LD in a `<script type="application/ld+json">` tag
- Can go in `<head>` or just before `</body>` — both are valid
- Multiple schema types on one page: use separate `<script>` blocks per type
- Validate with: https://search.google.com/test/rich-results
- FAQPage schema requires the FAQ content to also be visible on the page (not hidden)
- Test Organization schema with Google's Structured Data Testing Tool