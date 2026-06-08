# Triggers Reference

When to use database triggers vs. application logic, with decision rules, audit patterns, and DDL examples.

---

## Decision Tree — Trigger vs. Application Logic

Start here before writing any trigger.

```
Does the logic need to fire on EVERY write, regardless of which app or service caused it?
  YES → Consider a trigger
  NO  → Use application logic

Does it enforce data integrity that can't be expressed as a CHECK constraint?
  YES → Trigger is appropriate
  NO  → Use a CHECK constraint or application validation

Does it need to be unit-tested independently?
  YES → Application logic (triggers are hard to unit test)
  NO  → Trigger is fine

Is this on a high-write, performance-critical path (e.g., event logs, metrics)?
  YES → Avoid triggers — use async application logic or background jobs
  NO  → Trigger is fine

Is this business logic that product/dev teams will need to change frequently?
  YES → Application logic (triggers are invisible to the ORM layer)
  NO  → Trigger is acceptable
```

---

## Use Triggers For

| Use Case | Why a Trigger |
|----------|---------------|
| **Audit logging** | Must fire on every write — including direct DB writes, migrations, and admin tools |
| **Derived column maintenance** | Keeping a denormalized value in sync with its source (e.g., `users.post_count`) |
| **Cross-table business rules** | Constraints that span multiple tables and can't be expressed as a single CHECK |
| **Cascading soft-deletes** | Propagate `deleted_at` to child records when parent is soft-deleted |
| **Append-only history tables** | Log every status change automatically, regardless of what caused it |

---

## Avoid Triggers For

| Use Case | Use Instead |
|----------|-------------|
| Business logic that changes with product decisions | Application service layer |
| Sending emails or notifications | Application event/queue system |
| Calling external APIs | Background job |
| Logic developers need to trace in code | Application layer — triggers are invisible to ORM |
| High-volume insert paths | Application logic or async workers — triggers add per-row overhead |
| Anything you want to unit test | Application logic |
| Audit logging on Eloquent models when `spatie/laravel-activitylog` is installed | `LogsActivity` trait on the model — see `references/laravel-packages.md` |

---

## Audit Log Pattern

Standard pattern for append-only audit/history tables.

### Table Structure

```sql
CREATE TABLE {entity}_history (
  id          BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  {entity}_id BIGINT UNSIGNED NOT NULL,
  changed_by  BIGINT UNSIGNED NULL,           -- NULL for system-initiated changes
  old_status  VARCHAR(50)     NULL,
  new_status  VARCHAR(50)     NOT NULL,
  note        TEXT            NULL,
  created_at  TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP,

  PRIMARY KEY (id),
  INDEX idx_{entity}_history_{entity}_id ({entity}_id),
  CONSTRAINT fk_{entity}_history_{entity} FOREIGN KEY ({entity}_id)
    REFERENCES {entity}(id) ON DELETE RESTRICT
);
```

### Trigger (MySQL)

```sql
DELIMITER $$

CREATE TRIGGER trg_{entity}_status_after_update
AFTER UPDATE ON {entity}
FOR EACH ROW
BEGIN
  IF OLD.status <> NEW.status THEN
    INSERT INTO {entity}_history (
      {entity}_id,
      changed_by,
      old_status,
      new_status,
      created_at
    ) VALUES (
      NEW.id,
      NEW.updated_by,   -- assumes updated_by column exists on the entity
      OLD.status,
      NEW.status,
      NOW()
    );
  END IF;
END$$

DELIMITER ;
```

### Trigger (PostgreSQL)

```sql
CREATE OR REPLACE FUNCTION fn_{entity}_status_log()
RETURNS TRIGGER AS $$
BEGIN
  IF OLD.status IS DISTINCT FROM NEW.status THEN
    INSERT INTO {entity}_history (
      {entity}_id,
      changed_by,
      old_status,
      new_status,
      created_at
    ) VALUES (
      NEW.id,
      NEW.updated_by,
      OLD.status,
      NEW.status,
      NOW()
    );
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_{entity}_status_after_update
AFTER UPDATE ON {entity}
FOR EACH ROW
EXECUTE FUNCTION fn_{entity}_status_log();
```

---

## Cascading Soft-Delete Pattern

When a parent is soft-deleted, propagate to children.

```sql
-- MySQL
CREATE TRIGGER trg_{parent}_soft_delete_cascade
AFTER UPDATE ON {parent}
FOR EACH ROW
BEGIN
  IF OLD.deleted_at IS NULL AND NEW.deleted_at IS NOT NULL THEN
    UPDATE {child}
    SET deleted_at = NEW.deleted_at,
        deleted_by = NEW.deleted_by
    WHERE {parent}_id = NEW.id
      AND deleted_at IS NULL;
  END IF;
END;
```

Only use this when child records have no independent lifecycle. If children can exist without the parent, do not cascade — raise an application error instead.

---

## Derived Column Maintenance Pattern

Keeping a cached count or sum in sync.

```sql
-- Increment post_count when a post is created
CREATE TRIGGER trg_posts_after_insert
AFTER INSERT ON posts
FOR EACH ROW
BEGIN
  UPDATE users SET post_count = post_count + 1 WHERE id = NEW.user_id;
END;

-- Decrement on soft-delete
CREATE TRIGGER trg_posts_after_soft_delete
AFTER UPDATE ON posts
FOR EACH ROW
BEGIN
  IF OLD.deleted_at IS NULL AND NEW.deleted_at IS NOT NULL THEN
    UPDATE users SET post_count = post_count - 1 WHERE id = NEW.user_id;
  END IF;
END;
```

**Warning:** Cached counts can drift under concurrent load or failed transactions. Always provide a reconciliation query that can rebuild the count from source data:
```sql
UPDATE users u
SET post_count = (
  SELECT COUNT(*) FROM posts p
  WHERE p.user_id = u.id AND p.deleted_at IS NULL
);
```

---

## Naming Conventions for Triggers

| Pattern | Example |
|---------|---------|
| `trg_{table}_{timing}_{event}` | `trg_orders_after_update` |
| Timing: `before` or `after` | `trg_invoices_before_insert` |
| Event: `insert`, `update`, `delete` | `trg_users_after_delete` |
| Function (PostgreSQL): `fn_{table}_{purpose}` | `fn_orders_status_log` |