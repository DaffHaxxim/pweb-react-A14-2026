import { useEffect, useState } from "react";
import { formatWaktu } from "../utils/format";
import { KELAS_JUDUL_PANEL } from "./gaya";
import { Tombol } from "./Tombol";

// Minimal 5 pertanyaan latihan interview magang IT (sesuai soal)
const DAFTAR_SOAL = [
  "Ceritakan tentang diri kamu dan kenapa tertarik magang di perusahaan ini.",
  "Jelaskan perbedaan useState dan useRef di React, beserta contoh pemakaiannya.",
  "Ceritakan satu proyek yang pernah kamu kerjakan dan peran kamu di dalamnya.",
  "Apa yang kamu lakukan saat menemukan bug yang belum pernah kamu temui sebelumnya?",
  "Bagaimana cara kamu bekerja sama dalam tim ketika ada perbedaan pendapat?",
  "Apa yang ingin kamu pelajari selama magang di sini?",
];

const DURASI_DETIK = 120; // 02:00 per soal

// Fitur 5: Interview Prep Timer
export function LatihanInterview() {
  const [nomorSoal, setNomorSoal] = useState(0);
  const [sisaDetik, setSisaDetik] = useState(DURASI_DETIK);
  const [berjalan, setBerjalan] = useState(false);

  // Derived state: waktu habis jika sisa detik sudah 0
  const waktuHabis = sisaDetik === 0;

  useEffect(() => {
    // Timer hanya berjalan saat tombol Start ditekan dan waktu belum habis
    if (!berjalan || waktuHabis) return;

    const idInterval = setInterval(() => {
      // Pakai bentuk fungsi (detik) => ... agar selalu mengurangi nilai terbaru
      setSisaDetik((detik) => detik - 1);
    }, 1000);

    // Cleanup WAJIB: hentikan interval saat Pause, saat waktu habis,
    // dan saat panel ditutup (unmount). Tanpa ini, interval lama tetap jalan
    // dan detik akan berkurang 2x lebih cepat saat panel dibuka lagi.
    return () => clearInterval(idInterval);
  }, [berjalan, waktuHabis]);

  const reset = () => {
    setBerjalan(false);
    setSisaDetik(DURASI_DETIK);
  };

  const soalBerikutnya = () => {
    // Kembali ke soal pertama setelah soal terakhir
    setNomorSoal((nomor) => (nomor + 1) % DAFTAR_SOAL.length);
    reset();
  };

  return (
    <section className="border-2 border-hitam bg-kuning-muda p-4">
      <div className="flex items-center justify-between">
        <h3 className={KELAS_JUDUL_PANEL}>Latihan Interview</h3>
        <span className="mb-3 font-mono text-xs font-semibold">
          Soal {nomorSoal + 1} / {DAFTAR_SOAL.length}
        </span>
      </div>

      <p className="min-h-12 text-sm leading-relaxed">"{DAFTAR_SOAL[nomorSoal]}"</p>

      <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
        <p
          className={
            waktuHabis
              ? "font-mono text-4xl font-semibold text-bahaya"
              : "font-mono text-4xl font-semibold text-hitam"
          }
          aria-live="polite"
        >
          {formatWaktu(sisaDetik)}
        </p>
        <div className="flex flex-wrap gap-2">
          <Tombol ukuran="kecil" varian="gelap" disabled={waktuHabis} onClick={() => setBerjalan(!berjalan)}>
            {berjalan ? "Pause" : "Start"}
          </Tombol>
          <Tombol ukuran="kecil" varian="kedua" onClick={reset}>
            Reset
          </Tombol>
          <Tombol ukuran="kecil" varian="kedua" onClick={soalBerikutnya}>
            Soal Berikutnya
          </Tombol>
        </div>
      </div>
      {waktuHabis && <p className="mt-2 text-xs font-semibold text-bahaya">Waktu habis! Reset atau lanjut ke soal berikutnya.</p>}
    </section>
  );
}
