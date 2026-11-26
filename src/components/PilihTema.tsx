import type { NamaTema } from "../types/tema";

interface PilihTemaProps {
  tema: NamaTema;
  onGanti: (tema: NamaTema) => void;
}

// Daftar tema yang bisa dipilih (label ditampilkan ke pengguna)
const DAFTAR_TEMA: { nilai: NamaTema; label: string }[] = [
  { nilai: "emas", label: "Tema: Emas" },
  { nilai: "gelap", label: "Tema: Gelap" },
  { nilai: "baja", label: "Tema: Baja" },
];

// Bonus: pilihan tema warna (controlled select, nilainya disimpan di App lewat useLocalStorage)
export function PilihTema({ tema, onGanti }: PilihTemaProps) {
  return (
    <select
      value={tema}
      onChange={(e) => onGanti(e.target.value as NamaTema)}
      aria-label="Pilih tema warna"
      className="border-2 border-tepi bg-latar px-2 py-1.5 text-sm font-medium text-teks focus:border-sorot focus:outline-none"
    >
      {DAFTAR_TEMA.map((item) => (
        <option key={item.nilai} value={item.nilai}>
          {item.label}
        </option>
      ))}
    </select>
  );
}
