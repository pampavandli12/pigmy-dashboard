# Repository Guidelines

## Project Structure & Module Organization

Application code lives in `src/`. Route-level UI is in `src/views/`, reusable UI in `src/components/`, Zustand stores in `src/store/`, and HTTP integrations in `src/services/`. Shared types, utilities, and React providers live in `src/types/`, `src/utils/`, and `src/providers/`. Static assets belong in `public/`; global styles and application entry points remain directly under `src/`.

Tests live in `test/` and mirror the source layout (for example, `src/views/Reports.tsx` is covered by `test/views/Reports.test.tsx`). Shared rendering and store helpers belong in `test/renderTestUtils.tsx`.

## Build, Test, and Development Commands

- `npm install` installs the locked dependency set and configures Husky hooks.
- `npm run dev` starts the Vite development server with hot reload.
- `npm run build` runs tests, TypeScript project builds, and the production Vite bundle.
- `npm run preview` serves the production bundle locally.
- `npm run lint` checks all TypeScript and TSX source and test files with ESLint.
- `npm test` starts Vitest in watch mode; `npm run test:run` runs it once.
- `npm run coverage` writes V8 coverage reports to `coverage/`.

## Coding Style & Naming Conventions

Use TypeScript and functional React components. Follow the existing two-space indentation, semicolons, and single-quoted strings. Name components and view files in PascalCase (`AgentForm.tsx`), hooks and functions in camelCase, and stores with a `Store` suffix (`ReportStore.ts`). Keep service modules focused on API access and avoid embedding requests in views. ESLint is the source of truth; run it before committing.

## Testing Guidelines

Vitest runs in `jsdom` with global test APIs. Name tests `*.test.ts` or `*.test.tsx`, mirror the corresponding source path, and use `describe`/`it` labels that state observable behavior. Mock network and store boundaries; reuse the render helpers for routed views. Coverage must remain at least 80% for statements and lines, 75% for functions, and 60% for branches.

## Commit & Pull Request Guidelines

Recent commits use short, imperative, lowercase summaries such as `fixing update phone number api`. Keep each commit focused and explain the user-visible outcome. Before opening a pull request, ensure `npm run lint`, `npm run test:run`, and `npm run build` pass. PRs should include a concise description, linked issue when applicable, test evidence, and screenshots for UI changes. The pre-commit hook runs lint-staged, ESLint, and the full test suite.
