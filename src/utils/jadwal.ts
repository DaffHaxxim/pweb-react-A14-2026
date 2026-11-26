import type { Application } from "../types/lamaran";

const SATU_HARI_MS = 24 * 60 * 60 * 1000;
const SATU_MENIT_MS = 60 * 1000;

// Berapa hari sudah berlalu sejak waktu ISO tertentu
export function selisihHari(waktuIso: string): number {
  return Math.floor((Date.now() - new Date(waktuIso).getTime()) / SATU_HARI_MS);
}

// Mundurkan waktu ISO sebanyak beberapa hari (dipakai tombol "Simulasi +15 Hari")
export function mundurkanHari(waktuIso: string, jumlahHari: number): string {
  return new Date(new Date(waktuIso).getTime() - jumlahHari * SATU_HARI_MS).toISOString();
}

// Rawan Ghosting: status APPLIED atau SCREENING yang tidak berubah lebih dari 14 hari.
// Dihitung langsung saat render (derived state), tidak disimpan di useState.
export function rawanGhosting(lamaran: Application): boolean {
  const masihMenunggu = lamaran.status === "APPLIED" || lamaran.status === "SCREENING";
  return masihMenunggu && selisihHari(lamaran.lastUpdatedAt) > 14;
}

export interface PasanganBentrok {
  pertama: Application;
  kedua: Application;
  selisihMenit: number;
}

// Cari semua pasangan lamaran INTERVIEW yang jadwalnya berselisih kurang dari 60 menit.
// Wajib menerima SELURUH data lamaran (bukan data yang sudah difilter).
export function cariBentrokInterview(applications: Application[]): PasanganBentrok[] {
  const daftarInterview = applications.filter(
    (lamaran) => lamaran.status === "INTERVIEW" && lamaran.interviewDateTime,
  );

  // Array "hasil" adalah variabel lokal, bukan state React, jadi push() di sini aman.
  const hasil: PasanganBentrok[] = [];

  // Bandingkan setiap pasangan satu kali (i dengan j, j selalu setelah i)
  for (let i = 0; i < daftarInterview.length; i++) {
    for (let j = i + 1; j < daftarInterview.length; j++) {
      const waktuPertama = new Date(daftarInterview[i].interviewDateTime ?? "").getTime();
      const waktuKedua = new Date(daftarInterview[j].interviewDateTime ?? "").getTime();
      const selisihMenit = Math.abs(waktuPertama - waktuKedua) / SATU_MENIT_MS;

      if (selisihMenit < 60) {
        hasil.push({ pertama: daftarInterview[i], kedua: daftarInterview[j], selisihMenit });
      }
    }
  }

  return hasil;
}

// Waktu interview dalam milidetik untuk keperluan sorting "Jadwal Interview Terdekat".
// Lamaran yang tidak sedang INTERVIEW ditaruh paling bawah (nilai sangat besar).
export function waktuInterview(lamaran: Application): number {
  if (lamaran.status !== "INTERVIEW" || !lamaran.interviewDateTime) {
    return Number.MAX_SAFE_INTEGER;
  }
  return new Date(lamaran.interviewDateTime).getTime();
}
