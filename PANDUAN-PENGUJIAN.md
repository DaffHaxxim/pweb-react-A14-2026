# Panduan Menjalankan dan Menguji "Aku Mw Magang"

Panduan ini menjelaskan cara menjalankan proyek dari nol, memeriksa kode, lalu menguji **seluruh fitur** secara manual di browser: 10 skenario wajib dari soal, uji tambahan untuk setiap aturan main, dan fitur bonus. Setiap skenario mencantumkan langkah, hasil yang diharapkan, dan file kode yang bisa ditunjukkan saat demo.

## Daftar Isi

1. [Prasyarat](#1-prasyarat)
2. [Menjalankan Proyek](#2-menjalankan-proyek)
3. [Pemeriksaan Kode](#3-pemeriksaan-kode)
4. [Persiapan Sebelum Menguji](#4-persiapan-sebelum-menguji)
5. [Peta Halaman](#5-peta-halaman)
6. [Uji 10 Skenario Wajib](#6-uji-10-skenario-wajib)
7. [Uji Tambahan per Fitur](#7-uji-tambahan-per-fitur)
8. [Uji Fitur Bonus](#8-uji-fitur-bonus)
9. [Checklist Cepat Sebelum Demo](#9-checklist-cepat-sebelum-demo)
10. [Mengatasi Masalah](#10-mengatasi-masalah)

---

## 1. Prasyarat

| Kebutuhan | Keterangan |
|---|---|
| Node.js | Versi 24 LTS atau lebih baru (`node --version`) |
| npm | Ikut terpasang bersama Node.js |
| Browser | Chrome atau Edge (panduan ini memakai DevTools Chrome) |
| Internet | Untuk Remotive API dan font. Tanpa internet, aplikasi tetap jalan memakai dataset lokal |

## 2. Menjalankan Proyek

### 2.1 Mode pengembangan

```bash
git clone <URL-repository>
cd pweb-react-A14-2026
npm install
npm run dev
```

Buka `http://localhost:5173`. Halaman pertama adalah **Eksplorasi Lowongan**.

### 2.2 Mode produksi (hasil build)

```bash
npm run build
npm run preview
```

Buka `http://localhost:4173`. Mode ini memakai file hasil build di `dist/`, sama seperti saat aplikasi dipasang di server.

> Mode pengembangan memakai `<StrictMode>`, sehingga setiap `useEffect` sengaja dijalankan dua kali saat komponen muncul (pasang, bersihkan, pasang lagi). Karena setiap efek punya cleanup, hasilnya tetap benar. Di mode produksi efek hanya berjalan sekali.

## 3. Pemeriksaan Kode

Jalankan dari folder proyek:

| Perintah | Hasil yang diharapkan |
|---|---|
| `npm run cek-tipe` | Tidak ada output error (exit code 0) |
| `npx tsc --noEmit` | Tidak ada output error. Catatan: pada template Vite perintah ini tidak memeriksa file apa pun karena `tsconfig.json` hanya berisi referensi. Gunakan `npm run cek-tipe` untuk pemeriksaan sebenarnya |
| `npm run build` | Diakhiri `✓ built in ...` |
| `npm run lint` | Tidak ada warning atau error |

Untuk membuktikan bahwa `npm run cek-tipe` benar-benar memeriksa kode: tambahkan sementara baris `const x: number = "teks";` di file mana pun dalam `src/`, jalankan `npm run cek-tipe` (muncul error TS2322), lalu hapus baris itu.

## 4. Persiapan Sebelum Menguji

**Mengosongkan data** (agar uji dimulai dari keadaan bersih):

1. Buka DevTools (`F12`), tab **Application** → **Local Storage** → `http://localhost:5173`.
2. Hapus kunci `akumwmagang-applications` dan `akumwmagang-kapten-skills`, atau jalankan `localStorage.clear()` di tab **Console**.
3. Tekan `F5`.

Setelah dikosongkan, profil skill kembali ke **React, TypeScript, CSS** dan War Room kosong.

**Dua cara mengisi data uji:**
- **Manual** lewat Eksplorasi Lowongan ("Simpan ke Wishlist") dan **+ Catat Lamaran**. Cara ini dipakai di skenario wajib.
- **Cepat** lewat tombol **Muat Data Contoh** di War Room yang masih kosong (7 lamaran dengan berbagai status, termasuk 1 INTERVIEW dan 2 OFFER).

**Data lowongan yang dipakai di panduan:** beberapa skenario memakai **Dataset Magang (Lokal)** karena isinya tetap, sedangkan isi Remotive berubah setiap hari. Pilih sumber ini di panel **Sumber Data Lowongan**.

## 5. Peta Halaman

| Menu / Alamat | Isi |
|---|---|
| Eksplorasi Lowongan (`/`) | Profil skill, sumber data, pencarian, filter kategori, urutan, kartu lowongan |
| Pipeline Lamaran (`/lamaran`) | War Room: filter gabungan, kartu lamaran, modal detail, ekspor/impor |
| + Catat Lamaran (`/lamaran/baru`) | Form tambah lamaran manual |
| Bandingkan Offer (`/offer`) | Offer Comparator |
| Alamat lain, misal `/abc` | Halaman 404 |

Di setiap halaman selalu ada: banner **Jadwal Interview Bentrok** (jika ada), **5 kartu statistik**, dan toast **Undo** (setelah menghapus).

---

## 6. Uji 10 Skenario Wajib

### Skenario 1: Fetch & Offline Error

**Langkah:**
1. Kosongkan data (bagian 4), pilih sumber **Remotive API (Live)**, tekan `F5`.
2. Perhatikan tulisan **"Memuat lowongan dari Remotive API..."** sesaat, lalu daftar lowongan tampil.
3. Buka DevTools → tab **Network** → ubah **No throttling** menjadi **Offline**.
4. Klik **Muat Ulang Data** (panel Sumber Data Lowongan).
5. Ubah kembali **Offline** menjadi **No throttling**.
6. Klik **Pakai Fallback Lokal**.

**Hasil yang diharapkan:**
- Langkah 2: status Loading lalu kartu lowongan dari Remotive (setiap kartu punya tautan **Lihat di Remotive**).
- Langkah 4: kotak merah **"Gagal memuat lowongan"** dengan pesan *"Tidak dapat terhubung ke sumber data..."* serta tombol **Coba Lagi** dan **Pakai Fallback Lokal**.
- Langkah 6: 15 lowongan dari dataset lokal tampil, dan pilihan sumber pindah ke **Dataset Magang (Lokal)**.

> Mode Offline memblokir semua request, termasuk file lokal `magang-fallback.json`. Karena itu Offline dimatikan dulu (langkah 5) sebelum menekan tombol fallback.

**Kode untuk demo:** efek fetch dengan `AbortController` di `src/App.tsx`, `src/services/jobService.ts`, tampilan Loading/Error/Kosong di `src/pages/HalamanLowongan.tsx`.

### Skenario 2: Skill Match Live

**Langkah:**
1. Pakai **Dataset Magang (Lokal)**.
2. Cari kartu **Rajawali Media - Web Developer Intern (Next.js)**. Catat badge-nya: **60% Match** (kuning), Docker bertanda merah putus-putus.
3. Di **Profil Skill Kapten**, ketik `Docker` lalu klik **Tambah**.
4. Ketik `docker` (huruf kecil) lalu klik **Tambah** lagi.

**Hasil yang diharapkan:**
- Langkah 3: badge Rajawali Media langsung menjadi **80% Match** (hijau) tanpa refresh, dan Docker berubah menjadi tag kuning. Kartu **Garuda FinTech** naik dari 20% ke 40%.
- Langkah 4: ditolak dengan pesan *"Skill "docker" sudah ada di profil."*
- Hapus skill dengan tombol **×** pada chip skill: persentase langsung turun kembali.

**Kode untuk demo:** `src/utils/skillMatch.ts` (rumus `Math.round`), `src/components/ProfilSkill.tsx` (tolak duplikat), perhitungan `lowonganDenganMatch` di `src/pages/HalamanLowongan.tsx` (derived state).

### Skenario 3: Debounce Search

**Langkah:**
1. Di kolom **Cari posisi atau perusahaan...**, ketik `garuda` dengan cepat.
2. Perhatikan teks kecil di bawah kolom pencarian.

**Hasil yang diharapkan:**
- Selama mengetik, teks menjadi **"Menunggu ketikan selesai..."** dan daftar belum berubah.
- Sekitar 400 ms setelah berhenti mengetik, daftar tersaring menjadi 1 lowongan (**Garuda FinTech**) dan teks menjadi **"Menampilkan 1 dari 15 lowongan"**.
- Hapus isi pencarian untuk menampilkan semua lagi.

**Kode untuk demo:** `src/hooks/useDebounce.ts` (`setTimeout` + cleanup `clearTimeout`), `useDebounce(keyword, 400)` di `src/pages/HalamanLowongan.tsx`.

### Skenario 4: Anti-Duplikat & Focus

**Langkah:**
1. Di kartu **Garuda FinTech - Full-Stack Web Developer Intern**, klik **Simpan ke Wishlist**.
2. Klik **+ Catat Lamaran**.
3. Isi **Perusahaan** `garuda fintech`, **Posisi / Role** `FULL-STACK WEB DEVELOPER INTERN`, **Required Skills** `React, Node.js`, lalu klik **Simpan Lamaran**.
4. Kosongkan semua kolom, pilih **Status Awal** `APPLIED`, isi hanya **Perusahaan** `Alpha Tech`, lalu klik **Simpan Lamaran**.

**Hasil yang diharapkan:**
- Langkah 1: tombol berubah menjadi **Sudah Dilamar** dan tidak bisa diklik; menu **Pipeline Lamaran** bertambah 1.
- Langkah 3: ditolak dengan pesan *"Lamaran garuda fintech - FULL-STACK WEB DEVELOPER INTERN sudah ada (tidak boleh duplikat)."* dan kursor otomatis berada di kolom **Perusahaan**.
- Langkah 4: kolom **Versi CV** dan **Tanggal Melamar** muncul karena status APPLIED; semua kolom kosong bergaris merah, dan kursor otomatis pindah ke kolom error pertama (**Posisi / Role**).

**Kode untuk demo:** `src/components/FormLamaran.tsx` (validasi, `useRef` per input, `refX.current?.focus()`), `sudahDilamar` di `src/utils/lamaran.ts`.

### Skenario 5: State Machine

**Langkah:**
1. Buka **Pipeline Lamaran**, klik **Detail** pada Garuda FinTech (status WISHLIST).
2. Lihat tombol di baris **Pindahkan status ke:**.
3. Klik **Applied** lalu **Konfirmasi ke Applied** tanpa mengisi apa pun.
4. Isi **Versi CV** dan **Tanggal Melamar**, klik **Konfirmasi ke Applied**.
5. Klik **Screening** → **Konfirmasi ke Screening**.
6. Klik **Interview**, isi **Jadwal Interview** (misal `03-12-2026 10:00`), klik **Konfirmasi ke Interview**.

**Hasil yang diharapkan:**
- Langkah 2: hanya ada tombol **Applied**. Tidak ada Offer, jadi WISHLIST tidak bisa langsung ke OFFER.
- Langkah 3: pesan *"Ke APPLIED wajib mengisi versi CV dan tanggal melamar."*
- Langkah 4 sampai 6: badge status berubah, stepper **Tahap Seleksi** bertambah oranye, dan **Riwayat Aktivitas** mencatat setiap perpindahan (misal *"Status berubah: Screening → Interview (jadwal 3 Des, 10.00)."*).
- Setelah INTERVIEW, pilihan menjadi **Offer, Rejected, Ghosted**.

**Kode untuk demo:** tabel `TRANSISI_STATUS` di `src/utils/statusLamaran.ts`, `src/components/PindahStatus.tsx` (input kondisional), `pindahStatus` di `src/App.tsx` (penjaga `bolehPindah`).

### Skenario 6: Simulasi Ghosting

**Langkah:**
1. Buat lamaran berstatus APPLIED (misal lewat **+ Catat Lamaran**: Alpha Tech, Web Intern, APPLIED, isi CV dan tanggal, skill `React`).
2. Catat angka kartu statistik **Rawan Ghosting**.
3. Di War Room, klik **Simulasi +15 Hari** pada kartu Alpha Tech.
4. Centang **Hanya Rawan Ghosting**.

**Hasil yang diharapkan:**
- Langkah 3: badge oranye **"Rawan Ghosting · 15 hari"** muncul dan kartu **Rawan Ghosting** bertambah 1.
- Langkah 4: hanya lamaran yang rawan ghosting yang tampil.
- Tombol **Simulasi +15 Hari** hanya ada pada lamaran berstatus APPLIED atau SCREENING.

**Kode untuk demo:** `rawanGhosting` dan `mundurkanHari` di `src/utils/jadwal.ts`, `simulasiGhosting` di `src/App.tsx`, `src/components/RingkasanStatistik.tsx`.

### Skenario 7: Bentrok Interview

**Langkah:**
1. Siapkan dua lamaran berstatus INTERVIEW dengan jadwal di hari yang sama berselisih 30 menit (misal 10:00 dan 10:30). Cara cepat: klik **Muat Data Contoh** (Garuda FinTech sudah INTERVIEW), lalu pindahkan **Teratai Software House** (SCREENING) ke **Interview** pada tanggal yang sama dengan jadwal Garuda, jam 30 menit setelahnya.
2. Perhatikan bagian atas halaman.
3. Ubah **Semua Status** menjadi **Wishlist**.
4. Buka halaman **Bandingkan Offer**.

**Hasil yang diharapkan:**
- Banner merah **"⚠ Jadwal Interview Bentrok"** yang menyebut kedua perusahaan beserta jadwalnya, misal *"Teratai Software House (28 Nov, 10.30) dan Garuda FinTech (28 Nov, 10.00) hanya berselisih 30 menit."*
- Banner tetap tampil walau filter status sedang Wishlist dan saat pindah halaman, karena dihitung dari seluruh data.
- Ubah jadwal salah satu menjadi selisih 60 menit atau lebih (atau pindahkan ke status lain): banner hilang.

**Kode untuk demo:** `cariBentrokInterview` di `src/utils/jadwal.ts`, `src/components/BannerBentrok.tsx`, pemanggilannya di `src/layouts/TataLetak.tsx`.

### Skenario 8: Checklist & Refresh

**Langkah:**
1. Buka **Detail** sebuah lamaran.
2. Di **Daftar Persiapan**, tambah 2 item (misal "Riset produk" dan "Latihan live coding").
3. Centang item pertama.
4. Tekan `F5`, lalu buka lagi detail lamaran yang sama.

**Hasil yang diharapkan:**
- Langkah 3: progress **1/2 selesai**, bar oranye setengah, item pertama dicoret.
- Langkah 4: semua data tetap ada (status, checklist 1/2, riwayat aktivitas, skill Kapten). Kartu War Room juga menunjukkan **1/2 selesai**.

**Kode untuk demo:** `tambahChecklist`, `centangChecklist`, `hapusChecklist` di `src/App.tsx` (update immutable bertingkat dengan `map` dan spread), `src/hooks/useLocalStorage.ts`.

### Skenario 9: Timer Cleanup

**Langkah:**
1. Buka DevTools tab **Console** dan kosongkan (ikon 🚫).
2. Buka **Detail** sebuah lamaran, di panel **Latihan Interview** klik **Start**.
3. Sebelum waktu habis, klik **Tutup ✕**.
4. Buka lagi detail lamaran itu dan klik **Start**. Hitung bersama jam: setiap detik dunia nyata, timer berkurang 1.

**Hasil yang diharapkan:**
- Saat dibuka lagi, timer kembali ke **02:00** (komponen dibuat ulang).
- Timer berkurang tepat 1 detik per detik, tidak 2 kali lebih cepat.
- Tidak ada error di Console.
- Uji tambahan: **Pause** menghentikan hitungan, **Reset** kembali ke 02:00, **Soal Berikutnya** mengganti soal (**Soal 2 / 6**) dan mengembalikan 02:00. Jika dibiarkan sampai **00:00**, angka menjadi merah, muncul *"Waktu habis!"*, dan tombol Start tidak bisa diklik.

**Kode untuk demo:** `useEffect` dengan `return () => clearInterval(idInterval)` di `src/components/LatihanInterview.tsx`.

### Skenario 10: Undo & Comparator

**Langkah (Undo):**
1. Di War Room, klik **Hapus** pada salah satu lamaran yang punya checklist/riwayat.
2. Dalam 5 detik, klik **Undo (5 detik)** pada toast hitam di pojok kanan bawah.
3. Uji timer `useRef`: hapus lamaran A, tunggu sekitar 3 detik, hapus lamaran B. Perhatikan toast.

**Hasil yang diharapkan (Undo):**
- Langkah 1: kartu hilang dan toast *"Lamaran ... dihapus."* muncul.
- Langkah 2: lamaran kembali utuh dengan checklist dan riwayat aktivitasnya.
- Langkah 3: toast berganti ke lamaran B dan tetap tampil penuh 5 detik sejak penghapusan B (tidak ikut hilang di detik ke-5 sejak penghapusan A). Hanya penghapusan terakhir yang bisa di-undo.

**Langkah (Comparator):**
4. Pindahkan 2 lamaran sampai **Offer** (WISHLIST → APPLIED → SCREENING → INTERVIEW → OFFER). Saat ke Offer, isi **Uang Saku / Bulan** (misal `6000000` dan `4500000`) dan **Mode Kerja** (misal Remote dan Hybrid). Cara cepat: **Muat Data Contoh** sudah berisi 2 OFFER.
5. Klik menu **Bandingkan Offer (2)**.
6. Ganti pilihan **Offer A** dan **Offer B**.

**Hasil yang diharapkan (Comparator):**
- Dua kolom berisi baris **Uang Saku / Bulan** (poin dari 50), **Mode Kerja** (poin dari 25), **Kecocokan Skill** (poin dari 25), dan **Total Skor Berbobot**.
- Contoh hitungan dari **Muat Data Contoh** dengan skill awal (React, TypeScript, CSS):

  | Offer | Uang saku (x 50%) | Mode kerja (x 25%) | Skill match (x 25%) | Total |
  |---|---|---|---|---|
  | Bintang Commerce | Rp 6.000.000 → 100 → **50.0** | Hybrid 75 → **18.8** | 3 dari 5 = 60% → **15.0** | **83.8** |
  | Nusantara Cloud Tech | Rp 4.500.000 → 75 → **37.5** | Remote 100 → **25.0** | 3 dari 5 = 60% → **15.0** | **77.5** |

  Normalisasi gaji memakai gaji tertinggi dari dua offer yang dibandingkan (Rp 6.000.000 = 100).
- Kolom dengan total lebih tinggi bergaris oranye tebal dan memiliki badge **★ Rekomendasi Terbaik**.
- Pilihan Offer B tidak pernah sama dengan Offer A.
- Jika OFFER kurang dari 2, halaman menampilkan *"Belum bisa membandingkan offer."*

**Kode untuk demo:** `hapusLamaran` / `batalkanHapus` dan `timerUndoRef` di `src/App.tsx`, `src/components/ToastUndo.tsx`, `src/utils/offer.ts`, `src/pages/HalamanOffer.tsx`.

---

## 7. Uji Tambahan per Fitur

| No | Fitur | Langkah | Hasil yang diharapkan |
|---|---|---|---|
| T1 | Filter kategori | Pilih kategori **QA** di Eksplorasi | Hanya Teratai Software House (dataset lokal) |
| T2 | Urutan lowongan | Ganti **Skill Match Tertinggi** ↔ **Urutan Bawaan** | Urutan berubah; mode Skill Match menaruh persentase tertinggi di atas |
| T3 | State kosong lowongan | Cari `zzz` | *"Tidak ada lowongan yang bisa ditampilkan."* + tombol **Reset Pencarian** |
| T4 | Skill kosong | Klik **Tambah** di Profil Skill tanpa isi | *"Nama skill tidak boleh kosong."* |
| T5 | Mode kerja dari lokasi | Simpan lowongan lokasi `(Onsite)` lalu buka detailnya | Mode kerja **Onsite** |
| T6 | Form sukses | Isi form lengkap dengan status WISHLIST | Pindah otomatis ke War Room, lamaran baru di paling atas, log *"Lamaran dibuat dari form manual..."* |
| T7 | Pencarian War Room | Ketik nama perusahaan di **Cari perusahaan atau posisi...** | Daftar tersaring tanpa jeda |
| T8 | Sorting War Room | Pilih **Jadwal Interview Terdekat** lalu **Offer Tertinggi** | INTERVIEW terdekat di atas; lalu offer dengan uang saku terbesar di atas |
| T9 | Filter kosong | Kombinasi filter tanpa hasil | *"Tidak ada lamaran yang cocok dengan filter."* + **Reset Filter** |
| T10 | Syarat ke INTERVIEW | Pilih **Interview** tanpa jadwal → Konfirmasi | *"Ke INTERVIEW wajib mengisi jadwal interview."* |
| T11 | Syarat ke OFFER | Pilih **Offer** dengan uang saku `0` → Konfirmasi | *"Ke OFFER wajib mengisi uang saku lebih dari 0."* |
| T12 | GHOSTED kembali | Pindahkan lamaran ke **Ghosted**, buka lagi pilihannya | Hanya ada **Screening** |
| T13 | Status final | Buka detail lamaran OFFER atau REJECTED | *"Status ... bersifat final dan tidak bisa dipindah lagi."* |
| T14 | Hapus checklist | Klik **×** pada item checklist | Item hilang, progress ikut berubah |
| T15 | Catatan manual | Tulis catatan di **Riwayat Aktivitas** → **Catat** | Muncul paling atas dengan awalan *"Catatan:"* |
| T16 | Hapus dari modal | Klik **Hapus** di header modal detail | Modal tertutup otomatis dan toast Undo muncul |
| T17 | Statistik | Ubah status beberapa lamaran | Response Rate, Interview Rate, Total Offer langsung berubah |
| T18 | Halaman 404 | Buka `http://localhost:5173/abc` | *"Halaman tidak ditemukan"* + tautan kembali |
| T19 | Responsif | DevTools → ikon perangkat (`Ctrl+Shift+M`) → lebar 390 px | Tata letak menjadi satu kolom tanpa scroll horizontal |
| T20 | Menu aktif | Buka setiap menu | Menu aktif berlatar kuning; **Pipeline Lamaran** tidak ikut aktif di halaman **+ Catat Lamaran** |

## 8. Uji Fitur Bonus

| Bonus | Langkah | Hasil yang diharapkan |
|---|---|---|
| Shortcut `/` | Di Eksplorasi Lowongan, klik area kosong lalu tekan `/` | Kursor pindah ke kolom pencarian; karakter `/` tidak ikut terketik. Saat sedang mengetik di input lain, `/` tetap bisa diketik biasa |
| Muat Data Contoh | Kosongkan data, buka War Room, klik **Muat Data Contoh** | 7 lamaran tampil (1 WISHLIST, 1 APPLIED, 1 SCREENING, 1 INTERVIEW, 2 OFFER, 1 REJECTED); tidak ada banner bentrok dan tidak ada yang rawan ghosting |
| Ekspor JSON | Klik **Ekspor JSON** | File `aku-mw-magang-YYYY-MM-DD.json` terunduh berisi `kaptenSkills` dan `applications` |
| Impor JSON | Kosongkan data, klik **Impor JSON**, pilih file hasil ekspor, setujui konfirmasi | Semua lamaran dan skill kembali; pesan *"N lamaran berhasil diimpor."* |
| Impor file salah | Impor file teks yang bukan JSON | Pesan *"File bukan JSON yang valid."* dan data tidak berubah |
| Tema Gelap | Pilih **Tema: Gelap** di header | Seluruh halaman berganti ke latar arang dengan aksen emas dan oranye; kalender input tanggal ikut gelap |
| Tema Baja | Pilih **Tema: Baja** di header | Halaman tetap putih dengan garis dan aksen abu-abu baja; badge Match tetap hijau/kuning/merah |
| Tema tersimpan | Pilih tema Gelap lalu tekan `F5` | Halaman langsung tampil gelap tanpa berkedip putih; pilihan tema tetap **Gelap** |
| Tema di semua halaman | Buka setiap menu, modal detail, dan toast Undo dengan tiap tema | Semua teks tetap terbaca; tombol kuning berteks gelap, tombol pekat berteks terang |

## 9. Checklist Cepat Sebelum Demo

- [ ] `npm install` sudah dijalankan; `npm run cek-tipe`, `npm run build`, `npm run lint` bersih.
- [ ] `npm run dev` berjalan dan halaman terbuka di `http://localhost:5173`.
- [ ] Data sudah dikosongkan, atau sengaja diisi dengan **Muat Data Contoh** sesuai urutan demo.
- [ ] DevTools siap di tab **Network** (untuk Offline) dan **Console** (untuk Skenario 9).
- [ ] Setiap anggota tahu file yang menjadi bagiannya (lihat kolom "Kode untuk demo" di bagian 6 dan tabel Peta Fitur di `README.md`).
- [ ] Remotive tidak dipanggil berulang kali sebelum demo (disarankan maksimal sekitar 4 kali sehari); untuk latihan, pakai **Dataset Magang (Lokal)**.

## 10. Mengatasi Masalah

| Gejala | Penyebab | Solusi |
|---|---|---|
| `npm run dev` gagal karena port 5173 terpakai | Server lain masih berjalan | Hentikan server lama (`Ctrl+C`) atau pakai alamat port yang ditampilkan Vite |
| Remotive selalu error walau online | Request terlalu sering diblokir Remotive, atau jaringan kampus memblokir | Klik **Pakai Fallback Lokal**; coba Remotive lagi nanti |
| Font terlihat berbeda | Google Fonts tidak termuat (offline) | Normal; aplikasi memakai font sistem sebagai cadangan |
| Error `crypto.randomUUID is not a function` | Aplikasi dibuka lewat alamat IP jaringan (`http://192.168...`), bukan `localhost` | Buka lewat `http://localhost:5173` |
| Data lama mengganggu pengujian | localStorage masih berisi data sebelumnya | Kosongkan data (bagian 4) |
| Efek terlihat berjalan dua kali di mode dev | Perilaku normal `<StrictMode>` | Bandingkan dengan `npm run preview` (efek berjalan sekali) |
| Pilihan dropdown tersorot biru, bukan kuning | Browser belum mendukung CSS `appearance: base-select` (misal Firefox) | Normal; fungsi tetap sama. Pakai Chrome, Edge, atau Brave untuk tampilan sesuai tema |
