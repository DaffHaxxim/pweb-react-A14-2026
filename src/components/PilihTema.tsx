import type { NamaTema } from "../types/tema";

interface PilihTemaProps {
  tema: NamaTema;
  onGanti: (tema: NamaTema) => void;
}

// Daftar tema yang bisa dipilih. "nilai" dipakai di kode dan CSS, "label" ditampilkan ke pengguna.
const DAFTAR_TEMA: { nilai: NamaTema; label: string }[] = [
  { nilai: "emas", label: "Vibrant Yellow" },
  { nilai: "gelap", label: "Soft Night" },
  { nilai: "baja", label: "Matte Steel" },
];

// Bonus: pilihan tema warna (controlled select, nilainya disimpan di App lewat useLocalStorage)
export function PilihTema({ tema, onGanti }: PilihTemaProps) {
  return (
    <label className="flex items-center gap-2 text-xs font-semibold tracking-wide text-redup uppercase">
      Tema
      <select
        value={tema}
        onChange={(e) => onGanti(e.target.value as NamaTema)}
        aria-label="Pilih tema warna"
        className="border-2 border-tepi bg-latar px-2 py-1.5 text-sm font-medium tracking-normal text-teks normal-case focus:border-sorot focus:outline-none"
      >
        {DAFTAR_TEMA.map((item) => (
          <option key={item.nilai} value={item.nilai}>
            {item.label}
          </option>
        ))}
      </select>
    </label>
  );
}
