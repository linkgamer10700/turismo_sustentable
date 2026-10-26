import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <main className="relative flex min-h-[calc(100vh-4.75rem)] w-full flex-col items-center justify-center overflow-hidden bg-background text-foreground transition-colors duration-300 isolate">
      
      {/* Círculo superior izquierdo */}
      <div className="absolute w-[40rem] h-[40rem] -left-[12.5rem] -top-[16.25rem] rounded-full bg-blob-top z-0 transition-colors duration-300" />
      
      {/* Círculo inferior derecho */}
      <div className="absolute w-[26.25rem] h-[26.25rem] -right-[10rem] bottom-[3.75rem] rounded-full bg-blob-bottom z-0 transition-colors duration-300" />

      {/* ================= MONTAÑAS (Código SVG completo y expandible) ================= */}
      <div className="absolute bottom-0 left-0 w-full h-[140px] z-0 pointer-events-none">
        
        {/* Montaña Grande (Atrás) - Color #8F9F7E */}
        <svg 
          viewBox="0 0 1440 140" 
          preserveAspectRatio="none" 
          className="absolute bottom-0 left-0 w-full h-[140px] text-[#8F9F7E] dark:brightness-75 transition-colors duration-300"
        >
          <path 
            fill="currentColor" 
            d="M0 140V76L288 20L604.8 80L950 25L1250 70L1440 35V140Z" 
          />
        </svg>

        {/* Montaña Chica (Frente) - Color #5A7050 */}
        <svg 
          viewBox="0 0 1440 76" 
          preserveAspectRatio="none" 
          className="absolute bottom-0 left-0 w-full h-[76px] text-[#5A7050] dark:brightness-75 transition-colors duration-300"
        >
          <path 
            fill="currentColor" 
            d="M0 76V44L316.8 4L662.4 48L1050 10L1320 50L1440 25V76Z" 
          />
        </svg>
      </div>

      {/* === CONTENIDO CENTRAL === */}
      <div className="relative z-10 flex w-full max-w-[1200px] items-center justify-between px-8 py-12">
        
        {/* Texto Izquierdo */}
        <div className="w-[15.625rem] space-y-2">
          <p className="text-[0.6875rem] font-bold tracking-[0.1875rem] text-primary uppercase">
            01 · CONECTA
          </p>
          <p className="text-[0.875rem] leading-[1.3125rem] text-muted-foreground">
            Turistas y cooperativas locales en un solo lugar.
          </p>
        </div>

        {/* Órbita Central Animada */}
        <div className="relative flex h-[550px] w-[550px] flex-col items-center justify-center">
          <div className="absolute h-full w-full animate-[spin_40s_linear_infinite]">
            <div className="absolute h-full w-full rounded-full border border-dashed border-[#B0B0B0] dark:border-gray-700 transition-colors duration-300" />
            
            <div className="absolute left-[12%] top-[18%] -translate-x-1/2 -translate-y-1/2 z-20">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary shadow-md [animation:reverse-spin_40s_linear_infinite]">
                <Image src="/hoja_oscura.svg" alt="Hoja" width={24} height={24} />
              </div>
            </div>
            
            <div className="absolute bottom-[28%] left-[2%] -translate-x-1/2 translate-y-1/2 z-20">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#E2E0D5] shadow-md [animation:reverse-spin_40s_linear_infinite]">
                <Image src="/hoja.svg" alt="Hoja" width={24} height={24} />
              </div>
            </div>
            
            <div className="absolute bottom-[22%] right-[10%] translate-x-1/2 translate-y-1/2 z-20">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#708B63] shadow-md [animation:reverse-spin_40s_linear_infinite]">
                <Image src="/hoja_oscura.svg" alt="Hoja" width={24} height={24} />
              </div>
            </div>
          </div>

          <div className="relative h-[420px] w-[420px] rounded-full border-[1.5px] border-[#708B63] bg-card shadow-sm z-10 transition-colors duration-300" />
        </div>

        {/* Texto Derecho */}
        <div className="w-[15.625rem] space-y-2 text-right">
          <p className="text-[0.6875rem] font-bold tracking-[0.1875rem] text-primary uppercase">
            02 · VALIDA
          </p>
          <p className="text-[0.875rem] leading-[1.3125rem] text-muted-foreground">
            Reseñas y fotos reales contra el greenwashing.
          </p>
        </div>

      </div>

      {/* === TEXTO INFERIOR Y BOTÓN === */}
      <div className="relative z-10 -mt-10 flex flex-col items-center space-y-6">
        <h1 className="text-sm font-medium tracking-[0.4em] text-[#708B63]">
          TURISMO SUSTENTABLE · CIUDAD DE MÉXICO
        </h1>
        
        <Link 
          href="/aboutPage" 
          className="group flex items-center justify-center gap-2 rounded-full bg-primary px-8 py-3 text-sm font-medium text-primary-foreground transition-all hover:opacity-90 shadow-md"
        >
          Acerca de nosotros
          <span className="transition-transform group-hover:translate-x-1">→</span>
        </Link>
      </div>

    </main>
  );
}