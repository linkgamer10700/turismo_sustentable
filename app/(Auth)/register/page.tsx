"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function RegisterPaso1Page() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSiguientePaso = (e: React.FormEvent) => {
    e.preventDefault();
    router.push("/register/perfil");
  };

  return (
    <main className="relative min-h-screen w-full flex flex-col lg:flex-row bg-[#F2EFE9] dark:bg-[#18201C] transition-colors duration-300">
      
      {/* Botón de Regreso al Inicio */}
      <div className="absolute top-6 right-6 lg:top-8 lg:right-10 z-30">
        <Link 
          href="/" 
          className="flex items-center justify-center w-10 h-10 rounded-full bg-white dark:bg-[#202823] shadow-sm hover:bg-[#E5E4DB] dark:hover:bg-[#2A352F] text-[#3B523E] dark:text-[#A5B29A] transition-colors"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
        </Link>
      </div>

      {/* Mitad Verde Decorativa */}
      <section className="relative w-full lg:w-1/2 min-h-[40vh] lg:min-h-screen bg-[#B0C49F] overflow-hidden flex flex-col justify-between p-8 lg:p-16">
        <div className="absolute inset-0 z-10 flex items-end justify-center pointer-events-none">
          <div className="absolute top-[30%] right-[25%] w-24 h-24 lg:w-32 lg:h-32 rounded-full bg-[#EFE2BA]" />
          <svg viewBox="0 0 800 400" preserveAspectRatio="none" className="absolute bottom-[35%] lg:bottom-[30%] left-0 w-full h-[50%] lg:h-[60%]">
            <polygon points="0,400 50,150 120,400" fill="#728C69" />
            <polygon points="80,400 160,100 240,400" fill="#728C69" />
            <polygon points="200,400 280,180 350,400" fill="#728C69" />
            <polygon points="-20,400 80,200 160,400" fill="#4B6846" />
            <polygon points="120,400 210,130 290,400" fill="#4B6846" />
            <polygon points="250,400 330,220 400,400" fill="#4B6846" />
            <polygon points="350,400 440,110 520,400" fill="#4B6846" />
            <polygon points="400,400 500,190 640,400" fill="#4B6846" />
            <polygon points="600,400 680,140 730,400" fill="#4B6846" />
            <polygon points="540,400 620,90 700,400" fill="#728C69" />
            <polygon points="660,400 740,160 880,400" fill="#728C69" />
          </svg>
          <div className="absolute bottom-0 left-0 w-full h-[35%] lg:h-[30%] bg-[#364935]" />
        </div>
        <div className="z-20 text-white relative mt-8 lg:mt-0">
          <h1 className="font-serif text-4xl lg:text-5xl leading-tight">Viaja ligero.<br />Deja huella verde.</h1>
        </div>
      </section>

      {/* Mitad Blanca (Formulario de Paso 1) */}
      <section className="relative w-full lg:w-1/2 flex items-center justify-center p-6 lg:p-16 isolate">
        <div className="w-full max-w-md bg-white dark:bg-[#202823] rounded-[2rem] p-8 lg:p-10 shadow-[0_8px_30px_rgba(0,0,0,0.04)] dark:shadow-none border border-transparent dark:border-white/5">
          
          <p className="text-[#728C69] dark:text-[#A5B29A] text-xs font-bold mb-2 tracking-wide uppercase">Paso 1 de 2</p>
          <h2 className="font-serif text-3xl lg:text-4xl text-[#1E201D] dark:text-white mb-2">Crea tu cuenta</h2>
          <p className="text-sm text-[#63665E] dark:text-[#9EA399] mb-8">Inicia tu viaje sustentable hoy mismo.</p>

          <form className="space-y-5" onSubmit={handleSiguientePaso}>
            <div>
              <label className="text-xs font-medium text-[#232621] dark:text-[#D1D5CD] block mb-1.5">Correo electrónico</label>
              <input
                required
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="usuario@correo.com"
                className="w-full bg-[#F2EFE9] dark:bg-[#18201C] text-[#232621] dark:text-white placeholder-[#8C9287] dark:placeholder-[#63665E] rounded-xl px-4 h-12 text-sm focus:outline-none focus:ring-2 focus:ring-[#728C69] transition-all border border-transparent dark:border-white/5"
              />
            </div>
            
            <div>
              <label className="text-xs font-medium text-[#232621] dark:text-[#D1D5CD] block mb-1.5">Contraseña</label>
              <input
                required
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-[#F2EFE9] dark:bg-[#18201C] text-[#232621] dark:text-white placeholder-[#8C9287] dark:placeholder-[#63665E] rounded-xl px-4 h-12 text-sm focus:outline-none focus:ring-2 focus:ring-[#728C69] transition-all border border-transparent dark:border-white/5"
              />
            </div>

            <button 
              type="submit"
              className="w-full bg-[#728C69] hover:bg-[#5B7153] dark:bg-[#85A07A] dark:hover:bg-[#A5B29A] text-white dark:text-[#1E2420] font-medium rounded-xl h-12 mt-6 transition-colors shadow-sm flex items-center justify-center gap-2"
            >
              Siguiente paso
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-[#E3E5D8] dark:border-[#3D453F] text-center">
            <p className="text-sm text-[#63665E] dark:text-[#9EA399]">
              ¿Ya tienes una cuenta? <Link href="/login/loginUser" className="text-[#C81D77] dark:text-[#E24A96] font-medium hover:underline">Inicia sesión</Link>
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}