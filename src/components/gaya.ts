// Kumpulan kelas Tailwind yang dipakai berulang di banyak form,
// supaya string kelas panjang tidak ditulis ulang di setiap input.
// Kelas ditulis utuh (tidak dirangkai sebagian) agar terbaca oleh Tailwind.

export const KELAS_LABEL = "mb-1 block text-xs font-semibold uppercase tracking-wide text-redup";

export const KELAS_INPUT =
  "w-full border-2 border-tepi bg-latar px-3 py-2 text-sm text-teks placeholder:text-redup/70 focus:border-sorot focus:outline-none";

// Versi input saat ada error validasi (garis merah)
export const KELAS_INPUT_GALAT =
  "w-full border-2 border-bahaya bg-bahaya-muda px-3 py-2 text-sm text-teks placeholder:text-redup/70 focus:outline-none";

export const KELAS_PESAN_GALAT = "mt-1 text-xs font-medium text-bahaya";

// Panel/kartu dasar: kotak dengan garis tepi tegas
export const KELAS_PANEL = "latar-kartu border-2 border-tepi p-4";

export const KELAS_JUDUL_PANEL = "mb-3 text-xs font-bold uppercase tracking-widest text-sekunder";
