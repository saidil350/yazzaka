"use client";

import React, { createContext, use, useState, useEffect, useCallback, useRef } from "react";
import {
  SchoolProfile,
  Program,
  Achievement,
  Article,
  SchoolEvent,
  MediaItem,
  OrganizationMember,
  Testimonial,
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
  initialAchievements,
  initialArticles,
  initialEvents,
  initialMedia,
  initialOrganization,
  initialTestimonials,
  initialContactMessages,
  initialWebsiteSettings,
  initialUsers,
  initialSections,
} from "@/lib/data/initialData";
import { generateId } from "@/lib/utils";

interface SchoolDataContextType {
  profile: SchoolProfile;
  programs: Program[];
  achievements: Achievement[];
  articles: Article[];
  events: SchoolEvent[];
  media: MediaItem[];
  organization: OrganizationMember[];
  testimonials: Testimonial[];
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

  // Achievements
  addAchievement: (achievement: Omit<Achievement, "id">) => Promise<void>;
  updateAchievement: (id: string, achievement: Partial<Achievement>) => Promise<void>;
  deleteAchievement: (id: string) => Promise<void>;

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

  // Settings
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
}

const SchoolDataContext = createContext<SchoolDataContextType | undefined>(undefined);

export function SchoolDataProvider({
  children,
  initialSections: serverSections,
  initialHero,
}: {
  children: React.ReactNode;
  initialSections?: PageSectionConfig[];
  initialHero?: Partial<SchoolProfile["hero"]> | null;
}) {
  // Gunakan initialData sebagai fallback sementara loading; seksi halaman
  // memakai data server dari layout root bila tersedia (anti-kedipan toggle).
  // Konten hero juga dari server agar kolase hero tampil di HTML pertama.
  const [profile, setProfile] = useState<SchoolProfile>(
    initialHero ? { ...initialSchoolProfile, hero: initialHero } : initialSchoolProfile
  );
  const [programs, setPrograms] = useState<Program[]>(initialPrograms);
  const [achievements, setAchievements] = useState<Achievement[]>(initialAchievements);
  const [articles, setArticles] = useState<Article[]>(initialArticles);
  const [events, setEvents] = useState<SchoolEvent[]>(initialEvents);
  const [media, setMedia] = useState<MediaItem[]>(initialMedia);
  const [organization, setOrganization] = useState<OrganizationMember[]>(initialOrganization);
  const [testimonials, setTestimonials] = useState<Testimonial[]>(initialTestimonials);
  const [messages, setMessages] = useState<ContactMessage[]>(initialContactMessages);
  const [settings, setSettings] = useState<WebsiteSettings>(initialWebsiteSettings);
  const [users, setUsers] = useState<User[]>(initialUsers);
  const [sections, setSections] = useState<PageSectionConfig[]>(serverSections ?? initialSections);
  
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

  // Guard sinkronisasi: cegah fetch ganda, dan jangan sinkron ulang saat
  // ada penyimpanan seksi yang masih berjalan (bisa menimpa state optimistik).
  const syncInFlightRef = useRef(false);
  const lastSyncAtRef = useRef(0);
  const sectionsSavingRef = useRef(false);

  // Fetch dari API saat mount, lalu sinkron ulang saat tab kembali aktif agar
  // perubahan CMS dari tab lain (mis. hide seksi beranda) tidak pernah
  // menyisakan state basi yang masih merender seksi tersembunyi.
  useEffect(() => {
    async function fetchData(isInitial = false) {
      if (syncInFlightRef.current) return;
      syncInFlightRef.current = true;
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
        if (data.achievements) setAchievements(data.achievements);
        if (data.articles) setArticles(data.articles);
        if (data.events) setEvents(data.events);
        if (data.testimonials) setTestimonials(data.testimonials);
        if (data.messages) setMessages(data.messages);
        if (data.settings) setSettings(data.settings);
        if (data.organization) setOrganization(data.organization);
        if (data.users) setUsers(data.users);
        if (data.sections) setSections(data.sections);
        if (data.media) setMedia(data.media);

        lastSyncAtRef.current = Date.now();
        if (isInitial) addLog("Sync", "Berhasil mengambil data dari Neon Database");
      } catch (err) {
        // Sinkron ulang yang gagal dibiarkan diam-diam memakai data terakhir;
        // pesan fallback hanya untuk sinkronisasi awal yang benar-benar gagal.
        if (isInitial) {
          console.error(err);
          setError("Gagal sinkronisasi dengan database. Menggunakan data lokal (fallback).");
        } else {
          console.error("Sinkronisasi ulang gagal, memakai data terakhir:", err);
        }
      } finally {
        syncInFlightRef.current = false;
        if (isInitial) setIsLoading(false);
      }
    }

    fetchData(true);

    const syncOnVisible = () => {
      if (typeof document === "undefined" || document.visibilityState !== "visible") return;
      if (sectionsSavingRef.current) return;
      if (Date.now() - lastSyncAtRef.current < 5000) return;
      fetchData();
    };
    document.addEventListener("visibilitychange", syncOnVisible);
    window.addEventListener("focus", syncOnVisible);
    return () => {
      document.removeEventListener("visibilitychange", syncOnVisible);
      window.removeEventListener("focus", syncOnVisible);
    };
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
      // Rethrow agar caller bisa menampilkan toast gagal — tanpa ini semua
      // try/catch di halaman jadi dead code dan sukses palsu ditampilkan.
      throw e;
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

  // Catatan: CRUD artikel berita kini lewat /api/articles langsung
  // di modul admin berita (src/app/admin/berita) — bukan lewat context ini.

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

  // Settings
  const updateSettings = async (data: Partial<WebsiteSettings>) => {
    const updated = await apiCall('/api/settings', 'PUT', data);
    setSettings(updated);
  };

  // Messages — pengiriman publik via /api/contact (satu-satunya POST anonim
  // yang di-whitelist proxy). Responsnya { success, id }, bukan objek pesan,
  // jadi state `messages` (khusus super_admin) tidak diubah di sini.
  const addContactMessage = async (msg: Omit<ContactMessage, "id" | "submittedAt" | "status">) => {
    await apiCall('/api/contact', 'POST', msg);
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

  // Sections (Persisted ke API & Neon Database) — optimistic dengan rollback
  // dan rethrow agar caller bisa menampilkan toast gagal.
  const saveSections = async (updated: PageSectionConfig[], previous: PageSectionConfig[], logMessage: string) => {
    setSections(updated);
    sectionsSavingRef.current = true;
    try {
      const res = await fetch('/api/sections', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sections: updated }),
      });
      if (!res.ok) throw new Error(`API Error: ${res.status}`);
      lastSyncAtRef.current = Date.now();
      addLog("Update", logMessage);
    } catch (err) {
      setSections(previous); // rollback optimistic
      console.error("Gagal menyimpan konfigurasi seksi:", err);
      throw err;
    } finally {
      sectionsSavingRef.current = false;
    }
  };

  const toggleSection = async (id: string) => {
    const updated = sections.map(s => s.id === id ? { ...s, isEnabled: !s.isEnabled } : s);
    await saveSections(updated, sections, "Status seksi halaman diperbarui");
  };

  const reorderSections = async (newSections: PageSectionConfig[]) => {
    const reordered = newSections.map((s, idx) => ({ ...s, orderIndex: idx + 1 }));
    await saveSections(reordered, sections, "Urutan seksi halaman diperbarui");
  };

  const updateSection = async (id: string, partial: Partial<PageSectionConfig>) => {
    const updated = sections.map((s) =>
      s.id === id || s.key === id ? { ...s, ...partial } : s
    );
    await saveSections(updated, sections, `Konfigurasi seksi "${partial.title || id}" diperbarui`);
  };

  return (    <SchoolDataContext.Provider
      value={{
        profile, programs, achievements, articles, events, media,
        organization, testimonials, messages, settings, users, sections, logs,
        isLoading, error,
        updateProfile, updateBrandingColors,
        addProgram, updateProgram, deleteProgram,
        addAchievement, updateAchievement, deleteAchievement,
        addEvent, updateEvent, deleteEvent,
        addMedia, deleteMedia,
        addMember, updateMember, deleteMember,
        addTestimonial, updateTestimonial, deleteTestimonial,
        updateSettings,
        addContactMessage, updateMessageStatus, deleteMessage,
        toggleSection, reorderSections, updateSection,
        addUser, updateUserRole, deleteUser, refreshUsers,
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
