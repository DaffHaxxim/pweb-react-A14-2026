import { useState } from "react";
import type { ChecklistItem } from "../types/lamaran";
import { KELAS_INPUT, KELAS_JUDUL_PANEL } from "./gaya";
import { Tombol } from "./Tombol";

interface ChecklistPersiapanProps {
  checklist: ChecklistItem[];
  onTambah: (teks: string) => void;
  onCentang: (idItem: string) => void;
  onHapus: (idItem: string) => void;
}

// Fitur 4: checklist persiapan di dalam satu lamaran (nested array)
export function ChecklistPersiapan({ checklist, onTambah, onCentang, onHapus }: ChecklistPersiapanProps) {
  const [teks, setTeks] = useState("");

  // Progress X/Y dihitung langsung dari array (derived state)
  const jumlahSelesai = checklist.filter((item) => item.done).length;
  const persen = checklist.length === 0 ? 0 : Math.round((jumlahSelesai / checklist.length) * 100);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (teks.trim() === "") return;
    onTambah(teks.trim());
    setTeks("");
  };

  return (
    <section>
      <div className="flex items-center justify-between">
        <h3 className={KELAS_JUDUL_PANEL}>Daftar Persiapan</h3>
        <span className="mb-3 font-mono text-xs font-semibold">
          {jumlahSelesai}/{checklist.length} selesai
        </span>
      </div>

      {/* Lebar bar memakai style karena nilainya dinamis */}
      <div className="mb-3 h-2.5 border border-hitam bg-permukaan">
        <div className="h-full bg-oranye transition-all" style={{ width: `${persen}%` }} />
      </div>

      {checklist.length === 0 ? (
        <p className="mb-3 text-sm text-redup">Belum ada item persiapan.</p>
      ) : (
        <ul className="mb-3 space-y-1.5">
          {checklist.map((item) => (
            <li key={item.id} className="flex items-center gap-2 border-2 border-garis px-2 py-1.5">
              <input
                type="checkbox"
                checked={item.done}
                onChange={() => onCentang(item.id)}
                aria-label={`Tandai selesai: ${item.text}`}
                className="h-4 w-4 accent-oranye"
              />
              <span className={item.done ? "flex-1 text-sm text-redup line-through" : "flex-1 text-sm"}>
                {item.text}
              </span>
              <button
                type="button"
                onClick={() => onHapus(item.id)}
                aria-label={`Hapus item ${item.text}`}
                className="px-1.5 text-redup hover:bg-bahaya hover:text-latar"
              >
                ×
              </button>
            </li>
          ))}
        </ul>
      )}

      <form onSubmit={handleSubmit} className="flex gap-2">
        <input
          value={teks}
          onChange={(e) => setTeks(e.target.value)}
          placeholder="Tambah item persiapan..."
          aria-label="Item persiapan baru"
          className={KELAS_INPUT}
        />
        <Tombol type="submit" varian="gelap" ukuran="kecil">
          Tambah
        </Tombol>
      </form>
    </section>
  );
}
