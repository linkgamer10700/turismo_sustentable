"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import PaymentErrorModal from "@/components/ui/PaymentErrorModal";
import AddCardModal from "@/components/ui/AddCardModal"; 

export default function CheckoutPage() {
  const router = useRouter();
  const [hasPaymentMethod, setHasPaymentMethod] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [showAddCardModal, setShowAddCardModal] = useState(false);

  const handlePagar = () => {
    if (!hasPaymentMethod) {
      setShowErrorModal(true); // Lanza el error si no hay tarjeta
    } else {
      
      router.push("/reservas/exitosa");
    }
  };

  return (
    <main className="min-h-screen w-full bg-[#F4F1EA] dark:bg-[#1E2420] transition-colors duration-300 py-8 px-4 flex justify-center">
      <div className="w-full max-w-md flex flex-col">
        
        <div className="flex items-center gap-4 mb-6">
          <button onClick={() => window.history.back()} className="text-[#3B523E] dark:text-[#A5B29A] hover:text-[#C81D77] transition-colors">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
          </button>
          <h1 className="font-serif text-2xl text-[#1E201D] dark:text-white">Confirma tu pago</h1>
        </div>

        <div className="bg-white dark:bg-[#2A312C] rounded-[2rem] p-5 mb-8 shadow-sm border border-transparent dark:border-white/5">
          <div className="flex gap-4 mb-6">
            <div className="w-16 h-16 rounded-xl bg-[#C3A978] flex items-center justify-center flex-shrink-0">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="white"><path d="M12 2.5a3.5 3.5 0 1 0 0 7 3.5 3.5 0 1 0 0-7zM5.5 9a3.5 3.5 0 1 0 0 7 3.5 3.5 0 1 0 0-7zM18.5 9a3.5 3.5 0 1 0 0 7 3.5 3.5 0 1 0 0-7zM12 14.5a3.5 3.5 0 1 0 0 7 3.5 3.5 0 1 0 0-7z"/></svg>
            </div>
            <div>
              <h2 className="text-[#1E201D] dark:text-white font-medium text-lg">Nombre 1</h2>
              <p className="text-[#8C9287] text-xs mb-1">Sáb 18 oct · 2 personas</p>
              <p className="text-[#728C69] dark:text-[#A5B29A] text-[10px] flex items-center gap-1">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 6 9 17l-5-5"/></svg>
                Proveedor validado
              </p>
            </div>
          </div>
          <div className="flex justify-between items-center pt-4 border-t border-[#E3E5D8] dark:border-[#3D453F]">
            <span className="text-sm text-[#8C9287]">Total</span>
            <span className="font-serif text-lg text-[#1E201D] dark:text-white font-bold">$850 MXN</span>
          </div>
        </div>

        <h3 className="text-lg font-serif text-[#1E201D] dark:text-white mb-4">Método de pago</h3>
        
        {hasPaymentMethod ? (
          <div className="bg-[#E3E5D8]/50 dark:bg-[#3D453F]/50 border border-[#728C69] dark:border-[#85A07A] rounded-2xl p-4 flex items-center justify-between mb-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-7 bg-[#728C69] rounded-md flex items-center justify-center">
                <div className="w-2 h-2 bg-white/50 rounded-full ml-auto mr-1"></div>
              </div>
              <div>
                <p className="text-[#1E201D] dark:text-white text-sm font-medium">Tarjeta terminada en 4582</p>
                <p className="text-[#8C9287] text-xs">Visa · Crédito</p>
              </div>
            </div>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#728C69" strokeWidth="2"><path d="M20 6 9 17l-5-5"/></svg>
          </div>
        ) : (
          <div className="bg-white dark:bg-[#2A312C] border border-dashed border-[#8C9287] rounded-2xl p-6 flex flex-col items-center justify-center text-center mb-3">
            <p className="text-[#8C9287] text-sm mb-3">Aún no has agregado un método de pago.</p>
          </div>
        )}

        <button 
          onClick={() => setShowAddCardModal(true)} // Abre el nuevo modal
          className="w-full bg-[#E3E5D8]/50 dark:bg-[#2A312C] text-[#4A4D46] dark:text-[#D1D5CD] text-sm font-medium rounded-2xl py-4 flex justify-center items-center gap-2 mb-8 hover:bg-[#E3E5D8] transition-colors"
        >
          <span className="text-lg">+</span> Agregar {hasPaymentMethod ? "otro" : ""} método
        </button>

        <h3 className="text-lg font-serif text-[#1E201D] dark:text-white mb-4">Detalle del cobro</h3>
        <div className="flex flex-col gap-3 mb-6 border-b border-[#E3E5D8] dark:border-[#3D453F] pb-6">
          <div className="flex justify-between text-sm">
            <span className="text-[#8C9287]">Experiencia</span>
            <span className="text-[#1E201D] dark:text-white font-medium">$800</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-[#8C9287]">Aportación de impacto</span>
            <span className="text-[#1E201D] dark:text-white font-medium">$50</span>
          </div>
          <div className="flex justify-between text-base mt-2">
            <span className="text-[#1E201D] dark:text-white font-bold">Total</span>
            <span className="text-[#1E201D] dark:text-white font-bold">$850 MXN</span>
          </div>
        </div>

        <div className="bg-[#E3E5D8]/50 dark:bg-[#3D453F]/30 rounded-xl p-3 flex items-center gap-2 mb-6">
          <div className="w-5 h-5 bg-[#728C69] rotate-45 rounded-sm flex items-center justify-center flex-shrink-0">
             <div className="w-2 h-2 bg-white rounded-full"></div>
          </div>
          <p className="text-xs text-[#63665E] dark:text-[#A5B29A]">
            Pago seguro. Recibirás tu confirmación al instante.
          </p>
        </div>

        <button 
          onClick={handlePagar}
          className="w-full bg-[#C81D77] hover:bg-[#A91864] text-white font-medium rounded-2xl py-4 transition-colors shadow-md mb-3"
        >
          Pagar $850 MXN
        </button>
        <p className="text-center text-[10px] text-[#8C9287]">
          Al confirmar aceptas los términos de reserva.
        </p>
      </div>

      <PaymentErrorModal 
        isOpen={showErrorModal} 
        onClose={() => setShowErrorModal(false)} 
      />

      {/* Se inyecta el nuevo modal de la tarjeta */}
      <AddCardModal 
        isOpen={showAddCardModal}
        onClose={() => setShowAddCardModal(false)}
        onAdd={() => setHasPaymentMethod(true)} 
      />

    </main>
  );
}