// Tipe data lamaran (Application) sesuai Skema Data pada soal.
// Nama field memakai bahasa Inggris karena sudah ditentukan soal.

// Tujuh status lamaran yang mungkin
export type ApplicationStatus =
  | "WISHLIST"
  | "APPLIED"
  | "SCREENING"
  | "INTERVIEW"
  | "OFFER"
  | "REJECTED"
  | "GHOSTED";

// Mode kerja, dipakai juga untuk skor di Offer Comparator
export type WorkMode = "Remote" | "Hybrid" | "Onsite";

// Satu item checklist persiapan di dalam sebuah lamaran
export interface ChecklistItem {
  id: string;
  text: string;
  done: boolean;
}

// Satu baris riwayat aktivitas (perubahan status atau catatan manual)
export interface ActivityLog {
  id: string;
  timestamp: string; // waktu ISO, misal "2026-11-26T10:00:00.000Z"
  message: string;
}

export interface Application {
  id: string;
  company: string;
  role: string;
  workMode: WorkMode;
  status: ApplicationStatus;
  requiredSkills: string[];
  cvVersion?: string; // wajib saat pindah ke APPLIED
  appliedDate?: string; // format YYYY-MM-DD, wajib saat pindah ke APPLIED
  interviewDateTime?: string; // format YYYY-MM-DDTHH:mm, wajib saat INTERVIEW
  salaryOffer?: number; // uang saku per bulan (Rp), wajib > 0 saat OFFER
  lastUpdatedAt: string; // waktu ISO, dasar hitung Rawan Ghosting
  checklist: ChecklistItem[];
  activityLogs: ActivityLog[];
}

// Data tambahan yang ikut dikirim saat pindah status.
// Semua opsional karena tiap status tujuan butuh field yang berbeda.
export interface DataPindahStatus {
  cvVersion?: string;
  appliedDate?: string;
  interviewDateTime?: string;
  salaryOffer?: number;
  workMode?: WorkMode;
}

// Data dari form tambah lamaran manual (belum punya id, log, dll.)
export interface DataLamaranBaru {
  company: string;
  role: string;
  workMode: WorkMode;
  status: "WISHLIST" | "APPLIED";
  requiredSkills: string[];
  cvVersion?: string;
  appliedDate?: string;
}
