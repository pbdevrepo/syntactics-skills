# Question Bank — Proposal Grill

Targeted questions for stress-testing requirements before proposal writing.
Always ask in context of a specific module or item in the requirements doc.

---

## Missed Modules

- Does the system need user authentication? If yes, is it listed as a module?
- Is there a role-based access control (RBAC) requirement? Is it listed?
- Do any modules generate notifications (email, SMS, in-app)? Is a Notification module listed?
- Does any user action need to be tracked for audit purposes? Is an Audit Log listed?
- Do users need to upload or manage files/documents anywhere in the system? Is a File Management module listed?
- Does any process require approval before completing? Is a Workflow/Approval module listed?
- Is there a need for a settings or configuration panel for admins? Is it listed?
- Does [module] imply a reporting or export feature not yet listed?

---

## Ambiguous Scope

- [Module X] is marked Ambiguous — what specific actions can a user take inside it?
- What does "manage [entity]" mean — create, read, update, and delete, or a subset?
- Is [inferred module] confirmed in scope for this version, or deferred?
- Does [module] show a list view, a detail view, or both?
- Are there search, filter, or sort requirements for [module]?
- Does [module] have a public-facing view or is it internal only?
- Is [feature] a one-time setup or something users interact with regularly?

---

## Integrations

- Does [module] need data from any external system to function?
- Is there a payment step anywhere in the workflow — if so, which gateway?
- Do notifications need to go through a specific provider (SendGrid, Twilio, etc.)?
- Does any data need to sync to or from an accounting or ERP system?
- Are there any file storage requirements (S3, Google Drive, local server)?
- Does the system need to authenticate users via a third-party (Google, Facebook, SSO)?
- Is there a need for a calendar or scheduling integration?

---

## Business Rules

- What happens when [key action] is rejected or fails?
- Is there a time limit or expiry on [entity/record]?
- Are there automated status changes (e.g., auto-close after 30 days)?
- What is the escalation path if [role] does not act within [timeframe]?
- Are there any uniqueness constraints (e.g., one active record per client)?
- What fields are required vs. optional in [module]?
- Can [entity] be deleted, or only archived/deactivated?

---

## Role Completeness

- Who owns [module] — which role is the primary actor?
- Can [role] view [module], or only [other role]?
- Is there a distinction between read-only and edit access within [role]?
- Who has permission to approve/reject in [workflow module]?
- Is there a Super Admin role with unrestricted access, or is everything role-scoped?
- Can permissions be customized per user, or are they fixed per role?
