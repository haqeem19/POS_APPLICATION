# POS Application

MVP aplikasi POS dengan backend Laravel API dan frontend React.

## Ruang Lingkup

- Master data kategori, produk, pelanggan, dan supplier.
- Manajemen stok melalui stock movements.
- Transaksi penjualan dengan item, diskon, pajak, dan pembayaran.
- Dashboard ringkas untuk omzet, jumlah transaksi, produk rendah stok, dan transaksi terbaru.
- Database PostgreSQL Supabase melalui koneksi Laravel `pgsql`.

## Struktur

```text
backend/   Laravel 13 API
frontend/  React + Vite client
```

## Prasyarat

- PHP 8.3 atau lebih baru.
- Composer.
- Node.js 20 atau lebih baru.
- Project Supabase dengan connection string PostgreSQL.

## Setup Backend

```bash
cd backend
composer install
cp .env.example .env
php artisan key:generate
php artisan migrate --seed
php artisan serve
```

Isi konfigurasi Supabase di `backend/.env`:

```env
DB_CONNECTION=pgsql
DB_HOST=db.<project-ref>.supabase.co
DB_PORT=5432
DB_DATABASE=postgres
DB_USERNAME=postgres
DB_PASSWORD=<database-password>
```

## Setup Frontend

```bash
cd frontend
npm install
npm run dev
```

Jika API Laravel tidak berjalan di `http://127.0.0.1:8000`, ubah:

```env
VITE_API_BASE_URL=http://127.0.0.1:8000/api
```

## Catatan

Environment saat project ini dibuat belum memiliki PHP dan Composer di PATH, sehingga dependency belum bisa di-install dan migration belum bisa dijalankan dari mesin ini.
