---
name: sync-sales-discovery
version: 1.0.0
description: >
  Qualification-first client discovery skill for the Salesperson workflow at Syntactics Inc.
  Researches the domain and competitive landscape, then structures the first call around pain and
  qualification - not process mapping. Research informs the call but does not lead it. Produces a
  fillable discovery brief with a structured Call Agenda for the first 10 minutes and a Deal Health
  block the rep fills during the call. Trigger when a Sales team member says "prep for the
  discovery call", "prepare for the meeting", "I have a call with the client", or after
  sync-deal-qualify passes. Always run before sync-requirement-analyzer.
---

# Sales Discovery

Research the domain. Structure the call around qualification first, scope second.

Research supports the rep - it does not run the meeting.

Workflow: **deal-qualify -> sales-discovery -> [requirement-analyzer -> proposal-grill -> proposal-writer -> quotation] -> proposal-seller -> deal-followup**

---

## Step 1 - Project Setup

Ask four questions before researching:

1. **"What is the project name?"** - kebab-case, lowercase (e.g., `inventory-system`)
2. **"Give me a one-liner: what does the client want to build?"** - e.g., "a patient booking system for a private clinic"
3. **"What industry or sector is the client in?"** - e.g., Healthcare, Retail, Manufacturing, Financial Services, Education
4. **"Any Yellow dimensions flagged in the Deal Scorecard?"** - these become targeted questions in the Call Agenda

Do not proceed until you have the first three answers. The fourth is optional but changes how the Call Agenda is written.

---

## Step 2 - Pre-Discovery Research

Run four research tracks using web search. Prioritize credible, authoritative sources:
- Industry analyst reports: Gartner, Forrester, IDC, McKinsey
- Process frameworks: APQC Process Classification Framework, industry standards bodies
- Industry associations: SHRM (HR), HIMSS/HL7 (Healthcare), ACFE (Finance), NRF (Retail), etc.
- Academic journals, ISO standards, Wikipedia for standard process definitions

### 2A - Domain Intelligence

Search: `{domain} {industry} standard modules industry requirements compliance`

Identify:
- What category of system is this? (HRIS, LMS, Inventory, Booking, CRM, ERP, etc.)
- What standard modules does this type of system typically include?
- What are the most common pain points that lead companies to build or buy this?
- What compliance or regulatory requirements apply to this domain and industry?

### 2B - Competitive Landscape

Search: `{domain} top software vendors comparison {current year}`
Search: `{domain} {industry} Gartner Magic Quadrant OR market leaders`

Identify:
- Top 3-5 existing solutions in this space
- What users love and hate about those systems
- What gaps or differentiators custom-built systems typically offer

### 2C - Process Flow Mapping

Search: `{domain} {industry} end-to-end process workflow standard`

Identify 3-5 core end-to-end process flows typical to this domain.
Format each as: `Trigger -> Steps -> Output | Exception: {failure case}`

These flows feed the scope questions in the second half of the call - after qualification is complete.

### 2D - Integration Points

Search: `{domain} {industry} common system integrations third-party data exchange`

Identify:
- What systems does this type of software commonly connect to?
- What data is typically imported or exported?
- What integration patterns are standard (live sync, batch export, webhook)?

---

## Step 3 - Pre-Discovery Intel Block

Output a compact block in chat prefixed `[PRE-DISCOVERY INTEL]`. Do not write to file.

```
[PRE-DISCOVERY INTEL]
Domain: {domain}
Industry / Sector: {industry}
Standards & Frameworks: {relevant named standards or "General"}
Standard Modules: {list}
Common Pain Points: {list - these sharpen the pain question on the call}
Key Competitors:
  - {Vendor 1} - Strength: {X} / Gap: {Y}
  - {Vendor 2} - Strength: {X} / Gap: {Y}
  - {Vendor 3} - Strength: {X} / Gap: {Y}
Process Flows (use after qualification, not as call opener):
  - {Flow 1}: {Trigger} -> {Steps} -> {Output} | Exception: {failure case}
  - {Flow 2}: {Trigger} -> {Steps} -> {Output} | Exception: {failure case}
Integration Watch Points: {list}
Sources reviewed: {list of credible sources consulted}
```

**Fallback:** If web search returns thin results, state:
*"Research returned limited results for this domain. Writing the brief with what was found - share any additional domain context so I can enrich the agenda."*

Then ask: **"Anything to add or correct before I write the brief?"**

---

## Step 4 - Write the Discovery Brief

Write the file. Do not output it in chat.

File: `docs/sales/{project-name}-discovery.md`

Follow `references/output-format.md` exactly.

The brief has three parts:

1. **Pre-Meeting Intel** - pre-filled from research; rep reads this before the meeting
2. **Call Agenda** - structured first-10-minutes script; rep follows this before moving to scope questions; includes targeted questions for any Yellow dimensions from the Deal Scorecard
3. **Discovery Questions** - process-flow-anchored scope questions with answer spaces; rep fills during the call; includes Deal Health block the rep completes before leaving

After writing, state the file path and say:

```
Discovery brief ready.
Before the meeting: read Pre-Meeting Intel.
On the call: follow the Call Agenda for the first 10 minutes. Fill in Discovery Questions as the conversation moves to scope. Complete the Deal Health block before the call ends.
After the meeting: pass {project-name}-discovery.md to sync-requirement-analyzer.
```

---

## Reference Files

- `references/output-format.md` - Discovery brief structure including Call Agenda and Deal Health block
- `references/question-bank.md` - Qualification and scope questions, organized by call phase
