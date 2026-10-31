"use client";

import React, { useState } from "react";
import Link from "next/link";

import TarjetaActividad from "@/components/TarjetaActividad"; 

export default function BusquedaPage() {
  const [activeFilter, setActiveFilter] = useState("Para ti");
  const filters = ["Para ti", "Naturaleza", "Con mascotas", "Comida vegana"];

  const results = [
    { 
      id: 1, 
      titulo: "Santuario de Luciérnagas", 
      ubicacion: "Tlaxcala", 
      categoria: "Naturaleza", 
      rating: "4.9", 
      precio: "$450",
      imagenColor: "bg-[#A1B39D]" 
    },
    { 
      id: 2, 
      titulo: "Ruta del Café Orgánico", 
      ubicacion: "Chiapas", 
      categoria: "Gastronomía", 
      rating: "4.8", 
      precio: "$850",
      imagenColor: "bg-[#7BA2A2]" 
    },
    { 
      id: 3, 
      titulo: "Cenotes Ocultos", 
      ubicacion: "Yucatán", 
      categoria: "Aventura", 
      rating: "4.9", 
      precio: "$1,200",
      imagenColor: "bg-[#B3866A]" 
    },
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
            className="w-full bg-white dark:bg-[#252D28] border border-transparent dark:border-white/5 rounded-full pl-12 pr-4 h-14 text-sm focus:outline-none focus:ring-2 focus:ring-[#728C69] transition-all text-[#1E201D] dark:text-white"
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

        {/* Listado de Tarjetas usando tu nuevo componente */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {results.map((item) => (
            <TarjetaActividad 
              key={item.id}
              id={item.id}
              titulo={item.titulo}
              ubicacion={item.ubicacion}
              categoria={item.categoria}
              precio={item.precio}
              rating={item.rating}
              imagenColor={item.imagenColor}
            />
          ))}
        </div>

      </div>
    </main>
  );
}