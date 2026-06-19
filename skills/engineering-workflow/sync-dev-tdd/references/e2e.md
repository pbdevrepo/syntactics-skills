# E2E Test Guidance

## When E2E tests belong

E2E tests run AFTER the TDD loop completes — not inside it. The red-green-refactor cycle is too tight a loop for E2E feedback. Write E2E tests once:

1. All unit/integration tests are GREEN
2. The Static Analysis Gate passes (tsc + ESLint)
3. The Smoke Test PASSES

Never write E2E tests first. They verify integrated journeys over stable implementation, not behavior under development.

## Scope rule: happy path only at E2E layer

| Layer | What to test |
|---|---|
| Unit / Integration | Happy path, Sad path, Edge cases, Mocked boundaries |
| E2E | Happy path user journeys only |

Edge cases and error payloads belong at the unit/integration layer where feedback is fast. An E2E test that asserts on a 422 validation error is testing the wrong layer — write a unit test instead.

## Ratio guidance

A healthy test suite follows roughly 70% unit/integration, 20% integration, 10% E2E. If you find yourself writing more than 3 E2E tests per feature, push the coverage down to the unit layer.

## Test structure (Playwright)

```typescript
// tests/e2e/{module}/{feature}.spec.ts
import { test, expect } from '@playwright/test';

test('{user-visible behavior description}', async ({ page }) => {
  // 1. Navigate to the entry point
  await page.goto('/path');

  // 2. Interact as a user would
  await page.getByRole('button', { name: 'Submit' }).click();

  // 3. Assert on observable outcome — what the user sees, not implementation
  await expect(page.getByRole('status')).toHaveText('Success');
});
```

Selector priority: `getByRole` > `getByLabel` > `getByTestId` > CSS selectors. Never select by class name or internal implementation attributes.

## Output path

```
tests/e2e/{module}/{feature}.spec.ts
```

## What NOT to test at E2E layer

- Error payloads and validation messages (unit/integration layer)
- Boundary values (unit layer)
- Authorization bypasses (unit/integration layer)
- Internal state (never — test observable output only)
- Behavior already fully covered by unit tests
