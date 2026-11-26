import { useEffect, useState } from "react";

// Custom Hook: mengembalikan "value" yang baru diperbarui setelah pengguna
// berhenti mengubahnya selama "delay" milidetik (misal 400 ms saat mengetik).
export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    // Jadwalkan pembaruan setelah jeda
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    // Cleanup: jika value berubah lagi sebelum jeda habis, timer lama dibatalkan.
    // Inilah yang membuat filter baru berjalan setelah pengguna berhenti mengetik.
    return () => clearTimeout(timer);
  }, [value, delay]);

  return debouncedValue;
}
