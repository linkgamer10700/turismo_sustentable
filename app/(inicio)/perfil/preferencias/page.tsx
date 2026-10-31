"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function PreferenciasPage() {
  const router = useRouter();

  // Cargamos los intereses que el usuario ya tenía (simulados)
  const [explorar, setExplorar] = useState<string[]>(["Naturaleza", "Aventura", "Comunidad"]);
  const [estiloViaje, setEstiloViaje] = useState<string[]>(["Bajo impacto"]);

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

  const handleGuardarPreferencias = (e: React.FormEvent) => {
    e.preventDefault();
    alert("¡Preferencias actualizadas! Ahora verás mejores recomendaciones.");
    router.push("/perfil");
  };

  return (
    <main className="min-h-screen w-full bg-[#F4F1EA] dark:bg-[#1E2420] transition-colors duration-300 py-8 px-4 flex justify-center pb-24">
      <div className="w-full max-w-md flex flex-col">
        
        {/* Encabezado con botón de regreso */}
        <div className="flex items-center gap-4 mb-8">
          <Link 
            href="/perfil"
            className="w-10 h-10 rounded-full bg-white dark:bg-[#2A312C] flex items-center justify-center shadow-sm text-[#728C69] dark:text-[#A5B29A] hover:bg-[#E3E5D8] dark:hover:bg-[#3D453F] transition-colors"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m15 18-6-6 6-6"/></svg>
          </Link>
          <div>
            <h1 className="font-serif text-3xl text-[#1E201D] dark:text-white">Tus intereses</h1>
            <p className="text-sm text-[#63665E] dark:text-[#A5B29A]">Ajusta tus recomendaciones</p>
          </div>
        </div>

        {/* Formulario de selección */}
        <div className="bg-white dark:bg-[#2A312C] rounded-[1.5rem] p-6 shadow-sm border border-transparent dark:border-white/5">
          <form className="space-y-6" onSubmit={handleGuardarPreferencias}>
            
            <div>
              <label className="text-sm font-bold text-[#1E201D] dark:text-white block mb-3">¿Qué te gustaría explorar?</label>
              <div className="flex flex-wrap gap-2">
                {opcionesExplorar.map((opcion) => (
                  <button
                    key={opcion}
                    type="button"
                    onClick={() => toggleExplorar(opcion)}
                    className={`px-4 py-2 rounded-full text-xs font-medium transition-all duration-300 border ${explorar.includes(opcion) ? "bg-[#728C69] dark:bg-[#85A07A] text-white border-transparent" : "bg-[#F4F1EA] dark:bg-[#18201C] text-[#4A4D46] dark:text-[#D1D5CD] border-transparent hover:border-[#728C69]/30"}`}
                  >
                    {opcion}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-sm font-bold text-[#1E201D] dark:text-white block mb-3 mt-2">¿Cómo quieres viajar?</label>
              <div className="grid grid-cols-3 gap-3">
                {opcionesViaje.map((viaje) => {
                  const isActive = estiloViaje.includes(viaje.id);
                  return (
                    <button
                      key={viaje.id}
                      type="button"
                      onClick={() => toggleViaje(viaje.id)}
                      className={`flex flex-col items-center justify-center p-4 rounded-2xl border transition-all duration-300 aspect-square ${isActive ? "border-[#728C69] dark:border-[#A5B29A] bg-[#728C69]/5 dark:bg-[#A5B29A]/10 text-[#728C69] dark:text-[#A5B29A]" : "border-transparent bg-[#F4F1EA] dark:bg-[#18201C] text-[#4A4D46] dark:text-[#D1D5CD] hover:border-[#728C69]/30"}`}
                    >
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="mb-2">
                        {viaje.icon}
                      </svg>
                      <span className="text-[10px] font-medium text-center leading-tight">{viaje.id}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="pt-4 border-t border-[#E3E5D8] dark:border-[#3D453F]">
              <button type="submit" className="w-full bg-[#728C69] hover:bg-[#5B7153] dark:bg-[#85A07A] dark:hover:bg-[#A5B29A] text-white font-semibold rounded-xl h-12 transition-colors shadow-sm">
                Guardar preferencias
              </button>
            </div>
            
          </form>
        </div>

      </div>
    </main>
  );
}