"use client";

import React from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { useSchoolData } from "@/context/SchoolDataContext";
import { Menu, ExternalLink, Bell, LogOut, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function AdminTopbar({
  onToggleMobileSidebar,
}: {
  onToggleMobileSidebar?: () => void;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const { role, currentUser, logout } = useAuth();
  const { messages } = useSchoolData();

  const newMessages = messages.filter((m) => m.status === "new").length;
  const isSuperAdmin = role === "super_admin";

  const crumbs = pathname
    .replace("/admin", "")
    .split("/")
    .filter(Boolean)
    .map((p) => p.charAt(0).toUpperCase() + p.slice(1).replace(/-/g, " "));

  const handleLogout = async () => {
    await logout();
    router.push("/login");
  };

  return (
    <header
      role="banner"
      className="h-16 flex items-center justify-between gap-4 bg-card border-b border-border px-4 sm:px-6 sticky top-0 z-30 shrink-0"
    >
      {/* ── Kiri: Toggle mobile + Breadcrumb ─────────── */}
      <div className="flex items-center gap-3 min-w-0">
        <button
          type="button"
          onClick={onToggleMobileSidebar}
          aria-label="Buka/tutup sidebar navigasi"
          className="lg:hidden size-9 inline-flex items-center justify-center rounded-md border border-border bg-card text-muted-foreground hover:bg-muted hover:text-foreground transition-colors cursor-pointer shrink-0"
        >
          <Menu className="size-4" />
        </button>

        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link href="/admin">CMS Panel</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            {crumbs.length === 0 ? (
              <>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbPage>Dashboard</BreadcrumbPage>
                </BreadcrumbItem>
              </>
            ) : (
              crumbs.map((crumb, idx) => (
                <React.Fragment key={`${crumb}-${idx}`}>
                  <BreadcrumbSeparator className={idx < crumbs.length - 1 ? "hidden sm:block" : undefined} />
                  <BreadcrumbItem className={idx < crumbs.length - 1 ? "hidden sm:block" : undefined}>
                    {idx === crumbs.length - 1 ? (
                      <BreadcrumbPage>{crumb}</BreadcrumbPage>
                    ) : (
                      <span aria-hidden="true">{crumb}</span>
                    )}
                  </BreadcrumbItem>
                </React.Fragment>
              ))
            )}
          </BreadcrumbList>
        </Breadcrumb>
      </div>

      {/* ── Kanan: Aksi ──────────────────────────────── */}
      <div className="flex items-center gap-2 shrink-0">
        {/* Lonceng notifikasi pesan — menu Pesan Masuk hanya untuk super_admin */}
        {isSuperAdmin && (
          <Link
            href="/admin/settings/pesan"
            aria-label={newMessages > 0 ? `${newMessages} pesan baru` : "Kotak pesan masuk"}
            className="relative"
          >
            <Button variant="ghost" size="icon">
              <Bell className="size-4" />
              {newMessages > 0 && (
                <span className="absolute -top-0.5 -right-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-primary px-1 text-xs font-semibold text-primary-foreground tabular-nums">
                  {newMessages}
                </span>
              )}
            </Button>
          </Link>
        )}

        {/* Pratinjau situs publik */}
        <Link href="/" target="_blank" rel="noopener noreferrer">
          <Button variant="outline" size="sm">
            <ExternalLink />
            <span className="hidden sm:inline">Lihat Web Publik</span>
          </Button>
        </Link>

        {/* Menu akun pengguna */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button
              type="button"
              aria-label="Buka menu akun"
              className="flex items-center gap-2 rounded-md p-1 pr-1.5 hover:bg-muted transition-colors cursor-pointer outline-none focus-visible:ring-[3px] focus-visible:ring-ring/30"
            >
              <Avatar className="size-8">
                <AvatarFallback className="text-xs font-medium">
                  {currentUser?.name?.charAt(0) ?? "A"}
                </AvatarFallback>
              </Avatar>
              <div className="hidden sm:block text-left min-w-0">
                <p className="text-xs font-medium text-foreground leading-none truncate max-w-36">
                  {currentUser?.name ?? "Super Admin Yazzaka"}
                </p>
                <p className="text-xs text-muted-foreground capitalize leading-tight mt-0.5 truncate">
                  {role.replace("_", " ")}
                </p>
              </div>
              <ChevronDown className="hidden sm:block size-3.5 text-muted-foreground shrink-0" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-52">
            <DropdownMenuLabel className="min-w-0">
              <p className="truncate text-sm font-medium text-foreground">
                {currentUser?.name ?? "Super Admin Yazzaka"}
              </p>
              <p className="truncate text-xs font-normal text-muted-foreground capitalize">
                {role.replace("_", " ")}
              </p>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleLogout}>
              <LogOut />
              Keluar
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
