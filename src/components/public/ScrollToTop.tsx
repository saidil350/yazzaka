"use client";

import React, { useState, useEffect } from "react";
import { ArrowUp } from "lucide-react";

export function ScrollToTop() {
  const [isVisible, setIsVisible] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (totalHeight > 0) {
        const progress = Math.min(100, Math.max(0, (window.scrollY / totalHeight) * 100));
        setScrollProgress(progress);
      }
      setIsVisible(window.scrollY > 300);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  if (!isVisible) return null;

  // Ukuran lingkaran indikator SVG
  const radius = 18;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (scrollProgress / 100) * circumference;

  return (
    <div className="fixed bottom-6 right-6 z-40 print:hidden animate-fade-in">
      <button
        type="button"
        onClick={scrollToTop}
        aria-label="Kembali ke atas halaman"
        title="Kembali ke atas"
        className="relative group h-12 w-12 rounded-full bg-[#1E2330] text-white flex items-center justify-center shadow-lg hover:shadow-xl hover:bg-[#FA6400] transition-all duration-300 active:scale-95 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#FA6400] focus-visible:ring-offset-2"
      >
        {/* Circular Progress Ring */}
        <svg
          className="absolute inset-0 h-12 w-12 -rotate-90 pointer-events-none"
          viewBox="0 0 44 44"
        >
          <circle
            cx="22"
            cy="22"
            r={radius}
            className="text-white/20 stroke-current"
            strokeWidth="2.5"
            fill="transparent"
          />
          <circle
            cx="22"
            cy="22"
            r={radius}
            className="text-[#FA6400] group-hover:text-white stroke-current transition-all duration-150"
            strokeWidth="2.5"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            fill="transparent"
          />
        </svg>

        {/* Icon with subtle bounce on hover */}
        <ArrowUp className="h-5 w-5 group-hover:-translate-y-0.5 transition-transform duration-200" />
      </button>
    </div>
  );
}
