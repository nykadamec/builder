# Playwright E2E Tests

## Install

- Installed via devDependencies: `@playwright/test` and `playwright`.
- Browsers installed via: `pnpm exec playwright install` (already run).

## Scripts

- `pnpm test:e2e` - run all tests in headless mode
- `pnpm test:e2e:ui` - run tests with Playwright UI
- `pnpm test:e2e:report` - open the last HTML report

## Structure

- Config: `playwright.config.ts`
- Tests: `tests/**/*.spec.ts`

## Tips

- Base URL is set to `http://localhost:3000` via config.
- The webServer in config starts `pnpm dev` automatically for tests.
- Keep tests minimal and modular; one feature per file.

