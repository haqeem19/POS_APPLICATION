# Functional Specification Document

## 1. Ringkasan

FSD ini menerjemahkan FRD menjadi spesifikasi fitur yang lebih detail, termasuk screen, workflow, field, validasi, API mapping, dan acceptance criteria.

## 2. Screen / Page Specification

### 2.0 Access Gate and Language

| Item | Spesifikasi |
| --- | --- |
| Tujuan | Membatasi akses awal frontend untuk kebutuhan dev/internal |
| Field | Password |
| Konfigurasi | `VITE_APP_PASSWORD`, fallback development `devpos2026` |
| Penyimpanan sesi | `sessionStorage` dengan key autentikasi frontend |
| Bahasa | Toggle Indonesia/English, disimpan di `localStorage` |

Acceptance criteria:

- User harus memasukkan password sebelum dapat membuka aplikasi.
- User dapat logout dan kembali ke halaman password.
- User dapat mengganti bahasa dari halaman password dan header aplikasi.
- Label menu, tombol utama, pesan feedback, tanggal, dan mata uang mengikuti bahasa yang dipilih.

### 2.1 Dashboard

| Item | Spesifikasi |
| --- | --- |
| Tujuan | Memberikan ringkasan operasional harian |
| Data tampil | Omzet hari ini, transaksi hari ini, total produk, stok rendah, list stok rendah, transaksi terbaru |
| API | GET /api/dashboard |
| Actor | Owner, Admin |

Acceptance criteria:

- Dashboard menampilkan nilai revenue hari ini.
- Dashboard menampilkan produk dengan stock_quantity <= minimum_stock.
- Dashboard tetap dapat dibuka meskipun belum ada transaksi.

### 2.2 Product Management

| Field | Tipe | Mandatory | Validasi |
| --- | --- | --- | --- |
| SKU | Text | Ya | Wajib, unik, maksimal 80 karakter |
| Nama | Text | Ya | Maksimal 160 karakter |
| Kategori | Select | Tidak | Harus category_id valid jika diisi |
| Harga Modal | Number | Ya | Minimal 0 |
| Harga Jual | Number | Ya | Minimal 0 |
| Stok | Number | Tidak | Integer minimal 0 |
| Minimum Stok | Number | Tidak | Integer minimal 0 |
| Status Aktif | Boolean | Tidak | true/false |

API mapping:

| Action | Method | Endpoint |
| --- | --- | --- |
| List | GET | /api/products |
| Create | POST | /api/products |
| Detail | GET | /api/products/{id} |
| Update | PUT/PATCH | /api/products/{id} |
| Delete | DELETE | /api/products/{id} |

Acceptance criteria:

- User dapat menyimpan produk baru dengan SKU unik.
- Sistem menolak harga negatif.
- Produk tidak aktif tidak dapat dijual.

### 2.3 Category Management

| Field | Tipe | Mandatory | Validasi |
| --- | --- | --- | --- |
| Nama | Text | Ya | Maksimal 120 karakter |
| Deskripsi | Textarea | Tidak | String |
| Status Aktif | Boolean | Tidak | true/false |

Acceptance criteria:

- User dapat membuat, melihat, mengubah, dan menghapus kategori.
- Produk tetap boleh tidak memiliki kategori.
- Jika kategori dihapus, category_id produk menjadi null.

### 2.4 Customer Management

| Field | Tipe | Mandatory | Validasi |
| --- | --- | --- | --- |
| Nama | Text | Ya | Maksimal 160 karakter |
| Telepon | Text | Tidak | Maksimal 40 karakter |
| Email | Email | Tidak | Format email, maksimal 160 karakter |
| Alamat | Text | Tidak | String |

Acceptance criteria:

- User dapat menyimpan data pelanggan.
- Transaksi tetap dapat dibuat tanpa pelanggan.
- Jika pelanggan dihapus, customer_id pada transaksi menjadi null.

### 2.5 Supplier Management

| Field | Tipe | Mandatory | Validasi |
| --- | --- | --- | --- |
| Nama | Text | Ya | Maksimal 160 karakter |
| Telepon | Text | Tidak | Maksimal 40 karakter |
| Email | Email | Tidak | Format email, maksimal 160 karakter |
| Alamat | Text | Tidak | String |
| Contact Person | Text | Tidak | Maksimal 160 karakter |

Acceptance criteria:

- User dapat menyimpan supplier.
- Supplier belum terhubung langsung ke purchase order pada MVP.

### 2.6 Stock Movement

| Field | Tipe | Mandatory | Validasi |
| --- | --- | --- | --- |
| Produk | Select | Ya | product_id valid |
| Tipe | Select | Ya | in, out, adjustment |
| Jumlah | Number | Ya | Integer minimal 1 |
| Catatan | Text | Tidak | String |

Workflow:

1. User memilih produk.
2. User memilih tipe movement.
3. User mengisi jumlah.
4. Sistem menghitung perubahan stok.
5. Sistem menolak jika stok akhir negatif.
6. Sistem menyimpan movement dan memperbarui stock_quantity.

Acceptance criteria:

- Stok masuk menambah stok.
- Stok keluar mengurangi stok.
- Adjustment mengubah stok menjadi jumlah yang diinput.
- Sistem menolak stok negatif.

### 2.7 Sales Transaction

| Field | Tipe | Mandatory | Validasi |
| --- | --- | --- | --- |
| Pelanggan | Select | Tidak | customer_id valid jika diisi |
| Item Produk | Repeating row | Ya | Minimal satu item |
| Quantity | Number | Ya | Integer minimal 1 |
| Diskon Item | Percent | Tidak | Minimal 0, dikonversi frontend menjadi nominal discount_amount item |
| Diskon Transaksi | Percent | Tidak | Minimal 0, dikonversi frontend menjadi nominal discount_amount |
| Pajak | Percent | Tidak | Minimal 0, dikonversi frontend menjadi nominal tax_amount |
| Metode Bayar | Select | Ya | cash, qris, card, transfer |
| Dibayar | Number | Ya | Minimal total transaksi |
| Catatan | Text | Tidak | String |

Workflow:

1. Kasir membuka form transaksi.
2. Kasir memilih pelanggan atau membiarkan walk-in.
3. Kasir menambahkan satu atau lebih produk.
4. Sistem menghitung total sementara di frontend.
5. Kasir mengisi diskon, pajak, metode bayar, dan nominal dibayar.
6. Frontend mengonversi diskon dan pajak persen menjadi nominal untuk payload API.
7. Backend memvalidasi ulang harga, stok, diskon, dan pembayaran.
8. Backend menyimpan transaksi dalam database transaction.
9. Backend mengurangi stok dan membuat stock movement otomatis.
10. Frontend menampilkan popup transaksi berhasil.
11. Kasir memilih `Cetak Struk` atau `Tutup`.
12. Sistem menampilkan transaksi terbaru.

Acceptance criteria:

- Sistem menolak transaksi tanpa item.
- Sistem menolak produk yang tidak aktif.
- Sistem menolak stok tidak cukup.
- Sistem menolak pembayaran kurang.
- Sistem membuat invoice number unik.
- Sistem menyimpan sale, sale_items, dan stock_movements secara atomic.
- Setelah transaksi berhasil, popup cetak struk tampil.
- Tombol tutup menutup popup tanpa membatalkan transaksi.
- Field transaksi memiliki placeholder yang menjelaskan fungsi input.
- Diskon item, diskon transaksi, dan pajak menampilkan suffix `%`.
- Diskon transaksi dan pajak ditampilkan dalam satu row dua kolom pada desktop.
- Input harga memakai separator koma, sedangkan stok/quantity memakai separator titik.
- Placeholder select wajib seperti pilih produk dan pilih metode bayar tidak bisa dipilih sebagai value valid.

### 2.8 Receipt Printing

| Item | Spesifikasi |
| --- | --- |
| Trigger 1 | Popup setelah transaksi berhasil |
| Trigger 2 | Tombol `Cetak Struk` pada menu riwayat transaksi |
| Teknologi | Web Bluetooth browser API |
| Format | ESC/POS 32 kolom untuk thermal printer 58mm |
| Data struk | Invoice, tanggal, pelanggan, metode bayar, item, subtotal, diskon, pajak, total, dibayar, kembalian |
| Browser support | Chrome/Edge pada HTTPS atau localhost |
| Hardware support | Printer thermal Bluetooth BLE yang expose writable GATT characteristic |

Workflow:

1. User menekan tombol cetak struk.
2. Browser menampilkan dialog pemilihan perangkat Bluetooth.
3. User memilih printer thermal.
4. Sistem mencari service dan characteristic printer yang kompatibel.
5. Sistem mengirim payload ESC/POS dalam chunk kecil.
6. Sistem menampilkan pesan sukses atau pesan error.

Acceptance criteria:

- Struk dapat dicetak dari transaksi yang baru dibuat.
- Struk dapat dicetak ulang dari riwayat transaksi.
- Jika browser tidak mendukung Web Bluetooth, sistem menampilkan pesan yang mudah dipahami.
- Jika printer tidak kompatibel, sistem tidak mengubah data transaksi dan menampilkan pesan error.

### 2.9 Transaction History

| Item | Spesifikasi |
| --- | --- |
| Tujuan | Memudahkan owner/admin menelusuri transaksi yang sudah tersimpan |
| Field tabel | Invoice, tanggal, pelanggan, item, subtotal, diskon, pajak, total, dibayar, kembalian, metode bayar, status, aksi |
| Search | Invoice, pelanggan, produk, SKU, metode bayar, status |
| Pagination | Server-side pagination dari endpoint `/api/sales` |
| Default page size | 10 transaksi per halaman |
| Aksi | Cetak ulang struk |

Acceptance criteria:

- User dapat mencari transaksi dari keyword invoice, pelanggan, produk, SKU, metode bayar, atau status.
- User dapat berpindah halaman riwayat menggunakan tombol sebelumnya/berikutnya.
- Tabel riwayat tetap menampilkan pesan kosong jika tidak ada hasil.
- Search dan pagination tidak mengubah data transaksi.

## 3. Search and Pagination

| Fitur | Spesifikasi |
| --- | --- |
| Pagination | Endpoint list menggunakan query `per_page`, default 15 |
| Search kategori/customer/supplier | Search berdasarkan name |
| Search produk | Search berdasarkan name atau SKU |

## 4. State and Feedback

| Kondisi | Perilaku |
| --- | --- |
| Submit berhasil | Data di-refresh dan form dikosongkan |
| Submit gagal | Pesan error ditampilkan ke user |
| Data kosong | Tabel dapat tampil tanpa row |
| Print berhasil | Pesan sukses dikirim ke printer ditampilkan |
| Print gagal | Pesan kompatibilitas printer/browser ditampilkan |
| Aksi async berjalan | Loading overlay tampil dengan teks loading dan menahan klik berikutnya |

Loading overlay berlaku untuk:

- Refresh data.
- Simpan produk/kategori/pelanggan/supplier.
- Simpan stock movement.
- Simpan transaksi.
- Cetak struk.

## 5. Feature Gaps

| Gap | Dampak |
| --- | --- |
| Belum ada edit/delete UI lengkap untuk semua modul | API mendukung sebagian, UI perlu ditingkatkan |
| Template struk masih dasar | Branding toko seperti nama legal, alamat, WA, dan footer belum configurable |
| Belum ada auth backend/role | Static password gate hanya membatasi frontend |
| Belum ada filter tanggal transaksi | Riwayat transaksi belum ideal untuk reporting |
| Printer bergantung Web Bluetooth | Printer Bluetooth Classic/SPP belum tentu dapat digunakan dari browser |
