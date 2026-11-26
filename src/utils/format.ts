// Fungsi bantu untuk menampilkan angka, tanggal, dan waktu

// 4500000 -> "Rp 4.500.000"
export function formatRupiah(angka: number): string {
  return "Rp " + angka.toLocaleString("id-ID");
}

// "2026-11-22T10:30" -> "22 Nov 2026"
export function formatTanggal(waktu: string): string {
  return new Date(waktu).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

// "2026-11-22T10:30" -> "22 Nov, 10.30"
export function formatTanggalJam(waktu: string): string {
  return new Date(waktu).toLocaleString("id-ID", {
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });
}

// 102 detik -> "01:42"
export function formatWaktu(totalDetik: number): string {
  const menit = Math.floor(totalDetik / 60);
  const detik = totalDetik % 60;
  return String(menit).padStart(2, "0") + ":" + String(detik).padStart(2, "0");
}

// "Garuda FinTech" -> "GF" (untuk kotak logo perusahaan)
export function inisial(nama: string): string {
  return nama
    .split(" ")
    .filter((kata) => kata !== "")
    .slice(0, 2)
    .map((kata) => kata[0].toUpperCase())
    .join("");
}
