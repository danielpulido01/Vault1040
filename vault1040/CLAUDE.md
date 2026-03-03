# Vault1040 - Project Context

## Overview
Tax services website recreation of vault1040.com built with React frontend and Node.js/Express backend.

## Tech Stack

### Frontend (`apps/client`)
- **Framework:** React 18 + Vite + TypeScript
- **State:** Zustand (auth), TanStack Query (server state)
- **Styling:** Tailwind CSS
- **Forms:** React Hook Form + Zod validation
- **Routing:** React Router v6

### Backend (`apps/server`)
- **Runtime:** Node.js + Express + TypeScript
- **Database:** PostgreSQL (via Docker)
- **ORM:** Prisma
- **Auth:** JWT with refresh token rotation (bcryptjs for passwords)
- **Validation:** Zod

## Project Structure
```
vault1040/
├── apps/
│   ├── client/           # React frontend (port 5173)
│   │   ├── src/
│   │   │   ├── components/   # UI components
│   │   │   ├── features/     # Auth, Booking modules
│   │   │   ├── pages/        # Route pages
│   │   │   ├── data/         # Hardcoded content
│   │   │   └── lib/          # API client
│   │   └── ...
│   └── server/           # Express backend (port 3001)
│       ├── prisma/           # Schema & migrations
│       └── src/
│           ├── api/          # Route handlers
│           ├── middleware/   # Auth, validation
│           └── lib/          # Prisma, JWT, password utils
└── packages/
    └── shared/           # (Future) shared types
```

## Running the Project

### Prerequisites
- Node.js 20+
- pnpm (`npm install -g pnpm`)
- Docker Desktop (for PostgreSQL)

### Start Database
```bash
docker start vault-postgres
# Or create new: docker run --name vault-postgres -e POSTGRES_PASSWORD=password -e POSTGRES_DB=vault1040 -p 5432:5432 -d postgres:16
```

### Start Dev Servers
```bash
cd vault1040
pnpm dev          # Runs both client and server
```

### Database Commands
```bash
cd apps/server
pnpm db:migrate   # Run migrations
pnpm db:seed      # Seed initial data
pnpm db:studio    # Open Prisma Studio (localhost:5555)
```

## Key Files

| Purpose | Location |
|---------|----------|
| Database schema | `apps/server/prisma/schema.prisma` |
| API routes | `apps/server/src/api/*/` |
| Auth store | `apps/client/src/features/auth/store/authStore.ts` |
| API client | `apps/client/src/lib/api.ts` |
| Page components | `apps/client/src/pages/` |
| Static content | `apps/client/src/data/` |

## Environment Variables

### Server (`apps/server/.env`)
- `DATABASE_URL` - PostgreSQL connection string
- `JWT_ACCESS_SECRET` / `JWT_REFRESH_SECRET` - JWT signing keys
- `CLIENT_URL` - Frontend URL for CORS (http://localhost:5173)

### Client (`apps/client/.env`)
- `VITE_API_URL` - Backend API URL (http://localhost:3001/api)

## Design System

### Colors
- Primary Green: `#00d88d`
- Dark Navy: `#0d0a24`
- Slate Blue: `#32425B`

### Font
- Poppins (Google Fonts)

## API Endpoints

### Auth (`/api/auth`)
- `POST /register` - Create account
- `POST /login` - Login (returns JWT)
- `POST /logout` - Logout
- `POST /refresh` - Refresh access token
- `POST /forgot-password` - Send reset email
- `POST /reset-password` - Reset with token
- `GET /me` - Get current user

### Bookings (`/api/bookings`)
- `GET /available-slots` - Get open time slots
- `POST /` - Create booking
- `GET /` - Get user's bookings
- `POST /:id/cancel` - Cancel booking

### Other
- `GET /api/services` - List services
- `POST /api/contacts` - Submit contact form

## Conventions

- Use TypeScript strict mode
- Validate all inputs with Zod
- Use Prisma for all database operations
- JWT access tokens expire in 15 minutes
- Refresh tokens stored in HTTP-only cookies
- All API responses follow format: `{ success: boolean, data?: T, error?: { code, message } }`
