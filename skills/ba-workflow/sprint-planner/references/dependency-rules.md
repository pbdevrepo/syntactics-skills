# Dependency Rules Reference

Rules for sequencing tasks, deriving tasks from the DB schema, and resolving build order.

---

## The Standard Build Order

Always follow this priority sequence. Never put a higher-priority task after a lower-priority one.

### Priority 1 — DB Migrations, Models & Seeders
**Why first:** Every feature depends on tables existing. No code can run without the schema.

Tasks generated for every table:
- `[BE] Create migration for {table_name}` — one per table
- `[BE] Create Eloquent model + relationships for {table_name}` — only if table has FK columns
- `[BE] Create seeder for {table_name}` — only for lookup/config tables (roles, statuses, categories, permissions)

**Migration order within P1 — parent before child:**
- Scan all tables for FK columns (`{table}_id`)
- The referenced table must have its migration task appear before the FK table
- Example: `users` references `roles` → `roles` migration first, then `users`
- Pivot/junction tables come after both tables they join

**Seeder threshold:** Only for tables that need pre-populated data before the app can function. Do not create seeders for transactional tables (orders, invoices, logs, etc.).

---

### Priority 2 — Authentication & RBAC
**Why second:** Every protected module depends on auth and middleware existing before its routes can be built or tested.

Always generate these tasks when auth-related tables are in the schema (`users`, `roles`, `permissions`, `sessions`, `personal_access_tokens`):

- `[BE] Implement authentication — login, logout, session/token management`
- `[BE] Implement forgot password + reset password flow`
- `[BE] Implement role-based access control — middleware, gates, policies`
- `[FE] Build Login Page`
- `[FE] Build Forgot Password Page`
- `[FE] Build Reset Password Page`

If the schema has a `permissions` or `role_permission` table, add:
- `[BE] Seed roles and permissions`

---

### Priority 3 — Core Entity Modules
**Why third:** These are the primary data entities the rest of the system reads from. Dependent modules (P4) cannot function without this data existing.

**A table is a core entity if:**
- Other tables have FK columns pointing to it
- It manages the primary business objects (users beyond auth, products, customers, projects, properties, courses, etc.)
- It appears frequently in FK relationships across the schema

**Tasks per core entity:**
- `[BE] Implement GET /api/{entities} — list with pagination and search filters`
- `[BE] Implement GET /api/{entities}/{id} — single record detail`
- `[BE] Implement POST /api/{entities} — create with server-side validation`
- `[BE] Implement PUT /api/{entities}/{id} — update with server-side validation`
- `[BE] Implement DELETE /api/{entities}/{id} — soft delete if deleted_at column exists`
- `[FE] Build {Entity} List Page`
- `[FE] Build {Entity} Create/Edit Form`
- `[FE] Implement client-side validation for {Entity} form`

Skip DELETE task if the table has no `deleted_at` column and no FK children — check the schema.

---

### Priority 4 — Dependent Feature Modules
**Why fourth:** These modules read from or write to core entities and can only be built after core data exists.

**A table is dependent if:**
- Its FK columns point to a P3 core entity table
- It is a child record (e.g., `order_items` depends on `orders`)
- It adds functionality to a core entity (e.g., `user_activity_logs` depends on `users`)

Same task pattern as P3 — adjust for whether the module is read-heavy, write-heavy, or both.

---

### Priority 5 — Reporting, Exports & Notifications
**Why fifth:** These features aggregate or react to data from all other modules.

Generate these tasks if identified in the intake doc or implied by audit/history tables:
- `[BE] Implement {report name} data aggregation endpoint`
- `[BE] Implement {format} export for {module}` (PDF, CSV, Excel)
- `[FE] Build export/download trigger UI for {module}`
- `[BE] Implement email notification — {trigger event}`
- `[BE] Implement in-app notification — {trigger event}`
- `[BE] Configure scheduled job — {job name and frequency}`

---

### Priority 6 — QA Preparation
**Why last:** Setup tasks for handing off to UAT. Always generate these regardless of project.

Standard tasks (always include):
- `[BE] Set up staging environment and seed test data`
- `[BE] Create Postman/API collection for all endpoints`
- `[FE] Cross-browser and responsive UI verification`
- `[BE] RBAC access restriction verification — all roles`

---

## DB Schema → Task Derivation Quick Reference

| Table Type | Tasks |
|------------|-------|
| Any table | `[BE]` migration |
| Any table with FKs | `[BE]` Eloquent model + relationships |
| Lookup / config table | `[BE]` seeder |
| Auth tables (users, roles, permissions) | Full P2 auth task set |
| Core entity | Full P3 CRUD task set (BE + FE) |
| Dependent/child entity | Full P4 CRUD task set (BE + FE) |
| Junction/pivot table | No standalone tasks — covered by parent module tasks |
| Audit/history table | `[BE]` trigger or logging implementation task |
| Table with `deleted_at` | Soft-delete tasks included in parent CRUD tasks |

---

## Dependency Patterns

- Auth (P2) gates every protected module — every core entity and dependent feature task depends on the RBAC task
- Core entity migration (P1) gates every BE task that writes to that table
- BE endpoint task gates its FE page task — FE depends on the API existing
- Model task depends on migration task for same table
- Junction table migration depends on both parent table migrations

---

## Task Naming Conventions

| Work type | Verb | Example |
|-----------|------|---------|
| DB migration | `Create migration for` | `Create migration for orders` |
| Eloquent model | `Create Eloquent model + relationships for` | `Create Eloquent model + relationships for orders` |
| Seeder | `Create seeder for` | `Create seeder for roles` |
| API endpoint / logic | `Implement` | `Implement GET /api/orders with pagination` |
| Page / screen build | `Build` | `Build Order List Page` |
| Form | `Build` | `Build Order Create/Edit Form` |
| Validation | `Implement validation for` | `Implement server-side validation for Order form` |
| Auth / middleware | `Implement` | `Implement role-based access control` |
| Export / report | `Implement` (BE) / `Build export UI for` (FE) | `Implement PDF export for orders` |

**Naming rules:**
- Backticks for table names: `` `orders` ``, `` `users` ``
- Include HTTP method for API tasks: `GET /api/orders`, `POST /api/users`
- Reference module name in task suffix: `— Order Management`
- Use "Implement" for backend logic; "Build" for frontend UI; "Create" for migrations/models/seeders