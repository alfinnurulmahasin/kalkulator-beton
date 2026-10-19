# Kalkulator Volume Beton

Kalkulator web sederhana untuk memperkirakan kebutuhan beton: volume per elemen, volume total, volume dengan cadangan susut, dan jumlah truk mixer. Dibuat dengan HTML, CSS, dan JavaScript murni (tanpa framework).

![Tampilan kalkulator](docs/screenshot.png)

**Demo:** https://alfinnurulmahasin.github.io/kalkulator-beton/

## Fitur

- **Tiga bentuk elemen**: balok/pelat, silinder (kolom bulat/tiang), dan pipa/cincin (buis beton)
- **Pilihan satuan** m, cm, atau mm untuk setiap ukuran
- **Jumlah elemen** untuk menghitung banyak elemen yang sama sekaligus
- **Susut/cadangan (%)** untuk menambah volume pesanan
- **Estimasi truk mixer** berdasarkan kapasitas yang bisa diatur, lengkap dengan rincian muatan truk terakhir
- **Validasi input** dengan pesan error per kolom, termasuk peringatan saat angka tidak wajar (misalnya salah satuan)
- **Riwayat hitungan** yang tersimpan di browser (`localStorage`), maksimal 20 terakhir
- **Salin hasil** sebagai teks ringkas
- Responsif untuk layar HP dan mendukung mode gelap

## Rumus

| Bentuk | Rumus volume |
|---|---|
| Balok / Pelat | panjang × lebar × tebal |
| Silinder | π × (diameter ÷ 2)² × tinggi |
| Pipa / Cincin | π ÷ 4 × (D luar² − D dalam²) × panjang |

```
Volume total  = volume per elemen × jumlah elemen
Dengan susut  = volume total × (1 + susut ÷ 100)
Jumlah truk   = dibulatkan ke atas dari (dengan susut ÷ kapasitas truk)
```

## Cara menjalankan

Tidak perlu instalasi. Unduh atau clone repository ini, lalu buka `index.html` di browser.

```bash
git clone https://github.com/alfinnurulmahasin/kalkulator-beton.git
```

## Struktur proyek

```
kalkulator-beton/
├── index.html        # kerangka halaman
├── css/
│   └── style.css     # tampilan
├── js/
│   ├── data.js       # daftar satuan dan bentuk elemen
│   ├── hitung.js     # rumus dan format angka
│   ├── input.js      # membaca dan memeriksa isian form
│   ├── riwayat.js    # penyimpanan riwayat di localStorage
│   └── app.js        # tampilan dan event
└── docs/
    └── screenshot.png
```

Logika hitung dipisah dari kode tampilan, dan semua bentuk elemen didefinisikan dalam satu tabel di `data.js`. Menambah bentuk baru cukup menambah satu entri di sana.

## Catatan

Hasil perhitungan hanya **estimasi awal** dan bukan pengganti perhitungan teknis oleh ahli. Persentase susut dan kapasitas truk perlu disesuaikan dengan kondisi pekerjaan nyata.

## Rencana pengembangan

- Tombol "pakai lagi" untuk memuat ulang input dari riwayat
- Bentuk elemen tambahan (pondasi telapak, tangga, dan lain-lain)
- Estimasi kebutuhan material per mutu beton
- Pengujian otomatis untuk fungsi hitung