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
        <span className="text-xs font-extrabold uppercase tracking-wider text-[#FA6400] block mb-1">
          Organization / Visi &amp; Misi
        </span>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-[#1E2330]">
          Visi &amp; Misi Lembaga
        </h1>
        <p className="text-xs sm:text-sm text-stone-500 mt-1">
          Kelola visi jangka panjang dan butir-butir misi strategis penyelenggaraan pendidikan Yazzakka.
        </p>
      </div>

      {/* Vision */}
      <form onSubmit={handleSaveVision} className="bg-white rounded-3xl p-6 sm:p-8 border border-[#E8E2D8] shadow-xs space-y-4">
        <div className="flex items-center gap-2 text-[#FA6400] font-extrabold text-sm uppercase tracking-wide">
          <Compass className="h-4 w-4" />
          <span>Visi Lembaga</span>
        </div>
        <Textarea
          rows={3}
          value={vision}
          onChange={(e) => setVision(e.target.value)}
        />
        <div className="flex justify-end pt-2">
          <Button type="submit" variant="default" size="sm" className="font-bold rounded-full px-5 shadow-xs">
            <Save className="h-4 w-4" />
            Simpan Visi
          </Button>
        </div>
      </form>

      {/* Mission List */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#E8E2D8] shadow-xs space-y-6">
        <div className="flex items-center gap-2 text-[#FA6400] font-extrabold text-sm uppercase tracking-wide">
          <Target className="h-4 w-4" />
          <span>Butir-Butir Misi Strategis</span>
        </div>

        <div className="space-y-3">
          {missionList.map((item, idx) => (
            <div
              key={idx}
              className="flex items-start justify-between gap-3 p-4 rounded-2xl bg-[#FAF6EE] border border-[#E8E2D8] text-xs sm:text-sm text-[#1E2330] font-medium"
            >
              <div className="flex items-start gap-3">
                <span className="h-6 w-6 rounded-full bg-[#FA6400] text-white text-xs font-bold flex items-center justify-center shrink-0 mt-0.5 shadow-2xs">
                  {idx + 1}
                </span>
                <span className="leading-relaxed">{item}</span>
              </div>
              <button
                onClick={() => handleDeleteMission(idx)}
                className="p-1 text-rose-500 hover:text-rose-700 hover:bg-rose-50 rounded-lg shrink-0 transition-colors cursor-pointer"
                title="Hapus Butir Misi"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>

        <form onSubmit={handleAddMission} className="pt-4 border-t border-[#E8E2D8] flex gap-3">
          <input
            type="text"
            placeholder="Tambahkan butir misi baru..."
            value={newMissionItem}
            onChange={(e) => setNewMissionItem(e.target.value)}
            className="flex-1 h-11 rounded-xl border border-[#E8E2D8] px-4 text-xs sm:text-sm bg-white text-[#1E2330] placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-[#FA6400]"
          />
          <Button type="submit" variant="default" size="default" className="shrink-0 font-bold h-11 px-6 shadow-sm">
            <Plus className="h-4 w-4" />
            Tambah
          </Button>
        </form>
      </div>
    </div>
  );
}
