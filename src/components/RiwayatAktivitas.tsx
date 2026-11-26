import { useState } from "react";
import type { ActivityLog } from "../types/lamaran";
import { formatTanggalJam } from "../utils/format";
import { KELAS_INPUT, KELAS_JUDUL_PANEL } from "./gaya";
import { Tombol } from "./Tombol";

interface RiwayatAktivitasProps {
  logs: ActivityLog[];
  onTambahCatatan: (teks: string) => void;
}

// Fitur 4: riwayat aktivitas (otomatis + catatan manual Kapten).
// Log baru selalu ditaruh di depan array, jadi urutan tampil sudah dari yang terbaru.
export function RiwayatAktivitas({ logs, onTambahCatatan }: RiwayatAktivitasProps) {
  const [teks, setTeks] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (teks.trim() === "") return;
    onTambahCatatan(teks.trim());
    setTeks("");
  };

  return (
    <section>
      <h3 className={KELAS_JUDUL_PANEL}>Riwayat Aktivitas</h3>

      <form onSubmit={handleSubmit} className="mb-3 flex gap-2">
        <input
          value={teks}
          onChange={(e) => setTeks(e.target.value)}
          placeholder="Tulis catatan manual..."
          aria-label="Catatan manual"
          className={KELAS_INPUT}
        />
        <Tombol type="submit" varian="gelap" ukuran="kecil">
          Catat
        </Tombol>
      </form>

      <ol className="max-h-64 space-y-2 overflow-y-auto border-l-2 border-tepi pl-3">
        {logs.map((log) => (
          <li key={log.id} className="text-sm">
            <p className="font-mono text-xs text-redup">{formatTanggalJam(log.timestamp)}</p>
            <p>{log.message}</p>
          </li>
        ))}
      </ol>
    </section>
  );
}
