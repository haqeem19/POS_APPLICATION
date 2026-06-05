# Deployment Backend dan Frontend ke Vercel

Project ini memakai dua project Vercel terpisah:

```text
Vercel Project 1: POS Backend Laravel API
Vercel Project 2: POS Frontend React/Vite
Database: Supabase PostgreSQL
```

## 1. Catatan Penting

Backend Laravel di Vercel memakai `vercel-php`, yaitu community runtime. Ini bukan official PHP runtime dari Vercel. Cocok untuk demo dan portfolio, tetapi bukan pilihan production paling aman untuk Laravel jangka panjang.

Keterbatasan penting:

- Tidak cocok untuk queue worker long-running.
- Tidak cocok untuk storage file lokal permanen.
- Migration tidak ideal dijalankan dari Vercel.
- Gunakan Supabase PostgreSQL untuk database.
- Jalankan migration dari lokal atau environment lain yang bisa connect ke Supabase.

## 2. Backend Vercel Project

Saat import repository ke Vercel:

| Field | Value |
|---|---|
| Root Directory | `backend` |
| Framework Preset | Other |
| Build Command | Kosongkan/default |
| Output Directory | Kosongkan/default |

Backend sudah memiliki:

- `backend/vercel.json`
- `backend/api/index.php`

## 3. Environment Variables Backend

Set environment variables berikut di Vercel project backend:

```env
APP_NAME="POS Application"
APP_ENV=production
APP_KEY=base64:ISI_APP_KEY
APP_DEBUG=false
APP_URL=https://nama-backend.vercel.app
FRONTEND_URL=https://nama-frontend.vercel.app

LOG_CHANNEL=stack
LOG_LEVEL=error

DB_CONNECTION=pgsql
DB_HOST=db.your-project-ref.supabase.co
DB_PORT=5432
DB_DATABASE=postgres
DB_USERNAME=postgres
DB_PASSWORD=your-supabase-db-password

SUPABASE_URL=https://your-project-ref.supabase.co
SUPABASE_ANON_KEY=your-supabase-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-supabase-service-role-key

CACHE_STORE=array
SESSION_DRIVER=array
QUEUE_CONNECTION=sync
```

Buat `APP_KEY` dari lokal:

```powershell
cd backend
php artisan key:generate --show
```

## 4. Migration Database

Karena backend berjalan sebagai serverless function, jalankan migration dari lokal:

```powershell
cd backend
php artisan migrate --force
php artisan db:seed --force
```

Pastikan `.env` lokal mengarah ke database Supabase yang sama.

## 5. Health Check Backend

Setelah deploy backend berhasil:

```text
https://nama-backend.vercel.app/api/health
```

Response yang benar:

```json
{"status":"ok"}
```

## 6. Frontend Vercel Project

Import repository yang sama sebagai project Vercel kedua:

| Field | Value |
|---|---|
| Root Directory | `frontend` |
| Framework Preset | Vite |
| Build Command | `npm run build` |
| Output Directory | `dist` |

Environment variables frontend:

```env
VITE_API_BASE_URL=https://nama-backend.vercel.app/api
VITE_APP_PASSWORD=ISI_PASSWORD_DEMO
```

## 7. Setelah Frontend Deploy

Setelah frontend punya domain Vercel, update environment variable backend:

```env
FRONTEND_URL=https://nama-frontend.vercel.app
```

Redeploy backend setelah update `FRONTEND_URL`.
