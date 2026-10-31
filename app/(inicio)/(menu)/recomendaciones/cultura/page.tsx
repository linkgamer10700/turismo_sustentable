import React from "react";
import Link from "next/link";
import Image from "next/image";

export default function NaturalezaPage() {
  const destinations = [
    { name: "Milpa Alta", size: "w-24 h-24 lg:w-32 lg:h-32", top: "10%", left: "15%", bg: "bg-[#F2EFE9] dark:bg-[#18201C]", icon: false },
    { name: "Xochimilco", size: "w-40 h-40 lg:w-56 lg:h-56", top: "50%", left: "10%", bg: "bg-white dark:bg-[#252D28]", icon: true },
    { name: "Bosque de Tlalpan", size: "w-32 h-32 lg:w-44 lg:h-44", top: "20%", left: "30%", bg: "bg-[#E3E5D8] dark:bg-[#2A352F]", icon: true },
    { name: "Cuemanco", size: "w-28 h-28 lg:w-36 lg:h-36", top: "65%", left: "32%", bg: "bg-[#C3CEB9] dark:bg-[#3B523E]", icon: true },
    { name: "Los Dinamos", size: "w-20 h-20 lg:w-28 lg:h-28", top: "8%", left: "48%", bg: "bg-[#B0C49F] dark:bg-[#4B6846]", icon: false },
    { name: "Ajusco", size: "w-48 h-48 lg:w-64 lg:h-64", top: "40%", left: "50%", bg: "bg-white dark:bg-[#252D28]", icon: true },
    { name: "Desierto de los Leones", size: "w-32 h-32 lg:w-40 lg:h-40", top: "60%", left: "70%", bg: "bg-[#B0C49F] dark:bg-[#4B6846]", icon: true },
    { name: "Chapultepec", size: "w-36 h-36 lg:w-48 lg:h-48", top: "15%", left: "72%", bg: "bg-[#E3E5D8] dark:bg-[#2A352F]", icon: true },
    { name: "Cerro de la Estrella", size: "w-24 h-24 lg:w-32 lg:h-32", top: "45%", left: "88%", bg: "bg-[#F2EFE9] dark:bg-[#18201C]", icon: false },
  ];

  return (
    <main className="relative min-h-screen w-full flex flex-col bg-[#F2EFE9] dark:bg-[#18201C] transition-colors duration-300 py-12 px-6 lg:px-16 overflow-hidden">
      
      {/* Botón de retorno estilo Login */}
      <div className="absolute top-6 right-6 lg:top-8 lg:right-10 z-30">
        <Link 
          href="/recomendaciones" 
          className="flex items-center justify-center w-10 h-10 rounded-full bg-white dark:bg-[#202823] shadow-sm hover:bg-[#E5E4DB] dark:hover:bg-[#2A352F] text-[#3B523E] dark:text-[#E2E4DE] transition-colors duration-300 border border-transparent dark:border-white/10"
          title="Volver a Recomendaciones"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="m15 18-6-6 6-6"/>
          </svg>
        </Link>
      </div>

      <div className="w-full flex justify-between items-end mb-8 relative z-10 border-b-2 border-pink-200/50 dark:border-pink-900/30 pb-4">
        <div>
          <span className="text-[#C81D77] dark:text-[#E24A96] text-xs font-bold tracking-[0.2em] uppercase block mb-1">
            Categoría
          </span>
          <h1 className="font-serif text-5xl lg:text-6xl text-[#1E201D] dark:text-white">
            Cultura
          </h1>
        </div>
        
        <button className="flex items-center gap-2 text-xs font-medium text-[#728C69] dark:text-[#A5B29A] hover:text-[#4B6846] transition-colors mr-16">
          <Image src="/hoja.svg" alt="Filtro" width={14} height={14} className="opacity-70 dark:hidden" />
          <Image src="/hoja_oscura.svg" alt="Filtro" width={14} height={14} className="hidden dark:block" />
          Límite de filtro
        </button>
      </div>

      <div className="relative w-full h-[700px] lg:h-[800px] mt-4 flex-1">
        {destinations.map((dest, index) => (
          <div 
            key={index}
            className="absolute flex flex-col items-center justify-center -translate-x-1/2 -translate-y-1/2 group hover:z-20"
            style={{ top: dest.top, left: dest.left }}
          >
            <Link 
              href={`/recomendaciones/cultura/${dest.name.toLowerCase().replace(/\s+/g, '-')}`}
              className={`
                ${dest.size} ${dest.bg}
                rounded-full flex flex-col items-center justify-center text-center p-4
                border border-[#728C69]/40 shadow-[0_8px_30px_rgba(0,0,0,0.08)]
                transition-transform duration-300 hover:scale-105
              `}
            >
              {/* Inserción del ícono desde la carpeta public */}
              {dest.icon && (
                <div className="mb-1 opacity-70">
                  <Image src="/hoja.svg" alt="Naturaleza" width={16} height={16} className="dark:hidden" />
                  <Image src="/hoja_oscura.svg" alt="Naturaleza" width={16} height={16} className="hidden dark:block" />
                </div>
              )}
              <span className="font-serif text-[#1E201D] dark:text-white text-sm lg:text-lg leading-tight">
                {dest.name}
              </span>
            </Link>

            <div className="flex flex-col gap-1 mt-3 opacity-30 group-hover:opacity-60 transition-opacity">
              <div className="w-1.5 h-1.5 rounded-full bg-[#728C69]" />
              <div className="w-1 h-1 rounded-full bg-[#728C69] mx-auto" />
              <div className="w-0.5 h-0.5 rounded-full bg-[#728C69] mx-auto" />
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}