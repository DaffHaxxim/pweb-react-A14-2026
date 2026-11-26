// Tipe data lowongan (JobListing) sesuai format Remotive dan magang-fallback.json.
// Nama field memakai format snake_case karena mengikuti data dari API.
export interface JobListing {
  id: number;
  title: string;
  company_name: string;
  category: string;
  candidate_required_location: string;
  salary: string;
  tags: string[];
  url?: string; // hanya ada di data Remotive (tautan balik ke Remotive)
}

// Bentuk respons API Remotive (dan file fallback lokal yang dibuat sama)
export interface ResponsLowongan {
  jobs: JobListing[];
}

// Pilihan sumber data lowongan
export type SumberData = "remotive" | "lokal";
