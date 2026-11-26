import { Link, NavLink, Outlet } from "react-router";
import { BannerBentrok } from "../components/BannerBentrok";
import type { Application } from "../types/lamaran";

interface TataLetakProps {
  applications: Application[];
}

// Kelas NavLink: React Router memberi { isActive } untuk menandai halaman yang sedang dibuka
function kelasNavigasi({ isActive }: { isActive: boolean }) {
  return isActive
    ? "border-2 border-hitam bg-kuning px-3 py-1.5 text-sm font-semibold text-hitam"
    : "border-2 border-transparent px-3 py-1.5 text-sm font-medium text-redup hover:border-garis hover:text-teks";
}

// Kerangka halaman: header + navigasi, lalu isi halaman aktif lewat <Outlet />
export function TataLetak({ applications }: TataLetakProps) {
  // Angka di menu dihitung langsung dari data (derived state)
  const jumlahOffer = applications.filter((lamaran) => lamaran.status === "OFFER").length;

  return (
    <div className="flex min-h-screen flex-col">
      <header className="border-b-2 border-hitam bg-latar">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3 px-4 py-3">
          <Link to="/" className="flex items-center gap-2">
            <span className="grid h-9 w-9 place-items-center border-2 border-hitam bg-kuning font-mono text-sm font-bold">
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

          <Link
            to="/lamaran/baru"
            className="border-2 border-hitam bg-hitam px-4 py-2 text-sm font-semibold text-latar shadow-tegas-kecil hover:bg-cokelat-tua"
          >
            + Catat Lamaran
          </Link>
        </div>
      </header>

      <main className="mx-auto w-full max-w-7xl flex-1 space-y-5 px-4 py-5">
        {/* Banner bentrok dihitung dari seluruh data, jadi tampil di semua halaman */}
        <BannerBentrok applications={applications} />
        <Outlet />
      </main>

      <footer className="border-t-2 border-hitam bg-permukaan">
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
