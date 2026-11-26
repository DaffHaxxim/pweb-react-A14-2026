import type { Application } from "../types/lamaran";
import { formatTanggalJam } from "../utils/format";
import { cariBentrokInterview } from "../utils/jadwal";

// Banner peringatan jadwal interview bentrok.
// Menerima SELURUH data lamaran, sehingga tetap tampil walaupun filter di War Room sedang aktif.
export function BannerBentrok({ applications }: { applications: Application[] }) {
  const daftarBentrok = cariBentrokInterview(applications);

  if (daftarBentrok.length === 0) return null;

  return (
    <div role="alert" className="border-2 border-bahaya bg-bahaya-muda p-3">
      <p className="text-sm font-bold text-bahaya">⚠ Jadwal Interview Bentrok</p>
      <ul className="mt-1 space-y-0.5 text-sm text-teks">
        {daftarBentrok.map(({ pertama, kedua, selisihMenit }) => (
          <li key={pertama.id + kedua.id}>
            <span className="font-semibold">{pertama.company}</span> (
            {formatTanggalJam(pertama.interviewDateTime ?? "")}) dan{" "}
            <span className="font-semibold">{kedua.company}</span> (
            {formatTanggalJam(kedua.interviewDateTime ?? "")}) hanya berselisih {Math.round(selisihMenit)} menit.
          </li>
        ))}
      </ul>
    </div>
  );
}
