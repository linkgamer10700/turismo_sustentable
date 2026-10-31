"use client";

import React from "react";
import Link from "next/link";

export default function FavoritosPage() {
  // Datos simulados para la galería de favoritos
  const favoritos = [
    { id: 1, titulo: "Santuario de las Luciérnagas", ubicacion: "Tlaxcala", categoria: "Naturaleza", rating: "4.9", precio: "$450" },
    { id: 2, titulo: "Ruta del Café Orgánico", ubicacion: "Chiapas", categoria: "Gastronomía", rating: "4.8", precio: "$850" },
    { id: 3, titulo: "Taller de Alebrijes", ubicacion: "Oaxaca", categoria: "Cultura", rating: "5.0", precio: "$300" },
    { id: 4, titulo: "Cenotes Ocultos", ubicacion: "Yucatán", categoria: "Aventura", rating: "4.9", precio: "$1,200" },
  ];

  return (
    <main className="min-h-screen w-full bg-[#F4F1EA] dark:bg-[#1E2420] transition-colors duration-300 py-8 px-4 flex justify-center pb-24">
      <div className="w-full max-w-4xl flex flex-col">
        
        {/* Encabezado con botón de regreso */}
        <div className="flex items-center gap-4 mb-8">
          <Link 
            href="/perfil"
            className="w-10 h-10 rounded-full bg-white dark:bg-[#2A312C] flex items-center justify-center shadow-sm text-[#728C69] dark:text-[#A5B29A] hover:bg-[#E3E5D8] dark:hover:bg-[#3D453F] transition-colors"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m15 18-6-6 6-6"/></svg>
          </Link>
          <div>
            <h1 className="font-serif text-3xl text-[#1E201D] dark:text-white">Mis Favoritos</h1>
            <p className="text-sm text-[#63665E] dark:text-[#A5B29A]">12 experiencias guardadas</p>
          </div>
        </div>

        {/* Cuadrícula de Tarjetas */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {favoritos.map((item) => (
            <div key={item.id} className="bg-white dark:bg-[#2A312C] rounded-[1.5rem] overflow-hidden shadow-sm border border-transparent dark:border-white/5 group">
              
              {/* Imagen simulada de la tarjeta */}
              <div className="relative h-48 bg-[#B0C49F] dark:bg-[#364935] w-full overflow-hidden">
                {/* Botón de corazón activo (favorito) */}
                <button className="absolute top-4 right-4 z-10 w-8 h-8 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-white/40 transition-colors">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="2"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/></svg>
                </button>
                {/* Decoración SVG para simular paisaje */}
                <svg viewBox="0 0 400 200" preserveAspectRatio="none" className="absolute bottom-0 left-0 w-full h-[60%] opacity-50">
                  <polygon points="0,200 100,100 200,200" fill="#728C69" />
                  <polygon points="150,200 250,50 400,200" fill="#4B6846" />
                </svg>
              </div>

              {/* Contenido de la tarjeta */}
              <div className="p-5">
                <div className="flex justify-between items-start mb-2">
                  <span className="text-[10px] font-bold tracking-widest text-[#8C9287] uppercase">{item.categoria}</span>
                  <div className="flex items-center gap-1 text-[#D98A5F]">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
                    <span className="text-xs font-medium text-[#63665E] dark:text-[#A5B29A]">{item.rating}</span>
                  </div>
                </div>
                
                <h3 className="font-serif text-lg text-[#1E201D] dark:text-white leading-tight mb-1">{item.titulo}</h3>
                <p className="text-xs text-[#63665E] dark:text-[#9EA399] mb-4 flex items-center gap-1">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
                  {item.ubicacion}
                </p>
                
                <div className="flex items-center justify-between pt-4 border-t border-[#E3E5D8] dark:border-[#3D453F]">
                  <span className="text-sm font-medium text-[#1E201D] dark:text-white">{item.precio} <span className="text-xs text-[#8C9287] font-normal">/ pers</span></span>
                  <Link href="/recomendaciones" className="text-xs font-semibold text-[#728C69] dark:text-[#A5B29A] hover:underline">
                    Ver detalles
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