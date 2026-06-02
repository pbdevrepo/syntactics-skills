# Output Format - Client Discovery Brief

File: `docs/sales/{project-name}-discovery.md`

Pre-filled sections are populated by Claude from research.
Answer spaces ( _______________ ) are filled in by the sales rep during or after the client meeting.

---

# Discovery Brief: {Project Name}

**Date:** {date}
**Prepared by:** {sales rep name or "Syntactics Sales Team"}
**Client:** {client name or company}
**Meeting date:** _______________

---

## Pre-Meeting Intel

> Pre-filled from research. Read this before the meeting.

**Domain:** {domain}
**Industry / Sector:** {industry}
**Standards & Frameworks:** {relevant named standards or "General"}

**Standard Modules in this Domain:**
- {module 1}
- {module 2}
- {module 3}

**Common Pain Points Driving Projects Like This:**
- {pain point 1}
- {pain point 2}
- {pain point 3}

**Competitive Landscape:**

| System | Market Segment | Strength | Common Complaint |
|--------|---------------|----------|-----------------|
| {name} | {SMB/Mid/Enterprise} | {strength} | {complaint} |
| {name} | {SMB/Mid/Enterprise} | {strength} | {complaint} |
| {name} | {SMB/Mid/Enterprise} | {strength} | {complaint} |

**Process Flows to Probe:**

| Flow | Start | End | Exception |
|------|-------|-----|-----------|
| {flow name} | {trigger} | {output} | {failure case} |
| {flow name} | {trigger} | {output} | {failure case} |
| {flow name} | {trigger} | {output} | {failure case} |

**Integration Watch Points:**
- {integration 1} - watch for this
- {integration 2} - watch for this

**Hypotheses to Test:**
1. {hypothesis 1 — specific assumption from research}
2. {hypothesis 2}
3. {hypothesis 3}

**Watch Points During the Meeting:**
- {red flag or complexity signal to listen for}
- {scope creep pattern common in this domain}
- {compliance or integration trap to surface early}

---

## Discovery Questions

> Fill in answer spaces during or after the meeting.
> Conditional sub-questions — answer only the one that applies.

---

### Business Context and Pain

**Q: {Hypothesis-led opening — reference a pain point from research.}**
*Why: confirms the root cause and sizes the urgency before discussing features*
Answer: _______________

**Q: What are they currently using to handle this — manual process, spreadsheet, or an existing system?**
*Why: establishes the baseline and surfaces what must be replaced or preserved*
Answer: _______________

**Q: What is the cost of not solving this — operational, financial, or reputational?**
*Why: determines priority and budget justification*
Answer: _______________

**Q: Who is championing this project internally, and who has signed off on budget?**
*Why: identifies the real decision-maker and political blockers*
Answer: _______________

---

### {Process Flow 1 Name}

> {Trigger} -> {Steps} -> {Output} | Exception: {failure case}

**Q: Walk me through how {flow} works today, from {start trigger} to {end output}.**
*Why: maps the current state and surfaces every manual step and handoff*
Answer: _______________

**Q: Who is involved at each step, and what triggers the next step?**
*Why: identifies user roles and approval logic*
Answer: _______________

**Q: Where does this process break down or cause the most frustration?**
*Why: pinpoints the highest-value module features*
Answer: _______________

**Q: What happens when this goes wrong?**
*Why: surfaces exceptions that become edge case requirements*
Answer: _______________

> Conditional - answer only the relevant sub-question:

- If manual today: Who owns the coordination? How long does it take end-to-end? What is the most common error?
  Answer: _______________

- If using an existing tool: What does it do well that you want to keep? What does it fail at that is driving this?
  Answer: _______________

- If not done yet: Is this Phase 1 or Phase 2? Who will own this process once the system is live?
  Answer: _______________

---

### {Process Flow 2 Name}

> {Trigger} -> {Steps} -> {Output} | Exception: {failure case}

**Q: Walk me through how {flow} works today.**
*Why: maps current state and identifies integration dependencies*
Answer: _______________

**Q: Who triggers this process and who closes it out?**
*Why: defines role boundaries*
Answer: _______________

**Q: What happens when this goes wrong?**
*Why: surfaces edge cases*
Answer: _______________

> Conditional - answer only the relevant sub-question:

- If manual today: Who owns it? How long does it take? What is the most common error?
  Answer: _______________

- If using an existing tool: What works? What fails?
  Answer: _______________

- If not done yet: Phase 1 or Phase 2? Who owns it post-launch?
  Answer: _______________

---

### {Process Flow 3 Name}

> Repeat the same pattern as above for each additional flow identified in research.

---

### Scope Boundaries

**Q: Of the standard modules for this type of system — {list from research} — which are in scope for Phase 1?**
*Why: locks the build scope before proposals are written*
Answer: _______________

**Q: What is explicitly out of scope or deferred to a later phase?**
*Why: prevents scope creep from undocumented assumptions*
Answer: _______________

**Q: Are there compliance or regulatory requirements that affect the build — {requirements from research}?**
*Why: compliance gaps are the most expensive to fix post-launch*
Answer: _______________

> If a competitor product is named during this section:
- What specifically made you choose not to go with them — price, features, or fit?
  Answer: _______________

---

### Integrations and Existing Systems

**Q: Of the common integration points for this type of system — {list from research} — which apply here?**
*Why: integration complexity is often underestimated at scoping*
Answer: _______________

**Q: Are there existing systems that must be kept, replaced, or connected?**
*Why: identifies data migration scope and third-party dependencies*
Answer: _______________

**Q: What does the data flow look like — live sync, batch export, or manual transfer?**
*Why: determines integration architecture and timeline impact*
Answer: _______________

---

### Constraints

**Q: Is there a hard deadline or preferred launch window?**
Answer: _______________

**Q: What is the budget range for this project?**
Answer: _______________

**Q: Are there technology requirements or restrictions — specific stack, hosting, or vendor?**
Answer: _______________

**Q: Who maintains this system after launch — the client's team or ongoing support from Syntactics?**
Answer: _______________

---

## Post-Meeting Summary

> Fill in after the meeting. This section feeds sync-requirement-analyzer.

**Root cause of project:** _______________

**Success definition (6 months post-launch):** _______________

**Risk of not building:** _______________

**Confirmed modules in scope (Phase 1):** _______________

**Explicitly out of scope:** _______________

**Integrations confirmed:** _______________

**Open questions to resolve in requirement-analyzer:** _______________

**Hypotheses confirmed or denied:**

| Hypothesis | Outcome | Evidence |
|------------|---------|----------|
| {hypothesis 1} | Confirmed / Denied / Partial | _____ |
| {hypothesis 2} | Confirmed / Denied / Partial | _____ |

---

## Next Step

Pass this file to `sync-requirement-analyzer` as the client input.
