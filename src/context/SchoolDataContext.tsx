"use client";

import React, { createContext, use, useState, useEffect, useCallback } from "react";
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
  UserRole,
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
  
  isLoading: boolean;
  error: string | null;

  // Actions
  updateProfile: (data: Partial<SchoolProfile>) => Promise<void>;
  updateBrandingColors: (primary: string, accent: string) => Promise<void>;
  
  // Programs
  addProgram: (program: Omit<Program, "id">) => Promise<void>;
  updateProgram: (id: string, program: Partial<Program>) => Promise<void>;
  deleteProgram: (id: string) => Promise<void>;

  // Facilities
  addFacility: (facility: Omit<Facility, "id">) => Promise<void>;
  updateFacility: (id: string, facility: Partial<Facility>) => Promise<void>;
  deleteFacility: (id: string) => Promise<void>;

  // Achievements
  addAchievement: (achievement: Omit<Achievement, "id">) => Promise<void>;
  updateAchievement: (id: string, achievement: Partial<Achievement>) => Promise<void>;
  deleteAchievement: (id: string) => Promise<void>;

  // Articles
  addArticle: (article: Omit<Article, "id">) => Promise<void>;
  updateArticle: (id: string, article: Partial<Article>) => Promise<void>;
  deleteArticle: (id: string) => Promise<void>;

  // Events
  addEvent: (event: Omit<SchoolEvent, "id">) => Promise<void>;
  updateEvent: (id: string, event: Partial<SchoolEvent>) => Promise<void>;
  deleteEvent: (id: string) => Promise<void>;

  // Media
  addMedia: (mediaItem: Omit<MediaItem, "id" | "uploadedAt">) => Promise<void>;
  deleteMedia: (id: string) => Promise<void>;

  // Organization
  addMember: (member: Omit<OrganizationMember, "id">) => Promise<void>;
  updateMember: (id: string, member: Partial<OrganizationMember>) => Promise<void>;
  deleteMember: (id: string) => Promise<void>;

  // Testimonials
  addTestimonial: (testimonial: Omit<Testimonial, "id">) => Promise<void>;
  updateTestimonial: (id: string, testimonial: Partial<Testimonial>) => Promise<void>;
  deleteTestimonial: (id: string) => Promise<void>;

  // Admission & Settings
  updateAdmission: (data: Partial<AdmissionInfo>) => Promise<void>;
  updateSettings: (data: Partial<WebsiteSettings>) => Promise<void>;

  // Messages
  addContactMessage: (msg: Omit<ContactMessage, "id" | "submittedAt" | "status">) => Promise<void>;
  updateMessageStatus: (id: string, status: ContactMessage["status"]) => Promise<void>;
  deleteMessage: (id: string) => Promise<void>;

  // Homepage & Page Sections
  toggleSection: (id: string) => Promise<void>;
  reorderSections: (newSections: PageSectionConfig[]) => Promise<void>;
  updateSection: (id: string, partial: Partial<PageSectionConfig>) => Promise<void>;

  // Users
  addUser: (user: { name: string; email: string; password: string; role: UserRole }) => Promise<void>;
  updateUserRole: (id: string, role: UserRole) => Promise<void>;
  deleteUser: (id: string) => Promise<void>;
  refreshUsers: () => Promise<void>;

  // Reset to initial
  resetToDefault: () => void;
}

const SchoolDataContext = createContext<SchoolDataContextType | undefined>(undefined);

export function SchoolDataProvider({ children }: { children: React.ReactNode }) {
  // Gunakan initialData sebagai fallback sementara loading
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
  
  const [logs, setLogs] = useState<ActivityLog[]>([{
    id: "log-1",
    user: "System",
    action: "Inisialisasi",
    target: "Koneksi Database",
    timestamp: new Date().toLocaleString("id-ID"),
  }]);

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const addLog = useCallback((action: string, target: string) => {
    const newLog: ActivityLog = {
      id: generateId("log"),
      user: "Admin",
      action,
      target,
      timestamp: new Date().toLocaleString("id-ID", {
        day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit",
      }),
    };
    setLogs((prev) => [newLog, ...prev.slice(0, 49)]);
  }, []);

  // Fetch dari API saat mount
  useEffect(() => {
    async function fetchData() {
      try {
        // A cold database connection can briefly fail during local/dev and serverless starts.
        // Retry once and preserve the API status/body in the console for actionable diagnosis.
        let res = await fetch('/api/school-data', { cache: 'no-store' });
        if (!res.ok) {
          await new Promise((resolve) => setTimeout(resolve, 700));
          res = await fetch('/api/school-data', { cache: 'no-store' });
        }
        if (!res.ok) {
          const detail = await res.text().catch(() => '');
          throw new Error(
            `Gagal load data (HTTP ${res.status})${detail ? `: ${detail.slice(0, 240)}` : ''}`
          );
        }
        const data = await res.json();
        
        if (data.profile) setProfile(data.profile);
        if (data.programs) setPrograms(data.programs);
        if (data.facilities) setFacilities(data.facilities);
        if (data.achievements) setAchievements(data.achievements);
        if (data.articles) setArticles(data.articles);
        if (data.events) setEvents(data.events);
        if (data.testimonials) setTestimonials(data.testimonials);
        if (data.admission) setAdmission(data.admission);
        if (data.messages) setMessages(data.messages);
        if (data.settings) setSettings(data.settings);
        if (data.organization) setOrganization(data.organization);
        if (data.users) setUsers(data.users);
        if (data.sections) setSections(data.sections);
        if (data.media) setMedia(data.media);
        
        addLog("Sync", "Berhasil mengambil data dari Neon Database");
      } catch (err) {
        console.error(err);
        setError("Gagal sinkronisasi dengan database. Menggunakan data lokal (fallback).");
      } finally {
        setIsLoading(false);
      }
    }
    fetchData();
  }, [addLog]);

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

  const apiCall = async (endpoint: string, method: string, body?: unknown) => {
    const res = await fetch(endpoint, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: body ? JSON.stringify(body) : undefined,
    });
    if (!res.ok) throw new Error(`API Error: ${res.status}`);
    return res.json();
  };

  // --- ACTIONS (API + Optimistic Update) ---

  const updateProfile = async (data: Partial<SchoolProfile>) => {
    const old = profile;
    setProfile({ ...old, ...data }); // optimistic
    try {
      const updated = await apiCall('/api/profile', 'PUT', data);
      setProfile(updated);
      addLog("Memperbarui", "Profil Sekolah");
    } catch (e) {
      setProfile(old); // revert
      console.error(e);
    }
  };

  const updateBrandingColors = async (primary: string, accent: string) => {
    await updateProfile({
      branding: { ...profile.branding, primaryColor: primary, accentColor: accent }
    });
  };

  // Programs
  const addProgram = async (program: Omit<Program, "id">) => {
    const created = await apiCall('/api/programs', 'POST', program);
    setPrograms(prev => [...prev, created]);
    addLog("Menambahkan Program Baru", program.title);
  };
  const updateProgram = async (id: string, program: Partial<Program>) => {
    const updated = await apiCall(`/api/programs/${id}`, 'PUT', program);
    setPrograms(prev => prev.map(p => p.id === id ? updated : p));
    addLog("Memperbarui Program", program.title || id);
  };
  const deleteProgram = async (id: string) => {
    await apiCall(`/api/programs/${id}`, 'DELETE');
    setPrograms(prev => prev.filter(p => p.id !== id));
    addLog("Menghapus Program", id);
  };

  // Facilities
  const addFacility = async (facility: Omit<Facility, "id">) => {
    const created = await apiCall('/api/facilities', 'POST', facility);
    setFacilities(prev => [...prev, created]);
    addLog("Menambahkan Fasilitas", facility.name);
  };
  const updateFacility = async (id: string, facility: Partial<Facility>) => {
    const updated = await apiCall(`/api/facilities/${id}`, 'PUT', facility);
    setFacilities(prev => prev.map(f => f.id === id ? updated : f));
  };
  const deleteFacility = async (id: string) => {
    await apiCall(`/api/facilities/${id}`, 'DELETE');
    setFacilities(prev => prev.filter(f => f.id !== id));
  };

  // Achievements
  const addAchievement = async (achievement: Omit<Achievement, "id">) => {
    const created = await apiCall('/api/achievements', 'POST', achievement);
    setAchievements(prev => [created, ...prev]);
  };
  const updateAchievement = async (id: string, achievement: Partial<Achievement>) => {
    const updated = await apiCall(`/api/achievements/${id}`, 'PUT', achievement);
    setAchievements(prev => prev.map(a => a.id === id ? updated : a));
  };
  const deleteAchievement = async (id: string) => {
    await apiCall(`/api/achievements/${id}`, 'DELETE');
    setAchievements(prev => prev.filter(a => a.id !== id));
  };

  // Articles
  const addArticle = async (article: Omit<Article, "id">) => {
    const created = await apiCall('/api/articles', 'POST', article);
    setArticles(prev => [created, ...prev]);
  };
  const updateArticle = async (id: string, article: Partial<Article>) => {
    const updated = await apiCall(`/api/articles/${id}`, 'PUT', article);
    setArticles(prev => prev.map(a => a.id === id ? updated : a));
  };
  const deleteArticle = async (id: string) => {
    await apiCall(`/api/articles/${id}`, 'DELETE');
    setArticles(prev => prev.filter(a => a.id !== id));
  };

  // Events
  const addEvent = async (event: Omit<SchoolEvent, "id">) => {
    const created = await apiCall('/api/events', 'POST', event);
    setEvents(prev => [...prev, created]);
  };
  const updateEvent = async (id: string, event: Partial<SchoolEvent>) => {
    const updated = await apiCall(`/api/events/${id}`, 'PUT', event);
    setEvents(prev => prev.map(e => e.id === id ? updated : e));
  };
  const deleteEvent = async (id: string) => {
    await apiCall(`/api/events/${id}`, 'DELETE');
    setEvents(prev => prev.filter(e => e.id !== id));
  };

  // Organization
  const addMember = async (member: Omit<OrganizationMember, "id">) => {
    const created = await apiCall('/api/organization', 'POST', member);
    setOrganization(prev => [...prev, created]);
  };
  const updateMember = async (id: string, member: Partial<OrganizationMember>) => {
    const updated = await apiCall(`/api/organization/${id}`, 'PUT', member);
    setOrganization(prev => prev.map(m => m.id === id ? updated : m));
  };
  const deleteMember = async (id: string) => {
    await apiCall(`/api/organization/${id}`, 'DELETE');
    setOrganization(prev => prev.filter(m => m.id !== id));
  };

  // Testimonials
  const addTestimonial = async (testimonial: Omit<Testimonial, "id">) => {
    const created = await apiCall('/api/testimonials', 'POST', testimonial);
    setTestimonials(prev => [...prev, created]);
  };
  const updateTestimonial = async (id: string, testimonial: Partial<Testimonial>) => {
    const updated = await apiCall(`/api/testimonials/${id}`, 'PUT', testimonial);
    setTestimonials(prev => prev.map(t => t.id === id ? updated : t));
  };
  const deleteTestimonial = async (id: string) => {
    await apiCall(`/api/testimonials/${id}`, 'DELETE');
    setTestimonials(prev => prev.filter(t => t.id !== id));
  };

  // Admission & Settings
  const updateAdmission = async (data: Partial<AdmissionInfo>) => {
    const updated = await apiCall('/api/admission', 'PUT', data);
    setAdmission(updated);
  };

  const updateSettings = async (data: Partial<WebsiteSettings>) => {
    const updated = await apiCall('/api/settings', 'PUT', data);
    setSettings(updated);
  };

  // Messages
  const addContactMessage = async (msg: Omit<ContactMessage, "id" | "submittedAt" | "status">) => {
    const created = await apiCall('/api/messages', 'POST', msg);
    setMessages(prev => [created, ...prev]);
  };
  const updateMessageStatus = async (id: string, status: ContactMessage["status"]) => {
    const updated = await apiCall(`/api/messages/${id}`, 'PUT', { status });
    setMessages(prev => prev.map(m => m.id === id ? updated : m));
  };
  const deleteMessage = async (id: string) => {
    await apiCall(`/api/messages/${id}`, 'DELETE');
    setMessages(prev => prev.filter(m => m.id !== id));
  };

  // Media (Persisted ke API & Neon Database)
  const addMedia = async (mediaItem: Omit<MediaItem, "id" | "uploadedAt">) => {
    const created = await apiCall('/api/media', 'POST', mediaItem);
    setMedia(prev => [created, ...prev]);
    addLog("Menambahkan Media", mediaItem.fileName);
  };
  // Users
  const addUser = async (userData: { name: string; email: string; password: string; role: UserRole }) => {
    const created = await apiCall('/api/users', 'POST', userData);
    setUsers(prev => [...prev, created.user]);
    addLog("Menambahkan Pengguna", userData.name);
  };

  const updateUserRole = async (id: string, role: UserRole) => {
    const updated = await apiCall(`/api/users/${id}`, 'PATCH', { role });
    setUsers(prev => prev.map(u => u.id === id ? updated.user : u));
    addLog("Memperbarui Peran", `ID: ${id} → ${role}`);
  };

  const deleteUser = async (id: string) => {
    await apiCall(`/api/users/${id}`, 'DELETE');
    setUsers(prev => prev.filter(u => u.id !== id));
    addLog("Menghapus Pengguna", id);
  };

  const refreshUsers = async () => {
    try {
      const res = await fetch('/api/users');
      if (!res.ok) return;
      const data = await res.json();
      if (data.users) setUsers(data.users);
    } catch (err) {
      console.error("Gagal refresh users:", err);
    }
  };

  const deleteMedia = async (id: string) => {
    await apiCall(`/api/media/${id}`, 'DELETE');
    setMedia(prev => prev.filter(m => m.id !== id));
    addLog("Menghapus Media", id);
  };

  // Sections (Persisted ke API & Neon Database)
  const toggleSection = async (id: string) => {
    const updated = sections.map(s => s.id === id ? { ...s, isEnabled: !s.isEnabled } : s);
    setSections(updated);
    try {
      await fetch('/api/sections', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sections: updated }),
      });
      addLog("Update", `Status seksi halaman diperbarui`);
    } catch (err) {
      console.error("Gagal menyimpan status seksi:", err);
    }
  };

  const reorderSections = async (newSections: PageSectionConfig[]) => {
    const reordered = newSections.map((s, idx) => ({ ...s, orderIndex: idx + 1 }));
    setSections(reordered);
    try {
      await fetch('/api/sections', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sections: reordered }),
      });
      addLog("Update", `Urutan seksi halaman diperbarui`);
    } catch (err) {
      console.error("Gagal menyimpan urutan seksi:", err);
    }
  };

  const updateSection = async (id: string, partial: Partial<PageSectionConfig>) => {
    const updated = sections.map((s) =>
      s.id === id || s.key === id ? { ...s, ...partial } : s
    );
    setSections(updated);
    try {
      await fetch('/api/sections', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sections: updated }),
      });
      addLog("Update", `Konfigurasi seksi "${partial.title || id}" diperbarui`);
    } catch (err) {
      console.error("Gagal memperbarui konfigurasi seksi:", err);
    }
  };

  const resetToDefault = () => {
    console.warn("Reset to default is disabled when using DB");
  };

  return (
    <SchoolDataContext.Provider
      value={{
        profile, programs, facilities, achievements, articles, events, media,
        organization, testimonials, admission, messages, settings, users, sections, logs,
        isLoading, error,
        updateProfile, updateBrandingColors,
        addProgram, updateProgram, deleteProgram,
        addFacility, updateFacility, deleteFacility,
        addAchievement, updateAchievement, deleteAchievement,
        addArticle, updateArticle, deleteArticle,
        addEvent, updateEvent, deleteEvent,
        addMedia, deleteMedia,
        addMember, updateMember, deleteMember,
        addTestimonial, updateTestimonial, deleteTestimonial,
        updateAdmission, updateSettings,
        addContactMessage, updateMessageStatus, deleteMessage,
        toggleSection, reorderSections, updateSection,
        addUser, updateUserRole, deleteUser, refreshUsers,
        resetToDefault,
      }}
    >
      {children}
    </SchoolDataContext.Provider>
  );
}

export function useSchoolData() {
  const context = use(SchoolDataContext);
  if (!context) {
    throw new Error("useSchoolData must be used within a SchoolDataProvider");
  }
  return context;
}
