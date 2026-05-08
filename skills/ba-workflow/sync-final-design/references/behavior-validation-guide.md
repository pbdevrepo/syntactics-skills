# Behavior & Validation Guide — System Behavior / System Validations / Access Validations / Activity Logs

Use this guide to fill the four behavioral fields in every spec table. Work through the relevant checklist for each module. Ask the user targeted questions for any item you cannot infer. Use `- Pending` only for items that are genuinely unresolvable during the session.

---

## System Behavior Checklist

Cover every item that applies to the module:

- **Page / Screen Load**
  - What data is fetched on load? Which tables? Any filters or defaults?
  - What does the UI show while loading? (spinner, skeleton, cached data)
  - What is the empty state when there is no data?

- **Happy Path — User Actions**
  - What does the user do? (fill form, click button, select item, upload file)
  - What does the system do immediately after each action? (validate, show confirmation, call API)
  - What does the user see on success? (toast, modal, redirect to list/detail, record updated in-place)

- **Error / Failure States**
  - What happens when a required field is blank on submit?
  - What happens when the server returns an error (network failure, duplicate, foreign key violation)?
  - What does the user see? (inline error, banner, modal)

- **Conditional UI**
  - Are any buttons, fields, tabs, or sections shown/hidden based on user role?
  - Are any elements shown/hidden based on record status or data values?
  - Does the UI differ for create vs. edit mode?

- **Navigation & Redirects**
  - Where is the user taken after a successful create / update / delete?
  - Is there a cancel button? Where does it go?
  - Are there breadcrumbs or back-navigation requirements?

- **Real-time / Async**
  - Does the module use live search, auto-complete, or polling?
  - Are there background processes the user needs feedback on?

---

## System Validations Checklist

For every input field or business operation, state:

- **Required fields** — list each field that cannot be blank
- **Format rules**
  - Email: valid format (RFC 5322)
  - Phone: digits only, length, optional country prefix
  - Dates: format (YYYY-MM-DD), not in the past, not before another date field
  - Numbers: min/max value, decimal precision, positive only
  - Text: min/max character length, allowed characters
- **Uniqueness constraints** — fields that must be unique (per record, per user, globally)
- **Business rules**
  - Date ordering (e.g., `end_date` must be after `start_date`)
  - Status transitions (e.g., can only move from `draft` → `submitted`, not `approved` → `draft`)
  - Amount bounds (e.g., quantity must be > 0, discount ≤ 100%)
  - Dependency rules (e.g., cannot delete a category that has active items)
- **Cross-field rules** — fields whose validity depends on another field's value
- **Duplicate prevention** — what combination of fields defines a duplicate?
- **File upload rules** — allowed MIME types, max file size, max count (if applicable)

---

## Access Validations Checklist

State per role who can do what, and what happens on unauthorized access:

| Action | Which role(s) can do it | Unauthorized behavior |
|---|---|---|
| View / read the module | e.g., All authenticated users | Redirect to login or 403 page |
| Create a new record | e.g., Admin, Manager | Hide button; 403 if accessed via URL |
| Edit an existing record | e.g., Owner, Admin | Disable fields; 403 if accessed via URL |
| Delete a record | e.g., Admin only | Hide button; 403 if accessed via URL |
| Export / print | e.g., Manager, Admin | Hide button |

Cover ownership checks too (e.g., "Users can only edit their own records").

---

## Activity Logs Checklist

For each loggable event in the module:

- **Event name** — e.g., `created`, `updated`, `deleted`, `approved`, `exported`
- **Actor** — which field stores who performed the action (`user_id`)
- **Affected record** — which table + record ID
- **Data captured** — what columns are logged (old value → new value for updates)
- **Table that receives the log** — typically `ACTIVITY_LOGS` or `AUDIT_LOGS`

---

## Patterns by Module Type

Use these as starting points — expand or trim per project specifics.

---

### Auth / Login Module

**System Behavior**
- On load: render login form (email + password fields, submit button)
- User submits form: system validates credentials against `USERS` table
- On success: create session, log `last_login_at`, redirect to dashboard
- On failure (wrong password): show inline error "Invalid email or password"
- On 5 consecutive failures: lock account for 15 minutes, show message
- "Forgot password" link: redirect to password reset flow
- Authenticated users who visit `/login`: redirect to dashboard

**System Validations**
- Email: required, valid email format
- Password: required, min 8 characters
- Account must be active (`status = 'active'`) before login is permitted

**Access Validations**
- No authentication required to view the login page
- Authenticated users are redirected away; they cannot re-login without logging out

**Activity Logs**
- Event: `login_success` → logs `user_id`, `ip_address`, `timestamp` into `ACTIVITY_LOGS`
- Event: `login_failed` → logs `email_attempted`, `ip_address`, `timestamp`
- Event: `account_locked` → logs `user_id`, lock reason

---

### CRUD Module (e.g., Product Management)

**System Behavior**
- On load: fetch paginated list of records from `PRODUCTS`; show table with Name, Category, Status, Actions columns
- Empty state: show "No records found" with a Create button
- User clicks Create: open create form (modal or dedicated page)
- User submits create form: system validates → inserts into `PRODUCTS` → shows success toast → refreshes list
- User clicks Edit: pre-populate form with existing record values
- User submits edit form: system validates → updates record → shows success toast → refreshes list
- User clicks Delete: show confirmation dialog "Are you sure?"
- On confirm delete: soft-delete record (`deleted_at` set) → show success toast → remove from list
- On cancel delete: close dialog, no change
- List supports search by name and filter by category/status

**System Validations**
- Name: required, max 100 characters, must be unique within the system
- Category: required, must be a valid foreign key from `CATEGORIES`
- Price: required, numeric, min 0.01, max 2 decimal places
- Status: required, one of `active` | `inactive`
- Description: optional, max 500 characters

**Access Validations**
- View list: all authenticated users
- Create / Edit: Admin and Manager roles only; hide Create/Edit buttons for Viewer role
- Delete: Admin only; hide Delete button for Manager and Viewer; return 403 if accessed via API

**Activity Logs**
- `product_created`: logs `user_id`, `product_id`, full new record snapshot
- `product_updated`: logs `user_id`, `product_id`, changed columns (old → new)
- `product_deleted`: logs `user_id`, `product_id`, `deleted_at`

---

### Dashboard / Report Module

**System Behavior**
- On load: fetch aggregated data from DB and render charts/KPI cards
- Show loading skeleton while data is being fetched
- Date range filter: user selects range → system re-fetches and updates all widgets
- Export button: generate CSV/PDF of current view → trigger download
- Empty state per widget: show "No data for selected period"
- Data auto-refreshes every X minutes (or on manual refresh button)

**System Validations**
- Date range: start date must not be after end date
- Date range: cannot exceed 365 days (or project-specific limit)
- Export: disallow export if result set is empty

**Access Validations**
- View dashboard: all authenticated users
- Export data: Manager and Admin only; hide Export button for Viewer

**Activity Logs**
- `report_exported`: logs `user_id`, `date_range`, `export_format`, `timestamp`

---

### Settings / Configuration Module

**System Behavior**
- On load: fetch current settings from `SETTINGS` and pre-populate all fields
- User edits fields and clicks Save: system validates → updates `SETTINGS` → shows success toast
- Changes take effect immediately system-wide (no restart required)
- Sensitive fields (API keys, passwords): display as masked (`●●●●●●●●`); show/hide toggle

**System Validations**
- All required settings must have a value before saving
- Numeric settings: enforce min/max defined by the business rule per field
- Email fields: valid email format
- URL fields: valid URL format including `https://` prefix

**Access Validations**
- View: Admin only; all other roles receive 403 and see no settings link in nav
- Edit/Save: Admin only

**Activity Logs**
- `settings_updated`: logs `user_id`, changed setting keys (old → new values), `timestamp`

---

### Approval / Workflow Module

**System Behavior**
- On load: show list of pending items assigned to the current user's role for approval
- User clicks Review: open detail view of the submission
- User clicks Approve: system updates record status to `approved`, notifies submitter, logs event
- User clicks Reject: system prompts for rejection reason → updates status to `rejected` → notifies submitter → logs event
- Submitter can resubmit a rejected item after correction; status resets to `pending`
- Approved items are locked; no further edits by submitter

**System Validations**
- Rejection reason: required when rejecting, max 500 characters
- A record cannot be approved/rejected by the same user who submitted it
- Status transition must follow the allowed sequence: `draft → pending → approved | rejected → (if rejected) pending`

**Access Validations**
- Submit for approval: Submitter role
- Approve / Reject: Approver and Admin roles only; Submitter cannot approve own submissions
- View all submissions: Admin only; Approvers see only items pending their review; Submitters see only their own submissions

**Activity Logs**
- `submission_created`: logs `user_id`, `record_id`, `timestamp`
- `submission_approved`: logs `approver_id`, `record_id`, `timestamp`
- `submission_rejected`: logs `approver_id`, `record_id`, `reason`, `timestamp`
- `submission_resubmitted`: logs `user_id`, `record_id`, `timestamp`
