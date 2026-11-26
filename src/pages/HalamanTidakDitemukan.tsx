import { Link } from "react-router";

// Halaman untuk alamat yang tidak terdaftar (route "*")
export function HalamanTidakDitemukan() {
  return (
    <section className="mx-auto max-w-lg border-2 border-hitam bg-latar p-8 text-center shadow-tegas">
      <p className="font-mono text-5xl font-semibold text-oranye">404</p>
      <h1 className="mt-2 text-xl font-bold">Halaman tidak ditemukan</h1>
      <p className="mt-2 text-sm text-redup">Alamat yang dibuka tidak ada di aplikasi Aku Mw Magang.</p>
      <Link
        to="/"
        className="mt-5 inline-block border-2 border-hitam bg-kuning px-4 py-2 text-sm font-semibold shadow-tegas-kecil hover:bg-emas"
      >
        Kembali ke Eksplorasi Lowongan
      </Link>
    </section>
  );
}
