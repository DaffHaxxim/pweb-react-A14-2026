import { Link, NavLink, Outlet } from "react-router";
import { BannerBentrok } from "../components/BannerBentrok";
import { PilihTema } from "../components/PilihTema";
import { RingkasanStatistik } from "../components/RingkasanStatistik";
import { ToastUndo } from "../components/ToastUndo";
import type { Application } from "../types/lamaran";
import type { NamaTema } from "../types/tema";

interface TataLetakProps {
  applications: Application[];
  lamaranTerhapus: Application | null;
  onBatalkanHapus: () => void;
  tema: NamaTema;
  onGantiTema: (tema: NamaTema) => void;
}

// Kelas NavLink: React Router memberi { isActive } untuk menandai halaman yang sedang dibuka
function kelasNavigasi({ isActive }: { isActive: boolean }) {
  return isActive
    ? "border-2 border-tepi bg-aksen px-3 py-1.5 text-sm font-semibold text-di-aksen"
    : "border-2 border-transparent px-3 py-1.5 text-sm font-medium text-redup hover:border-garis hover:text-teks";
}

// Kerangka halaman: header + navigasi, lalu isi halaman aktif lewat <Outlet />
export function TataLetak({ applications, lamaranTerhapus, onBatalkanHapus, tema, onGantiTema }: TataLetakProps) {
  // Angka di menu dihitung langsung dari data (derived state)
  const jumlahOffer = applications.filter((lamaran) => lamaran.status === "OFFER").length;

  return (
    <div className="flex min-h-screen flex-col">
      <header className="border-b-2 border-tepi bg-latar">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3 px-4 py-3">
          <Link to="/" className="flex items-center gap-2">
            <span className="grid h-9 w-9 place-items-center border-2 border-tepi bg-aksen font-mono text-sm font-bold text-di-aksen">
              AM
            </span>
            <span className="text-lg font-bold tracking-tight">Aku Mw Magang</span>
          </Link>

          <nav className="flex flex-wrap gap-1">
            {/* "end" agar menu ini hanya aktif tepat di "/" */}
            <NavLink to="/" end className={kelasNavigasi}>
              Eksplorasi Lowongan
            </NavLink>
            {/* "end" agar menu ini tidak ikut aktif di "/lamaran/baru" */}
            <NavLink to="/lamaran" end className={kelasNavigasi}>
              Pipeline Lamaran ({applications.length})
            </NavLink>
            <NavLink to="/offer" className={kelasNavigasi}>
              Bandingkan Offer ({jumlahOffer})
            </NavLink>
          </nav>

          <div className="flex items-center gap-2">
            <PilihTema tema={tema} onGanti={onGantiTema} />
            <Link
              to="/lamaran/baru"
              className="border-2 border-tepi bg-pekat px-4 py-2 text-sm font-semibold text-di-pekat hover:bg-pekat/85"
            >
              + Catat Lamaran
            </Link>
          </div>
        </div>
      </header>

      <main className="mx-auto w-full max-w-7xl flex-1 space-y-5 px-4 py-5">
        {/* Banner bentrok dihitung dari seluruh data, jadi tampil di semua halaman */}
        <BannerBentrok applications={applications} />
        <RingkasanStatistik applications={applications} />
        <Outlet />
      </main>

      {/* Toast ada di tata letak agar tetap tampil walau pengguna pindah halaman */}
      <ToastUndo lamaran={lamaranTerhapus} onBatalkan={onBatalkanHapus} />

      <footer className="border-t-2 border-tepi bg-permukaan">
        <p className="mx-auto max-w-7xl px-4 py-3 text-xs text-redup">
          Data lowongan live bersumber dari{" "}
          <a href="https://remotive.com" target="_blank" rel="noreferrer" className="font-semibold underline">
            Remotive
          </a>
          . Data lamaran tersimpan di localStorage browser ini.
        </p>
      </footer>
    </div>
  );
}
