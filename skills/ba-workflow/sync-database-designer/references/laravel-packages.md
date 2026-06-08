# Laravel Packages Reference

Design guidance for Spatie packages used in the Syntactics stack.

---

## spatie/laravel-permission

### What It Manages

Spatie provisions and owns these tables. Never design or recreate them:

| Table | Purpose |
|-------|---------|
| `permissions` | All named permissions in the system |
| `roles` | All roles |
| `role_has_permissions` | Pivot: which permissions belong to each role |
| `model_has_roles` | Polymorphic pivot: assigns roles to any model (typically `User`) |
| `model_has_permissions` | Polymorphic pivot: assigns direct permissions to any model |

### Schema Design Rules

- Do NOT add a `role` column to `users` or any other model table. Roles are managed entirely via the pivot tables.
- Do NOT add FK columns pointing to `roles.id` or `permissions.id` from your own tables. Use the Spatie API at the application layer.
- When your entity needs role/permission gating, annotate it in the schema Notes: "Access controlled via spatie/laravel-permission — no FK in this table."
- Guard name: default guard is `web`. If the app uses multiple guards (e.g. `api`, `admin`), each guard has its own permission scope. Document the active guards in the schema preamble.

### Permission Seed Design

When specifying permissions in a schema document, define them in a seed block — not as table rows:

```
Permissions (seeded via PermissionSeeder):
  Actions: view, create, edit, delete (applied per resource)
  Resources: users, roles, orders, products, reports

Roles:
  - super-admin: all permissions (wildcard via Spatie gate bypass)
  - admin: all permissions
  - manager: view/create/edit on orders, products; view on users/reports
  - staff: view/create/edit on orders; view on products
```

Do not model permissions as rows in the schema table definition. They belong in a seeder.

### Polymorphic Morph Map

Spatie uses morphs (`model_type`, `model_id`) on `model_has_roles` and `model_has_permissions`. If the app enforces a morph map (`Relation::morphMap()`), declare it in the schema preamble:

```
Morph map (AppServiceProvider):
  'user' -> App\Models\User
```

### Multi-Tenancy Consideration

If the app is multi-tenant, Spatie v6+ supports `team_id` on the pivot tables. When this feature is enabled:
- `model_has_roles` and `model_has_permissions` include a `team_id BIGINT UNSIGNED NULL` column
- Annotate affected tables: "team_id scope enabled via Spatie teams feature"
- Do not design your own team-permission pivot table

---

## spatie/laravel-activitylog

### What It Manages

Spatie provisions and owns the `activity_log` table. Never design a custom audit table for models that implement `LogsActivity`.

### activity_log Table Structure (for reference only - do not recreate)

| Column | Type | Nullable | Notes |
|--------|------|----------|-------|
| `id` | `BIGINT UNSIGNED` | No | PK, AUTO_INCREMENT |
| `log_name` | `VARCHAR(255)` | Yes | Grouping label (e.g. 'default', 'orders') |
| `description` | `TEXT` | No | Event description |
| `subject_type` | `VARCHAR(255)` | Yes | Polymorphic: fully qualified model class of the changed record |
| `subject_id` | `VARCHAR(255)` | Yes | PK of the changed record (stored as string to support UUID) |
| `event` | `VARCHAR(255)` | Yes | created / updated / deleted / or custom event name |
| `causer_type` | `VARCHAR(255)` | Yes | Who caused it (e.g. App\Models\User) |
| `causer_id` | `VARCHAR(255)` | Yes | PK of the causer |
| `properties` | `JSON` | Yes | old/new values snapshot; any extra context |
| `batch_uuid` | `CHAR(36)` | Yes | Groups related log entries from the same action |
| `created_at` | `TIMESTAMP` | Yes | |
| `updated_at` | `TIMESTAMP` | Yes | |

### Schema Design Rules

- If a model uses `LogsActivity`, annotate its table: "Audit trail managed by spatie/laravel-activitylog."
- Do NOT add a separate `{model}_history` table for models already covered by activitylog.
- Do NOT write DB triggers for audit logging on activitylog-managed models. Application-layer logging is sufficient and more maintainable.
- Use a custom `{model}_history` table only when (see decision matrix below):
  - You need structured SQL queries on specific old/new field values
  - The model is written directly via DB (not Eloquent) - activitylog is bypassed by DB::table() and raw queries
  - The history table is the source of truth for a state machine (e.g. order_status_history)

### When to Use activitylog vs. Custom History Table

| Scenario | Use |
|----------|-----|
| General audit trail (who changed what, when) | `activitylog` |
| Status-transition history requiring structured queries on old/new values | Custom `{model}_status_history` table |
| Financial ledger / balance change tracking | Custom ledger/transaction table - never activitylog |
| Non-Eloquent writes (migrations, seeders, DB admin tools) | DB trigger to custom table |
| Permission/role change tracking | `activitylog` (configure on Spatie models) |
| High-volume event stream (> 10k writes/min) | Queue-based custom log - activitylog is synchronous by default |
| GDPR-sensitive data where log pruning is required | `activitylog` (use built-in pruning via `expires_at`) |

### Log Name Strategy

Use `log_name` to segregate audit streams and make pruning/querying targeted. Define log names in the schema preamble when activitylog is used:

```
Activity Log Streams:
  - 'default': general model changes (users, settings)
  - 'auth': login, logout, password resets, 2FA events
  - 'orders': order lifecycle events
  - 'permissions': role and permission assignments
```

### Properties Column Queries

Activitylog stores `old` and `new` attribute snapshots as JSON in `properties`. Reference queries:

MySQL:
```sql
SELECT subject_id,
       JSON_EXTRACT(properties, '$.old.status') AS old_status,
       JSON_EXTRACT(properties, '$.new.status') AS new_status
FROM activity_log
WHERE subject_type = 'App\\\\Models\\\\Order'
  AND event = 'updated'
  AND JSON_EXTRACT(properties, '$.old.status') != JSON_EXTRACT(properties, '$.new.status');
```

PostgreSQL (jsonb):
```sql
SELECT subject_id,
       properties->'old'->>'status' AS old_status,
       properties->'new'->>'status' AS new_status
FROM activity_log
WHERE subject_type = 'App\Models\Order'
  AND event = 'updated'
  AND properties->'old'->>'status' != properties->'new'->>'status';
```

---

## Using Both Packages Together

When both packages are active:

- Permission changes (role assigned, permission revoked) should themselves be logged via activitylog if auditing is required. Configure this in the `Spatie\Permission\Models\Role` and `Permission` models via `LogsActivity`.
- Annotate the Spatie-owned tables in the schema under a "Third-Party Managed Tables" section: "Managed by spatie/laravel-permission; not included in migration files."
- Do NOT design a separate `role_change_history` table if activitylog is already logging permission model changes.

### Third-Party Managed Tables - Schema Annotation Block

Include this block in the Design Overview section when either package is present:

```
Third-Party Managed Tables (not in migration files):
  - permissions, roles, role_has_permissions, model_has_roles, model_has_permissions
    -> spatie/laravel-permission v6.x
  - activity_log
    -> spatie/laravel-activitylog v4.x
```
