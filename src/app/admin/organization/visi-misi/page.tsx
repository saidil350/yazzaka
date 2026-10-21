"use client";

import React, { useState } from "react";
import { useSchoolData } from "@/context/SchoolDataContext";
import { useToast } from "@/components/ui/toast";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Save, Plus, Trash2, Compass, Target } from "lucide-react";

export default function AdminVisionMissionPage() {
  const { profile, updateProfile } = useSchoolData();
  const { toast } = useToast();

  const [vision, setVision] = useState(profile.vision);
  const [missionList, setMissionList] = useState<string[]>(profile.mission);
  const [newMissionItem, setNewMissionItem] = useState("");

  const handleSaveVision = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile({ vision });
    toast("Pernyataan visi berhasil diperbarui!", "success");
  };

  const handleAddMission = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMissionItem.trim()) return;
    const updated = [...missionList, newMissionItem.trim()];
    setMissionList(updated);
    updateProfile({ mission: updated });
    setNewMissionItem("");
    toast("Butir misi berhasil ditambahkan!", "success");
  };

  const handleDeleteMission = (index: number) => {
    const updated = missionList.filter((_, i) => i !== index);
    setMissionList(updated);
    updateProfile({ mission: updated });
    toast("Butir misi dihapus.", "info");
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div>
        <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground block mb-1">
          Organization / Visi &amp; Misi
        </span>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
          Visi &amp; Misi Lembaga
        </h1>
        <p className="text-xs sm:text-sm text-muted-foreground mt-1">
          Kelola visi jangka panjang dan butir-butir misi strategis penyelenggaraan pendidikan Yazzakka.
        </p>
      </div>

      {/* Vision */}
      <Card className="p-6">
        <form onSubmit={handleSaveVision} className="space-y-4">
          <div className="flex items-center gap-2 font-semibold text-sm uppercase tracking-wide text-foreground">
            <Compass className="h-4 w-4 text-primary" />
            <span>Visi Lembaga</span>
          </div>
          <Textarea
            rows={3}
            value={vision}
            onChange={(e) => setVision(e.target.value)}
          />
          <div className="flex justify-end pt-2">
            <Button type="submit" size="sm">
              <Save className="h-4 w-4" />
              Simpan Visi
            </Button>
          </div>
        </form>
      </Card>

      {/* Mission List */}
      <Card className="p-6 space-y-6">
        <div className="flex items-center gap-2 font-semibold text-sm uppercase tracking-wide text-foreground">
          <Target className="h-4 w-4 text-primary" />
          <span>Butir-Butir Misi Strategis</span>
        </div>

        <div className="space-y-3">
          {missionList.map((item, idx) => (
            <div
              key={idx}
              className="flex items-start justify-between gap-3 p-4 rounded-lg bg-muted border border-border text-xs sm:text-sm text-foreground font-medium"
            >
              <div className="flex items-start gap-3">
                <span className="h-6 w-6 rounded-full bg-primary text-primary-foreground text-xs flex items-center justify-center shrink-0 mt-0.5">
                  {idx + 1}
                </span>
                <span className="leading-relaxed">{item}</span>
              </div>
              <Button
                variant="ghost"
                size="icon-sm"
                onClick={() => handleDeleteMission(idx)}
                className="text-destructive hover:text-destructive"
                title="Hapus Butir Misi"
                aria-label="Hapus Butir Misi"
              >
                <Trash2 className="h-4 w-4" aria-hidden="true" />
              </Button>
            </div>
          ))}
        </div>

        <form onSubmit={handleAddMission} className="pt-4 border-t border-border flex gap-3">
          <Input
            type="text"
            placeholder="Tambahkan butir misi baru..."
            value={newMissionItem}
            onChange={(e) => setNewMissionItem(e.target.value)}
            className="flex-1"
          />
          <Button type="submit" className="shrink-0">
            <Plus className="h-4 w-4" />
            Tambah
          </Button>
        </form>
      </Card>
    </div>
  );
}
