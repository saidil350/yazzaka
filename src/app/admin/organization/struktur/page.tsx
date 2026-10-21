"use client";

import React from "react";
import { useSchoolData } from "@/context/SchoolDataContext";
import { Building2, GraduationCap } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function AdminOrgStructurePage() {
  const { profile, organization } = useSchoolData();

  // Dapatkan daftar seluruh unit/departemen unik yang ada
  const departments = Array.from(
    new Set(organization.map((o) => o.department).filter(Boolean))
  );

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-12">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground block mb-1">
            Organization / Struktur Organisasi
          </span>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
            Struktur Kepengurusan &amp; Hierarki Organisasi
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground mt-1">
            Bagan struktur pimpinan dan dewan pengajar per unit pendidikan di lingkungan {profile.name}.
          </p>
        </div>

        <Link href="/admin/organization/tim">
          <Button size="sm">
            <GraduationCap className="h-4 w-4 mr-1.5" />
            <span>Kelola Daftar Pengajar</span>
          </Button>
        </Link>
      </div>

      <div className="space-y-6">
        {departments.length === 0 ? (
          <Card className="p-8 text-center space-y-2">
            <p className="font-semibold text-sm text-foreground">Belum ada data pengajar per unit.</p>
            <p className="text-xs text-muted-foreground">Silakan tambahkan data pimpinan dan pengajar melalui menu Tim &amp; Asatidz.</p>
          </Card>
        ) : (
          departments.map((dept, idx) => {
            const members = organization.filter((o) => o.department === dept);
            return (
              <Card
                key={dept}
                className="p-6 space-y-5"
              >
                <div className="flex items-center justify-between gap-2 pb-3 border-b border-border">
                  <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-md bg-primary text-primary-foreground text-xs uppercase tracking-wider">
                    <Building2 className="h-3.5 w-3.5" />
                    <span>{dept}</span>
                  </div>
                  <Badge variant="secondary">
                    {members.length} Anggota / Pendidik
                  </Badge>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {members.map((m) => (
                    <div
                      key={m.id}
                      className="p-4 rounded-lg bg-muted border border-border flex items-center gap-3.5"
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={m.photoUrl}
                        alt={m.name}
                        className="h-12 w-12 rounded-full object-cover border border-border shrink-0"
                      />
                      <div className="min-w-0">
                        <h4 className="font-semibold text-sm text-foreground truncate">{m.name}</h4>
                        <p className="text-xs text-primary truncate">{m.roleTitle}</p>
                        {m.qualifications && (
                          <p className="text-[10px] text-muted-foreground italic truncate">{m.qualifications}</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            );
          })
        )}
      </div>
    </div>
  );
}
