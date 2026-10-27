"use client";

import React, { useState } from "react";
import Link from "next/link";

export default function RegisterPage() {

  const [nombre, setNombre] = useState("");
  const [explorar, setExplorar] = useState<string[]>(["Naturaleza", "Aventura"]);
  const [estiloViaje, setEstiloViaje] = useState<string[]>([]);

  const opcionesExplorar = ["Naturaleza", "Gastronomía", "Cultura", "Comunidad", "Aventura"];
  const opcionesViaje = [
    { 
      id: "Accesible", 
      // Se cambió el texto <3 por un SVG de corazón
      icon: <svg className="mb-2" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg> 
    },
    { 
      id: "Bajo impacto", 
      icon: <svg className="mb-2" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg> 
    },
    { 
      id: "Al aire libre", 
      icon: <svg className="mb-2" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41"/></svg> 
    }
  ];

  const toggleExplorar = (opcion: string) => {
    setExplorar(prev => prev.includes(opcion) ? prev.filter(i => i !== opcion) : [...prev, opcion]);
  };

  const toggleViaje = (id: string) => {
    setEstiloViaje(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
  };

  return (
    <main className="relative min-h-screen w-full flex flex-col lg:flex-row bg-[#F4F1EA] dark:bg-[#1E2420] transition-colors duration-300">
      

      <div className="absolute top-6 right-6 lg:top-8 lg:right-10 z-30">
        <Link 
          href="/login/loginUser" 
          className="flex items-center justify-center w-10 h-10 rounded-full bg-white dark:bg-[#2A312C] shadow-sm hover:bg-[#E5E4DB] dark:hover:bg-[#3D453F] text-[#3B523E] dark:text-[#E2E4DE] transition-colors duration-300 border border-transparent dark:border-white/10"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="m15 18-6-6 6-6"/>
          </svg>
        </Link>
      </div>

      <section className="relative w-full lg:w-1/2 min-h-[40vh] lg:min-h-screen bg-[#B0C49F] overflow-hidden flex flex-col justify-between p-8 lg:p-16">
        <div className="absolute inset-0 z-10 flex items-end justify-center pointer-events-none">
          <div className="absolute top-[30%] right-[25%] w-24 h-24 lg:w-32 lg:h-32 rounded-full bg-[#EFE2BA]" />
          <svg viewBox="0 0 800 400" preserveAspectRatio="none" className="absolute bottom-[35%] lg:bottom-[30%] left-0 w-full h-[50%] lg:h-[60%]">
            <polygon points="0,400 50,150 120,400" fill="#728C69" />
            <polygon points="80,400 160,100 240,400" fill="#728C69" />
            <polygon points="200,400 280,180 350,400" fill="#728C69" />
            <polygon points="300,400 380,80 460,400" fill="#728C69" />
            <polygon points="420,400 500,120 580,400" fill="#728C69" />
            <polygon points="540,400 620,90 700,400" fill="#728C69" />
            <polygon points="660,400 740,160 800,400" fill="#728C69" />
            <polygon points="-20,400 80,200 160,400" fill="#4B6846" />
            <polygon points="120,400 210,130 290,400" fill="#4B6846" />
            <polygon points="250,400 330,220 400,400" fill="#4B6846" />
            <polygon points="350,400 440,110 520,400" fill="#4B6846" />
            <polygon points="480,400 560,190 640,400" fill="#4B6846" />
            <polygon points="600,400 690,140 780,400" fill="#4B6846" />
            <polygon points="730,400 820,250 880,400" fill="#4B6846" />
          </svg>
          <div className="absolute bottom-0 left-0 w-full h-[35%] lg:h-[30%] bg-[#364935]" />
        </div>
        <div className="z-20 text-white relative">
          <h1 className="font-serif text-4xl lg:text-5xl leading-tight">
            Viaja ligero.<br />
            Deja huella verde.
          </h1>
        </div>
      </section>

      <section className="relative w-full lg:w-1/2 flex items-center justify-center p-6 lg:p-16 isolate">
        
        <div className="w-full max-w-md">
          

          <h1 className="font-serif text-4xl text-[#1E201D] dark:text-white mb-2">Crea tu perfil</h1>
          <p className="text-sm text-[#63665E] dark:text-[#A5B29A] mb-6">Personaliza tus recomendaciones sustentables.</p>

          <div className="h-2 w-full bg-[#E3E5D8] dark:bg-[#3D453F] rounded-full mb-10">
            <div className="h-full w-full bg-[#728C69] dark:bg-[#A5B29A] rounded-full transition-all duration-500"></div>
          </div>

          <form className="space-y-8" onSubmit={(e) => e.preventDefault()}>
            

            <div>
              <label className="text-sm font-medium text-[#4A4D46] dark:text-[#D1D5CD] block mb-3">
                ¿Cómo te llamamos?
              </label>
              <input
                type="text"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                placeholder="Nombre o apodo"
                className="w-full bg-white dark:bg-[#2A312C] text-[#232621] dark:text-white border border-[#D1D5CD] dark:border-[#3D453F] rounded-2xl px-4 py-4 text-sm focus:outline-none focus:ring-2 focus:ring-[#728C69]/50 transition-colors"
              />
            </div>


            <div>
              <label className="text-sm font-medium text-[#4A4D46] dark:text-[#D1D5CD] block mb-3">
                ¿Qué te gustaría explorar?
              </label>
              <div className="flex flex-wrap gap-3">
                {opcionesExplorar.map((opcion) => {
                  const isActive = explorar.includes(opcion);
                  return (
                    <button
                      key={opcion}
                      type="button"
                      onClick={() => toggleExplorar(opcion)}
                      className={`px-5 py-2.5 rounded-full text-xs font-medium transition-all duration-300 border ${
                        isActive 
                          ? "bg-[#728C69] dark:bg-[#A5B29A] text-white dark:text-[#1E2420] border-transparent" 
                          : "bg-white dark:bg-[#2A312C] text-[#4A4D46] dark:text-[#D1D5CD] border-[#D1D5CD] dark:border-[#3D453F] hover:border-[#728C69]"
                      }`}
                    >
                      {opcion}
                    </button>
                  );
                })}
              </div>
            </div>


            <div>
              <label className="text-sm font-medium text-[#4A4D46] dark:text-[#D1D5CD] block mb-3">
                ¿Cómo quieres viajar?
              </label>
              <div className="grid grid-cols-3 gap-4">
                {opcionesViaje.map((viaje) => {
                  const isActive = estiloViaje.includes(viaje.id);
                  return (
                    <button
                      key={viaje.id}
                      type="button"
                      onClick={() => toggleViaje(viaje.id)}
                      className={`flex flex-col items-center justify-center p-4 rounded-2xl border transition-all duration-300 aspect-square ${
                        isActive 
                          ? "border-[#728C69] dark:border-[#A5B29A] bg-[#728C69]/5 dark:bg-[#A5B29A]/10 text-[#728C69] dark:text-[#A5B29A]" 
                          : "border-[#D1D5CD] dark:border-[#3D453F] bg-white dark:bg-[#2A312C] text-[#4A4D46] dark:text-[#D1D5CD] hover:border-[#728C69]/50"
                      }`}
                    >
                      {viaje.icon}
                      <span className="text-xs font-medium text-center">{viaje.id}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Botón Final */}
            <div className="pt-6">
              <button 
                type="button"
                className="w-full bg-[#728C69] hover:bg-[#5B7153] dark:bg-[#A5B29A] dark:hover:bg-[#85A07A] dark:text-[#1E2420] text-white font-semibold rounded-2xl py-4 transition-colors duration-300 mb-4 shadow-sm"
              >
                Guardar y continuar
              </button>
              <p className="text-center text-xs text-[#8C9287] dark:text-[#A5B29A]">
                Podrás cambiar estas preferencias cuando quieras.
              </p>
            </div>

          </form>
        </div>
      </section>
      
    </main>
  );
}