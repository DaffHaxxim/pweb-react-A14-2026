import { useRef, useState } from "react";
import type { Application } from "../types/lamaran";
import { bacaFileCadangan, unduhJson } from "../utils/cadangan";
import type { DataCadangan } from "../utils/cadangan";
import { Tombol } from "./Tombol";

interface CadanganDataProps {
  applications: Application[];
  kaptenSkills: string[];
  onImpor: (data: DataCadangan) => void;
}

// Bonus: Export / Import backup JSON
export function CadanganData({ applications, kaptenSkills, onImpor }: CadanganDataProps) {
  const [pesan, setPesan] = useState("");
  // useRef ke <input type="file"> yang disembunyikan, supaya bisa dibuka lewat tombol biasa
  const refFile = useRef<HTMLInputElement>(null);

  const ekspor = () => {
    const tanggal = new Date().toISOString().slice(0, 10);
    unduhJson(`aku-mw-magang-${tanggal}.json`, {
      aplikasi: "aku-mw-magang",
      dieksporPada: new Date().toISOString(),
      kaptenSkills,
      applications,
    });
    setPesan(`${applications.length} lamaran diekspor.`);
  };

  const handlePilihFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    // Kosongkan pilihan agar file yang sama bisa dipilih lagi nanti
    e.target.value = "";
    if (!file) return;

    try {
      const data = await bacaFileCadangan(file);
      const setuju = window.confirm(
        `Ganti seluruh data sekarang dengan ${data.applications.length} lamaran dari file "${file.name}"?`,
      );
      if (!setuju) return;
      onImpor(data);
      setPesan(`${data.applications.length} lamaran berhasil diimpor.`);
    } catch (err) {
      setPesan(err instanceof Error ? err.message : "Gagal membaca file.");
    }
  };

  return (
    <div className="flex flex-wrap items-center gap-2">
      <Tombol varian="kedua" ukuran="kecil" onClick={ekspor} disabled={applications.length === 0}>
        Ekspor JSON
      </Tombol>
      <Tombol varian="kedua" ukuran="kecil" onClick={() => refFile.current?.click()}>
        Impor JSON
      </Tombol>
      <input
        ref={refFile}
        type="file"
        accept="application/json,.json"
        onChange={handlePilihFile}
        className="hidden"
        aria-label="Pilih file cadangan JSON"
      />
      {pesan && <span className="text-xs text-redup">{pesan}</span>}
    </div>
  );
}
