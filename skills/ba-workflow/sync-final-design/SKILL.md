---
name: sync-final-design
version: 1.1.0
description: >
  Use this skill to produce Final Design Documents (FDD) for web and mobile application projects at Syntactics Inc. Trigger whenever the user mentions "final design", "FDD", "design handoff", "design document", "spec table", "module spec", "specification table", or asks to document modules, system behavior, access validations, wireframes, or database table usage for a project. Also trigger when a user says "fill out the final design for [module]", "create the final design doc", "add a module spec", or "generate the FD template". This skill strictly enforces the v2.0 Business Applications Final Design Template format — do not improvise structure.
---

# Final Design Document Skill

Produces Final Design Documents (FDD) following the **Business Applications Final Design Template v2.0** (Sept 2025). Output is a `.md` file written using the `Write` tool.

## Before You Start

1. Read `references/template-structure.md` for the exact table row layout and field rules.
2. Read `references/database-standards.md` for naming conventions and DB table formatting rules.
3. Read `references/behavior-validation-guide.md` for how to fill System Behavior, System Validations, Access Validations, and Activity Logs.
4. Ask the user for any missing inputs before generating — never assume module data.

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

Use the matching pattern from `references/behavior-validation-guide.md` as your baseline — expand, trim, or combine patterns as the module requires. Do not apply the generic checklist without first selecting a type.

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

### Step 4 — Generate the Markdown File

**Output formatting rules (apply during generation):**
- Never use em dashes (--) in any generated .md output. Use a hyphen (-) instead.
- Use `<br>` for line breaks within table cells.
- Table names in "Tables To Use": CAPITALIZED and **bold** (e.g., **USERS**).
- Column names: lowercase, ***bold italic*** (e.g., ***user_id***).

Use the `Write` tool to write the `.md` file. Ask the user for the output path if not specified. File name format: `{system-name}-final-design.md` (kebab-case, lowercase).

Follow the markdown structure defined in `references/template-structure.md` exactly. Do not invent sections or reorder fields.

### Step 5 — Deliver

Report the output file path to the user.

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
| -> Downstream | `sync-ui-task-creator` | All FDD module files |

After all module FDD files are generated and approved, pass them to `sync-ui-task-creator` to begin the Design & Dev phase.
