import { useEffect, useRef, useState } from "react";
import { KELAS_INPUT, KELAS_JUDUL_PANEL, KELAS_PANEL } from "../components/gaya";
import { KartuLowongan } from "../components/KartuLowongan";
import { ProfilSkill } from "../components/ProfilSkill";
import { Tombol } from "../components/Tombol";
import { useDebounce } from "../hooks/useDebounce";
import type { Application } from "../types/lamaran";
import type { JobListing, SumberData } from "../types/lowongan";
import { sudahDilamar } from "../utils/lamaran";
import { hitungSkillMatch } from "../utils/skillMatch";

interface HalamanLowonganProps {
  lowongan: JobListing[];
  isLoading: boolean;
  error: string | null;
  sumberData: SumberData;
  onGantiSumber: (sumber: SumberData) => void;
  onMuatUlang: () => void;
  kaptenSkills: string[];
  onTambahSkill: (skill: string) => void;
  onHapusSkill: (skill: string) => void;
  applications: Application[];
  onSimpan: (job: JobListing) => void;
}

type Urutan = "match" | "bawaan";

// Fitur 1: Profil Skill Kapten & Eksplorasi Lowongan
export function HalamanLowongan({
  lowongan,
  isLoading,
  error,
  sumberData,
  onGantiSumber,
  onMuatUlang,
  kaptenSkills,
  onTambahSkill,
  onHapusSkill,
  applications,
  onSimpan,
}: HalamanLowonganProps) {
  const [keyword, setKeyword] = useState("");
  const [kategori, setKategori] = useState("SEMUA");
  const [urutan, setUrutan] = useState<Urutan>("match");

  // Bonus: tekan "/" untuk langsung fokus ke kolom pencarian (memakai useRef)
  const refCari = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const tanganiTombol = (e: KeyboardEvent) => {
      // Jangan ganggu jika pengguna sedang mengetik di input lain
      const target = e.target as HTMLElement;
      const sedangMengisi = target.tagName === "INPUT" || target.tagName === "TEXTAREA" || target.tagName === "SELECT";

      if (e.key === "/" && !sedangMengisi) {
        e.preventDefault(); // supaya karakter "/" tidak ikut terketik
        refCari.current?.focus();
      }
    };

    window.addEventListener("keydown", tanganiTombol);
    // Cleanup: lepas listener saat halaman ditinggalkan
    return () => window.removeEventListener("keydown", tanganiTombol);
  }, []);

  // Custom Hook useDebounce: keywordDebounce baru berubah 400 ms setelah pengguna berhenti mengetik
  const keywordDebounce = useDebounce(keyword, 400);
  const sedangMengetik = keyword !== keywordDebounce;

  // ===== Derived state: semua di bawah ini dihitung ulang setiap render, tidak disimpan di useState =====

  // Daftar kategori unik dari data yang sedang dimuat
  const daftarKategori = lowongan
    .map((job) => job.category)
    .filter((kat, index, semua) => semua.indexOf(kat) === index);

  // Pasangkan setiap lowongan dengan hasil Skill Match-nya.
  // Karena dihitung dari kaptenSkills, persentase langsung berubah saat skill ditambah/dihapus.
  const lowonganDenganMatch = lowongan.map((job) => ({
    job,
    match: hitungSkillMatch(kaptenSkills, job.tags),
  }));

  const kata = keywordDebounce.trim().toLowerCase();
  const hasilFilter = lowonganDenganMatch.filter(({ job }) => {
    const cocokKata =
      kata === "" ||
      job.title.toLowerCase().includes(kata) ||
      job.company_name.toLowerCase().includes(kata);
    const cocokKategori = kategori === "SEMUA" || job.category === kategori;
    return cocokKata && cocokKategori;
  });

  // sort() mengubah array aslinya, jadi salin dulu dengan [...array]
  const hasilAkhir =
    urutan === "match" ? [...hasilFilter].sort((a, b) => b.match.persen - a.match.persen) : hasilFilter;

  const resetFilter = () => {
    setKeyword("");
    setKategori("SEMUA");
  };

  return (
    <div className="grid grid-cols-1 gap-5 lg:grid-cols-4">
      {/* ===== Kolom kiri: profil skill dan sumber data ===== */}
      <aside className="space-y-5 lg:col-span-1">
        <ProfilSkill skills={kaptenSkills} onTambah={onTambahSkill} onHapus={onHapusSkill} />

        <section className={KELAS_PANEL}>
          <h2 className={KELAS_JUDUL_PANEL}>Sumber Data Lowongan</h2>
          <div className="space-y-2 text-sm">
            <label className="flex items-center gap-2">
              <input
                type="radio"
                name="sumber"
                checked={sumberData === "remotive"}
                onChange={() => onGantiSumber("remotive")}
                className="accent-oranye"
              />
              Remotive API (Live)
            </label>
            <label className="flex items-center gap-2">
              <input
                type="radio"
                name="sumber"
                checked={sumberData === "lokal"}
                onChange={() => onGantiSumber("lokal")}
                className="accent-oranye"
              />
              Dataset Magang (Lokal)
            </label>
          </div>
          <Tombol varian="kedua" ukuran="kecil" onClick={onMuatUlang} className="mt-3 w-full">
            Muat Ulang Data
          </Tombol>
        </section>
      </aside>

      {/* ===== Kolom kanan: pencarian, filter, dan daftar lowongan ===== */}
      <section className="space-y-4 lg:col-span-3">
        <div className="grid grid-cols-1 gap-2 md:grid-cols-4">
          <input
            type="search"
            ref={refCari}
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            placeholder="Cari posisi atau perusahaan... (tekan / )"
            aria-label="Cari lowongan"
            className={`${KELAS_INPUT} md:col-span-2`}
          />
          <select
            value={kategori}
            onChange={(e) => setKategori(e.target.value)}
            aria-label="Filter kategori"
            className={KELAS_INPUT}
          >
            <option value="SEMUA">Semua Kategori</option>
            {daftarKategori.map((kat) => (
              <option key={kat} value={kat}>
                {kat}
              </option>
            ))}
          </select>
          <select
            value={urutan}
            onChange={(e) => setUrutan(e.target.value as Urutan)}
            aria-label="Urutan lowongan"
            className={KELAS_INPUT}
          >
            <option value="match">Skill Match Tertinggi</option>
            <option value="bawaan">Urutan Bawaan</option>
          </select>
        </div>

        <p className="text-xs text-redup">
          {sedangMengetik
            ? "Menunggu ketikan selesai..."
            : `Menampilkan ${hasilAkhir.length} dari ${lowongan.length} lowongan`}
        </p>

        {/* ===== Empat kemungkinan tampilan: Loading, Error, Kosong, atau Daftar ===== */}
        {isLoading ? (
          <div className={`${KELAS_PANEL} animate-pulse text-sm`}>
            Memuat lowongan dari {sumberData === "remotive" ? "Remotive API" : "dataset lokal"}...
          </div>
        ) : error ? (
          <div className="border-2 border-bahaya bg-bahaya-muda p-4" role="alert">
            <p className="font-bold text-bahaya">Gagal memuat lowongan</p>
            <p className="mt-1 text-sm">{error}</p>
            <div className="mt-3 flex flex-wrap gap-2">
              <Tombol varian="gelap" ukuran="kecil" onClick={onMuatUlang}>
                Coba Lagi
              </Tombol>
              {sumberData === "remotive" ? (
                <Tombol ukuran="kecil" onClick={() => onGantiSumber("lokal")}>
                  Pakai Fallback Lokal
                </Tombol>
              ) : (
                <Tombol varian="kedua" ukuran="kecil" onClick={() => onGantiSumber("remotive")}>
                  Coba Remotive API
                </Tombol>
              )}
            </div>
          </div>
        ) : hasilAkhir.length === 0 ? (
          <div className={`${KELAS_PANEL} text-sm`}>
            <p className="font-semibold">Tidak ada lowongan yang bisa ditampilkan.</p>
            <p className="mt-1 text-redup">
              {lowongan.length === 0
                ? "Sumber data tidak mengembalikan lowongan."
                : "Tidak ada lowongan yang cocok dengan pencarian atau kategori ini."}
            </p>
            {lowongan.length > 0 && (
              <Tombol varian="kedua" ukuran="kecil" onClick={resetFilter} className="mt-3">
                Reset Pencarian
              </Tombol>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {hasilAkhir.map(({ job, match }) => (
              <KartuLowongan
                key={job.id}
                job={job}
                match={match}
                sudahAda={sudahDilamar(applications, job.company_name, job.title)}
                onSimpan={() => onSimpan(job)}
              />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
