# API Documentation

Postman assets and API ↔ web app mapping for **101 Digital SimpleInvoice** (assessment v2.2.4).

## Files

| File | Purpose |
| ---- | ------- |
| `SimpleInvoice_101Digital.postman_collection.json` | API requests (run in order 1 → 4) |
| `SimpleInvoice_101Digital.postman_environment.json` | Environment variables template |
| `ARCHITECTURE.md` | Solution architecture and design decisions |
| `Assessment Project - NextJS v2.2.4.pdf` | Official assessment brief |

## Import into Postman

1. Open Postman → **Import** → select both JSON files in this folder.
2. Select the **SimpleInvoice - 101Digital (Dev)** environment.
3. Confirm `clientSecret` and `password` are set (assessment sandbox credentials).
4. Run requests **top to bottom** — test scripts auto-save `accessToken` and `orgToken`.

## External API request flow

### 1. Fetch App Access Token

- `POST {{authBaseUrl}}/t/101digital.core/oauth2/token`
- Body: `client_id`, `client_secret`, `grant_type=password`, `scope=openid`, `username`, `password`
- Saves: `accessToken`

### 2. Get User Profile

- `GET {{apiBaseUrl}}/membership-service/1.0.0/users/me`
- Header: `Authorization: Bearer {{accessToken}}`
- Saves: `orgToken` from `memberships[0].token`

### 3. Fetch Invoices

- `GET {{apiBaseUrl}}/invoice-service/1.0.0/invoices`
- Headers: `Authorization`, `org-token`

| Param | Example | Description |
| ----- | ------- | ----------- |
| `sortBy` | `CREATED_DATE` | Sort field (`CREATED_DATE`, `DUE_DATE`) |
| `ordering` | `DESCENDING` | `ASCENDING` or `DESCENDING` |
| `pageNum` | `1` | Page number (starts at 1) |
| `pageSize` | `10` | Records per page |
| `keyword` | `IV164931...` | Search by invoice number |
| `status` | `Paid` | Filter: `Paid`, `Due`, `Overdue` |
| `fromDate` | `2021-01-01` | Start date (`YYYY-MM-dd`) |
| `toDate` | `2021-12-31` | End date (`YYYY-MM-dd`) |

### 4. Create Invoice

- `POST {{apiBaseUrl}}/invoice-service/1.0.0/invoices`
- Headers: `Authorization`, `org-token`, `Operation-Mode: SYNC`
- Body: `{ "invoices": [ { ... } ] }` — see collection for full schema
- Pre-request script generates unique `invoiceNumber` / `invoiceReference`

## Web app mapping

The Next.js app implements the same flow through a **BFF layer**. The browser never calls the neobank API directly.

| Postman step | External API | App entry point |
| ------------ | ------------ | --------------- |
| 1 + 2 | OAuth token + user profile | `POST /api/auth/login` |
| 2 (display name) | User profile | `(main)/layout.tsx` server fetch |
| 3 | List invoices | SSR `getInvoiceList()` on `/` + `GET /api/invoices` |
| 4 | Create invoice | `POST /api/invoices` |

### BFF routes

| Route | Method | Role |
| ----- | ------ | ---- |
| `/api/auth/login` | POST | Token exchange, set httpOnly cookies |
| `/api/auth/logout` | POST | Clear session cookies |
| `/api/auth/me` | GET | Proxy user profile |
| `/api/invoices` | GET | Proxy list (with query params) |
| `/api/invoices` | POST | Proxy create (validated body) |

### URL query params (invoice list page)

The home page (`/`) reads filters from the URL and fetches data on the server. Client filter changes update the URL (via `router.push`).

| URL param | Maps to API param | Notes |
| --------- | ----------------- | ----- |
| `page` | `pageNum` | Default `1` |
| — | `pageSize` | Fixed `10` in app |
| `keyword` | `keyword` | Search invoice number |
| `status` | `status` | Omitted when `All` |
| `fromDate` | `fromDate` | Applied via sidebar “Apply dates” |
| `toDate` | `toDate` | Applied via sidebar “Apply dates” |
| `sortBy` | `sortBy` | Default `CREATED_DATE` |
| `ordering` | `ordering` | Default `DESCENDING` |

Example: `/?status=Paid&sortBy=DUE_DATE&ordering=ASCENDING&page=2`

Parse/build logic: `src/lib/invoices/query-params.ts`.

### Create invoice payload

The create form collects business fields only. `src/lib/invoices/mapper.ts` maps them to the full API schema (bank account, customer, documents, extensions, single line item) matching the Postman collection sample.

## Security note

- Do **not** commit real `CLIENT_SECRET` or user passwords in application source.
- Use `.env.local` for the web app (git-ignored); use the Postman environment file locally for API testing.
- Sandbox credentials in the Postman JSON and assessment PDF are shared dev-environment values supplied for evaluation.

## Further reading

- Solution architecture: [ARCHITECTURE.md](./ARCHITECTURE.md)
- Setup and project structure: [../README.md](../README.md)
