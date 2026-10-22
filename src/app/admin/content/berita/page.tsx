import { redirect } from "next/navigation";

/**
 * Modul berita pindah ke /admin/berita (dengan halaman editor khusus).
 * Rute lama dialihkan agar tautan/bookmark lama tetap berfungsi.
 */
export default function ContentBeritaRedirect() {
  redirect("/admin/berita");
}
