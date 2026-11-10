"use client";

import React from "react";
import Link from "next/link";
import { ModeToggle } from "@/components/ThemeToggle";
import { logout } from "@/actions/login";
import { Button } from "@/components/ui/button";
import { LogOut, ShieldCheck } from "lucide-react";

interface AdminHeaderProps {
  activeTab?: "auditorias" | "panel-bi" | "dashboard" | "revision";
}

export default function AdminHeader({ activeTab = "dashboard" }: AdminHeaderProps) {
  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur-md transition-colors">
      <div className="container mx-auto flex h-16 items-center justify-between px-6 max-w-6xl">
        <div className="flex items-center gap-3">
          <Link href="/" className="text-sm font-bold tracking-widest text-foreground flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#728C69]" />
            TURISMO SUSTENTABLE
          </Link>
          <span className="rounded-full bg-[#C81D77]/15 px-2.5 py-0.5 text-xs font-semibold text-[#C81D77] flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5" />
            Panel Auditor Admin
          </span>
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          <nav className="flex items-center gap-1 sm:gap-2 mr-2">
            <Link
              href="/admin/auditorias"
              className={`text-xs font-medium px-3 py-1.5 rounded-full transition-all ${
                activeTab === "auditorias" || activeTab === "revision"
                  ? "bg-[#728C69] text-white shadow-sm font-semibold"
                  : "text-[#63665E] dark:text-[#A5B29A] hover:bg-black/5 dark:hover:bg-white/5"
              }`}
            >
              Evidencias
            </Link>

            <Link
              href="/admin/panel-bi"
              className={`text-xs font-medium px-3 py-1.5 rounded-full transition-all ${
                activeTab === "panel-bi"
                  ? "bg-[#728C69] text-white shadow-sm font-semibold"
                  : "text-[#63665E] dark:text-[#A5B29A] hover:bg-black/5 dark:hover:bg-white/5"
              }`}
            >
              Panel BI
            </Link>

            <Link
              href="/admin/dashboard"
              className={`text-xs font-medium px-3 py-1.5 rounded-full transition-all ${
                activeTab === "dashboard"
                  ? "bg-[#728C69] text-white shadow-sm font-semibold"
                  : "text-[#63665E] dark:text-[#A5B29A] hover:bg-black/5 dark:hover:bg-white/5"
              }`}
            >
              Auditor General
            </Link>
          </nav>

          <ModeToggle />
          <Button
            variant="outline"
            size="sm"
            onClick={() => logout()}
            className="gap-1.5 rounded-full text-xs h-8 px-3"
          >
            <LogOut className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Cerrar Sesión</span>
          </Button>
        </div>
      </div>
    </header>
  );
}

