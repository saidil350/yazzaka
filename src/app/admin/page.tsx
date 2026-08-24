"use client";

import React from "react";
import Link from "next/link";
import { useSchoolData } from "@/context/SchoolDataContext";
import { useAuth } from "@/context/AuthContext";
import {
  FileText,
  Layers,
  Calendar,
  MessageSquare,
  ArrowUpRight,
  Clock,
  Activity,
  Settings,
  Users,
  ArrowRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

export default function AdminDashboardOverview() {
  const {
    articles,
    programs,
    events,
    messages,
    logs,
    profile,
  } = useSchoolData();
  const { role, currentUser } = useAuth();

  const publishedArticles = articles.filter((a) => a.status === "published").length;
  const draftArticles = articles.filter((a) => a.status === "draft").length;
  const unreadMessages = messages.filter((m) => m.status === "new").length;
  const upcomingEvents = events.filter((e) => e.status === "upcoming").length;

  const stats = [
    {
      label: "Artikel Berita",
      value: articles.length,
      meta: `${publishedArticles} terbit · ${draftArticles} draf`,
      icon: FileText,
      href: "/admin/content/berita",
    },
    {
      label: "Program Kurikulum",
      value: programs.length,
      meta: "Tahfiz, Sains & Bahasa",
      icon: Layers,
      href: "/admin/content/program",
    },
    {
      label: "Agenda & Events",
      value: events.length,
      meta: `${upcomingEvents} mendatang`,
      icon: Calendar,
      href: "/admin/content/kegiatan",
    },
    {
      label: "Pesan Masuk",
      value: messages.length,
      meta: unreadMessages > 0 ? `${unreadMessages} belum dibaca` : "Semua terbaca",
      icon: MessageSquare,
      href: "/admin/settings/pesan",
      alert: unreadMessages > 0,
    },
  ];

  const quickActions = [
    { label: "Tulis Artikel Baru", icon: FileText, href: "/admin/content/berita" },
    { label: "Tambah Event / Agenda", icon: Calendar, href: "/admin/content/kegiatan" },
    { label: "Kelola Media Library", icon: Activity, href: "/admin/media" },
    { label: "Pengaturan Branding", icon: Settings, href: "/admin/settings/general" },
    { label: "Manajemen Pengguna", icon: Users, href: "/admin/users" },
    { label: "Kotak Pesan Masuk", icon: MessageSquare, href: "/admin/settings/pesan" },
  ];

  const recentLogs = logs.slice(0, 8);

  return (
    <div className="space-y-6 max-w-5xl mx-auto">

      {/* ── Page Header ──────────────────────────────── */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold tracking-tight">
            {currentUser?.name ?? "Administrator"}
          </h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            {profile.name} — Dashboard pengelola konten
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="secondary" className="font-mono text-xs">
            {role.replace("_", " ")}
          </Badge>
          <Link href="/" target="_blank">
            <Button variant="outline" size="sm">
              <ArrowUpRight className="h-3.5 w-3.5" />
              Lihat Situs
            </Button>
          </Link>
        </div>
      </div>

      <Separator />

      {/* ── Stat Row ─────────────────────────────────── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Link key={stat.href} href={stat.href} className="group">
              <div className="p-4 rounded-lg border border-border bg-card hover:bg-accent/30 transition-colors duration-150">
                <div className="flex items-center justify-between mb-3">
                  <Icon className="h-4 w-4 text-muted-foreground" />
                  {stat.alert && (
                    <span className="h-2 w-2 rounded-full bg-destructive" />
                  )}
                </div>
                <div className="text-2xl font-semibold tabular-nums">
                  {stat.value}
                </div>
                <div className="text-sm font-medium mt-0.5">{stat.label}</div>
                <div className="text-xs text-muted-foreground mt-0.5">{stat.meta}</div>
              </div>
            </Link>
          );
        })}
      </div>

      {/* ── Body Grid ────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

        {/* Quick Actions (5 cols) */}
        <div className="lg:col-span-5 space-y-3">
          <h2 className="text-sm font-semibold">Aksi Cepat</h2>
          <div className="rounded-lg border border-border bg-card overflow-hidden divide-y divide-border">
            {quickActions.map((action, idx) => {
              const Icon = action.icon;
              return (
                <Link key={idx} href={action.href}>
                  <div className="flex items-center justify-between px-4 py-3 hover:bg-accent/50 transition-colors duration-150 group cursor-pointer">
                    <div className="flex items-center gap-3">
                      <Icon className="h-4 w-4 text-muted-foreground group-hover:text-foreground transition-colors shrink-0" />
                      <span className="text-sm text-muted-foreground group-hover:text-foreground transition-colors">
                        {action.label}
                      </span>
                    </div>
                    <ArrowRight className="h-3.5 w-3.5 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                </Link>
              );
            })}
          </div>

          {/* Unread message alert */}
          {unreadMessages > 0 && (
            <Link href="/admin/settings/pesan">
              <div className="flex items-center gap-3 px-4 py-3 rounded-lg border border-destructive/20 bg-destructive/5 hover:bg-destructive/10 transition-colors duration-150 cursor-pointer">
                <MessageSquare className="h-4 w-4 text-destructive shrink-0" />
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-destructive">
                    {unreadMessages} pesan belum dibaca
                  </p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Klik untuk buka kotak pesan masuk
                  </p>
                </div>
                <ArrowRight className="h-3.5 w-3.5 text-destructive shrink-0" />
              </div>
            </Link>
          )}
        </div>

        {/* Activity Log (7 cols) */}
        <div className="lg:col-span-7 space-y-3">
          <h2 className="text-sm font-semibold">Log Aktivitas Terbaru</h2>

          <div className="rounded-lg border border-border bg-card overflow-hidden">
            {recentLogs.length === 0 ? (
              <div className="p-8 text-center">
                <Activity className="h-8 w-8 text-muted-foreground/40 mx-auto mb-2" />
                <p className="text-sm text-muted-foreground">Belum ada aktivitas.</p>
              </div>
            ) : (
              <div className="divide-y divide-border">
                {recentLogs.map((log) => (
                  <div
                    key={log.id}
                    className="flex items-start gap-3 px-4 py-3 hover:bg-accent/30 transition-colors duration-150"
                  >
                    <div className="h-6 w-6 rounded-md border border-border flex items-center justify-center shrink-0 mt-0.5 bg-muted">
                      <Activity className="h-3 w-3 text-muted-foreground" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm text-foreground leading-snug truncate">
                        {log.action}{" "}
                        <span className="font-medium">{log.target}</span>
                      </p>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="text-xs text-muted-foreground flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {log.timestamp}
                        </span>
                        <span className="text-xs text-muted-foreground">· {log.user}</span>
                      </div>
                    </div>
                    <Badge variant="outline" className="shrink-0 hidden sm:inline-flex text-xs">
                      {log.action}
                    </Badge>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
