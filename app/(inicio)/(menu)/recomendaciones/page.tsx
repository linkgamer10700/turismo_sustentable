import React from "react";
import Link from "next/link";

const CardIllustration = ({ type }: { type: string }) => {
  switch (type) {
    case "Naturaleza":
      return (
        <svg viewBox="0 0 400 240" className="w-full h-full object-cover">
          <rect width="400" height="240" fill="#B4CBB0" />
          <circle cx="320" cy="60" r="30" fill="#F4E6B4" />
        
          <polygon points="-20,200 20,80 60,200 100,60 140,200 180,90 220,200 260,70 300,200 340,100 380,200 420,80" fill="#758C6E" />
          
          <polygon points="0,200 40,100 80,200 120,80 160,200 200,110 240,200 280,90 320,200 360,120 400,200" fill="#4B5E45" />
         
          <rect y="190" width="400" height="50" fill="#3D4B38" />
        </svg>
      );
    case "Relax":
      return (
        <svg viewBox="0 0 400 240" className="w-full h-full object-cover">
          <rect width="400" height="240" fill="#E2D6B5" />
          <circle cx="280" cy="60" r="30" fill="#F4E6B4" />
          {/* Montañas fondo */}
          <polygon points="-50,150 120,80 250,150 350,100 450,150" fill="#A1B39D" />
          {/* Agua */}
          <rect y="150" width="400" height="90" fill="#7BA2A2" />
          <path d="M0,170 Q100,190 200,170 T400,170" fill="none" stroke="#FFFFFF" strokeWidth="3" />
          <path d="M0,200 Q100,220 200,200 T400,200" fill="none" stroke="#FFFFFF" strokeWidth="3" opacity="0.6" />
        </svg>
      );
    case "Cultura local":
      return (
        <svg viewBox="0 0 400 240" className="w-full h-full object-cover">
          <rect width="400" height="240" fill="#E2D6B5" />
          <circle cx="320" cy="60" r="30" fill="#F4E6B4" />
          {/* Montañas fondo */}
          <polygon points="-20,180 100,110 200,180 300,120 420,180" fill="#A1B39D" />
          {/* Pirámide */}
          <rect x="160" y="80" width="80" height="100" fill="#B3866A" />
          <rect x="130" y="110" width="140" height="70" fill="#B3866A" />
          <rect x="100" y="140" width="200" height="40" fill="#B3866A" />
          <rect x="70" y="170" width="260" height="10" fill="#B3866A" />
          {/* Base */}
          <rect y="180" width="400" height="60" fill="#758C6E" />
        </svg>
      );
    case "Con mascotas":
      return (
        <svg viewBox="0 0 400 240" className="w-full h-full object-cover">
          <rect width="400" height="240" fill="#B4CBB0" />
          <circle cx="340" cy="60" r="30" fill="#F4E6B4" />
          {/* Montañas fondo */}
          <polygon points="-50,200 100,80 250,200 350,110 450,200" fill="#758C6E" />
          {/* Montañas frontales */}
          <polygon points="-20,200 60,120 160,200 260,90 380,200" fill="#586E52" />
          {/* Pinos pequeños izquierda/derecha */}
          <polygon points="10,200 30,150 50,200" fill="#3D4B38" />
          <polygon points="40,200 55,165 70,200" fill="#3D4B38" />
          <polygon points="330,200 350,140 370,200" fill="#3D4B38" />
          {/* Tienda de campaña */}
          <polygon points="160,200 200,130 240,200" fill="#F4E6B4" />
          <polygon points="195,200 200,150 205,200" fill="#3D4B38" />
        </svg>
      );
    default:
      return <div className="w-full h-full bg-gray-200" />;
  }
};

export default function RecomendacionesPage() {
  const cards = [
    { title: "Naturaleza", count: "12 lugares", href: "/recomendaciones/naturaleza" },
    { title: "Relax", count: "8 lugares", href: "/recomendaciones/relax" },
    { title: "Cultura local", count: "15 lugares", href: "/recomendaciones/cultura" },
    { title: "Con mascotas", count: "9 lugares", href: "/recomendaciones/mascotas" },
  ];

  return (
    <main className="relative min-h-screen w-full flex flex-col items-center justify-center bg-[#F2EFE9] dark:bg-[#18201C] transition-colors duration-300 py-20 px-6 overflow-hidden">
      
      <div className="absolute top-0 right-0 w-[400px] h-[400px] rounded-full bg-[#EFE2BA]/40 dark:bg-[#2A2528]/40 -translate-y-1/2 translate-x-1/3 blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] rounded-full bg-[#E5E4DB] dark:bg-[#121815] translate-y-1/3 -translate-x-1/4 blur-3xl pointer-events-none" />

      <div className="z-10 w-full max-w-6xl flex flex-col items-center">
        
        <div className="text-center mb-12">
          <span className="text-[#C81D77] dark:text-[#E24A96] text-xs font-bold tracking-[0.3em] uppercase block mb-4">
            Recomendaciones
          </span>
          <h1 className="font-serif text-5xl lg:text-6xl text-[#1E201D] dark:text-white mb-4">
            ¿Qué buscamos hoy?
          </h1>
          <p className="text-[#63665E] dark:text-[#A5B29A] text-sm lg:text-base">
            Elige un tipo de experiencia y descubre lugares responsables con el entorno.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 w-full mb-12">
          {cards.map((card, index) => (
            <Link 
              href={card.href} 
              key={index}
              className="group flex flex-col bg-white dark:bg-[#252D28] rounded-3xl overflow-hidden shadow-sm hover:shadow-lg dark:shadow-none border border-transparent dark:border-white/5 transition-all duration-300 hover:-translate-y-1"
            >
              {/* Aquí se inyectan las ilustraciones SVG diseñadas */}
              <div className="h-48 w-full relative overflow-hidden">
                <CardIllustration type={card.title} />
              </div>
              
              <div className="p-6 flex justify-between items-end bg-white dark:bg-[#252D28] transition-colors duration-300">
                <div>
                  <h3 className="font-serif text-2xl text-[#1E201D] dark:text-white mb-1">
                    {card.title}
                  </h3>
                  <p className="text-xs text-[#8C9287] dark:text-[#9EA399]">
                    {card.count}
                  </p>
                </div>
                <div className="text-[#C81D77] dark:text-[#E24A96] group-hover:translate-x-1 transition-transform">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M5 12h14" />
                    <path d="m12 5 7 7-7 7" />
                  </svg>
                </div>
              </div>
            </Link>
          ))}
        </div>

        <Link 
          href="/busqueda" 
          className="inline-flex items-center gap-2 bg-[#C81D77] hover:bg-[#A91864] dark:bg-[#E24A96] dark:hover:bg-[#C81D77] text-white font-medium rounded-full px-8 py-4 transition-colors duration-300 shadow-md"
        >
          Ya tengo algo en mente
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M5 12h14" />
            <path d="m12 5 7 7-7 7" />
          </svg>
        </Link>
      </div>
    </main>
  );
}