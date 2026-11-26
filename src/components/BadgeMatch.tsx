import { tingkatMatch } from "../utils/skillMatch";

// Warna sesuai soal: hijau >= 70%, kuning 40-69%, merah < 40%
const GAYA_TINGKAT = {
  tinggi: "border-berhasil bg-berhasil-muda text-berhasil",
  sedang: "border-peringatan bg-peringatan-muda text-teks-peringatan",
  rendah: "border-bahaya bg-bahaya-muda text-bahaya",
};

export function BadgeMatch({ persen }: { persen: number }) {
  return (
    <span
      className={`inline-block shrink-0 border-2 px-2 py-0.5 font-mono text-xs font-semibold ${GAYA_TINGKAT[tingkatMatch(persen)]}`}
    >
      {persen}% Match
    </span>
  );
}
