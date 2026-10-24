"use client";

import React from "react";
import { useSchoolData } from "@/context/SchoolDataContext";
import { MessageSquareHeart, Star, Quote, MessageSquare, User } from "lucide-react";
import { EmptyState } from "@/components/ui/empty-state";
import { Badge } from "@/components/ui/badge";

export function TestimonialsSection() {
  const { testimonials, profile } = useSchoolData();

  return (
    <section id="testimoni" className="py-14 lg:py-16 border-b border-border scroll-mt-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">

        {/* Section Header */}
        <div className="max-w-3xl space-y-2">
          <Badge variant="secondary" className="gap-2">
            <MessageSquareHeart className="h-3.5 w-3.5 text-yazzaka-orange" />
            <span>Kisah Nyata &amp; Pengalaman</span>
          </Badge>
          <h2 className="text-2xl sm:text-3xl lg:text-3xl font-extrabold text-[#1E2330] tracking-tight leading-tight">
            Kesan Hangat Wali Santri &amp; Alumni
          </h2>
          <p className="text-stone-600 text-sm sm:text-base leading-relaxed">
            Refleksi nyata keluarga besar {profile.name} tentang pertumbuhan adab, kemandirian karakter, dan daya saing akademik santri.
          </p>
        </div>

        {/* Testimonials 3-Column Grid or EmptyState */}
        {testimonials.length === 0 ? (
          <EmptyState
            icon={MessageSquare}
            title="Belum Ada Testimoni"
            description="Kesan dan pengalaman dari wali santri serta alumni akan segera ditampilkan di sini."
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((test) => {
              return (
                <div
                  key={test.id}
                  className="bg-white border-2 border-[#E8E2D8] rounded-3xl p-5 sm:p-6 flex flex-col justify-between shadow-xs hover:shadow-md hover:-translate-y-0.5 transition-all duration-200"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <Badge variant="secondary">
                        {test.role}
                      </Badge>
                      <div className="flex items-center gap-0.5 text-amber-500">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className="h-3 w-3 fill-amber-400 text-amber-400" />
                        ))}
                      </div>
                    </div>

                    <Quote className="h-6 w-6 text-stone-300" />

                    <p className="text-stone-800 text-xs sm:text-sm leading-relaxed italic font-medium">
                      &ldquo;{test.quote}&rdquo;
                    </p>
                  </div>

                  <div className="pt-3.5 mt-3 border-t border-black/10 flex items-center gap-3">
                    {test.photoUrl ? (
                      /* eslint-disable-next-line @next/next/no-img-element */
                      <img
                        src={test.photoUrl}
                        alt={test.name}
                        className="h-10 w-10 rounded-full object-cover border-2 border-white shadow-xs shrink-0"
                      />
                    ) : (
                      <div className="h-10 w-10 rounded-full bg-muted border-2 border-white shadow-xs shrink-0 flex items-center justify-center text-muted-foreground">
                        <User className="h-4 w-4" />
                      </div>
                    )}
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
        )}

      </div>
    </section>
  );
}
