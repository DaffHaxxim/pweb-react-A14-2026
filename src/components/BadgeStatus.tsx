import type { ApplicationStatus } from "../types/lamaran";
import { LABEL_STATUS } from "../utils/statusLamaran";

// Warna badge untuk setiap status (kelas ditulis utuh agar terbaca Tailwind)
const GAYA_STATUS: Record<ApplicationStatus, string> = {
  WISHLIST: "border-garis bg-permukaan text-redup",
  APPLIED: "border-emas bg-kuning-muda text-cokelat-tua",
  SCREENING: "border-oranye bg-oranye-muda text-oranye-tua",
  INTERVIEW: "border-hitam bg-kuning text-hitam",
  OFFER: "border-berhasil bg-berhasil-muda text-berhasil",
  REJECTED: "border-bahaya bg-bahaya-muda text-bahaya",
  GHOSTED: "border-cokelat bg-cokelat text-latar",
};

export function BadgeStatus({ status }: { status: ApplicationStatus }) {
  return (
    <span className={`inline-block border-2 px-2 py-0.5 text-xs font-bold uppercase tracking-wide ${GAYA_STATUS[status]}`}>
      {LABEL_STATUS[status]}
    </span>
  );
}
