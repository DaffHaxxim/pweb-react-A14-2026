import type { JobListing } from "../types/lowongan";
import { inisial } from "../utils/format";
import type { HasilSkillMatch } from "../utils/skillMatch";
import { BadgeMatch } from "./BadgeMatch";
import { Tombol } from "./Tombol";

interface KartuLowonganProps {
  job: JobListing;
  match: HasilSkillMatch;
  sudahAda: boolean; // true jika company + role sudah ada di daftar lamaran
  onSimpan: () => void;
}

// Satu kartu lowongan di halaman Eksplorasi
export function KartuLowongan({ job, match, sudahAda, onSimpan }: KartuLowonganProps) {
  // Urutkan tag: yang cocok dulu, lalu yang missing; ambil maksimal 10
  const tagTampil = [...match.cocok, ...match.kurang].slice(0, 10);
  const sisaTag = job.tags.length - tagTampil.length;

  return (
    <article className="flex flex-col gap-3 border-2 border-hitam bg-latar p-4">
      <div className="flex items-start justify-between gap-3">
        <div className="flex min-w-0 items-center gap-3">
          <span className="grid h-10 w-10 shrink-0 place-items-center bg-hitam font-mono text-sm font-semibold text-kuning">
            {inisial(job.company_name)}
          </span>
          <div className="min-w-0">
            <p className="truncate font-semibold">{job.company_name}</p>
            <p className="truncate text-xs text-redup">{job.candidate_required_location}</p>
          </div>
        </div>
        <BadgeMatch persen={match.persen} />
      </div>

      <div>
        <h3 className="text-base leading-snug font-bold">{job.title}</h3>
        <p className="mt-0.5 text-xs tracking-wide text-redup uppercase">{job.category}</p>
      </div>

      {/* Skill cocok (kotak kuning) ditaruh di depan, skill missing (garis putus merah) di belakang.
          Lowongan Remotive bisa punya 20+ tag, jadi hanya 10 tag pertama yang ditampilkan. */}
      <ul className="flex flex-wrap gap-1.5">
        {tagTampil.map((tag) => (
          <li
            key={tag}
            className={
              match.cocok.includes(tag)
                ? "border border-hitam bg-kuning-muda px-1.5 py-0.5 text-xs font-medium"
                : "border border-dashed border-bahaya px-1.5 py-0.5 text-xs font-medium text-bahaya"
            }
          >
            {tag}
          </li>
        ))}
        {sisaTag > 0 && <li className="px-1.5 py-0.5 text-xs text-redup">+{sisaTag} lainnya</li>}
      </ul>

      <p className="text-xs">
        <span className="font-semibold text-berhasil">{match.cocok.length} skill cocok</span>
        {match.kurang.length > 0 && (
          <span className="text-bahaya">
            {" "}
            · Missing: {match.kurang.slice(0, 5).join(", ")}
            {match.kurang.length > 5 && ` +${match.kurang.length - 5} lainnya`}
          </span>
        )}
      </p>

      <div className="mt-auto flex flex-wrap items-center justify-between gap-2 border-t-2 border-garis pt-3">
        <span className="font-mono text-sm font-semibold">{job.salary || "Gaji tidak dicantumkan"}</span>
        <div className="flex items-center gap-2">
          {/* Tautan balik ke Remotive (diminta oleh ketentuan API Remotive) */}
          {job.url && (
            <a
              href={job.url}
              target="_blank"
              rel="noreferrer"
              className="text-xs font-semibold text-cokelat underline hover:text-oranye"
            >
              Lihat di Remotive
            </a>
          )}
          <Tombol ukuran="kecil" varian={sudahAda ? "kedua" : "utama"} disabled={sudahAda} onClick={onSimpan}>
            {sudahAda ? "Sudah Dilamar" : "Simpan ke Wishlist"}
          </Tombol>
        </div>
      </div>
    </article>
  );
}
