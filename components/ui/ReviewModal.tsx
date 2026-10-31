"use client";

import React, { useState } from "react";

interface ReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  nombreLugar: string;
}

export default function ReviewModal({ isOpen, onClose, nombreLugar }: ReviewModalProps) {
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comentario, setComentario] = useState("");
  
  // Nuevo estado para guardar las imágenes seleccionadas
  const [fotos, setFotos] = useState<File[]>([]);

  if (!isOpen) return null;

  // Función para manejar la subida de archivos
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const nuevasFotos = Array.from(e.target.files);
      setFotos(prev => [...prev, ...nuevasFotos]);
    }
  };

  // Función para quitar una foto de la previsualización
  const removerFoto = (index: number) => {
    setFotos(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = () => {
    if (rating === 0) {
      alert("Por favor, selecciona una calificación en estrellas.");
      return;
    }
    if (!comentario.trim()) {
      alert("Por favor, escribe un breve comentario.");
      return;
    }
    
    alert(`¡Gracias por tu reseña!\nLugar: ${nombreLugar}\nCalificación: ${rating} estrellas\nComentario: ${comentario}\nFotos adjuntas: ${fotos.length}`);
    
    // Limpiamos todo al cerrar
    setRating(0);
    setComentario("");
    setFotos([]);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-[#FAF9F5] dark:bg-[#202823] w-full max-w-lg rounded-[2rem] p-8 shadow-2xl relative">
        
        <button onClick={onClose} className="absolute top-6 right-6 text-[#8C9287] hover:text-[#C81D77] transition-colors">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
        </button>

        <h3 className="font-serif text-3xl text-[#1E201D] dark:text-white mb-2 pr-6">
          Escribe una reseña
        </h3>
        
        <p className="text-[#63665E] dark:text-[#A5B29A] text-sm mb-6">
          ¿Cómo fue tu experiencia en <span className="font-medium text-[#C81D77] dark:text-[#E24A96]">{nombreLugar}</span>?
        </p>
        
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
                  width="36" height="36" viewBox="0 0 24 24" 
                  fill={(hoverRating || rating) >= star ? "#728C69" : "none"} 
                  stroke={(hoverRating || rating) >= star ? "#728C69" : "#8C9287"} 
                  strokeWidth="1.5"
                >
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                </svg>
              </button>
            ))}
          </div>
          <span className="text-[10px] text-[#8C9287] mt-3 uppercase tracking-widest font-bold">
            {rating === 0 ? "Selecciona una calificación" : `${rating} de 5 estrellas`}
          </span>
        </div>

        {/* Textarea para el comentario */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-[#1E201D] dark:text-white mb-2">
            Cuéntanos los detalles
          </label>
          <textarea 
            value={comentario}
            onChange={(e) => setComentario(e.target.value)}
            placeholder="¿Qué fue lo que más te gustó? ¿Algún consejo para otros viajeros?"
            className="w-full bg-white dark:bg-[#2A312C] border border-transparent dark:border-white/5 rounded-2xl p-4 text-sm resize-none h-24 focus:outline-none focus:ring-2 focus:ring-[#728C69]/50 text-[#1E201D] dark:text-white placeholder:text-[#8C9287] shadow-sm"
          />
        </div>

        {/* ================= SECCIÓN DE SUBIDA DE FOTOS ================= */}
        <div className="mb-8">
          <label className="block text-sm font-medium text-[#1E201D] dark:text-white mb-2">
            Añadir fotos (Opcional)
          </label>
          <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
            
            {/* Botón interactivo para subir imágenes */}
            <label className="flex-shrink-0 w-20 h-20 rounded-2xl border-2 border-dashed border-[#A5B29A] dark:border-[#4B6846] flex flex-col items-center justify-center cursor-pointer hover:bg-[#728C69]/10 transition-colors text-[#728C69] dark:text-[#A5B29A]">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" x2="12" y1="3" y2="15"/></svg>
              <span className="text-[10px] mt-1 font-medium">Subir</span>
              {/* Input oculto que abre el explorador de archivos */}
              <input type="file" accept="image/*" multiple className="hidden" onChange={handleImageChange} />
            </label>
            
            {/* Mapeo de previsualizaciones */}
            {fotos.map((foto, index) => (
              <div key={index} className="flex-shrink-0 w-20 h-20 rounded-2xl bg-[#E3E5D8] dark:bg-[#3D453F] relative overflow-hidden group shadow-sm border border-transparent dark:border-white/10">
                {/* URL.createObjectURL simula la imagen temporalmente en el navegador */}
                <img src={URL.createObjectURL(foto)} alt={`Preview ${index}`} className="w-full h-full object-cover" />
                
                {/* Botón de eliminar que aparece al hacer hover */}
                <button 
                  onClick={() => removerFoto(index)} 
                  className="absolute inset-0 bg-black/60 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                  title="Eliminar foto"
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
                </button>
              </div>
            ))}
          </div>
        </div>
        
        {/* Botones de Acción */}
        <div className="flex gap-3">
          <button 
            onClick={onClose}
            className="flex-1 bg-[#E3E5D8] hover:bg-[#D4D6C8] dark:bg-[#2A352F] dark:hover:bg-[#3D453F] text-[#4A4D46] dark:text-[#D1D5CD] font-medium rounded-2xl py-3.5 transition-colors"
          >
            Cancelar
          </button>
          <button 
            onClick={handleSubmit}
            className="flex-[2] bg-[#728C69] hover:bg-[#5B7153] dark:bg-[#85A07A] dark:hover:bg-[#A5B29A] text-white dark:text-[#1E2420] font-medium rounded-2xl py-3.5 transition-colors shadow-md flex items-center justify-center gap-2"
          >
            Publicar reseña
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 2 11 13"/><path d="m22 2-7 20-4-9-9-4Z"/></svg>
          </button>
        </div>

      </div>
    </div>
  );
}