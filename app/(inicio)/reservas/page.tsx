"use client";

import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface ReservaItem {
  id: string;
  userId: string;
  experienciaId: string;
  fecha: string;
  numeroPersonas: number;
  precioTotal: number | string;
  estado: "CONFIRMADA" | "PENDIENTE_PAGO" | "CANCELADA" | "COMPLETADA";
  codigoComprobante: string;
  notasEspeciales?: string | null;
  experiencia: {
    id: string;
    titulo: string;
    categoria: string;
    alcaldiaCDMX?: string;
    proveedor?: {
      nombreNegocio: string | null;
      alcaldiaCDMX: string | null;
    };
  };
}

export default function MisReservasPage() {
  const router = useRouter();
  const [pestañaActiva, setPestañaActiva] = useState<"proximas" | "historial">("proximas");
  const [reservas, setReservas] = useState<ReservaItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isUnauthorized, setIsUnauthorized] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // --- ESTADOS PARA EL MODAL DE RESEÑAS ---
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [reservaSeleccionada, setReservaSeleccionada] = useState("");
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comentario, setComentario] = useState("");
  const [imagenesReseña, setImagenesReseña] = useState<string[]>([]);

  const fetchReservas = useCallback(async () => {
    setIsLoading(true);
    setErrorMessage(null);
    setIsUnauthorized(false);

    try {
      const res = await fetch("/api/reservas");

      if (res.status === 401) {
        setIsUnauthorized(true);
        return;
      }

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "No se pudieron obtener las reservas.");
      }

      setReservas(data.reservas || []);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Error al consultar tus reservas.";
      setErrorMessage(message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchReservas();
  }, [fetchReservas]);

  // Clasificación por fecha o estado
  const now = new Date();
  now.setHours(0, 0, 0, 0);

  const reservasProximas = reservas.filter((r) => {
    const rDate = new Date(r.fecha);
    return r.estado === "CONFIRMADA" && rDate >= now;
  });

  const reservasHistorial = reservas.filter((r) => {
    const rDate = new Date(r.fecha);
    return r.estado === "COMPLETADA" || r.estado === "CANCELADA" || rDate < now;
  });

  const handleVerTicket = (codigo: string) => {
    router.push(`/reservas/exitosa?codigo=${encodeURIComponent(codigo)}`);
  };

  // --- FUNCIONES DEL MODAL ---
  const abrirModal = (titulo: string) => {
    setReservaSeleccionada(titulo);
    setRating(0);
    setComentario("");
    setImagenesReseña([]);
    setIsModalOpen(true);
  };

  const cerrarModal = () => {
    setIsModalOpen(false);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const filesArray = Array.from(e.target.files);
      const newImages = filesArray.map((file) => URL.createObjectURL(file));
      setImagenesReseña((prev) => [...prev, ...newImages]);
    }
  };

  const removeImage = (indexToRemove: number) => {
    setImagenesReseña((prev) => prev.filter((_, index) => index !== indexToRemove));
  };

  const enviarReseña = (e: React.FormEvent) => {
    e.preventDefault();
    alert(
      `¡Reseña enviada con éxito!\n\nExperiencia: ${reservaSeleccionada}\nCalificación: ${rating} estrellas\nImágenes adjuntas: ${imagenesReseña.length}`
    );
    setIsModalOpen(false);
  };

  const getColorPorCategoria = (categoria: string) => {
    switch (categoria.toLowerCase()) {
      case "cultura":
        return "bg-[#C81D77]";
      case "gastronomía":
      case "gastronomia":
        return "bg-[#D98A5F]";
      case "aventura":
        return "bg-[#C3A978]";
      default:
        return "bg-[#728C69]";
    }
  };

  return (
    <main className="min-h-screen w-full bg-[#F4F1EA] dark:bg-[#1E2420] transition-colors duration-300 py-8 px-4 flex justify-center pb-24 relative">
      <div className="w-full max-w-2xl flex flex-col">
        {/* Encabezado */}
        <div className="mb-8">
          <h1 className="font-serif text-3xl text-[#1E201D] dark:text-white mb-2">Mis reservas</h1>
          <p className="text-sm text-[#63665E] dark:text-[#A5B29A]">
            Administra tus próximos viajes sustentables y revisa tu historial de impacto.
          </p>
        </div>

        {/* Estado no autenticado */}
        {isUnauthorized && (
          <div className="bg-white dark:bg-[#2A312C] rounded-[2rem] p-8 text-center shadow-sm border border-transparent dark:border-white/5 my-4">
            <div className="w-16 h-16 mx-auto mb-4 bg-green-100 dark:bg-green-950/40 rounded-full flex items-center justify-center text-[#728C69]">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
                <circle cx="12" cy="7" r="4" />
              </svg>
            </div>
            <h2 className="font-serif text-2xl text-[#1E201D] dark:text-white mb-2">
              Inicia sesión para ver tus reservas
            </h2>
            <p className="text-sm text-[#63665E] dark:text-[#A5B29A] max-w-md mx-auto mb-6">
              Para consultar tus pases de acceso digitales y el estado de tus actividades, ingresa con tu cuenta.
            </p>
            <Link
              href="/login/loginUser?callbackUrl=/reservas"
              className="inline-block bg-[#728C69] hover:bg-[#5B7153] text-white text-sm font-medium px-6 py-3 rounded-xl transition-colors"
            >
              Iniciar sesión
            </Link>
          </div>
        )}

        {/* Estado de error */}
        {errorMessage && !isUnauthorized && (
          <div className="bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800/40 rounded-2xl p-6 text-center mb-6">
            <p className="text-sm text-red-600 dark:text-red-400 mb-3">{errorMessage}</p>
            <button
              onClick={fetchReservas}
              className="text-xs bg-[#728C69] text-white px-4 py-2 rounded-lg hover:bg-[#5B7153]"
            >
              Reintentar
            </button>
          </div>
        )}

        {/* Skeletons de Carga */}
        {isLoading && (
          <div className="space-y-4 animate-pulse">
            {[1, 2].map((i) => (
              <div
                key={i}
                className="bg-white dark:bg-[#2A312C] rounded-[1.5rem] p-5 h-36 shadow-sm"
              >
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/4 mb-3" />
                <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-2" />
                <div className="h-4 bg-gray-100 dark:bg-gray-800 rounded w-1/2" />
              </div>
            ))}
          </div>
        )}

        {!isLoading && !isUnauthorized && !errorMessage && (
          <>
            {/* Pestañas (Tabs) */}
            <div className="flex bg-[#E3E5D8] dark:bg-[#2A312C] p-1 rounded-xl mb-8">
              <button
                onClick={() => setPestañaActiva("proximas")}
                className={`flex-1 py-2.5 text-sm font-medium rounded-lg transition-all ${
                  pestañaActiva === "proximas"
                    ? "bg-white dark:bg-[#3D453F] text-[#1E201D] dark:text-white shadow-sm"
                    : "text-[#63665E] dark:text-[#A5B29A] hover:text-[#1E201D] dark:hover:text-white"
                }`}
              >
                Próximas ({reservasProximas.length})
              </button>
              <button
                onClick={() => setPestañaActiva("historial")}
                className={`flex-1 py-2.5 text-sm font-medium rounded-lg transition-all ${
                  pestañaActiva === "historial"
                    ? "bg-white dark:bg-[#3D453F] text-[#1E201D] dark:text-white shadow-sm"
                    : "text-[#63665E] dark:text-[#A5B29A] hover:text-[#1E201D] dark:hover:text-white"
                }`}
              >
                Historial ({reservasHistorial.length})
              </button>
            </div>

            {/* Contenedor de Tarjetas */}
            <div className="flex flex-col gap-4">
              {/* TARJETAS PRÓXIMAS */}
              {pestañaActiva === "proximas" && (
                <>
                  {reservasProximas.length === 0 ? (
                    <div className="bg-white dark:bg-[#2A312C] rounded-[1.5rem] p-8 text-center border border-dashed border-[#8C9287]/40">
                      <p className="text-[#8C9287] text-sm mb-4">No tienes reservas activas próximas.</p>
                      <Link
                        href="/busqueda"
                        className="text-xs bg-[#728C69] text-white px-5 py-2.5 rounded-full hover:bg-[#5B7153] transition-colors"
                      >
                        Explorar actividades sustentables
                      </Link>
                    </div>
                  ) : (
                    reservasProximas.map((reserva) => {
                      const color = getColorPorCategoria(reserva.experiencia.categoria);
                      const fechaFormateada = new Date(reserva.fecha).toLocaleDateString("es-MX", {
                        weekday: "long",
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      });

                      return (
                        <div
                          key={reserva.id}
                          className="bg-white dark:bg-[#2A312C] rounded-[1.5rem] p-5 flex flex-col sm:flex-row gap-5 shadow-sm border border-transparent dark:border-white/5"
                        >
                          <div
                            className={`w-16 h-16 rounded-xl flex-shrink-0 flex items-center justify-center text-white ${color}`}
                          >
                            <svg
                              width="24"
                              height="24"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                            >
                              <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                            </svg>
                          </div>
                          <div className="flex-1">
                            <div className="flex justify-between items-start mb-1">
                              <span className="text-[10px] font-bold tracking-widest text-[#8C9287] uppercase">
                                {reserva.experiencia.categoria}
                              </span>
                              <span className="bg-[#E3E5D8]/50 dark:bg-[#3D453F] text-[#4A4D46] dark:text-[#D1D5CD] text-[10px] font-medium px-2 py-1 rounded-md">
                                {reserva.estado}
                              </span>
                            </div>
                            <h3 className="font-serif text-xl text-[#1E201D] dark:text-white mb-2">
                              {reserva.experiencia.titulo}
                            </h3>
                            <p className="text-xs text-[#63665E] dark:text-[#A5B29A] mb-1 capitalize">
                              🗓 {fechaFormateada}
                            </p>
                            <p className="text-xs text-[#63665E] dark:text-[#A5B29A] mb-4">
                              👥 {reserva.numeroPersonas}{" "}
                              {reserva.numeroPersonas === 1 ? "persona" : "personas"} · Total: $
                              {Number(reserva.precioTotal).toLocaleString("es-MX")} MXN
                            </p>

                            <button
                              onClick={() => handleVerTicket(reserva.codigoComprobante)}
                              className="text-sm font-medium text-[#728C69] dark:text-[#A5B29A] hover:underline flex items-center gap-1"
                            >
                              Ver ticket QR ({reserva.codigoComprobante})
                              <svg
                                width="16"
                                height="16"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                              >
                                <path d="m9 18 6-6-6-6" />
                              </svg>
                            </button>
                          </div>
                        </div>
                      );
                    })
                  )}
                </>
              )}

              {/* TARJETAS HISTORIAL */}
              {pestañaActiva === "historial" && (
                <>
                  {reservasHistorial.length === 0 ? (
                    <div className="bg-white dark:bg-[#2A312C] rounded-[1.5rem] p-8 text-center border border-dashed border-[#8C9287]/40">
                      <p className="text-[#8C9287] text-sm">Aún no tienes actividades en tu historial.</p>
                    </div>
                  ) : (
                    reservasHistorial.map((reserva) => {
                      const color = getColorPorCategoria(reserva.experiencia.categoria);
                      const fechaFormateada = new Date(reserva.fecha).toLocaleDateString("es-MX", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      });

                      return (
                        <div
                          key={reserva.id}
                          className="bg-white dark:bg-[#2A312C] rounded-[1.5rem] p-5 flex flex-col sm:flex-row gap-5 shadow-sm border border-transparent dark:border-white/5 opacity-80 hover:opacity-100 transition-opacity"
                        >
                          <div
                            className={`w-16 h-16 rounded-xl flex-shrink-0 flex items-center justify-center text-white ${color}`}
                          >
                            <svg
                              width="24"
                              height="24"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                            >
                              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                              <polyline points="22 4 12 14.01 9 11.01" />
                            </svg>
                          </div>

                          <div className="flex-1">
                            <div className="flex justify-between items-start mb-1">
                              <span className="text-[10px] font-bold tracking-widest text-[#8C9287] uppercase">
                                {reserva.experiencia.categoria}
                              </span>
                              <span className="bg-[#F2EFE9] dark:bg-[#18201C] text-[#8C9287] text-[10px] font-medium px-2 py-1 rounded-md border border-[#E3E5D8] dark:border-[#3D453F]">
                                {reserva.estado}
                              </span>
                            </div>
                            <h3 className="font-serif text-xl text-[#1E201D] dark:text-white mb-2">
                              {reserva.experiencia.titulo}
                            </h3>
                            <p className="text-xs text-[#63665E] dark:text-[#A5B29A] mb-4">
                              {fechaFormateada}
                            </p>

                            <div className="flex gap-4">
                              <button
                                onClick={() => abrirModal(reserva.experiencia.titulo)}
                                className="text-sm font-medium text-[#C81D77] dark:text-[#E24A96] hover:underline"
                              >
                                Dejar reseña
                              </button>
                              <Link
                                href={`/reservas/checkout?experienciaId=${reserva.experiencia.id}`}
                                className="text-sm font-medium text-[#728C69] dark:text-[#A5B29A] hover:underline"
                              >
                                Volver a reservar
                              </Link>
                            </div>
                          </div>
                        </div>
                      );
                    })
                  )}
                </>
              )}
            </div>
          </>
        )}
      </div>

      {/* --- MODAL DE RESEÑA CON IMÁGENES --- */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm transition-opacity">
          <div className="bg-white dark:bg-[#2A312C] rounded-[2rem] w-full max-w-md p-8 shadow-2xl relative animate-in fade-in zoom-in-95 duration-200">
            <button
              onClick={cerrarModal}
              className="absolute top-6 right-6 text-[#8C9287] hover:text-[#1E201D] dark:hover:text-white transition-colors"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M18 6 6 18M6 6l12 12" />
              </svg>
            </button>

            <h2 className="font-serif text-2xl text-[#1E201D] dark:text-white mb-1">
              Califica tu experiencia
            </h2>
            <p className="text-sm text-[#728C69] dark:text-[#A5B29A] font-medium mb-6">
              {reservaSeleccionada}
            </p>

            <form onSubmit={enviarReseña} className="space-y-6">
              {/* Estrellas Interactivas */}
              <div className="flex justify-center gap-2 mb-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    onMouseEnter={() => setHoverRating(star)}
                    onMouseLeave={() => setHoverRating(0)}
                    className="focus:outline-none transition-transform hover:scale-110"
                  >
                    <svg
                      width="36"
                      height="36"
                      viewBox="0 0 24 24"
                      fill={(hoverRating || rating) >= star ? "#D98A5F" : "none"}
                      stroke={(hoverRating || rating) >= star ? "#D98A5F" : "#C1C5BA"}
                      strokeWidth="1.5"
                    >
                      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                    </svg>
                  </button>
                ))}
              </div>

              <div>
                <label className="text-xs font-medium text-[#232621] dark:text-[#D1D5CD] block mb-2">
                  Cuéntanos más sobre tu viaje (Opcional)
                </label>
                <textarea
                  value={comentario}
                  onChange={(e) => setComentario(e.target.value)}
                  placeholder="¿Qué fue lo que más te gustó?"
                  rows={3}
                  className="w-full bg-[#F2EFE9] dark:bg-[#18201C] text-[#232621] dark:text-white placeholder-[#8C9287] dark:placeholder-[#63665E] rounded-xl p-4 text-sm focus:outline-none focus:ring-2 focus:ring-[#728C69] transition-all resize-none border border-transparent dark:border-white/5"
                />
              </div>

              {/* Subir imágenes */}
              <div>
                <label className="text-xs font-medium text-[#232621] dark:text-[#D1D5CD] block mb-2">
                  Añade fotos de tu experiencia
                </label>
                <div className="flex flex-wrap gap-3">
                  {imagenesReseña.map((img, index) => (
                    <div
                      key={index}
                      className="relative w-16 h-16 rounded-xl overflow-hidden border border-[#E3E5D8] dark:border-[#3D453F] group"
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={img} alt={`Preview ${index}`} className="w-full h-full object-cover" />
                      <button
                        type="button"
                        onClick={() => removeImage(index)}
                        className="absolute inset-0 bg-black/50 flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <svg
                          width="20"
                          height="20"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                        >
                          <path d="M18 6 6 18M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                  ))}

                  <label className="w-16 h-16 rounded-xl border-2 border-dashed border-[#8C9287] dark:border-[#63665E] flex items-center justify-center text-[#8C9287] dark:text-[#63665E] hover:bg-[#E3E5D8]/50 dark:hover:bg-[#3D453F]/50 hover:border-[#728C69] hover:text-[#728C69] cursor-pointer transition-colors">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M12 5v14M5 12h14" />
                    </svg>
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      className="hidden"
                      onChange={handleImageUpload}
                    />
                  </label>
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={cerrarModal}
                  className="flex-1 bg-[#E3E5D8] dark:bg-[#3D453F] hover:bg-[#D1D5CD] dark:hover:bg-[#4A4D46] text-[#4A4D46] dark:text-white font-medium rounded-xl h-12 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={rating === 0}
                  className="flex-1 bg-[#728C69] hover:bg-[#5B7153] dark:bg-[#85A07A] dark:hover:bg-[#A5B29A] text-white disabled:opacity-50 disabled:cursor-not-allowed font-medium rounded-xl h-12 transition-colors shadow-sm"
                >
                  Enviar reseña
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </main>
  );
}
