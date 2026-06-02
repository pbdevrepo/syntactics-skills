---
name: sync-client-discovery
version: 2.4.0
description: >
  Research-first client discovery skill for the Sales workflow at Syntactics Inc. Behaves like a
  senior sales consultant who studies the domain, maps industry process flows, and runs competitor
  analysis before generating contextual, process-driven questions. Produces a single fillable
  discovery brief: research pre-filled at the top, process-flow-anchored questions with answer
  spaces below for the rep to complete during the client meeting. Trigger when a Sales team member
  says "client has no idea what they want", "no requirements yet", "start discovery", "client
  discovery", "discovery questions", or when a new client has not yet provided any brief or RFP.
  Always run before sync-requirement-analyzer when client input is absent or extremely vague.
---

# Client Discovery - Senior Consultant Mode

Research first. Study ahead. Write a brief the sales rep takes into the meeting.
One output. No modes.

Workflow: **client-discovery -> requirement-analyzer -> proposal-grill -> proposal-writer -> quotation**

---

## Step 1 - Project Setup

Ask three questions before doing anything else:

1. **"What is the project name?"** - kebab-case, lowercase (e.g., `inventory-system`)
2. **"Give me a one-liner: what does the client want to build?"** - e.g., "a patient booking system for a private clinic" or "an inventory platform for a retail chain"
3. **"What industry or sector is the client in?"** - e.g., Healthcare, Retail, Manufacturing, Financial Services, Education

Do not proceed until you have all three answers.

---

## Step 2 - Pre-Discovery Research

**This step is mandatory. Do not skip it.**

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

These process flows are the backbone of the discovery questions. Each question must confirm,
deny, or clarify whether a flow applies and how the client handles it today.

### 2D - Integration Points

Search: `{domain} {industry} common system integrations third-party data exchange`

Identify:
- What systems does this type of software commonly connect to?
- What data is typically imported or exported?
- What integration patterns are standard (live sync, batch export, webhook)?

---

## Step 3 - Discovery Intelligence Brief

After completing research, output a compact block in chat prefixed `[PRE-DISCOVERY INTEL]`.
Do not write this to file. This primes the sales rep before the file is generated.

```
[PRE-DISCOVERY INTEL]
Domain: {domain}
Industry / Sector: {industry}
Standards & Frameworks: {relevant named standards - e.g., ISO 9001, HIPAA, APQC PCF}
Standard Modules: {list}
Common Pain Points: {list}
Key Competitors:
  - {Vendor 1} - {market segment} - Strength: {X} / Gap: {Y}
  - {Vendor 2} - {market segment} - Strength: {X} / Gap: {Y}
  - {Vendor 3} - {market segment} - Strength: {X} / Gap: {Y}
Process Flows to Probe:
  - {Flow 1}: {Trigger} -> {Steps} -> {Output} | Exception: {failure case}
  - {Flow 2}: {Trigger} -> {Steps} -> {Output} | Exception: {failure case}
  - {Flow 3}: {Trigger} -> {Steps} -> {Output} | Exception: {failure case}
Integration Watch Points: {list}
Hypotheses to Confirm: {2-3 specific assumptions about what this client probably needs}
Sources reviewed: {list of credible sources consulted}
```

Then ask: **"Anything to add or correct before I write the brief?"**

**Fallback:** If web search returns thin or irrelevant results, state:
*"Research returned limited results for this domain. Writing the brief with what was found -
share any additional domain context you have so I can enrich the questions."*

---

## Step 4 - Write the Discovery Brief

Write the file - do not output it in chat.

File: `docs/sales/{project-name}-discovery.md`

Follow `references/output-format.md` for the exact structure.

### Question Generation Rules

**Floor - always include, no research required:**
- Business Context and Pain: 4 core questions
- Scope Boundaries: 2 core questions (in-scope modules, explicitly out-of-scope)
- Constraints: 4 core questions (deadline, budget, tech restrictions, post-launch ownership)

**Research-driven - no ceiling:**
- Per-flow questions: every flow starts with the 4 core questions (walk me through, who is involved, where does it break down, what happens when wrong). After those, think like a salesperson who has read the research. Generate follow-up questions and conditional probes specific to how this flow operates in this domain - scenarios, edge cases, failure modes, role structures, compliance touchpoints, approval chains, data handoffs. Do not use generic manual/tool/not-done-yet buckets. Do not cap the count. Follow every thread that research opened.
- Hypothesis probes: for each hypothesis in the intel brief, write one targeted question placed in the most relevant flow or scope section - not in a standalone block.
- Compliance trigger: for each named compliance requirement found in Step 2A (HIPAA, GDPR, ISO 27001, etc.), add a dedicated compliance block with 2-3 questions specific to that requirement. The generic scope compliance question is not a substitute.
- Integration trigger: for each high-risk integration watch point flagged in Step 2D, add one targeted question in the Integrations section beyond the floor questions.
- Competitor probe: if research surfaced a competitor gap directly relevant to what this client is building, add one probe question in the Scope Boundaries section.

The file has two parts:
- **Pre-Meeting Intel** (pre-filled from research) - competitive landscape, process flows, hypotheses, watch points
- **Discovery Questions** (floor questions always present + research-driven questions with no ceiling) - rep fills these in during or after the client meeting

After writing, state the file path and say:

```
Discovery brief ready. Before the meeting: read the Pre-Meeting Intel section.
During the meeting: fill in the answer spaces under each question.
After the meeting: pass {project-name}-discovery.md to sync-requirement-analyzer.
```

---

## Reference Files

- `references/output-format.md` - Discovery brief structure
