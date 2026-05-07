# Normalization Reference

Full walkthrough of 1NF → 2NF → 3NF with violation examples and fix patterns.

Default target for all schemas: **3NF**. Deviate only with explicit justification documented in Design Decisions.

---

## First Normal Form (1NF)

**Rule:** Atomic values only. No repeating groups. Every row uniquely identifiable.

### Violations

**Multi-value columns:**
```
// BAD
orders
  id | customer_id | products          | quantities
  1  | 42          | "101,102,103"     | "2,1,3"
```
Comma-separated IDs in one column — not atomic, not queryable without string parsing.

**Fix:** Extract to a junction/child table.
```
orders          order_items
  id              id | order_id | product_id | quantity
  customer_id     1  | 1        | 101        | 2
                  2  | 1        | 102        | 1
                  3  | 1        | 103        | 3
```

**Repeating column groups:**
```
// BAD
employees
  id | name | skill_1 | skill_2 | skill_3
```
Adding a 4th skill requires a schema change. Not 1NF.

**Fix:** Same as above — child table `employee_skill`.

---

## Second Normal Form (2NF)

**Rule:** Must be 1NF first. Every non-key attribute must depend on the **whole** primary key — not just part of it.

Only applies to tables with **composite primary keys**.

### Violation

```
// BAD — composite PK: (order_id, product_id)
order_items
  order_id | product_id | quantity | product_name | product_price
```

`product_name` and `product_price` depend only on `product_id` — not on the full composite key. This is a partial dependency.

**Fix:** Move product attributes to the `products` table.
```
order_items                    products
  order_id | product_id | qty    id | name | price
```

**Exception — intentional denormalization:**
If `product_price` at time of purchase must be frozen (not follow future price changes), store `unit_price_snapshot` in `order_items`. Document it:
```
order_items.unit_price_snapshot — intentionally denormalized.
Price captured at time of order. Must not reference products.price.
```

---

## Third Normal Form (3NF)

**Rule:** Must be 2NF first. No transitive dependencies — non-key columns must depend only on the primary key, not on other non-key columns.

### Violation

```
// BAD
employees
  id | name | department_id | department_name | department_budget
```

`department_name` and `department_budget` depend on `department_id`, not on `id`. That's a transitive dependency: `id → department_id → department_name`.

**Fix:** Extract to a `departments` table.
```
employees                         departments
  id | name | department_id  →     id | name | budget
```

### Common 3NF Violations to Watch For

| Pattern | Violation | Fix |
|---------|-----------|-----|
| City + state + zip in same table | City/state depend on zip, not PK | Extract to `address` or `zip_code` lookup table |
| Category name stored alongside category ID | Name depends on ID, not on PK | FK to `categories` table |
| Manager name stored with employee | Manager name depends on manager ID | FK to `employees` self-reference |
| `is_admin` + `admin_since` on `users` | `admin_since` depends on `is_admin`, not PK | Move to `user_roles` table |

---

## BCNF (Boyce-Codd Normal Form)

**Rule:** Every determinant must be a candidate key.

Only evaluate BCNF when overlapping candidate keys exist. In most web application schemas, 3NF is sufficient.

### When to Check

If a table has multiple candidate keys that overlap (share columns), check for BCNF violations. These are rare in practice.

**Example:**
```
course_bookings
  student | course | teacher
```
Candidate keys: `(student, course)` and `(student, teacher)` — if one teacher per course is enforced.
Determinant: `course → teacher` (a teacher is assigned to one course).
But `course` alone is not a candidate key → BCNF violation.

**Fix:** Decompose into `course_teacher(course, teacher)` and `student_course(student, course)`.

**Practical rule:** Only flag BCNF if the violation would cause real insertion/deletion anomalies. If not — leave it at 3NF and document why.

---

## Deliberate Denormalization — When It's Acceptable

Always document in the Design Decisions table. Acceptable reasons:

| Reason | Example |
|--------|---------|
| Point-in-time snapshot | `order_items.unit_price_snapshot` — price at time of order |
| Read performance on high-traffic query | `users.post_count` cached to avoid COUNT() on every page load |
| Reporting/analytics tables | Denormalized summary tables built from normalized source |
| Legacy compatibility | Existing API contract requires a field in a specific location |

Never denormalize to avoid writing a JOIN. That is laziness, not optimization.