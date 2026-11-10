"use client";

import React, { useState } from "react";

interface ReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  nombreLugar: string;
  lugarSlug?: string;
  onReviewCreated?: () => void;
}

export default function ReviewModal({
  isOpen,
  onClose,
  nombreLugar,
  lugarSlug = "general",
  onReviewCreated,
}: ReviewModalProps) {
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [comentario, setComentario] = useState("");
  const [fotos, setFotos] = useState<string[]>([]);
  const [nuevaFotoUrl, setNuevaFotoUrl] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  if (!isOpen) return null;

  const handleAgregarFoto = () => {
    if (nuevaFotoUrl.trim() && nuevaFotoUrl.startsWith("http")) {
      setFotos((prev) => [...prev, nuevaFotoUrl.trim()]);
      setNuevaFotoUrl("");
    }
  };

  const removerFoto = (index: number) => {
    setFotos((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async () => {
    if (rating === 0) {
      setErrorMessage("Por favor, selecciona una calificación en estrellas.");
      return;
    }
    if (!comentario.trim() || comentario.trim().length < 5) {
      setErrorMessage("Por favor, escribe un comentario de al menos 5 caracteres.");
      return;
    }

    setIsSubmitting(true);
    setErrorMessage("");

    try {
      const res = await fetch("/api/resenas", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          lugarSlug: lugarSlug.toLowerCase(),
          calificacion: rating,
          comentario: comentario.trim(),
          fotos,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "No se pudo registrar la reseña");
      }

      setRating(5);
      setComentario("");
      setFotos([]);
      if (onReviewCreated) onReviewCreated();
      onClose();
    } catch (err: any) {
      setErrorMessage(err.message || "Error al publicar la reseña");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-[#FAF9F5] dark:bg-[#202823] w-full max-w-lg rounded-[2rem] p-8 shadow-2xl relative border border-transparent dark:border-white/10">
        <button
          onClick={onClose}
          className="absolute top-6 right-6 text-[#8C9287] hover:text-[#C81D77] transition-colors"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M18 6 6 18" />
            <path d="m6 6 12 12" />
          </svg>
        </button>

        <h3 className="font-serif text-3xl text-[#1E201D] dark:text-white mb-2 pr-6">
          Escribe una reseña
        </h3>

        <p className="text-[#63665E] dark:text-[#A5B29A] text-sm mb-6">
          ¿Cómo fue tu experiencia en <span className="font-medium text-[#C81D77] dark:text-[#E24A96]">{nombreLugar}</span>?
        </p>

        {errorMessage && (
          <div className="p-3 mb-4 rounded-xl bg-red-100 dark:bg-red-950/40 text-red-800 dark:text-red-300 text-xs">
            {errorMessage}
          </div>
        )}

        {/* Selector de Estrellas */}
        <div className="mb-6 flex flex-col items-center bg-white dark:bg-[#2A312C] rounded-2xl p-4 border border-transparent dark:border-white/5 shadow-sm">
          <div className="flex gap-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => setRating(star)}
                onMouseEnter={() => setHoverRating(star)}
                onMouseLeave={() => setHoverRating(0)}
                className="transition-transform hover:scale-110"
              >
                <svg
                  width="36"
                  height="36"
                  viewBox="0 0 24 24"
                  fill={(hoverRating || rating) >= star ? "#728C69" : "none"}
                  stroke={(hoverRating || rating) >= star ? "#728C69" : "#8C9287"}
                  strokeWidth="1.5"
                >
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                </svg>
              </button>
            ))}
          </div>
          <span className="text-[10px] text-[#8C9287] mt-3 uppercase tracking-widest font-bold">
            {rating} de 5 estrellas
          </span>
        </div>

        {/* Textarea para el comentario */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-[#1E201D] dark:text-white mb-2">
            Cuéntanos tu experiencia sustentable
          </label>
          <textarea
            value={comentario}
            onChange={(e) => setComentario(e.target.value)}
            placeholder="¿Qué buenas prácticas ecológicas o comunitarias observaste? ¿Algún consejo para otros viajeros?"
            className="w-full bg-white dark:bg-[#2A312C] border border-transparent dark:border-white/5 rounded-2xl p-4 text-sm resize-none h-24 focus:outline-none focus:ring-2 focus:ring-[#728C69]/50 text-[#1E201D] dark:text-white placeholder:text-[#8C9287] shadow-sm"
          />
        </div>

        {/* Añadir foto */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-[#1E201D] dark:text-white mb-2">
            Añadir URL de foto (Opcional)
          </label>
          <div className="flex gap-2">
            <input
              type="url"
              value={nuevaFotoUrl}
              onChange={(e) => setNuevaFotoUrl(e.target.value)}
              placeholder="https://images.unsplash.com/..."
              className="flex-1 bg-white dark:bg-[#2A312C] border border-transparent dark:border-white/5 rounded-xl px-3 py-2 text-xs focus:outline-none text-[#1E201D] dark:text-white placeholder:text-[#8C9287]"
            />
            <button
              type="button"
              onClick={handleAgregarFoto}
              className="px-4 py-2 bg-[#728C69] text-white text-xs font-semibold rounded-xl"
            >
              +
            </button>
          </div>

          {fotos.length > 0 && (
            <div className="flex gap-2 mt-3 overflow-x-auto pb-1">
              {fotos.map((url, i) => (
                <div key={i} className="relative w-14 h-14 rounded-xl overflow-hidden flex-shrink-0 group">
                  <img src={url} alt="Foto subida" className="w-full h-full object-cover" />
                  <button
                    onClick={() => removerFoto(i)}
                    className="absolute inset-0 bg-black/60 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 text-xs"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Botones de Acción */}
        <div className="flex gap-3">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 bg-[#E3E5D8] hover:bg-[#D4D6C8] dark:bg-[#2A352F] dark:hover:bg-[#3D453F] text-[#4A4D46] dark:text-[#D1D5CD] font-medium rounded-2xl py-3.5 transition-colors text-xs"
          >
            Cancelar
          </button>
          <button
            type="button"
            disabled={isSubmitting}
            onClick={handleSubmit}
            className="flex-[2] bg-[#728C69] hover:bg-[#5B7153] text-white font-medium rounded-2xl py-3.5 transition-colors shadow-md flex items-center justify-center gap-2 text-xs disabled:opacity-50"
          >
            {isSubmitting ? "Publicando..." : "Publicar reseña en BD"}
          </button>
        </div>
      </div>
    </div>
  );
}
