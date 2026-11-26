import { useState } from "react";
import { Link } from "react-router";
import { DetailLamaran } from "../components/DetailLamaran";
import { KELAS_INPUT, KELAS_PANEL } from "../components/gaya";
import { KartuLamaran } from "../components/KartuLamaran";
import { Tombol } from "../components/Tombol";
import type { Application, ApplicationStatus, DataPindahStatus } from "../types/lamaran";
import { rawanGhosting, waktuInterview } from "../utils/jadwal";
import { hitungSkillMatch } from "../utils/skillMatch";
import { LABEL_STATUS, SEMUA_STATUS } from "../utils/statusLamaran";

interface HalamanLamaranProps {
  applications: Application[];
  kaptenSkills: string[];
  onSimulasi: (id: string) => void;
  onPindahStatus: (id: string, statusBaru: ApplicationStatus, data: DataPindahStatus) => void;
  onTambahChecklist: (id: string, teks: string) => void;
  onCentangChecklist: (id: string, idItem: string) => void;
  onHapusChecklist: (id: string, idItem: string) => void;
  onTambahCatatan: (id: string, teks: string) => void;
}

type Urutan = "terbaru" | "interview" | "offer";

// Fitur 3: War Room Pipeline (daftar lamaran + filter gabungan)
export function HalamanLamaran({
  applications,
  kaptenSkills,
  onSimulasi,
  onPindahStatus,
  onTambahChecklist,
  onCentangChecklist,
  onHapusChecklist,
  onTambahCatatan,
}: HalamanLamaranProps) {
  // State filter (hanya memengaruhi tampilan, data asli di App tidak berubah)
  const [cari, setCari] = useState("");
  const [filterStatus, setFilterStatus] = useState<ApplicationStatus | "SEMUA">("SEMUA");
  const [hanyaGhosting, setHanyaGhosting] = useState(false);
  const [urutan, setUrutan] = useState<Urutan>("terbaru");

  // ID lamaran yang detailnya sedang dibuka (null = modal tertutup)
  const [idTerpilih, setIdTerpilih] = useState<string | null>(null);

  // Objek lamaran dicari dari data terbaru setiap render, jadi modal selalu menampilkan data mutakhir.
  // Jika lamaran itu dihapus, hasilnya undefined dan modal otomatis tertutup.
  const lamaranTerpilih = applications.find((lamaran) => lamaran.id === idTerpilih);

  // ===== Derived state: hasil filter dan sorting dihitung setiap render =====
  const kata = cari.trim().toLowerCase();
  const hasilFilter = applications.filter((lamaran) => {
    const cocokKata =
      kata === "" ||
      lamaran.company.toLowerCase().includes(kata) ||
      lamaran.role.toLowerCase().includes(kata);
    const cocokStatus = filterStatus === "SEMUA" || lamaran.status === filterStatus;
    const cocokGhosting = !hanyaGhosting || rawanGhosting(lamaran);
    return cocokKata && cocokStatus && cocokGhosting;
  });

  // sort() mengubah array aslinya, jadi salin dulu dengan [...array]
  const hasilAkhir = [...hasilFilter].sort((a, b) => {
    if (urutan === "interview") return waktuInterview(a) - waktuInterview(b);
    if (urutan === "offer") return (b.salaryOffer ?? 0) - (a.salaryOffer ?? 0);
    // "terbaru": lastUpdatedAt paling baru di atas
    return new Date(b.lastUpdatedAt).getTime() - new Date(a.lastUpdatedAt).getTime();
  });

  return (
    <section className="space-y-4">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold">War Room Lamaran</h1>
          <p className="text-sm text-redup">Lacak setiap lamaran Kapten dari wishlist sampai offer.</p>
        </div>
      </div>

      {/* ===== Filter gabungan ===== */}
      <div className="grid grid-cols-1 items-center gap-2 border-2 border-hitam bg-permukaan p-3 md:grid-cols-4">
        <input
          type="search"
          value={cari}
          onChange={(e) => setCari(e.target.value)}
          placeholder="Cari perusahaan atau posisi..."
          aria-label="Cari lamaran"
          className={KELAS_INPUT}
        />
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value as ApplicationStatus | "SEMUA")}
          aria-label="Filter status"
          className={KELAS_INPUT}
        >
          <option value="SEMUA">Semua Status</option>
          {SEMUA_STATUS.map((status) => (
            <option key={status} value={status}>
              {LABEL_STATUS[status]}
            </option>
          ))}
        </select>
        <select
          value={urutan}
          onChange={(e) => setUrutan(e.target.value as Urutan)}
          aria-label="Urutan lamaran"
          className={KELAS_INPUT}
        >
          <option value="terbaru">Terbaru</option>
          <option value="interview">Jadwal Interview Terdekat</option>
          <option value="offer">Offer Tertinggi</option>
        </select>
        <label className="flex items-center gap-2 text-sm font-medium">
          <input
            type="checkbox"
            checked={hanyaGhosting}
            onChange={(e) => setHanyaGhosting(e.target.checked)}
            className="h-4 w-4 accent-oranye"
          />
          Hanya Rawan Ghosting
        </label>
      </div>

      <p className="text-xs text-redup">
        Menampilkan {hasilAkhir.length} dari {applications.length} lamaran
      </p>

      {/* ===== Daftar lamaran / state kosong ===== */}
      {applications.length === 0 ? (
        <div className={`${KELAS_PANEL} text-sm`}>
          <p className="font-semibold">Belum ada lamaran.</p>
          <p className="mt-1 text-redup">
            Simpan lowongan dari halaman Eksplorasi, atau catat lamaran secara manual.
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            <Link
              to="/lamaran/baru"
              className="border-2 border-hitam bg-kuning px-3 py-1 text-xs font-semibold shadow-tegas-kecil hover:bg-emas"
            >
              + Catat Lamaran
            </Link>
          </div>
        </div>
      ) : hasilAkhir.length === 0 ? (
        <div className={`${KELAS_PANEL} text-sm`}>
          <p className="font-semibold">Tidak ada lamaran yang cocok dengan filter.</p>
          <Tombol
            varian="kedua"
            ukuran="kecil"
            className="mt-3"
            onClick={() => {
              setCari("");
              setFilterStatus("SEMUA");
              setHanyaGhosting(false);
            }}
          >
            Reset Filter
          </Tombol>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
          {hasilAkhir.map((lamaran) => (
            <KartuLamaran
              key={lamaran.id}
              lamaran={lamaran}
              persenMatch={hitungSkillMatch(kaptenSkills, lamaran.requiredSkills).persen}
              onSimulasi={() => onSimulasi(lamaran.id)}
              onDetail={() => setIdTerpilih(lamaran.id)}
            />
          ))}
        </div>
      )}

      {/* Modal detail: hanya dirender saat ada lamaran terpilih.
          Saat ditutup, komponen di-unmount sehingga cleanup useEffect di dalamnya berjalan. */}
      {lamaranTerpilih && (
        <DetailLamaran
          lamaran={lamaranTerpilih}
          persenMatch={hitungSkillMatch(kaptenSkills, lamaranTerpilih.requiredSkills).persen}
          onTutup={() => setIdTerpilih(null)}
          onPindahStatus={(statusBaru, data) => onPindahStatus(lamaranTerpilih.id, statusBaru, data)}
          onTambahChecklist={(teks) => onTambahChecklist(lamaranTerpilih.id, teks)}
          onCentangChecklist={(idItem) => onCentangChecklist(lamaranTerpilih.id, idItem)}
          onHapusChecklist={(idItem) => onHapusChecklist(lamaranTerpilih.id, idItem)}
          onTambahCatatan={(teks) => onTambahCatatan(lamaranTerpilih.id, teks)}
          onSimulasi={() => onSimulasi(lamaranTerpilih.id)}
        />
      )}
    </section>
  );
}
