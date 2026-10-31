"use client";

import React from "react";
import Link from "next/link";
import { QRCodeSVG } from "qrcode.react"; // <-- Importación del generador de QR

export default function ReservaExitosaPage() {
  // Estos son los datos reales que leerá la cámara del celular al escanear el QR.
  // En un entorno real, esto apuntaría al validador del backend.
  const qrData = "https://tu-dominio.com/validar-ticket/TS-161026-002"; 

  return (
    <main className="min-h-screen w-full bg-[#F4F1EA] dark:bg-[#1E2420] transition-colors duration-300 py-8 px-4 flex justify-center pb-24">
      <div className="w-full max-w-md flex flex-col">
        
        {/* Header Superior */}
        <div className="flex items-center gap-4 mb-8">
          <button onClick={() => window.history.back()} className="text-[#3B523E] dark:text-[#A5B29A] hover:text-[#C81D77] transition-colors">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
          </button>
          <h1 className="font-serif text-xl text-[#1E201D] dark:text-white">Tu reserva</h1>
        </div>

        {/* Mensaje Principal */}
        <div className="text-center mb-8">
          <div className="w-12 h-12 rounded-full bg-[#E3E5D8] dark:bg-[#2A312C] mx-auto flex items-center justify-center mb-4">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#728C69" strokeWidth="2"><path d="M20 6 9 17l-5-5"/></svg>
          </div>
          <h2 className="font-serif text-3xl text-[#1E201D] dark:text-white mb-2">¡Reserva exitosa!</h2>
          <p className="text-[#63665E] dark:text-[#A5B29A] text-sm">Todo listo para disfrutar.</p>
        </div>

        {/* Tarjeta de la Reserva (Ticket) */}
        <div className="bg-white dark:bg-[#2A312C] rounded-[2rem] overflow-hidden shadow-sm border border-transparent dark:border-white/5 mb-6">
          
          <div className="w-full h-32 bg-[#B4CBB0] relative">
             <svg viewBox="0 0 400 120" className="w-full h-full object-cover" preserveAspectRatio="none">
               <circle cx="320" cy="40" r="20" fill="#F4E6B4" />
               <polygon points="0,120 150,50 350,120" fill="#758C6E" />
               <polygon points="100,120 280,70 450,120" fill="#586E52" />
             </svg>
          </div>

          <div className="p-6">
            <p className="text-[10px] font-bold tracking-widest text-[#8C9287] dark:text-[#A5B29A] uppercase mb-1">Experiencia Sustentable</p>
            <h3 className="font-serif text-2xl text-[#1E201D] dark:text-white mb-4">Un respiro en la naturaleza</h3>
            
            <div className="bg-[#E3E5D8]/50 dark:bg-[#3D453F]/30 rounded-lg p-2.5 flex items-center gap-2 mb-6 w-max">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#728C69" strokeWidth="2"><path d="M20 6 9 17l-5-5"/></svg>
              <span className="text-xs text-[#4A4D46] dark:text-[#D1D5CD] font-medium">Reserva confirmada</span>
            </div>

            <div className="flex flex-col gap-4 mb-6">
              <div>
                <p className="text-[10px] text-[#8C9287]">Fecha</p>
                <p className="text-sm text-[#1E201D] dark:text-white font-medium">Viernes 16 de octubre de 2026</p>
              </div>
              <div>
                <p className="text-[10px] text-[#8C9287]">Personas</p>
                <p className="text-sm text-[#1E201D] dark:text-white font-medium">2 personas</p>
              </div>
              <div>
                <p className="text-[10px] text-[#8C9287]">Mascotas</p>
                <p className="text-sm text-[#1E201D] dark:text-white font-medium">Sin mascotas</p>
              </div>
              <div>
                <p className="text-[10px] text-[#8C9287]">Accesibilidad</p>
                <p className="text-sm text-[#1E201D] dark:text-white font-medium">Sin solicitudes especiales</p>
              </div>
            </div>

            <hr className="border-[#E3E5D8] dark:border-[#3D453F] mb-6" />

            {/* ================= CÓDIGO QR REAL ================= */}
            <div className="text-center pb-2">
              <p className="text-xs font-medium text-[#1E201D] dark:text-white mb-4">Tu pase de acceso</p>
              <div className="bg-white p-3 rounded-2xl inline-block mb-3 border border-[#E3E5D8] shadow-sm hover:scale-105 transition-transform">
                <QRCodeSVG 
                  value={qrData} 
                  size={140} 
                  bgColor={"#ffffff"} 
                  fgColor={"#1E201D"} 
                  level={"H"} // Alto nivel de corrección de errores (hace que el QR se vea más complejo y profesional)
                  includeMargin={false}
                />
              </div>
              <p className="text-xs font-bold tracking-widest text-[#1E201D] dark:text-white">TS · 161026 · 002</p>
              <p className="text-[10px] text-[#8C9287] mt-1">Escanea para validar</p>
            </div>
          </div>
        </div>

        {/* Tarjeta de Recomendaciones */}
        <div className="bg-[#E3E5D8]/50 dark:bg-[#2A312C] rounded-2xl p-5 mb-6">
          <p className="text-xs font-bold text-[#1E201D] dark:text-white mb-1">Antes de tu visita</p>
          <p className="text-xs text-[#63665E] dark:text-[#A5B29A] leading-relaxed">
            Guarda tu pase y muéstralo al llegar.<br/>
            Lleva agua y evita plásticos de un solo uso.
          </p>
        </div>

        {/* Botones Finales */}
        <Link href="/reservas" className="w-full bg-[#C81D77] hover:bg-[#A91864] text-white font-medium rounded-2xl py-4 transition-colors shadow-md text-center flex justify-center items-center gap-2 mb-4">
          Ver mis reservas
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
        </Link>

        <Link href="/recomendaciones" className="w-full text-center text-[#728C69] dark:text-[#A5B29A] text-sm font-medium hover:underline">
          Volver a explorar
        </Link>

      </div>
    </main>
  );
}