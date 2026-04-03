# NIL Club - Athlete Earnings Platform

A full-stack platform for student-athletes to monetize their Name, Image, and Likeness (NIL) through brand deals and track their earnings over time.

## Overview

NIL Club provides:
- **Athlete Profile Management**: View your profile, sport, and school
- **Brand Deal Tracking**: See all active, pending, and completed brand deals
- **Earnings Dashboard**: Track total earnings, pending payments, and deal details
- **Payment History**: Detailed payment records for each deal with status tracking
- **Real-time Sync**: Pull-to-refresh to get latest earnings and payment data

## Tech Stack

| Layer | Technology | Version |
|-------|-----------|---------|
| **Monorepo** | Turborepo | ^2.3.0 |
| **Mobile** | React Native + Expo | 0.76 / 54.0 |
| **Routing** | Expo Router | ^4.0.0 |
| **API** | Next.js + Hono | 16.0 / 4.1 |
| **Validation** | Zod | ^3.22.4 |
| **Database** | Drizzle ORM | ^0.30.10 |
| **Database Driver** | @neondatabase/serverless | ^0.9.2 |
| **State Management** | TanStack Query | ^5.45.1 |
| **Language** | TypeScript | ^5.4.5 |

## Project Structure

```
nil-club/
├── apps/
│   ├── mobile/              # React Native + Expo app
│   │   ├── app/             # Expo Router pages
│   │   │   ├── _layout.tsx  # Root layout with Query setup
│   │   │   ├── index.tsx    # Earnings Overview screen
│   │   │   └── deal/[id].tsx # Deal Detail screen
│   │   ├── components/      # Reusable UI components
│   │   ├── lib/             # API client, utilities
│   │   └── app.json         # Expo config
│   │
│   └── api/                 # Next.js API server
│       ├── src/app/         # Next.js App Router
│       │   ├── layout.tsx
│       │   ├── page.tsx
│       │   └── api/[[...route]]/route.ts  # Hono routes handler
│       └── src/lib/         # Hono router definition
│
├── packages/
│   └── database/            # Drizzle ORM + migrations
│       ├── src/
│       │   ├── schema.ts    # Table definitions & relations
│       │   ├── db.ts        # Database client
│       │   ├── queries.ts   # Query helpers
│       │   └── seed.ts      # Seed script
│       └── drizzle.config.ts
│
├── turbo.json               # Turborepo config
├── package.json             # Root package
└── pnpm-workspace.yaml      # Workspace config
```

## Quick Start

### Prerequisites

- **Node.js** 18.x or higher
- **pnpm** 9.x (or npm@10.x / yarn 4.x)
- **Neon** PostgreSQL account (free tier available at https://neon.tech)

### 1. Clone and Install

```bash
# Clone the repository
git clone <repo-url>
cd nil-club

# Install dependencies
pnpm install
```

### 2. Set Up Database

Create a Neon PostgreSQL database:

1. Go to https://neon.tech and sign up (free tier)
2. Create a new project and copy the connection string
3. Create a `.env` file in the root:

```bash
# .env (root level)
DATABASE_URL=postgresql://user:password@ep-xxxx.us-east-1.neon.tech/nile_club
```

4. Create the same file in `packages/database/.env`:

```bash
# packages/database/.env
DATABASE_URL=postgresql://user:password@ep-xxxx.us-east-1.neon.tech/nile_club
```

5. Run migrations and seed:

```bash
cd packages/database
pnpm build
pnpm db:seed
```

### 3. Start the API Server

In one terminal:

```bash
pnpm dev --filter=api
# or
cd apps/api
pnpm dev
```

API runs on `http://localhost:3001`

### 4. Start the Mobile App

In another terminal:

```bash
pnpm dev --filter=mobile
# or
cd apps/mobile
pnpm start
```

Then:
- Press `i` for iOS simulator
- Press `a` for Android emulator
- Press `w` for web preview

## API Endpoints

All endpoints return JSON. Base URL: `http://localhost:3001/api`

### Athletes

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/athletes` | List all athletes |
| GET | `/athletes/:id` | Get athlete profile (includes deals) |
| GET | `/athletes/:id/deals` | Get athlete's deals |
| GET | `/athletes/:id/earnings` | Get earnings summary (total earned, pending, deal count) |

### Deals & Payments

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/deals/:id/payments` | Get payment history for a deal |

### Example Requests

```bash
# List all athletes
curl http://localhost:3001/api/athletes

# Get athlete 1's profile
curl http://localhost:3001/api/athletes/1

# Get athlete 1's earnings summary
curl http://localhost:3001/api/athletes/1/earnings

# Get payments for deal 5
curl http://localhost:3001/api/deals/5/payments
```

### Response Format

All responses include proper HTTP status codes:
- `200`: Success
- `400`: Bad request (invalid parameters)
- `404`: Resource not found
- `500`: Server error

Error responses include a message:

```json
{
  "error": "Failed to fetch athletes"
}
```

## Mobile App Features

### Earnings Overview Screen (Home)

Shows at a glance:
- Athlete name, sport, school
- **Total earned**: Sum of completed payments
- **Pending**: Sum of pending payments
- **Active deals**: Total number of deals
- **Deal list**: Each deal shows brand name, description, deal value, and status

**Interactions**:
- Tap a deal to see payment details
- Pull down to refresh
- Loading spinners during fetch
- Error messages with retry button

### Deal Detail Screen

Shows:
- **Deal value breakdown**: Total, received, pending
- **Payment progress bar**: Visual indicator of completion %
- **Payment history**: List of all payments with amounts, due dates, paid dates, and status
- **Status badges**: Color-coded (green=completed, amber=pending, red=failed)

**Interactions**:
- Pull down to refresh
- Navigate back to overview
- See all payment details including due dates and actual payment dates

## Database Schema

### Athletes Table

```sql
CREATE TABLE athletes (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  sport athlete_sport NOT NULL,
  school VARCHAR(255) NOT NULL,
  bio TEXT,
  image_url VARCHAR(512),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### Deals Table

```sql
CREATE TABLE deals (
  id SERIAL PRIMARY KEY,
  athlete_id INTEGER NOT NULL REFERENCES athletes(id),
  brand_name VARCHAR(255) NOT NULL,
  description TEXT,
  deal_value NUMERIC(12, 2) NOT NULL,
  status deal_status DEFAULT 'active',
  start_date TIMESTAMP WITH TIME ZONE NOT NULL,
  end_date TIMESTAMP WITH TIME ZONE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### Payments Table

```sql
CREATE TABLE payments (
  id SERIAL PRIMARY KEY,
  deal_id INTEGER NOT NULL REFERENCES deals(id),
  amount NUMERIC(12, 2) NOT NULL,
  status payment_status DEFAULT 'pending',
  due_date TIMESTAMP WITH TIME ZONE NOT NULL,
  paid_date TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### Enums

- `athlete_sport`: basketball, football, soccer, volleyball, track, tennis, swimming, other
- `deal_status`: active, pending, completed, cancelled
- `payment_status`: pending, completed, failed, cancelled

## Seed Data

The seed script (`pnpm db:seed`) populates the database with realistic test data:

- **5 athletes** from different sports and schools
- **9 brand deals** with varying values ($4k–$20k)
- **20+ payments** with mixed statuses (completed, pending, failed)

Run it with:

```bash
cd packages/database
pnpm db:seed
```

## Assumptions & Decisions

### Authentication
- **Assumption**: Athletes are already logged in; no auth flow implemented
- **How it works**: App hardcodes `ATHLETE_ID = 1` for demo
- **Production**: Add JWT-based auth to identify current athlete

### Money Handling
- **Decision**: Store all monetary amounts as `NUMERIC(12, 2)` in Postgres
- **Reason**: Avoids floating-point precision issues with currency
- **Client side**: Format with `formatCurrency()` utility for display

### Deal Statuses
- **active**: Deal is ongoing, payments are being made
- **pending**: Deal is signed but hasn't started yet
- **completed**: All payments received, deal is closed
- **cancelled**: Deal was terminated early

### Payment Statuses
- **pending**: Payment is due but not yet received
- **completed**: Payment was successfully received
- **failed**: Payment failed to process
- **cancelled**: Payment was explicitly cancelled

### Device Support

The mobile app is built for:
- ✅ iOS (via Expo)
- ✅ Android (via Expo)
- ⚠️ Web (experimental; full React Native web compatibility unknown)

## Running Locally

### All Services (Recommended)

```bash
pnpm dev
```

This starts:
- API server on port 3001
- Mobile dev server (choose iOS/Android/web when prompted)

### Individual Services

```bash
# Just API
pnpm dev --filter=api

# Just mobile
pnpm dev --filter=mobile

# Just database
cd packages/database && pnpm build && pnpm db:seed
```

## Environment Variables

Create `.env` files in the root and respective app/package directories:

### Root `.env`

```env
DATABASE_URL=postgresql://user:password@host/database
```

### `apps/mobile/.env`

```env
EXPO_PUBLIC_API_URL=http://localhost:3001
```

### `packages/database/.env`

```env
DATABASE_URL=postgresql://user:password@host/database
```

## Troubleshooting

### Database Connection Error

**Error**: `DATABASE_URL is not set`

**Fix**: Ensure `.env` file exists in `packages/database/` with your Neon connection string.

### API Port Already in Use

**Error**: `listen EADDRINUSE :::3001`

**Fix**: Change port in `apps/api/package.json` scripts or kill process on 3001:
```bash
lsof -i :3001
kill -9 <PID>
```

### Mobile App Can't Connect to API

**Error**: Network error when fetching athletes

**Fix**:
1. Ensure API is running on `http://localhost:3001`
2. On iOS simulator: should work by default
3. On Android emulator: use `http://10.0.2.2:3001` or physical machine IP
4. Check `.env` file in `apps/mobile/` has correct `EXPO_PUBLIC_API_URL`

### Seed Data Errors

**Error**: Foreign key constraint violation

**Fix**: Ensure database is freshly created with no existing data:
```bash
cd packages/database
# Delete drizzle migrations if any
rm -rf drizzle/
pnpm db:seed
```

## Code Quality

- **TypeScript Strict Mode**: All files use `strict: true`
- **Validation**: All API inputs validated with Zod
- **Error Handling**: Proper HTTP status codes and messages
- **Formatting**: Consistent spacing and naming conventions
- **Type Safety**: No `any` types; full end-to-end type safety

## Performance Notes

- **API**: Uses Neon serverless Postgres (cold starts possible)
- **Mobile**: TanStack Query caches data for 5 minutes
- **UI**: No unnecessary re-renders; proper React hooks usage

## What's NOT Included (Out of Scope)

- **Authentication**: No login/logout flow
- **Tests**: No unit, integration, or e2e tests
- **Deployment**: Built to run locally; no CI/CD setup
- **Dark mode**: Single light theme only
- **Complex animations**: Functional UI prioritized over visual effects
- **Admin features**: No way to create athletes/deals from app (seed script only)

## Future Enhancements

1. **JWT Auth**: Identify athletes and protect endpoints
2. **Admin Panel**: Create/edit athletes, deals, and payments
3. **Notifications**: Push notifications for upcoming/missed payments
4. **File Uploads**: Avatar images, contract PDFs
5. **Reports**: PDF export of earnings statements
6. **Analytics**: Charts showing earnings trends
7. **Multi-currency**: Support international deals
8. **Offline Mode**: Sync data when reconnected

## Contributing

When adding features:
1. Maintain TypeScript strict mode
2. Add Zod schemas for new API routes
3. Test on both iOS and Android if mobile changes
4. Update this README if adding new endpoints or major features

## Support

For issues or questions:
1. Check the [Troubleshooting](#troubleshooting) section
2. Review [CLAUDE.md](./CLAUDE.md) for architectural decisions
3. See [API Endpoints](#api-endpoints) for endpoint reference

## License

This project is private and for educational purposes.

---

**Last Updated**: March 30, 2026
**Built with**: TypeScript, React Native, Next.js, Drizzle ORM, Neon Postgres, Turborepo
