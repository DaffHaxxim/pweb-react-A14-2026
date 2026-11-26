import type { ApplicationStatus } from "../types/lamaran";
import { LABEL_STATUS } from "../utils/statusLamaran";

// Warna badge untuk setiap status (kelas ditulis utuh agar terbaca Tailwind)
const GAYA_STATUS: Record<ApplicationStatus, string> = {
  WISHLIST: "border-garis bg-permukaan text-redup",
  APPLIED: "border-aksen-tua bg-aksen-muda text-teks-aksen",
  SCREENING: "border-sorot bg-sorot-muda text-teks-sorot",
  INTERVIEW: "border-tepi bg-aksen text-di-aksen",
  OFFER: "border-berhasil bg-berhasil-muda text-berhasil",
  REJECTED: "border-bahaya bg-bahaya-muda text-bahaya",
  GHOSTED: "border-sekunder bg-sekunder text-latar",
};

export function BadgeStatus({ status }: { status: ApplicationStatus }) {
  return (
    <span className={`inline-block border-2 px-2 py-0.5 text-xs font-bold uppercase tracking-wide ${GAYA_STATUS[status]}`}>
      {LABEL_STATUS[status]}
    </span>
  );
}

// Badge peringatan untuk lamaran yang Rawan Ghosting (> 14 hari tanpa kabar)
export function BadgeGhosting({ hari }: { hari: number }) {
  return (
    <span className="inline-block border-2 border-sorot bg-sorot px-2 py-0.5 text-xs font-bold tracking-wide text-latar uppercase">
      Rawan Ghosting · {hari} hari
    </span>
  );
}
