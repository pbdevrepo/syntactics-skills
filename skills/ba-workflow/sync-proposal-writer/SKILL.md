---
name: sync-proposal-writer
version: 1.5.0
description: >
  Writes a client-facing project proposal at Syntactics Inc. from a grilled intake document.
  Trigger when a BA or Sales team member says "write the proposal", "generate the proposal",
  "create the project proposal", or after proposal-grill completes. Also handles proposal revisions
  when triggered by sync-proposal-revision. Produces a professional, client-ready proposal .md file
  with automatic version numbering. Always run after proposal-grill and before quotation.
---

# Proposal Writer

Read the grilled intake document. Write a professional, client-facing project proposal. Do not estimate hours - that belongs in the quotation. Focus on clarity, completeness, and scope the client understands.

Detect existing proposals and write the next version automatically.

Workflow: **project-intake -> proposal-grill -> proposal-writer -> quotation**
Revision workflow: **proposal-revision -> proposal-writer -> quotation**

---

## Before You Start

1. Determine the intake source and proposal version:
   - Check `docs/sales/` for existing `{project-name}-proposal.md` and any `{project-name}-proposal-v*.md` files.
   - If no proposal exists yet: intake source is `docs/ba/{project-name}-intake.md`, output will be `docs/sales/{project-name}-proposal.md`, version label is `1.0`.
   - If a proposal already exists: find the highest existing version (v2, v3, etc.), use the matching intake file (`docs/ba/{project-name}-intake-v{N}.md`) as the source, and write `docs/sales/{project-name}-proposal-v{N+1}.md` with version label `{N+1}.0`.
2. Read the intake document - scope depends on run type:
   - **First proposal (no prior proposal exists):** Read the full intake document.
   - **Revision (prior proposal exists):** Read only the Revision History section and the modules listed in the delta (`Added` and `Updated` entries only). Copy unchanged module sections verbatim from the prior proposal file.
3. Do not write the proposal until all `Ambiguous` and `Inferred` modules are resolved. If any remain, stop - flag them and wait for resolution before proceeding.

---

## Writing Rules

- **Client-facing language.** No technical jargon unless the client is explicitly technical. Use business terms throughout.
- **Confident scope.** State what is included. State what is excluded. No hedging.
- **Module-by-module.** Each module gets its own section (H3) with a 1-3 sentence description and a User Roles line. Within each module, every distinct screen, flow, or feature gets its own sub-section (H4) with a 1-2 sentence description. Under each sub-feature, list UI elements (fields, buttons, links) as plain-noun bullets. If a sub-feature contains multiple named forms or screens, bold the form name before its element list. Keep language plain - no technical jargon unless the client is explicitly technical.
- **No estimates in the proposal.** Hour estimates belong in the quotation - keep them out of this document entirely.
- **No implementation details.** The proposal covers what will be built, not how. Framework choices, programming languages, and internal architecture do not belong here. Exception: the Recommended Deployment Stack section (Section 5) is explicitly client-facing - it describes infrastructure in business terms (hosting tier, managed services, environments), not code-level choices.
- **Revision context.** When writing a revision, include a brief "Revision Summary" section immediately after the cover noting what changed from the prior version, sourced from the delta in the intake file.
- **Surface hard-to-reverse decisions in Assumptions.** Any scope boundary that was a genuine trade-off during grilling - and that would surprise a reader who didn't attend that conversation - must appear in the Assumptions section with a one-line rationale. Do not bury these in module descriptions.

---

## Workflow

### Step 1 - Check for Unresolved Items

Before writing, scan for:
- Any module still marked `Ambiguous` - stop and flag
- Any Open Question in Section 10 of the intake doc - stop and ask if it blocks the proposal

If all items are resolved, update the intake doc **Status:** from `Grilled` to `Approved`, then proceed to Step 2.

### Step 1b - Infer the Recommended Deployment Stack

Before drafting, read the Deployment Constraints block from the grilled intake doc (appended after Section 11). Derive the stack recommendation using the following logic:

**Scale signal -> hosting tier:**
- No stated scale or < 100 concurrent users: single managed VPS (DigitalOcean, Hetzner, Linode, or AWS Lightsail)
- 100-1,000 concurrent users: app platform or auto-scaling VPS tier (DigitalOcean App Platform, AWS Elastic Beanstalk, Railway, Render)
- 1,000+ concurrent users or high data volume: cloud-native with load balancing (AWS, GCP, or Azure standard tier)

**Compliance signal -> provider constraint:**
- HIPAA requirement: AWS (with BAA), Azure, or Google Cloud (all offer Business Associate Agreements); dedicated server if on-premise required
- GDPR / EU data residency: EU-region deployment mandatory; flag provider options with EU data centers
- Local data residency law: restrict to providers with in-country nodes; call this out explicitly as a constraint in the proposal
- No compliance requirement: no restriction

**Budget tier signal -> cost posture:**
- Startup / SMB: prefer cost-optimized providers (DigitalOcean, Hetzner, Render); avoid over-provisioned managed services
- Mid-market: AWS / GCP / Azure standard tiers; managed database services (RDS, Cloud SQL)
- Enterprise: managed cloud with SLA guarantees; dedicated support tier; disaster recovery in scope

**Client infrastructure preference:**
- Client has existing provider account: default to that provider unless a compliance or scale constraint overrides it
- Client has no preference: recommend the most cost-effective option for their scale and compliance tier
- Client has in-house DevOps: recommend standard VPS or IaaS; avoid fully-managed PaaS unless they prefer it
- Client has no technical team: recommend fully-managed PaaS or app platform to minimize operational overhead

**File storage signal:**
- File upload module in scope: add object storage (AWS S3, DigitalOcean Spaces, Google Cloud Storage)
- No file upload module: omit storage line

**Environments:**
Always include Staging and Production as minimum. Add Development only if the client's team will use it directly.

If deployment constraints block says "No constraints stated - standard recommendation applies": apply scale-signal logic using module count and inferred user type (internal tool vs. public-facing) as proxies. State the assumption explicitly in the rationale.

### Step 2 - Draft the Proposal

Follow `references/template-structure.md` exactly. Use the resolved version label and file path from "Before You Start".

Structure:
1. Cover / Introduction
2. Revision Summary (only for v2 and above - summarize delta from prior version)
3. Project Overview
4. Objectives
5. Scope of Work - one section per module
6. Recommended Deployment Stack
7. Out of Scope
8. Assumptions
9. Deliverables
10. Next Steps

### Step 3 - Self-Review Before Delivering

- [ ] Every module from the intake doc is represented in Scope of Work
- [ ] Each module contains H4 sub-feature sections for every distinct screen or flow
- [ ] Each sub-feature lists its UI elements as bullets
- [ ] Recommended Deployment Stack section is present and derives from the grilled constraints (or states the assumption used if no constraints were given)
- [ ] Deployment stack rationale is in business terms - no framework names, no code-level details
- [ ] Out of Scope section explicitly names deferred or excluded items
- [ ] No hour estimates appear anywhere in the document
- [ ] No implementation technology names unless client-specified (deployment stack section is the only exception)
- [ ] Language is professional and client-appropriate throughout
- [ ] Assumptions section covers all hard-to-reverse scope decisions made during grilling
- [ ] Version label in the cover matches the file version (e.g. file is `proposal-v2.md` -> cover says `Version: 2.0`)
- [ ] Revision Summary present and accurate (for v2 and above only)

### Step 4 - Deliver

Write file using the versioned path resolved in "Before You Start":
- First proposal: `docs/sales/{project-name}-proposal.md`
- Revisions: `docs/sales/{project-name}-proposal-v{N}.md`

State the file path, then say:

```
Proposal v{N} ready for client review.

Next: quotation - pass {project-name}-proposal[-v{N}].md to generate the itemized quotation with hour estimates.
```

---

## Reference Files

- `references/template-structure.md` - Full proposal template with section-by-section guidance
