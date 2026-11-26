import type { Application, WorkMode } from "../types/lamaran";
import { hitungSkillMatch } from "./skillMatch";

// Skor mode kerja sesuai soal
export const SKOR_MODE_KERJA: Record<WorkMode, number> = {
  Remote: 100,
  Hybrid: 75,
  Onsite: 50,
};

export interface SkorOffer {
  persenSkill: number; // Skill Match % offer ini
  poinGaji: number; // maksimal 50
  poinMode: number; // maksimal 25
  poinSkill: number; // maksimal 25
  total: number; // maksimal 100
}

// Total = (Normalisasi Gaji x 50%) + (Skor Mode Kerja x 25%) + (Skill Match % x 25%).
// Normalisasi gaji: gaji offer ini dibagi gaji tertinggi di antara dua offer yang dibandingkan, dikali 100.
export function hitungSkorOffer(
  offer: Application,
  gajiTertinggi: number,
  kaptenSkills: string[],
): SkorOffer {
  const gaji = offer.salaryOffer ?? 0;
  const normalisasiGaji = gajiTertinggi > 0 ? (gaji / gajiTertinggi) * 100 : 0;
  const skorMode = SKOR_MODE_KERJA[offer.workMode];
  const persenSkill = hitungSkillMatch(kaptenSkills, offer.requiredSkills).persen;

  const poinGaji = normalisasiGaji * 0.5;
  const poinMode = skorMode * 0.25;
  const poinSkill = persenSkill * 0.25;

  return { persenSkill, poinGaji, poinMode, poinSkill, total: poinGaji + poinMode + poinSkill };
}
