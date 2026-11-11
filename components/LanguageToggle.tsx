"use client";

import React from "react";
import { Globe } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useLanguage } from "@/lib/i18n/LanguageContext";

export function LanguageToggle() {
  const { language, setLanguage } = useLanguage();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="h-10 px-2.5 rounded-full flex items-center gap-1.5 border-gray-200 dark:border-white/10 hover:border-[#728C69] transition-all text-xs font-semibold cursor-pointer"
          title="Cambiar idioma / Switch language"
        >
          <Globe className="h-4 w-4 text-[#728C69] dark:text-[#A5B29A]" />
          <span className="uppercase text-[11px] font-bold tracking-wider">
            {language}
          </span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-36 rounded-2xl shadow-lg p-1.5">
        <DropdownMenuItem
          onClick={() => setLanguage("es")}
          className={`cursor-pointer text-xs font-medium py-2 rounded-xl flex items-center justify-between ${
            language === "es"
              ? "bg-[#728C69]/15 text-[#728C69] dark:text-[#A5B29A] font-bold"
              : ""
          }`}
        >
          <span>🇲🇽 Español</span>
          {language === "es" && <span className="text-[10px]">✓</span>}
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => setLanguage("en")}
          className={`cursor-pointer text-xs font-medium py-2 rounded-xl flex items-center justify-between ${
            language === "en"
              ? "bg-[#728C69]/15 text-[#728C69] dark:text-[#A5B29A] font-bold"
              : ""
          }`}
        >
          <span>🇺🇸 English</span>
          {language === "en" && <span className="text-[10px]">✓</span>}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export default LanguageToggle;
