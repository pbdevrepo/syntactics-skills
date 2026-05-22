# User Story Output Format

This file defines the exact structure for `{project-name}-user-stories.md`.

---

## File Structure

```
---
artifact_version: 1.0.0
generated_by: sync-design-to-stories@1.0.0
generated_at: YYYY-MM-DD
project: {project-name}
page_count: {N}
---

# {Project Name} - User Stories

## MP0001 - {Page Name}

**User Story**
US0001: As a [role], I want to [action], so I can [outcome].

**Acceptance Criteria**
- AC0001: {Criterion one.}
- AC0002: {Criterion two.}
- AC0003: {Criterion three.}

---

## MP0002 - {Page Name}

**User Story**
US0002: As a [role], I want to [action], so I can [outcome].

**Acceptance Criteria**
- AC0004: {Criterion one.}
- AC0005: {Criterion two.}

---
```

---

## ID Formatting Rules

| ID Type | Format | Example |
|---------|--------|---------|
| Page | `MP` + 4-digit zero-padded number | `MP0001` |
| User Story | `US` + 4-digit zero-padded number | `US0001` |
| Acceptance Criterion | `AC` + 4-digit zero-padded number | `AC0001` |

- MP IDs: one per page, sequential from `MP0001`
- US IDs: one per page (matches the MP), sequential from `US0001`
- AC IDs: sequential across all pages - do not restart per page

---

## Section Rules

- Each MP section starts with `## MP{NNNN} - {Page Name}`
- Page name matches what is visible in the mockup (or inferred)
- One `**User Story**` block per section - one story only
- One `**Acceptance Criteria**` block per section - one or more criteria as bullet points
- Each criterion is a single, testable, declarative statement
- Sections are separated by a horizontal rule `---`

---

## Compact Reference Table (Optional)

When the output is large (10+ pages), append a summary table after all sections:

```markdown
## Summary

| MP ID | Page Name | US ID | AC Range |
|-------|-----------|-------|----------|
| MP0001 | Homepage | US0001 | AC0001-AC0035 |
| MP0002 | About | US0002 | AC0036-AC0064 |
```

This table does not replace the detail sections - it supplements them.

---

## Example Entry

```markdown
## MP0001 - Homepage

**User Story**
US0001: As a visitor, I want to easily navigate the homepage, so I can access information about
the company, their latest news, affiliations, and contact details.

**Acceptance Criteria**
- AC0001: The header menu should include the company logo, navigation links, and a Contact Us CTA button.
- AC0002: The logo should be clickable and redirect to the homepage.
- AC0003: The navigation menu should include links to all primary pages.
- AC0004: The Contact Us button should redirect to the contact page.
- AC0005: The hero banner should display the company tagline and primary CTA buttons.
- AC0006: A section displaying the latest stock information including current price, high, low, and volume.
- AC0007: Stock information should be updated regularly.
- AC0008: A section showcasing the company's affiliations with a View All button.
- AC0009: Each affiliation card should include an image and brief description.
- AC0010: A section displaying the latest blog posts in reverse chronological order with a View All button.
- AC0011: Each blog entry should display a title, date, and short excerpt.
- AC0012: A Read More button should redirect to the individual blog post page.
- AC0013: A call-to-action banner with Contact Us and About Us buttons should be present.
- AC0014: The footer should include the company logo, owner information, quick links, copyright, and legal links.
- AC0015: All footer links should be functional and redirect to the appropriate pages.
```
