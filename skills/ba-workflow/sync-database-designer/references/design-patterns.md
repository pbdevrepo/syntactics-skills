# Design Patterns Reference

Supporting patterns for UUID strategy, junction tables, indexing, naming, anti-patterns, ERD format, dialect types, ORM FK conventions, and transaction examples.

---

## UUID vs SERIAL Guide

| Scenario | Recommended PK | Reason |
|---|---|---|
| Single-database app, internal IDs only | `BIGSERIAL` | Simpler, faster inserts, smaller index |
| Distributed systems, multi-tenant, microservices | `UUID` | No coordination needed; globally unique |
| Public-facing resource IDs (URLs, API) | `UUID` | Prevents enumeration attacks |
| High-insert append tables (logs, events) | `BIGSERIAL` | Sequential IDs avoid index fragmentation |
| Replication or merge scenarios | `UUID` | Avoids PK collisions on merge |

PostgreSQL: `id UUID PRIMARY KEY DEFAULT gen_random_uuid()`
MySQL: `id CHAR(36) PRIMARY KEY DEFAULT (UUID())`

---

## Junction Table Guide

Every M:N relationship resolves to a junction table. Rules:

1. **Give it its own surrogate PK** unless the junction has no metadata and is never referenced by other tables.
2. **Always add:** `created_at TIMESTAMPTZ NOT NULL DEFAULT now()`
3. **Add `created_by`** (FK → `user.id`) if the association is user-initiated.
4. **Add a `role` or `type` column** when the relationship has a classification (e.g., `team_member.role`).
5. **Unique constraint on the natural key** even when a surrogate PK exists: `UNIQUE (entity_a_id, entity_b_id)`.
6. **Index both FK columns individually** — the unique constraint covers one direction; add a separate index for the reverse lookup.

---

## Indexing Strategy

| Pattern | When to use |
|---|---|
| **Single-column FK index** | Every FK column, always |
| **Composite index** | Queries filtering on multiple columns — highest-cardinality or equality column first |
| **Covering index** | Read-heavy queries where the index can satisfy the query without a table lookup: `CREATE INDEX ON order(customer_id) INCLUDE (status, created_at)` |
| **Partial index** | Soft-delete tables, status filters: `WHERE deleted_at IS NULL`, `WHERE status = 'active'` |
| **Expression index** | Queries on computed values: `CREATE INDEX ON user(lower(email))` |
| **Avoid over-indexing** | Every index slows writes — on high-write tables (logs, events), keep indexes minimal |

Cardinality rule: don't index boolean or low-cardinality columns in isolation — the query planner will skip them. Use partial or composite indexes instead.

---

## Dialect Type Map

| Concept | PostgreSQL | MySQL | SQLite | SQL Server |
|---|---|---|---|---|
| Auto-increment int | `SERIAL` / `BIGSERIAL` | `INT AUTO_INCREMENT` | `INTEGER` (implicit rowid) | `INT IDENTITY(1,1)` |
| UUID | `UUID` | `CHAR(36)` | `TEXT` | `UNIQUEIDENTIFIER` |
| Boolean | `BOOLEAN` | `TINYINT(1)` | `INTEGER` (0/1) | `BIT` |
| Timestamp w/ TZ | `TIMESTAMPTZ` | `DATETIME` | `TEXT` (ISO 8601) | `DATETIMEOFFSET` |
| JSON | `JSONB` | `JSON` | `TEXT` | `NVARCHAR(MAX)` |
| Unlimited text | `TEXT` | `TEXT` | `TEXT` | `NVARCHAR(MAX)` |
| Decimal | `DECIMAL(p,s)` | `DECIMAL(p,s)` | `REAL` / `NUMERIC` | `DECIMAL(p,s)` |

---

## ERD Text Format

Use this format for all schemas:

```
[EntityName]
  - pk: id (BIGINT, PK)
  - column_name (TYPE, constraints)
  - fk: foreign_table_id → foreign_table.id

Relationships:
  - customer 1──< order         (one customer has many orders)
  - order M──< order_item >──M product  (many-to-many via junction)
```

---

## Naming Conventions

| Object | Convention | Example |
|--------|-----------|---------|
| Table | singular snake_case | `product_category` |
| Primary Key | `id` | `id BIGSERIAL PK` |
| Foreign Key | `{table}_id` | `customer_id` |
| Junction Table | `{tableA}_{tableB}` | `order_product` |
| Audit/History Table | `{table}_log` | `order_log`, `account_log` |
| Timestamps | `created_at`, `updated_at`, `deleted_at` | — |
| Boolean | `is_{state}` | `is_active`, `is_verified` |
| Status Enum | `{noun}_status` | `order_status` |

---

## Anti-Patterns Checklist

Flag any of these in new designs or reviews:

- ❌ Storing comma-separated IDs in a column → use a junction table
- ❌ `VARCHAR(255)` for everything → use appropriate types (`TEXT`, `INT`, `DECIMAL`, `BOOLEAN`)
- ❌ Using `NULL` as a flag → add a proper boolean or status column
- ❌ No indexes on FK columns → always index FK columns
- ❌ Single `updated_at` for audit → use a history/log table
- ❌ Storing computed values → derive in queries unless denormalization is justified
- ❌ `ON DELETE CASCADE` without explicit intent → default to `RESTRICT`, document when you deviate
- ❌ Bare junction table (only two FKs, nothing else) → add `created_at` and `UNIQUE` constraint at minimum
- ❌ Using `INT` for PKs on large tables → use `BIGINT`/`BIGSERIAL` by default
- ❌ Same PK strategy everywhere → evaluate UUID vs SERIAL per table context (see UUID vs SERIAL Guide above)

---

## Laravel FK Pattern — `foreignId()->constrained()`

For every FK column in a Laravel schema, annotate the Notes column with the migration equivalent:

| Schema notation | Laravel migration method |
|---|---|
| `user_id BIGINT UNSIGNED FK → users.id ON DELETE RESTRICT` | `$table->foreignId('user_id')->constrained()->restrictOnDelete()` |
| `user_id BIGINT UNSIGNED FK → users.id ON DELETE CASCADE` | `$table->foreignId('user_id')->constrained()->cascadeOnDelete()` |
| `category_id BIGINT UNSIGNED FK → categories.id NULLABLE` | `$table->foreignId('category_id')->nullable()->constrained()->restrictOnDelete()` |

Default: `restrictOnDelete()` — always document when deviating to `cascadeOnDelete()`.

---

## Real-World Transaction Patterns

### Financial / Inventory
```sql
BEGIN;
  INSERT INTO transaction (account_id, amount, type) VALUES (?, ?, 'debit');
  UPDATE account SET balance = balance - ? WHERE id = ? AND balance >= ?;
  -- Check rows affected; ROLLBACK if 0 (insufficient funds)
COMMIT;
```

### Status State Machine
- Model status as an `ENUM` or FK to a `status` lookup table
- Use a `_history` table to track all transitions (never overwrite — append only)
- Enforce valid transitions in the trigger or application layer

### Soft Deletes
- Add `deleted_at TIMESTAMPTZ NULL DEFAULT NULL` and `deleted_by BIGINT NULL` to entities that must not be hard-deleted
- Create a partial index: `WHERE deleted_at IS NULL` for active-record queries
- Use a trigger to log the deletion event to an audit table
