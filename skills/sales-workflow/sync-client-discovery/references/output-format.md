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
> [FLOOR] sections are always included. [RESEARCH-GENERATED] sections scale with research depth - no ceiling.

---

### Business Context and Pain [FLOOR]

**Q: {Hypothesis-led opening - reference a specific pain point from research.}**
*Why: confirms the root cause and sizes the urgency before discussing features*
Answer: _______________

**Q: What are they currently using to handle this - manual process, spreadsheet, or an existing system?**
*Why: establishes the baseline and surfaces what must be replaced or preserved*
Answer: _______________

**Q: What is the cost of not solving this - operational, financial, or reputational?**
*Why: determines priority and budget justification*
Answer: _______________

**Q: Who is championing this project internally, and who has signed off on budget?**
*Why: identifies the real decision-maker and political blockers*
Answer: _______________

---

### {Process Flow Name} [RESEARCH-GENERATED]

> {Trigger} -> {Steps} -> {Output} | Exception: {failure case}

<!-- Generate one question per distinct role, handoff, or exception case identified in research for this flow.
     For each hypothesis anchored to this flow, add one targeted hypothesis probe question.
     If research found compliance requirements specific to this flow, add those questions here.
     No generic fallback template - questions derive entirely from research findings. -->

{research-derived questions with Answer: _______________ spaces}

---

> Repeat the above block for each flow identified in Step 2C research.

---

### Compliance: {Requirement Name} [RESEARCH-TRIGGERED]

<!-- Include one block per named compliance requirement found in Step 2A research (HIPAA, GDPR, ISO 27001, etc.)
     Omit entirely if no named compliance requirements were found.
     Do not substitute this with the generic scope compliance question. -->

**Q: {Specific question derived from this compliance requirement - e.g. data residency, audit trail, access control}**
*Why: {specific compliance rationale}*
Answer: _______________

**Q: {Follow-up on enforcement, reporting obligation, or audit trail requirement}**
*Why: compliance gaps are the most expensive to fix post-launch*
Answer: _______________

> Add a third question if the requirement has a third distinct dimension (e.g. retention policy, breach notification).

---

### Scope Boundaries [FLOOR + RESEARCH-ENRICHED]

**Q: Of the standard modules for this type of system - {list from research} - which are in scope for Phase 1?**
*Why: locks the build scope before proposals are written*
Answer: _______________

**Q: What is explicitly out of scope or deferred to a later phase?**
*Why: prevents scope creep from undocumented assumptions*
Answer: _______________

<!-- If research surfaced a competitor gap directly relevant to what this client is building, add one probe question here. -->

<!-- If compliance requirements were not covered in a dedicated compliance block above, add the compliance question here:
     "Are there compliance or regulatory requirements that affect the build - {requirements from research}?" -->

---

### Integrations and Existing Systems [FLOOR + RESEARCH-ENRICHED]

**Q: Of the common integration points for this type of system - {list from research} - which apply here?**
*Why: integration complexity is often underestimated at scoping*
Answer: _______________

**Q: Are there existing systems that must be kept, replaced, or connected?**
*Why: identifies data migration scope and third-party dependencies*
Answer: _______________

**Q: What does the data flow look like - live sync, batch export, or manual transfer?**
*Why: determines integration architecture and timeline impact*
Answer: _______________

<!-- For each high-risk integration watch point flagged in Step 2D research, add one targeted question here beyond the three floor questions above. -->

---

### Constraints [FLOOR]

**Q: Is there a hard deadline or preferred launch window?**
Answer: _______________

**Q: What is the budget range for this project?**
Answer: _______________

**Q: Are there technology requirements or restrictions - specific stack, hosting, or vendor?**
Answer: _______________

**Q: Who maintains this system after launch - the client's team or ongoing support from Syntactics?**
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
