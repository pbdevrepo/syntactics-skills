---
name: sync-final-design
version: 1.0.0
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
| `FIGMA LINK` | Link to Figma design reference |
| `GENERAL INSTRUCTIONS` | Project-specific consistency guidelines (numbered list) |

If `PHASE` is not applicable, remove it from the title — do not leave the placeholder.

### Step 2 — Gather Module-Level Inputs

For each module, collect all fields listed in `references/template-structure.md`.

**For System Behavior, System Validations, Access Validations, and Activity Logs**, work through the checklists in `references/behavior-validation-guide.md`. Ask the user targeted questions to fill these fields as completely as possible — ask per module, using the appropriate pattern (Auth, CRUD, Dashboard, Settings, Approval) as a starting framework. Use `- Pending` only for items that remain genuinely unknown after asking.

Cover these user cases at minimum for every module:
- Page/screen load behavior and empty state
- Happy path for each primary action (create, read, update, delete, submit, approve)
- Error and failure states (validation failures, server errors)
- Conditional UI (role-based visibility, status-based show/hide, create vs. edit mode differences)
- Navigation and redirects after each operation
- Per-role access rules (who can view, create, edit, delete) and what happens on unauthorized access
- Every loggable event and the data captured

For all other fields if unknown at time of writing:
- Leave `Wireframe Design` row with a `[wireframe image here]` placeholder
- Use `[date-requestedby]` for Change Log placeholder

Always ask: **How many modules need spec tables in this document?**

### Step 3 — Generate the Markdown File

Use the `Write` tool to write the `.md` file. Ask the user for the output path if not specified, or default to the current working directory. File name format: `{system-name}-final-design.md` (kebab-case, lowercase).

Follow the markdown structure defined in `references/template-structure.md` exactly. Do not invent sections or reorder fields.

### Step 4 — Deliver

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
| ← Upstream | `sprint-planner` | Intake doc + Schema doc |
| → Downstream | `ui-designer` | All FDD module files |

After all module FDD files are generated and approved, pass them to `ui-designer` to begin the Design & Dev phase.