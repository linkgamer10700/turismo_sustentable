"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function ProveedorDashboardPage() {
  const router = useRouter();
  const [perfil, setPerfil] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadProfile() {
      try {
        const res = await fetch("/api/user/profile");
        if (res.status === 401) {
          router.push("/login/loginUser");
          return;
        }
        const data = await res.json();
        if (data.success && data.data) {
          setPerfil(data.data);
        }
      } catch (error) {
        console.error("Error cargando perfil", error);
      } finally {
        setIsLoading(false);
      }
    }
    loadProfile();
  }, [router]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F4F1EA] dark:bg-[#1E2420] text-[#728C69]">
        Cargando panel...
      </div>
    );
  }

  const negocio = perfil?.proveedor;

  return (
    <main className="min-h-screen w-full bg-[#F4F1EA] dark:bg-[#1E2420] transition-colors duration-300 py-8 px-4 flex justify-center pb-24">
      <div className="w-full max-w-md flex flex-col">
        <h1 className="font-serif text-3xl text-[#1E201D] dark:text-white mb-6">Mi cuenta</h1>

        {/* Tarjeta del Negocio */}
        <div className="bg-white dark:bg-[#2A312C] rounded-[2rem] p-5 mb-6 shadow-sm border border-transparent dark:border-white/5">
          <div className="w-full h-32 bg-[#B4CBB0] rounded-xl mb-4 relative overflow-hidden">
            {/* Placeholder de Montañas SVG */}
            <svg viewBox="0 0 400 120" className="w-full h-full object-cover" preserveAspectRatio="none">
              <circle cx="320" cy="40" r="20" fill="#F4E6B4" />
              <polygon points="0,120 150,50 350,120" fill="#758C6E" />
              <polygon points="100,120 280,70 450,120" fill="#586E52" />
            </svg>
          </div>
          <h2 className="font-serif text-2xl text-[#1E201D] dark:text-white mb-1">
            {negocio?.nombreNegocio || "Nombre del negocio"}
          </h2>
          <p className="text-sm text-[#8C9287] dark:text-[#9EA399] mb-2 line-clamp-2">
            {negocio?.descripcionBreve || "Descripción breve"}
          </p>
          <div className="flex text-[10px] text-[#63665E] dark:text-[#A5B29A] gap-2 font-medium">
            <span>Medio día</span>
            <span>·</span>
            <span className="uppercase">{negocio?.categoria || "Categoría"}</span>
            <span>·</span>
            <span>{negocio?.alcaldiaCDMX || "Ubicación"}</span>
          </div>
        </div>

        {/* Menú de Opciones */}
        <div className="flex flex-col gap-3">
          <Link
            href="/negocio/documentos"
            className="w-full bg-white dark:bg-[#2A312C] rounded-2xl p-4 flex items-center justify-between shadow-sm border border-transparent dark:border-white/5 hover:bg-[#E3E5D8] dark:hover:bg-[#3D453F] transition-colors"
          >
            <span className="text-base font-medium text-[#1E201D] dark:text-white">Documentos</span>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#8C9287" strokeWidth="2">
              <path d="m9 18 6-6-6-6" />
            </svg>
          </Link>

          <Link
            href="/negocio/anuncios"
            className="w-full bg-white dark:bg-[#2A312C] rounded-2xl p-4 flex items-center justify-between shadow-sm border border-transparent dark:border-white/5 hover:bg-[#E3E5D8] dark:hover:bg-[#3D453F] transition-colors"
          >
            <span className="text-base font-medium text-[#1E201D] dark:text-white">Anuncios del administrador</span>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#8C9287" strokeWidth="2">
              <path d="m9 18 6-6-6-6" />
            </svg>
          </Link>

          <Link
            href="/reservas"
            className="w-full bg-white dark:bg-[#2A312C] rounded-2xl p-4 flex items-center justify-between shadow-sm border border-transparent dark:border-white/5 hover:bg-[#E3E5D8] dark:hover:bg-[#3D453F] transition-colors"
          >
            <span className="text-base font-medium text-[#1E201D] dark:text-white">Reservas</span>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#8C9287" strokeWidth="2">
              <path d="m9 18 6-6-6-6" />
            </svg>
          </Link>
        </div>
      </div>
    </main>
  );
}
