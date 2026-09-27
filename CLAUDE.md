# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

- `npm run dev` — start the Vite dev server with HMR.
- `npm run build` — runs the full test suite (`test:run`), then `tsc -b`, then `vite build`. Tests gate the build.
- `npm run lint` — ESLint over both `src` and `test` (`.ts`/`.tsx`). ESLint is the source of truth for style.
- `npm run test:run` — run Vitest once (CI/pre-commit mode).
- `npm test` — Vitest in watch mode.
- `npm run coverage` — V8 coverage to `coverage/`. Thresholds are enforced: statements/lines ≥80%, functions ≥75%, branches ≥60%.
- Run a single test file: `npx vitest run test/views/Reports.test.tsx`.
- Filter by test name: `npx vitest run -t "shows the error alert"`.

The Husky pre-commit hook runs lint-staged (`eslint --fix` and `vitest related --run`) on staged files.

## Architecture

React 19 + TypeScript + Vite SPA (MUI + Emotion UI, React Router 7). Deployed on Vercel with SPA rewrites (`vercel.json`). Layers flow one direction: **views → stores → services → HTTP**.

- **views/** (`src/views/`) — route-level screens. Routing is defined in `src/App.tsx`: `/signin` is public; everything else is nested under `<ProtectedRoute>` → `Main` (layout). Agent-scoped screens live under `/agents/*` (e.g. `transactions/:agentCode`, `deposits/:agentCode`).
- **stores/** (`src/store/`, Zustand) — hold state and orchestrate service calls. Each async action sets a `Status` enum field (`Idle`/`Loading`/`Success`/`Error`, from `src/types/sharedEnums.ts`) and reports outcomes to the user via `useAlertStore.getState().showAlert(...)`. Views read status, not raw promises.
- **services/** (`src/services/`) — thin HTTP wrappers around the shared axios instance. Keep API access here; do not call axios from views or stores directly (stores call services).
- **components/** (`src/components/`) — reusable UI (forms, dialogs, snackbar, side drawer).

### Auth

`src/store/AuthStore.ts` is a Zustand store persisted to localStorage (`auth-storage`) via `persist`. Because hydration is async, it exposes `isHydrated`; `src/ProtectedRoute.tsx` renders a loading state until hydration completes, then redirects to `/signin` when there is no token. `logout()` clears all auth fields.

### HTTP layer

All requests go through the single axios instance in `src/services/axios.ts`:
- Request interceptor injects `Authorization` from the auth store and, for every endpoint except login, a `bankType` header.
- Response interceptor calls `logout()` and hard-redirects to `/signin` on HTTP **403**.

Base URL and endpoint paths live in `src/utils/constants.ts`. `appConfig` is currently pinned to the `development` config (`getConfig('development')`) — the API domain is set there, not via env vars.

### Multi-bank handler abstraction (the key concept)

The app supports multiple backend "bank types" (currently `banksoft` and `peocit`) that differ in payload shape, endpoints, and export file format. This is abstracted in `src/bankTypes/`:
- `types.ts` defines `BankTypeHandler` with `uploadAccounts`, `createDeposit`, `exportDeposit`.
- `banksoft.ts` and `peocit.ts` each implement the full flow (parse input → build payload → call service → produce output).
- `index.ts` maps bank type → handler via `getBankTypeHandler(bankType)`, falling back to `DEFAULT_BANK_TYPE` (`banksoft`) when the persisted `bankType` is null.

The active bank type comes from the auth store (set at login) and travels to the backend via the `bankType` header. When adding a bank-specific behavior, add it to the handler interface and implement it in every handler; endpoints that vary per bank are keyed by bank type in `API_URLS` (e.g. `UPLOAD_ACCOUNTS`, `CREATE_DEPOSIT`).

## Testing conventions

- Vitest + jsdom with global test APIs. Tests live in `test/` and **mirror the source path** (`src/views/Reports.tsx` → `test/views/Reports.test.tsx`).
- `test/renderTestUtils.tsx` is the shared harness. It `vi.mock`s every Zustand store, plus MUI DataGrid, DatePicker, Switch, and Dialog primitives, so views render without a real backend. Use `renderRoute`/`renderRouteNode` to render routed views, `getRenderStoreState()` to read/override mocked store state, and `resetRenderStores()` to reset between tests.
- Because the store mocks are module-level, import from `renderTestUtils` before the component under test, and reset stores in `beforeEach`. Mock network and store boundaries rather than hitting real services.
