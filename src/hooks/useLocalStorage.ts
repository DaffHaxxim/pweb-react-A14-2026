import { useEffect, useState } from "react";

// Custom Hook: seperti useState, tetapi nilainya otomatis disimpan ke localStorage
// sehingga tidak hilang saat halaman di-refresh.
// <T> (generic) membuat hook ini bisa dipakai untuk tipe apa pun: string[], Application[], dll.
export function useLocalStorage<T>(key: string, initialValue: T) {
  // Fungsi di dalam useState hanya dijalankan sekali saat komponen pertama kali muncul
  const [value, setValue] = useState<T>(() => {
    try {
      const saved = localStorage.getItem(key);
      return saved ? (JSON.parse(saved) as T) : initialValue;
    } catch {
      // Data rusak / bukan JSON: kembali ke nilai awal
      return initialValue;
    }
  });

  // Setiap kali value berubah, tulis ulang ke localStorage
  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(value));
  }, [key, value]);

  // "as const" agar tipe hasilnya tetap [T, fungsiPengubah], sama seperti useState
  return [value, setValue] as const;
}
