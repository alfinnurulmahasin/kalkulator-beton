// ===== HITUNG: rumus & format (tidak menyentuh tampilan) =====

function hitungVolume(volumePerElemen, jumlah, susutPersen) {
  const total = volumePerElemen * jumlah;
  const denganSusut = total * (1 + susutPersen / 100);
  return { perElemen: volumePerElemen, total: total, denganSusut: denganSusut };
}

function hitungTruk(volume, kapasitas) {
  // Dibulatkan agar selisih desimal komputer (mis. 28.000000000000004)
  // tidak mengubah hasil
  const v = Math.round(volume * 1e6) / 1e6;
  const penuh = Math.floor(v / kapasitas + 1e-9);
  const sisa = Math.max(0, Math.round((v - penuh * kapasitas) * 1e6) / 1e6);
  const jumlahTruk = penuh + (sisa > 0 ? 1 : 0);
  return { jumlahTruk: jumlahTruk, penuh: penuh, sisa: sisa };
}

function formatAngka(angka) {
  return angka.toLocaleString("id-ID", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 3,
  });
}

function formatWaktu(iso) {
  const tanggal = new Date(iso);
  if (isNaN(tanggal.getTime())) return "";
  return tanggal.toLocaleString("id-ID", {
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function teksDetailTruk(truk) {
  if (truk.sisa === 0) {
    return truk.penuh + " truk penuh";
  }
  if (truk.penuh === 0) {
    return "1 truk berisi " + formatAngka(truk.sisa) + " m³";
  }
  return truk.penuh + " truk penuh + 1 truk berisi " + formatAngka(truk.sisa) + " m³";
}

// Ringkasan teks yang disalin ke clipboard
function buatRingkasan(c) {
  return [
    "Kalkulator Volume Beton",
    "Bentuk: " + c.bentuk,
    "Ukuran: " + c.ukuran,
    "Jumlah elemen: " + c.jumlah,
    "Volume total: " + formatAngka(c.total) + " m³",
    "Susut/cadangan: " + c.susut.toLocaleString("id-ID", { maximumFractionDigits: 2 }) + "%",
    "Dengan susut: " + formatAngka(c.denganSusut) + " m³",
    "Perkiraan truk mixer (@" + c.kapasitas.toLocaleString("id-ID") + " m³): " +
      c.jumlahTruk + " truk (" + c.detailTruk + ")",
  ].join("\n");
}