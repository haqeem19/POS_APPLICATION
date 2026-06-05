# Maintenance Document POS Application

## 1. Ringkasan

Dokumen ini menjelaskan panduan maintenance POS Application, termasuk environment, deployment, backup, monitoring, troubleshooting, change management, dan risiko teknis.

## 2. System Overview

| Area | Detail |
| --- | --- |
| Frontend | React + Vite |
| Backend | Laravel API |
| Database | PostgreSQL/Supabase |
| API Format | REST JSON |
| Browser Feature | Web Bluetooth untuk thermal printer BLE ESC/POS |
| Documentation | Markdown + OpenAPI/Swagger YAML |

## 3. Environment

### 3.1 Backend

Requirement:

- PHP 8.3 atau lebih baru.
- Composer.
- Laravel runtime.
- PostgreSQL connection string.

File konfigurasi:

| File | Fungsi |
| --- | --- |
| `backend/.env` | Konfigurasi Laravel dan database |
| `backend/config/database.php` | Konfigurasi koneksi database |
| `backend/config/cors.php` | Konfigurasi CORS |

Contoh environment database:

```env
DB_CONNECTION=pgsql
DB_HOST=db.<project-ref>.supabase.co
DB_PORT=5432
DB_DATABASE=postgres
DB_USERNAME=postgres
DB_PASSWORD=<database-password>
```

### 3.2 Frontend

Requirement:

- Node.js 20 atau lebih baru.
- npm.

File konfigurasi:

| File | Fungsi |
| --- | --- |
| `frontend/.env` | Base URL API frontend dan password gate |
| `frontend/.env.example` | Contoh environment frontend |

Contoh:

```env
VITE_API_BASE_URL=http://127.0.0.1:8000/api
VITE_APP_PASSWORD=devpos2026
```

Catatan:

- `VITE_APP_PASSWORD` adalah static password frontend untuk akses internal/dev. Nilai ini akan masuk ke bundle frontend, sehingga bukan pengganti autentikasi backend.
- Untuk deploy di Vercel, isi `VITE_API_BASE_URL` dan `VITE_APP_PASSWORD` pada Environment Variables.
- Web Bluetooth membutuhkan HTTPS atau localhost; Vercel sudah menyediakan HTTPS.

## 4. Standard Maintenance Schedule

| Frekuensi | Aktivitas | Owner |
| --- | --- | --- |
| Harian | Cek API, dashboard, transaksi, stok rendah | Admin/Owner |
| Harian | Cek error operasional dari user | Admin |
| Mingguan | Review data produk, stok, dan transaksi abnormal | Owner/Admin |
| Mingguan | Backup/export database jika tidak otomatis | Technical maintainer |
| Bulanan | Review dependency dan security update | Technical maintainer |
| Bulanan | Review kebutuhan fitur baru dan bug backlog | Product owner |

## 5. Backup and Restore

### 5.1 Backup Database

Jika menggunakan Supabase:

- Aktifkan backup sesuai plan Supabase.
- Untuk project penting, lakukan export manual berkala.
- Simpan backup di lokasi terpisah.

Data kritikal:

| Table | Alasan |
| --- | --- |
| products | Master produk dan stok |
| sales | Header transaksi |
| sale_items | Detail transaksi |
| stock_movements | Riwayat perubahan stok |
| customers | Data pelanggan |
| suppliers | Data supplier |
| categories | Struktur produk |

### 5.2 Restore Database

Prosedur restore harus dilakukan hati-hati:

1. Pastikan aplikasi tidak sedang digunakan.
2. Backup database saat ini sebelum restore.
3. Restore database dari backup yang dipilih.
4. Jalankan pengecekan data utama.
5. Cek dashboard, produk, transaksi, dan stock movement.
6. Dokumentasikan waktu dan alasan restore.

Risiko:

- Restore dapat menghapus transaksi setelah waktu backup.
- Restore tanpa audit dapat membuat perbedaan stok fisik dan sistem.

## 6. Deployment Procedure

### 6.1 Backend Deployment

1. Pull/update source code.
2. Install dependency backend jika berubah.
3. Pastikan `.env` benar.
4. Jalankan migration jika ada perubahan database.
5. Restart service backend.
6. Test endpoint `/api/health`.
7. Test endpoint `/api/dashboard`.

Command referensi:

```bash
cd backend
composer install
php artisan migrate
php artisan serve
```

Catatan:

- Untuk production, jangan gunakan `php artisan serve` sebagai runtime utama.
- Gunakan web server seperti Nginx/Apache atau platform hosting yang mendukung Laravel.

### 6.2 Frontend Deployment

1. Pastikan `VITE_API_BASE_URL` mengarah ke API yang benar.
2. Install dependency jika berubah.
3. Build frontend.
4. Deploy hasil build ke hosting.
5. Test akses aplikasi dari browser.
6. Test password gate dan language toggle.
7. Jika memakai printer, test cetak struk dari popup transaksi dan riwayat transaksi pada browser/device yang akan digunakan operasional.

Command referensi:

```bash
cd frontend
npm install
npm run build
```

## 7. Monitoring

| Area | Yang Dimonitor | Indikator Masalah |
| --- | --- | --- |
| API health | `/api/health` | Tidak return status ok |
| Dashboard | `/api/dashboard` | Kosong padahal ada data |
| Database | Koneksi PostgreSQL | Error connection refused/timeout |
| Transaksi | Create sales | Banyak error 422 atau transaksi gagal |
| Stok | stock_quantity dan stock_movements | Stok negatif atau history tidak sesuai |
| Frontend | Load aplikasi | Blank page atau API error |
| Password gate | Akses awal frontend | Password salah atau env belum terisi |
| Printer | Cetak struk dari popup/history | Browser tidak support, printer tidak muncul, atau service tidak kompatibel |
| Loading overlay | Aksi async frontend | Overlay tidak hilang atau user melaporkan tombol terasa tidak responsif |

## 8. Troubleshooting

### 8.1 API Tidak Bisa Diakses

Kemungkinan penyebab:

- Backend belum berjalan.
- URL frontend salah.
- CORS belum sesuai.
- Database tidak bisa diakses.

Langkah cek:

1. Buka `/api/health`.
2. Cek log backend.
3. Cek konfigurasi `.env`.
4. Cek koneksi database.
5. Cek CORS jika error terjadi dari browser.

### 8.2 Transaksi Gagal

Kemungkinan penyebab:

- Produk tidak aktif.
- Stok tidak cukup.
- Pembayaran kurang.
- Diskon melebihi subtotal.
- Payload item tidak valid.

Langkah cek:

1. Cek response error API.
2. Cek stok produk.
3. Cek status produk.
4. Cek total, diskon, pajak, dan paid amount.

### 8.3 Stok Tidak Sesuai

Kemungkinan penyebab:

- Ada stock movement manual yang salah.
- Ada transaksi salah input.
- Koreksi stok belum dilakukan.
- Tidak ada proses stock opname rutin.

Langkah cek:

1. Cek daftar stock movement produk.
2. Cek transaksi yang menggunakan produk tersebut.
3. Cocokkan dengan stok fisik.
4. Lakukan adjustment dengan catatan jelas.

### 8.4 Dashboard Tidak Sesuai

Kemungkinan penyebab:

- Tanggal server berbeda dari waktu operasional.
- Transaksi belum tersimpan.
- Data transaksi berada di tanggal berbeda.

Langkah cek:

1. Cek timezone aplikasi.
2. Cek `sale_date` pada transaksi.
3. Cek apakah API dashboard menggunakan tanggal yang benar.

### 8.5 Password Gate Bermasalah

Kemungkinan penyebab:

- `VITE_APP_PASSWORD` di environment frontend berbeda dari password yang digunakan.
- Build frontend belum diulang setelah env berubah.
- Browser masih memakai session lama.

Langkah cek:

1. Cek Environment Variables di hosting frontend.
2. Rebuild dan redeploy frontend setelah perubahan env.
3. Logout dari aplikasi atau clear sessionStorage browser.
4. Pastikan password tidak dibagikan ke user yang tidak berkepentingan.

### 8.6 Cetak Struk Bluetooth Gagal

Kemungkinan penyebab:

- Browser tidak mendukung Web Bluetooth.
- Aplikasi tidak dibuka melalui HTTPS atau localhost.
- Printer thermal hanya mendukung Bluetooth Classic/SPP, bukan BLE.
- Printer sedang terkoneksi ke aplikasi/perangkat lain.
- Service atau characteristic printer berbeda dari daftar yang didukung frontend.

Langkah cek:

1. Gunakan Chrome/Edge.
2. Pastikan URL menggunakan HTTPS atau localhost.
3. Pastikan printer menyala, dekat dengan device, dan mode Bluetooth aktif.
4. Coba disconnect printer dari aplikasi lain.
5. Coba cetak dari transaksi lama melalui menu riwayat.
6. Jika tetap gagal, validasi spesifikasi printer apakah mendukung BLE ESC/POS.

### 8.7 Loading Overlay Tidak Hilang

Kemungkinan penyebab:

- Request API sangat lambat atau gagal.
- Browser kehilangan koneksi internet.
- Error frontend tidak tertangkap.

Langkah cek:

1. Tunggu beberapa detik untuk memastikan request bukan hanya lambat.
2. Cek console browser jika overlay tidak hilang.
3. Cek log backend dan network request.
4. Refresh browser sebagai langkah pemulihan terakhir.
5. Jika berulang, tambahkan timeout handling atau error boundary pada frontend.

## 9. Data Integrity Control

| Area | Kontrol |
| --- | --- |
| Penjualan | Menggunakan database transaction |
| Produk saat transaksi | Menggunakan row lock untuk mencegah race condition stok |
| Stok negatif | Ditolak oleh business logic |
| Diskon berlebihan | Ditolak oleh business logic |
| Invoice | Dibuat unik oleh sistem |

Catatan kritis:

- Belum ada audit user. Perubahan data belum bisa dikaitkan ke user tertentu.
- Belum ada soft delete. Delete dapat berdampak pada histori tergantung relasi database.

## 10. Change Management

Setiap perubahan fitur sebaiknya melewati tahapan:

1. Catat requirement atau bug.
2. Klasifikasikan sebagai bug, enhancement, atau new feature.
3. Analisis dampak ke proses, API, database, UI, dan dokumentasi.
4. Implementasi di branch terpisah jika memakai Git workflow.
5. Test minimal sesuai area terdampak.
6. Update dokumentasi jika API, SOP, atau workflow berubah.
7. Deploy.
8. Monitor setelah deploy.

## 11. Testing Checklist

| Area | Test |
| --- | --- |
| Health | `/api/health` return ok |
| Product | Create produk baru |
| Stock in | Stok bertambah |
| Stock out | Stok berkurang |
| Stock adjustment | Stok menjadi nilai input |
| Sale | Transaksi berhasil dengan item valid |
| Sale stock | Stok produk berkurang setelah transaksi |
| Sale validation | Transaksi ditolak jika stok kurang |
| Dashboard | Summary berubah setelah transaksi |
| Password gate | Aplikasi tidak terbuka sebelum password valid |
| Language | Menu, tombol, pesan feedback berubah saat bahasa diganti |
| Receipt popup | Popup muncul setelah transaksi berhasil |
| Receipt reprint | Tombol cetak struk tersedia di riwayat transaksi |
| Bluetooth print | Struk tercetak pada printer BLE ESC/POS yang tervalidasi |
| Loading overlay | Overlay tampil saat refresh, submit, dan print, lalu hilang setelah proses selesai |
| Transaction input UX | Placeholder tampil, select placeholder disabled, diskon/pajak persen, harga comma-separated, quantity/stok dot-separated |
| History search paging | Search menemukan invoice/pelanggan/produk/SKU/metode/status dan tombol paging berpindah halaman |

## 12. Security Maintenance

Prioritas security untuk production:

| Prioritas | Item |
| --- | --- |
| P0 | Tambahkan autentikasi |
| P0 | Tambahkan role dan authorization |
| P0 | Lindungi credential `.env` |
| P0 | Batasi CORS sesuai domain frontend |
| P1 | Tambahkan audit log |
| P1 | Tambahkan rate limiting untuk endpoint sensitif |
| P1 | Tambahkan backup dan restore drill |

## 13. Documentation Maintenance

Dokumen yang harus diupdate jika ada perubahan:

| Perubahan | Dokumen |
| --- | --- |
| Perubahan tujuan bisnis | BRD |
| Perubahan roadmap/fitur produk | PRD |
| Perubahan requirement fungsional | FRD |
| Perubahan API/arsitektur/NFR | SRS |
| Perubahan screen/workflow/validasi | FSD |
| Perubahan database | ERD |
| Perubahan endpoint API | API-SWAGGER.yaml |
| Perubahan prosedur operasional | SOP |
| Perubahan deployment/monitoring | Maintenance |
| Perubahan printing/browser hardware | FSD, SRS, SOP, Maintenance |

## 14. Known Risks

| Risiko | Dampak | Rekomendasi |
| --- | --- | --- |
| Static password frontend bukan auth penuh | Akses API belum terkendali dan password bisa terlihat di bundle frontend | Wajib tambahkan auth backend sebelum production serius |
| Tidak ada audit trail | Perubahan data sulit ditelusuri | Tambahkan audit_logs dan user_id |
| Tidak ada automated test | Regression sulit dideteksi | Tambahkan test backend untuk sale dan stock |
| Tidak ada closing kas | Rekonsiliasi harian manual | Tambahkan shift dan cash closing |
| Tidak ada refund/void | Koreksi transaksi manual | Tambahkan fitur correction dengan approval |
| Printer Bluetooth tidak kompatibel | Struk tidak dapat dicetak dari browser | Standarisasi printer BLE ESC/POS atau buat fallback print lain |
