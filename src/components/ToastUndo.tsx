import type { Application } from "../types/lamaran";

interface ToastUndoProps {
  lamaran: Application | null; // lamaran yang baru dihapus (null = toast tidak tampil)
  onBatalkan: () => void;
}

// Fitur 6: toast "Undo" yang muncul selama 5 detik setelah lamaran dihapus.
// Lama tampilnya diatur oleh timer di App (setTimeout yang ID-nya disimpan di useRef).
export function ToastUndo({ lamaran, onBatalkan }: ToastUndoProps) {
  if (lamaran === null) return null;

  return (
    <div
      role="status"
      className="fixed right-4 bottom-4 left-4 z-50 flex animate-muncul flex-wrap items-center justify-between gap-3 border-2 border-hitam bg-hitam px-4 py-3 text-sm text-latar shadow-tegas sm:left-auto sm:max-w-md"
    >
      <span>
        Lamaran <span className="font-semibold text-kuning">{lamaran.company}</span> dihapus.
      </span>
      <button
        type="button"
        onClick={onBatalkan}
        className="border-2 border-kuning px-3 py-1 text-xs font-bold text-kuning uppercase hover:bg-kuning hover:text-hitam"
      >
        Undo (5 detik)
      </button>
    </div>
  );
}
