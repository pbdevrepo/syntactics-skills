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
For fields with multiple entries (System Behavior, Validations, etc.), use line breaks within the cell:

```markdown
| **System Behavior** | - User clicks login button<br>- System validates credentials<br>- On success, redirect to dashboard |
```

### Design Sequence
List each step as a numbered sub-item:
```markdown
| **Design Sequence** | 1. User opens the module<br>2. System loads data<br>3. User interacts |
```

### Change Log (post-approval updates)
When the document has been approved and changes are made, mark updates inline:
```markdown
| **Change Log** | - 🔴 [UPDATED: 2025-10-01 — by: Juan — approved by: Client] Description changed from X to Y |
```

### Tables To Use
Use **UPPERCASE BOLD** for table names, ***bold italic*** for column names per DB standards:

```markdown
| Insert Into | Update | Source | Dependent |
|---|---|---|---|
| **USERS** | **USERS** | **ROLES**, **PERMISSIONS** | **ACTIVITY_LOGS** |
```

If tables are not yet finalized, use `TBD` and note it in Change Log.

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

---

## File Naming

`{system-name}-final-design.md` — kebab-case, lowercase

Examples:
- `lundgreens-final-design.md`
- `quotation-app-final-design.md`