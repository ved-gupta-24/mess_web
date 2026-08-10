# Hostel Mess Web

React frontend + Express backend + Supabase PostgreSQL.

## Setup (local)

### 1. Install dependencies

```bash
npm run install:all
```

### 2. Configure environment

Create `server/.env`:

```env
DATABASE_URL=postgresql://postgres:YOUR_PASSWORD@db.xxxx.supabase.co:5432/postgres
JWT_SECRET=some-long-random-string
PORT=3001
CORS_ORIGIN=http://localhost:5173
ADMIN_EMAIL=admin@mess.local
ADMIN_PASSWORD=changeme123
```

Create `client/.env`:

```env
VITE_API_URL=http://localhost:3001
```

### 3. Run database migration & seed admin

```bash
npm run migrate
npm run seed
```

### 4. Start dev servers

In two terminals:

```bash
npm run dev:server   # http://localhost:3001
npm run dev:client   # http://localhost:5173
```

## Student features (no login)

- View daily/weekly menus
- Read announcements
- Vote in polls (roll no: 2 letters + 7 digits, e.g. `cs1240384`)
- Submit & track feedback (invalid roll = silently ignored)

## Admin

- Login at `/admin/login`
- Default credentials from `ADMIN_EMAIL` / `ADMIN_PASSWORD` in `.env`

## Deploy

- **Client** → Vercel (root: `client/`)
- **Server** → Render (root: `server/`)
- Set env vars on both platforms
