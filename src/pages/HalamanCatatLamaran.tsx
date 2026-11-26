import { Link, useNavigate } from "react-router";
import { FormLamaran } from "../components/FormLamaran";
import type { Application, DataLamaranBaru } from "../types/lamaran";

interface HalamanCatatLamaranProps {
  applications: Application[];
  onTambah: (data: DataLamaranBaru) => void;
}

// Halaman form tambah lamaran manual ("/lamaran/baru")
export function HalamanCatatLamaran({ applications, onTambah }: HalamanCatatLamaranProps) {
  // useNavigate: pindah halaman lewat kode, setelah logika simpan selesai
  const navigate = useNavigate();

  const handleSimpan = (data: DataLamaranBaru) => {
    onTambah(data);
    navigate("/lamaran");
  };

  return (
    <section className="mx-auto max-w-3xl space-y-4">
      <div className="flex flex-wrap items-end justify-between gap-2">
        <div>
          <h1 className="text-2xl font-bold">Catat Lamaran Manual</h1>
          <p className="text-sm text-redup">
            Untuk lowongan yang tidak ada di daftar eksplorasi. Pasangan perusahaan + posisi tidak boleh sama.
          </p>
        </div>
        <Link to="/lamaran" className="text-sm font-semibold text-sekunder underline hover:text-sorot">
          Kembali ke Pipeline
        </Link>
      </div>
      <FormLamaran applications={applications} onSimpan={handleSimpan} />
    </section>
  );
}
