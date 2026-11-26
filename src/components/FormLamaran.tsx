import { useRef, useState } from "react";
import type { Application, DataLamaranBaru, WorkMode } from "../types/lamaran";
import { pisahkanSkill, sudahDilamar } from "../utils/lamaran";
import { KELAS_INPUT, KELAS_INPUT_GALAT, KELAS_LABEL, KELAS_PANEL, KELAS_PESAN_GALAT } from "./gaya";
import { Tombol } from "./Tombol";

interface FormLamaranProps {
  applications: Application[]; // dipakai untuk cek duplikat
  onSimpan: (data: DataLamaranBaru) => void;
}

// Pesan error per input (kosong = tidak ada error)
interface GalatForm {
  company?: string;
  role?: string;
  cvVersion?: string;
  appliedDate?: string;
  requiredSkills?: string;
}

// Fitur 2: Form tambah lamaran manual (controlled form: setiap input punya value + onChange)
export function FormLamaran({ applications, onSimpan }: FormLamaranProps) {
  const [company, setCompany] = useState("");
  const [role, setRole] = useState("");
  const [workMode, setWorkMode] = useState<WorkMode>("Remote");
  const [status, setStatus] = useState<"WISHLIST" | "APPLIED">("WISHLIST");
  const [cvVersion, setCvVersion] = useState("");
  const [appliedDate, setAppliedDate] = useState("");
  const [teksSkill, setTeksSkill] = useState("");
  const [galat, setGalat] = useState<GalatForm>({});

  // useRef untuk memfokuskan kursor ke input pertama yang error
  const refCompany = useRef<HTMLInputElement>(null);
  const refRole = useRef<HTMLInputElement>(null);
  const refCv = useRef<HTMLInputElement>(null);
  const refTanggal = useRef<HTMLInputElement>(null);
  const refSkill = useRef<HTMLInputElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Kumpulkan semua error dulu. galatBaru adalah objek lokal (bukan state), jadi boleh diisi langsung.
    const galatBaru: GalatForm = {};
    const skills = pisahkanSkill(teksSkill);

    if (company.trim() === "") galatBaru.company = "Nama perusahaan wajib diisi.";
    if (role.trim() === "") galatBaru.role = "Posisi / role wajib diisi.";
    if (!galatBaru.company && !galatBaru.role && sudahDilamar(applications, company, role)) {
      galatBaru.company = `Lamaran ${company.trim()} - ${role.trim()} sudah ada (tidak boleh duplikat).`;
    }
    if (status === "APPLIED") {
      if (cvVersion.trim() === "") galatBaru.cvVersion = "Versi CV wajib diisi untuk status APPLIED.";
      if (appliedDate === "") galatBaru.appliedDate = "Tanggal melamar wajib diisi untuk status APPLIED.";
    }
    if (skills.length === 0) galatBaru.requiredSkills = "Isi minimal satu skill, pisahkan dengan koma.";

    setGalat(galatBaru);

    // Auto-focus ke input error pertama, mengikuti urutan input di form
    if (galatBaru.company) refCompany.current?.focus();
    else if (galatBaru.role) refRole.current?.focus();
    else if (galatBaru.cvVersion) refCv.current?.focus();
    else if (galatBaru.appliedDate) refTanggal.current?.focus();
    else if (galatBaru.requiredSkills) refSkill.current?.focus();

    // Ada error: berhenti, jangan simpan
    if (Object.keys(galatBaru).length > 0) return;

    // Lolos validasi: kirim data ke parent (lifting state up)
    onSimpan({
      company,
      role,
      workMode,
      status,
      requiredSkills: skills,
      // Data CV hanya dikirim jika status awal APPLIED
      cvVersion: status === "APPLIED" ? cvVersion.trim() : undefined,
      appliedDate: status === "APPLIED" ? appliedDate : undefined,
    });
  };

  return (
    // noValidate: validasi bawaan browser dimatikan agar validasi + auto-focus kita yang berjalan
    <form onSubmit={handleSubmit} noValidate className={`${KELAS_PANEL} space-y-4`}>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div>
          <label htmlFor="company" className={KELAS_LABEL}>
            Perusahaan
          </label>
          <input
            id="company"
            ref={refCompany}
            value={company}
            onChange={(e) => setCompany(e.target.value)}
            placeholder="Misal: Garuda FinTech"
            className={galat.company ? KELAS_INPUT_GALAT : KELAS_INPUT}
          />
          {galat.company && <p className={KELAS_PESAN_GALAT}>{galat.company}</p>}
        </div>

        <div>
          <label htmlFor="role" className={KELAS_LABEL}>
            Posisi / Role
          </label>
          <input
            id="role"
            ref={refRole}
            value={role}
            onChange={(e) => setRole(e.target.value)}
            placeholder="Misal: Frontend Intern"
            className={galat.role ? KELAS_INPUT_GALAT : KELAS_INPUT}
          />
          {galat.role && <p className={KELAS_PESAN_GALAT}>{galat.role}</p>}
        </div>

        <div>
          <label htmlFor="workMode" className={KELAS_LABEL}>
            Mode Kerja
          </label>
          <select
            id="workMode"
            value={workMode}
            onChange={(e) => setWorkMode(e.target.value as WorkMode)}
            className={KELAS_INPUT}
          >
            <option value="Remote">Remote</option>
            <option value="Hybrid">Hybrid</option>
            <option value="Onsite">Onsite</option>
          </select>
        </div>

        <div>
          <label htmlFor="status" className={KELAS_LABEL}>
            Status Awal
          </label>
          <select
            id="status"
            value={status}
            onChange={(e) => setStatus(e.target.value as "WISHLIST" | "APPLIED")}
            className={KELAS_INPUT}
          >
            <option value="WISHLIST">WISHLIST (belum dikirim)</option>
            <option value="APPLIED">APPLIED (sudah dikirim)</option>
          </select>
        </div>

        {/* Input kondisional: hanya muncul jika Status Awal = APPLIED */}
        {status === "APPLIED" && (
          <>
            <div>
              <label htmlFor="cvVersion" className={KELAS_LABEL}>
                Versi CV
              </label>
              <input
                id="cvVersion"
                ref={refCv}
                value={cvVersion}
                onChange={(e) => setCvVersion(e.target.value)}
                placeholder="Misal: CV-Kapten-v2.pdf"
                className={galat.cvVersion ? KELAS_INPUT_GALAT : KELAS_INPUT}
              />
              {galat.cvVersion && <p className={KELAS_PESAN_GALAT}>{galat.cvVersion}</p>}
            </div>
            <div>
              <label htmlFor="appliedDate" className={KELAS_LABEL}>
                Tanggal Melamar
              </label>
              <input
                id="appliedDate"
                type="date"
                ref={refTanggal}
                value={appliedDate}
                onChange={(e) => setAppliedDate(e.target.value)}
                className={galat.appliedDate ? KELAS_INPUT_GALAT : KELAS_INPUT}
              />
              {galat.appliedDate && <p className={KELAS_PESAN_GALAT}>{galat.appliedDate}</p>}
            </div>
          </>
        )}
      </div>

      <div>
        <label htmlFor="requiredSkills" className={KELAS_LABEL}>
          Required Skills (pisahkan dengan koma)
        </label>
        <input
          id="requiredSkills"
          ref={refSkill}
          value={teksSkill}
          onChange={(e) => setTeksSkill(e.target.value)}
          placeholder="React, TypeScript, CSS, Docker"
          className={galat.requiredSkills ? KELAS_INPUT_GALAT : KELAS_INPUT}
        />
        {galat.requiredSkills && <p className={KELAS_PESAN_GALAT}>{galat.requiredSkills}</p>}
      </div>

      <div className="flex justify-end">
        <Tombol type="submit">Simpan Lamaran</Tombol>
      </div>
    </form>
  );
}
