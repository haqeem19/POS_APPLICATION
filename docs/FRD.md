# Functional Requirement Document

## 1. Ringkasan

FRD ini mendefinisikan kebutuhan fungsional POS Application berdasarkan scope MVP. Dokumen ini fokus pada fungsi sistem dari sudut pandang user dan aturan bisnis.

## 2. Actors

| Actor | Deskripsi |
| --- | --- |
| Admin | Mengelola master data dan stok |
| Kasir | Mencatat transaksi penjualan |
| Owner | Melihat dashboard dan riwayat transaksi |

Catatan: Pada implementasi saat ini sudah ada static password gate di frontend, tetapi belum ada autentikasi backend dan role teknis. Actor di atas adalah role bisnis, bukan role teknis yang sudah dipaksa oleh sistem.

## 3. Functional Requirements

### 3.1 Dashboard

| Kode | Requirement | Prioritas |
| --- | --- | --- |
| FR-DASH-01 | Sistem harus menampilkan omzet hari ini. | High |
| FR-DASH-02 | Sistem harus menampilkan jumlah transaksi hari ini. | High |
| FR-DASH-03 | Sistem harus menampilkan total produk. | Medium |
| FR-DASH-04 | Sistem harus menampilkan jumlah produk stok rendah. | High |
| FR-DASH-05 | Sistem harus menampilkan daftar produk stok rendah maksimal 10 item. | High |
| FR-DASH-06 | Sistem harus menampilkan transaksi terbaru maksimal 5 item. | Medium |

### 3.2 Kategori

| Kode | Requirement | Prioritas |
| --- | --- | --- |
| FR-CAT-01 | Sistem harus dapat membuat kategori. | High |
| FR-CAT-02 | Sistem harus dapat menampilkan daftar kategori. | High |
| FR-CAT-03 | Sistem harus dapat menampilkan detail kategori. | Medium |
| FR-CAT-04 | Sistem harus dapat mengubah kategori. | Medium |
| FR-CAT-05 | Sistem harus dapat menghapus kategori. | Medium |
| FR-CAT-06 | Sistem harus dapat menandai kategori aktif/tidak aktif. | Medium |

### 3.3 Produk

| Kode | Requirement | Prioritas |
| --- | --- | --- |
| FR-PROD-01 | Sistem harus dapat membuat produk dengan SKU unik. | High |
| FR-PROD-02 | Sistem harus dapat menyimpan kategori produk. | Medium |
| FR-PROD-03 | Sistem harus dapat menyimpan harga modal dan harga jual. | High |
| FR-PROD-04 | Sistem harus dapat menyimpan stok dan minimum stok. | High |
| FR-PROD-05 | Sistem harus dapat mencari produk berdasarkan nama atau SKU. | Medium |
| FR-PROD-06 | Sistem harus dapat menandai produk aktif/tidak aktif. | High |
| FR-PROD-07 | Sistem harus dapat mengubah dan menghapus produk. | Medium |

### 3.4 Pelanggan

| Kode | Requirement | Prioritas |
| --- | --- | --- |
| FR-CUST-01 | Sistem harus dapat membuat data pelanggan. | Medium |
| FR-CUST-02 | Sistem harus dapat menampilkan daftar pelanggan. | Medium |
| FR-CUST-03 | Sistem harus dapat mengubah dan menghapus pelanggan. | Medium |
| FR-CUST-04 | Sistem harus dapat menghubungkan pelanggan dengan transaksi penjualan. | Medium |
| FR-CUST-05 | Sistem harus mendukung transaksi walk-in tanpa pelanggan. | High |

### 3.5 Supplier

| Kode | Requirement | Prioritas |
| --- | --- | --- |
| FR-SUP-01 | Sistem harus dapat membuat data supplier. | Medium |
| FR-SUP-02 | Sistem harus dapat menyimpan contact person supplier. | Medium |
| FR-SUP-03 | Sistem harus dapat menampilkan, mengubah, dan menghapus supplier. | Medium |

### 3.6 Stock Movement

| Kode | Requirement | Prioritas |
| --- | --- | --- |
| FR-STK-01 | Sistem harus dapat mencatat stok masuk. | High |
| FR-STK-02 | Sistem harus dapat mencatat stok keluar manual. | Medium |
| FR-STK-03 | Sistem harus dapat mencatat adjustment stok. | High |
| FR-STK-04 | Sistem harus menolak movement yang membuat stok negatif. | High |
| FR-STK-05 | Sistem harus menyimpan reference type untuk movement. | Medium |
| FR-STK-06 | Sistem harus menyimpan catatan movement. | Medium |
| FR-STK-07 | Sistem harus membuat stock movement keluar otomatis saat penjualan berhasil. | High |

### 3.7 Penjualan

| Kode | Requirement | Prioritas |
| --- | --- | --- |
| FR-SALE-01 | Sistem harus dapat membuat transaksi penjualan dengan minimal satu item. | High |
| FR-SALE-02 | Sistem harus dapat menghitung subtotal dari item transaksi. | High |
| FR-SALE-03 | Sistem harus dapat menerapkan diskon per item. | Medium |
| FR-SALE-04 | Sistem harus dapat menerapkan diskon transaksi. | Medium |
| FR-SALE-05 | Sistem harus dapat menerapkan pajak transaksi. | Medium |
| FR-SALE-06 | Sistem harus mendukung metode bayar cash, QRIS, card, dan transfer. | High |
| FR-SALE-07 | Sistem harus menghitung kembalian. | High |
| FR-SALE-08 | Sistem harus menolak transaksi jika pembayaran kurang. | High |
| FR-SALE-09 | Sistem harus menolak transaksi jika stok produk tidak cukup. | High |
| FR-SALE-10 | Sistem harus menghasilkan invoice number unik. | High |
| FR-SALE-11 | Sistem harus menyimpan detail item transaksi. | High |
| FR-SALE-12 | Sistem harus menampilkan daftar dan detail transaksi. | High |
| FR-SALE-13 | Sistem harus menampilkan popup setelah transaksi berhasil dengan tombol cetak struk dan tutup. | High |
| FR-SALE-14 | Sistem harus menyediakan cetak ulang struk dari riwayat transaksi. | Medium |
| FR-SALE-15 | Sistem harus membuat format struk berisi invoice, tanggal, pelanggan, item, subtotal, diskon, pajak, total, bayar, dan kembalian. | Medium |
| FR-SALE-16 | Sistem harus menerima input diskon item, diskon transaksi, dan pajak sebagai persentase di frontend. | Medium |
| FR-SALE-17 | Sistem harus mengonversi nilai persen menjadi nominal sebelum mengirim transaksi ke backend. | High |
| FR-SALE-18 | Sistem harus menampilkan placeholder pada field transaksi agar tujuan field lebih jelas. | Medium |
| FR-SALE-19 | Placeholder option untuk select wajib harus disabled agar tidak dapat dipilih sebagai value valid. | Medium |
| FR-SALE-20 | Sistem harus menampilkan riwayat transaksi dengan field lengkap: invoice, tanggal, pelanggan, item, subtotal, diskon, pajak, total, dibayar, kembalian, metode bayar, status, dan aksi. | High |
| FR-SALE-21 | Sistem harus mendukung pencarian riwayat transaksi berdasarkan invoice, pelanggan, produk, SKU, metode bayar, atau status. | High |
| FR-SALE-22 | Sistem harus mendukung pagination pada riwayat transaksi. | High |

### 3.8 Akses Aplikasi dan Bahasa

| Kode | Requirement | Prioritas |
| --- | --- | --- |
| FR-SEC-01 | Sistem harus menampilkan password gate sebelum user dapat membuka frontend. | Medium |
| FR-SEC-02 | Static password harus dapat dikonfigurasi melalui environment frontend `VITE_APP_PASSWORD`. | Medium |
| FR-SEC-03 | Sistem harus menyediakan pilihan bahasa Indonesia dan English pada frontend. | Medium |
| FR-SEC-04 | Pilihan bahasa harus mempengaruhi label menu, tombol, pesan feedback, dan format tanggal/uang. | Medium |
| FR-SEC-05 | Sistem harus menampilkan loading overlay selama aksi async agar user tidak melakukan double click. | High |

### 3.9 Thermal Printer

| Kode | Requirement | Prioritas |
| --- | --- | --- |
| FR-PRN-01 | Sistem harus mencoba mencetak struk ke printer thermal Bluetooth menggunakan Web Bluetooth. | Medium |
| FR-PRN-02 | Sistem harus menampilkan pesan error jika browser tidak mendukung Web Bluetooth. | Medium |
| FR-PRN-03 | Sistem harus menampilkan pesan error jika printer tidak dapat ditemukan atau service printer tidak kompatibel. | Medium |
| FR-PRN-04 | Sistem harus mengirim data struk dalam format ESC/POS untuk printer yang kompatibel. | Medium |

## 4. Validation Rules

| Area | Validasi |
| --- | --- |
| Kategori | name wajib, maksimal 120 karakter |
| Produk | sku wajib dan unik, name wajib, harga >= 0, stok >= 0 |
| Pelanggan | name wajib, email harus format email jika diisi |
| Supplier | name wajib, email harus format email jika diisi |
| Stock movement | product_id wajib valid, type hanya in/out/adjustment, quantity minimal 1 |
| Penjualan | items minimal 1, quantity minimal 1, paid_amount >= total |
| Password gate | password wajib sama dengan nilai `VITE_APP_PASSWORD` atau fallback default development |
| Printer | browser harus mendukung Web Bluetooth dan printer harus expose service/characteristic yang dapat ditulis |
| Loading overlay | aktif selama refresh, submit data, submit transaksi, dan cetak struk |
| Format angka | input harga memakai pemisah koma; input numeric seperti stok dan quantity memakai pemisah titik |

## 5. Future Functional Scope

| Fitur | Alasan |
| --- | --- |
| Login backend dan role | Membatasi akses admin/kasir/owner sampai level API |
| Audit trail | Menelusuri perubahan data dan transaksi |
| Void/refund/return | Koreksi transaksi secara terkendali |
| Shift dan closing kas | Rekonsiliasi kas harian |
| Template struk lanjutan | Nama toko, alamat, nomor WA, logo teks, dan footer promosi |
| Reporting | Analisis penjualan, produk terlaris, margin |
