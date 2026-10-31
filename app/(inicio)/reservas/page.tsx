"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function MisReservasPage() {
  const router = useRouter();
  const [pestañaActiva, setPestañaActiva] = useState<"proximas" | "historial">("proximas");

  // --- ESTADOS PARA EL MODAL DE RESEÑAS ---
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [reservaSeleccionada, setReservaSeleccionada] = useState("");
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comentario, setComentario] = useState("");
  const [imagenesReseña, setImagenesReseña] = useState<string[]>([]); // Estado para las imágenes

  const reservasProximas = [
    {
      id: "TS-161026-002",
      titulo: "Un respiro en la naturaleza",
      fecha: "Viernes 16 de octubre de 2026",
      personas: 2,
      estado: "Confirmada",
      categoria: "Naturaleza",
      color: "bg-[#728C69]",
    }
  ];

  const reservasHistorial = [
    {
      id: "TS-050826-014",
      titulo: "Taller de barro local",
      fecha: "Sábado 5 de agosto de 2026",
      personas: 1,
      estado: "Completada",
      categoria: "Cultura",
      color: "bg-[#C81D77]",
    },
    {
      id: "TS-120726-089",
      titulo: "Ruta del café sustentable",
      fecha: "Domingo 12 de julio de 2026",
      personas: 3,
      estado: "Completada",
      categoria: "Gastronomía",
      color: "bg-[#D98A5F]",
    }
  ];

  const handleVerTicket = () => {
    router.push("/reservas/exitosa");
  };

  // --- FUNCIONES DEL MODAL ---
  const abrirModal = (titulo: string) => {
    setReservaSeleccionada(titulo);
    setRating(0);
    setComentario("");
    setImagenesReseña([]); // Limpiamos imágenes anteriores
    setIsModalOpen(true);
  };

  const cerrarModal = () => {
    setIsModalOpen(false);
  };

  // Manejador para cargar y previsualizar imágenes
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const filesArray = Array.from(e.target.files);
      // Creamos URLs temporales para mostrar la vista previa
      const newImages = filesArray.map(file => URL.createObjectURL(file));
      setImagenesReseña(prev => [...prev, ...newImages]);
    }
  };

  // Manejador para quitar una imagen seleccionada
  const removeImage = (indexToRemove: number) => {
    setImagenesReseña(prev => prev.filter((_, index) => index !== indexToRemove));
  };

  const enviarReseña = (e: React.FormEvent) => {
    e.preventDefault();
    alert(`¡Reseña enviada con éxito!\n\nExperiencia: ${reservaSeleccionada}\nCalificación: ${rating} estrellas\nImágenes adjuntas: ${imagenesReseña.length}`);
    setIsModalOpen(false);
  };

  return (
    <main className="min-h-screen w-full bg-[#F4F1EA] dark:bg-[#1E2420] transition-colors duration-300 py-8 px-4 flex justify-center pb-24 relative">
      <div className="w-full max-w-2xl flex flex-col">
        
        {/* Encabezado */}
        <div className="mb-8">
          <h1 className="font-serif text-3xl text-[#1E201D] dark:text-white mb-2">Mis reservas</h1>
          <p className="text-sm text-[#63665E] dark:text-[#A5B29A]">Administra tus próximos viajes y revisa tu historial.</p>
        </div>

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
            Próximas
          </button>
          <button
            onClick={() => setPestañaActiva("historial")}
            className={`flex-1 py-2.5 text-sm font-medium rounded-lg transition-all ${
              pestañaActiva === "historial" 
                ? "bg-white dark:bg-[#3D453F] text-[#1E201D] dark:text-white shadow-sm" 
                : "text-[#63665E] dark:text-[#A5B29A] hover:text-[#1E201D] dark:hover:text-white"
            }`}
          >
            Historial
          </button>
        </div>

        {/* Contenedor de Tarjetas */}
        <div className="flex flex-col gap-4">
          
          {/* TARJETAS PRÓXIMAS */}
          {pestañaActiva === "proximas" && reservasProximas.map((reserva) => (
            <div key={reserva.id} className="bg-white dark:bg-[#2A312C] rounded-[1.5rem] p-5 flex flex-col sm:flex-row gap-5 shadow-sm border border-transparent dark:border-white/5">
              <div className={`w-16 h-16 rounded-xl flex-shrink-0 flex items-center justify-center text-white ${reserva.color}`}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
              </div>
              <div className="flex-1">
                <div className="flex justify-between items-start mb-1">
                  <span className="text-[10px] font-bold tracking-widest text-[#8C9287] uppercase">{reserva.categoria}</span>
                  <span className="bg-[#E3E5D8]/50 dark:bg-[#3D453F] text-[#4A4D46] dark:text-[#D1D5CD] text-[10px] font-medium px-2 py-1 rounded-md">
                    {reserva.estado}
                  </span>
                </div>
                <h3 className="font-serif text-xl text-[#1E201D] dark:text-white mb-2">{reserva.titulo}</h3>
                <p className="text-xs text-[#63665E] dark:text-[#A5B29A] mb-1">🗓 {reserva.fecha}</p>
                <p className="text-xs text-[#63665E] dark:text-[#A5B29A] mb-4">👥 {reserva.personas} {reserva.personas === 1 ? "persona" : "personas"}</p>
                
                <button onClick={handleVerTicket} className="text-sm font-medium text-[#728C69] dark:text-[#A5B29A] hover:underline flex items-center gap-1">
                  Ver ticket QR
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m9 18 6-6-6-6"/></svg>
                </button>
              </div>
            </div>
          ))}

          {/* TARJETAS HISTORIAL */}
          {pestañaActiva === "historial" && reservasHistorial.map((reserva) => (
            <div key={reserva.id} className="bg-white dark:bg-[#2A312C] rounded-[1.5rem] p-5 flex flex-col sm:flex-row gap-5 shadow-sm border border-transparent dark:border-white/5 opacity-80 hover:opacity-100 transition-opacity">
              <div className={`w-16 h-16 rounded-xl flex-shrink-0 flex items-center justify-center text-white ${reserva.color}`}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
              </div>
              
              <div className="flex-1">
                <div className="flex justify-between items-start mb-1">
                  <span className="text-[10px] font-bold tracking-widest text-[#8C9287] uppercase">{reserva.categoria}</span>
                  <span className="bg-[#F2EFE9] dark:bg-[#18201C] text-[#8C9287] text-[10px] font-medium px-2 py-1 rounded-md border border-[#E3E5D8] dark:border-[#3D453F]">
                    {reserva.estado}
                  </span>
                </div>
                <h3 className="font-serif text-xl text-[#1E201D] dark:text-white mb-2">{reserva.titulo}</h3>
                <p className="text-xs text-[#63665E] dark:text-[#A5B29A] mb-4">{reserva.fecha}</p>
                
                <div className="flex gap-4">
                  <button 
                    onClick={() => abrirModal(reserva.titulo)} 
                    className="text-sm font-medium text-[#C81D77] dark:text-[#E24A96] hover:underline"
                  >
                    Dejar reseña
                  </button>
                  <Link href="/recomendaciones" className="text-sm font-medium text-[#728C69] dark:text-[#A5B29A] hover:underline">
                    Volver a reservar
                  </Link>
                </div>
              </div>
            </div>
          ))}

        </div>
      </div>

      {/* --- MODAL DE RESEÑA CON IMÁGENES --- */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm transition-opacity">
          <div className="bg-white dark:bg-[#2A312C] rounded-[2rem] w-full max-w-md p-8 shadow-2xl relative animate-in fade-in zoom-in-95 duration-200">
            
            <button 
              onClick={cerrarModal}
              className="absolute top-6 right-6 text-[#8C9287] hover:text-[#1E201D] dark:hover:text-white transition-colors"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6 6 18M6 6l12 12"/></svg>
            </button>

            <h2 className="font-serif text-2xl text-[#1E201D] dark:text-white mb-1">Califica tu experiencia</h2>
            <p className="text-sm text-[#728C69] dark:text-[#A5B29A] font-medium mb-6">{reservaSeleccionada}</p>

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
                      width="36" height="36" viewBox="0 0 24 24" 
                      fill={(hoverRating || rating) >= star ? "#D98A5F" : "none"} 
                      stroke={(hoverRating || rating) >= star ? "#D98A5F" : "#C1C5BA"} 
                      strokeWidth="1.5"
                    >
                      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                    </svg>
                  </button>
                ))}
              </div>

              <div>
                <label className="text-xs font-medium text-[#232621] dark:text-[#D1D5CD] block mb-2">Cuéntanos más sobre tu viaje (Opcional)</label>
                <textarea
                  value={comentario}
                  onChange={(e) => setComentario(e.target.value)}
                  placeholder="¿Qué fue lo que más te gustó?"
                  rows={3}
                  className="w-full bg-[#F2EFE9] dark:bg-[#18201C] text-[#232621] dark:text-white placeholder-[#8C9287] dark:placeholder-[#63665E] rounded-xl p-4 text-sm focus:outline-none focus:ring-2 focus:ring-[#728C69] transition-all resize-none border border-transparent dark:border-white/5"
                />
              </div>

              {/* Sección para subir imágenes */}
              <div>
                <label className="text-xs font-medium text-[#232621] dark:text-[#D1D5CD] block mb-2">Añade fotos de tu experiencia</label>
                <div className="flex flex-wrap gap-3">
                  
                  {/* Vista previa de las imágenes */}
                  {imagenesReseña.map((img, index) => (
                    <div key={index} className="relative w-16 h-16 rounded-xl overflow-hidden border border-[#E3E5D8] dark:border-[#3D453F] group">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={img} alt={`Preview ${index}`} className="w-full h-full object-cover" />
                      <button 
                        type="button" 
                        onClick={() => removeImage(index)}
                        className="absolute inset-0 bg-black/50 flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6 6 18M6 6l12 12"/></svg>
                      </button>
                    </div>
                  ))}

                  {/* Botón para agregar más imágenes */}
                  <label className="w-16 h-16 rounded-xl border-2 border-dashed border-[#8C9287] dark:border-[#63665E] flex items-center justify-center text-[#8C9287] dark:text-[#63665E] hover:bg-[#E3E5D8]/50 dark:hover:bg-[#3D453F]/50 hover:border-[#728C69] hover:text-[#728C69] cursor-pointer transition-colors">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 5v14M5 12h14"/></svg>
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