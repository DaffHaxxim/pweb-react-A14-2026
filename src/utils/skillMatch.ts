// Hasil perhitungan kecocokan skill
export interface HasilSkillMatch {
  persen: number; // 0 sampai 100
  cocok: string[]; // skill yang dimiliki Kapten
  kurang: string[]; // missing skills
}

// Rumus soal: Math.round((jumlahCocok / totalRequired) * 100), tidak peduli huruf besar/kecil.
// Fungsi murni: hasilnya hanya bergantung pada input, jadi aman dihitung ulang setiap render.
export function hitungSkillMatch(kaptenSkills: string[], requiredSkills: string[]): HasilSkillMatch {
  // Samakan semua skill Kapten ke huruf kecil dulu
  const skillKapten = kaptenSkills.map((skill) => skill.trim().toLowerCase());

  const cocok = requiredSkills.filter((skill) => skillKapten.includes(skill.trim().toLowerCase()));
  const kurang = requiredSkills.filter((skill) => !skillKapten.includes(skill.trim().toLowerCase()));

  // Hindari pembagian dengan nol jika lowongan tidak punya daftar skill
  const totalRequired = requiredSkills.length;
  const persen = totalRequired === 0 ? 0 : Math.round((cocok.length / totalRequired) * 100);

  return { persen, cocok, kurang };
}

// Tingkat warna badge: hijau >= 70%, kuning 40-69%, merah < 40%
export type TingkatMatch = "tinggi" | "sedang" | "rendah";

export function tingkatMatch(persen: number): TingkatMatch {
  if (persen >= 70) return "tinggi";
  if (persen >= 40) return "sedang";
  return "rendah";
}
