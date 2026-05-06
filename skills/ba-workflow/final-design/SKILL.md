---
name: final-design
version: 1.0.0
description: >
  Use this skill to produce Final Design Documents (FDD) for web and mobile application projects at Syntactics Inc. Trigger whenever the user mentions "final design", "FDD", "design handoff", "design document", "spec table", "module spec", "specification table", or asks to document modules, system behavior, access validations, wireframes, or database table usage for a project. Also trigger when a user says "fill out the final design for [module]", "create the final design doc", "add a module spec", or "generate the FD template". This skill strictly enforces the v2.0 Business Applications Final Design Template format — do not improvise structure.
---

# Final Design Document Skill

Produces Final Design Documents (FDD) following the **Business Applications Final Design Template v2.0** (Sept 2025). Output is a `.md` file written using the `Write` tool.

## Before You Start

1. Read `references/template-structure.md` for the exact table row layout and field rules.
2. Read `references/database-standards.md` for naming conventions and DB table formatting rules.
3. Ask the user for any missing inputs before generating — never assume module data.

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

For each module, collect all fields listed in `references/template-structure.md`. If a field is unknown at time of writing:
- Use `- Pending` as the value for behavioral/validation fields
- Leave `Wireframe Design` row with a `[wireframe image here]` placeholder
- Use `[date-requestedby]` for Change Log placeholder

Always ask: **How many modules need spec tables in this document?**

### Step 3 — Generate the Markdown File

Use the `Write` tool to write the `.md` file. Ask the user for the output path if not specified, or default to the current working directory. File name format: `{system-name}-final-design.md` (kebab-case, lowercase).

Follow the markdown structure defined in `references/template-structure.md` exactly. Do not invent sections or reorder fields.

**Document Structure (in order):**
1. Cover block — company name, system name, phase (if applicable), "Final Design"
2. Table of Contents — linked headings
3. General Instructions section — Figma link + numbered project-specific rules
4. One spec table block per module (repeat as needed)

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

Final step. No further handoff.

| Step | Skill | Input Needed |
|------|-------|--------------|
| ← Upstream | `sprint-planner` | Intake doc + Schema doc |

---

## Reference Files

- `references/template-structure.md` — Full spec table row definitions and column layout rules
- `references/database-standards.md` — DB naming conventions and table formatting for "Tables To Use" rows