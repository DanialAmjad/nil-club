# Quick Start Guide - NIL Club

## 🚀 Get Started in 5 Minutes

### Step 1: Prerequisites
- Node.js 18+
- pnpm 9+ (or npm/yarn)
- Neon PostgreSQL account (free at https://neon.tech)

### Step 2: Clone & Install

```bash
# Navigate to project directory
cd nil-club

# Install dependencies
pnpm install
```

### Step 3: Set Up Database

1. Sign up at https://neon.tech (free tier)
2. Create a PostgreSQL database
3. Copy your connection string
4. Create `.env` file in root:

```env
DATABASE_URL=postgresql://user:password@ep-xxxx.us-east-1.neon.tech/nile_club
```

5. Create `.env` in `packages/database/`:

```env
DATABASE_URL=postgresql://user:password@ep-xxxx.us-east-1.neon.tech/nile_club
```

### Step 4: Seed the Database

```bash
cd packages/database
pnpm build
pnpm db:seed
```

You should see:
```
🌱 Starting seed...
✓ Cleared existing data
✓ Seeded 5 athletes
✓ Seeded 9 deals
✓ Seeded 20+ payments
✨ Seed completed successfully!
```

### Step 5: Start Everything

From the root directory:

```bash
pnpm dev
```

This will:
- Start API on `http://localhost:3001`
- Start mobile dev server

### Step 6: Test the API

Open browser or use curl:

```bash
# Get all athletes
curl http://localhost:3001/api/athletes

# Get athlete 1's earnings
curl http://localhost:3001/api/athletes/1/earnings
```

### Step 7: Run Mobile App

In the mobile dev server:
- Press `i` for iOS simulator
- Press `a` for Android emulator  
- Press `w` for web preview

---

## 🧪 Test the Features

**On Earnings Screen**:
- See athlete profile (Marcus Johnson)
- View total earnings ($10k+) and pending ($5k+)
- See list of active deals
- Tap a deal to see payment details

**On Deal Details**:
- View deal value breakdown
- See payment progress bar
- Check individual payment history

---

## ❓ Troubleshooting

| Problem | Solution |
|---------|----------|
| `DATABASE_URL is not set` | Create `.env` in `packages/database/` |
| Port 3001 in use | Change port in `apps/api/package.json` |
| Mobile can't reach API | Check `EXPO_PUBLIC_API_URL` in `apps/mobile/.env` |
| Seed fails | Delete `drizzle/` folder and try again |

---

## 📚 Learn More

- [Full README](./README.md) - Complete documentation
- [CLAUDE.md](./CLAUDE.md) - Architecture & decisions
- [API Endpoints](./README.md#api-endpoints) - Full endpoint reference

---

**Happy coding! 🎉**
