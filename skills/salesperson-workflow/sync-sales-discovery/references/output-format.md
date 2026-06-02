# Output Format - Sales Discovery Brief

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
- {pain point 1 - use these to make the pain question specific, not generic}
- {pain point 2}
- {pain point 3}

**Competitive Landscape:**

| System | Market Segment | Strength | Common Complaint |
|--------|---------------|----------|-----------------|
| {name} | {SMB/Mid/Enterprise} | {strength} | {complaint} |
| {name} | {SMB/Mid/Enterprise} | {strength} | {complaint} |
| {name} | {SMB/Mid/Enterprise} | {strength} | {complaint} |

**Process Flows to Cover After Qualification:**

| Flow | Start | End | Exception |
|------|-------|-----|-----------|
| {flow name} | {trigger} | {output} | {failure case} |
| {flow name} | {trigger} | {output} | {failure case} |
| {flow name} | {trigger} | {output} | {failure case} |

**Integration Watch Points:**
- {integration 1} - flag early; these expand scope quickly
- {integration 2}

---

## Call Agenda

> First 10 minutes. Follow this sequence before moving to scope and process questions.
> Research is the backup, not the opener. Qualification comes first.

### Opener (1-2 min)

Brief rapport. One sentence about Syntactics and your role. Then hand the floor to the client:

**"Tell me a bit about what's driving this conversation on your end."**

Let them talk. Do not interrupt with features, capabilities, or your process.

### Pain (3-4 min)

Sharpen the pain based on what they said. Use a pain point from Pre-Meeting Intel if it matches:

**"It sounds like [restate what they said]. Is the main pressure [specific pain from research] or is there something else driving the urgency?"**

Get them to name the cost of not solving this. If they are vague, push:

**"What happens if you don't build this in the next 6 months?"**

### Qualification (4-5 min)

Ask these directly. Do not soften them. Budget and authority questions are not rude - they save everyone's time.

**Budget:** "To make sure we scope this appropriately - do you have a budget range in mind, or is that still being determined?"

**Decision-maker:** "Who else on your side needs to be involved before you move forward on something like this?"

**Timeline:** "Is there a hard deadline you're working toward, or is the timing flexible?"

**Competition:** "Are you talking to other vendors as well, or is this an exploratory conversation?"

<!-- If Yellow dimensions were flagged in the Deal Scorecard, add targeted questions here for each one. Replace the generic version with the specific version derived from the scorecard signal. -->

{[If Budget was Yellow]: "When you say budget is still being worked out - do you have a ballpark in mind, or is approval still pending?"}
{[If Decision-maker was Yellow]: "You mentioned [champion name] - who else needs to sign off above them?"}
{[If Timeline was Yellow]: "You mentioned [target date] - is there an external event driving that, or is it more of an internal target?"}

### Transition to Scope (at minute 10)

Once qualification signals are collected, move to process and scope questions:

**"Thanks - that helps me understand the commercial side. Let me ask about what you're actually trying to build..."**

Then move into the Discovery Questions section below.

---

## Discovery Questions

> Fill in answer spaces during or after the meeting.
> [FLOOR] sections are always included. [RESEARCH-GENERATED] sections scale with research depth - no ceiling.

---

### Business Context and Pain [FLOOR]

**Q: {Hypothesis-led question - use a specific pain point from research, not a generic one.}**
*Why: confirms the root cause and sizes the urgency before discussing features*
Answer: _______________

**Q: What are they currently using to handle this - manual process, spreadsheet, or an existing system?**
*Why: establishes the baseline and surfaces what must be replaced or preserved*
Answer: _______________

**Q: What is the cost of not solving this - operational, financial, or reputational?**
*Why: determines priority and budget justification*
Answer: _______________

**Q: Who is championing this project internally, and who has signed off on budget?**
*Why: identifies the real decision-maker and confirms what the Call Agenda surfaced*
Answer: _______________

---

### {Process Flow Name} [RESEARCH-GENERATED]

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

<!-- After the 4 core questions, generate follow-up questions specific to how this flow operates in this domain.
     Cover: scenarios, edge cases, failure modes, role structures, approval chains, data handoffs, compliance touchpoints.
     No fixed count. Follow the thread. -->

{research and salesperson-driven follow-up questions with Answer: _______________ spaces}

---

> Repeat the above block for each flow identified in Step 2C research.

---

### Compliance: {Requirement Name} [RESEARCH-TRIGGERED]

<!-- Include one block per named compliance requirement found in Step 2A research (HIPAA, GDPR, ISO 27001, etc.)
     Omit entirely if no named compliance requirements were found. -->

**Q: {Specific question derived from this compliance requirement}**
*Why: {specific compliance rationale}*
Answer: _______________

**Q: {Follow-up on enforcement, reporting obligation, or audit trail requirement}**
*Why: compliance gaps are the most expensive to fix post-launch*
Answer: _______________

---

### Scope Boundaries [FLOOR]

**Q: Of the standard modules for this type of system - {list from research} - which are in scope for Phase 1?**
*Why: locks the build scope before proposals are written*
Answer: _______________

**Q: What is explicitly out of scope or deferred to a later phase?**
*Why: prevents scope creep from undocumented assumptions*
Answer: _______________

---

### Integrations and Existing Systems [FLOOR]

**Q: Of the common integration points for this type of system - {list from research} - which apply here?**
*Why: integration complexity is often underestimated at scoping*
Answer: _______________

**Q: Are there existing systems that must be kept, replaced, or connected?**
*Why: identifies data migration scope and third-party dependencies*
Answer: _______________

**Q: What does the data flow look like - live sync, batch export, or manual transfer?**
*Why: determines integration architecture and timeline impact*
Answer: _______________

---

### Constraints [FLOOR]

**Q: Is there a hard deadline or preferred launch window?**
Answer: _______________

**Q: What is the budget range for this project?**
Answer: _______________

**Q: Are there technology requirements or restrictions - specific stack, hosting, or vendor preferences?**
Answer: _______________

**Q: Who maintains this system after launch - the client's team or ongoing support from Syntactics?**
Answer: _______________

---

## Deal Health

> Fill in before the call ends. Do not leave the meeting without completing this block.
> This block gates whether you proceed to requirement-analyzer.

**Budget signal confirmed:** _______________
*(confirmed range / mentioned a number / vague / unknown)*

**Decision-maker in the room:** _______________
*(yes / no - if no: who is the decision-maker and what is the path to them?)*

**Timeline urgency:** _______________
*(hard deadline and what it is / target date / no urgency / exploring)*

**Competitive situation:** _______________
*(sole vendor / evaluating others - list who / unknown)*

**Deal health update:** _______________
*(Green / Yellow / Red - one-line reason)*

**Next step agreed on the call:** _______________
*(what did the client commit to, and by when?)*

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

If Deal Health is Red after the call, reassess before proceeding to requirement-analyzer.
