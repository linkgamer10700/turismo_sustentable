"use client";

import React, { useState } from "react";
import Link from "next/link";

export default function CrearPerfilPage() {
  const [nombre, setNombre] = useState("");
  const [explorar, setExplorar] = useState<string[]>(["Naturaleza", "Aventura"]);
  const [estiloViaje, setEstiloViaje] = useState<string[]>(["Accesible"]);

  const opcionesExplorar = ["Naturaleza", "Gastronomía", "Cultura", "Comunidad", "Aventura"];
  const opcionesViaje = [
    { id: "Accesible", icon: <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" /> },
    { id: "Bajo impacto", icon: <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" /> },
    { id: "Al aire libre", icon: <path d="M12 2v2m0 16v2M4.93 4.93l1.41 1.41m11.32 11.32l1.41 1.41M2 12h2m16 0h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41" /> }
  ];

  const toggleExplorar = (opcion: string) => {
    setExplorar(prev => prev.includes(opcion) ? prev.filter(i => i !== opcion) : [...prev, opcion]);
  };

  const toggleViaje = (id: string) => {
    setEstiloViaje(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
  };

  return (
    <main className="relative min-h-screen w-full flex flex-col lg:flex-row bg-[#F2EFE9] dark:bg-[#18201C] transition-colors duration-300">
      
      {/* Botón de Regreso a Registro (Paso 1) */}
      <div className="absolute top-6 right-6 lg:top-8 lg:right-10 z-30">
        <Link 
          href="/register" 
          className="flex items-center justify-center w-10 h-10 rounded-full bg-white dark:bg-[#202823] shadow-sm hover:bg-[#E5E4DB] dark:hover:bg-[#2A352F] text-[#3B523E] dark:text-[#E2E4DE] transition-colors duration-300 border border-transparent dark:border-white/10"
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
          </svg>
          <div className="absolute bottom-0 left-0 w-full h-[35%] lg:h-[30%] bg-[#364935]" />
        </div>
        <div className="z-20 text-white relative">
          <h1 className="font-serif text-4xl lg:text-5xl leading-tight">Viaja ligero.<br />Deja huella verde.</h1>
        </div>
      </section>

      {/* Mitad Blanca (Formulario de Paso 2) */}
      <section className="relative w-full lg:w-1/2 flex items-center justify-center p-6 lg:p-16 isolate">
        <div className="absolute -top-24 -right-24 w-[300px] h-[300px] lg:w-[500px] lg:h-[500px] rounded-full bg-[#E5E4DB] dark:bg-[#121815] -z-10 transition-colors duration-300 opacity-60" />
        <div className="w-full max-w-md bg-white dark:bg-[#202823] rounded-[2rem] p-8 lg:p-10 shadow-[0_8px_30px_rgba(0,0,0,0.04)] dark:shadow-none border border-transparent dark:border-white/5 transition-colors duration-300">
          
          <p className="text-[#728C69] dark:text-[#A5B29A] text-xs font-bold mb-2 tracking-wide">Paso 2 de 2</p>
          <h1 className="font-serif text-3xl lg:text-4xl text-[#1E201D] dark:text-white mb-2">Crea tu perfil</h1>
          <p className="text-sm text-[#63665E] dark:text-[#9EA399] mb-6">Personaliza tus recomendaciones sustentables.</p>

          <div className="h-2 w-full bg-[#E3E5D8] dark:bg-[#2A352F] rounded-full mb-8">
            <div className="h-full w-full bg-[#728C69] dark:bg-[#85A07A] rounded-full transition-all duration-500"></div>
          </div>

          <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
            <div>
              <label className="text-xs font-medium text-[#232621] dark:text-[#D1D5CD] block mb-2">¿Cómo te llamamos?</label>
              <input
                type="text"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                placeholder="Mariana"
                className="w-full bg-[#F2EFE9] dark:bg-[#18201C] text-[#232621] dark:text-white placeholder-[#8C9287] dark:placeholder-[#63665E] rounded-xl px-4 h-12 text-sm focus:outline-none focus:ring-2 focus:ring-[#C81D77]/50 border border-transparent dark:border-white/5 transition-colors duration-300"
              />
            </div>
            <div>
              <label className="text-xs font-medium text-[#232621] dark:text-[#D1D5CD] block mb-3">¿Qué te gustaría explorar?</label>
              <div className="flex flex-wrap gap-2">
                {opcionesExplorar.map((opcion) => (
                  <button
                    key={opcion}
                    type="button"
                    onClick={() => toggleExplorar(opcion)}
                    className={`px-4 py-2 rounded-full text-xs font-medium transition-all duration-300 border ${explorar.includes(opcion) ? "bg-[#728C69] dark:bg-[#85A07A] text-white border-transparent" : "bg-white dark:bg-[#252D28] text-[#63665E] dark:text-[#A5B29A] border-[#E3E5D8] dark:border-white/10 hover:border-[#728C69]"}`}
                  >
                    {opcion}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="text-xs font-medium text-[#232621] dark:text-[#D1D5CD] block mb-3">¿Cómo quieres viajar?</label>
              <div className="grid grid-cols-3 gap-3">
                {opcionesViaje.map((viaje) => (
                  <button
                    key={viaje.id}
                    type="button"
                    onClick={() => toggleViaje(viaje.id)}
                    className={`flex flex-col items-center justify-center p-4 rounded-2xl border transition-all duration-300 ${estiloViaje.includes(viaje.id) ? "border-[#728C69] dark:border-[#85A07A] bg-[#728C69]/5 dark:bg-[#85A07A]/10 text-[#728C69] dark:text-[#A5B29A]" : "border-[#E3E5D8] dark:border-white/10 bg-white dark:bg-[#252D28] text-[#63665E] dark:text-[#9EA399] hover:border-[#728C69]/50"}`}
                  >
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="mb-2">
                      {viaje.icon}
                      {viaje.id === "Al aire libre" && <circle cx="12" cy="12" r="4" />} 
                    </svg>
                    <span className="text-[10px] font-medium text-center leading-tight">{viaje.id}</span>
                  </button>
                ))}
              </div>
            </div>
            <div className="pt-4">
              <button type="button" className="w-full bg-[#728C69] hover:bg-[#5B7153] dark:bg-[#85A07A] dark:hover:bg-[#A5B29A] dark:text-[#18201C] text-white font-semibold rounded-xl h-12 transition-colors duration-300 mb-4">
                Guardar y continuar
              </button>
              <p className="text-center text-[10px] text-[#8C9287] dark:text-[#9EA399]">Podrás cambiar estas preferencias cuando quieras.</p>
            </div>
          </form>
        </div>
      </section>
      
    </main>
  );
}