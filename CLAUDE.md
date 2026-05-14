# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Overview

Tax services website for vault1040.com. The actual project lives in `vault1040/` — all commands below run from there.

## Commands

```bash
# Start everything
cd vault1040 && pnpm dev          # client :5173, server :3001

# Individual apps
pnpm dev:client
pnpm dev:server

# Build
pnpm build

# Database (run from vault1040/apps/server)
pnpm db:migrate       # run pending migrations (dev)
pnpm db:migrate:deploy # run pending migrations (prod)
pnpm db:seed          # seed users, services, availability
pnpm db:generate      # regenerate Prisma client after schema changes
pnpm db:studio        # Prisma Studio at localhost:5555

# Lint
pnpm lint             # runs both client and server linters
```

No test suite exists yet.

## Tech Stack

**Frontend** (`apps/client` — port 5173)
- React 18 + Vite + TypeScript
- Tailwind CSS
- Zustand (auth state), TanStack Query (server state)
- React Hook Form + Zod (validation)
- React Router v6

**Backend** (`apps/server` — port 3001)
- Node.js + Express + TypeScript
- PostgreSQL + Prisma ORM
- JWT auth (access + refresh token rotation)
- Zod (request validation)
- Stripe (payments), Resend (email)

**Tooling**
- pnpm workspaces (monorepo)
- Docker (local Postgres)
- tsx watch (server dev)

## Architecture

### Three product flows

**1. Appointments (Bookings)** — `/booking` on the frontend, `/api/bookings` on the backend. Clients book time slots for tax services. Slots are 30-minute intervals within `AvailabilitySchedule` records (Mon–Fri 9–5 by default). Bookings can be guest (no account) or linked to a `User`.

**2. Annual Report Filings** — `/annual-report` on the frontend, `/api/annual-reports` on the backend. Clients submit Florida annual report data for business entities, pay via Stripe, and the admin processes/submits the filing. Fees are calculated from entity type and filing date.

**3. Florida LLC Formation** — `/llc-formation` on the frontend, `/api/llc-formations` on the backend. Clients fill a 4-step wizard (business info → addresses → management structure → review & pay), pay $175 ($125 state fee + $50 service fee) via Stripe, and the admin manually files Articles of Organization with Sunbiz. Status pipeline: `PENDING → PAYMENT_RECEIVED → IN_PROGRESS → SUBMITTED → COMPLETED`.

### Client Pre-fill Flow

Admin creates a `Client` record with `ClientSunbizData` (business data from Florida Sunbiz), then generates a `PrefillToken`. A link with that token is sent to the client, which pre-populates the annual report form. Tokens support external payment confirmation (cash, check, etc.) bypassing Stripe.

Routes: `GET /api/prefill/:token` (load form data), `POST /api/annual-reports` (submit), `POST /api/payments/create-payment-intent` (Stripe annual reports), `POST /api/payments/create-llc-payment-intent` (Stripe LLC formations).

### Auth Flow

- Access token: 15-minute JWT, stored in Zustand + `localStorage` via `persist` middleware
- Refresh token: 7-day JWT, stored in `HttpOnly` cookie
- `apps/client/src/lib/api.ts` handles silent refresh: on 401, calls `/api/auth/refresh` then retries original request
- Role enum values are **uppercase**: `ADMIN`, `STAFF`, `CLIENT` — always compare against uppercase

### Admin Section

Protected by `authMiddleware` + `adminMiddleware` (both `ADMIN` and `STAFF` roles pass). Routes under `/admin/*` on the frontend use `AdminRoute` guard component. Admin can manage:
- **Clients** — `Client` records and `PrefillToken` generation
- **Annual Reports (Filings)** — view/update `AnnualReportFiling` status, add admin notes
- **Appointments** — view/update `Booking` status (Confirm, Complete, Cancel, No Show)
- **LLC Formations** — view/update `LLCFormation` status, add admin notes

### Backend Conventions

- All route files in `apps/server/src/api/<domain>/` with `.controller.ts` / `.routes.ts` / `.service.ts`
- Controllers wrap async handlers via `asyncHandler` utility (no try/catch needed in controllers)
- Throw `ApiError.badRequest()`, `ApiError.unauthorized()`, `ApiError.notFound()` etc. — error middleware handles response
- All responses: `{ success: boolean, data?: T, error?: { code, message } }`
- ESM modules — TypeScript imports must use `.js` extensions (e.g. `import from './auth.service.js'`)
- Admin sub-routes mount under `apps/server/src/api/admin/admin.routes.ts`

## Key Files

| Purpose | Location |
|---------|----------|
| Database schema | `vault1040/apps/server/prisma/schema.prisma` |
| Server entry + route mounting | `vault1040/apps/server/src/app.ts` |
| Auth middleware | `vault1040/apps/server/src/middleware/auth.middleware.ts` |
| Admin routes index | `vault1040/apps/server/src/api/admin/admin.routes.ts` |
| Axios client + token refresh | `vault1040/apps/client/src/lib/api.ts` |
| Auth Zustand store | `vault1040/apps/client/src/features/auth/store/authStore.ts` |
| Route definitions | `vault1040/apps/client/src/App.tsx` |
| Admin layout + sidebar | `vault1040/apps/client/src/pages/Admin/AdminLayout.tsx` |
| LLC formation page | `vault1040/apps/client/src/pages/LLCFormation/LLCFormationPage.tsx` |
| LLC formation API | `vault1040/apps/server/src/api/llc-formations/llc-formations.controller.ts` |
| LLC admin API | `vault1040/apps/server/src/api/admin/llc-formations/llc-formations.controller.ts` |
| Services icons map | `vault1040/apps/client/src/data/services.ts` |

## Environment Variables

### Server (`vault1040/apps/server/.env`)
- `DATABASE_URL` — PostgreSQL connection string
- `JWT_ACCESS_SECRET` / `JWT_REFRESH_SECRET` — JWT signing keys
- `CLIENT_URL` — frontend URL for CORS (`http://localhost:5173`)
- `STRIPE_SECRET_KEY` / `STRIPE_WEBHOOK_SECRET` — Stripe keys
- `RESEND_API_KEY` — transactional email via Resend

### Client (`vault1040/apps/client/.env`)
- `VITE_API_URL` — backend API URL (`http://localhost:3001/api`)
- `VITE_STRIPE_PUBLISHABLE_KEY`

### Local database
```bash
docker start vault-postgres
# or create: docker run --name vault-postgres -e POSTGRES_PASSWORD=password -e POSTGRES_DB=vault1040 -p 5432:5432 -d postgres:16
```

### Production database (Render)
| Field | Value |
|-------|-------|
| Host | `dpg-d6jgh9vgi27c73d4k1r0-a.oregon-postgres.render.com` |
| Port | `5432` |
| Database | `vault1040` |
| Username | `vault1040_user` |
| Password | `ShjzFT264MSapcUdZv9Vecdx8JNkPbT8` |
| SSL | Required |

## Design System

- Primary Green: `#00d88d` — Tailwind class `text-primary` / `bg-primary`
- Dark Navy: `#0d0a24` — Tailwind class `text-navy` / `bg-navy`
- Slate Blue: `#32425B`
- Font: Poppins (Google Fonts)

## Seed Accounts

| Role | Email | Password |
|------|-------|----------|
| Admin | `admin@vault1040.com` | `Admin123!` |
| Staff | `staff@vault1040.com` | `Staff123!` |
| Client | `client@example.com` | `Client123!` |
