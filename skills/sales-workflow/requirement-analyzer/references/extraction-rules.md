# Extraction Rules — Requirement Analyzer

Rules for extracting modules and requirements from unstructured client input.

---

## What Counts as a Module

A module is any discrete area of functionality that can be independently designed, built, and tested.

Extract a module when the client mentions:
- A named feature ("dashboard", "reports", "notifications")
- A user action that implies a screen ("upload documents", "approve requests", "track orders")
- A role that implies a dedicated view ("admin panel", "client portal", "staff access")
- A third-party integration ("connect to QuickBooks", "send via Twilio", "sync with Google Calendar")

---

## Implied Modules — Always Extract

Even if not named, extract these when implied:

| Client Says | Extract Module |
|-------------|---------------|
| "users can log in" | User Authentication |
| "admin can manage users" | User Management |
| "clients can see their data" | Client Portal / Dashboard |
| "send email notifications" | Notification System |
| "generate reports" | Reporting & Exports |
| "track history / audit" | Audit Log |
| "upload files / documents" | File Upload / Document Management |
| "approve / reject requests" | Workflow / Approval System |
| "roles and permissions" | Role-Based Access Control (RBAC) |

---

## User Roles — Always Extract

List every role that will interact with the system. Common roles to watch for:
- Admin / Super Admin
- Staff / Employee
- Manager / Supervisor
- Client / Customer / End User
- Guest / Public

If a role is implied (e.g., "the admin can do everything") but not named, infer it and mark as `Inferred`.

---

## Integrations — Always Extract

Flag any mention of:
- Payment gateways (Stripe, PayPal, PayMongo)
- Communication (Twilio SMS, SendGrid, Mailchimp)
- Accounting (QuickBooks, Xero)
- Cloud storage (AWS S3, Google Drive, Dropbox)
- Calendar / scheduling (Google Calendar, Calendly)
- CRM / ERP systems
- APIs from other internal systems

---

## Confidence Levels

| Level | When to Use |
|-------|-------------|
| `Clear` | Client explicitly described the feature with enough detail to scope it |
| `Inferred` | Feature is implied by context but not named or described |
| `Ambiguous` | Feature is mentioned but scope, behavior, or ownership is unclear |

Default to `Ambiguous` when in doubt — better to flag and clarify than to assume.

---

## What NOT to Extract

- Implementation details (technology choices, hosting preferences) — note as constraints, not modules
- Design preferences ("make it look modern") — note separately
- Vague wishes ("make it easy to use") — not a module
