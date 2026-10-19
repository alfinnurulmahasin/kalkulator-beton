// ===== APP: tampilan & event (menyambungkan semua file lain) =====

const form = document.getElementById("form-hitung");
const pilihBentuk = document.getElementById("bentuk");
const areaUkuran = document.getElementById("area-ukuran");
const tombolSalin = document.getElementById("tombol-salin");
const statusSalin = document.getElementById("status-salin");
const daftarRiwayat = document.getElementById("daftar-riwayat");
const riwayatKosong = document.getElementById("riwayat-kosong");
const tombolHapusSemua = document.getElementById("hapus-semua");

let teksHasilTerakhir = "";
let timerStatus = null;

// ---------- Membuat tampilan ----------
function isiPilihanBentuk() {
  pilihBentuk.innerHTML = Object.keys(BENTUK).map(function (kunci) {
    return '<option value="' + kunci + '">' + BENTUK[kunci].nama + "</option>";
  }).join("");
}

function opsiSatuan(satuanAwal) {
  return Object.keys(SATUAN).map(function (nama) {
    const terpilih = nama === satuanAwal ? " selected" : "";
    return '<option value="' + SATUAN[nama] + '"' + terpilih + ">" + nama + "</option>";
  }).join("");
}

function renderUkuran(kunciBentuk) {
  const bentuk = BENTUK[kunciBentuk];
  document.getElementById("rumus").textContent = "Rumus: " + bentuk.rumus;

  areaUkuran.innerHTML = bentuk.ukuran.map(function (def) {
    return (
      '<div class="field">' +
        '<label for="' + def.id + '">' + def.label + "</label>" +
        '<div class="row">' +
          '<input type="number" id="' + def.id + '" inputmode="decimal" step="any" min="0" placeholder="contoh: ' + def.contoh + '">' +
          '<select id="' + def.id + '-satuan" aria-label="Satuan ' + def.label + '">' +
            opsiSatuan(def.satuan) +
          "</select>" +
        "</div>" +
        '<p class="error" id="' + def.id + '-error"></p>' +
      "</div>"
    );
  }).join("");
}

function tampilkanError(id, pesan) {
  const elemenError = document.getElementById(id + "-error");
  const elemenInput = document.getElementById(id);
  if (!elemenError || !elemenInput) return;
  elemenError.textContent = pesan || "";
  elemenInput.setAttribute("aria-invalid", pesan ? "true" : "false");
}

function bersihkanSemuaError() {
  document.querySelectorAll(".error").forEach(function (el) {
    el.textContent = "";
  });
  document.querySelectorAll("input[aria-invalid]").forEach(function (el) {
    el.setAttribute("aria-invalid", "false");
  });
}

function sembunyikanHasil() {
  document.getElementById("hasil").hidden = true;
  teksHasilTerakhir = "";
  statusSalin.textContent = "";
}

function tampilkanHasil(hasil, truk) {
  document.getElementById("hasil-per-elemen").textContent = formatAngka(hasil.perElemen);
  document.getElementById("hasil-total").textContent = formatAngka(hasil.total);
  document.getElementById("hasil-susut").textContent = formatAngka(hasil.denganSusut);
  document.getElementById("hasil-truk").textContent = truk.jumlahTruk.toLocaleString("id-ID");
  document.getElementById("hasil-truk-detail").textContent = teksDetailTruk(truk);
  statusSalin.textContent = "";
  document.getElementById("hasil").hidden = false;
}

// ---------- Riwayat ----------
function buatElemen(tag, kelas, teks) {
  const el = document.createElement(tag);
  if (kelas) el.className = kelas;
  if (teks !== undefined) el.textContent = teks;
  return el;
}

function renderRiwayat() {
  const daftar = muatRiwayat();
  daftarRiwayat.innerHTML = "";
  riwayatKosong.hidden = daftar.length > 0;
  tombolHapusSemua.hidden = daftar.length === 0;

  daftar.forEach(function (e) {
    const item = buatElemen("li", "item-riwayat");

    const atas = buatElemen("div", "item-atas");
    atas.appendChild(buatElemen("strong", "", e.bentuk));
    atas.appendChild(buatElemen("span", "item-waktu", formatWaktu(e.waktu)));
    item.appendChild(atas);

    const ringkas = e.ukuran + " · " + e.jumlah + " elemen · susut " +
      e.susut.toLocaleString("id-ID", { maximumFractionDigits: 2 }) + "%";
    item.appendChild(buatElemen("p", "item-ukuran", ringkas));

    const hasil = "Dengan susut " + formatAngka(e.denganSusut) + " m³ · " + e.jumlahTruk + " truk";
    item.appendChild(buatElemen("p", "item-hasil", hasil));

    const bawah = buatElemen("div", "item-bawah");
    const tombolHapus = buatElemen("button", "btn-teks", "Hapus");
    tombolHapus.type = "button";
    tombolHapus.dataset.id = e.id;
    tombolHapus.setAttribute("aria-label", "Hapus hitungan " + e.bentuk);
    bawah.appendChild(tombolHapus);
    item.appendChild(bawah);

    daftarRiwayat.appendChild(item);
  });
}

// ---------- Salin ke clipboard ----------
function salinTeks(teks) {
  if (navigator.clipboard && window.isSecureContext) {
    return navigator.clipboard.writeText(teks);
  }
  // Cadangan untuk halaman yang dibuka tanpa localhost/https
  return new Promise(function (resolve, reject) {
    const area = document.createElement("textarea");
    area.value = teks;
    area.setAttribute("readonly", "");
    area.style.position = "fixed";
    area.style.opacity = "0";
    document.body.appendChild(area);
    area.select();
    let berhasil = false;
    try {
      berhasil = document.execCommand("copy");
    } catch (e) {
      berhasil = false;
    }
    document.body.removeChild(area);
    if (berhasil) {
      resolve();
    } else {
      reject(new Error("Gagal menyalin"));
    }
  });
}

function tampilkanStatusSalin(pesan) {
  statusSalin.textContent = pesan;
  clearTimeout(timerStatus);
  timerStatus = setTimeout(function () {
    statusSalin.textContent = "";
  }, 2500);
}

// ---------- Event ----------
form.addEventListener("submit", function (event) {
  event.preventDefault(); // cegah halaman reload

  const bentuk = BENTUK[pilihBentuk.value];
  const nilaiUkuran = {};
  const teksUkuran = [];
  let adaError = false;
  let kolomPertamaError = null;

  function catatError(id, pesan) {
    tampilkanError(id, pesan);
    if (pesan) {
      adaError = true;
      if (!kolomPertamaError) kolomPertamaError = id;
    }
  }

  // 1. Ukuran sesuai bentuk
  bentuk.ukuran.forEach(function (def) {
    const hasil = bacaUkuran(def);
    catatError(def.id, hasil.error);
    if (!hasil.error) {
      nilaiUkuran[def.id] = hasil.nilai;
      teksUkuran.push(hasil.teks);
    }
  });

  // 2. Pemeriksaan tambahan antar kolom (kalau semua ukuran sudah valid)
  if (!adaError && bentuk.validasi) {
    const masalah = bentuk.validasi(nilaiUkuran);
    if (masalah) catatError(masalah.id, masalah.pesan);
  }

  // 3. Jumlah elemen, susut, dan kapasitas truk
  const jumlah = bacaJumlah();
  catatError("jumlah", jumlah.error);
  const susut = bacaSusut();
  catatError("susut", susut.error);
  const kapasitas = bacaKapasitas();
  catatError("kapasitas", kapasitas.error);

  if (adaError) {
    sembunyikanHasil();
    document.getElementById(kolomPertamaError).focus();
    return;
  }

  // 4. Hitung
  const volumePerElemen = bentuk.hitung(nilaiUkuran);
  const hasil = hitungVolume(volumePerElemen, jumlah.nilai, susut.nilai);
  const truk = hitungTruk(hasil.denganSusut, kapasitas.nilai);

  // 5. Catat untuk riwayat & salin
  const catatan = {
    id: buatId(),
    waktu: new Date().toISOString(),
    bentuk: bentuk.nama,
    ukuran: teksUkuran.join(", "),
    jumlah: jumlah.nilai,
    susut: susut.nilai,
    kapasitas: kapasitas.nilai,
    total: hasil.total,
    denganSusut: hasil.denganSusut,
    jumlahTruk: truk.jumlahTruk,
    detailTruk: teksDetailTruk(truk),
  };

  teksHasilTerakhir = buatRingkasan(catatan);
  tampilkanHasil(hasil, truk);
  tambahRiwayat(catatan);
  renderRiwayat();
});

// Ganti bentuk: kolom ukuran dibuat ulang, hasil lama disembunyikan
pilihBentuk.addEventListener("change", function () {
  renderUkuran(pilihBentuk.value);
  bersihkanSemuaError();
  sembunyikanHasil();
});

// Reset: setelah browser mengosongkan form, buat ulang kolom sesuai bentuk awal
form.addEventListener("reset", function () {
  setTimeout(function () {
    renderUkuran(pilihBentuk.value);
    bersihkanSemuaError();
    sembunyikanHasil();
  }, 0);
});

// Hapus pesan error begitu pengguna mulai memperbaiki isiannya
form.addEventListener("input", function (event) {
  if (event.target.matches("input")) {
    tampilkanError(event.target.id, "");
  }
});

tombolSalin.addEventListener("click", function () {
  if (!teksHasilTerakhir) return;
  salinTeks(teksHasilTerakhir)
    .then(function () { tampilkanStatusSalin("Tersalin."); })
    .catch(function () { tampilkanStatusSalin("Gagal menyalin."); });
});

// Satu pendengar untuk semua tombol "Hapus" di daftar riwayat
daftarRiwayat.addEventListener("click", function (event) {
  const tombol = event.target.closest("button[data-id]");
  if (!tombol) return;
  hapusRiwayat(tombol.dataset.id);
  renderRiwayat();
});

tombolHapusSemua.addEventListener("click", function () {
  if (window.confirm("Hapus semua riwayat hitungan?")) {
    kosongkanRiwayat();
    renderRiwayat();
  }
});

// ---------- MULAI ----------
isiPilihanBentuk();
renderUkuran(pilihBentuk.value);
renderRiwayat();