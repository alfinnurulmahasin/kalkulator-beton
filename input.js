// ===== INPUT: membaca & memeriksa isian form =====
// Tiap fungsi mengembalikan { nilai } kalau valid, atau { error } kalau tidak.

function bacaUkuran(def) {
  const input = document.getElementById(def.id);
  const pilihan = document.getElementById(def.id + "-satuan");
  const satuan = parseFloat(pilihan.value);
  const nilai = parseFloat(input.value);

  if (input.value.trim() === "" || isNaN(nilai)) {
    return { error: "Wajib diisi." };
  }
  if (nilai <= 0) {
    return { error: "Harus lebih besar dari 0." };
  }

  const meter = nilai * satuan;
  if (meter > def.maks) {
    return { error: "Terlalu besar (maks. " + def.maks + " m). Periksa satuannya." };
  }

  // teks dipakai untuk riwayat dan ringkasan salin, mis. "Panjang 5 m"
  const namaSatuan = pilihan.options[pilihan.selectedIndex].text;
  const angka = nilai.toLocaleString("id-ID", { maximumFractionDigits: 4 });
  return { nilai: meter, teks: def.label + " " + angka + " " + namaSatuan };
}

function bacaJumlah() {
  const input = document.getElementById("jumlah");
  const nilai = parseFloat(input.value);

  if (input.value.trim() === "" || isNaN(nilai)) {
    return { error: "Wajib diisi." };
  }
  if (!Number.isInteger(nilai) || nilai < 1) {
    return { error: "Isi bilangan bulat minimal 1." };
  }
  if (nilai > 10000) {
    return { error: "Terlalu banyak (maks. 10.000)." };
  }
  return { nilai: nilai };
}

function bacaSusut() {
  const input = document.getElementById("susut");
  if (input.value.trim() === "") {
    return { nilai: 0 }; // kosong dianggap tanpa susut
  }
  const nilai = parseFloat(input.value);

  if (isNaN(nilai) || nilai < 0) {
    return { error: "Tidak boleh negatif." };
  }
  if (nilai > 30) {
    return { error: "Maksimal 30%." };
  }
  return { nilai: nilai };
}

function bacaKapasitas() {
  const input = document.getElementById("kapasitas");
  const nilai = parseFloat(input.value);

  if (input.value.trim() === "" || isNaN(nilai)) {
    return { error: "Wajib diisi." };
  }
  if (nilai <= 0) {
    return { error: "Harus lebih besar dari 0." };
  }
  if (nilai > 20) {
    return { error: "Terlalu besar (maks. 20 m³)." };
  }
  return { nilai: nilai };
}