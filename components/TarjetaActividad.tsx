"use client";

import React, { useState } from "react";
import Link from "next/link";

interface ActividadProps {
  id: string | number;
  titulo: string;
  ubicacion: string;
  categoria: string;
  precio: string;
  rating: string;
  imagenColor?: string; // Para simular la foto por ahora
}

export default function TarjetaActividad({ 
  id, 
  titulo, 
  ubicacion, 
  categoria, 
  precio, 
  rating,
  imagenColor = "bg-[#B0C49F]" 
}: ActividadProps) {
  
  const [isFavorite, setIsFavorite] = useState(false);

  const toggleFavorito = (e: React.MouseEvent) => {
    e.preventDefault(); // Evita que al hacer clic en el corazón te lleve a otra página
    setIsFavorite(!isFavorite);
    
    // Aquí en el futuro enviarías la petición a tu backend o base de datos
    if (!isFavorite) {
      console.log(`Actividad ${id} añadida a favoritos`);
    }
  };

  return (
    <div className="bg-white dark:bg-[#2A312C] rounded-[1.5rem] overflow-hidden shadow-sm border border-transparent dark:border-white/5 group hover:shadow-md transition-shadow">
      
      {/* Contenedor de la Imagen / Placeholder */}
      <div className={`relative h-56 w-full overflow-hidden ${imagenColor} dark:opacity-90`}>
        
        {/* Botón de Favorito (Corazón) */}
        <button 
          onClick={toggleFavorito}
          className="absolute top-4 right-4 z-20 w-9 h-9 bg-white/30 backdrop-blur-md rounded-full flex items-center justify-center text-white hover:bg-white/50 transition-all hover:scale-110 active:scale-95"
        >
          <svg 
            width="20" height="20" viewBox="0 0 24 24" 
            fill={isFavorite ? "#C81D77" : "none"} 
            stroke={isFavorite ? "#C81D77" : "currentColor"} 
            strokeWidth="2"
            className={`transition-colors duration-300 ${isFavorite ? "animate-in zoom-in-75 duration-200" : ""}`}
          >
            <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/>
          </svg>
        </button>

        {/* Etiqueta de Categoría Flotante */}
        <span className="absolute top-4 left-4 z-20 bg-black/40 backdrop-blur-md text-white text-[10px] font-bold tracking-widest uppercase px-3 py-1.5 rounded-full">
          {categoria}
        </span>

        {/* Decoración SVG para simular paisaje en lugar de foto */}
        <svg viewBox="0 0 400 200" preserveAspectRatio="none" className="absolute bottom-0 left-0 w-full h-[50%] opacity-40">
          <polygon points="0,200 150,80 300,200" fill="#1E2420" />
          <polygon points="200,200 300,120 400,200" fill="#364935" />
        </svg>
      </div>

      {/* Detalles de la Actividad */}
      <div className="p-5">
        <div className="flex justify-between items-start mb-2">
          <h3 className="font-serif text-xl text-[#1E201D] dark:text-white leading-tight flex-1 pr-2">{titulo}</h3>
          <div className="flex items-center gap-1 text-[#D98A5F] flex-shrink-0 bg-[#F4F1EA] dark:bg-[#18201C] px-2 py-1 rounded-md">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
            <span className="text-xs font-bold text-[#1E201D] dark:text-white">{rating}</span>
          </div>
        </div>
        
        <p className="text-sm text-[#63665E] dark:text-[#9EA399] mb-4 flex items-center gap-1.5">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
          {ubicacion}
        </p>
        
        <div className="flex items-center justify-between pt-4 border-t border-[#E3E5D8] dark:border-[#3D453F]">
          <div>
            <span className="text-xs text-[#8C9287] block mb-0.5">Desde</span>
            <span className="text-base font-bold text-[#1E201D] dark:text-white">{precio}</span>
          </div>
          <Link 
            href={`/actividades/${id}`} 
            className="bg-[#728C69] hover:bg-[#5B7153] text-white text-sm font-medium px-4 py-2 rounded-xl transition-colors"
          >
            Reservar
          </Link>
        </div>
      </div>
    </div>
  );
}