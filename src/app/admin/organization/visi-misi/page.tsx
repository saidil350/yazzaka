"use client";

import React, { useState } from "react";
import { useSchoolData } from "@/context/SchoolDataContext";
import { useToast } from "@/components/ui/toast";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Save, Plus, Trash2, Compass, Target, Sparkles } from "lucide-react";

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
        <span className="text-xs font-bold uppercase tracking-wider text-amber-700 block mb-1">
          Organization / Visi & Misi
        </span>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-[var(--color-primary)]">
          Visi & Misi Lembaga
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Kelola visi jangka panjang dan butir-butir misi strategis penyelenggaraan pendidikan Yazzakka.
        </p>
      </div>

      {/* Vision */}
      <form onSubmit={handleSaveVision} className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-4">
        <div className="flex items-center gap-2 text-[var(--color-primary)] font-bold text-sm uppercase">
          <Compass className="h-4 w-4 text-amber-600" />
          <span>Visi Lembaga</span>
        </div>
        <Textarea
          rows={3}
          value={vision}
          onChange={(e) => setVision(e.target.value)}
        />
        <div className="flex justify-end pt-2">
          <Button type="submit" variant="accent" size="sm">
            <Save className="h-4 w-4" />
            Simpan Visi
          </Button>
        </div>
      </form>

      {/* Mission List */}
      <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-6">
        <div className="flex items-center gap-2 text-[var(--color-primary)] font-bold text-sm uppercase">
          <Target className="h-4 w-4 text-amber-600" />
          <span>Butir-Butir Misi Strategis</span>
        </div>

        <div className="space-y-3">
          {missionList.map((item, idx) => (
            <div
              key={idx}
              className="flex items-start justify-between gap-3 p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs sm:text-sm text-slate-700 font-medium"
            >
              <div className="flex items-start gap-2.5">
                <span className="h-5 w-5 rounded-full bg-[var(--color-primary)] text-white text-[11px] font-bold flex items-center justify-center shrink-0 mt-0.5">
                  {idx + 1}
                </span>
                <span>{item}</span>
              </div>
              <button
                onClick={() => handleDeleteMission(idx)}
                className="p-1 text-rose-500 hover:text-rose-700 shrink-0"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>

        <form onSubmit={handleAddMission} className="pt-4 border-t border-slate-100 flex gap-3">
          <input
            type="text"
            placeholder="Tambahkan butir misi baru..."
            value={newMissionItem}
            onChange={(e) => setNewMissionItem(e.target.value)}
            className="flex-1 h-10 rounded-md border border-slate-300 px-3 text-xs sm:text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
          />
          <Button type="submit" variant="accent" size="default" className="shrink-0">
            <Plus className="h-4 w-4" />
            Tambah
          </Button>
        </form>
      </div>
    </div>
  );
}
