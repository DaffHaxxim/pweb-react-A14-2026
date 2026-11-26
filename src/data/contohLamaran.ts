import type { Application } from "../types/lamaran";
import { buatId } from "../utils/lamaran";

// Data contoh untuk demo (tombol "Muat Data Contoh" di War Room saat data masih kosong).
// Semua tanggal dihitung relatif dari waktu sekarang, sehingga:
// - belum ada yang Rawan Ghosting (semua < 14 hari), dan
// - jadwal interview tidak bentrok (hanya ada satu INTERVIEW).

const SATU_HARI_MS = 24 * 60 * 60 * 1000;

// Waktu ISO "n hari yang lalu"
function hariLalu(n: number): string {
  return new Date(Date.now() - n * SATU_HARI_MS).toISOString();
}

// Tanggal "YYYY-MM-DD" n hari yang lalu (format input type="date")
function tanggalLalu(n: number): string {
  return hariLalu(n).slice(0, 10);
}

// Jadwal "YYYY-MM-DDTHH:mm" beberapa hari lagi pada jam tertentu (format input datetime-local)
function jadwalNanti(hariLagi: number, jam: string): string {
  const tanggal = new Date(Date.now() + hariLagi * SATU_HARI_MS);
  const tahun = tanggal.getFullYear();
  const bulan = String(tanggal.getMonth() + 1).padStart(2, "0");
  const hari = String(tanggal.getDate()).padStart(2, "0");
  return `${tahun}-${bulan}-${hari}T${jam}`;
}

function log(pesan: string, n: number) {
  return { id: buatId(), timestamp: hariLalu(n), message: pesan };
}

export function buatDataContoh(): Application[] {
  return [
    {
      id: buatId(),
      company: "Kopi Kode Studio",
      role: "Frontend Developer Intern",
      workMode: "Onsite",
      status: "WISHLIST",
      requiredSkills: ["React", "TypeScript", "CSS", "Tailwind CSS"],
      lastUpdatedAt: hariLalu(1),
      checklist: [],
      activityLogs: [log("Lamaran dibuat dari data contoh dengan status WISHLIST.", 1)],
    },
    {
      id: buatId(),
      company: "Edu-Spark Indonesia",
      role: "UI Engineer Intern",
      workMode: "Remote",
      status: "APPLIED",
      requiredSkills: ["React", "CSS", "Figma"],
      cvVersion: "CV-Kapten-v2.pdf",
      appliedDate: tanggalLalu(6),
      lastUpdatedAt: hariLalu(6),
      checklist: [
        { id: buatId(), text: "Sesuaikan CV dengan deskripsi lowongan", done: true },
        { id: buatId(), text: "Siapkan portofolio desain UI", done: false },
      ],
      activityLogs: [
        log("Status berubah: Wishlist → Applied (versi CV: CV-Kapten-v2.pdf).", 6),
        log("Lamaran dibuat dari data contoh dengan status WISHLIST.", 8),
      ],
    },
    {
      id: buatId(),
      company: "Teratai Software House",
      role: "QA Automation Intern",
      workMode: "Onsite",
      status: "SCREENING",
      requiredSkills: ["JavaScript", "Playwright", "TypeScript", "Git"],
      cvVersion: "CV-Kapten-v1.pdf",
      appliedDate: tanggalLalu(10),
      lastUpdatedAt: hariLalu(4),
      checklist: [{ id: buatId(), text: "Pelajari dasar automation testing", done: false }],
      activityLogs: [
        log("Status berubah: Applied → Screening.", 4),
        log("Status berubah: Wishlist → Applied (versi CV: CV-Kapten-v1.pdf).", 10),
      ],
    },
    {
      id: buatId(),
      company: "Garuda FinTech",
      role: "Full-Stack Web Developer Intern",
      workMode: "Remote",
      status: "INTERVIEW",
      requiredSkills: ["React", "Node.js", "PostgreSQL", "Express", "Docker"],
      cvVersion: "CV-Kapten-v2.pdf",
      appliedDate: tanggalLalu(12),
      interviewDateTime: jadwalNanti(2, "10:00"),
      lastUpdatedAt: hariLalu(2),
      checklist: [
        { id: buatId(), text: "Riset produk Garuda FinTech", done: true },
        { id: buatId(), text: "Latihan menjelaskan proyek React", done: true },
        { id: buatId(), text: "Review dasar SQL join", done: false },
      ],
      activityLogs: [
        log("Status berubah: Screening → Interview.", 2),
        log("Status berubah: Applied → Screening.", 7),
      ],
    },
    {
      id: buatId(),
      company: "Bintang Commerce",
      role: "Software Engineer Intern - Web Platform",
      workMode: "Hybrid",
      status: "OFFER",
      requiredSkills: ["React", "TypeScript", "CSS", "Git", "Testing"],
      cvVersion: "CV-Kapten-v2.pdf",
      appliedDate: tanggalLalu(13),
      interviewDateTime: jadwalNanti(-5, "13:00"),
      salaryOffer: 6000000,
      lastUpdatedAt: hariLalu(1),
      checklist: [],
      activityLogs: [log("Status berubah: Interview → Offer (uang saku Rp 6.000.000).", 1)],
    },
    {
      id: buatId(),
      company: "Nusantara Cloud Tech",
      role: "Frontend Engineering Intern (React & TypeScript)",
      workMode: "Remote",
      status: "OFFER",
      requiredSkills: ["React", "TypeScript", "CSS", "Git", "REST API"],
      cvVersion: "CV-Kapten-v2.pdf",
      appliedDate: tanggalLalu(13),
      interviewDateTime: jadwalNanti(-6, "09:00"),
      salaryOffer: 4500000,
      lastUpdatedAt: hariLalu(2),
      checklist: [],
      activityLogs: [log("Status berubah: Interview → Offer (uang saku Rp 4.500.000).", 2)],
    },
    {
      id: buatId(),
      company: "Rimba AI Labs",
      role: "Machine Learning Intern",
      workMode: "Hybrid",
      status: "REJECTED",
      requiredSkills: ["Python", "TensorFlow", "Docker", "SQL"],
      cvVersion: "CV-Kapten-v1.pdf",
      appliedDate: tanggalLalu(13),
      lastUpdatedAt: hariLalu(3),
      checklist: [],
      activityLogs: [log("Status berubah: Screening → Rejected.", 3)],
    },
  ];
}
