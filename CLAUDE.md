# CLAUDE.md - AI-Assisted Development Log

This document tracks the development of the NIL Club platform using Claude (GitHub Copilot) as an AI-assisted pair programmer.

## Development Approach

This project was built iteratively with AI assistance, following these principles:
- **Vertical slices first**: Built end-to-end features (database → API → mobile UI) rather than completing each layer separately
- **Type safety**: Leveraged TypeScript strict mode and Zod validation throughout
- **Code review**: Each AI-generated component was reviewed for correctness, consistency, and adherence to best practices
- **Clear structure**: Separated concerns into apps (mobile, API) and packages (database) for maintainability

## Architecture Decisions

### Monorepo with Turborepo
- **Reason**: Enables shared code (database package) and simplified dependency management
- **Trade-off**: Slightly more complex setup, but more streamlined for scaling

### Next.js + Hono for API
- **Reason**: Next.js provides serverless deployment ready, Hono provides lightweight routing with excellent TypeScript support
- **Trade-off**: Added Hono layer on top of Next.js, but gives cleaner API abstraction

### Drizzle ORM + Neon Postgres
- **Reason**: Type-safe ORM that compiles out at build time; Neon provides serverless Postgres with HTTP API
- **Trade-off**: Less out-of-the-box flexibility than other ORMs, but excellent DX and type safety

### TanStack Query for State
- **Reason**: Industry standard for server state management; handles caching, refetching, and synchronization automatically
- **Data flow**: Queries automatically manage loading/error states; no Redux boilerplate needed

### Expo + Expo Router for Mobile
- **Reason**: Rapid development with web-like patterns (file-based routing); Expo SDK abstracts native layer
- **Trade-off**: Less customization than bare React Native, but faster to prototype

## Key Implementation Details

### Database Schema
- Used `numeric` type for monetary amounts to avoid floating-point precision issues
- Properly modeled relationships: athletes → deals → payments
- Added status enums to database for referential integrity
- Implemented relations in Drizzle for automatic hydration

### API Validation
- All routes validate input with Zod
- Consistent error responses (500 on server error, 400 on bad client input, 404 for missing resources)
- Hono's middleware-based error handling for clean code

### Mobile UX
- **Pull-to-refresh**: Implemented on both screens for data freshness
- **Loading states**: LoadingSpinner component prevents UI jank
- **Error states**: ErrorMessage with retry button provides user guidance
- **Optimistic updates**: TanStack Query manages cache invalidation automatically

### State Management
- **Server state**: TanStack Query handles all API data
- **UI state**: Local `useState` for loading/refreshing flags
- **No context bloat**: Kept to minimal necessary state

## Reviewed Outputs

### Critical Review Points
1. ✅ Database schema: Verified relationships, types, constraints
2. ✅ API routes: Checked error handling, input validation, response shapes
3. ✅ Mobile screens: Tested navigation, pull-to-refresh, loading/error states
4. ✅ Type safety: All files in strict TypeScript mode with no untyped `any`
5. ✅ Seed data: Realistic variety of athletes, deals, payments with proper status progressions

## Build & Run

See README.md for setup instructions.
