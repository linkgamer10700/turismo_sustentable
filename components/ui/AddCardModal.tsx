"use client";

import React, { useState } from "react";

interface AddCardModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: () => void;
}

export default function AddCardModal({ isOpen, onClose, onAdd }: AddCardModalProps) {
  const [cardNumber, setCardNumber] = useState("");
  
  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAdd(); // Le avisa al Checkout que ya se agregó la tarjeta
    onClose(); // Cierra el modal
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-[#FAF9F5] dark:bg-[#202823] w-full max-w-md rounded-[2rem] p-6 sm:p-8 shadow-2xl relative animate-in slide-in-from-bottom-4 sm:slide-in-from-bottom-0">
        
        <button onClick={onClose} className="absolute top-6 right-6 text-[#8C9287] hover:text-[#C81D77] transition-colors">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
        </button>

        <h3 className="font-serif text-2xl text-[#1E201D] dark:text-white mb-6">Agregar tarjeta</h3>
        
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className="block text-xs font-medium text-[#63665E] dark:text-[#A5B29A] mb-1">Nombre del titular</label>
            <input required type="text" placeholder="Ej. María López" className="w-full bg-white dark:bg-[#2A312C] border border-[#E3E5D8] dark:border-white/10 rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#728C69] text-[#1E201D] dark:text-white" />
          </div>
          
          <div>
            <label className="block text-xs font-medium text-[#63665E] dark:text-[#A5B29A] mb-1">Número de tarjeta</label>
            <input required type="text" maxLength={19} placeholder="0000 0000 0000 0000" value={cardNumber} onChange={(e) => setCardNumber(e.target.value.replace(/\D/g, '').replace(/(.{4})/g, '$1 ').trim())} className="w-full bg-white dark:bg-[#2A312C] border border-[#E3E5D8] dark:border-white/10 rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#728C69] text-[#1E201D] dark:text-white" />
          </div>

          <div className="flex gap-4">
            <div className="flex-1">
              <label className="block text-xs font-medium text-[#63665E] dark:text-[#A5B29A] mb-1">Vencimiento</label>
              <input required type="text" placeholder="MM/YY" maxLength={5} className="w-full bg-white dark:bg-[#2A312C] border border-[#E3E5D8] dark:border-white/10 rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#728C69] text-[#1E201D] dark:text-white" />
            </div>
            <div className="flex-1">
              <label className="block text-xs font-medium text-[#63665E] dark:text-[#A5B29A] mb-1">CVV</label>
              <input required type="password" placeholder="123" maxLength={4} className="w-full bg-white dark:bg-[#2A312C] border border-[#E3E5D8] dark:border-white/10 rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#728C69] text-[#1E201D] dark:text-white" />
            </div>
          </div>

          <button type="submit" className="w-full bg-[#728C69] hover:bg-[#5B7153] dark:bg-[#85A07A] dark:hover:bg-[#A5B29A] text-white dark:text-[#1E2420] font-medium rounded-2xl py-3.5 mt-4 transition-colors shadow-sm">
            Guardar tarjeta
          </button>
        </form>
      </div>
    </div>
  );
}