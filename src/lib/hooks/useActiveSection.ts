"use client";

import { useState, useEffect, useCallback } from "react";

/**
 * Hook untuk memantau seksi yang sedang aktif di viewport menggunakan IntersectionObserver
 * dan menyediakan fungsi jump-scroll dengan offset header.
 */
export function useActiveSection(sectionIds: string[], offset: number = 90) {
  const [activeSection, setActiveSection] = useState<string>(sectionIds[0] || "");

  useEffect(() => {
    if (typeof window === "undefined" || sectionIds.length === 0) return;

    const observers: IntersectionObserver[] = [];
    const visibleSections = new Map<string, number>();

    const observerCallback: IntersectionObserverCallback = (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          visibleSections.set(entry.target.id, entry.intersectionRatio);
        } else {
          visibleSections.delete(entry.target.id);
        }
      });

      // Cari seksi dengan rasio tampilan tertinggi
      let maxRatio = 0;
      let topSection = "";
      visibleSections.forEach((ratio, id) => {
        if (ratio > maxRatio) {
          maxRatio = ratio;
          topSection = id;
        }
      });

      if (topSection) {
        setActiveSection(topSection);
      }
    };

    const observerOptions: IntersectionObserverInit = {
      root: null,
      rootMargin: `-${offset}px 0px -40% 0px`,
      threshold: [0.1, 0.3, 0.6, 0.9],
    };

    const observer = new IntersectionObserver(observerCallback, observerOptions);

    sectionIds.forEach((id) => {
      const el = document.getElementById(id);
      if (el) {
        observer.observe(el);
      }
    });

    return () => {
      observer.disconnect();
    };
  }, [sectionIds, offset]);

  // Fungsi helper untuk melakukan scrolling halus dengan offset navbar yang presisi
  const scrollToSection = useCallback(
    (sectionId: string) => {
      if (typeof window === "undefined") return;
      const el = document.getElementById(sectionId);
      if (el) {
        const elementPosition = el.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - offset;

        window.scrollTo({
          top: offsetPosition,
          behavior: "smooth",
        });
      }
    },
    [offset]
  );

  return { activeSection, scrollToSection };
}
