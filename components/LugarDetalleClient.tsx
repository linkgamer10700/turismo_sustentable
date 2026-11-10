"use client";

import React, { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import ReviewModal from "@/components/ui/ReviewModal";
import { Star, Calendar as CalendarIcon, Users, Heart, ArrowLeft, MessageSquarePlus } from "lucide-react";

interface ReviewItem {
  id: string;
  autorNombre: string;
  calificacion: number;
  comentario: string;
  fotos?: string[] | null;
  createdAt: string;
}

interface LugarDetalleClientProps {
  categoriaRuta: string;
}

export default function LugarDetalleClient({ categoriaRuta }: LugarDetalleClientProps) {
  const params = useParams();
  const router = useRouter();

  const [personas, setPersonas] = useState(2);
  const [mascotas, setMascotas] = useState(0);
  const [fechasSeleccionadas, setFechasSeleccionadas] = useState<number[]>([]);
  const [observaciones, setObservaciones] = useState("");

  const [currentUser, setCurrentUser] = useState<any>(null);
  const [showReviewModal, setShowReviewModal] = useState(false);

  // Estados de Reseñas desde BD
  const [resenas, setResenas] = useState<ReviewItem[]>([]);
  const [totalResenas, setTotalResenas] = useState(0);
  const [promedioRating, setPromedioRating] = useState(5.0);
  const [desgloseBarras, setDesgloseBarras] = useState<{ estrellas: number; cantidad: number; porcentaje: number }[]>([]);
  const [fotosVisitantes, setFotosVisitantes] = useState<string[]>([]);
  const [isLoadingResenas, setIsLoadingResenas] = useState(true);

  const rawLugar = (params?.lugar as string) || "";
  const decodedLugar = decodeURIComponent(rawLugar);
  const nombreLugar = decodedLugar
    ? decodedLugar.replace(/-/g, " ").replace(/\b\w/g, (l) => l.toUpperCase())
    : "Destino Sustentable";

  // Verificar usuario autenticado real
  useEffect(() => {
    async function checkAuth() {
      try {
        const res = await fetch("/api/user/profile");
        if (res.ok) {
          const data = await res.json();
          if (data.success && data.data) {
            setCurrentUser(data.data);
          }
        }
      } catch {
        setCurrentUser(null);
      }
    }
    checkAuth();
  }, []);

  // Cargar reseñas reales de la base de datos para este lugar
  const loadResenas = useCallback(async () => {
    if (!rawLugar) return;
    setIsLoadingResenas(true);
    try {
      const res = await fetch(`/api/resenas?lugar=${encodeURIComponent(rawLugar.toLowerCase())}`);
      const data = await res.json();
      if (data.success) {
        setResenas(data.resenas || []);
        setTotalResenas(data.total || 0);
        setPromedioRating(data.promedio || 5.0);
        setDesgloseBarras(data.desgloseBarras || []);
        setFotosVisitantes(data.fotos || []);
      }
    } catch (err) {
      console.error("Error al cargar reseñas reales", err);
    } finally {
      setIsLoadingResenas(false);
    }
  }, [rawLugar]);

  useEffect(() => {
    loadResenas();
  }, [loadResenas]);

  const seleccionarFecha = (dia: number) => {
    setFechasSeleccionadas((prev) => {
      if (prev.includes(dia)) {
        return prev.filter((f) => f !== dia);
      } else {
        return [...prev, dia].sort((a, b) => a - b);
      }
    });
  };

  const handleEscribirResena = () => {
    if (!currentUser) {
      router.push(`/login/loginUser?callbackUrl=/recomendaciones/${categoriaRuta}/${rawLugar}`);
      return;
    }
    setShowReviewModal(true);
  };

  const handleContinuarReserva = () => {
    if (fechasSeleccionadas.length === 0) {
      alert("Por favor, selecciona al menos una fecha en el calendario antes de continuar.");
      return;
    }
    if (!currentUser) {
      router.push(`/login/loginUser?callbackUrl=/recomendaciones/${categoriaRuta}/${rawLugar}`);
      return;
    }

    // Ir a checkout con parámetros de personas y destino
    router.push(`/reservas/checkout?lugar=${encodeURIComponent(rawLugar)}&personas=${personas}`);
  };

  return (
    <main className="min-h-screen w-full bg-[#F4F1EA] dark:bg-[#1E2420] transition-colors duration-300 py-8 px-4 lg:px-12 flex justify-center relative">
      <div className="w-full max-w-7xl grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16">
        {/* ================= COLUMNA IZQUIERDA: RESEÑAS REALES DE BD ================= */}
        <div className="flex flex-col">
          <div className="flex items-center gap-4 mb-6">
            <Link
              href="/recomendaciones"
              className="text-[#3B523E] dark:text-[#A5B29A] hover:text-[#C81D77] transition-colors"
            >
              <ArrowLeft className="w-6 h-6" />
            </Link>
            <h1 className="font-serif text-2xl text-[#1E201D] dark:text-white">Reseñas y Experiencias</h1>
          </div>

          <h2 className="text-xl text-[#3B523E] dark:text-[#D1D5CD] mb-4 font-bold">{nombreLugar}</h2>

          {/* Tarjeta de Calificación Promedio Real */}
          <div className="bg-white dark:bg-[#2A312C] rounded-3xl p-6 mb-8 flex items-center gap-8 shadow-sm border border-transparent dark:border-white/5">
            <div className="text-center">
              <span className="font-serif text-5xl text-[#1E201D] dark:text-white block font-bold">
                {totalResenas > 0 ? promedioRating : "Nuevo"}
              </span>
              <div className="flex text-[#728C69] dark:text-[#A5B29A] my-1 justify-center">
                {[1, 2, 3, 4, 5].map((i) => (
                  <Star
                    key={i}
                    className="w-3.5 h-3.5"
                    fill={i <= Math.round(promedioRating) ? "currentColor" : "none"}
                  />
                ))}
              </div>
              <span className="text-[10px] text-[#8C9287] dark:text-[#9EA399]">
                {totalResenas} reseña{totalResenas === 1 ? "" : "s"} verificada{totalResenas === 1 ? "" : "s"}
              </span>
            </div>

            <div className="flex-1 flex flex-col gap-1.5">
              {desgloseBarras.map((bar) => (
                <div key={bar.estrellas} className="flex items-center gap-2 text-xs text-[#63665E] dark:text-[#A5B29A]">
                  <span className="w-2">{bar.estrellas}</span>
                  <Star className="w-2.5 h-2.5 fill-current" />
                  <div className="flex-1 h-1.5 bg-[#E3E5D8] dark:bg-[#3D453F] rounded-full overflow-hidden">
                    <div
                      className="h-full bg-[#728C69] dark:bg-[#85A07A] rounded-full transition-all"
                      style={{ width: `${bar.porcentaje}%` }}
                    />
                  </div>
                  <span className="text-[10px] text-[#8C9287] w-6 text-right">{bar.cantidad}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Fotos Reales de Visitantes */}
          {fotosVisitantes.length > 0 && (
            <div className="mb-6">
              <h3 className="text-sm font-medium text-[#1E201D] dark:text-white mb-3">
                Fotos de visitantes ({fotosVisitantes.length})
              </h3>
              <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
                {fotosVisitantes.map((foto, idx) => (
                  <div
                    key={idx}
                    className="w-24 h-24 rounded-2xl overflow-hidden flex-shrink-0 shadow-sm border border-transparent dark:border-white/10"
                  >
                    <img src={foto} alt={`Foto visitante ${idx + 1}`} className="w-full h-full object-cover" />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Listado de Reseñas Reales */}
          <h3 className="text-sm font-medium text-[#1E201D] dark:text-white mb-4">
            Comentarios verificados ({totalResenas})
          </h3>

          {isLoadingResenas ? (
            <div className="space-y-4 animate-pulse mb-6">
              {[1, 2].map((i) => (
                <div key={i} className="h-28 bg-white dark:bg-[#2A312C] rounded-3xl" />
              ))}
            </div>
          ) : resenas.length === 0 ? (
            <div className="bg-white dark:bg-[#2A312C] rounded-3xl p-6 text-center mb-6 border border-dashed border-[#8C9287]/40">
              <p className="text-xs text-[#8C9287] mb-2">
                Aún no hay reseñas registradas para este destino ecológico.
              </p>
              <p className="text-[11px] text-[#728C69]">¡Sé el primero en compartir tu experiencia sustentable!</p>
            </div>
          ) : (
            <div className="space-y-4 mb-6">
              {resenas.map((r) => (
                <div
                  key={r.id}
                  className="bg-white dark:bg-[#2A312C] rounded-3xl p-5 shadow-sm border border-transparent dark:border-white/5"
                >
                  <div className="flex gap-3 mb-2.5">
                    <div className="w-10 h-10 rounded-full bg-[#728C69]/20 text-[#728C69] dark:text-[#A5B29A] flex items-center justify-center font-serif text-base font-bold flex-shrink-0">
                      {r.autorNombre.substring(0, 2).toUpperCase()}
                    </div>
                    <div>
                      <p className="text-sm font-bold text-[#1E201D] dark:text-white">{r.autorNombre}</p>
                      <p className="text-[10px] text-[#8C9287] dark:text-[#9EA399]">
                        {new Date(r.createdAt).toLocaleDateString("es-MX", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                      </p>
                      <div className="flex text-[#728C69] dark:text-[#A5B29A] mt-0.5">
                        {[1, 2, 3, 4, 5].map((i) => (
                          <Star
                            key={i}
                            className="w-3 h-3"
                            fill={i <= r.calificacion ? "currentColor" : "none"}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                  <p className="text-xs text-[#4A4D46] dark:text-[#D1D5CD] leading-relaxed">
                    {r.comentario}
                  </p>

                  {Array.isArray(r.fotos) && r.fotos.length > 0 && (
                    <div className="flex gap-2 mt-3 overflow-x-auto pb-1">
                      {r.fotos.map((f: string, fIdx: number) => (
                        <div key={fIdx} className="w-16 h-16 rounded-xl overflow-hidden flex-shrink-0">
                          <img src={f} alt="Foto reseña" className="w-full h-full object-cover" />
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          <button
            onClick={handleEscribirResena}
            className="w-full border-2 border-[#728C69] text-[#728C69] dark:border-[#85A07A] dark:text-[#85A07A] font-medium rounded-full py-3 flex justify-center items-center gap-2 hover:bg-[#728C69]/10 transition-colors mb-4 text-xs font-semibold"
          >
            <MessageSquarePlus className="w-4 h-4" />
            Escribir reseña
          </button>
        </div>

        {/* ================= COLUMNA DERECHA: RESERVA ================= */}
        <div className="flex flex-col">
          <div className="flex items-center gap-4 mb-6">
            <h1 className="font-serif text-2xl text-[#1E201D] dark:text-white">Nueva reservación</h1>
          </div>

          <div className="bg-white dark:bg-[#2A312C] rounded-[2rem] overflow-hidden mb-8 shadow-sm border border-transparent dark:border-white/5">
            <div className="w-full h-36 bg-[#B4CBB0] relative">
              <svg viewBox="0 0 400 120" className="w-full h-full object-cover" preserveAspectRatio="none">
                <circle cx="320" cy="40" r="20" fill="#F4E6B4" />
                <polygon points="0,120 150,50 350,120" fill="#758C6E" />
                <polygon points="100,120 280,70 450,120" fill="#586E52" />
                <polygon points="50,120 200,90 300,120" fill="#3D4B38" />
              </svg>
            </div>
            <div className="p-6">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-[10px] font-bold tracking-widest text-[#8C9287] dark:text-[#A5B29A] uppercase">
                  Nivel de sustentabilidad
                </span>
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <Image key={i} src="/hoja.svg" alt="Hoja" width={12} height={12} className="opacity-80 dark:hidden" />
                  ))}
                  {[1, 2, 3, 4, 5].map((i) => (
                    <Image key={i} src="/hoja_oscura.svg" alt="Hoja" width={12} height={12} className="hidden dark:block" />
                  ))}
                </div>
              </div>
              <h2 className="font-serif text-3xl text-[#1E201D] dark:text-white font-bold">{nombreLugar}</h2>
              <p className="text-[#8C9287] dark:text-[#9EA399] text-xs italic font-serif mt-1">
                Turismo regenerativo y conservación ambiental en la CDMX
              </p>
            </div>
          </div>

          <div className="bg-white dark:bg-[#2A312C] rounded-3xl p-6 shadow-sm border border-transparent dark:border-white/5 mb-8">
            <div className="flex justify-between items-center mb-6">
              <span className="font-medium text-[#1E201D] dark:text-white">Fechas disponibles</span>
            </div>
            <div className="grid grid-cols-7 gap-y-4 text-center text-xs mb-4">
              <span className="text-[#8C9287]">Lu</span>
              <span className="text-[#8C9287]">Ma</span>
              <span className="text-[#8C9287]">Mi</span>
              <span className="text-[#8C9287]">Ju</span>
              <span className="text-[#8C9287]">Vi</span>
              <span className="text-[#8C9287]">Sá</span>
              <span className="text-[#8C9287]">Do</span>

              <span className="col-start-4"></span>

              {[...Array(30)].map((_, i) => {
                const dia = i + 1;
                const esInactivo = [5, 6, 12, 13, 19, 20].includes(dia);
                const esSeleccionado = fechasSeleccionadas.includes(dia);

                return (
                  <button
                    key={dia}
                    onClick={() => !esInactivo && seleccionarFecha(dia)}
                    disabled={esInactivo}
                    className={`
                      mx-auto w-7 h-7 flex items-center justify-center rounded-full transition-colors text-xs
                      ${
                        esInactivo
                          ? "text-[#E3E5D8] dark:text-[#3D453F] cursor-not-allowed"
                          : "text-[#1E201D] dark:text-white hover:bg-[#F4F1EA] dark:hover:bg-[#1E2420]"
                      }
                      ${esSeleccionado ? "bg-[#C81D77] text-white shadow-md hover:bg-[#C81D77]" : ""}
                    `}
                  >
                    {dia}
                  </button>
                );
              })}
            </div>

            <div className="flex gap-4 text-[10px] text-[#8C9287] dark:text-[#A5B29A] justify-center mb-4 mt-2">
              <span className="flex items-center gap-1">
                <div className="w-1.5 h-1.5 rounded-full bg-[#728C69]"></div> Disponible
              </span>
              <span className="flex items-center gap-1">
                <div className="w-1.5 h-1.5 rounded-full bg-[#C81D77]"></div> Seleccionado
              </span>
              <span className="flex items-center gap-1">
                <div className="w-1.5 h-1.5 rounded-full bg-[#E3E5D8] dark:bg-[#3D453F]"></div> Sin cupo ecológico
              </span>
            </div>

            <div className="w-full bg-[#F4F1EA] dark:bg-[#1E2420] rounded-xl p-3 flex items-center justify-between text-xs text-[#3B523E] dark:text-[#D1D5CD]">
              <div className="flex items-center gap-2">
                <CalendarIcon className="w-3.5 h-3.5" />
                {fechasSeleccionadas.length > 0
                  ? `Día${fechasSeleccionadas.length > 1 ? "s" : ""} ${fechasSeleccionadas.join(", ")} seleccionado${fechasSeleccionadas.length > 1 ? "s" : ""}`
                  : "Selecciona una fecha en el calendario"}
              </div>
              {fechasSeleccionadas.length > 0 && (
                <button
                  onClick={() => setFechasSeleccionadas([])}
                  className="text-[#C81D77] hover:text-[#A91864] font-bold"
                >
                  ✕
                </button>
              )}
            </div>
          </div>

          <h3 className="text-xl font-serif text-[#1E201D] dark:text-white mb-4">¿Quiénes te acompañan?</h3>

          <div className="flex flex-col gap-4 mb-8">
            <div className="flex justify-between items-center bg-white dark:bg-[#2A312C] p-4 rounded-2xl shadow-sm border border-transparent dark:border-white/5">
              <div>
                <p className="text-sm font-medium text-[#1E201D] dark:text-white">Personas</p>
                <p className="text-[10px] text-[#8C9287] dark:text-[#A5B29A]">Capacidad de carga controlada</p>
              </div>
              <div className="flex items-center gap-4 bg-[#F4F1EA] dark:bg-[#18201C] rounded-full px-3 py-1">
                <button
                  onClick={() => setPersonas(Math.max(1, personas - 1))}
                  className="text-[#8C9287] hover:text-[#1E201D] dark:hover:text-white text-base font-bold"
                >
                  -
                </button>
                <span className="font-medium text-[#1E201D] dark:text-white w-4 text-center text-sm">
                  {personas}
                </span>
                <button
                  onClick={() => setPersonas(personas + 1)}
                  className="text-[#8C9287] hover:text-[#1E201D] dark:hover:text-white text-base font-bold"
                >
                  +
                </button>
              </div>
            </div>

            <div className="flex justify-between items-center bg-white dark:bg-[#2A312C] p-4 rounded-2xl shadow-sm border border-transparent dark:border-white/5">
              <div>
                <p className="text-sm font-medium text-[#1E201D] dark:text-white">Mascotas</p>
                <p className="text-[10px] text-[#8C9287] dark:text-[#A5B29A]">Animales de compañía permitidos</p>
              </div>
              <div className="flex items-center gap-4 bg-[#F4F1EA] dark:bg-[#18201C] rounded-full px-3 py-1">
                <button
                  onClick={() => setMascotas(Math.max(0, mascotas - 1))}
                  className="text-[#8C9287] hover:text-[#1E201D] dark:hover:text-white text-base font-bold"
                >
                  -
                </button>
                <span className="font-medium text-[#1E201D] dark:text-white w-4 text-center text-sm">
                  {mascotas}
                </span>
                <button
                  onClick={() => setMascotas(mascotas + 1)}
                  className="text-[#8C9287] hover:text-[#1E201D] dark:hover:text-white text-base font-bold"
                >
                  +
                </button>
              </div>
            </div>
          </div>

          <h3 className="text-sm font-medium text-[#1E201D] dark:text-white mb-2">Observaciones para el proveedor</h3>
          <div className="w-full bg-white dark:bg-[#2A312C] border border-transparent dark:border-white/5 rounded-2xl p-4 mb-6 shadow-sm">
            <textarea
              value={observaciones}
              onChange={(e) => setObservaciones(e.target.value)}
              placeholder="¿Algún requerimiento especial de movilidad o alimentación?"
              className="w-full bg-transparent text-xs resize-none h-16 focus:outline-none text-[#1E201D] dark:text-white placeholder:text-[#8C9287]"
            />
          </div>

          <button
            onClick={handleContinuarReserva}
            className="w-full bg-[#C81D77] hover:bg-[#A91864] text-white font-semibold rounded-2xl py-4 transition-colors flex justify-center items-center gap-2 shadow-md"
          >
            Continuar con mi reserva
            <ArrowLeft className="w-4 h-4 rotate-180" />
          </button>
        </div>
      </div>

      <ReviewModal
        isOpen={showReviewModal}
        onClose={() => setShowReviewModal(false)}
        nombreLugar={nombreLugar}
        lugarSlug={rawLugar}
        onReviewCreated={loadResenas}
      />
    </main>
  );
}

