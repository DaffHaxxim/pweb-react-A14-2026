import type { Application } from "../types/lamaran";
import { rawanGhosting } from "../utils/jadwal";

// Fitur 7: 5 kartu statistik.
// Semua angka dihitung langsung dari "applications" setiap render (derived state),
// tidak disimpan di useState terpisah, sehingga selalu sinkron dengan data.
export function RingkasanStatistik({ applications }: { applications: Application[] }) {
  const total = applications.length;
  const jumlahWishlist = applications.filter((lamaran) => lamaran.status === "WISHLIST").length;

  // Lamaran yang sudah benar-benar dikirim (selain WISHLIST)
  const terkirim = applications.filter((lamaran) => lamaran.status !== "WISHLIST");

  // Response: perusahaan sudah memberi kabar (lolos screening, interview, offer, atau menolak)
  const dapatRespons = terkirim.filter(
    (lamaran) =>
      lamaran.status === "SCREENING" ||
      lamaran.status === "INTERVIEW" ||
      lamaran.status === "OFFER" ||
      lamaran.status === "REJECTED",
  ).length;

  // Pernah interview: punya jadwal interview (field ini terisi saat masuk status INTERVIEW)
  const pernahInterview = terkirim.filter((lamaran) => lamaran.interviewDateTime).length;

  const responseRate = terkirim.length === 0 ? 0 : Math.round((dapatRespons / terkirim.length) * 100);
  const interviewRate = terkirim.length === 0 ? 0 : Math.round((pernahInterview / terkirim.length) * 100);
  const jumlahGhosting = applications.filter((lamaran) => rawanGhosting(lamaran)).length;
  const jumlahOffer = applications.filter((lamaran) => lamaran.status === "OFFER").length;

  const daftarKartu = [
    { judul: "Total Lamaran", nilai: String(total), keterangan: `${jumlahWishlist} di tahap wishlist`, warna: "text-teks" },
    {
      judul: "Response Rate",
      nilai: `${responseRate}%`,
      keterangan: `${dapatRespons} dari ${terkirim.length} terkirim`,
      warna: "text-sekunder",
    },
    {
      judul: "Interview Rate",
      nilai: `${interviewRate}%`,
      keterangan: `${pernahInterview} pernah interview`,
      warna: "text-sekunder",
    },
    {
      judul: "Rawan Ghosting",
      nilai: String(jumlahGhosting),
      keterangan: "> 14 hari tanpa kabar",
      warna: jumlahGhosting > 0 ? "text-sorot" : "text-teks",
    },
    {
      judul: "Total Offer",
      nilai: String(jumlahOffer),
      keterangan: jumlahOffer >= 2 ? "Siap dibandingkan" : "Butuh 2 untuk dibandingkan",
      warna: jumlahOffer > 0 ? "text-berhasil" : "text-teks",
    },
  ];

  return (
    <section aria-label="Statistik lamaran" className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-5">
      {daftarKartu.map((kartu) => (
        <div key={kartu.judul} className="border-2 border-tepi bg-latar p-3">
          <p className="text-xs font-bold tracking-widest text-redup uppercase">{kartu.judul}</p>
          <p className={`mt-1 font-mono text-3xl font-semibold ${kartu.warna}`}>{kartu.nilai}</p>
          <p className="text-xs text-redup">{kartu.keterangan}</p>
        </div>
      ))}
    </section>
  );
}
