import type { ApplicationStatus } from "../types/lamaran";

// Urutan semua status (dipakai untuk pilihan filter)
export const SEMUA_STATUS: ApplicationStatus[] = [
  "WISHLIST",
  "APPLIED",
  "SCREENING",
  "INTERVIEW",
  "OFFER",
  "REJECTED",
  "GHOSTED",
];

// Tabel State Machine: status asal -> daftar status tujuan yang sah.
// Record<A, B> artinya objek yang kuncinya bertipe A dan nilainya bertipe B.
// - OFFER dan REJECTED final, jadi daftar tujuannya kosong.
// - GHOSTED hanya boleh kembali ke SCREENING.
// - WISHLIST tidak bisa langsung ke OFFER.
export const TRANSISI_STATUS: Record<ApplicationStatus, ApplicationStatus[]> = {
  WISHLIST: ["APPLIED"],
  APPLIED: ["SCREENING", "REJECTED", "GHOSTED"],
  SCREENING: ["INTERVIEW", "REJECTED", "GHOSTED"],
  INTERVIEW: ["OFFER", "REJECTED", "GHOSTED"],
  OFFER: [],
  REJECTED: [],
  GHOSTED: ["SCREENING"],
};

// Label yang ditampilkan ke pengguna
export const LABEL_STATUS: Record<ApplicationStatus, string> = {
  WISHLIST: "Wishlist",
  APPLIED: "Applied",
  SCREENING: "Screening",
  INTERVIEW: "Interview",
  OFFER: "Offer",
  REJECTED: "Rejected",
  GHOSTED: "Ghosted",
};

// Cek apakah perpindahan status dari "dari" ke "ke" sah
export function bolehPindah(dari: ApplicationStatus, ke: ApplicationStatus): boolean {
  return TRANSISI_STATUS[dari].includes(ke);
}

// Status final = tidak punya status tujuan lagi
export function statusFinal(status: ApplicationStatus): boolean {
  return TRANSISI_STATUS[status].length === 0;
}
