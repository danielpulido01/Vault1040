# Vault1040 — Project Scope

Tax services platform for vault1040.com. Handles two core workflows: consultation bookings and Florida annual report filings.

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18, TypeScript, Vite, Tailwind CSS, React Router v6, Zustand, TanStack Query |
| Backend | Node.js, Express, TypeScript (ESM) |
| Database | PostgreSQL via Prisma ORM |
| Auth | JWT (15m access + 7d refresh, HTTP-only cookie) |
| Payments | Stripe (PaymentIntents + Webhooks) |
| Email | Resend (fallback: Mailchimp/Mandrill) |
| Hosting | Render (server + DB), Vite dev on port 5173 |

---

## Frontend Routes

### Public
| Route | Page |
|-------|------|
| `/` | Home — hero, services overview, testimonials, CTA |
| `/services` | Services listing |
| `/about` | About page |
| `/faq` | FAQ |
| `/contact` | Contact form |
| `/booking` | Multi-step consultation booking wizard |
| `/annual-report` | Multi-step annual report filing form |
| `/annual-report?token=<t>` | Pre-filled annual report via prefill token |

### Auth
| Route | Page |
|-------|------|
| `/login` | Login |
| `/register` | Registration |
| `/forgot-password` | Password reset request |
| `/reset-password` | Password reset with token |

### Authenticated
| Route | Page |
|-------|------|
| `/dashboard` | User's booking history |

### Admin (ADMIN + STAFF roles)
| Route | Page |
|-------|------|
| `/admin` | Dashboard — stats + recent activity |
| `/admin/clients` | Client list with search |
| `/admin/clients/:id` | Client detail — edit info, manage Sunbiz data, generate tokens, confirm payments |
| `/admin/clients/new` | Create new client |
| `/admin/filings` | Annual report filings — search, filter by status, stats |
| `/admin/filings/:id` | Filing detail — update status, add notes |
| `/admin/appointments` | Booking list — update status |

---

## Backend API

### Auth — `/api/auth`
- `POST /register` — create account
- `POST /login` — returns access token + sets refresh cookie
- `POST /logout` — revoke refresh token
- `POST /refresh` — exchange refresh cookie for new access token
- `POST /forgot-password` — send reset email
- `POST /reset-password` — reset with token
- `GET /me` — current user

### Users — `/api/users` (authenticated)
- `GET /profile`, `PUT /profile` — profile CRUD
- `PUT /password` — change password

### Services — `/api/services` (public)
- `GET /` — all active services
- `GET /:slug` — single service

### Bookings — `/api/bookings`
- `GET /available-slots?date=&serviceId=` — open time slots (public)
- `POST /` — create booking (guest or authenticated)
- `GET /` — user's bookings (authenticated)
- `GET /confirmation/:code` — lookup by confirmation code (public)
- `POST /:id/cancel` — cancel booking (authenticated)

### Contacts — `/api/contacts` (public)
- `POST /` — submit contact form

### Annual Reports — `/api/annual-reports`
- `POST /` — submit filing (guest or authenticated; accepts `prefillTokenId`, `paymentIntentId`)
- `GET /` — user's filings (authenticated)
- `GET /:id` — single filing

### Payments — `/api/payments`
- `GET /config` — Stripe publishable key
- `POST /create-payment-intent` — creates Stripe PaymentIntent, calculates fees
- `GET /payment-intent/:id` — check PaymentIntent status
- `POST /webhook` — Stripe webhook (handles `payment_intent.succeeded`, `payment_intent.payment_failed`)

### Prefill — `/api/prefill` (public)
- `GET /:token` — validate token, return Sunbiz data, mark as used
- `GET /token-status/:tokenId` — expiration and payment status

### Admin — `/api/admin` (ADMIN or STAFF)

**Clients**
- `GET /clients` — search/paginate clients
- `POST /clients` — create client
- `GET /clients/:id` — client detail with Sunbiz data, tokens, related filings
- `PUT /clients/:id` — update client
- `DELETE /clients/:id` — delete client
- `POST /clients/:id/sunbiz` — upsert Sunbiz data for a report year
- `GET /clients/:id/sunbiz/:year` — Sunbiz data for a year
- `POST /clients/:id/generate-token` — create prefill token + draft filing
- `POST /clients/:id/send-email` — send prefill invitation email
- `POST /clients/:id/confirm-payment` — confirm external payment on a token
- `POST /clients/:id/revoke-payment` — revoke external payment confirmation
- `GET /clients/sunbiz-lookup?documentNumber=` — Sunbiz lookup URL helper

**Filings**
- `GET /filings` — search/filter/paginate all filings
- `GET /filings/stats` — counts by status + total revenue
- `GET /filings/:id` — filing detail
- `PATCH /filings/:id` — update status / admin notes

**Bookings**
- `GET /bookings` — all bookings
- `GET /bookings/stats` — booking counts by status
- `PATCH /bookings/:id/status` — update booking status

---

## Database Models

| Model | Purpose |
|-------|---------|
| `User` | Accounts with roles (CLIENT, ADMIN, STAFF) |
| `RefreshToken` | Active refresh tokens with revocation |
| `Service` | Consultation service offerings |
| `Booking` | Scheduled consultation appointments |
| `AvailabilitySchedule` | Day-of-week time blocks for slots |
| `BlockedDate` | Dates with no availability |
| `ContactSubmission` | Contact form entries |
| `AnnualReportFiling` | Core filing record — entity data, fees, status, payment |
| `Client` | Admin-managed client records for prefill workflow |
| `ClientSunbizData` | Sunbiz data per client per report year |
| `PrefillToken` | Secure tokens linking Sunbiz data to a filing link |

---

## Product Flows

### Consultation Booking
1. Client selects service and date/time from available slots
2. Enters name, email, phone (guests allowed)
3. Booking created with unique confirmation code
4. Admin views in `/admin/appointments`, updates status (Confirmed → Completed / No Show)

### Annual Report Filing (Direct)
1. Client visits `/annual-report` and fills multi-step form:
   - Entity info (document number, entity type, business name, FEIN)
   - Addresses (principal office, mailing, registered agent)
   - Officers / LLC members / LP partners (varies by entity type)
   - Review + Stripe payment
2. Stripe PaymentIntent created with calculated fees
3. On payment success (webhook), filing status → `PAYMENT_RECEIVED`
4. Admin processes filing and updates status through to `COMPLETED`

### Annual Report Filing (Admin Prefill)
1. Admin creates **Client** record with contact details
2. Admin enters **Sunbiz data** for the report year (entity info, addresses, personnel)
3. Admin clicks **Generate Token** → creates secure 30-day prefill link + draft filing (`LINK_SENT`)
4. Admin sends prefill invitation email (Resend) or copies URL manually
5. Client clicks link → form pre-populates from Sunbiz data
6. Client reviews data, pays via Stripe **or** admin pre-confirms external payment (cash, check, subscription, wire, ACH)
7. Client submits → filing updated, token marked as submitted

### Fee Calculation
| Entity Type | State Fee |
|-------------|-----------|
| Profit Corporation | $150.00 |
| Non-Profit Corporation | $61.25 |
| LLC | $138.75 |
| Limited Partnership | $500.00 |
| LLLP | $500.00 |

- **Service fee**: $50.00 (always)
- **Late fee**: $400.00 if submitted after May 1 (non-profits exempt)

---

## Filing Statuses

```
LINK_SENT → PENDING → PAYMENT_RECEIVED → IN_PROGRESS → SUBMITTED → COMPLETED
                                                                  ↘ CANCELLED
```

---

## Auth Model
- Access token: 15-min JWT, stored in Zustand + `localStorage`
- Refresh token: 7-day JWT, HTTP-only cookie
- Silent refresh on 401 in API client before retrying original request
- Roles: `ADMIN`, `STAFF`, `CLIENT` (uppercase in DB)
- Admin middleware passes both ADMIN and STAFF

---

## What Is Not Built Yet
- Email verification flow (tokens exist in schema, not wired up)
- Automated Sunbiz data scraping (admin enters data manually)
- Client-facing account portal (clients have no login dashboard yet)
- Booking reminder emails (`reminderSentAt` field exists, not sent)
- Test suite
- CI/CD pipeline
