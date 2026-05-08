# Template Structure Reference — Markdown Format

## Full Document Structure

```
# {COMPANY NAME}
## {SYSTEM NAME}
### {PHASE} Final Design   ← omit this line entirely if no phase

---

## Table of Contents
- [General Instructions](#general-instructions)
- [{Module Name}](#{anchor})
- ...

---

## General Instructions

**For Design Reference:** {figma_link}

The following instructions provide guidelines to ensure consistency, clarity, and alignment throughout the system design and implementation. These should be applied across all modules, processes, and deliverables to maintain uniform standards and support seamless integration.

1. {instruction 1}
2. {instruction 2}
...

---

{repeat spec table block for each module}
```

---

## Spec Table Block (per module)

Render each module as a markdown table. Use this exact structure — do not add, remove, or reorder rows.

~~~markdown
---

### {Module Name}

| Field | Details |
|---|---|
| **Name of Module** | {module name} |
| **Type** | {Web Application \| Mobile Application \| Admin Dashboard} |
| **Category** | {e.g., Setup & Configuration, Authentication, User Management} |
| **Menu** | {menu path where module is accessed} |
| **Design Sequence** | 1. {step} |
| **Description** | {short explanation of what the module does} |
| **Change Log** | - [date-requestedby] |
| **System Behavior** | - Pending |
| **Output / Print-out** | - |
| **System Validations** | - Pending |
| **Access Validations** | - Pending |
| **Activity Logs** | - Pending |

**Tables To Use**

| Insert Into | Update | Source | Dependent |
|---|---|---|---|
| | | | |

**Wireframe Design**

[wireframe image here]
~~~

---

## Field Rules

### Multi-line fields
For fields with multiple entries (System Behavior, Validations, etc.), use line breaks within the cell.

These fields should be **fully populated** — not left as Pending unless a detail is genuinely unresolvable. Use `references/behavior-validation-guide.md` to work through every user case per module.

**Expected density example — CRUD module (Product Management):**

```markdown
| **System Behavior** | - On load: fetch paginated product list; show Name, Category, Status, Actions columns<br>- Empty state: show "No records found" with Create button<br>- Create: open form → validate → insert into PRODUCTS → success toast → refresh list<br>- Edit: pre-populate form → validate → update record → success toast → refresh list<br>- Delete: show confirmation dialog → on confirm, soft-delete (deleted_at) → success toast → remove from list<br>- List supports search by name and filter by category/status<br>- Cancel on create/edit: discard changes and return to list |
| **System Validations** | - Name: required, max 100 characters, must be unique system-wide<br>- Category: required, must be a valid foreign key from CATEGORIES<br>- Price: required, numeric, min 0.01, max 2 decimal places<br>- Status: required, one of active or inactive<br>- Description: optional, max 500 characters<br>- Duplicate: block save if a product with the same name already exists |
| **Access Validations** | - View list: all authenticated users<br>- Create / Edit: Admin and Manager only; hide buttons for Viewer role<br>- Delete: Admin only; hide button for Manager and Viewer; return 403 if accessed via direct URL |
| **Activity Logs** | - product_created: logs user_id, product_id, full record snapshot<br>- product_updated: logs user_id, product_id, changed columns (old → new)<br>- product_deleted: logs user_id, product_id, deleted_at |
```

### Design Sequence
List each step as a numbered sub-item:
```markdown
| **Design Sequence** | 1. User opens the module<br>2. System loads data<br>3. User interacts |
```

### Change Log (post-approval updates)
```markdown
| **Change Log** | - 🔴 [UPDATED: 2025-10-01 — by: Juan — approved by: Client] Description changed from X to Y |
```

### Type Field — Valid Values Only
- `Web Application`
- `Mobile Application`
- `Admin Dashboard`

### Category — Common Values (use project-appropriate ones)
- `Setup & Configuration`
- `Authentication`
- `Content Management`
- `User Management`
- `Reporting`
- `Notifications`

