# Business Requirement Document

## 1. Ringkasan

POS Application adalah aplikasi point of sale untuk membantu usaha kecil mencatat produk, stok, pelanggan, supplier, dan transaksi penjualan secara lebih rapi. Fokus MVP adalah menggantikan pencatatan manual dengan proses digital sederhana yang bisa dipakai untuk operasional harian.

## 2. Business Goal

| Kode | Tujuan Bisnis | Indikator Keberhasilan |
| --- | --- | --- |
| BG-01 | Mempercepat proses pencatatan penjualan | Transaksi dapat dicatat dalam satu alur kasir |
| BG-02 | Mengurangi kesalahan stok | Stok otomatis berkurang saat transaksi penjualan berhasil |
| BG-03 | Memberikan visibilitas performa harian | Dashboard menampilkan omzet, jumlah transaksi, produk, dan stok rendah |
| BG-04 | Menyediakan master data operasional | Produk, kategori, pelanggan, dan supplier tercatat dalam sistem |

## 3. Background

Usaha kecil seperti coffee shop, bakery rumahan, atau toko retail kecil sering memakai pencatatan manual atau spreadsheet. Cara ini murah, tetapi berisiko:

- Stok tidak sinkron dengan penjualan.
- Riwayat transaksi sulit dilacak.
- Owner sulit melihat performa harian.
- Data produk, pelanggan, dan supplier tersebar.

## 4. Problem Statement

Owner dan staf operasional membutuhkan sistem POS sederhana yang dapat mencatat penjualan, menghitung pembayaran, mengurangi stok otomatis, dan menyediakan ringkasan operasional tanpa kompleksitas sistem enterprise.

## 5. Scope Bisnis

### 5.1 In Scope MVP

| Area | Keterangan |
| --- | --- |
| Master kategori | Mencatat kategori produk |
| Master produk | Mencatat SKU, nama, harga modal, harga jual, stok, minimum stok |
| Master pelanggan | Mencatat data pelanggan sederhana |
| Master supplier | Mencatat data supplier sederhana |
| Stock movement | Mencatat stok masuk, stok keluar, dan adjustment |
| Penjualan | Mencatat transaksi, item, diskon, pajak, metode bayar, pembayaran, dan kembalian |
| Cetak struk | Mencetak struk thermal Bluetooth setelah transaksi berhasil dan dari riwayat transaksi |
| Akses internal | Membatasi akses awal frontend dengan static password untuk kebutuhan dev/internal |
| Bahasa | Menyediakan pilihan bahasa Indonesia dan English pada frontend |
| Dashboard | Menampilkan omzet hari ini, transaksi hari ini, total produk, stok rendah, dan transaksi terbaru |

### 5.2 Out of Scope MVP

| Area | Alasan |
| --- | --- |
| Autentikasi backend dan role user | Frontend memiliki static password gate, tetapi belum ada auth backend, role, dan authorization |
| Shift kasir dan closing kas | Dibutuhkan untuk operasional kasir lebih matang, tetapi belum ada |
| Refund, void, return | Risiko proses dan audit lebih tinggi, sebaiknya masuk fase berikut |
| Multi cabang | Membutuhkan desain stok dan user management lebih kompleks |
| Integrasi payment gateway | MVP saat ini hanya mencatat metode pembayaran |
| Laporan akuntansi | Belum masuk kebutuhan inti MVP |

## 6. Stakeholder

| Stakeholder | Kepentingan |
| --- | --- |
| Owner | Melihat omzet, transaksi, dan stok |
| Kasir / staf operasional | Mencatat transaksi cepat dan akurat |
| Admin toko | Mengelola master data dan stok |
| Supplier | Tidak memakai sistem langsung, tetapi datanya dicatat untuk kebutuhan operasional |
| Developer / maintainer | Menjaga aplikasi mudah dikembangkan |

## 7. Business Process High Level

1. Admin membuat kategori dan produk.
2. Admin mencatat stok awal atau stok masuk.
3. Kasir memilih produk untuk transaksi.
4. Sistem menghitung subtotal, diskon, pajak, total, dan kembalian.
5. Sistem menyimpan transaksi.
6. Sistem mengurangi stok produk dan membuat stock movement otomatis.
7. Sistem menampilkan opsi cetak struk.
8. Kasir dapat mencetak struk thermal Bluetooth atau menutup popup.
9. Owner melihat ringkasan di dashboard.

## 8. Business Rules

| Kode | Business Rule |
| --- | --- |
| BR-01 | SKU produk harus unik. |
| BR-02 | Produk tidak aktif tidak boleh dijual. |
| BR-03 | Stok produk tidak boleh menjadi negatif. |
| BR-04 | Diskon item tidak boleh melebihi subtotal item. |
| BR-05 | Diskon transaksi tidak boleh membuat total transaksi negatif. |
| BR-06 | Nominal pembayaran harus sama dengan atau lebih besar dari total transaksi. |
| BR-07 | Transaksi berhasil harus mencatat item penjualan dan stock movement keluar. |
| BR-08 | Produk dengan stok kurang dari atau sama dengan minimum stok dianggap stok rendah. |
| BR-09 | Setelah transaksi berhasil, sistem harus menyediakan opsi cetak struk dan tutup popup. |
| BR-10 | Riwayat transaksi harus menyediakan opsi cetak ulang struk. |
| BR-11 | Static password frontend hanya digunakan sebagai pembatas akses ringan dan tidak menggantikan auth backend. |
| BR-12 | Aksi simpan, refresh, dan cetak harus mencegah double click selama proses berjalan. |
| BR-13 | Field transaksi harus jelas melalui placeholder, format angka, dan select placeholder yang tidak dapat dipilih. |
| BR-14 | Diskon item, diskon transaksi, dan pajak diinput sebagai persentase di frontend. |
| BR-15 | Riwayat transaksi harus menampilkan field transaksi lengkap, mendukung pencarian, dan pagination. |

## 9. Assumptions

| Kode | Asumsi |
| --- | --- |
| AS-01 | Sistem digunakan untuk satu toko atau satu outlet pada fase MVP. |
| AS-02 | Semua user yang mengakses aplikasi dianggap memiliki hak akses operasional. |
| AS-03 | Pembayaran hanya dicatat secara administratif, belum diproses melalui payment gateway. |
| AS-04 | Pajak dan diskon dimasukkan manual oleh user. |
| AS-05 | Database yang digunakan adalah PostgreSQL melalui Supabase. |
| AS-06 | Printer thermal yang digunakan mendukung Bluetooth BLE dan ESC/POS agar bisa dicetak dari browser. |
| AS-07 | Deployment frontend menggunakan HTTPS agar Web Bluetooth tersedia di browser modern. |

## 10. Risks

| Risiko | Dampak | Mitigasi |
| --- | --- | --- |
| Password gate hanya frontend | User teknis masih dapat melihat bundle frontend dan API belum terlindungi auth | Tambahkan login backend, role, dan authorization sebelum produksi serius |
| Tidak ada audit user | Sulit menelusuri siapa yang mengubah data | Tambahkan user_id dan audit log |
| Tidak ada refund/void | Koreksi transaksi harus dilakukan manual | Desain modul void/refund dengan approval |
| Stok hanya di level produk | Belum mendukung varian atau bahan baku | Tambahkan varian/BOM jika bisnis berkembang |
| Tidak ada closing kas | Rekonsiliasi kas harian belum kuat | Tambahkan shift dan cash closing |
| Kompatibilitas printer Bluetooth | Tidak semua thermal printer bisa dicetak dari browser | Validasi printer mendukung BLE ESC/POS; siapkan fallback cetak manual jika perlu |

## 11. Recommendation

MVP ini layak dipakai sebagai prototype operasional atau internal demo. Untuk penggunaan produksi, prioritas berikutnya adalah autentikasi backend, role, audit trail, closing kas, mekanisme koreksi transaksi, dan validasi perangkat printer yang akan dipakai di toko.
