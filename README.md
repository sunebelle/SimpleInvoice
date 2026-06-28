# SimpleInvoice

Web app for the **101 Digital Web Engineer Assessment (ReactJS v2.2.4)** — manage invoices via the 101Digital dev API.

## Features

- OAuth2 password-grant login with session cookies (`access_token`, `org_token`)
- Invoice list (SSR) with sidebar filters: search, status, date range, sort, ordering, pagination
- URL-driven filter state — shareable query strings (e.g. `/?status=Paid&page=2`)
- Create invoice (single line item, API-compatible payload via `mapper.ts`)
- Backend-for-Frontend (BFF) — external API tokens never exposed to the browser
- Auth proxy guard (`src/proxy.ts`)
- Unsaved-changes guard on the create-invoice form
- HTTP security headers ([details](./docs/ARCHITECTURE.md#security-measures))

## Tech stack

| Layer | Choice |
| ----- | ------ |
| Framework | Next.js 16 (App Router), React 19, TypeScript |
| Styling | Tailwind CSS 4 |
| Forms / validation | react-hook-form, Zod |
| Quality | Vitest (13 unit tests), Biome |

## Prerequisites

- Node.js 20+
- npm or pnpm

## Setup

1. Install dependencies:

```bash
npm install
# or: pnpm install
```

2. Copy environment variables:

```bash
cp .env.example .env.local
```

3. Fill in `.env.local` (values from `docs/SimpleInvoice_101Digital.postman_environment.json` or the assessment brief):

```env
AUTH_BASE_URL=https://is-wso2-dev.101digital.io
API_BASE_URL=https://api-neobank-dev.101digital.io
CLIENT_ID=<your-client-id>
CLIENT_SECRET=<your-client-secret>
```

4. Start the dev server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). Demo login credentials are shown on the login page.

## Scripts

| Command | Description |
| ------- | ----------- |
| `npm run dev` | Start development server |
| `npm run build` | Production build |
| `npm run start` | Start production server |
| `npm run lint` | Run Biome checks |
| `npm run format` | Format with Biome |
| `npm run test` | Run Vitest unit tests (13 tests) |

## Routes

| Route | Access | Description |
| ----- | ------ | ----------- |
| `/login` | Public | Login form |
| `/` | Protected | Invoice list (default after login) |
| `/invoices/create` | Protected | Create invoice form |
| `POST /api/auth/login` | Public | OAuth2 + set session cookies |
| `POST /api/auth/logout` | Protected | Clear session cookies |
| `GET /api/auth/me` | Protected | Current user profile (BFF) |
| `GET /api/invoices` | Protected | List invoices (BFF) |
| `POST /api/invoices` | Protected | Create invoice (BFF) |

Unauthenticated access to protected routes is redirected to `/login?from=…` by `proxy.ts`.

## Project structure

```
src/
├── app/
│   ├── (auth)/login/              # Login page
│   ├── (main)/
│   │   ├── page.tsx               # SSR invoice list (reads searchParams)
│   │   ├── layout.tsx             # Navbar + server user profile fetch
│   │   ├── loading.tsx            # Route loading skeleton
│   │   └── invoices/create/       # Create invoice page
│   └── api/                       # BFF route handlers
│       ├── auth/login|logout|me/
│       └── invoices/
├── components/
│   ├── auth/                      # LoginForm
│   ├── invoices/                  # List, filters, table, create form
│   ├── layout/                    # Navbar
│   └── ui/                        # Shared UI primitives
├── contexts/
│   └── invoice-list-context.tsx   # Provider + useInvoiceListContext()
├── hooks/
│   ├── use-invoice-list-filters.ts  # URL navigation + filter actions
│   └── use-unsaved-changes-guard.ts
├── lib/
│   ├── api/                       # External API clients (auth, invoice)
│   ├── auth/                      # Session cookies, user display name
│   ├── invoices/
│   │   ├── query-params.ts        # Parse/build URL filter query strings
│   │   ├── get-invoices.ts        # Server-side list fetch
│   │   └── mapper.ts              # Form → API payload
│   ├── navigation/                # Unsaved-changes helpers
│   └── validation/                # Server request parsing (Zod)
├── config/                        # env, site metadata, security headers
├── constants/                     # Invoice filter/sort constants
├── schemas/                       # Zod schemas (auth, invoice)
├── types/                         # Shared TypeScript types
└── proxy.ts                       # Auth redirect guard (middleware)
```

## API flow

Matches the Postman collection in `docs/`:

1. `POST /oauth2/token` → access token
2. `GET /membership-service/.../users/me` → org token
3. `GET /invoice-service/.../invoices` → list (query params)
4. `POST /invoice-service/.../invoices` → create invoice

The web app wraps steps 1–2 in `POST /api/auth/login`, step 3 in SSR + `GET /api/invoices`, step 4 in `POST /api/invoices`.

See [docs/README.md](./docs/README.md) for Postman import and param mapping.

## Documentation

| Document | Description |
| -------- | ----------- |
| [docs/README.md](./docs/README.md) | Postman collection, API reference, web app mapping |
| [docs/ARCHITECTURE.md](./docs/ARCHITECTURE.md) | Solution architecture, security, design decisions |
| [docs/Assessment Project - NextJS v2.2.4.pdf](./docs/Assessment%20Project%20-%20NextJS%20v2.2.4.pdf) | Official assessment brief |

## Environment variables

| Variable | Required | Description |
| -------- | -------- | ----------- |
| `AUTH_BASE_URL` | Yes | Identity server base URL |
| `API_BASE_URL` | Yes | Neobank API base URL |
| `CLIENT_ID` | Yes | OAuth2 client ID (server-side only) |
| `CLIENT_SECRET` | Yes | OAuth2 client secret (server-side only) |

User credentials are entered on the login form and are **not** stored in env vars.  
`.env.local` is git-ignored; only `.env.example` is committed.

## Manual smoke test

After `npm run dev`, verify:

1. Login with demo credentials → land on `/` with invoice data
2. Search, filter status, sort, date range, pagination
3. Create invoice → success message → new row on list
4. Logout → redirect to `/login`
5. Visit `/` logged out → redirect to login

## License

Assessment submission — 101 Digital PTE LTD sandbox environment.
