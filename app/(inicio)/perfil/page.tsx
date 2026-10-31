"use client";

import React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function PerfilPage() {
  const router = useRouter();

  const handleCerrarSesion = () => {
    localStorage.removeItem("userToken");
    alert("Sesión cerrada correctamente.");
    router.push("/");
  };

  return (
    <main className="min-h-screen w-full bg-[#F4F1EA] dark:bg-[#1E2420] transition-colors duration-300 py-8 px-4 flex justify-center pb-24">
      <div className="w-full max-w-md flex flex-col">
        
        {/* Encabezado */}
        <div className="flex items-center justify-between mb-8">
          <h1 className="font-serif text-3xl text-[#1E201D] dark:text-white">Mi perfil</h1>
          <Link 
            href="/perfil/editar"
            className="text-[#C81D77] dark:text-[#E24A96] text-sm font-medium hover:underline"
          >
            Editar
          </Link>
        </div>

        {/* Info de Usuario */}
        <div className="flex items-center gap-4 mb-8">
          <div className="w-20 h-20 rounded-full bg-[#728C69] flex items-center justify-center text-white font-serif text-2xl flex-shrink-0 shadow-sm">
            ML
          </div>
          <div>
            <h2 className="text-xl font-medium text-[#1E201D] dark:text-white">Mariana López</h2>
            <p className="text-sm text-[#8C9287] dark:text-[#9EA399]">mariana@correo.com</p>
            <p className="text-xs text-[#728C69] dark:text-[#A5B29A] font-medium mt-1">Viajera consciente</p>
          </div>
        </div>

        {/* Impacto */}
        <div className="bg-white dark:bg-[#2A312C] rounded-[1.5rem] p-5 mb-8 shadow-sm border border-transparent dark:border-white/5 flex justify-between items-center">
          <div>
            <h3 className="text-sm font-bold text-[#1E201D] dark:text-white mb-1">Tu impacto positivo</h3>
            <p className="text-xs text-[#63665E] dark:text-[#A5B29A]">8 experiencias locales</p>
          </div>
          <div className="text-center flex flex-col items-center">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#728C69" strokeWidth="1.5" className="mb-1"><path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 1 8.3C18 19 15 20 11 20z"/><path d="M11 20c-5 0-9-4-9-9 0-4.5 3-7.5 5-9 1 1 2 2 3 4"/></svg>
            <span className="text-[10px] text-[#8C9287]">este año</span>
          </div>
        </div>

        <h3 className="font-serif text-xl text-[#1E201D] dark:text-white mb-4">Tu actividad</h3>
        <div className="grid grid-cols-3 gap-3 mb-8">
          
          <Link href="/reservas" className="bg-white dark:bg-[#2A312C] rounded-2xl p-4 text-center shadow-sm border border-transparent dark:border-white/5 hover:bg-[#F4F1EA] dark:hover:bg-[#3D453F] transition-colors cursor-pointer block">
            <span className="block text-2xl font-serif text-[#728C69] dark:text-[#A5B29A] mb-1">3</span>
            <span className="text-[10px] text-[#8C9287] dark:text-[#9EA399] uppercase tracking-wider">Reservas</span>
          </Link>

          <Link href="/perfil/favoritos" className="bg-white dark:bg-[#2A312C] rounded-2xl p-4 text-center shadow-sm border border-transparent dark:border-white/5 hover:bg-[#F4F1EA] dark:hover:bg-[#3D453F] transition-colors cursor-pointer block">
            <span className="block text-2xl font-serif text-[#728C69] dark:text-[#A5B29A] mb-1">12</span>
            <span className="text-[10px] text-[#8C9287] dark:text-[#9EA399] uppercase tracking-wider">Favoritos</span>
          </Link>

          <div className="bg-white dark:bg-[#2A312C] rounded-2xl p-4 text-center shadow-sm border border-transparent dark:border-white/5">
            <span className="block text-2xl font-serif text-[#728C69] dark:text-[#A5B29A] mb-1">5</span>
            <span className="text-[10px] text-[#8C9287] dark:text-[#9EA399] uppercase tracking-wider">Reseñas</span>
          </div>
        </div>

        <h3 className="font-serif text-xl text-[#1E201D] dark:text-white mb-4">Mis intereses</h3>
        <div className="flex gap-2 mb-8">
          <span className="bg-[#E3E5D8] dark:bg-[#3D453F] text-[#4A4D46] dark:text-[#D1D5CD] text-xs font-medium px-4 py-2 rounded-full">Naturaleza</span>
          <span className="bg-[#E3E5D8] dark:bg-[#3D453F] text-[#4A4D46] dark:text-[#D1D5CD] text-xs font-medium px-4 py-2 rounded-full">Aventura</span>
          <span className="bg-[#E3E5D8] dark:bg-[#3D453F] text-[#4A4D46] dark:text-[#D1D5CD] text-xs font-medium px-4 py-2 rounded-full">Comunidad</span>
        </div>

        <h3 className="font-serif text-xl text-[#1E201D] dark:text-white mb-4">Cuenta</h3>
        <div className="flex flex-col gap-3">
          
          <Link 
            href="/perfil/preferencias"
            className="w-full bg-white dark:bg-[#2A312C] rounded-2xl p-4 flex items-center justify-between shadow-sm border border-transparent dark:border-white/5 hover:bg-[#F4F1EA] dark:hover:bg-[#3D453F] transition-colors"
          >
            <div className="flex items-center gap-3">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#728C69" strokeWidth="2"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>
              <span className="text-sm font-medium text-[#1E201D] dark:text-white">Preferencias</span>
            </div>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#8C9287" strokeWidth="2"><path d="m9 18 6-6-6-6"/></svg>
          </Link>

          <Link 
            href="/perfil/favoritos"
            className="w-full bg-white dark:bg-[#2A312C] rounded-2xl p-4 flex items-center justify-between shadow-sm border border-transparent dark:border-white/5 hover:bg-[#F4F1EA] dark:hover:bg-[#3D453F] transition-colors"
          >
            <div className="flex items-center gap-3">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#728C69" strokeWidth="2"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/></svg>
              <span className="text-sm font-medium text-[#1E201D] dark:text-white">Favoritos</span>
            </div>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#8C9287" strokeWidth="2"><path d="m9 18 6-6-6-6"/></svg>
          </Link>

          <button 
            onClick={handleCerrarSesion} 
            className="w-full bg-white dark:bg-[#2A312C] rounded-2xl p-4 flex items-center justify-between shadow-sm border border-transparent dark:border-white/5 hover:bg-[#F4F1EA] dark:hover:bg-[#3D453F] transition-colors"
          >
            <div className="flex items-center gap-3">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#C81D77" strokeWidth="2"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" x2="9" y1="12" y2="12"/></svg>
              <span className="text-sm font-medium text-[#C81D77] dark:text-[#E24A96]">Cerrar sesión</span>
            </div>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#8C9287" strokeWidth="2"><path d="m9 18 6-6-6-6"/></svg>
          </button>

        </div>
      </div>
    </main>
  );
}