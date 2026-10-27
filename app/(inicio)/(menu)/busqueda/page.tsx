"use client";

import React, { useState } from "react";
import Link from "next/link";

export default function BusquedaPage() {
  const [activeFilter, setActiveFilter] = useState("Para ti");
  const filters = ["Para ti", "Naturaleza", "Con mascotas", "Comida vegana"];
  
  // Arreglo simulado (mock) para iterar las tarjetas del backend
  const results = [
    { id: 1, title: "Nombre del lugar 1", desc: "Descripción breve del lugar y la experiencia.", tags: "2 h 30 min • Naturaleza", bg: "bg-[#A1B39D]" },
    { id: 2, title: "Nombre del lugar 2", desc: "Descripción breve del lugar y la experiencia.", tags: "Medio día • Gastronomía", bg: "bg-[#7BA2A2]" },
    { id: 3, title: "Nombre del lugar 3", desc: "Descripción breve del lugar y la experiencia.", tags: "Día completo • Aventura", bg: "bg-[#B3866A]" },
  ];

  return (
    <main className="min-h-screen w-full bg-[#F2EFE9] dark:bg-[#18201C] transition-colors duration-300 py-12 px-6 flex justify-center">
      <div className="w-full max-w-3xl flex flex-col">
        
        {/* Cabecera */}
        <h1 className="font-serif text-4xl lg:text-5xl text-[#1E201D] dark:text-white mb-2 leading-tight">
          Tu próxima aventura,<br />a tu manera.
        </h1>
        <p className="text-[#63665E] dark:text-[#9EA399] text-sm mb-8">
          Descubre lugares que conectan contigo.
        </p>

        {/* Buscador */}
        <div className="relative mb-6">
          <svg className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="8" />
            <path d="m21 21-4.3-4.3" />
          </svg>
          <input 
            type="text" 
            placeholder="Busca un lugar o una experiencia"
            className="w-full bg-white dark:bg-[#252D28] border border-transparent dark:border-white/5 rounded-full pl-12 pr-4 h-14 text-sm focus:outline-none focus:ring-2 focus:ring-[#728C69]/50 shadow-sm"
          />
        </div>

        {/* Filtros horizontales */}
        <div className="flex gap-2 overflow-x-auto pb-4 scrollbar-hide mb-8">
          {filters.map((f) => (
            <button 
              key={f}
              onClick={() => setActiveFilter(f)}
              className={`whitespace-nowrap px-5 py-2 rounded-full text-xs font-medium transition-colors border ${
                activeFilter === f 
                  ? "bg-[#728C69] text-white border-[#728C69]" 
                  : "bg-white dark:bg-[#252D28] text-[#63665E] dark:text-[#A5B29A] border-gray-200 dark:border-white/5 hover:border-[#728C69]"
              }`}
            >
              {f}
            </button>
          ))}
        </div>

        {/* Sección de resultados */}
        <div className="flex justify-between items-end mb-6">
          <div>
            <h2 className="font-serif text-2xl text-[#1E201D] dark:text-white">Recomendado para ti</h2>
            <p className="text-xs text-[#63665E] dark:text-[#9EA399] mt-1">Por tu interés en naturaleza y viajes tranquilos</p>
          </div>
          <button className="text-xs font-medium text-gray-500 hover:text-[#C81D77] transition-colors">Ver todo</button>
        </div>

        {/* Listado de Tarjetas */}
        <div className="flex flex-col gap-6">
          {results.map((item) => (
            <div key={item.id} className="bg-white dark:bg-[#252D28] rounded-3xl p-4 flex flex-col gap-4 shadow-sm border border-transparent dark:border-white/5">
              
              {/* Imagen/Ilustración del lugar */}
              <div className={`w-full h-40 ${item.bg} rounded-2xl overflow-hidden relative`}>
                <svg viewBox="0 0 400 150" className="w-full h-full object-cover opacity-80" preserveAspectRatio="xMidYMid slice">
                  <circle cx="320" cy="40" r="20" fill="#F4E6B4" />
                  <polygon points="-20,150 150,50 350,150" fill="rgba(0,0,0,0.1)" />
                  <polygon points="100,150 250,80 420,150" fill="rgba(0,0,0,0.2)" />
                </svg>
              </div>
              
              {/* Textos y enlace */}
              <div className="px-2 pb-2">
                <h3 className="font-serif text-xl text-[#1E201D] dark:text-white mb-1">{item.title}</h3>
                <p className="text-xs text-[#63665E] dark:text-[#9EA399] mb-4">{item.desc}</p>
                <div className="flex justify-between items-center">
                  <span className="text-[10px] text-gray-500 uppercase tracking-wider font-semibold">{item.tags}</span>
                  <Link href={`/recomendaciones/naturaleza/${item.title.toLowerCase().replace(/\s+/g, '-')}`} className="text-[#C81D77] dark:text-[#E24A96] text-xs font-medium flex items-center gap-1 hover:underline">
                    Ver experiencia <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14" /><path d="m12 5 7 7-7 7" /></svg>
                  </Link>
                </div>
              </div>

            </div>
          ))}
        </div>
        
      </div>
    </main>
  );
}