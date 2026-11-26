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

## Dokumentasi

Tangkapan layar di bawah diambil dari hasil build produksi (`npm run build` + `npm run preview`) dengan tema bawaan **Vibrant Yellow**, kecuali bagian Tema Warna. Semua gambar ada di folder [`Asset/`](Asset/).

### Fitur 1: Profil Skill & Eksplorasi Lowongan

| Kondisi | Tangkapan layar |
|---|---|
| **Loading**: lowongan sedang diambil dari Remotive API | ![Loading](Asset/01-eksplorasi-loading.png) |
| **Daftar lowongan** dari Remotive, lengkap dengan Match %, skill cocok/missing, dan tautan "Lihat di Remotive" | ![Daftar Remotive](Asset/02-eksplorasi-daftar-remotive.png) |
| **Error** saat offline: pesan gagal + tombol Coba Lagi dan Pakai Fallback Lokal | ![Error offline](Asset/03-eksplorasi-error-offline.png) |
| **Dataset lokal** (`public/magang-fallback.json`, 15 lowongan) | ![Dataset lokal](Asset/04-eksplorasi-dataset-lokal.png) |
| **Kosong**: pencarian tanpa hasil + tombol Reset Pencarian | ![Kosong](Asset/05-eksplorasi-kosong.png) |
| **Debounce**: selama mengetik, filter menunggu ("Menunggu ketikan selesai...") | ![Debounce menunggu](Asset/06-debounce-menunggu.png) |
| **Debounce**: sekitar 400 ms setelah berhenti mengetik, daftar tersaring | ![Debounce hasil](Asset/07-debounce-hasil.png) |
| **Skill Match live**: sebelum skill Docker ditambah (60%) | ![Sebelum Docker](Asset/08-skill-sebelum-docker.png) |
| **Skill Match live**: sesudah skill Docker ditambah (80%, Docker jadi skill cocok) | ![Sesudah Docker](Asset/09-skill-sesudah-docker.png) |
| **Skill duplikat ditolak** (tidak peduli huruf besar/kecil) | ![Skill duplikat](Asset/10-skill-duplikat.png) |
| **Filter kategori** (Data Analysis) | ![Filter kategori](Asset/11-filter-kategori.png) |
| **Sudah Dilamar**: tombol otomatis nonaktif setelah disimpan ke Wishlist | ![Sudah Dilamar](Asset/12-sudah-dilamar.png) |
| **Bonus shortcut `/`**: kolom pencarian langsung terfokus | ![Shortcut slash](Asset/13-shortcut-slash.png) |

### Fitur 2: Form Tambah Lamaran Manual

| Kondisi | Tangkapan layar |
|---|---|
| Form kosong (controlled form) | ![Form kosong](Asset/14-form-kosong.png) |
| Status Awal APPLIED memunculkan Versi CV dan Tanggal Melamar; input kosong ditolak dan kursor pindah ke error pertama | ![Validasi APPLIED](Asset/15-form-validasi-applied.png) |
| Perusahaan + posisi yang sama (beda huruf besar/kecil) ditolak, kursor pindah ke kolom Perusahaan | ![Duplikat](Asset/16-form-duplikat.png) |
| Lamaran tersimpan, aplikasi pindah ke War Room | ![Berhasil](Asset/17-form-berhasil.png) |

### Fitur 3: War Room, Rawan Ghosting, dan Bentrok Jadwal

| Kondisi | Tangkapan layar |
|---|---|
| War Room kosong (tombol Catat Lamaran dan Muat Data Contoh) | ![War Room kosong](Asset/18-warroom-kosong.png) |
| Data contoh: 7 lamaran dengan berbagai status | ![Data contoh](Asset/19-warroom-data-contoh.png) |
| Setelah **Simulasi +15 Hari**: badge Rawan Ghosting muncul dan statistik bertambah | ![Ghosting](Asset/20-warroom-ghosting.png) |
| Toggle **Hanya Rawan Ghosting** | ![Filter ghosting](Asset/21-warroom-filter-ghosting.png) |
| **Banner bentrok** (2 interview selisih 30 menit) tetap tampil walau filter status Wishlist aktif | ![Bentrok](Asset/22-warroom-bentrok-filter.png) |
| Urutan **Offer Tertinggi** | ![Urut offer](Asset/23-warroom-urut-offer.png) |

### Fitur 4: Detail Lamaran (State Machine, Checklist, Riwayat)

| Kondisi | Tangkapan layar |
|---|---|
| Lamaran WISHLIST hanya bisa pindah ke **Applied** (tidak bisa langsung ke Offer) | ![Opsi WISHLIST](Asset/24-detail-opsi-wishlist.png) |
| Pindah ke APPLIED tanpa Versi CV dan tanggal ditolak | ![Syarat APPLIED](Asset/25-detail-syarat-applied.png) |
| Pindah ke INTERVIEW memunculkan input jadwal | ![Input interview](Asset/26-detail-input-interview.png) |
| Pindah ke OFFER memunculkan input uang saku dan mode kerja | ![Input offer](Asset/27-detail-input-offer.png) |
| Status OFFER bersifat final | ![Status final](Asset/28-detail-status-final.png) |
| Status GHOSTED hanya boleh kembali ke **Screening** | ![GHOSTED](Asset/29-detail-ghosted-kembali.png) |
| Checklist bertingkat (tambah, centang, progress) dan catatan manual di Riwayat Aktivitas | ![Checklist dan log](Asset/30-detail-checklist-log.png) |

### Fitur 5: Interview Prep Timer

| Kondisi | Tangkapan layar |
|---|---|
| Timer berjalan (02:00 menurun) dengan tombol Pause, Reset, Soal Berikutnya | ![Timer berjalan](Asset/31-timer-berjalan.png) |
| Waktu habis: 00:00, pesan peringatan, tombol Start nonaktif | ![Timer habis](Asset/32-timer-habis.png) |

### Fitur 6: Undo Delete dan Persistensi

| Kondisi | Tangkapan layar |
|---|---|
| Toast **Undo (5 detik)** setelah lamaran dihapus (pojok kanan bawah) | ![Undo](Asset/33-undo-toast.png) |

### Fitur 7: Dashboard Statistik dan Offer Comparator

| Kondisi | Tangkapan layar |
|---|---|
| 5 kartu statistik (derived state) | ![Statistik](Asset/34-statistik.png) |
| Offer kurang dari 2: pesan kosong yang jelas | ![Offer kosong](Asset/35-offer-kosong.png) |
| Perbandingan dua offer dengan skor berbobot dan badge Rekomendasi Terbaik | ![Perbandingan offer](Asset/36-offer-perbandingan.png) |

### Bonus dan Lain-lain

| Kondisi | Tangkapan layar |
|---|---|
| Ekspor lalu impor cadangan JSON berhasil | ![Ekspor impor](Asset/37-ekspor-impor.png) |
| Halaman 404 untuk alamat yang tidak terdaftar | ![404](Asset/38-halaman-404.png) |

### Tema Warna

| Kondisi | Tangkapan layar |
|---|---|
| Pilihan tema di header (dropdown bergaya tema) | ![Pilihan tema](Asset/39-tema-pilihan.png) |
| **Vibrant Yellow** (bawaan) | ![Vibrant Yellow](Asset/40-tema-vibrant-yellow.png) |
| **Soft Night** | ![Soft Night](Asset/41-tema-soft-night.png) |
| **Matte Steel** | ![Matte Steel](Asset/42-tema-matte-steel.png) |
| Modal detail pada Soft Night | ![Soft Night detail](Asset/43-tema-soft-night-detail.png) |
| Badge Match hijau/kuning/merah di ketiga tema | ![Badge 3 tema](Asset/44-badge-match-3-tema.png) |

### Tampilan Ponsel (lebar 390 px)

| Eksplorasi Lowongan | War Room |
|---|---|
| ![Ponsel eksplorasi](Asset/45-responsif-hp-eksplorasi.png) | ![Ponsel War Room](Asset/46-responsif-hp-warroom.png) |
