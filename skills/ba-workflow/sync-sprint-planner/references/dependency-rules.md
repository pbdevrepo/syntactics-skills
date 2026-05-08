# Dependency Rules Reference

## Standard Build Order

| Priority | Phase | Trigger Condition |
|---|---|---|
| P1 | DB Migrations, Models & Seeders | Always — every table |
| P2 | Authentication & RBAC | Schema has `users`, `roles`, `permissions`, `sessions`, or `personal_access_tokens` |
| P3 | Core Entity Modules | Table is referenced by FK columns in other tables |
| P4 | Dependent Feature Modules | Table has FK columns pointing to a P3 entity |
| P5 | Reporting, Exports & Notifications | Intake doc specifies reports/exports/notifications, or audit tables exist |
| P6 | QA Preparation | Always — every project |

---

## DB Schema → Task Derivation

| Table Type | Tasks Generated |
|---|---|
| Every table | `[BE]` Create migration |
| Every table with FK columns | `[BE]` Create Eloquent model + relationships |
| Lookup / config table (roles, statuses, categories, permissions) | `[BE]` Create seeder |
| Auth tables (users, roles, permissions, sessions) | Full P2 auth task set (see below) |
| Core entity (P3) | Full CRUD task set — BE endpoints + FE pages |
| Dependent entity (P4) | Full CRUD task set — same pattern as P3 |
| Junction / pivot table | No standalone tasks — covered by parent module tasks |
| Audit / history table | `[BE]` trigger or logging implementation task |
| Table with `deleted_at` | Include soft-delete in parent CRUD tasks |

---

## P1 — Migration Order

Scan all FK columns (`{table}_id`). The referenced table's migration must appear before the FK table's migration. Junction tables come after both parent migrations.

---

## P2 — Auth Task Set

Generate when auth-related tables are present:
- `[BE] Implement authentication — login, logout, session/token management`
- `[BE] Implement forgot password + reset password flow`
- `[BE] Implement role-based access control — middleware, gates, policies`
- `[FE] Build Login Page`
- `[FE] Build Forgot Password Page`
- `[FE] Build Reset Password Page`

If `permissions` or `role_permission` table exists, add:
- `[BE] Seed roles and permissions`

---

## P3 / P4 — CRUD Task Set (per entity)

- `[BE] Implement GET /api/{entities} — list with pagination and search filters`
- `[BE] Implement GET /api/{entities}/{id} — single record detail`
- `[BE] Implement POST /api/{entities} — create with server-side validation`
- `[BE] Implement PUT /api/{entities}/{id} — update with server-side validation`
- `[BE] Implement DELETE /api/{entities}/{id} — soft delete if deleted_at exists`
- `[FE] Build {Entity} List Page`
- `[FE] Build {Entity} Create/Edit Form`
- `[FE] Implement client-side validation for {Entity} form`

Skip DELETE task if table has no `deleted_at` and no FK children.

---

## P5 — Reports, Exports, Notifications

Generate per intake doc or audit tables:
- `[BE] Implement {report name} data aggregation endpoint`
- `[BE] Implement {format} export for {module}` (PDF, CSV, Excel)
- `[FE] Build export/download trigger UI for {module}`
- `[BE] Implement email notification — {trigger event}`
- `[BE] Configure scheduled job — {job name and frequency}`

---

## P6 — QA Preparation (always include)

- `[BE] Set up staging environment and seed test data`
- `[BE] Create Postman/API collection for all endpoints`
- `[FE] Cross-browser and responsive UI verification`
- `[BE] RBAC access restriction verification — all roles`

---

## Dependency Patterns

- Auth (P2) gates every protected module — every P3/P4 task depends on the RBAC task
- Core entity migration (P1) gates every BE task that writes to that table
- BE endpoint task gates its FE page task — FE depends on the API existing
- Model task depends on migration task for the same table
- Junction table migration depends on both parent table migrations

---

## Task Naming

| Work type | Verb | Example |
|---|---|---|
| Migration | `Create migration for` | `Create migration for orders` |
| Eloquent model | `Create Eloquent model + relationships for` | `Create Eloquent model + relationships for orders` |
| Seeder | `Create seeder for` | `Create seeder for roles` |
| API endpoint | `Implement` | `Implement GET /api/orders with pagination` |
| Page / screen | `Build` | `Build Order List Page` |
| Form | `Build` | `Build Order Create/Edit Form` |
| Auth / middleware | `Implement` | `Implement role-based access control` |
| Export (BE) | `Implement` | `Implement PDF export for orders` |
| Export (FE) | `Build export UI for` | `Build export UI for Order module` |

Rules: use backticks for table names · include HTTP method for API tasks · suffix task with module name (e.g., `— Order Management`)
