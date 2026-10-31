"use client";

import React from "react";

interface PaymentErrorModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function PaymentErrorModal({ isOpen, onClose }: PaymentErrorModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-[#FAF9F5] dark:bg-[#202823] w-full max-w-sm rounded-[2rem] p-8 text-center shadow-2xl relative">
        
        {/* Ícono de Error */}
        <div className="w-20 h-20 rounded-full bg-[#C81D77] mx-auto flex items-center justify-center mb-6 shadow-lg shadow-[#C81D77]/20">
          <span className="text-white text-4xl font-serif">!</span>
        </div>
        
        <h3 className="font-serif text-2xl text-[#1E201D] dark:text-white mb-2 leading-tight">
          No pudimos procesar tu pago
        </h3>
        
        <p className="text-[#63665E] dark:text-[#A5B29A] text-sm mb-8 px-2">
          Revisa los datos de tu tarjeta o intenta con otro método de pago.
        </p>
        
        {/* Botones */}
        <div className="flex flex-col gap-3">
          <button 
            onClick={onClose}
            className="w-full bg-[#E3E5D8] hover:bg-[#D4D6C8] dark:bg-[#2A352F] dark:hover:bg-[#3D453F] text-[#4A4D46] dark:text-[#D1D5CD] font-medium rounded-2xl py-3.5 transition-colors"
          >
            Cambiar método de pago
          </button>
          
          <button 
            onClick={onClose}
            className="w-full bg-[#C81D77] hover:bg-[#A91864] text-white font-medium rounded-2xl py-3.5 transition-colors shadow-sm"
          >
            Intentar de nuevo
          </button>
        </div>

      </div>
    </div>
  );
}