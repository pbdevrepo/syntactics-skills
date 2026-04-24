# Schema Document Output Format

File name: `{project-name}-database-schema.md` (kebab-case, lowercase)

This is the canonical DB reference document passed to sprint-planner and final-design.

---

## Document Structure

```
# [Project Name] — Database Schema

**Prepared by:** Syntactics Database Team
**Date:** [today's date]
**Dialect:** [MySQL 8+ / PostgreSQL 15+]
**ORM:** [Laravel Eloquent / Raw SQL / other]
**PK Strategy:** [BIGINT UNSIGNED AUTO_INCREMENT / BIGSERIAL / UUID]
**Status:** Draft / Approved

---

## Table of Contents

1. [Design Overview](#design-overview)
2. [Entity Relationship Summary](#entity-relationship-summary)
3. [Tables](#tables)
   - [Lookup / Reference Tables](#lookup--reference-tables)
   - [Core Entities](#core-entities)
   - [Junction Tables](#junction-tables)
   - [Audit / Log Tables](#audit--log-tables)
4. [Index Summary](#index-summary)
5. [Design Decisions](#design-decisions)

---

## Design Overview

| | |
|---|---|
| Total tables | X |
| Core entities | X |
| Lookup / reference | X |
| Junction / bridge | X |
| Audit / history | X |
| Soft delete applied to | [table names] |
| Normalization | 3NF throughout; [any deliberate denormalizations noted] |

---

## Entity Relationship Summary

List every relationship in plain text:

- `users` 1──< `orders` (one user has many orders)
- `orders` M──< `order_items` >──M `products` (many-to-many via `order_items`)
- `products` >── `product_categories` (many products belong to one category)

---

## Tables

### Lookup / Reference Tables

---

#### `table_name`
> One-line plain-English description of what this table stores.

| Field Name | Data Type | Length | Default Value | Nullable | Description | Constraints |
|------------|-----------|--------|---------------|----------|-------------|-------------|
| `id` | `BIGINT UNSIGNED` | — | AUTO_INCREMENT | No | Surrogate primary key | PK, AUTO_INCREMENT |
| `name` | `VARCHAR` | 100 | — | No | Display name of the lookup value | NOT NULL, UNIQUE |
| `is_active` | `TINYINT(1)` | — | `1` | No | Whether this lookup value is selectable | NOT NULL |
| `created_at` | `TIMESTAMP` | — | `CURRENT_TIMESTAMP` | No | Row creation timestamp | NOT NULL |
| `updated_at` | `TIMESTAMP` | — | `CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP` | No | Last modification timestamp | NOT NULL |

**Indexes:**
```sql
-- No additional indexes needed beyond PK for small lookup tables
```

---

### Core Entities

---

#### `table_name`
> One-line plain-English description.

| Field Name | Data Type | Length | Default Value | Nullable | Description | Constraints |
|------------|-----------|--------|---------------|----------|-------------|-------------|
| `id` | `BIGINT UNSIGNED` | — | AUTO_INCREMENT | No | Surrogate primary key | PK, AUTO_INCREMENT |
| `[fk_column]_id` | `BIGINT UNSIGNED` | — | — | No | FK to parent entity | FK → `parent_table.id`, ON DELETE RESTRICT, NOT NULL |
| `name` | `VARCHAR` | 255 | — | No | [description] | NOT NULL |
| `status` | `ENUM` | — | `'active'` | No | Current lifecycle state | ENUM(`'active'`,`'inactive'`,`'archived'`), NOT NULL |
| `deleted_at` | `TIMESTAMP` | — | NULL | Yes | Soft-delete marker; NULL = active | — |
| `deleted_by` | `BIGINT UNSIGNED` | — | NULL | Yes | User who deleted; NULL for system actions | FK → `users.id` |
| `created_at` | `TIMESTAMP` | — | `CURRENT_TIMESTAMP` | No | Row creation timestamp | NOT NULL |
| `updated_at` | `TIMESTAMP` | — | `CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP` | No | Last modification timestamp | NOT NULL |

**Indexes:**
```sql
CREATE INDEX idx_{table}_{fk_column}_id ON {table}({fk_column}_id);
CREATE INDEX idx_{table}_active ON {table}(id) WHERE deleted_at IS NULL;
```

---

### Junction Tables

---

#### `table_a_table_b`
> Resolves the M:N relationship between `table_a` and `table_b`.

| Field Name | Data Type | Length | Default Value | Nullable | Description | Constraints |
|------------|-----------|--------|---------------|----------|-------------|-------------|
| `id` | `BIGINT UNSIGNED` | — | AUTO_INCREMENT | No | Surrogate primary key | PK, AUTO_INCREMENT |
| `table_a_id` | `BIGINT UNSIGNED` | — | — | No | FK to table_a | FK → `table_a.id`, ON DELETE CASCADE, NOT NULL |
| `table_b_id` | `BIGINT UNSIGNED` | — | — | No | FK to table_b | FK → `table_b.id`, ON DELETE CASCADE, NOT NULL |
| `created_at` | `TIMESTAMP` | — | `CURRENT_TIMESTAMP` | No | When the association was created | NOT NULL |

**Indexes:**
```sql
CREATE UNIQUE INDEX uq_{table_a}_{table_b} ON {table_a}_{table_b}(table_a_id, table_b_id);
CREATE INDEX idx_{table_a}_{table_b}_b_id ON {table_a}_{table_b}(table_b_id);
```

---

### Audit / Log Tables
> Append-only log of all state changes on `table_name`.

| Field Name | Data Type | Length | Default Value | Nullable | Description | Constraints |
|------------|-----------|--------|---------------|----------|-------------|-------------|
| `id` | `BIGINT UNSIGNED` | — | AUTO_INCREMENT | No | Surrogate primary key | PK, AUTO_INCREMENT |
| `{table}_id` | `BIGINT UNSIGNED` | — | — | No | FK to the parent record | FK → `{table}.id`, ON DELETE RESTRICT, NOT NULL |
| `changed_by` | `BIGINT UNSIGNED` | — | — | No | User who triggered the change | FK → `users.id`, NOT NULL |
| `old_status` | `VARCHAR` | 50 | NULL | Yes | Status before the change | — |
| `new_status` | `VARCHAR` | 50 | — | No | Status after the change | NOT NULL |
| `note` | `TEXT` | — | NULL | Yes | Optional context for the change | — |
| `created_at` | `TIMESTAMP` | — | `CURRENT_TIMESTAMP` | No | When the change occurred | NOT NULL |

**Indexes:**
```sql
CREATE INDEX idx_{table}_log_{table}_id ON {table}_log({table}_id);
```

---

## Index Summary

Consolidated list of all indexes across all tables:

| Table | Index Name | Columns | Type | Purpose |
|-------|------------|---------|------|---------|
| `users` | `idx_users_email` | `email` | UNIQUE | Login lookup |
| `orders` | `idx_orders_user_id` | `user_id` | Standard | FK lookup |
| `orders` | `idx_orders_active` | `id WHERE deleted_at IS NULL` | Partial | Soft-delete filter |

---

## Design Decisions

Document every non-obvious choice:

| Decision | Reason |
|----------|--------|
| UUID on `users.id` | Prevents enumeration of user IDs on public API endpoints |
| Soft delete on `orders` | Orders must be preserved for financial audit trail |
| `order_items.unit_price` denormalized | Price at time of purchase must not change if product price changes |
| `ON DELETE RESTRICT` as default FK behavior | Prevents accidental orphan prevention — deletions must be explicit |
| Append-only `order_history` table | Status transitions must be auditable; overwriting loses history |

---

## Tone Rules

- Table names: always backtick-formatted
- Descriptions: one sentence, active voice, plain English
- No DDL walls — column tables only unless DDL explicitly requested
- Every design decision documented in the Design Decisions section
- Deliberate denormalizations always noted with a reason