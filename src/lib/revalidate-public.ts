import { revalidatePath } from "next/cache";

/**
 * Membatalkan cache ISR seluruh halaman publik setelah mutasi konten dari
 * panel CMS (profil, koleksi, media, settings). Dipanggil di route handler
 * SETELAH tulis DB sukses — pola sama dengan api/sections & api/programs.
 * Layout (public) membaca DB via React cache per-request, jadi satu panggilan
 * ini cukup agar beranda + semua halaman publik render ulang pada request
 * berikutnya.
 */
export function revalidatePublicPages() {
  revalidatePath("/", "layout");
}
