# Tests

Vitest discovers `tests/**/*.test.ts` and `tests/**/*.test.tsx`.

The suite currently covers the implemented task schema and date/overdue helpers. Add focused unit tests as more pure modules become available, especially for:

- Zod validation schemas;
- Indonesian date formatting and overdue boundaries;
- checklist progress calculations;
- permission helpers and typed action-result mapping.

Keep fixtures fictional. Prefer deterministic inputs (explicit timestamps and time zones), test public behavior rather than implementation details, and import the real module through the `@/*` alias. For DOM-oriented component tests, opt into JSDOM per file with `// @vitest-environment jsdom`; the default environment remains `node` for fast pure-function tests.
