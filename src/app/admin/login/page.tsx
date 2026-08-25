"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function AdminLoginRedirectPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/login");
  }, [router]);

  return (
    <div className="h-screen w-screen flex flex-col items-center justify-center bg-[#FCF8F1] text-[#1E2330] gap-3">
      <div className="h-7 w-7 rounded-full border-2 border-[#FA6400] border-t-transparent animate-spin" />
      <p className="text-xs font-semibold text-stone-500">Mengalihkan ke halaman login...</p>
    </div>
  );
}
