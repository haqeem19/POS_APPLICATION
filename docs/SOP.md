# Standard Operating Procedure POS Application

## 1. Ringkasan

Dokumen SOP ini menjelaskan prosedur penggunaan POS Application untuk operasional harian. SOP ini ditujukan untuk Owner, Admin, dan Kasir pada fase MVP.

Catatan penting: aplikasi saat ini memiliki static password gate di frontend, tetapi belum memiliki login user, role teknis, dan authorization backend. Role pada SOP ini adalah role operasional.

## 2. Tujuan SOP

| Kode | Tujuan |
| --- | --- |
| SOP-GOAL-01 | Menstandarkan proses input master data produk, pelanggan, supplier, dan stok |
| SOP-GOAL-02 | Menstandarkan proses transaksi penjualan |
| SOP-GOAL-03 | Mengurangi risiko salah input stok dan transaksi |
| SOP-GOAL-04 | Membantu owner membaca ringkasan operasional harian |

## 3. Role dan Tanggung Jawab

| Role | Tanggung Jawab |
| --- | --- |
| Owner | Memantau dashboard, omzet, stok rendah, dan transaksi terbaru |
| Admin | Mengelola kategori, produk, pelanggan, supplier, dan stock movement |
| Kasir | Mencatat transaksi penjualan dan memastikan pembayaran sesuai |

## 3.1 SOP Akses Aplikasi dan Bahasa

1. Buka aplikasi POS dari browser.
2. Masukkan password akses internal yang diberikan developer/maintainer.
3. Pilih bahasa `Indonesia` atau `English` jika diperlukan.
4. Setelah masuk, pastikan menu tampil sesuai bahasa yang dipilih.

Kontrol:

- Jangan membagikan password ke user yang tidak berkepentingan.
- Static password hanya pembatas ringan. Untuk data produksi, tetap butuh login user dan role backend.
- Bahasa dapat diganti dari header aplikasi tanpa mengubah data transaksi.
- Jika loading overlay tampil, tunggu sampai proses selesai dan jangan refresh browser kecuali aplikasi benar-benar berhenti merespons.

## 4. SOP Persiapan Awal

### 4.1 Setup Master Kategori

1. Buka menu kategori.
2. Input nama kategori.
3. Isi deskripsi jika diperlukan.
4. Simpan data.
5. Pastikan kategori tampil pada daftar kategori.

Kontrol:

- Nama kategori wajib diisi.
- Gunakan nama kategori yang konsisten, misalnya `Coffee`, `Bakery`, `Snack`, atau `Merchandise`.

### 4.2 Setup Master Produk

1. Buka menu produk.
2. Input SKU produk.
3. Input nama produk.
4. Pilih kategori jika tersedia.
5. Input harga modal.
6. Input harga jual.
7. Input stok awal.
8. Input minimum stok.
9. Simpan data.
10. Pastikan produk tampil pada daftar produk.

Kontrol:

- SKU harus unik.
- Harga modal dan harga jual tidak boleh negatif.
- Stok tidak boleh negatif.
- Minimum stok digunakan untuk indikator stok rendah.
- Setelah klik simpan, tunggu loading selesai agar data tidak terkirim ganda.

Rekomendasi:

- Gunakan format SKU yang mudah dibaca, contoh `COF-ESP-001` atau `BRD-CKS-001`.
- Jangan sering mengganti SKU setelah produk mulai dijual.

### 4.3 Setup Master Pelanggan

1. Buka menu pelanggan.
2. Input nama pelanggan.
3. Isi telepon, email, dan alamat jika tersedia.
4. Simpan data.

Kontrol:

- Nama pelanggan wajib diisi.
- Email harus menggunakan format email yang valid jika diisi.
- Transaksi tetap bisa dilakukan tanpa memilih pelanggan.

### 4.4 Setup Master Supplier

1. Buka menu supplier.
2. Input nama supplier.
3. Isi telepon, email, alamat, dan contact person jika tersedia.
4. Simpan data.

Kontrol:

- Nama supplier wajib diisi.
- Data supplier pada MVP masih bersifat referensi dan belum terhubung ke purchase order.

## 5. SOP Stock Movement

### 5.1 Stok Masuk

Digunakan saat barang masuk dari pembelian, produksi, atau penambahan stok.

1. Buka menu stok.
2. Pilih produk.
3. Pilih tipe `in`.
4. Input jumlah stok masuk.
5. Isi catatan, contoh `Restock dari supplier`.
6. Simpan.
7. Cek stok produk bertambah.

Kontrol:

- Quantity minimal 1.
- Catatan sebaiknya diisi agar history stok mudah ditelusuri.

### 5.2 Stok Keluar Manual

Digunakan untuk stok keluar non-penjualan, misalnya produk rusak, sample, atau koreksi operasional.

1. Buka menu stok.
2. Pilih produk.
3. Pilih tipe `out`.
4. Input jumlah stok keluar.
5. Isi catatan alasan stok keluar.
6. Simpan.
7. Cek stok produk berkurang.

Kontrol:

- Sistem akan menolak jika stok tidak mencukupi.
- Jangan gunakan stok keluar manual untuk transaksi penjualan normal. Gunakan menu penjualan.

### 5.3 Adjustment Stok

Digunakan saat stok fisik berbeda dari stok sistem.

1. Hitung stok fisik produk.
2. Buka menu stok.
3. Pilih produk.
4. Pilih tipe `adjustment`.
5. Input jumlah stok fisik yang benar.
6. Isi catatan, contoh `Stock opname harian`.
7. Simpan.
8. Pastikan stok sistem berubah sesuai jumlah input.

Kontrol:

- Untuk adjustment, quantity adalah stok akhir, bukan selisih.
- Adjustment harus diberi catatan agar alasan perubahan jelas.

## 6. SOP Transaksi Penjualan

### 6.1 Membuat Transaksi

1. Buka menu penjualan.
2. Pilih pelanggan jika ada. Jika tidak ada, biarkan sebagai walk-in.
3. Pilih produk.
4. Input quantity.
5. Input diskon item dalam persen jika ada.
6. Tambahkan item lain jika diperlukan.
7. Input diskon transaksi dalam persen jika ada.
8. Input pajak dalam persen jika ada.
9. Pilih metode pembayaran: `cash`, `qris`, `card`, atau `transfer`.
10. Input nominal dibayar.
11. Cek total transaksi.
12. Simpan transaksi.
13. Setelah popup berhasil tampil, pilih `Cetak Struk` jika pelanggan membutuhkan struk.
14. Pilih `Tutup` jika tidak perlu mencetak struk.

Hasil sistem:

- Sistem membuat nomor invoice otomatis.
- Sistem menyimpan transaksi dan detail item.
- Sistem mengurangi stok produk.
- Sistem membuat stock movement otomatis dengan tipe `out`.
- Sistem menampilkan popup cetak struk.
- Sistem menampilkan loading overlay saat transaksi sedang diproses untuk mencegah double click.

Kontrol input:

- Field harga dan pembayaran menampilkan separator koma, contoh `50,000`.
- Field numeric seperti stok dan quantity menampilkan separator titik, contoh `1.000`.
- Field diskon dan pajak memakai persen dengan label `%`.
- Placeholder select seperti `Pilih produk` dan `Pilih metode bayar` tidak dapat dipilih sebagai value transaksi.

### 6.2 Validasi Transaksi

| Kondisi | Perilaku Sistem |
| --- | --- |
| Produk tidak aktif | Transaksi ditolak |
| Stok tidak cukup | Transaksi ditolak |
| Diskon item melebihi subtotal item | Transaksi ditolak |
| Diskon transaksi membuat total negatif | Transaksi ditolak |
| Nominal dibayar kurang dari total | Transaksi ditolak |

### 6.3 Setelah Transaksi

1. Pastikan transaksi muncul di daftar transaksi terbaru.
2. Jika pembayaran cash, serahkan kembalian sesuai nilai yang dihitung sistem.
3. Jika pembayaran QRIS/card/transfer, pastikan bukti pembayaran valid secara operasional.
4. Jika struk belum tercetak dari popup, buka menu riwayat dan gunakan tombol cetak struk pada transaksi terkait.

Catatan:

- Aplikasi MVP hanya mencatat metode bayar. Validasi aktual dari payment gateway belum tersedia.

### 6.4 Cetak Struk Thermal Bluetooth

Prasyarat:

- Gunakan Chrome/Edge.
- Aplikasi dibuka melalui HTTPS atau localhost.
- Printer thermal menyala dan mendukung Bluetooth BLE ESC/POS.

Prosedur cetak dari popup:

1. Setelah transaksi berhasil, klik `Cetak Struk`.
2. Pilih printer pada dialog Bluetooth browser.
3. Tunggu sampai pesan berhasil tampil.
4. Jika gagal, pastikan printer menyala, dekat dengan device, dan tidak sedang dipakai aplikasi lain.

Prosedur cetak ulang:

1. Buka menu `Riwayat`.
2. Cari transaksi berdasarkan invoice/tanggal.
3. Klik `Cetak Struk` pada kolom aksi.
4. Pilih printer pada dialog Bluetooth browser.

## 7. SOP Monitoring Dashboard

Owner/Admin melakukan pengecekan dashboard minimal sekali per hari operasional.

Checklist:

| Area | Yang Dicek |
| --- | --- |
| Omzet hari ini | Pastikan sesuai ekspektasi transaksi |
| Transaksi hari ini | Pastikan jumlah transaksi wajar |
| Produk stok rendah | Prioritaskan restock |
| Transaksi terbaru | Cek transaksi mencurigakan atau salah input |

## 8. SOP Koreksi Data

### 8.1 Koreksi Produk

1. Jika salah input nama/harga/minimum stok, ubah data produk.
2. Jika salah input stok, gunakan stock movement adjustment.
3. Jangan langsung menghapus produk yang pernah dipakai transaksi.

### 8.2 Koreksi Transaksi

Pada MVP belum ada fitur void, refund, atau return.

Jika terjadi salah transaksi:

1. Catat nomor invoice yang salah.
2. Catat alasan kesalahan.
3. Lakukan koreksi stok manual jika diperlukan.
4. Simpan catatan operasional di luar sistem sampai fitur void/refund tersedia.

Risiko:

- Koreksi transaksi manual dapat mengganggu akurasi laporan.
- Untuk produksi serius, fitur void/refund dengan audit trail wajib ditambahkan.

## 9. SOP Penutupan Harian

Karena fitur shift dan closing kas belum tersedia, lakukan prosedur manual:

1. Owner/Admin cek dashboard omzet hari ini.
2. Cocokkan total pembayaran cash dengan uang fisik.
3. Cocokkan QRIS/card/transfer dengan bukti pembayaran eksternal.
4. Catat selisih jika ada.
5. Review produk stok rendah.
6. Lakukan restock atau adjustment jika diperlukan.

## 10. Control Checklist Harian

| Checklist | Role | Status |
| --- | --- | --- |
| Dashboard dicek | Owner/Admin | Manual |
| Transaksi terbaru direview | Owner/Admin | Manual |
| Stok rendah dicek | Admin | Manual |
| Pembayaran cash dicocokkan | Kasir/Owner | Manual |
| Koreksi stok diberi catatan | Admin | Manual |

## 11. Escalation

| Masalah | Tindakan |
| --- | --- |
| API tidak bisa diakses | Cek backend Laravel dan konfigurasi API URL |
| Data tidak tersimpan | Cek error validasi dan koneksi database |
| Stok tidak sesuai | Cek stock movement dan lakukan adjustment |
| Transaksi ditolak | Cek stok, produk aktif, diskon, dan nominal bayar |
| Dashboard kosong | Cek apakah database berisi data transaksi/produk |
| Printer tidak muncul | Pastikan browser mendukung Web Bluetooth, printer menyala, dan akses memakai HTTPS/localhost |
| Struk gagal tercetak | Pastikan printer kompatibel BLE ESC/POS dan tidak sedang terkoneksi ke aplikasi lain |
