import { Public_Sans } from "next/font/google";

// Font panel CMS — hanya dipakai elemen .admin-scope (admin layout & login).
// Dimuat di sini, bukan root layout, agar pengunjung situs publik tidak
// mengunduh font yang tidak pernah dirender di jalur publik.
export const publicSans = Public_Sans({
  subsets: ["latin"],
  variable: "--font-public-sans",
});
