"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { translations, Language, TranslationKey } from "./translations";

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: TranslationKey, params?: Record<string, string | number>) => string;
}

const LanguageContext = createContext<LanguageContextType>({
  language: "es",
  setLanguage: () => {},
  t: (key: TranslationKey) => translations.es[key] || key,
});

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<Language>("es");

  useEffect(() => {
    // 1. Cargar preferencia guardada en localStorage
    const saved = localStorage.getItem("ts_language") as Language | null;
    if (saved === "es" || saved === "en") {
      setLanguageState(saved);
      return;
    }

    // 2. O leer de cookie
    const match = document.cookie.match(/NEXT_LOCALE=([^;]+)/);
    if (match && (match[1] === "es" || match[1] === "en")) {
      setLanguageState(match[1] as Language);
    }
  }, []);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem("ts_language", lang);
    document.cookie = `NEXT_LOCALE=${lang}; path=/; max-age=31536000`;

    // Intentar sincronizar con el perfil del usuario si hay sesión
    try {
      fetch("/api/user/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ idioma: lang }),
      }).catch(() => {});
    } catch {
      // Ignorar si no está autenticado
    }
  };

  const t = (key: TranslationKey, params?: Record<string, string | number>): string => {
    const dict = translations[language] || translations.es;
    let text = dict[key] || translations.es[key] || (key as string);

    if (params) {
      for (const [pKey, pVal] of Object.entries(params)) {
        text = text.replace(new RegExp(`{${pKey}}`, "g"), String(pVal));
      }
    }

    return text;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  return useContext(LanguageContext);
}

