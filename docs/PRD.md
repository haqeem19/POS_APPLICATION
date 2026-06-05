# Product Requirement Document

## 1. Ringkasan Produk

POS Application adalah produk POS ringan untuk usaha kecil yang membutuhkan pencatatan transaksi dan stok tanpa biaya tinggi dan tanpa kompleksitas sistem retail besar.

BRD menjelaskan kebutuhan bisnis. PRD ini menjelaskan arah produk, target user, proposisi nilai, prioritas fitur, metrik, dan roadmap.

## 2. Product Vision

Menjadi POS sederhana, hemat biaya, dan mudah dipelihara untuk usaha kecil yang ingin naik dari pencatatan manual ke sistem digital.

## 3. Target User

| Persona | Kebutuhan Utama | Pain Point |
| --- | --- | --- |
| Owner usaha kecil | Melihat penjualan dan stok harian | Data masih manual dan tersebar |
| Kasir / staf | Input transaksi cepat | Salah hitung, stok lupa dikurangi |
| Admin toko | Kelola produk dan stok | Sulit memastikan data selalu rapi |

## 4. Use Case Produk

| Kode | Use Case | Prioritas |
| --- | --- | --- |
| UC-P01 | Owner melihat dashboard harian | High |
| UC-P02 | Admin membuat master produk | High |
| UC-P03 | Admin mencatat stok masuk atau adjustment | High |
| UC-P04 | Kasir mencatat transaksi penjualan | High |
| UC-P05 | Owner melihat riwayat transaksi | Medium |
| UC-P06 | Admin mengelola pelanggan dan supplier | Medium |
| UC-P07 | Kasir mencetak struk transaksi baru atau transaksi lama | Medium |

## 5. Value Proposition

| Nilai Produk | Penjelasan |
| --- | --- |
| Simpel | Fokus ke kebutuhan POS dasar tanpa fitur berlebihan |
| Hemat biaya | Stack dapat dijalankan dengan opsi free/low-cost seperti Supabase dan hosting sederhana |
| Data lebih rapi | Master data, transaksi, dan stok berada dalam satu sistem |
| Mudah dikembangkan | Backend API dan frontend terpisah sehingga modular |

## 6. MVP Scope

| Modul | MVP Capability |
| --- | --- |
| Dashboard | Summary omzet, transaksi, produk, stok rendah, transaksi terbaru |
| Produk | Create, read, update, delete produk |
| Kategori | Create, read, update, delete kategori |
| Pelanggan | Create, read, update, delete pelanggan |
| Supplier | Create, read, update, delete supplier |
| Stok | Stok masuk, keluar, adjustment, riwayat movement |
| Penjualan | Input transaksi multi item, diskon, pajak, pembayaran, kembalian |
| Cetak Struk | Popup cetak struk setelah transaksi dan cetak ulang dari riwayat |
| Akses Frontend | Static password gate untuk akses dev/internal |
| Bahasa | Toggle Indonesia dan English pada frontend |

## 7. Product Metrics

| Metric | Definisi | Target Awal |
| --- | --- | --- |
| Transaction completion time | Waktu dari mulai input transaksi sampai tersimpan | < 2 menit untuk transaksi sederhana |
| Stock accuracy | Selisih stok sistem vs stok fisik | Semakin kecil setelah stock movement rutin |
| Daily dashboard usage | Dashboard dibuka owner/admin per hari | Minimal 1 kali per hari operasional |
| Data completeness | Produk memiliki SKU, harga, stok, kategori | > 90 persen produk aktif |
| Receipt print success | Transaksi yang membutuhkan struk dapat dicetak dari popup/history | Berhasil pada printer BLE ESC/POS yang tervalidasi |
| Duplicate action prevention | User tidak membuat transaksi/data ganda karena double click | Tidak ada duplicate submit dari aksi async frontend |

## 8. Prioritization

| Prioritas | Fitur | Alasan |
| --- | --- | --- |
| P0 | Penjualan dan pengurangan stok otomatis | Core value POS |
| P0 | Master produk dan kategori | Prasyarat transaksi |
| P0 | Dashboard harian | Visibilitas owner |
| P1 | Pelanggan dan supplier | Mendukung data operasional |
| P1 | Stock adjustment | Koreksi stok diperlukan di lapangan |
| P1 | Cetak struk thermal Bluetooth | Kebutuhan operasional toko fisik |
| P1 | Bilingual UI Indonesia/English | Memudahkan demo dan penggunaan lintas bahasa |
| P1 | Loading overlay anti double click | Mengurangi risiko data ganda saat user menekan tombol berulang |
| P1 | Transaction form clarity | Mengurangi salah input karena field diskon, pajak, dan angka lebih jelas |
| P1 | History search and paging | Memudahkan owner/admin menelusuri transaksi saat data bertambah |
| P2 | Autentikasi backend dan role | Wajib sebelum produksi serius |
| P2 | Closing kas | Penting untuk operasional kasir |

## 9. Roadmap

| Fase | Fokus | Fitur |
| --- | --- | --- |
| v0.1 MVP | Operasional dasar | Modul master data, stok, transaksi, dashboard, password gate, bilingual UI, cetak struk Bluetooth |
| v0.2 Control | Keamanan dan accountability | Login backend, role, audit trail |
| v0.3 Cashier Ops | Operasional kasir | Shift, closing kas, template struk lanjutan |
| v0.4 Correction | Koreksi transaksi | Void, refund, return |
| v0.5 Reporting | Analitik dasar | Laporan penjualan, stok, margin |

## 10. Acceptance Product Level

Produk dianggap memenuhi MVP jika:

- Admin dapat membuat produk dengan SKU unik.
- Kasir dapat membuat transaksi dengan minimal satu item.
- Sistem menolak transaksi jika stok tidak cukup.
- Sistem otomatis mengurangi stok saat transaksi berhasil.
- Sistem menampilkan popup cetak struk setelah transaksi berhasil.
- Riwayat transaksi menyediakan aksi cetak ulang struk.
- Dashboard menampilkan indikator operasional harian.
- Riwayat transaksi dan stock movement dapat ditelusuri.

## 11. Product Risks

| Risiko Produk | Dampak | Rekomendasi |
| --- | --- | --- |
| Terlalu sederhana untuk toko aktif | User cepat butuh fitur lanjutan | Roadmap harus jelas |
| Static password bukan auth penuh | Tidak aman untuk multi-user atau akses API langsung | Tambahkan auth backend sebelum go-live |
| Printer Bluetooth tidak kompatibel | Cetak struk gagal pada printer yang hanya mendukung Bluetooth Classic/SPP | Gunakan printer BLE ESC/POS atau fallback mekanisme cetak lain |
| Tidak ada laporan margin | Owner belum bisa analisis profit | Tambahkan reporting setelah transaksi stabil |
