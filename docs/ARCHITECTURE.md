# SimpleInvoice — Solution Architecture

Documentation for the **101 Digital Web Engineer Assessment v2.2.4**. Describes design decisions, data flow, and security posture for reviewer evaluation.

## Overview

SimpleInvoice is a Next.js 16 App Router application that wraps the 101Digital dev APIs behind a **Backend-for-Frontend (BFF)** layer. The browser never receives OAuth `client_secret`, external API access tokens, or direct calls to the neobank API.

```
┌─────────────┐     cookies only      ┌──────────────────┐     server-side      ┌─────────────────────┐
│   Browser   │ ◄──────────────────► │  Next.js (BFF)   │ ◄──────────────────► │ 101Digital Dev APIs │
│  React UI   │   /api/* + RSC fetch  │  Route Handlers  │   Bearer + org-token │ Auth + Invoice svc  │
└─────────────┘                       └──────────────────┘                       └─────────────────────┘
```

## Layering

| Layer | Location | Responsibility |
| ----- | -------- | -------------- |
| Pages (RSC) | `src/app/(main)/`, `src/app/(auth)/` | Server data fetch, compose layouts |
| API routes (BFF) | `src/app/api/` | Auth, proxy to external APIs, server validation |
| External clients | `src/lib/api/` | HTTP calls to identity, membership, invoice services |
| Domain | `src/lib/invoices/` | URL params, server list fetch, form→API mapping |
| Context | `src/contexts/invoice-list-context.tsx` | Share list state/actions without prop drilling |
| Hooks | `src/hooks/` | URL filter navigation, unsaved-changes guard |
| UI | `src/components/` | Feature components + shared UI |
| Cross-cutting | `src/proxy.ts`, `src/config/security-headers.ts` | Auth gate, HTTP security headers |

## Route map

| Path | Rendering | Description |
| ---- | --------- | ----------- |
| `/login` | Static shell + client form | Public login |
| `/` | Dynamic (RSC) | Invoice list — SSR fetch from URL params |
| `/invoices/create` | Static shell + client form | Create invoice |
| `/api/auth/*` | Route handlers | BFF auth |
| `/api/invoices` | Route handlers | BFF invoice list/create |

`(main)/layout.tsx` sets `dynamic = "force-dynamic"` because protected pages depend on session cookies.

## Authentication flow

1. User submits username/password on `/login` (client form + Zod validation).
2. Browser calls **`POST /api/auth/login`** (same origin only).
3. Server performs OAuth2 password grant using `CLIENT_ID` / `CLIENT_SECRET` from env.
4. Server fetches user profile → extracts `memberships[0].token` as **org token**.
5. Server sets **`access_token`** and **`org_token`** as `httpOnly`, `SameSite=strict`, `Secure` (production) cookies.
6. **`proxy.ts`** guards routes: unauthenticated UI → `/login?from=…`; protected API → `401 JSON`.
7. **`(main)/layout.tsx`** loads the Navbar display name via **`bffFetch('/api/auth/me')`** — not a direct call to the membership service.

Tokens are **never** stored in `localStorage` / `sessionStorage` and are **never** exposed via `NEXT_PUBLIC_*` env vars.

## Invoice list flow (SSR + URL state + Context)

### BFF boundary

All access to the external invoice API goes through **`GET /api/invoices`**. The route handler calls `listInvoices()` in `invoice-list.service.ts`, which is the only module (besides auth login) that invokes `lib/api/invoice.api`.

The home page Server Component does **not** call the neobank API directly. It uses `bffFetch()` (`src/lib/bff/server-fetch.ts`) to call `GET /api/invoices` with session cookies forwarded — same BFF path the browser would use.

### Server (first paint)

The home page (`src/app/(main)/page.tsx`) is a **Server Component** that:

1. Parses filter state from URL search params (`parseInvoiceListSearchParams`).
2. Fetches invoices via **`fetchInvoiceListFromBff()`** → `GET /api/invoices`.
3. Passes `invoices`, `totalRecords`, `filters`, and optional `error` to the client tree.

### Client (interactions)

`InvoiceListProvider` wraps the list UI and combines server props with `useInvoiceListFilters()`:

- **`useInvoiceListFilters`** — updates URL via `router.push` inside `useTransition`; handlers wrapped in `useCallback` for stable references.
- **`useInvoiceListContext`** — consumed by `InvoiceFilters` and `InvoiceTable` (no prop drilling).

Filter changes trigger a server re-render with new `searchParams`. While pending:

- Table keeps previous rows (stale-while-revalidate).
- A subtle loading indicator appears instead of replacing the table with a full skeleton.

### UI layout

- **Left sidebar** (`lg:w-72`): search, status, sort, ordering, date range (draft + “Apply dates”).
- **Right panel**: invoice table + pagination.

### URL as source of truth

| App URL param | API param | Default |
| ------------- | --------- | ------- |
| `page` | `pageNum` | `1` |
| `keyword` | `keyword` | empty |
| `status` | `status` | omitted when `All` |
| `fromDate` / `toDate` | same | empty |
| `sortBy` | `sortBy` | `CREATED_DATE` |
| `ordering` | `ordering` | `DESCENDING` |

Implementation: `src/lib/invoices/query-params.ts`.

## Create invoice flow

1. User fills form on `/invoices/create` (react-hook-form + Zod client validation).
2. **`POST /api/invoices`** re-validates body with Zod server-side (`parseRequestBody`).
3. **`mapCreateInvoicePayload()`** transforms the simplified form into the full API schema (single line item; static bank/document/extension defaults from Postman sample).
4. Success → confirmation banner → redirect to `/` after 1.5s.

**Unsaved changes guard** (`use-unsaved-changes-guard`) blocks navigation (links, back button, tab close) when the form is dirty.

**Total amount** uses scoped `useWatch` in a child component to avoid re-rendering the entire form on every keystroke.

## API mapping (Postman ↔ App)

| Postman step | External API | App entry point |
| ------------ | ------------ | --------------- |
| 1. Fetch token | `POST …/oauth2/token` | `POST /api/auth/login` |
| 2. User profile | `GET …/users/me` | Login handler + `(main)/layout.tsx` |
| 3. List invoices | `GET …/invoices` | SSR `getInvoiceList` + `GET /api/invoices` |
| 4. Create invoice | `POST …/invoices` | `POST /api/invoices` |

See [README.md](./README.md) for Postman import and [../README.md](../README.md) for local setup.

## Design decisions & assumptions

### BFF instead of client-side API calls

**Decision:** All 101Digital API calls run on the server.  
**Rationale:** Assessment security requirements; tokens stay off the client except as opaque httpOnly cookies.

### SSR list + URL-driven filters

**Decision:** Initial list data is fetched in a Server Component; client updates filters by changing the URL.  
**Rationale:** Faster first paint, shareable filter state, no client fetch waterfall.

### React Context for list UI

**Decision:** `InvoiceListProvider` + `useInvoiceListContext()` instead of passing 20+ props to filters/table.  
**Rationale:** Cleaner component tree; filter logic stays in `useInvoiceListFilters`.

### Simplified create form + mapper

**Decision:** UI collects business fields only; `mapper.ts` fills API-required static structures.  
**Assumption:** Assessment focuses on integration correctness. Values mirror the official Postman collection.

### `proxy.ts` (Next.js 16 middleware)

**Decision:** Central auth redirect / API 401 instead of per-page checks.  
**Rationale:** Single gate; login preserves `?from=` for post-login redirect.

### No invoice detail page

**Decision:** “View” is satisfied by list table columns (number, customer, dates, amount, status).  
**Rationale:** Core scope is list + search + create.

## Security measures

| Measure | Implementation |
| ------- | -------------- |
| Server-side token exchange | `src/app/api/auth/login/route.ts` |
| Secrets in env only | `.env.local` + `.env.example`; no `NEXT_PUBLIC_*` secrets |
| httpOnly session cookies | `src/lib/auth/session.ts` |
| Server input validation | Zod in API routes via `parseRequestBody` |
| Auth proxy | `src/proxy.ts` |
| Security headers | `next.config.ts` + `src/config/security-headers.ts` |
| Credentials hygiene | App secrets git-ignored; sandbox creds only in docs/Postman |

Applied headers: `X-Frame-Options`, `X-Content-Type-Options`, `Referrer-Policy`, `Permissions-Policy`, `X-DNS-Prefetch-Control`, and `Strict-Transport-Security` (production only).

## Testing strategy

Unit tests (Vitest) — **13 tests** across 4 files:

| File | Coverage |
| ---- | -------- |
| `src/lib/api/api.test.ts` | Auth + invoice API client request shape |
| `src/lib/invoices/mapper.test.ts` | Form → API payload mapping |
| `src/lib/invoices/query-params.test.ts` | URL param parse/build |
| `src/config/security-headers.test.ts` | Security header config |

```bash
npm test
```

## Environment variables

| Variable | Scope | Purpose |
| -------- | ----- | ------- |
| `AUTH_BASE_URL` | Server | Identity server base URL |
| `API_BASE_URL` | Server | Neobank API base URL |
| `CLIENT_ID` | Server | OAuth2 client ID |
| `CLIENT_SECRET` | Server | OAuth2 client secret |

User credentials are entered at login only — not stored in environment files.

## Local development

```bash
cp .env.example .env.local
# Fill CLIENT_ID, CLIENT_SECRET from docs/SimpleInvoice_101Digital.postman_environment.json
npm install   # or pnpm install
npm run dev
```

Demo login credentials are displayed on the login page (shared sandbox account from assessment brief).

## Submission checklist

- [x] Functional login, list (search/sort/filter/paginate), create invoice
- [x] Next.js + TypeScript, responsive UI (sidebar filters on desktop)
- [x] BFF + httpOnly cookies + server validation
- [x] Unit tests for key logic (13 tests)
- [x] README + API docs + architecture documentation
- [x] `.env.example` without real secrets
- [x] Security headers configured
