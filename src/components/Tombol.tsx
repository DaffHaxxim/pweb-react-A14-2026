// Tombol yang dipakai ulang di seluruh aplikasi dengan beberapa varian warna.
// Pola ini sama dengan contoh Button pada materi Tailwind (memetakan varian ke kelas utuh).

interface TombolProps {
  children: React.ReactNode;
  onClick?: () => void;
  type?: "button" | "submit";
  varian?: "utama" | "kedua" | "bahaya" | "gelap";
  ukuran?: "kecil" | "normal";
  disabled?: boolean;
  title?: string;
  className?: string;
}

const GAYA_VARIAN = {
  utama: "border-tepi bg-aksen text-di-aksen hover:bg-aksen-tua",
  kedua: "border-tepi bg-latar text-teks hover:bg-aksen-muda",
  bahaya: "border-bahaya bg-latar text-bahaya hover:bg-bahaya-muda",
  gelap: "border-tepi bg-pekat text-di-pekat hover:bg-pekat/85",
};

const GAYA_UKURAN = {
  kecil: "px-2.5 py-1 text-xs",
  normal: "px-4 py-2 text-sm",
};

export function Tombol({
  children,
  onClick,
  type = "button",
  varian = "utama",
  ukuran = "normal",
  disabled = false,
  title,
  className = "",
}: TombolProps) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      title={title}
      className={`border-2 font-semibold transition disabled:cursor-not-allowed disabled:opacity-50 ${GAYA_VARIAN[varian]} ${GAYA_UKURAN[ukuran]} ${className}`}
    >
      {children}
    </button>
  );
}
