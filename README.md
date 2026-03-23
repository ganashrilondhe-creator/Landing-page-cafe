# Brew & Co — Cafe Landing Page

A responsive React landing page with reservation functionality, MongoDB Atlas, admin dashboard, and email notifications.

## Setup

### 1. MongoDB Atlas

1. Create a free account at [cloud.mongodb.com](https://cloud.mongodb.com)
2. Create a cluster (free tier)
3. Database Access → Add user (note username/password)
4. Network Access → Add IP (or `0.0.0.0/0` for anywhere)
5. Clusters → Connect → Connect your application → copy the connection string

### 2. Environment variables

```bash
cd server
cp .env.example .env
```

Edit `server/.env`:

| Variable | Description |
|----------|-------------|
| `MONGODB_URI` | Atlas connection string (replace `<password>` with your DB user password) |
| `ADMIN_SECRET` | Secret key to access `/admin` (choose a strong password) |

### 3. Install dependencies

```bash
npm install
cd server && npm install && cd ..
```

### 4. Run the app

**Option A — Two terminals:**

```bash
# Terminal 1: Backend (port 3001)
cd server
npm start

# Terminal 2: Frontend (port 5173)
npm run dev
```

**Option B — One command:**

```bash
npm run dev:all
```

### 5. Open the app

- Frontend: http://localhost:5173  
- Admin: http://localhost:5173/admin (use your `ADMIN_SECRET` as the key)  
- API: http://localhost:3001  

## Features

- **Reservations** — Customers submit via the contact form; data is stored in MongoDB Atlas
- **Admin dashboard** — Go to `/admin`, enter your admin key, and view all reservations
- **In-app notification** — When the admin has the dashboard open, a "New reservation received!" alert appears when a customer submits a reservation (polls every 15 seconds)

## API

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/reservations` | Create a reservation |
| GET | `/api/admin/reservations` | List reservations (requires `X-Admin-Key` header) |

## Production

1. **Build frontend:** `npm run build`
2. **Deploy backend** (e.g. Railway, Render)
3. Set `VITE_API_URL` to your backend URL when building
4. Ensure MongoDB Atlas allows connections from your deployment IP
