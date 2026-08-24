"use client";

import React from "react";
import { useSchoolData } from "@/context/SchoolDataContext";
import { MessageSquareHeart, Star, Quote } from "lucide-react";

export function TestimonialsSection() {
  const { testimonials } = useSchoolData();

  const cardTints = [
    { bg: "bg-[#FFF0E5]", border: "border-[#FED7AA]", quote: "text-[#FA6400]/40", badge: "bg-[#FA6400] text-white" },
    { bg: "bg-[#EDE9FE]", border: "border-[#DDD6FE]", quote: "text-[#7C3AED]/40", badge: "bg-[#7C3AED] text-white" },
    { bg: "bg-[#DCFCE7]", border: "border-[#BBF7D0]", quote: "text-[#16A34A]/40", badge: "bg-[#16A34A] text-white" },
  ];

  return (
    <section className="py-14 lg:py-16 bg-[#FAF6EE] border-b border-[#E8E2D8]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">

        {/* Section Header */}
        <div className="max-w-3xl space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FFF0E5] border border-[#FED7AA] text-[#C2410C] font-bold text-xs">
            <MessageSquareHeart className="h-3.5 w-3.5 text-[#FA6400]" />
            <span>Kisah Nyata &amp; Pengalaman</span>
          </div>
          <h2 className="text-2xl sm:text-3xl lg:text-3xl font-extrabold text-[#1E2330] tracking-tight leading-tight">
            Kesan Hangat Wali Santri &amp; Alumni
          </h2>
          <p className="text-stone-600 text-sm sm:text-base leading-relaxed">
            Refleksi nyata keluarga besar Yazzaka tentang pertumbuhan adab, kemandirian karakter, dan daya saing akademik santri.
          </p>
        </div>

        {/* Testimonials 3-Column Thought Bubble Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((test, idx) => {
            const tint = cardTints[idx % cardTints.length];
            return (
              <div
                key={test.id}
                className={`${tint.bg} ${tint.border} border-2 rounded-3xl p-5 sm:p-6 flex flex-col justify-between shadow-xs hover:shadow-md hover:-translate-y-0.5 transition-all duration-200`}
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className={`px-2.5 py-0.5 rounded-full ${tint.badge} text-[10px] font-bold shadow-xs`}>
                      {test.role}
                    </span>
                    <div className="flex items-center gap-0.5 text-amber-500">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="h-3 w-3 fill-amber-400 text-amber-400" />
                      ))}
                    </div>
                  </div>

                  <Quote className={`h-6 w-6 ${tint.quote}`} />

                  <p className="text-stone-800 text-xs sm:text-sm leading-relaxed italic font-medium">
                    &ldquo;{test.quote}&rdquo;
                  </p>
                </div>

                <div className="pt-3.5 mt-3 border-t border-black/10 flex items-center gap-3">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={test.photoUrl}
                    alt={test.name}
                    className="h-10 w-10 rounded-full object-cover border-2 border-white shadow-xs shrink-0"
                  />
                  <div>
                    <h4 className="font-bold text-xs sm:text-sm text-[#1E2330]">
                      {test.name}
                    </h4>
                    <p className="text-[11px] text-stone-600 font-medium">
                      {test.childName || (test.graduationYear ? `Alumni Angkatan ${test.graduationYear}` : "")}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
