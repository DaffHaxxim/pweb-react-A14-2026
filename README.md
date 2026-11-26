# Aku Mw Magang

Aplikasi frontend React untuk membantu **Kapten** mengelola seluruh proses lamaran magang: mencari lowongan dan menghitung kecocokan skill, melacak status lamaran dengan aturan perpindahan yang ketat, mempersiapkan interview, sampai membandingkan dua tawaran magang.

Praktikum Pemrograman Web Modul 5, Kelompok A14.

## Teknologi

| Bagian | Pilihan |
|---|---|
| Framework | React 19 + TypeScript (`strict: true`, tanpa tipe `any`) |
| Build tool | Vite (template `react-ts`) |
| Navigasi | React Router v7 (mode deklaratif) |
| Styling | Tailwind CSS v4 dengan token warna di `src/index.css` dan 3 tema (Vibrant Yellow, Soft Night, Matte Steel) |
| State, fetch, form, timer, penyimpanan | React Hooks bawaan + Custom Hook buatan sendiri (`useLocalStorage`, `useDebounce`) |

Tidak memakai library state management (Redux, Zustand, TanStack Query) maupun library form (React Hook Form, Formik).

## Cara Menjalankan

Butuh Node.js 24 LTS atau lebih baru.

```bash
npm install
npm run dev
```

Buka `http://localhost:5173`.

| Perintah | Fungsi |
|---|---|
| `npm run dev` | Menjalankan server pengembangan |
| `npm run build` | Cek tipe (`tsc -b`) lalu build produksi ke `dist/` |
| `npm run preview` | Menjalankan hasil build di `http://localhost:4173` |
| `npm run cek-tipe` | Cek tipe seluruh kode `src/` (`tsc --noEmit -p tsconfig.app.json`) |
| `npm run lint` | Pemeriksaan kode dengan oxlint |

> `npx tsc --noEmit` juga lolos, tetapi pada template Vite perintah itu tidak memeriksa file apa pun karena `tsconfig.json` hanya berisi referensi (`"files": []`). Pemeriksaan sebenarnya ada di `npm run cek-tipe` dan `npm run build`.

Panduan menjalankan dan menguji setiap fitur langkah demi langkah ada di [PANDUAN-PENGUJIAN.md](PANDUAN-PENGUJIAN.md).

## Halaman (Route)

| Alamat | Halaman | Isi |
|---|---|---|
| `/` | `HalamanLowongan` | Profil skill, sumber data, pencarian, filter, kartu lowongan |
| `/lamaran` | `HalamanLamaran` | War Room: daftar lamaran, filter gabungan, modal detail |
| `/lamaran/baru` | `HalamanCatatLamaran` | Form tambah lamaran manual |
| `/offer` | `HalamanOffer` | Offer Comparator |
| `*` | `HalamanTidakDitemukan` | Halaman 404 |

Semua halaman memakai `TataLetak` (header, banner bentrok, 5 kartu statistik, toast undo).

## Struktur Folder

```text
public/
└── magang-fallback.json      15 lowongan magang tech Indonesia (format sama dengan Remotive)
src/
├── App.tsx                   State utama + semua handler + tabel route
├── main.tsx                  Titik masuk (BrowserRouter)
├── index.css                 Tailwind + token warna + tema Soft Night dan Matte Steel
├── components/               Komponen UI (kartu, form, modal, badge, timer, dll.)
├── data/contohLamaran.ts     Data contoh untuk demo
├── hooks/                    useLocalStorage<T>, useDebounce<T>
├── layouts/TataLetak.tsx     Kerangka halaman (<Outlet />)
├── pages/                    Komponen untuk setiap route
├── services/jobService.ts    Fetch Remotive API dan fallback lokal
├── types/                    lamaran.ts (Application, dll.), lowongan.ts (JobListing)
└── utils/                    Fungsi murni: state machine, skill match, jadwal, skor offer, format, cadangan
```

## Letak State dan Alur Data

Seluruh state yang dipakai lebih dari satu halaman diletakkan di `App.tsx`, di atas `<Routes>`, sehingga pindah halaman tidak menghilangkan data dan tidak memicu fetch ulang:

| State | Hook | Keterangan |
|---|---|---|
| `applications` | `useLocalStorage<Application[]>` | Semua lamaran, tersimpan di localStorage (`akumwmagang-applications`) |
| `kaptenSkills` | `useLocalStorage<string[]>` | Skill Kapten (awal: React, TypeScript, CSS), tersimpan di localStorage (`akumwmagang-kapten-skills`) |
| `tema` | `useLocalStorage<NamaTema>` | Tema warna terpilih (`akumwmagang-tema`), dipasang ke `<html data-tema>` lewat `useEffect` |
| `lowongan`, `isLoading`, `error` | `useState` | Hasil fetch lowongan |
| `sumberData`, `nomorMuat` | `useState` | Pilihan sumber dan pemicu muat ulang (dependency efek fetch) |
| `lamaranTerhapus` + `timerUndoRef` | `useState` + `useRef` | Data dan ID timer untuk Undo Delete |

Komponen anak menerima data lewat props dan mengirim perubahan lewat fungsi callback (lifting state up). Nilai turunan seperti Skill Match %, Rawan Ghosting, bentrok jadwal, statistik, dan skor offer **dihitung langsung saat render** (derived state), tidak disimpan di `useState` terpisah.

## Peta Fitur ke Kode

| Fitur | File utama |
|---|---|
| 1. Profil skill & eksplorasi lowongan | `pages/HalamanLowongan.tsx`, `components/ProfilSkill.tsx`, `components/KartuLowongan.tsx`, `services/jobService.ts`, `hooks/useDebounce.ts`, `utils/skillMatch.ts`, efek fetch di `App.tsx` |
| 2. Form tambah lamaran manual | `components/FormLamaran.tsx`, `pages/HalamanCatatLamaran.tsx` |
| 3. War Room, ghosting, bentrok | `pages/HalamanLamaran.tsx`, `components/KartuLamaran.tsx`, `components/BannerBentrok.tsx`, `utils/jadwal.ts` |
| 4. Detail: state machine, checklist, log | `components/DetailLamaran.tsx`, `components/PindahStatus.tsx`, `components/ChecklistPersiapan.tsx`, `components/RiwayatAktivitas.tsx`, `utils/statusLamaran.ts`, handler di `App.tsx` |
| 5. Interview prep timer | `components/LatihanInterview.tsx` |
| 6. Undo delete & persistensi | `hapusLamaran` / `batalkanHapus` di `App.tsx`, `components/ToastUndo.tsx`, `hooks/useLocalStorage.ts` |
| 7. Statistik & offer comparator | `components/RingkasanStatistik.tsx`, `pages/HalamanOffer.tsx`, `utils/offer.ts` |
| Bonus: shortcut `/` | `pages/HalamanLowongan.tsx` |
| Bonus: data contoh | `data/contohLamaran.ts` |
| Bonus: ekspor/impor JSON | `components/CadanganData.tsx`, `utils/cadangan.ts` |
| Bonus: tema warna | `components/PilihTema.tsx`, `types/tema.ts`, state `tema` di `App.tsx`, blok `data-tema` di `index.css` |

## Aturan Main yang Diterapkan

**State machine** (`src/utils/statusLamaran.ts`):

| Dari | Boleh ke | Data wajib |
|---|---|---|
| WISHLIST | APPLIED | `cvVersion`, `appliedDate` |
| APPLIED | SCREENING, REJECTED, GHOSTED | |
| SCREENING | INTERVIEW, REJECTED, GHOSTED | INTERVIEW: `interviewDateTime` |
| INTERVIEW | OFFER, REJECTED, GHOSTED | OFFER: `salaryOffer > 0`, `workMode` |
| GHOSTED | SCREENING | |
| OFFER, REJECTED | (final) | |

Tombol status hanya menampilkan tujuan yang sah, dan `pindahStatus` di `App.tsx` menolak perpindahan di luar tabel sebagai penjaga terakhir.

**Aturan lain:**
- **Anti-duplikat:** pasangan company + role dibandingkan setelah `trim()` dan `toLowerCase()`.
- **Skill Match:** `Math.round((jumlahCocok / totalRequired) * 100)`, tidak peduli huruf besar/kecil; lowongan tanpa skill bernilai 0%. Badge hijau >= 70%, kuning 40-69%, merah < 40%.
- **Rawan Ghosting:** status APPLIED/SCREENING dengan `lastUpdatedAt` lebih dari 14 hari. `lastUpdatedAt` hanya berubah saat lamaran dibuat, status berpindah, atau Simulasi +15 Hari (mencentang checklist tidak menghapus badge).
- **Bentrok jadwal:** setiap pasangan lamaran INTERVIEW dengan selisih < 60 menit, dihitung dari seluruh data.
- **Undo:** toast 5 detik; ID `setTimeout` disimpan di `useRef` dan dibersihkan dengan `clearTimeout` saat menghapus lagi.
- **Skor offer:** `(gaji / gaji tertinggi dari dua offer x 100) x 50% + skor mode x 25% + Skill Match x 25%`; Remote 100, Hybrid 75, Onsite 50.

**Definisi statistik:**
- **Response Rate** = lamaran berstatus SCREENING/INTERVIEW/OFFER/REJECTED dibagi lamaran terkirim (selain WISHLIST).
- **Interview Rate** = lamaran terkirim yang punya jadwal interview dibagi lamaran terkirim.

## Tema Warna

Pilihan **Tema** ada di header dan tersimpan di localStorage.

| Tema (nilai di kode) | Karakter |
|---|---|
| **Vibrant Yellow** (`emas`, bawaan) | Latar putih, aksen kuning, emas, oranye, cokelat, garis hitam |
| **Soft Night** (`gelap`) | Arang lembut seperti pemutar musik AIMP, kotak sedikit lebih terang dari latar, aksen emas dan oranye yang diredam |
| **Matte Steel** (`baja`) | Tetap dominan putih, kotak abu-abu muda bertekstur seperti baja matte, tanpa warna oranye |

Ikon tab browser ikut berganti sesuai tema (`public/favicon-emas.svg`, `favicon-gelap.svg`, `favicon-baja.svg`).

Cara kerjanya: setiap warna di `src/index.css` diberi nama sesuai **perannya**, bukan nama warnanya:

| Token | Peran |
|---|---|
| `latar`, `permukaan` | Latar halaman dan bilah/panel |
| `kartu` + kelas `latar-kartu` | Latar kotak/kartu; di Matte Steel diberi tekstur (`--tekstur-kartu`) |
| `garis`, `tepi` | Garis pemisah tipis dan garis tepi tegas |
| `teks`, `redup` | Teks utama dan teks keterangan |
| `pekat`, `di-pekat` | Permukaan pekat (logo, tombol gelap, toast) dan teks di atasnya |
| `aksen`, `aksen-tua`, `aksen-muda`, `aksen-lembut`, `di-aksen`, `teks-aksen` | Warna utama dan turunannya |
| `sorot`, `sorot-muda`, `teks-sorot` | Warna kedua (progress bar, fokus, badge ghosting) |
| `sekunder` | Judul panel dan tautan |
| `berhasil`, `peringatan`, `bahaya` (+ `-muda`) | Hijau, kuning, merah; ada di semua tema karena diminta soal untuk badge Match |
| `kurang` | Penanda missing skill (merah, kecuali abu-abu di Matte Steel) |

Kelas Tailwind seperti `bg-aksen` dikompilasi menjadi `background-color: var(--color-aksen)`. Tema Soft Night dan Matte Steel hanya mengganti nilai token lewat selektor `:root[data-tema="gelap"]` dan `:root[data-tema="baja"]`, jadi komponen tidak perlu diubah.

## Sumber Data

- **Remotive API** (`https://remotive.com/api/remote-jobs?category=software-dev&limit=30`): gratis, tanpa API key. Sesuai ketentuan Remotive, setiap kartu menautkan kembali ke halaman lowongan di Remotive dan footer menyebut Remotive sebagai sumber. Remotive menyarankan maksimal sekitar 4 request per hari; fetch hanya terjadi saat aplikasi dibuka, sumber diganti, atau tombol muat ulang ditekan.
- **Fallback lokal** (`public/magang-fallback.json`): 15 lowongan fiktif perusahaan tech Indonesia. Dipakai lewat pilihan sumber data atau tombol "Pakai Fallback Lokal" saat API gagal.

## Hal di Luar Materi Modul 5

| Hal | Dipakai untuk |
|---|---|
| `AbortController` | Membatalkan fetch lama (diwajibkan soal) |
| `crypto.randomUUID()` | ID unik (disarankan soal; berjalan di `localhost` atau https) |
| `Record<K, V>` | Tabel state machine dan peta warna/label |
| React Router v7 dan Tailwind CSS v4 | Navigasi dan styling (materi minggu berikutnya) |
| `document.documentElement.dataset` + skrip kecil di `index.html` | Bonus tema: memasang `data-tema` pada `<html>`; skrip dijalankan sebelum React agar tema Soft Night tidak berkedip putih saat halaman dimuat |
| `window.addEventListener("keydown")` | Bonus shortcut `/` |
| `Blob`, `URL.createObjectURL`, `file.text()` | Bonus ekspor/impor JSON |
| CSS `appearance: base-select` | Dropdown `<select>` bergaya tema (sorotan kuning muda) di browser Chromium; browser lain memakai tampilan bawaan |
