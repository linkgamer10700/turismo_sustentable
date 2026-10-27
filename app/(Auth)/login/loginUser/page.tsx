import React from "react";
import Link from "next/link";
import FormLoginUser from "@/components/FormLoginUser"; 

export default function LoginUserPage() {
  return (
    <main className="min-h-screen w-full flex flex-col lg:flex-row bg-[#F2EFE9] dark:bg-[#18201C] transition-colors duration-300">

      <section className="relative w-full lg:w-1/2 min-h-[40vh] lg:min-h-screen bg-[#B0C49F] overflow-hidden flex flex-col justify-between p-8 lg:p-16">
        
        {/* Logo */}
        <div className="z-20 flex items-center gap-2 text-white">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z" />
            <path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12" />
          </svg>
          <span className="font-medium tracking-widest text-xs uppercase">Turismo Sustentable</span>
        </div>

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
        

        <div className="absolute -top-24 -right-24 w-[300px] h-[300px] lg:w-[500px] lg:h-[500px] rounded-full bg-[#E5E4DB] dark:bg-[#121815] -z-10 transition-colors duration-300 opacity-60" />


        <div className="absolute top-6 right-6 lg:top-8 lg:right-10 z-20">
          <Link 
            href="/" 
            className="flex items-center justify-center w-10 h-10 rounded-full bg-white dark:bg-[#202823] shadow-sm hover:bg-[#F2EFE9] dark:hover:bg-[#2A352F] text-[#3B523E] dark:text-[#E2E4DE] transition-colors duration-300 border border-transparent dark:border-white/10"
            title="Volver al inicio"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="m15 18-6-6 6-6"/>
            </svg>
          </Link>
        </div>


        <div className="w-full max-w-md bg-white dark:bg-[#202823] rounded-[2rem] p-8 lg:p-10 shadow-[0_8px_30px_rgba(0,0,0,0.04)] dark:shadow-none border border-transparent dark:border-white/5 transition-colors duration-300">
          
          <FormLoginUser />

        </div>
      </section>
    </main>
  );
}