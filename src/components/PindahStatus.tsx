import { useState } from "react";
import type { Application, ApplicationStatus, DataPindahStatus, WorkMode } from "../types/lamaran";
import { LABEL_STATUS, TRANSISI_STATUS } from "../utils/statusLamaran";
import { KELAS_INPUT, KELAS_LABEL, KELAS_PESAN_GALAT } from "./gaya";
import { Tombol } from "./Tombol";

interface PindahStatusProps {
  lamaran: Application;
  onPindah: (statusBaru: ApplicationStatus, data: DataPindahStatus) => void;
}

// Fitur 4: pindah status sesuai State Machine + input kondisional
export function PindahStatus({ lamaran, onPindah }: PindahStatusProps) {
  const [tujuan, setTujuan] = useState<ApplicationStatus | null>(null);
  const [cvVersion, setCvVersion] = useState(lamaran.cvVersion ?? "");
  const [appliedDate, setAppliedDate] = useState(lamaran.appliedDate ?? "");
  const [interviewDateTime, setInterviewDateTime] = useState("");
  const [salaryOffer, setSalaryOffer] = useState("");
  const [workMode, setWorkMode] = useState<WorkMode>(lamaran.workMode);
  const [pesanGalat, setPesanGalat] = useState("");

  // Hanya status tujuan yang sah menurut tabel State Machine yang ditampilkan
  const pilihanTujuan = TRANSISI_STATUS[lamaran.status];

  if (pilihanTujuan.length === 0) {
    return (
      <p className="border-2 border-dashed border-garis p-3 text-sm text-redup">
        Status <span className="font-semibold">{LABEL_STATUS[lamaran.status]}</span> bersifat final dan tidak
        bisa dipindah lagi.
      </p>
    );
  }

  const pilihTujuan = (status: ApplicationStatus) => {
    setTujuan(status);
    setPesanGalat("");
  };

  const handleKonfirmasi = (e: React.FormEvent) => {
    e.preventDefault();
    if (tujuan === null) return;

    // Syarat pindah status sesuai Aturan Main
    if (tujuan === "APPLIED" && (cvVersion.trim() === "" || appliedDate === "")) {
      setPesanGalat("Ke APPLIED wajib mengisi versi CV dan tanggal melamar.");
      return;
    }
    if (tujuan === "INTERVIEW" && interviewDateTime === "") {
      setPesanGalat("Ke INTERVIEW wajib mengisi jadwal interview.");
      return;
    }
    if (tujuan === "OFFER" && !(Number(salaryOffer) > 0)) {
      setPesanGalat("Ke OFFER wajib mengisi uang saku lebih dari 0.");
      return;
    }

    // Kirim hanya data yang relevan dengan status tujuan
    let data: DataPindahStatus = {};
    if (tujuan === "APPLIED") data = { cvVersion: cvVersion.trim(), appliedDate };
    if (tujuan === "INTERVIEW") data = { interviewDateTime };
    if (tujuan === "OFFER") data = { salaryOffer: Number(salaryOffer), workMode };

    onPindah(tujuan, data);
    setTujuan(null);
    setPesanGalat("");
  };

  return (
    <form onSubmit={handleKonfirmasi} noValidate className="space-y-3 border-2 border-tepi bg-permukaan p-3">
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-sm font-semibold">Pindahkan status ke:</span>
        {pilihanTujuan.map((status) => (
          <Tombol
            key={status}
            ukuran="kecil"
            varian={tujuan === status ? "gelap" : "kedua"}
            onClick={() => pilihTujuan(status)}
          >
            {LABEL_STATUS[status]}
          </Tombol>
        ))}
      </div>

      {/* Input kondisional sesuai status tujuan */}
      {tujuan === "APPLIED" && (
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
          <div>
            <label htmlFor="pindah-cv" className={KELAS_LABEL}>
              Versi CV
            </label>
            <input
              id="pindah-cv"
              value={cvVersion}
              onChange={(e) => setCvVersion(e.target.value)}
              placeholder="CV-Kapten-v2.pdf"
              className={KELAS_INPUT}
            />
          </div>
          <div>
            <label htmlFor="pindah-tanggal" className={KELAS_LABEL}>
              Tanggal Melamar
            </label>
            <input
              id="pindah-tanggal"
              type="date"
              value={appliedDate}
              onChange={(e) => setAppliedDate(e.target.value)}
              className={KELAS_INPUT}
            />
          </div>
        </div>
      )}

      {tujuan === "INTERVIEW" && (
        <div>
          <label htmlFor="pindah-jadwal" className={KELAS_LABEL}>
            Jadwal Interview
          </label>
          {/* datetime-local menghasilkan format YYYY-MM-DDTHH:mm sesuai soal */}
          <input
            id="pindah-jadwal"
            type="datetime-local"
            value={interviewDateTime}
            onChange={(e) => setInterviewDateTime(e.target.value)}
            className={KELAS_INPUT}
          />
        </div>
      )}

      {tujuan === "OFFER" && (
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
          <div>
            <label htmlFor="pindah-gaji" className={KELAS_LABEL}>
              Uang Saku / Bulan (Rp)
            </label>
            <input
              id="pindah-gaji"
              type="number"
              min="0"
              value={salaryOffer}
              onChange={(e) => setSalaryOffer(e.target.value)}
              placeholder="5000000"
              className={KELAS_INPUT}
            />
          </div>
          <div>
            <label htmlFor="pindah-mode" className={KELAS_LABEL}>
              Mode Kerja
            </label>
            <select
              id="pindah-mode"
              value={workMode}
              onChange={(e) => setWorkMode(e.target.value as WorkMode)}
              className={KELAS_INPUT}
            >
              <option value="Remote">Remote</option>
              <option value="Hybrid">Hybrid</option>
              <option value="Onsite">Onsite</option>
            </select>
          </div>
        </div>
      )}

      {pesanGalat && <p className={KELAS_PESAN_GALAT}>{pesanGalat}</p>}

      {tujuan !== null && (
        <Tombol type="submit" ukuran="kecil">
          Konfirmasi ke {LABEL_STATUS[tujuan]}
        </Tombol>
      )}
    </form>
  );
}
