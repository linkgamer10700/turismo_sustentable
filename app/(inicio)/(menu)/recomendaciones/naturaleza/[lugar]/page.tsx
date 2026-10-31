"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import LoginModal from "@/components/ui/LoginModal";
import ReviewModal from "@/components/ui/ReviewModal";

export default function LugarDetallePage() {
  const params = useParams();
  const router = useRouter();
  
  const [personas, setPersonas] = useState(2);
  const [mascotas, setMascotas] = useState(0);
  const [fechasSeleccionadas, setFechasSeleccionadas] = useState<number[]>([]);
  const [observaciones, setObservaciones] = useState("");

  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [accionPendiente, setAccionPendiente] = useState("");

  const rawLugar = (params?.lugar as string) || "";
  const decodedLugar = decodeURIComponent(rawLugar);
  const nombreLugar = decodedLugar 
    ? decodedLugar.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase()) 
    : "Cargando...";

  const seleccionarFecha = (dia: number) => {
    setFechasSeleccionadas(prev => {
      if (prev.includes(dia)) {
        return prev.filter(f => f !== dia);
      } else {
        return [...prev, dia].sort((a, b) => a - b);
      }
    });
  };

  const handleAccionProtegida = (accion: string) => {
    const isAuthenticated = localStorage.getItem("userToken"); 

    if (!isAuthenticated) {
      setAccionPendiente(accion);
      setShowLoginModal(true);
    } else {
      if (accion === "escribir una reseña") {
        setShowReviewModal(true);
      } else if (accion === "continuar con la reserva") {
        if (fechasSeleccionadas.length === 0) {
            alert("Por favor, selecciona al menos una fecha en el calendario antes de continuar.");
            return;
        }
        
        
        router.push("/reservas/checkout");
      }
    }
  };

  const simularLogin = () => {
    localStorage.setItem("userToken", "fake-token-123");
    setShowLoginModal(false);
    alert("¡Login simulado con éxito! Intenta la acción de nuevo.");
  };

  const cerrarSesionSimulada = () => {
      localStorage.removeItem("userToken");
      alert("Sesión cerrada. Ahora la plataforma te volverá a pedir que inicies sesión.");
  };

  return (
    <main className="min-h-screen w-full bg-[#F4F1EA] dark:bg-[#1E2420] transition-colors duration-300 py-8 px-4 lg:px-12 flex justify-center relative">
      <div className="w-full max-w-7xl grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16">
        
        {/* ================= COLUMNA IZQUIERDA: RESEÑAS ================= */}
        <div className="flex flex-col">
          <div className="flex items-center gap-4 mb-6">
            <Link href="/recomendaciones" className="text-[#3B523E] dark:text-[#A5B29A] hover:text-[#C81D77] transition-colors">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
            </Link>
            <h1 className="font-serif text-2xl text-[#1E201D] dark:text-white">Reseñas</h1>
          </div>

          <h2 className="text-xl text-[#3B523E] dark:text-[#D1D5CD] mb-4">{nombreLugar}</h2>

          <div className="bg-white dark:bg-[#2A312C] rounded-3xl p-6 mb-8 flex items-center gap-8 shadow-sm border border-transparent dark:border-white/5">
            <div className="text-center">
              <span className="font-serif text-5xl text-[#1E201D] dark:text-white block">4.8</span>
              <div className="flex text-[#728C69] dark:text-[#A5B29A] my-1 justify-center">
                {[1,2,3,4,5].map(i => <svg key={i} width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>)}
              </div>
              <span className="text-[10px] text-[#8C9287] dark:text-[#9EA399]">128 reseñas</span>
            </div>
            <div className="flex-1 flex flex-col gap-1.5">
              {[ {s: 5, w: "w-full"}, {s: 4, w: "w-[40%]"}, {s: 3, w: "w-[15%]"}, {s: 2, w: "w-[5%]"}, {s: 1, w: "w-[2%]"} ].map(bar => (
                <div key={bar.s} className="flex items-center gap-2 text-xs text-[#63665E] dark:text-[#A5B29A]">
                  <span className="w-2">{bar.s}</span>
                  <svg width="8" height="8" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
                  <div className="flex-1 h-1.5 bg-[#E3E5D8] dark:bg-[#3D453F] rounded-full overflow-hidden">
                    <div className={`h-full bg-[#728C69] dark:bg-[#85A07A] rounded-full ${bar.w}`} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <h3 className="text-sm font-medium text-[#1E201D] dark:text-white mb-3">Fotos de visitantes</h3>
          <div className="flex gap-3 overflow-x-auto pb-4 mb-4 scrollbar-hide">
            <div className="w-24 h-24 rounded-xl bg-[#C3A978] flex-shrink-0 flex items-center justify-center text-xs text-white/50">FOTO</div>
            <div className="w-24 h-24 rounded-xl bg-[#728C69] flex-shrink-0 flex items-center justify-center text-xs text-white/50">FOTO</div>
            <div className="w-24 h-24 rounded-xl bg-[#C81D77] flex-shrink-0 flex items-center justify-center text-xs text-white/50">FOTO</div>
          </div>

          <h3 className="text-sm font-medium text-[#1E201D] dark:text-white mb-4">Reseñas (128)</h3>
          
          <div className="bg-white dark:bg-[#2A312C] rounded-3xl p-5 mb-4 shadow-sm border border-transparent dark:border-white/5">
            <div className="flex gap-3 mb-3">
              <div className="w-10 h-10 rounded-full bg-[#8C9287] dark:bg-[#4B6846] text-white flex items-center justify-center font-serif text-lg">M</div>
              <div>
                <p className="text-sm font-medium text-[#1E201D] dark:text-white">María López</p>
                <p className="text-[10px] text-[#8C9287] dark:text-[#9EA399]">12 de marzo de 2024</p>
                <div className="flex text-[#728C69] dark:text-[#A5B29A] mt-0.5">
                  {[1,2,3,4,5].map(i => <svg key={i} width="10" height="10" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>)}
                </div>
              </div>
            </div>
            <p className="text-xs text-[#4A4D46] dark:text-[#D1D5CD]">Una experiencia increíble. Aprendí mucho.</p>
          </div>

          <div className="bg-white dark:bg-[#2A312C] rounded-3xl p-5 mb-6 shadow-sm border border-transparent dark:border-white/5">
            <div className="flex gap-3 mb-3">
              <div className="w-10 h-10 rounded-full bg-[#A5B29A] dark:bg-[#3B523E] text-white flex items-center justify-center font-serif text-lg">C</div>
              <div>
                <p className="text-sm font-medium text-[#1E201D] dark:text-white">Carlos Ramírez</p>
                <p className="text-[10px] text-[#8C9287] dark:text-[#9EA399]">5 de febrero de 2024</p>
                <div className="flex text-[#728C69] dark:text-[#A5B29A] mt-0.5">
                  {[1,2,3,4,5].map(i => <svg key={i} width="10" height="10" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>)}
                </div>
              </div>
            </div>
            <p className="text-xs text-[#4A4D46] dark:text-[#D1D5CD]">Guía amable y actividad muy bien organizada.</p>
          </div>

          <button 
            onClick={() => handleAccionProtegida("escribir una reseña")}
            className="w-full border-2 border-[#728C69] text-[#728C69] dark:border-[#85A07A] dark:text-[#85A07A] font-medium rounded-full py-3 flex justify-center items-center gap-2 hover:bg-[#728C69]/10 transition-colors mb-4"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
            Escribir reseña
          </button>

          {localStorage.getItem("userToken") && (
              <button 
                onClick={cerrarSesionSimulada}
                className="w-full text-xs text-red-500 underline text-center"
              >
                  (Dev) Cerrar Sesión Simulada
              </button>
          )}

        </div>

        {/* ================= COLUMNA DERECHA: RESERVA ================= */}
        <div className="flex flex-col">
          <div className="flex items-center gap-4 mb-6">
            <h1 className="font-serif text-2xl text-[#1E201D] dark:text-white">Nueva reservación</h1>
          </div>

          <div className="bg-white dark:bg-[#2A312C] rounded-[2rem] overflow-hidden mb-8 shadow-sm border border-transparent dark:border-white/5">
            <div className="w-full h-32 bg-[#B4CBB0] relative">
              <svg viewBox="0 0 400 120" className="w-full h-full object-cover" preserveAspectRatio="none">
                <circle cx="320" cy="40" r="20" fill="#F4E6B4" />
                <polygon points="0,120 150,50 350,120" fill="#758C6E" />
                <polygon points="100,120 280,70 450,120" fill="#586E52" />
                <polygon points="50,120 200,90 300,120" fill="#3D4B38" />
              </svg>
            </div>
            <div className="p-6">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-[10px] font-bold tracking-widest text-[#8C9287] dark:text-[#A5B29A] uppercase">Nivel de sustentabilidad</span>
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <Image key={i} src="/hoja.svg" alt="Hoja" width={12} height={12} className="opacity-80 dark:hidden" />
                  ))}
                  {[1, 2, 3, 4, 5].map((i) => (
                    <Image key={i} src="/hoja_oscura.svg" alt="Hoja" width={12} height={12} className="hidden dark:block" />
                  ))}
                </div>
              </div>
              <h2 className="font-serif text-3xl text-[#1E201D] dark:text-white">{nombreLugar}</h2>
              <p className="text-[#8C9287] dark:text-[#9EA399] text-xs italic font-serif">Slogan del lugar</p>
            </div>
          </div>

          <div className="bg-white dark:bg-[#2A312C] rounded-3xl p-6 shadow-sm border border-transparent dark:border-white/5 mb-8">
            <div className="flex justify-between items-center mb-6">
              <span className="font-medium text-[#1E201D] dark:text-white">Octubre 2026</span>
              <div className="flex gap-4 text-[#8C9287] dark:text-[#A5B29A]">
                <button>&lt;</button>
                <button>&gt;</button>
              </div>
            </div>
            <div className="grid grid-cols-7 gap-y-4 text-center text-xs mb-4">
              <span className="text-[#8C9287]">Lu</span><span className="text-[#8C9287]">Ma</span><span className="text-[#8C9287]">Mi</span>
              <span className="text-[#8C9287]">Ju</span><span className="text-[#8C9287]">Vi</span><span className="text-[#8C9287]">Sá</span>
              <span className="text-[#8C9287]">Do</span>
              
              <span className="col-start-4"></span>
              
              {[...Array(31)].map((_, i) => {
                const dia = i + 1;
                const esInactivo = [5, 6, 12, 13].includes(dia);
                const esSeleccionado = fechasSeleccionadas.includes(dia);

                return (
                  <button 
                    key={dia}
                    onClick={() => !esInactivo && seleccionarFecha(dia)}
                    disabled={esInactivo}
                    className={`
                      mx-auto w-7 h-7 flex items-center justify-center rounded-full transition-colors
                      ${esInactivo ? 'text-[#E3E5D8] dark:text-[#3D453F] cursor-not-allowed' : 'text-[#1E201D] dark:text-white hover:bg-[#F4F1EA] dark:hover:bg-[#1E2420]'}
                      ${esSeleccionado ? 'bg-[#C81D77] text-white shadow-md hover:bg-[#C81D77]' : ''}
                    `}
                  >
                    {dia}
                  </button>
                );
              })}
            </div>
            
            <div className="flex gap-4 text-[10px] text-[#8C9287] dark:text-[#A5B29A] justify-center mb-4 mt-2">
              <span className="flex items-center gap-1"><div className="w-1.5 h-1.5 rounded-full bg-[#728C69]"></div> Disponible</span>
              <span className="flex items-center gap-1"><div className="w-1.5 h-1.5 rounded-full bg-[#C81D77]"></div> Elegido</span>
              <span className="flex items-center gap-1"><div className="w-1.5 h-1.5 rounded-full bg-[#E3E5D8] dark:bg-[#3D453F]"></div> Sin cupo</span>
            </div>

            <div className="w-full bg-[#F4F1EA] dark:bg-[#1E2420] rounded-xl p-3 flex items-center justify-between text-xs text-[#3B523E] dark:text-[#D1D5CD]">
              <div className="flex items-center gap-2">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
                  {fechasSeleccionadas.length > 0 
                    ? `Día${fechasSeleccionadas.length > 1 ? 's' : ''} ${fechasSeleccionadas.join(", ")} de octubre` 
                    : "Selecciona fechas"}
              </div>
              {fechasSeleccionadas.length > 0 && (
                  <button onClick={() => setFechasSeleccionadas([])} className="text-[#C81D77] hover:text-[#A91864]">x</button>
              )}
            </div>
          </div>

          <h3 className="text-xl font-serif text-[#1E201D] dark:text-white mb-6">¿Quiénes te acompañan?</h3>

          <div className="flex flex-col gap-6 mb-8">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm font-medium text-[#1E201D] dark:text-white">Personas</p>
                <p className="text-[10px] text-[#8C9287] dark:text-[#A5B29A]">Incluyéndote a ti</p>
              </div>
              <div className="flex items-center gap-4 bg-[#F4F1EA] dark:bg-[#2A312C] rounded-full px-3 py-1">
                <button onClick={() => setPersonas(Math.max(1, personas - 1))} className="text-[#8C9287] hover:text-[#1E201D] dark:hover:text-white">-</button>
                <span className="font-medium text-[#1E201D] dark:text-white w-4 text-center text-sm">{personas}</span>
                <button onClick={() => setPersonas(personas + 1)} className="text-[#8C9287] hover:text-[#1E201D] dark:hover:text-white">+</button>
              </div>
            </div>
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm font-medium text-[#1E201D] dark:text-white">Mascotas</p>
                <p className="text-[10px] text-[#8C9287] dark:text-[#A5B29A]">Animales de compañía</p>
              </div>
              <div className="flex items-center gap-4 bg-[#F4F1EA] dark:bg-[#2A312C] rounded-full px-3 py-1">
                <button onClick={() => setMascotas(Math.max(0, mascotas - 1))} className="text-[#8C9287] hover:text-[#1E201D] dark:hover:text-white">-</button>
                <span className="font-medium text-[#1E201D] dark:text-white w-4 text-center text-sm">{mascotas}</span>
                <button onClick={() => setMascotas(mascotas + 1)} className="text-[#8C9287] hover:text-[#1E201D] dark:hover:text-white">+</button>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-[#2A312C] rounded-2xl p-4 flex justify-between items-center mb-6 shadow-sm border border-transparent dark:border-white/5">
            <div>
              <p className="text-sm font-medium text-[#1E201D] dark:text-white">Necesidades de accesibilidad</p>
              <p className="text-[10px] text-[#8C9287] dark:text-[#A5B29A]">Cuéntanos cómo podemos apoyarte.</p>
            </div>
            <button className="text-xs font-medium text-[#728C69] dark:text-[#A5B29A]">Agregar +</button>
          </div>

          <h3 className="text-sm font-medium text-[#1E201D] dark:text-white mb-3">Observaciones extra</h3>
          
          <div className="w-full bg-white dark:bg-[#2A312C] border border-transparent dark:border-white/5 rounded-2xl p-4 mb-6 shadow-sm focus-within:ring-2 focus-within:ring-[#C81D77]/50 transition-shadow">
            {fechasSeleccionadas.length > 0 && (
              <div className="text-xs text-[#C81D77] dark:text-[#E24A96] font-medium mb-3 border-b border-[#E3E5D8] dark:border-[#3D453F] pb-2 flex items-center gap-2">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
                Fechas a reservar: {fechasSeleccionadas.join(", ")} de octubre
              </div>
            )}
            <textarea 
              value={observaciones}
              onChange={(e) => setObservaciones(e.target.value)}
              placeholder="¿Hay algo que debamos saber?&#10;Opcional"
              className="w-full bg-transparent text-xs resize-none h-16 focus:outline-none text-[#1E201D] dark:text-white placeholder:text-[#8C9287]"
            />
          </div>

          <button 
            onClick={() => handleAccionProtegida("continuar con la reserva")}
            className="w-full bg-[#C81D77] hover:bg-[#A91864] dark:bg-[#E24A96] dark:hover:bg-[#C81D77] text-white font-medium rounded-2xl py-4 transition-colors flex justify-center items-center gap-2 shadow-md mt-2"
          >
            Continuar con mi reserva
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14" /><path d="m12 5 7 7-7 7" /></svg>
          </button>
        </div>
      </div>

      {/* ================= MODALES ================= */}
      <LoginModal 
        isOpen={showLoginModal} 
        onClose={() => setShowLoginModal(false)} 
        accionPendiente={accionPendiente} 
        onSimulateLogin={simularLogin} 
      />

      <ReviewModal 
        isOpen={showReviewModal}
        onClose={() => setShowReviewModal(false)}
        nombreLugar={nombreLugar}
      />

    </main>
  );
}