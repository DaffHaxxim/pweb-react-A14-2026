import { useEffect, useRef, useState } from "react";
import { Route, Routes } from "react-router";
import { buatDataContoh } from "./data/contohLamaran";
import { useLocalStorage } from "./hooks/useLocalStorage";
import { TataLetak } from "./layouts/TataLetak";
import { HalamanCatatLamaran } from "./pages/HalamanCatatLamaran";
import { HalamanLamaran } from "./pages/HalamanLamaran";
import { HalamanLowongan } from "./pages/HalamanLowongan";
import { HalamanOffer } from "./pages/HalamanOffer";
import { HalamanTidakDitemukan } from "./pages/HalamanTidakDitemukan";
import { ambilLowongan } from "./services/jobService";
import type {
  Application,
  ApplicationStatus,
  ChecklistItem,
  DataLamaranBaru,
  DataPindahStatus,
} from "./types/lamaran";
import type { JobListing, SumberData } from "./types/lowongan";
import { formatRupiah, formatTanggalJam } from "./utils/format";
import { mundurkanHari } from "./utils/jadwal";
import { buatId, buatLamaranBaru, buatLog, sudahDilamar, tebakModeKerja } from "./utils/lamaran";
import { bolehPindah, LABEL_STATUS } from "./utils/statusLamaran";

// Skill awal Kapten (minimal 3 sesuai soal)
const SKILL_AWAL = ["React", "TypeScript", "CSS"];

export default function App() {
  // ===== State utama (diangkat ke App agar tidak hilang saat pindah halaman) =====
  // Keduanya memakai Custom Hook useLocalStorage supaya tetap ada setelah refresh.
  const [applications, setApplications] = useLocalStorage<Application[]>("akumwmagang-applications", []);
  const [kaptenSkills, setKaptenSkills] = useLocalStorage<string[]>("akumwmagang-kapten-skills", SKILL_AWAL);

  // ===== State data lowongan (pola data / isLoading / error dari materi) =====
  const [lowongan, setLowongan] = useState<JobListing[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sumberData, setSumberData] = useState<SumberData>("remotive");
  // Penghitung untuk tombol "Coba Lagi"/"Muat Ulang": setiap bertambah, efek fetch dijalankan ulang
  const [nomorMuat, setNomorMuat] = useState(0);

  // ===== State Undo Delete (Fitur 6) =====
  // Salinan utuh lamaran terakhir yang dihapus (termasuk checklist dan activity log-nya)
  const [lamaranTerhapus, setLamaranTerhapus] = useState<Application | null>(null);
  // ID setTimeout disimpan di useRef: nilainya bertahan antar render tanpa memicu re-render
  const timerUndoRef = useRef<number | null>(null);

  // Cleanup saat App hilang: pastikan timer undo tidak tertinggal
  useEffect(() => {
    return () => {
      if (timerUndoRef.current !== null) clearTimeout(timerUndoRef.current);
    };
  }, []);

  // Fetch lowongan saat aplikasi dibuka, saat sumber data diganti, dan saat tombol muat ulang diklik.
  // Efek ini ada di App (di atas Routes), jadi pindah halaman tidak memicu fetch ulang ke Remotive.
  useEffect(() => {
    // AbortController dipakai untuk membatalkan request yang sudah tidak dibutuhkan
    const controller = new AbortController();

    const muatLowongan = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const data = await ambilLowongan(sumberData, controller.signal);
        setLowongan(data);
      } catch (err) {
        // Request yang sengaja dibatalkan (oleh cleanup di bawah) bukan error untuk pengguna
        if (controller.signal.aborted) return;
        setError(err instanceof Error ? err.message : "Terjadi kesalahan.");
      } finally {
        if (!controller.signal.aborted) {
          setIsLoading(false);
        }
      }
    };

    muatLowongan();

    // Cleanup: batalkan request lama jika sumber diganti / komponen hilang sebelum selesai
    return () => controller.abort();
  }, [sumberData, nomorMuat]);

  // ===== Handler profil skill =====
  const tambahSkill = (skill: string) => {
    setKaptenSkills((prev) => [...prev, skill]);
  };

  const hapusSkill = (skill: string) => {
    setKaptenSkills((prev) => prev.filter((item) => item !== skill));
  };

  // ===== Handler lamaran =====

  // Simpan lowongan ke daftar lamaran dengan status WISHLIST
  const simpanDariLowongan = (job: JobListing) => {
    // Penjaga anti-duplikat (tombol juga sudah disabled di kartu)
    if (sudahDilamar(applications, job.company_name, job.title)) return;

    const lamaranBaru = buatLamaranBaru(
      {
        company: job.company_name,
        role: job.title,
        workMode: tebakModeKerja(job.candidate_required_location),
        status: "WISHLIST",
        requiredSkills: job.tags,
      },
      "Eksplorasi Lowongan",
    );
    setApplications((prev) => [lamaranBaru, ...prev]);
  };

  // Simpan lamaran dari form manual (validasi sudah dilakukan di FormLamaran)
  const tambahLamaran = (data: DataLamaranBaru) => {
    const lamaranBaru = buatLamaranBaru(data, "form manual");
    setApplications((prev) => [lamaranBaru, ...prev]);
  };

  // Simulasi +15 Hari: mundurkan lastUpdatedAt agar badge Rawan Ghosting bisa diuji saat demo.
  // Contoh update immutable: buat objek baru dengan spread, bukan mengubah properti langsung.
  const simulasiGhosting = (id: string) => {
    setApplications((prev) =>
      prev.map((lamaran) =>
        lamaran.id === id
          ? {
              ...lamaran,
              lastUpdatedAt: mundurkanHari(lamaran.lastUpdatedAt, 15),
              activityLogs: [buatLog("Simulasi: waktu update terakhir dimundurkan 15 hari."), ...lamaran.activityLogs],
            }
          : lamaran,
      ),
    );
  };

  // ===== Handler detail lamaran (Fitur 4) =====
  // Semua update di bawah ini immutable: tidak ada push() atau perubahan properti langsung.
  // Polanya: map() array lamaran -> untuk lamaran yang dituju, buat objek baru dengan spread (...).

  // Pindah status mengikuti State Machine
  const pindahStatus = (id: string, statusBaru: ApplicationStatus, dataTambahan: DataPindahStatus) => {
    setApplications((prev) =>
      prev.map((lamaran) => {
        if (lamaran.id !== id) return lamaran;

        // Penjaga terakhir: tolak perpindahan yang tidak ada di tabel State Machine
        if (!bolehPindah(lamaran.status, statusBaru)) return lamaran;

        // Susun pesan log otomatis, misal "Status berubah: Screening -> Interview (jadwal 1 Des, 10.00)"
        let pesan = `Status berubah: ${LABEL_STATUS[lamaran.status]} → ${LABEL_STATUS[statusBaru]}`;
        if (dataTambahan.cvVersion) pesan += ` (versi CV: ${dataTambahan.cvVersion})`;
        if (dataTambahan.interviewDateTime) pesan += ` (jadwal ${formatTanggalJam(dataTambahan.interviewDateTime)})`;
        if (dataTambahan.salaryOffer) pesan += ` (uang saku ${formatRupiah(dataTambahan.salaryOffer)})`;

        return {
          ...lamaran,
          ...dataTambahan,
          status: statusBaru,
          lastUpdatedAt: new Date().toISOString(),
          activityLogs: [buatLog(pesan + "."), ...lamaran.activityLogs],
        };
      }),
    );
  };

  // Tambah item checklist (array baru = item lama + item baru)
  const tambahChecklist = (idLamaran: string, teks: string) => {
    const itemBaru: ChecklistItem = { id: buatId(), text: teks, done: false };
    setApplications((prev) =>
      prev.map((lamaran) =>
        lamaran.id === idLamaran ? { ...lamaran, checklist: [...lamaran.checklist, itemBaru] } : lamaran,
      ),
    );
  };

  // Centang / batal centang: immutable bertingkat (array lamaran -> array checklist -> item)
  const centangChecklist = (idLamaran: string, idItem: string) => {
    setApplications((prev) =>
      prev.map((lamaran) =>
        lamaran.id === idLamaran
          ? {
              ...lamaran,
              checklist: lamaran.checklist.map((item) =>
                item.id === idItem ? { ...item, done: !item.done } : item,
              ),
            }
          : lamaran,
      ),
    );
  };

  // Hapus item checklist memakai filter()
  const hapusChecklist = (idLamaran: string, idItem: string) => {
    setApplications((prev) =>
      prev.map((lamaran) =>
        lamaran.id === idLamaran
          ? { ...lamaran, checklist: lamaran.checklist.filter((item) => item.id !== idItem) }
          : lamaran,
      ),
    );
  };

  // Catatan manual Kapten masuk ke activityLogs (paling atas = paling baru)
  const tambahCatatan = (idLamaran: string, teks: string) => {
    setApplications((prev) =>
      prev.map((lamaran) =>
        lamaran.id === idLamaran
          ? { ...lamaran, activityLogs: [buatLog(`Catatan: ${teks}`), ...lamaran.activityLogs] }
          : lamaran,
      ),
    );
  };

  // ===== Handler hapus + undo (Fitur 6) =====
  const hapusLamaran = (id: string) => {
    const target = applications.find((lamaran) => lamaran.id === id);
    if (!target) return;

    setApplications((prev) => prev.filter((lamaran) => lamaran.id !== id));
    setLamaranTerhapus(target);

    // Jika menghapus lagi sebelum 5 detik, timer lama WAJIB dibersihkan dulu.
    // Tanpa ini, timer lama bisa menutup toast milik lamaran yang baru dihapus.
    if (timerUndoRef.current !== null) clearTimeout(timerUndoRef.current);

    timerUndoRef.current = setTimeout(() => {
      setLamaranTerhapus(null); // 5 detik lewat: penghapusan jadi permanen
      timerUndoRef.current = null;
    }, 5000);
  };

  const batalkanHapus = () => {
    if (lamaranTerhapus === null) return;

    // Kembalikan objek yang sama persis, jadi checklist dan log ikut kembali utuh
    setApplications((prev) => [lamaranTerhapus, ...prev]);
    setLamaranTerhapus(null);

    if (timerUndoRef.current !== null) clearTimeout(timerUndoRef.current);
    timerUndoRef.current = null;
  };

  // ===== Bonus: isi data contoh untuk demo (hanya dipakai saat daftar lamaran kosong) =====
  const muatDataContoh = () => {
    setApplications(buatDataContoh());
  };

  // ===== Tabel route =====
  return (
    <Routes>
      <Route
        path="/"
        element={
          <TataLetak
            applications={applications}
            lamaranTerhapus={lamaranTerhapus}
            onBatalkanHapus={batalkanHapus}
          />
        }
      >
        <Route
          index
          element={
            <HalamanLowongan
              lowongan={lowongan}
              isLoading={isLoading}
              error={error}
              sumberData={sumberData}
              onGantiSumber={setSumberData}
              onMuatUlang={() => setNomorMuat((n) => n + 1)}
              kaptenSkills={kaptenSkills}
              onTambahSkill={tambahSkill}
              onHapusSkill={hapusSkill}
              applications={applications}
              onSimpan={simpanDariLowongan}
            />
          }
        />
        <Route
          path="lamaran"
          element={
            <HalamanLamaran
              applications={applications}
              kaptenSkills={kaptenSkills}
              onSimulasi={simulasiGhosting}
              onPindahStatus={pindahStatus}
              onTambahChecklist={tambahChecklist}
              onCentangChecklist={centangChecklist}
              onHapusChecklist={hapusChecklist}
              onTambahCatatan={tambahCatatan}
              onHapus={hapusLamaran}
              onMuatContoh={muatDataContoh}
            />
          }
        />
        <Route
          path="lamaran/baru"
          element={<HalamanCatatLamaran applications={applications} onTambah={tambahLamaran} />}
        />
        <Route path="offer" element={<HalamanOffer applications={applications} kaptenSkills={kaptenSkills} />} />
        <Route path="*" element={<HalamanTidakDitemukan />} />
      </Route>
    </Routes>
  );
}
