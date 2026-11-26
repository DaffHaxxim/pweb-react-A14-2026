import type { JobListing, ResponsLowongan, SumberData } from "../types/lowongan";

// Sumber utama: API publik Remotive (gratis, tanpa API key, mendukung CORS).
// Ketentuan Remotive: tampilkan tautan balik ke Remotive dan sebut Remotive sebagai sumber,
// serta jangan terlalu sering meminta data (disarankan maksimal 4 kali sehari).
export const URL_REMOTIVE = "https://remotive.com/api/remote-jobs?category=software-dev&limit=30";

// Sumber cadangan: file di folder public/ (format sama dengan Remotive)
export const URL_FALLBACK = "/magang-fallback.json";

// Ambil daftar lowongan dari sumber yang dipilih.
// "signal" berasal dari AbortController supaya request bisa dibatalkan
// ketika komponen hilang atau sumber data diganti sebelum request selesai.
export async function ambilLowongan(sumber: SumberData, signal: AbortSignal): Promise<JobListing[]> {
  const url = sumber === "remotive" ? URL_REMOTIVE : URL_FALLBACK;

  let res: Response;
  try {
    res = await fetch(url, { signal });
  } catch {
    // fetch() gagal total (offline, server mati, atau request dibatalkan)
    throw new Error("Tidak dapat terhubung ke sumber data. Periksa koneksi internet lalu coba lagi.");
  }

  if (!res.ok) {
    throw new Error(`Gagal memuat lowongan (HTTP ${res.status})`);
  }

  const json = (await res.json()) as ResponsLowongan;
  return json.jobs;
}
