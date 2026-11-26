import { useState } from "react";
import { Link } from "react-router";
import { KELAS_INPUT, KELAS_PANEL } from "../components/gaya";
import type { Application } from "../types/lamaran";
import { formatRupiah } from "../utils/format";
import type { SkorOffer } from "../utils/offer";
import { hitungSkorOffer, SKOR_MODE_KERJA } from "../utils/offer";
import { hitungSkillMatch } from "../utils/skillMatch";

interface HalamanOfferProps {
  applications: Application[];
  kaptenSkills: string[];
}

// Fitur 7: Offer Comparator
export function HalamanOffer({ applications, kaptenSkills }: HalamanOfferProps) {
  // Hook harus dipanggil sebelum return apa pun, jadi useState ditaruh paling atas
  const [idA, setIdA] = useState("");
  const [idB, setIdB] = useState("");

  const daftarOffer = applications.filter((lamaran) => lamaran.status === "OFFER");

  // Pesan kosong yang jelas jika offer belum cukup
  if (daftarOffer.length < 2) {
    return (
      <section className="space-y-4">
        <h1 className="text-2xl font-bold">Bandingkan Offer Magang</h1>
        <div className={`${KELAS_PANEL} text-sm`}>
          <p className="font-semibold">Belum bisa membandingkan offer.</p>
          <p className="mt-1 text-redup">
            Butuh minimal 2 lamaran berstatus OFFER. Saat ini ada {daftarOffer.length}. Pindahkan lamaran ke
            status OFFER lewat detail lamaran di War Room.
          </p>
          <Link
            to="/lamaran"
            className="mt-3 inline-block border-2 border-hitam bg-kuning px-3 py-1 text-xs font-semibold shadow-tegas-kecil hover:bg-emas"
          >
            Buka War Room
          </Link>
        </div>
      </section>
    );
  }

  // Pilihan bawaan: offer pertama dan kedua. Jika ID pilihan sudah tidak ada (misal dihapus), kembali ke bawaan.
  const offerA = daftarOffer.find((offer) => offer.id === idA) ?? daftarOffer[0];
  const pilihanB = daftarOffer.filter((offer) => offer.id !== offerA.id); // B tidak boleh sama dengan A
  const offerB = pilihanB.find((offer) => offer.id === idB) ?? pilihanB[0];

  // Normalisasi gaji memakai gaji tertinggi di antara dua offer yang dibandingkan
  const gajiTertinggi = Math.max(offerA.salaryOffer ?? 0, offerB.salaryOffer ?? 0);
  const skorA = hitungSkorOffer(offerA, gajiTertinggi, kaptenSkills);
  const skorB = hitungSkorOffer(offerB, gajiTertinggi, kaptenSkills);

  // Bandingkan total yang sudah dibulatkan 1 desimal (sama seperti yang ditampilkan)
  const totalA = Number(skorA.total.toFixed(1));
  const totalB = Number(skorB.total.toFixed(1));

  return (
    <section className="space-y-4">
      <div>
        <h1 className="text-2xl font-bold">Bandingkan Offer Magang</h1>
        <p className="text-sm text-redup">Bobot: Uang Saku 50% · Mode Kerja 25% · Kecocokan Skill 25%</p>
      </div>

      {/* Pilih dua offer yang ingin dibandingkan */}
      <div className="flex flex-col gap-2 border-2 border-hitam bg-permukaan p-3 md:flex-row md:items-center">
        <div className="flex-1">
          <select
            value={offerA.id}
            onChange={(e) => setIdA(e.target.value)}
            aria-label="Pilih Offer A"
            className={KELAS_INPUT}
          >
            {daftarOffer.map((offer) => (
              <option key={offer.id} value={offer.id}>
                Offer A: {offer.company} - {offer.role}
              </option>
            ))}
          </select>
        </div>
        <span className="text-center font-mono text-sm font-semibold">vs</span>
        <div className="flex-1">
          <select
            value={offerB.id}
            onChange={(e) => setIdB(e.target.value)}
            aria-label="Pilih Offer B"
            className={KELAS_INPUT}
          >
            {pilihanB.map((offer) => (
              <option key={offer.id} value={offer.id}>
                Offer B: {offer.company} - {offer.role}
              </option>
            ))}
          </select>
        </div>
      </div>

      {totalA === totalB && (
        <p className="border-2 border-emas bg-kuning-muda p-2 text-sm">Skor kedua offer sama. Pilih berdasarkan pertimbangan lain.</p>
      )}

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <KartuSkorOffer offer={offerA} skor={skorA} kaptenSkills={kaptenSkills} terbaik={totalA > totalB} />
        <KartuSkorOffer offer={offerB} skor={skorB} kaptenSkills={kaptenSkills} terbaik={totalB > totalA} />
      </div>
    </section>
  );
}

interface KartuSkorOfferProps {
  offer: Application;
  skor: SkorOffer;
  kaptenSkills: string[];
  terbaik: boolean;
}

// Satu kolom perbandingan offer
function KartuSkorOffer({ offer, skor, kaptenSkills, terbaik }: KartuSkorOfferProps) {
  const match = hitungSkillMatch(kaptenSkills, offer.requiredSkills);

  const baris = [
    {
      label: "Uang Saku / Bulan",
      nilai: formatRupiah(offer.salaryOffer ?? 0),
      poin: skor.poinGaji,
      bobot: 50,
    },
    {
      label: "Mode Kerja",
      nilai: `${offer.workMode} (${SKOR_MODE_KERJA[offer.workMode]})`,
      poin: skor.poinMode,
      bobot: 25,
    },
    {
      label: "Kecocokan Skill",
      nilai: `${skor.persenSkill}% (${match.cocok.length} dari ${offer.requiredSkills.length} skill)`,
      poin: skor.poinSkill,
      bobot: 25,
    },
  ];

  return (
    <article
      className={
        terbaik
          ? "border-4 border-oranye bg-latar p-4 shadow-tegas"
          : "border-2 border-hitam bg-latar p-4 shadow-tegas"
      }
    >
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div>
          <h2 className="text-lg font-bold">{offer.company}</h2>
          <p className="text-sm text-redup">{offer.role}</p>
        </div>
        {terbaik && (
          <span className="border-2 border-hitam bg-kuning px-2 py-0.5 text-xs font-bold uppercase">
            ★ Rekomendasi Terbaik
          </span>
        )}
      </div>

      <dl className="mt-4 divide-y-2 divide-garis border-y-2 border-garis">
        {baris.map((item) => (
          <div key={item.label} className="grid grid-cols-3 gap-2 py-2 text-sm">
            <dt className="text-redup">{item.label}</dt>
            <dd className="font-medium">{item.nilai}</dd>
            <dd className="text-right font-mono">
              {item.poin.toFixed(1)} / {item.bobot}
            </dd>
          </div>
        ))}
      </dl>

      <div
        className={
          terbaik
            ? "mt-4 flex items-center justify-between border-2 border-hitam bg-kuning p-3"
            : "mt-4 flex items-center justify-between border-2 border-hitam bg-permukaan p-3"
        }
      >
        <span className="text-xs font-bold tracking-widest uppercase">Total Skor Berbobot</span>
        <span className="font-mono text-3xl font-semibold">{skor.total.toFixed(1)}</span>
      </div>
    </article>
  );
}
