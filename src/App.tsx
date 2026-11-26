import { Route, Routes } from "react-router";
import { useLocalStorage } from "./hooks/useLocalStorage";
import { TataLetak } from "./layouts/TataLetak";
import { HalamanCatatLamaran } from "./pages/HalamanCatatLamaran";
import { HalamanLamaran } from "./pages/HalamanLamaran";
import { HalamanLowongan } from "./pages/HalamanLowongan";
import { HalamanOffer } from "./pages/HalamanOffer";
import { HalamanTidakDitemukan } from "./pages/HalamanTidakDitemukan";
import type { Application } from "./types/lamaran";

export default function App() {
  // ===== State utama (diangkat ke App agar tidak hilang saat pindah halaman) =====
  // Memakai Custom Hook useLocalStorage supaya tetap ada setelah refresh.
  const [applications] = useLocalStorage<Application[]>("akumwmagang-applications", []);

  // ===== Tabel route =====
  return (
    <Routes>
      <Route path="/" element={<TataLetak applications={applications} />}>
        <Route index element={<HalamanLowongan />} />
        <Route path="lamaran" element={<HalamanLamaran />} />
        <Route path="lamaran/baru" element={<HalamanCatatLamaran />} />
        <Route path="offer" element={<HalamanOffer />} />
        <Route path="*" element={<HalamanTidakDitemukan />} />
      </Route>
    </Routes>
  );
}
