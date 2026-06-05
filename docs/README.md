# POS Application Documentation

Dokumentasi ini memisahkan kebutuhan bisnis, kebutuhan produk, kebutuhan fungsional, spesifikasi sistem, spesifikasi fitur, rancangan data, operasional, dan maintenance untuk POS Application.

## Daftar Dokumen

| Dokumen | Fokus | File |
| --- | --- | --- |
| BRD | Masalah bisnis, tujuan bisnis, stakeholder, scope bisnis | [BRD.md](BRD.md) |
| PRD | Arah produk, target user, value proposition, roadmap, KPI | [PRD.md](PRD.md) |
| FRD | Functional requirement per modul dan aturan bisnis | [FRD.md](FRD.md) |
| SRS | Spesifikasi sistem, API, arsitektur, non-functional requirement | [SRS.md](SRS.md) |
| FSD | Detail fitur, screen, workflow, validasi, acceptance criteria | [FSD.md](FSD.md) |
| ERD | Entity relationship dan struktur data | [ERD.md](ERD.md) |
| SOP | Prosedur penggunaan aplikasi untuk operasional harian | [SOP.md](SOP.md) |
| API Swagger | Spesifikasi API berbasis OpenAPI/Swagger | [API-SWAGGER.yaml](API-SWAGGER.yaml) |
| Maintenance | Panduan maintenance aplikasi, database, deployment, dan incident handling | [MAINTENANCE.md](MAINTENANCE.md) |

## Status

- Versi dokumen: 0.2
- Tanggal: 2026-06-04
- Basis analisis: MVP aplikasi POS dengan backend Laravel API, frontend React, dan database PostgreSQL/Supabase.
- Catatan: Dokumen ini bersifat `as-built + target MVP`. Area yang belum tersedia di aplikasi saat ini dicatat sebagai future scope.
- Update terbaru: frontend memiliki password gate static, pilihan bahasa Indonesia/English, urutan menu baru, loading overlay anti double click, input transaksi yang lebih jelas dengan placeholder/separator/persen, history transaksi lengkap dengan search/paging, popup cetak struk setelah transaksi, dan cetak ulang struk dari riwayat menggunakan Web Bluetooth untuk printer thermal BLE ESC/POS.
- Catatan teknis: fitur cetak struk dan bilingual berada di frontend; tidak ada perubahan database dan tidak ada endpoint API khusus printer.
