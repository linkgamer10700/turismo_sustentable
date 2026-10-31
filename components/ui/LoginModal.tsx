"use client";

import React from "react";
import { useRouter } from "next/navigation";

// Definimos las propiedades que este componente va a recibir
interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  accionPendiente: string;
  onSimulateLogin: () => void;
}

export default function LoginModal({ isOpen, onClose, accionPendiente, onSimulateLogin }: LoginModalProps) {
  const router = useRouter();

  // Si isOpen es falso, no dibujamos nada en la pantalla
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-[#FAF9F5] dark:bg-[#202823] w-full max-w-sm rounded-[2rem] p-8 text-center shadow-2xl">
        
        <div className="w-20 h-20 rounded-full bg-[#C81D77] mx-auto flex items-center justify-center mb-6 shadow-lg shadow-[#C81D77]/20">
          <span className="text-white text-4xl font-serif">!</span>
        </div>
        
        <h3 className="font-serif text-2xl text-[#1E201D] dark:text-white mb-2 leading-tight">
          Inicia sesión para continuar
        </h3>
        
        <p className="text-[#63665E] dark:text-[#A5B29A] text-sm mb-8 px-2">
          Para {accionPendiente} necesitamos que ingreses a tu cuenta o te registres con nosotros.
        </p>
        
        <div className="flex flex-col gap-3">
          <button 
            onClick={() => router.push("/login/loginUser")}
            className="w-full bg-[#C81D77] hover:bg-[#A91864] text-white font-medium rounded-2xl py-3.5 transition-colors shadow-sm"
          >
            Iniciar sesión
          </button>
          
          <div className="flex gap-3">
            <button 
              onClick={onClose}
              className="flex-1 bg-[#E3E5D8] hover:bg-[#D4D6C8] dark:bg-[#2A352F] dark:hover:bg-[#3D453F] text-[#4A4D46] dark:text-[#D1D5CD] font-medium rounded-2xl py-3.5 transition-colors"
            >
              Cancelar
            </button>
            <button 
              onClick={onSimulateLogin}
              className="flex-1 bg-[#728C69] hover:bg-[#5B7153] dark:bg-[#85A07A] dark:hover:bg-[#A5B29A] text-white dark:text-[#1E2420] font-medium rounded-2xl py-3.5 transition-colors"
            >
              Simular Login
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}