"use client";

import React from "react";
import Image from "next/image";

export default function AboutPage() {
  return (
    <main className="relative min-h-[calc(100vh-80px)] w-full overflow-hidden bg-[#F2EFE9] dark:bg-[#18201C] text-[#232621] dark:text-[#E2E4DE] isolate flex items-center justify-center px-6 py-12 md:px-16 lg:px-24 transition-colors duration-300">
      
      {/* =================================================================
          1. CÍRCULO VERDE GRANDE DE FONDO (Tamaño ajustado y color fijo)
         ================================================================= */}
      <div
        className="pointer-events-none absolute -top-[150px] -right-[150px] w-[500px] h-[500px] lg:-top-[250px] lg:-right-[250px] lg:w-[850px] lg:h-[850px] rounded-full bg-[#E3E5D8] dark:bg-[#202823] -z-10 transition-colors duration-300"
        aria-hidden="true"
      />

      <div className="mx-auto grid max-w-7xl w-full grid-cols-1 items-center gap-16 lg:grid-cols-12 lg:gap-12">
        
        {/* =================================================================
            COLUMNA IZQUIERDA: Círculo central + Órbita
           ================================================================= */}
        <div className="relative flex items-center justify-center lg:col-span-6">
          <div className="relative flex items-center justify-center w-[340px] h-[340px] sm:w-[440px] sm:h-[440px] md:w-[480px] md:h-[480px]">
            
            {/* Contenedor de Órbita Animada */}
            <div className="absolute inset-0 animate-[spin_40s_linear_infinite]">
              
              {/* Anillo exterior punteado */}
              <div className="absolute inset-0 rounded-full border-[2px] border-dashed border-[#A5B29A]/60 dark:border-[#38463D]/80" />

              {/* Satélite 1 (Arriba): ROSA MAGENTA -> usa hoja_oscura.svg */}
              <div className="absolute -top-5 left-1/2 -translate-x-1/2 w-11 h-11 rounded-full bg-[#C81D77] border-[3px] border-[#F2EFE9] dark:border-[#18201C] shadow-sm flex items-center justify-center [animation:reverse-spin_40s_linear_infinite] transition-colors duration-300">
                <Image
                  src="/hoja_oscura.svg" 
                  alt="Hoja oscura"
                  width={20}
                  height={20}
                  className="w-5 h-5 object-contain"
                />
              </div>

              {/* Satélite 2 (Abajo a la izquierda): GRIS -> usa hoja.svg */}
              <div className="absolute bottom-10 left-0 w-11 h-11 rounded-full bg-[#EBE9E0] dark:bg-[#2A352F] border-[3px] border-[#F2EFE9] dark:border-[#18201C] shadow-sm flex items-center justify-center [animation:reverse-spin_40s_linear_infinite] transition-colors duration-300">
                <Image
                  src="/hoja.svg" 
                  alt="Hoja clara"
                  width={20}
                  height={20}
                  className="w-5 h-5 object-contain"
                />
              </div>

              {/* Satélite 3 (Derecha medio): VERDE SÓLIDO -> usa hoja_oscura.svg */}
              <div className="absolute top-1/2 -right-5 -translate-y-1/2 w-11 h-11 rounded-full bg-[#7D9675] dark:bg-[#526B4A] border-[3px] border-[#F2EFE9] dark:border-[#18201C] shadow-sm flex items-center justify-center [animation:reverse-spin_40s_linear_infinite] transition-colors duration-300">
                <Image
                  src="/hoja_oscura.svg" 
                  alt="Hoja oscura"
                  width={20}
                  height={20}
                  className="w-5 h-5 object-contain"
                />
              </div>
            </div>

            {/* =============================================================
                CÍRCULO CENTRAL: Paisaje guardado + Espacio listo para el Logo
               ============================================================= */}
            <div className="relative w-[300px] h-[300px] sm:w-[390px] sm:h-[390px] md:w-[425px] md:h-[425px] rounded-full overflow-hidden shadow-inner flex items-center justify-center bg-[#DFCFAF]">
              <div className="relative w-full h-full">
                {/* Sol */}
                <div className="absolute top-[22%] right-[20%] w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-[#EFE2BA]" />

                {/* Montañas en SVG */}
                <svg
                  viewBox="0 0 400 250"
                  preserveAspectRatio="none"
                  className="absolute bottom-[28%] left-0 w-full h-[45%]"
                >
                  <polygon points="-20,250 115,65 270,250" fill="#AAB08E" />
                  <polygon points="160,250 305,95 430,250" fill="#AAB08E" />
                </svg>

                {/* Mar / Agua con olas */}
                <div className="absolute bottom-0 left-0 w-full h-[33%] bg-[#729794]">
                  <svg
                    viewBox="0 0 400 100"
                    preserveAspectRatio="none"
                    className="w-full h-full"
                  >
                    <path
                      d="M-10,25 Q90,5 200,25 T410,25"
                      fill="none"
                      stroke="#F2EFE9"
                      strokeWidth="4"
                    />
                    <path
                      d="M-10,65 Q120,45 240,65 T410,60"
                      fill="none"
                      stroke="#F2EFE9"
                      strokeWidth="3.5"
                    />
                  </svg>
                </div>
              </div>
            </div>

            {/* Pastilla flotante: "Hecho en CDMX" */}
            <div className="absolute bottom-5 right-8 sm:bottom-6 sm:right-14 z-20 flex items-center gap-2.5 rounded-full bg-[#FAF9F5] dark:bg-[#1E2722] px-5 py-2.5 shadow-[0_8px_20px_rgba(0,0,0,0.08)] border border-black/5 dark:border-white/10 transition-colors duration-300">
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#C81D77"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z" />
                <path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12" />
              </svg>
              <span className="text-xs sm:text-sm font-medium text-[#2A2D27] dark:text-[#D1D5CD]">
                Hecho en CDMX
              </span>
            </div>

          </div>
        </div>

        {/* =================================================================
            COLUMNA DERECHA: Información "Nosotros somos", Misión y Visión
           ================================================================= */}
        <div className="flex flex-col justify-center space-y-8 lg:col-span-6">
          
          <div className="space-y-4">
            <h1 className="font-serif text-5xl sm:text-6xl md:text-7xl font-normal tracking-tight text-[#1E201D] dark:text-white transition-colors duration-300">
              Nosotros{" "}
              <span className="font-serif italic font-normal text-[#C81D77] text-3xl sm:text-4xl md:text-[42px] ml-1">
                somos
              </span>
            </h1>
            <p className="max-w-xl text-base sm:text-lg leading-relaxed text-[#5A5D56] dark:text-[#A3A89E] transition-colors duration-300">
              Un ecosistema digital que conecta a turistas con experiencias
              ecológicamente responsables en la Ciudad de México. Reseñas y
              fotos de la comunidad validan el impacto real de cada lugar.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 max-w-xl">
            {/* Card: Misión */}
            <div className="rounded-3xl bg-[#FAF8F5] dark:bg-[#202823] p-6 shadow-[0_4px_20px_rgba(0,0,0,0.04)] border border-black/[0.04] dark:border-white/[0.06] flex flex-col justify-between space-y-3 transition-colors duration-300">
              <div className="w-11 h-11 rounded-full bg-[#E5E4DC] dark:bg-[#2A352F] flex items-center justify-center transition-colors duration-300">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#3B523E" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z" />
                  <path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12" />
                </svg>
              </div>
              <h2 className="font-serif text-2xl font-medium text-[#1E201D] dark:text-white transition-colors duration-300">
                Misión
              </h2>
              <p className="text-sm leading-relaxed text-[#63665E] dark:text-[#9EA399] transition-colors duration-300">
                Fomentar un turismo que proteja el entorno y beneficie a las
                comunidades locales.
              </p>
            </div>

            {/* Card: Visión */}
            <div className="rounded-3xl bg-[#FAF8F5] dark:bg-[#202823] p-6 shadow-[0_4px_20px_rgba(0,0,0,0.04)] border border-black/[0.04] dark:border-white/[0.06] flex flex-col justify-between space-y-3 transition-colors duration-300">
              <div className="w-11 h-11 rounded-full bg-[#F5DCE8] dark:bg-[#382430] flex items-center justify-center transition-colors duration-300">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#C81D77" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z" />
                  <path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12" />
                </svg>
              </div>
              <h2 className="font-serif text-2xl font-medium text-[#1E201D] dark:text-white transition-colors duration-300">
                Visión
              </h2>
              <p className="text-sm leading-relaxed text-[#63665E] dark:text-[#9EA399] transition-colors duration-300">
                Que la visibilidad de cada destino dependa de su respeto
                comprobable por el ecosistema.
              </p>
            </div>
          </div>

          {/* Estadísticas inferiores */}
          <div className="flex flex-wrap items-center gap-10 sm:gap-14 pt-2">
            <div>
              <p className="font-serif text-3xl sm:text-4xl text-[#3B523E] dark:text-[#A7B8A9] transition-colors duration-300">CDMX</p>
              <p className="text-xs text-[#6E7168] dark:text-[#8C9287] mt-1 transition-colors duration-300">Alcance</p>
            </div>
            <div>
              <p className="font-serif text-3xl sm:text-4xl text-[#3B523E] dark:text-[#A7B8A9] transition-colors duration-300">ES · EN</p>
              <p className="text-xs text-[#6E7168] dark:text-[#8C9287] mt-1 transition-colors duration-300">Bilingüe</p>
            </div>
            <div>
              <p className="font-serif text-3xl sm:text-4xl text-[#3B523E] dark:text-[#A7B8A9] transition-colors duration-300">0</p>
              <p className="text-xs text-[#6E7168] dark:text-[#8C9287] mt-1 transition-colors duration-300">Sensores físicos</p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}