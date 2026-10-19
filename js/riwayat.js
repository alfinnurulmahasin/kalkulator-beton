// ===== RIWAYAT: simpan & muat dari localStorage =====

const KUNCI_RIWAYAT = "kalkulatorBeton.riwayat";
const MAKS_RIWAYAT = 20;

function buatId() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
}

// Memastikan data dari localStorage bentuknya benar sebelum dipakai
function entriValid(e) {
  return !!e &&
    typeof e.id === "string" &&
    typeof e.waktu === "string" &&
    typeof e.bentuk === "string" &&
    typeof e.ukuran === "string" &&
    typeof e.jumlah === "number" &&
    typeof e.susut === "number" &&
    typeof e.kapasitas === "number" &&
    typeof e.total === "number" &&
    typeof e.denganSusut === "number" &&
    typeof e.jumlahTruk === "number" &&
    typeof e.detailTruk === "string";
}

function muatRiwayat() {
  try {
    const mentah = localStorage.getItem(KUNCI_RIWAYAT);
    if (!mentah) return [];
    const data = JSON.parse(mentah);
    return Array.isArray(data) ? data.filter(entriValid) : [];
  } catch (e) {
    return []; // storage diblokir atau datanya rusak
  }
}

function simpanRiwayat(daftar) {
  try {
    localStorage.setItem(KUNCI_RIWAYAT, JSON.stringify(daftar));
  } catch (e) {
    // gagal menyimpan (mis. mode privat): aplikasi tetap jalan tanpa riwayat
  }
}

function tambahRiwayat(entri) {
  const daftar = muatRiwayat();
  daftar.unshift(entri); // terbaru di atas
  simpanRiwayat(daftar.slice(0, MAKS_RIWAYAT));
}

function hapusRiwayat(id) {
  simpanRiwayat(muatRiwayat().filter(function (e) { return e.id !== id; }));
}

function kosongkanRiwayat() {
  try {
    localStorage.removeItem(KUNCI_RIWAYAT);
  } catch (e) {
    // abaikan
  }
}