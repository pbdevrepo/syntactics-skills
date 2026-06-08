---
name: sync-final-design
version: 2.2.0
description: >
  Use this skill to produce Final Design Documents (FDD) for web and mobile application projects at Syntactics Inc. Outputs one markdown file per module to docs/fdd/{module-slug}.md. Trigger whenever the user mentions "final design", "FDD", "design handoff", "design document", "spec table", "module spec", "specification table", or asks to document modules, system behavior, access validations, wireframes, or database table usage for a project. Also trigger when a user says "fill out the final design for [module]", "create the final design doc", "add a module spec", or "generate the FD template". This skill strictly enforces the v2.0 Business Applications Final Design Template format — do not improvise structure.
---

# Final Design Document Skill

Produces Final Design Documents (FDD) following the **Business Applications Final Design Template v2.0** (Sept 2025). Output is a `.md` file written using the `Write` tool.

## Before You Start

1. Read `references/template-structure.md` — always required; defines the exact table row layout and field rules.
2. Read `references/behavior-validation-guide.md` — load after identifying module type in Step 2a, not before.
3. Read `references/database-standards.md` — load only at Step 2c (Tables section), not before.
4. Ask the user for any missing inputs before generating — never assume module data.

**Version Gate** — check `docs/fdd/index.md` and each `docs/fdd/{module-slug}.md` that already exists:
1. Read the sprint task list's `artifact_version` and the schema's `artifact_version`
2. For `index.md` and each existing module file, compare them to that file's `source_versions.sprint_tasks` and `source_versions.schema`
3. If either differs: **hard stop.** Name the file and which upstream changed (e.g., "Sprint task list has been updated from v{stored} to v{current} — regenerate docs/fdd/index.md and docs/fdd/{module-slug}.md before proceeding.")

Do not warn-and-continue. Regeneration is required.

---

## Workflow

### Step 1 — Gather Project-Level Inputs

Collect once per document (not per module):

| Field | Description |
|---|---|
| `COMPANY NAME` | Client's company name |
| `SYSTEM NAME` | Name of the system/application |
| `PHASE` | e.g., Phase 1, Phase 2 (omit if single-phase — see template note) |
| `FIGMA LINK` | Link to Figma design reference (enter `TBD` if not yet available) |
| `GENERAL INSTRUCTIONS` | Project-specific consistency guidelines (numbered list) |

If `PHASE` is not applicable, remove it from the title — do not leave the placeholder.

**Read all available upstream documents before asking anything.** Each one pre-populates different FDD fields:

| Document | What it provides to the FDD |
|---|---|
| `{project-name}-sprint-tasks.md` | Module list (extract from `### {Module Name}` headings across all Priority sections) |
| BA Intake Document | Module descriptions, category, access roles, business rules, general instructions |
| DB Schema | Table names, columns, FK relationships — fills Tables To Use without asking |

After reading, present your extracted module list to the user: "Here are the modules I found — does this look right, or are there any to add or remove?" Pre-populate every FDD field you can derive from the upstream docs before asking the user for anything. Only ask for fields that the docs do not cover.

### Step 2 — Gather Module-Level Inputs (All Modules Before Writing)

Gather inputs for all confirmed modules before writing any output. For each module, work through the following in order:

#### 2a — Identify Module Type

Before asking any behavioral questions, identify which pattern applies:

| Type | When to use |
|---|---|
| **Auth** | Login, logout, registration, password reset |
| **CRUD** | List + create + edit + delete of a record type |
| **Dashboard** | Aggregated data views, KPI cards, charts, reports |
| **Settings** | System configuration, preferences |
| **Approval** | Review, approve, reject, resubmit workflows |
| **Import/Export** | Bulk data import via file upload or bulk export/download |
| **File Upload** | Single or multi-file attachment to a record |
| **Notifications** | In-app alerts, email notifications, push notifications |

**Load `references/behavior-validation-guide.md` now** (if not yet loaded) — use the matching pattern as your baseline. Expand, trim, or combine patterns as the module requires. Do not apply the generic checklist without first selecting a type.

#### 2b — Fill Behavioral Fields

Work through the pattern for the identified type. Ask the user targeted questions for any item you cannot infer. Cover these user cases at minimum for every module:

- Page/screen load behavior and empty state
- Happy path for each primary action (create, read, update, delete, submit, approve)
- Error and failure states (validation failures, server errors)
- Conditional UI (role-based visibility, status-based show/hide, create vs. edit mode differences)
- Navigation and redirects after each operation
- Per-role access rules (who can view, create, edit, delete) and what happens on unauthorized access
- Every loggable event and the data captured

**Pending rule:** Mark a field `- Pending` only after you have (1) worked through the full checklist for that field's pattern, and (2) asked the user at least one direct follow-up question about it. Do not accept "I'm not sure" as a final answer without one follow-up probe.

#### 2c — Database Tables

**Load `references/database-standards.md` now** (if not yet loaded) — apply naming conventions and formatting rules throughout this section.

Derive Tables To Use from the DB schema first. Map each module's operations to the schema's tables and FK relationships:

- **Insert Into** - tables that receive new rows on create/submit
- **Update** - tables modified by edits or status changes
- **Source** - tables read for lists, dropdowns, or lookups
- **Dependent** - child tables that reference this module's records via FK

Only ask the user about tables that cannot be determined from the schema. If tables are not yet finalized, enter `TBD` and flag it in the Change Log.

#### 2d — Remaining Fields

For all other fields:
- Leave `Wireframe Design` row with a `[wireframe image here]` placeholder
- Use `[date-requestedby]` for Change Log placeholder
- `Output / Print-out`: fill only if this module produces a printable report, exported file, or downloadable document — describe the format and trigger. Leave blank (`-`) if the module has no print or export output.

### Step 3 — Review Draft With User Before Writing

After gathering all module inputs, render the complete spec table(s) in the conversation for the user to review. Ask: "Does this look correct? Any fields to adjust before I write the file?"

Only proceed to Step 4 after the user confirms.

### Step 4 — Generate the Markdown Files

**Output formatting rules (apply during generation):**
- Never use em dashes (--) in any generated .md output. Use a hyphen (-) instead.
- Use `<br>` for line breaks within table cells.
- Table names in "Tables To Use": CAPITALIZED and **bold** (e.g., **USERS**).
- Column names: lowercase, ***bold italic*** (e.g., ***user_id***).

For each module, derive its slug: lowercase the module name, replace spaces with hyphens, remove special characters (e.g., "User Management" → `user-management`). Write one file per module using the `Write` tool.

**Output path:** `docs/fdd/{module-slug}.md`

**Artifact version frontmatter:** Write this YAML block at the very top of each module file before any other content.

Check if `docs/fdd/{module-slug}.md` already exists:
- No previous version: `artifact_version: 1.0.0`
- Previous version exists: read current `artifact_version`, then bump patch (e.g. `1.0.0` → `1.0.1`)

```yaml
---
artifact_version: {version}
generated_by: sync-final-design@2.1.0
generated_at: {YYYY-MM-DD}
source_versions:
  sprint_tasks: {sprint-tasks artifact_version}
  schema: {schema artifact_version}
---
```

**Write `docs/fdd/index.md` first** — before any module files.

Check if `docs/fdd/index.md` already exists:
- No previous version: `artifact_version: 1.0.0`
- Previous version exists: read current `artifact_version`, then bump patch

Index file structure:

```
{frontmatter}

# {COMPANY NAME} - {SYSTEM NAME}{  — {PHASE} | omit if no phase}

**Figma:** {figma_link}

---

## General Instructions

The following instructions provide guidelines to ensure consistency, clarity, and alignment throughout the system design and implementation. Apply them across all modules.

1. {instruction 1}
2. {instruction 2}

---

## Modules

- [{Module Name}](./{module-slug}.md)
- ...
```

Print the progress line after writing:

```
[index] docs/fdd/index.md — written
```

The module list must be written fresh each run — do not append. If modules are added or removed between runs, the list reflects the current run only.

---

**Per-module file structure:**

```
{frontmatter}

# {Module Name}

**System:** {SYSTEM NAME}
**Company:** {COMPANY NAME}

---

{spec table block from references/template-structure.md}
```

Process one module at a time — write each file before moving to the next. Print one progress line immediately after writing:

```
[{n}/{total}] docs/fdd/{module-slug}.md — written
```

### Step 5 — Deliver

Report all output file paths to the user — index.md first, then the module files. Then surface the Approval Gate:

> "FDD is complete. docs/fdd/index.md + {N} module files written to docs/fdd/. Review them carefully — any changes after task generation will require regenerating all three PM task lists (design, frontend, backend).
>
> When you're ready to proceed, say **'approve FDD'** to start task generation."

When the user says "approve FDD": use the Agent tool to invoke the `task-orchestrator` agent.
Pass the project name and the FDD file paths in the invocation message.

---

## Change Log Protocol (Post-Approval Edits)

Once the client approves the FDD, any updates must follow this protocol — remind the user if they're editing an approved document:

- Mark updated fields with `🔴 [UPDATED: date — by: name — approved by: BA/Client]` inline
- Include what changed and who approved it
- Never silently overwrite existing approved content

---

## Handoff Chain

| Step | Skill | Input Needed |
|------|-------|--------------|
| <- Upstream | `sync-sprint-planner` | Intake doc + Schema doc |
| -> Downstream | `task-orchestrator` | Project name + all FDD module files |

After all module FDD files are generated and approved, `task-orchestrator` is invoked automatically to begin the task generation pipeline.
