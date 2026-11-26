import type { Application } from "../types/lamaran";

// Bentuk isi file cadangan (backup) JSON
export interface DataCadangan {
  aplikasi: "aku-mw-magang";
  dieksporPada: string;
  kaptenSkills: string[];
  applications: Application[];
}

// Catatan: Blob, URL.createObjectURL, dan file.text() adalah API browser
// yang berada di luar materi Modul 5. Dipakai khusus untuk fitur bonus Export/Import.

// Unduh data sebagai file .json
export function unduhJson(namaFile: string, isi: DataCadangan): void {
  // Ubah objek menjadi teks JSON, bungkus sebagai Blob (file di memori)
  const blob = new Blob([JSON.stringify(isi, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);

  // Buat tautan sementara lalu "klik" untuk memulai unduhan
  const tautan = document.createElement("a");
  tautan.href = url;
  tautan.download = namaFile;
  tautan.click();

  // Bebaskan memori setelah unduhan dimulai
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

// Baca file .json pilihan pengguna dan pastikan bentuknya benar
export async function bacaFileCadangan(file: File): Promise<DataCadangan> {
  const teks = await file.text();

  let data: unknown;
  try {
    data = JSON.parse(teks);
  } catch {
    throw new Error("File bukan JSON yang valid.");
  }

  // Tipe unknown wajib dicek dulu sebelum dipakai (tanpa memakai any)
  if (
    typeof data !== "object" ||
    data === null ||
    !("applications" in data) ||
    !("kaptenSkills" in data) ||
    !Array.isArray(data.applications) ||
    !Array.isArray(data.kaptenSkills)
  ) {
    throw new Error("Format file cadangan tidak dikenali (butuh applications dan kaptenSkills).");
  }

  return data as DataCadangan;
}
