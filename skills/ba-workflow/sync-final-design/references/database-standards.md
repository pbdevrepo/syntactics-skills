# Database Standards Reference

These standards apply to the **"Tables To Use"** rows in every spec table and to any Database Tables section in the FDD.

---

## Naming Conventions

> Stack: Laravel/Eloquent + MySQL. These conventions match `database-administrator` skill Laravel overrides.

| Element | Convention | Example |
|---|---|---|
| Table names | `snake_case`, **plural** (Eloquent default) | `user_accounts`, `orders` |
| Column names | `snake_case` | `created_at`, `user_id` |
| Pivot tables | singular of both, alphabetical order, joined by `_` | `order_product` (not `product_order`) |
| Primary key | always `id` | `id` |
| Foreign keys | `{singular_table_name}_id` | `user_id`, `order_id` |

---

## Keys & Relationships

- Every table must have a primary key (auto-increment `bigserial` or `uuid`)
- Use foreign keys to enforce parent-child relationships
- Many-to-many relationships use pivot/junction tables with composite keys

---

## Timestamps & Soft Deletes

All tables must include Laravel standard fields:
- `created_at`
- `updated_at`
- `deleted_at` — for soft deletes (using `softDeletes()` in migrations)

---

## Final Design Document Formatting

When listing tables in the spec table "Tables To Use" rows:

- **Table names** → CAPITALIZED and **bold** → e.g., **RECEIVABLES**, **USER_COMPANY**
- **Column names** → lowercase, ***bold italic*** → e.g., ***user_id***, ***order_id***

### "Tables To Use" Sub-columns Explained

| Sub-column | Meaning |
|---|---|
| **Insert Into** | Tables that receive new records when this module performs a create operation |
| **Update** | Tables whose records are modified by this module |
| **Source** | Tables that this module reads from (SELECT queries, dropdowns, lookups) |
| **Dependent** | Tables that depend on data from this module (child tables, related entities that cascade) |

---

## Common Patterns

**Auth/Login module:**
- Insert Into: `USER_SESSIONS`
- Update: `USERS` (last_login_at)
- Source: `USERS`, `ROLES`
- Dependent: `ACTIVITY_LOGS`

**CRUD module (e.g., product management):**
- Insert Into: `PRODUCTS`
- Update: `PRODUCTS`
- Source: `CATEGORIES`, `USERS`
- Dependent: `ORDER_ITEMS`, `INVENTORY`

If tables are not yet finalized at design time, enter `TBD` and flag it in the Change Log.