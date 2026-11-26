import type { Application } from "../types/lamaran";
import { formatRupiah, formatTanggalJam, inisial } from "../utils/format";
import { rawanGhosting, selisihHari } from "../utils/jadwal";
import { BadgeMatch } from "./BadgeMatch";
import { BadgeGhosting, BadgeStatus } from "./BadgeStatus";
import { Tombol } from "./Tombol";

interface KartuLamaranProps {
  lamaran: Application;
  persenMatch: number;
  onSimulasi: () => void;
  onDetail: () => void;
  onHapus: () => void;
}

// Satu kartu lamaran di War Room
export function KartuLamaran({ lamaran, persenMatch, onSimulasi, onDetail, onHapus }: KartuLamaranProps) {
  // Progress checklist, misal 3/4 (derived dari array checklist)
  const jumlahSelesai = lamaran.checklist.filter((item) => item.done).length;
  const jumlahItem = lamaran.checklist.length;
  const persenChecklist = jumlahItem === 0 ? 0 : Math.round((jumlahSelesai / jumlahItem) * 100);

  // Tombol simulasi hanya untuk status yang bisa terkena ghosting
  const bisaDisimulasi = lamaran.status === "APPLIED" || lamaran.status === "SCREENING";

  return (
    <article className="latar-kartu flex flex-col gap-3 border-2 border-tepi p-4">
      <div className="flex items-start gap-3">
        <span className="grid h-10 w-10 shrink-0 place-items-center bg-pekat font-mono text-sm font-semibold text-aksen">
          {inisial(lamaran.company)}
        </span>
        <div className="min-w-0 flex-1">
          <p className="leading-snug font-bold">{lamaran.role}</p>
          <p className="truncate text-sm text-redup">
            {lamaran.company} · {lamaran.workMode}
          </p>
        </div>
        <BadgeMatch persen={persenMatch} />
      </div>

      <div className="flex flex-wrap gap-1.5">
        <BadgeStatus status={lamaran.status} />
        {rawanGhosting(lamaran) && <BadgeGhosting hari={selisihHari(lamaran.lastUpdatedAt)} />}
      </div>

      <dl className="grid grid-cols-2 gap-x-3 gap-y-1 text-xs">
        <dt className="text-redup">Versi CV</dt>
        <dd className="truncate font-medium">{lamaran.cvVersion ?? "-"}</dd>
        {lamaran.interviewDateTime && (
          <>
            <dt className="text-redup">Jadwal Interview</dt>
            <dd className="font-medium">{formatTanggalJam(lamaran.interviewDateTime)}</dd>
          </>
        )}
        {lamaran.salaryOffer !== undefined && (
          <>
            <dt className="text-redup">Offer / bulan</dt>
            <dd className="font-mono font-semibold">{formatRupiah(lamaran.salaryOffer)}</dd>
          </>
        )}
        <dt className="text-redup">Checklist</dt>
        <dd className="font-medium">
          {jumlahSelesai}/{jumlahItem} selesai
        </dd>
      </dl>

      {/* Lebar bar memakai style karena nilainya dinamis (bukan kelas Tailwind) */}
      <div className="h-2 border border-tepi bg-permukaan">
        <div className="h-full bg-sorot" style={{ width: `${persenChecklist}%` }} />
      </div>

      <div className="mt-auto flex flex-wrap gap-2 border-t-2 border-garis pt-3">
        <Tombol ukuran="kecil" onClick={onDetail}>
          Detail
        </Tombol>
        {bisaDisimulasi && (
          <Tombol varian="kedua" ukuran="kecil" onClick={onSimulasi} title="Mundurkan lastUpdatedAt 15 hari">
            Simulasi +15 Hari
          </Tombol>
        )}
        <Tombol varian="bahaya" ukuran="kecil" onClick={onHapus} className="ml-auto">
          Hapus
        </Tombol>
      </div>
    </article>
  );
}
