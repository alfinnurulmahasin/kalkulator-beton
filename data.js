// ===== DATA: satuan & bentuk elemen =====

// Nilai satuan = pengali untuk mengubah ke meter
const SATUAN = { m: 1, cm: 0.01, mm: 0.001 };

// Setiap bentuk punya: nama, rumus (teks), daftar ukuran, dan fungsi hitung.
// Semua nilai ukuran yang masuk ke fungsi hitung sudah dalam METER.
// maks = batas wajar (meter) untuk menangkap salah satuan.
// Menambah bentuk baru cukup menambah satu entri di sini.
const BENTUK = {
  balok: {
    nama: "Balok / Pelat",
    rumus: "panjang × lebar × tebal",
    ukuran: [
      { id: "panjang", label: "Panjang", satuan: "m",  maks: 1000, contoh: 5 },
      { id: "lebar",   label: "Lebar",   satuan: "m",  maks: 1000, contoh: 4 },
      { id: "tebal",   label: "Tebal / Tinggi", satuan: "cm", maks: 10, contoh: 12 },
    ],
    hitung: function (u) {
      return u.panjang * u.lebar * u.tebal;
    },
  },

  silinder: {
    nama: "Silinder (kolom bulat / tiang)",
    rumus: "π × (diameter ÷ 2)² × tinggi",
    ukuran: [
      { id: "diameter", label: "Diameter", satuan: "cm", maks: 10,  contoh: 40 },
      { id: "tinggi",   label: "Tinggi",   satuan: "m",  maks: 100, contoh: 3 },
    ],
    hitung: function (u) {
      const jariJari = u.diameter / 2;
      return Math.PI * jariJari * jariJari * u.tinggi;
    },
  },

  pipa: {
    nama: "Pipa / Cincin (buis beton)",
    rumus: "π ÷ 4 × (D luar² − D dalam²) × panjang",
    ukuran: [
      { id: "diameterLuar",  label: "Diameter luar",  satuan: "cm", maks: 10,  contoh: 60 },
      { id: "diameterDalam", label: "Diameter dalam", satuan: "cm", maks: 10,  contoh: 50 },
      { id: "panjang",       label: "Panjang",        satuan: "m",  maks: 100, contoh: 1 },
    ],
    // Pemeriksaan tambahan yang melibatkan beberapa kolom sekaligus
    validasi: function (u) {
      if (u.diameterDalam >= u.diameterLuar) {
        return { id: "diameterDalam", pesan: "Harus lebih kecil dari diameter luar." };
      }
      return null;
    },
    hitung: function (u) {
      const luar = u.diameterLuar * u.diameterLuar;
      const dalam = u.diameterDalam * u.diameterDalam;
      return (Math.PI / 4) * (luar - dalam) * u.panjang;
    },
  },
};