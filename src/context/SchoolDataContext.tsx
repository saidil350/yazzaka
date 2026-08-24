"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import {
  SchoolProfile,
  Program,
  Facility,
  Achievement,
  Article,
  SchoolEvent,
  MediaItem,
  OrganizationMember,
  Testimonial,
  AdmissionInfo,
  ContactMessage,
  WebsiteSettings,
  User,
  PageSectionConfig,
  ActivityLog,
} from "@/lib/types";
import {
  initialSchoolProfile,
  initialPrograms,
  initialFacilities,
  initialAchievements,
  initialArticles,
  initialEvents,
  initialMedia,
  initialOrganization,
  initialTestimonials,
  initialAdmissionInfo,
  initialContactMessages,
  initialWebsiteSettings,
  initialUsers,
  initialSections,
} from "@/lib/data/initialData";
import { generateId } from "@/lib/utils";

interface SchoolDataContextType {
  profile: SchoolProfile;
  programs: Program[];
  facilities: Facility[];
  achievements: Achievement[];
  articles: Article[];
  events: SchoolEvent[];
  media: MediaItem[];
  organization: OrganizationMember[];
  testimonials: Testimonial[];
  admission: AdmissionInfo;
  messages: ContactMessage[];
  settings: WebsiteSettings;
  users: User[];
  sections: PageSectionConfig[];
  logs: ActivityLog[];

  // Actions
  updateProfile: (data: Partial<SchoolProfile>) => void;
  updateBrandingColors: (primary: string, accent: string) => void;
  
  // Programs
  addProgram: (program: Omit<Program, "id">) => void;
  updateProgram: (id: string, program: Partial<Program>) => void;
  deleteProgram: (id: string) => void;

  // Facilities
  addFacility: (facility: Omit<Facility, "id">) => void;
  updateFacility: (id: string, facility: Partial<Facility>) => void;
  deleteFacility: (id: string) => void;

  // Achievements
  addAchievement: (achievement: Omit<Achievement, "id">) => void;
  updateAchievement: (id: string, achievement: Partial<Achievement>) => void;
  deleteAchievement: (id: string) => void;

  // Articles
  addArticle: (article: Omit<Article, "id">) => void;
  updateArticle: (id: string, article: Partial<Article>) => void;
  deleteArticle: (id: string) => void;

  // Events
  addEvent: (event: Omit<SchoolEvent, "id">) => void;
  updateEvent: (id: string, event: Partial<SchoolEvent>) => void;
  deleteEvent: (id: string) => void;

  // Media
  addMedia: (mediaItem: Omit<MediaItem, "id" | "uploadedAt">) => void;
  deleteMedia: (id: string) => void;

  // Organization
  addMember: (member: Omit<OrganizationMember, "id">) => void;
  updateMember: (id: string, member: Partial<OrganizationMember>) => void;
  deleteMember: (id: string) => void;

  // Testimonials
  addTestimonial: (testimonial: Omit<Testimonial, "id">) => void;
  updateTestimonial: (id: string, testimonial: Partial<Testimonial>) => void;
  deleteTestimonial: (id: string) => void;

  // Admission & Settings
  updateAdmission: (data: Partial<AdmissionInfo>) => void;
  updateSettings: (data: Partial<WebsiteSettings>) => void;

  // Messages
  addContactMessage: (msg: Omit<ContactMessage, "id" | "submittedAt" | "status">) => void;
  updateMessageStatus: (id: string, status: ContactMessage["status"]) => void;
  deleteMessage: (id: string) => void;

  // Homepage Sections
  toggleSection: (id: string) => void;
  reorderSections: (newSections: PageSectionConfig[]) => void;

  // Reset to initial
  resetToDefault: () => void;
}

const SchoolDataContext = createContext<SchoolDataContextType | undefined>(undefined);

const STORAGE_KEY = "yazzaka_school_data_v1";

export function SchoolDataProvider({ children }: { children: React.ReactNode }) {
  const [profile, setProfile] = useState<SchoolProfile>(initialSchoolProfile);
  const [programs, setPrograms] = useState<Program[]>(initialPrograms);
  const [facilities, setFacilities] = useState<Facility[]>(initialFacilities);
  const [achievements, setAchievements] = useState<Achievement[]>(initialAchievements);
  const [articles, setArticles] = useState<Article[]>(initialArticles);
  const [events, setEvents] = useState<SchoolEvent[]>(initialEvents);
  const [media, setMedia] = useState<MediaItem[]>(initialMedia);
  const [organization, setOrganization] = useState<OrganizationMember[]>(initialOrganization);
  const [testimonials, setTestimonials] = useState<Testimonial[]>(initialTestimonials);
  const [admission, setAdmission] = useState<AdmissionInfo>(initialAdmissionInfo);
  const [messages, setMessages] = useState<ContactMessage[]>(initialContactMessages);
  const [settings, setSettings] = useState<WebsiteSettings>(initialWebsiteSettings);
  const [users, setUsers] = useState<User[]>(initialUsers);
  const [sections, setSections] = useState<PageSectionConfig[]>(initialSections);
  const [logs, setLogs] = useState<ActivityLog[]>([
    {
      id: "log-1",
      user: "Super Admin",
      action: "Inisialisasi Sistem",
      target: "Portal Sekolah Yazzaka",
      timestamp: "2026-08-24 20:00",
    },
  ]);

  const [isLoaded, setIsLoaded] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    queueMicrotask(() => {
      try {
        const savedData = localStorage.getItem(STORAGE_KEY);
        if (savedData) {
          const parsed = JSON.parse(savedData);
          if (parsed.profile) setProfile(parsed.profile);
          if (parsed.programs) setPrograms(parsed.programs);
          if (parsed.facilities) setFacilities(parsed.facilities);
          if (parsed.achievements) setAchievements(parsed.achievements);
          if (parsed.articles) setArticles(parsed.articles);
          if (parsed.events) setEvents(parsed.events);
          if (parsed.media) setMedia(parsed.media);
          if (parsed.organization) setOrganization(parsed.organization);
          if (parsed.testimonials) setTestimonials(parsed.testimonials);
          if (parsed.admission) setAdmission(parsed.admission);
          if (parsed.messages) setMessages(parsed.messages);
          if (parsed.settings) setSettings(parsed.settings);
          if (parsed.users) setUsers(parsed.users);
          if (parsed.sections) setSections(parsed.sections);
          if (parsed.logs) setLogs(parsed.logs);
        }
      } catch (e) {
        console.warn("Failed to load local data:", e);
      } finally {
        setIsLoaded(true);
      }
    });
  }, []);

  // Save to localStorage when state changes
  useEffect(() => {
    if (!isLoaded) return;
    try {
      const dataToSave = {
        profile,
        programs,
        facilities,
        achievements,
        articles,
        events,
        media,
        organization,
        testimonials,
        admission,
        messages,
        settings,
        users,
        sections,
        logs,
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(dataToSave));
    } catch (e) {
      console.error("Failed to save local data:", e);
    }
  }, [
    isLoaded,
    profile,
    programs,
    facilities,
    achievements,
    articles,
    events,
    media,
    organization,
    testimonials,
    admission,
    messages,
    settings,
    users,
    sections,
    logs,
  ]);

  // Apply Live Brand CSS Variables
  const applyBrandingStyles = useCallback((primary: string, accent: string) => {
    if (typeof document !== "undefined") {
      document.documentElement.style.setProperty("--color-primary", primary);
      document.documentElement.style.setProperty("--color-accent", accent);
    }
  }, []);

  useEffect(() => {
    if (profile.branding) {
      applyBrandingStyles(
        profile.branding.primaryColor || "#0F2B48",
        profile.branding.accentColor || "#D97706"
      );
    }
  }, [profile.branding, applyBrandingStyles]);

  const addLog = (action: string, target: string) => {
    const newLog: ActivityLog = {
      id: generateId("log"),
      user: "Admin",
      action,
      target,
      timestamp: new Date().toLocaleString("id-ID", {
        day: "numeric",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      }),
    };
    setLogs((prev) => [newLog, ...prev.slice(0, 49)]);
  };

  const updateProfile = (data: Partial<SchoolProfile>) => {
    setProfile((prev) => ({ ...prev, ...data }));
    addLog("Memperbarui", "Profil Sekolah");
  };

  const updateBrandingColors = (primary: string, accent: string) => {
    setProfile((prev) => ({
      ...prev,
      branding: {
        ...prev.branding,
        primaryColor: primary,
        accentColor: accent,
      },
    }));
    applyBrandingStyles(primary, accent);
    addLog("Mengubah Warna Tema Branding", `${primary} & ${accent}`);
  };

  // Programs
  const addProgram = (program: Omit<Program, "id">) => {
    const newProg: Program = { ...program, id: generateId("prog") };
    setPrograms((prev) => [...prev, newProg]);
    addLog("Menambahkan Program Baru", program.title);
  };
  const updateProgram = (id: string, program: Partial<Program>) => {
    setPrograms((prev) =>
      prev.map((p) => (p.id === id ? { ...p, ...program } : p))
    );
    addLog("Memperbarui Program", program.title || id);
  };
  const deleteProgram = (id: string) => {
    const found = programs.find((p) => p.id === id);
    setPrograms((prev) => prev.filter((p) => p.id !== id));
    addLog("Menghapus Program", found?.title || id);
  };

  // Facilities
  const addFacility = (facility: Omit<Facility, "id">) => {
    const newFac: Facility = { ...facility, id: generateId("fac") };
    setFacilities((prev) => [...prev, newFac]);
    addLog("Menambahkan Fasilitas Baru", facility.name);
  };
  const updateFacility = (id: string, facility: Partial<Facility>) => {
    setFacilities((prev) =>
      prev.map((f) => (f.id === id ? { ...f, ...facility } : f))
    );
    addLog("Memperbarui Fasilitas", facility.name || id);
  };
  const deleteFacility = (id: string) => {
    const found = facilities.find((f) => f.id === id);
    setFacilities((prev) => prev.filter((f) => f.id !== id));
    addLog("Menghapus Fasilitas", found?.name || id);
  };

  // Achievements
  const addAchievement = (achievement: Omit<Achievement, "id">) => {
    const newAch: Achievement = { ...achievement, id: generateId("ach") };
    setAchievements((prev) => [newAch, ...prev]);
    addLog("Menambahkan Prestasi Baru", achievement.title);
  };
  const updateAchievement = (id: string, achievement: Partial<Achievement>) => {
    setAchievements((prev) =>
      prev.map((a) => (a.id === id ? { ...a, ...achievement } : a))
    );
    addLog("Memperbarui Prestasi", achievement.title || id);
  };
  const deleteAchievement = (id: string) => {
    const found = achievements.find((a) => a.id === id);
    setAchievements((prev) => prev.filter((a) => a.id !== id));
    addLog("Menghapus Prestasi", found?.title || id);
  };

  // Articles
  const addArticle = (article: Omit<Article, "id">) => {
    const newArt: Article = { ...article, id: generateId("art") };
    setArticles((prev) => [newArt, ...prev]);
    addLog("Menerbitkan Artikel Berita", article.title);
  };
  const updateArticle = (id: string, article: Partial<Article>) => {
    setArticles((prev) =>
      prev.map((a) => (a.id === id ? { ...a, ...article } : a))
    );
    addLog("Memperbarui Artikel", article.title || id);
  };
  const deleteArticle = (id: string) => {
    const found = articles.find((a) => a.id === id);
    setArticles((prev) => prev.filter((a) => a.id !== id));
    addLog("Menghapus Artikel", found?.title || id);
  };

  // Events
  const addEvent = (event: Omit<SchoolEvent, "id">) => {
    const newEvt: SchoolEvent = { ...event, id: generateId("evt") };
    setEvents((prev) => [...prev, newEvt]);
    addLog("Menambahkan Agenda Kegiatan", event.title);
  };
  const updateEvent = (id: string, event: Partial<SchoolEvent>) => {
    setEvents((prev) =>
      prev.map((e) => (e.id === id ? { ...e, ...event } : e))
    );
    addLog("Memperbarui Agenda", event.title || id);
  };
  const deleteEvent = (id: string) => {
    const found = events.find((e) => e.id === id);
    setEvents((prev) => prev.filter((e) => e.id !== id));
    addLog("Menghapus Agenda", found?.title || id);
  };

  // Media
  const addMedia = (mediaItem: Omit<MediaItem, "id" | "uploadedAt">) => {
    const newMed: MediaItem = {
      ...mediaItem,
      id: generateId("med"),
      uploadedAt: new Date().toISOString().split("T")[0],
    };
    setMedia((prev) => [newMed, ...prev]);
    addLog("Mengunggah File Media", mediaItem.fileName);
  };
  const deleteMedia = (id: string) => {
    const found = media.find((m) => m.id === id);
    setMedia((prev) => prev.filter((m) => m.id !== id));
    addLog("Menghapus Media", found?.fileName || id);
  };

  // Organization
  const addMember = (member: Omit<OrganizationMember, "id">) => {
    const newMem: OrganizationMember = { ...member, id: generateId("org") };
    setOrganization((prev) => [...prev, newMem]);
    addLog("Menambahkan Tim/Guru", member.name);
  };
  const updateMember = (id: string, member: Partial<OrganizationMember>) => {
    setOrganization((prev) =>
      prev.map((m) => (m.id === id ? { ...m, ...member } : m))
    );
    addLog("Memperbarui Data Tim/Guru", member.name || id);
  };
  const deleteMember = (id: string) => {
    const found = organization.find((m) => m.id === id);
    setOrganization((prev) => prev.filter((m) => m.id !== id));
    addLog("Menghapus Tim/Guru", found?.name || id);
  };

  // Testimonials
  const addTestimonial = (testimonial: Omit<Testimonial, "id">) => {
    const newTest: Testimonial = { ...testimonial, id: generateId("test") };
    setTestimonials((prev) => [...prev, newTest]);
    addLog("Menambahkan Testimoni", testimonial.name);
  };
  const updateTestimonial = (id: string, testimonial: Partial<Testimonial>) => {
    setTestimonials((prev) =>
      prev.map((t) => (t.id === id ? { ...t, ...testimonial } : t))
    );
    addLog("Memperbarui Testimoni", testimonial.name || id);
  };
  const deleteTestimonial = (id: string) => {
    const found = testimonials.find((t) => t.id === id);
    setTestimonials((prev) => prev.filter((t) => t.id !== id));
    addLog("Menghapus Testimoni", found?.name || id);
  };

  // Admission & Settings
  const updateAdmission = (data: Partial<AdmissionInfo>) => {
    setAdmission((prev) => ({ ...prev, ...data }));
    addLog("Memperbarui Informasi PPDB", "Jadwal & Biaya");
  };

  const updateSettings = (data: Partial<WebsiteSettings>) => {
    setSettings((prev) => ({ ...prev, ...data }));
    addLog("Memperbarui Pengaturan Website", "SEO & Sosmed");
  };

  // Contact Messages
  const addContactMessage = (msg: Omit<ContactMessage, "id" | "submittedAt" | "status">) => {
    const newMsg: ContactMessage = {
      ...msg,
      id: generateId("msg"),
      submittedAt: new Date().toLocaleString("id-ID", {
        day: "numeric",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      }),
      status: "new",
    };
    setMessages((prev) => [newMsg, ...prev]);
  };

  const updateMessageStatus = (id: string, status: ContactMessage["status"]) => {
    setMessages((prev) =>
      prev.map((m) => (m.id === id ? { ...m, status } : m))
    );
    addLog("Memperbarui Status Pesan", status);
  };

  const deleteMessage = (id: string) => {
    setMessages((prev) => prev.filter((m) => m.id !== id));
    addLog("Menghapus Pesan Kontak", id);
  };

  // Homepage Sections
  const toggleSection = (id: string) => {
    setSections((prev) =>
      prev.map((s) => (s.id === id ? { ...s, isEnabled: !s.isEnabled } : s))
    );
    addLog("Mengubah Visibilitas Seksi Beranda", id);
  };

  const reorderSections = (newSections: PageSectionConfig[]) => {
    setSections(newSections);
    addLog("Mengubah Urutan Seksi Beranda", "Tata Letak Beranda");
  };

  const resetToDefault = () => {
    setProfile(initialSchoolProfile);
    setPrograms(initialPrograms);
    setFacilities(initialFacilities);
    setAchievements(initialAchievements);
    setArticles(initialArticles);
    setEvents(initialEvents);
    setMedia(initialMedia);
    setOrganization(initialOrganization);
    setTestimonials(initialTestimonials);
    setAdmission(initialAdmissionInfo);
    setMessages(initialContactMessages);
    setSettings(initialWebsiteSettings);
    setUsers(initialUsers);
    setSections(initialSections);
    localStorage.removeItem(STORAGE_KEY);
    addLog("Mereset Sistem ke Pengaturan Awal", "Default Data");
  };

  return (
    <SchoolDataContext.Provider
      value={{
        profile,
        programs,
        facilities,
        achievements,
        articles,
        events,
        media,
        organization,
        testimonials,
        admission,
        messages,
        settings,
        users,
        sections,
        logs,
        updateProfile,
        updateBrandingColors,
        addProgram,
        updateProgram,
        deleteProgram,
        addFacility,
        updateFacility,
        deleteFacility,
        addAchievement,
        updateAchievement,
        deleteAchievement,
        addArticle,
        updateArticle,
        deleteArticle,
        addEvent,
        updateEvent,
        deleteEvent,
        addMedia,
        deleteMedia,
        addMember,
        updateMember,
        deleteMember,
        addTestimonial,
        updateTestimonial,
        deleteTestimonial,
        updateAdmission,
        updateSettings,
        addContactMessage,
        updateMessageStatus,
        deleteMessage,
        toggleSection,
        reorderSections,
        resetToDefault,
      }}
    >
      {children}
    </SchoolDataContext.Provider>
  );
}

export function useSchoolData() {
  const context = useContext(SchoolDataContext);
  if (!context) {
    throw new Error("useSchoolData must be used within a SchoolDataProvider");
  }
  return context;
}
