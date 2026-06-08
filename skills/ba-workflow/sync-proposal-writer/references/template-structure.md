# Proposal Template Structure

File: `docs/sales/{project-name}-proposal.md`

---

```markdown
# Project Proposal - {Project Name}

**Prepared for:** {Client Name}
**Prepared by:** Syntactics Inc.
**Date:** {YYYY-MM-DD}
**Version:** {proposal-version}

---

## Revision Summary *(include only for v2 and above - remove this section for the initial proposal)*

This revision incorporates the following client-requested changes from the previous version:

- {Change 1 - e.g., "Added: Reporting module with export functionality"}
- {Change 2 - e.g., "Removed: SMS notification feature (deferred to Phase 2)"}
- {Change 3 - e.g., "Updated: User roles expanded to include Supervisor access"}

---

## 1. Introduction

Syntactics Inc. is pleased to present this proposal for the development of {Project Name}.
This document outlines the scope of work, deliverables, and assumptions for this engagement.

---

## 2. Project Overview

{2-4 sentences summarizing what the system is, who it serves, and the core problem it solves.
Write from the client's perspective - what they will have when the project is done.}

---

## 3. Objectives

The primary objectives of this project are:

- {Objective 1 - e.g., "Provide clients with a self-service portal to submit and track requests"}
- {Objective 2}
- {Objective 3}

---

## 4. Scope of Work

The following modules are included in this engagement:

### 4.1 {Module Name}

{1-3 sentence plain-language description of what this module does and who uses it.}

**User Roles:** {which roles interact with this module}

#### {Sub-feature Name}

{1-2 sentence description of what this sub-feature, screen, or flow does.}

**{Form or Screen Name}** *(omit this bold header if the sub-feature has only one form - list fields directly)*
- {UI element - e.g., "Email field"}
- {UI element - e.g., "Password field"}
- {UI element - e.g., "Login button"}
- {UI element - e.g., "Forgot Password link"}

#### {Next Sub-feature Name}

{1-2 sentence description.}

- {UI element}
- {UI element}

*repeat H4 sub-section for each distinct screen, flow, or feature within the module*

---

### 4.2 {Module Name}

{repeat for each module}

---

## 5. Recommended Deployment Stack

Based on the project scope, expected scale, and infrastructure constraints, Syntactics Inc. recommends the following deployment approach:

| Component | Recommendation |
|-----------|---------------|
| **Hosting** | {Cloud provider + tier - e.g., "Managed cloud VPS (DigitalOcean / AWS / Hetzner)"} |
| **Architecture** | {e.g., "Single-server application with managed database" / "App platform with auto-scaling"} |
| **Database** | {e.g., "Managed PostgreSQL" / "Managed MySQL"} |
| **File Storage** | {e.g., "Object storage (S3 / DigitalOcean Spaces)" - or "Not applicable"} |
| **Environments** | Staging and Production |

**Why this stack:**
{2-3 sentences tying the recommendation to the project's scale, compliance requirements, client infrastructure situation, and budget tier. Example: "This setup supports the expected user load with room to scale vertically without operational complexity. A managed database removes the burden of backups and patching from the client's team."}

**Scalability path:**
{One sentence on what the next infrastructure step looks like if demand grows. Example: "When concurrent users exceed 500, the recommended path is moving to an auto-scaling app platform without requiring an application rewrite."}

> Note: Actual hosting costs are the client's responsibility and are not included in the project quotation. Syntactics Inc. can assist with environment setup and deployment configuration as part of the engagement.

{If no deployment constraints were stated during grilling, include this line:}
> Recommendation based on project scope and inferred usage pattern. Client should confirm or adjust based on existing infrastructure contracts or compliance requirements.

---

## 6. Out of Scope

The following items are explicitly excluded from this engagement:

- {Excluded item 1 - e.g., "Mobile native applications (iOS/Android)"}
- {Excluded item 2}
- {Deferred to Phase 2: [module name]}

---

## 7. Assumptions

This proposal is based on the following assumptions:

- {Assumption 1 - e.g., "Client will provide all content and copy for static pages"}
- {Assumption 2 - e.g., "Third-party API credentials will be provided by the client"}
- {Assumption 3 - e.g., "Design direction will be approved within 5 business days of delivery"}
- {If deployment is Syntactics-managed: "Hosting environment will be provisioned and configured by Syntactics Inc. as part of the engagement"}

---

## 8. Deliverables

Upon completion, Syntactics Inc. will deliver:

- Fully functional {web application / system / platform} with all modules listed in Section 4
- Source code repository access
{if project has a database: - Database schema documentation}
{if project involves users / auth / data entry: - User acceptance testing (UAT) support}
- Deployment to staging and production environments per the recommended stack in Section 5
- {Any additional deliverable specific to this project}

> Note to writer: Remove lines in {} that do not apply. Every deliverable listed must map to something in Section 4 or Section 5 or be explicitly agreed with the client.

---

## 9. Next Steps

To proceed with this project:

1. Review and approve this proposal
2. Review and approve the accompanying quotation
3. Sign the service agreement
4. Kick off the Business Analysis phase

We look forward to working with {Client Name} on this project. Please reach out with any questions.

---

*This proposal is valid for 30 days from the date of issue.*
```
