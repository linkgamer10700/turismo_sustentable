"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";

export default function LugarDetallePage({ params }: { params: { lugar: string } }) {
  // En el futuro, usarás 'params.lugar' para hacer fetch al backend y obtener estos datos
  const [personas, setPersonas] = useState(2);
  const [mascotas, setMascotas] = useState(0);

  return (
    <main className="min-h-screen w-full bg-[#F2EFE9] dark:bg-[#18201C] transition-colors duration-300 py-12 px-6 lg:px-16 flex justify-center">
      <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-2 gap-12">
        
        {/* Columna Izquierda: Imagen y Sustentabilidad */}
        <div className="relative w-full h-[600px] rounded-3xl overflow-hidden bg-[#B4CBB0] shadow-sm">
          {/* Aquí iría la imagen real del lugar, usando un SVG simulado por ahora */}
          <svg viewBox="0 0 400 600" className="w-full h-full object-cover" preserveAspectRatio="xMidYMid slice">
            <circle cx="320" cy="150" r="40" fill="#F4E6B4" />
            <polygon points="-50,600 150,300 350,600" fill="#758C6E" />
            <polygon points="100,600 280,400 450,600" fill="#586E52" />
            <polygon points="-20,600 80,450 180,600" fill="#3D4B38" />
          </svg>
          
          {/* Badge de Sustentabilidad */}
          <div className="absolute bottom-6 left-6 right-6 bg-white dark:bg-[#252D28] rounded-2xl p-4 shadow-lg">
            <span className="text-[10px] font-bold tracking-widest text-[#8C9287] uppercase block mb-2">Nivel de sustentabilidad</span>
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map((i) => (
                <Image key={i} src="/hoja.svg" alt="Hoja" width={16} height={16} className="opacity-80 dark:hidden" />
              ))}
            </div>
          </div>
        </div>

        {/* Columna Derecha: Información y Formulario de Reserva */}
        <div className="flex flex-col">
          <div className="flex gap-2 mb-6">
            <span className="bg-[#728C69] text-white text-xs font-medium px-3 py-1 rounded-full">Naturaleza</span>
            <span className="bg-[#E3E5D8] dark:bg-[#2A352F] text-[#3B523E] dark:text-[#A5B29A] text-xs font-medium px-3 py-1 rounded-full">2 h</span>
            <span className="bg-[#E3E5D8] dark:bg-[#2A352F] text-[#3B523E] dark:text-[#A5B29A] text-xs font-medium px-3 py-1 rounded-full">Mascotas ok</span>
          </div>

          <h1 className="font-serif text-4xl lg:text-5xl text-[#1E201D] dark:text-white mb-2 capitalize">
            {params.lugar.replace(/-/g, ' ')}
          </h1>
          <h2 className="text-xl text-[#728C69] dark:text-[#A5B29A] italic font-serif mb-4">Slogan del lugar</h2>
          <p className="text-[#63665E] dark:text-[#9EA399] text-sm leading-relaxed mb-8">
            Una experiencia pensada para disfrutar el entorno sin dejar huella, con grupos reducidos y guías locales.
          </p>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Maqueta de Calendario */}
            <div className="bg-white dark:bg-[#252D28] rounded-3xl p-6 shadow-[0_8px_30px_rgba(0,0,0,0.04)] border border-transparent dark:border-white/5">
              <div className="flex justify-between items-center mb-6">
                <span className="font-serif text-xl dark:text-white">Octubre 2026</span>
                <div className="flex gap-2 text-gray-400">
                  <button>&lt;</button>
                  <button>&gt;</button>
                </div>
              </div>
              <div className="grid grid-cols-7 gap-y-4 text-center text-xs mb-4">
                <span className="text-gray-400">L</span><span className="text-gray-400">M</span><span className="text-gray-400">M</span>
                <span className="text-gray-400">J</span><span className="text-gray-400">V</span><span className="text-gray-400">S</span>
                <span className="text-gray-400">D</span>
                {/* Fechas simuladas */}
                <span className="col-start-4">1</span><span>2</span><span>3</span><span>4</span>
                <span className="text-gray-300">5</span><span className="text-gray-300">6</span><span>7</span><span>8</span><span>9</span><span>10</span><span>11</span>
                <span className="text-gray-300">12</span><span className="text-gray-300">13</span><span>14</span><span>15</span>
                <span className="bg-[#C81D77] text-white rounded-full w-7 h-7 flex items-center justify-center mx-auto">16</span>
                <span>17</span><span>18</span>
              </div>
              <div className="flex gap-4 text-[10px] text-gray-500 justify-center border-t dark:border-white/10 pt-4 mt-2">
                <span className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-[#728C69]"></div> Disponible</span>
                <span className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-[#C81D77]"></div> Elegido</span>
                <span className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-gray-300"></div> Sin cupo</span>
              </div>
            </div>

            {/* Controles y Botón */}
            <div className="flex flex-col gap-6">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm font-medium dark:text-white">Personas</p>
                  <p className="text-xs text-gray-500">Incluyéndote a ti</p>
                </div>
                <div className="flex items-center gap-4">
                  <button onClick={() => setPersonas(Math.max(1, personas - 1))} className="text-gray-400 hover:text-gray-700 dark:hover:text-white">-</button>
                  <span className="font-medium dark:text-white w-4 text-center">{personas}</span>
                  <button onClick={() => setPersonas(personas + 1)} className="text-gray-400 hover:text-gray-700 dark:hover:text-white">+</button>
                </div>
              </div>

              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm font-medium dark:text-white">Mascotas</p>
                  <p className="text-xs text-gray-500">Animales de compañía</p>
                </div>
                <div className="flex items-center gap-4">
                  <button onClick={() => setMascotas(Math.max(0, mascotas - 1))} className="text-gray-400 hover:text-gray-700 dark:hover:text-white">-</button>
                  <span className="font-medium dark:text-white w-4 text-center">{mascotas}</span>
                  <button onClick={() => setMascotas(mascotas + 1)} className="text-gray-400 hover:text-gray-700 dark:hover:text-white">+</button>
                </div>
              </div>

              <textarea 
                placeholder="Observaciones&#10;¿Hay algo que debamos saber?"
                className="w-full bg-white dark:bg-[#252D28] border border-[#E3E5D8] dark:border-white/10 rounded-2xl p-4 text-sm resize-none h-24 focus:outline-none focus:ring-2 focus:ring-[#C81D77]/50"
              />

              <button className="w-full bg-[#C81D77] hover:bg-[#A91864] text-white font-medium rounded-full py-4 transition-colors flex justify-center items-center gap-2 mt-auto">
                Reservar
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14" /><path d="m12 5 7 7-7 7" /></svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}