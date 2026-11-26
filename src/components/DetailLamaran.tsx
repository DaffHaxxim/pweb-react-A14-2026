import type { Application, ApplicationStatus, DataPindahStatus } from "../types/lamaran";
import { formatRupiah, formatTanggal, formatTanggalJam, inisial } from "../utils/format";
import { rawanGhosting, selisihHari } from "../utils/jadwal";
import { LABEL_STATUS } from "../utils/statusLamaran";
import { BadgeMatch } from "./BadgeMatch";
import { BadgeGhosting, BadgeStatus } from "./BadgeStatus";
import { ChecklistPersiapan } from "./ChecklistPersiapan";
import { KELAS_JUDUL_PANEL } from "./gaya";
import { LatihanInterview } from "./LatihanInterview";
import { PindahStatus } from "./PindahStatus";
import { RiwayatAktivitas } from "./RiwayatAktivitas";
import { Tombol } from "./Tombol";

interface DetailLamaranProps {
  lamaran: Application;
  persenMatch: number;
  onTutup: () => void;
  onPindahStatus: (statusBaru: ApplicationStatus, data: DataPindahStatus) => void;
  onTambahChecklist: (teks: string) => void;
  onCentangChecklist: (idItem: string) => void;
  onHapusChecklist: (idItem: string) => void;
  onTambahCatatan: (teks: string) => void;
  onSimulasi: () => void;
  onHapus: () => void;
}

// Tahapan utama untuk stepper "Tahap Seleksi"
const TAHAP_SELEKSI: ApplicationStatus[] = ["WISHLIST", "APPLIED", "SCREENING", "INTERVIEW", "OFFER"];

// Fitur 4: modal detail lamaran (state machine, checklist, activity log)
export function DetailLamaran({
  lamaran,
  persenMatch,
  onTutup,
  onPindahStatus,
  onTambahChecklist,
  onCentangChecklist,
  onHapusChecklist,
  onTambahCatatan,
  onSimulasi,
  onHapus,
}: DetailLamaranProps) {
  // Posisi status sekarang di stepper (-1 untuk REJECTED / GHOSTED)
  const indexTahap = TAHAP_SELEKSI.indexOf(lamaran.status);
  const bisaDisimulasi = lamaran.status === "APPLIED" || lamaran.status === "SCREENING";

  return (
    // Lapisan gelap di belakang modal
    <div className="fixed inset-0 z-40 flex items-start justify-center overflow-y-auto bg-hitam/60 p-3 md:p-6">
      <section
        role="dialog"
        aria-modal="true"
        aria-label={`Detail lamaran ${lamaran.company}`}
        className="w-full max-w-5xl animate-muncul border-2 border-hitam bg-latar shadow-tegas"
      >
        {/* ===== Header modal ===== */}
        <header className="flex flex-wrap items-start justify-between gap-3 border-b-2 border-hitam bg-permukaan p-4">
          <div className="flex min-w-0 items-start gap-3">
            <span className="grid h-12 w-12 shrink-0 place-items-center bg-hitam font-mono font-semibold text-kuning">
              {inisial(lamaran.company)}
            </span>
            <div className="min-w-0">
              <h2 className="text-lg leading-snug font-bold">
                {lamaran.role} · {lamaran.company}
              </h2>
              <p className="text-xs text-redup">
                {lamaran.workMode} · CV: {lamaran.cvVersion ?? "-"}
                {lamaran.appliedDate && ` · Dikirim ${formatTanggal(lamaran.appliedDate)}`}
                {lamaran.interviewDateTime && ` · Interview ${formatTanggalJam(lamaran.interviewDateTime)}`}
                {lamaran.salaryOffer !== undefined && ` · Offer ${formatRupiah(lamaran.salaryOffer)}`}
              </p>
              <div className="mt-2 flex flex-wrap gap-1.5">
                <BadgeStatus status={lamaran.status} />
                <BadgeMatch persen={persenMatch} />
                {rawanGhosting(lamaran) && <BadgeGhosting hari={selisihHari(lamaran.lastUpdatedAt)} />}
              </div>
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            {bisaDisimulasi && (
              <Tombol varian="kedua" ukuran="kecil" onClick={onSimulasi}>
                Simulasi +15 Hari
              </Tombol>
            )}
            <Tombol varian="bahaya" ukuran="kecil" onClick={onHapus}>
              Hapus
            </Tombol>
            <Tombol varian="gelap" ukuran="kecil" onClick={onTutup}>
              Tutup ✕
            </Tombol>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-5">
          {/* ===== Kolom kiri: tahap seleksi + pindah status + checklist ===== */}
          <div className="space-y-5 p-4 lg:col-span-3 lg:border-r-2 lg:border-hitam">
            <section>
              <h3 className={KELAS_JUDUL_PANEL}>Tahap Seleksi</h3>
              <ol className="mb-3 grid grid-cols-5 gap-1">
                {TAHAP_SELEKSI.map((tahap, index) => (
                  <li
                    key={tahap}
                    className={
                      index <= indexTahap
                        ? "border-t-4 border-oranye pt-1 text-xs font-semibold"
                        : "border-t-4 border-garis pt-1 text-xs text-redup"
                    }
                  >
                    {index + 1}. {LABEL_STATUS[tahap]}
                  </li>
                ))}
              </ol>
              {indexTahap === -1 && (
                <p className="mb-3 text-xs text-redup">
                  Lamaran ini berstatus {LABEL_STATUS[lamaran.status]}, di luar jalur utama.
                </p>
              )}
              <PindahStatus lamaran={lamaran} onPindah={onPindahStatus} />
            </section>

            <ChecklistPersiapan
              checklist={lamaran.checklist}
              onTambah={onTambahChecklist}
              onCentang={onCentangChecklist}
              onHapus={onHapusChecklist}
            />
          </div>

          {/* ===== Kolom kanan: latihan interview + riwayat aktivitas ===== */}
          <div className="space-y-5 p-4 lg:col-span-2">
            <LatihanInterview />
            <RiwayatAktivitas logs={lamaran.activityLogs} onTambahCatatan={onTambahCatatan} />
          </div>
        </div>
      </section>
    </div>
  );
}
