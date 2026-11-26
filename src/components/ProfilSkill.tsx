import { useState } from "react";
import { KELAS_INPUT, KELAS_JUDUL_PANEL, KELAS_PANEL, KELAS_PESAN_GALAT } from "./gaya";
import { Tombol } from "./Tombol";

interface ProfilSkillProps {
  skills: string[];
  onTambah: (skill: string) => void;
  onHapus: (skill: string) => void;
}

// Fitur 1: Kapten bisa menambah dan menghapus skill miliknya.
export function ProfilSkill({ skills, onTambah, onHapus }: ProfilSkillProps) {
  const [teks, setTeks] = useState("");
  const [pesanGalat, setPesanGalat] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const skillBaru = teks.trim();

    if (skillBaru === "") {
      setPesanGalat("Nama skill tidak boleh kosong.");
      return;
    }

    // Tolak skill duplikat tanpa peduli huruf besar/kecil ("react" sama dengan "React")
    const sudahAda = skills.some((skill) => skill.toLowerCase() === skillBaru.toLowerCase());
    if (sudahAda) {
      setPesanGalat(`Skill "${skillBaru}" sudah ada di profil.`);
      return;
    }

    onTambah(skillBaru);
    setTeks("");
    setPesanGalat("");
  };

  return (
    <section className={KELAS_PANEL}>
      <h2 className={KELAS_JUDUL_PANEL}>Profil Skill Kapten</h2>
      <p className="mb-3 text-xs text-redup">Skill ini dipakai untuk menghitung Match Score setiap lowongan.</p>

      <form onSubmit={handleSubmit} className="flex gap-2">
        <input
          value={teks}
          onChange={(e) => setTeks(e.target.value)}
          placeholder="Skill baru"
          aria-label="Nama skill baru"
          className={KELAS_INPUT}
        />
        <Tombol type="submit" varian="gelap">
          Tambah
        </Tombol>
      </form>
      {pesanGalat && <p className={KELAS_PESAN_GALAT}>{pesanGalat}</p>}

      {skills.length === 0 ? (
        <p className="mt-3 text-xs text-redup">Belum ada skill. Tambahkan minimal satu.</p>
      ) : (
        <ul className="mt-3 flex flex-wrap gap-1.5">
          {skills.map((skill) => (
            <li
              key={skill}
              className="flex items-center gap-1 border-2 border-tepi bg-aksen-muda py-0.5 pr-1 pl-2 text-xs font-semibold"
            >
              {skill}
              <button
                type="button"
                onClick={() => onHapus(skill)}
                aria-label={`Hapus skill ${skill}`}
                className="px-1 text-redup hover:bg-pekat hover:text-di-pekat"
              >
                ×
              </button>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
