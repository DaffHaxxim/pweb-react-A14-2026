import type { ActivityLog, Application, DataLamaranBaru, WorkMode } from "../types/lamaran";

// ID unik memakai crypto.randomUUID() (disarankan soal; berjalan di localhost atau https)
export function buatId(): string {
  return crypto.randomUUID();
}

// Membuat satu baris riwayat aktivitas dengan waktu sekarang
export function buatLog(pesan: string): ActivityLog {
  return { id: buatId(), timestamp: new Date().toISOString(), message: pesan };
}

// Samakan teks sebelum dibandingkan: buang spasi di tepi dan ubah ke huruf kecil
export function samakanTeks(teks: string): string {
  return teks.trim().toLowerCase();
}

// Anti-duplikat: pasangan company + role yang sama dianggap sudah dilamar
export function sudahDilamar(applications: Application[], company: string, role: string): boolean {
  return applications.some(
    (lamaran) =>
      samakanTeks(lamaran.company) === samakanTeks(company) &&
      samakanTeks(lamaran.role) === samakanTeks(role),
  );
}

// Tebak mode kerja dari teks lokasi, misal "Surabaya (Hybrid)".
// Lowongan Remotive seluruhnya remote, jadi nilai bawaannya "Remote".
export function tebakModeKerja(lokasi: string): WorkMode {
  const teks = lokasi.toLowerCase();
  if (teks.includes("hybrid")) return "Hybrid";
  if (teks.includes("onsite") || teks.includes("on-site")) return "Onsite";
  return "Remote";
}

// Ubah "React, TypeScript, CSS" menjadi ["React", "TypeScript", "CSS"].
// Skill kosong dan skill yang tertulis dua kali (tanpa peduli huruf besar/kecil) dibuang.
export function pisahkanSkill(teks: string): string[] {
  const semuaSkill = teks
    .split(",")
    .map((skill) => skill.trim())
    .filter((skill) => skill !== "");

  return semuaSkill.filter(
    (skill, index) =>
      semuaSkill.findIndex((lain) => lain.toLowerCase() === skill.toLowerCase()) === index,
  );
}

// Membuat objek Application lengkap dari data form / lowongan.
// "asal" ditulis di log pertama, misalnya "form manual" atau "eksplorasi lowongan".
export function buatLamaranBaru(data: DataLamaranBaru, asal: string): Application {
  return {
    id: buatId(),
    company: data.company.trim(),
    role: data.role.trim(),
    workMode: data.workMode,
    status: data.status,
    requiredSkills: data.requiredSkills,
    cvVersion: data.cvVersion,
    appliedDate: data.appliedDate,
    lastUpdatedAt: new Date().toISOString(),
    checklist: [],
    activityLogs: [buatLog(`Lamaran dibuat dari ${asal} dengan status ${data.status}.`)],
  };
}
