---
name: sync-design-to-stories
version: 1.0.0
description: >
  Analyzes design mockup images (PNG, JPG, or PDF) and generates structured user stories and
  acceptance criteria per page. Trigger when a PM says "generate user stories from design",
  "create user stories from mockup", "analyze mockup and write ACs", "design to stories",
  or "user stories from Figma export". Accepts one image per page or a multi-page export.
  Outputs a structured user stories document with MP/US/AC IDs. Standalone skill - no
  dependency on other pm-workflow skills.
---

# Design to Stories

Analyze design mockup images. Identify every distinct page. Generate user stories and acceptance
criteria per page. Output a structured document the PM can use directly in project deliverables.

---

## Before You Start

Ask:
1. **"What is the project name?"** (used for the output file name and IDs)
2. **"Provide the design mockup images."** (file paths or drag-and-drop uploads - PNG, JPG, or PDF)
3. **"Who are the user roles in this system?"** (e.g. visitor, admin, registered user - list them)

If user roles are not provided, infer them from the design (look for login screens, admin panels,
role-based navigation). State your inference and ask for confirmation before proceeding.

Accept images as:
- File paths (absolute or relative)
- Uploaded files in the conversation
- Multi-page PDF exports from Figma or similar tools

If multiple images are provided, treat each image as one distinct page unless the image
clearly shows multiple screens (e.g., a single mockup sheet). In that case, identify each
screen within the image separately.

Read `references/user-story-output-format.md` before generating any output.

---

## Workflow

### Step 1 - Analyze Each Design Image

For each image provided:

1. Identify the **page name** from visible headings, navigation highlights, or page content.
   If not visible, infer from the layout (e.g., contact form page, news listing page).
2. Identify the **primary user role** for this page (visitor, admin, registered user, etc.).
3. Identify every distinct **UI section or component** on the page:
   - Header / navigation
   - Hero / banner
   - Content sections (lists, cards, grids, detail views)
   - Forms (fields, buttons, validation states)
   - Modals, drawers, or overlays
   - Sidebars and filters
   - Footer
   - Any interactive elements (pagination, tabs, accordions)

Do not skip sections. Every visible component may generate an acceptance criterion.

### Step 2 - Assign Page IDs

Number pages in the order they are provided (or in logical site navigation order if clearly
structured - home before subpages, public before admin).

Format: `MP{4-digit-number}` starting from `MP0001`.

Keep a running tally across all images so IDs never repeat within one project run.

If the project already has a user stories document, read it first. Start MP numbering from
the next available ID to avoid collisions.

### Step 3 - Generate User Stories

Write one user story per page. Use the standard format:

```
As a [role], I want to [action], so I can [outcome].
```

Rules:
- Use the primary role identified in Step 1.
- The action must describe what the user does on this page - not the system's behavior.
- The outcome must state the business or personal value to the user.
- Do not combine multiple pages into one user story.
- Do not write vague stories ("I want to see information"). Be specific to the page content.

Format: `US{4-digit-number}` starting from `US0001` for the first story in this run.

### Step 4 - Generate Acceptance Criteria

Write acceptance criteria for each page. Each criterion must be:
- Observable - testable by a QA tester looking at the screen
- Specific - no vague terms like "should work correctly" or "should be user-friendly"
- Tied to a visible UI element or behavior you saw in the image

**Always generate criteria for:**

| Observed Element | Acceptance Criteria to Write |
|------------------|------------------------------|
| Header / navigation | Logo visible and clickable; nav links present and named; CTA buttons labeled and linked |
| Hero / banner | Banner displays tagline or title; CTA buttons present and labeled |
| Page title | Title is prominently displayed at the top of the page |
| Breadcrumb navigation | Breadcrumb shows current page hierarchy; appears below the banner |
| Content list / grid | Each item shows required fields (title, date, image, description); sorted order stated |
| Document/PDF items | View PDF button present; clicking opens in new tab; Download PDF button if visible |
| Filter / sort controls | Filter dropdown options stated; Clear button present to reset |
| Forms | All visible fields listed; required fields identified; submit button labeled; success state described |
| Modals | Trigger element identified; modal content described; close/exit button present |
| Sidebar menu | Menu items listed; position on page stated (left/right) |
| Pagination | Controls appear at bottom; next/previous navigation available |
| Cards (people/bios) | Card shows name and photo; clicking opens modal with full bio |
| Footer | Logo, owner info, quick links, copyright, and legal links present; links functional |
| Images | Image is relevant and not pixelated |
| CTA banner | Tagline, description, and button(s) labeled and functional |

Write criteria in third-person declarative form: "The logo should be clickable..." not "I can click the logo."

Format: `AC{4-digit-number}` starting from `AC0001` for the first criterion in this run.
Criteria are numbered sequentially across all pages - do not restart per page.

### Step 5 - Self-Review Before Delivering

- [ ] Every provided image has a corresponding MP entry
- [ ] Every MP entry has exactly one user story
- [ ] Every user story follows As a / I want to / so I can format
- [ ] Every visible UI section has at least one acceptance criterion
- [ ] No acceptance criterion says "should work correctly" or "should be user-friendly"
- [ ] AC IDs are sequential with no gaps or repeats
- [ ] Footer criteria are present on every full-page design
- [ ] Admin pages clearly state "admin" as the role in the user story

### Step 6 - Deliver

Write file: `docs/pm/{project-name}-user-stories.md`

**Artifact version frontmatter:**

Check if a previous version exists at the output path:
- No previous version: `artifact_version: 1.0.0`
- Previous version exists: read current `artifact_version`, then bump:
  - Any page added or removed: bump minor (e.g. `1.0.0` -> `1.1.0`)
  - Any other edit: bump patch (e.g. `1.0.0` -> `1.0.1`)

```yaml
---
artifact_version: {version}
generated_by: sync-design-to-stories@1.0.0
generated_at: {YYYY-MM-DD}
project: {project-name}
page_count: {total MP entries}
---
```

Follow `references/user-story-output-format.md` for exact structure.

State the file path, then say:

```
User stories generated. {N} pages documented with {N} user stories and {N} acceptance criteria.

Review each AC against the mockup before sharing with the client or QA team.
```

---

## Reference Files

- `references/user-story-output-format.md` - Output structure and markdown format
