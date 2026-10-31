"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function EditarPerfilPage() {
  const router = useRouter();
  
  // Estados inicializados con los datos simulados del usuario
  const [nombre, setNombre] = useState("Mariana López");
  const [correo, setCorreo] = useState("mariana@correo.com");
  const [password, setPassword] = useState("");

  const handleGuardar = (e: React.FormEvent) => {
    e.preventDefault();
    alert("¡Datos actualizados con éxito!");
    router.push("/perfil");
  };

  return (
    <main className="min-h-screen w-full bg-[#F4F1EA] dark:bg-[#1E2420] transition-colors duration-300 py-8 px-4 flex justify-center pb-24">
      <div className="w-full max-w-md flex flex-col">
        
        {/* Encabezado con botón de regreso */}
        <div className="flex items-center gap-4 mb-8">
          <Link 
            href="/perfil"
            className="w-10 h-10 rounded-full bg-white dark:bg-[#2A312C] flex items-center justify-center shadow-sm text-[#728C69] dark:text-[#A5B29A] hover:bg-[#E3E5D8] dark:hover:bg-[#3D453F] transition-colors"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m15 18-6-6 6-6"/></svg>
          </Link>
          <div>
            <h1 className="font-serif text-3xl text-[#1E201D] dark:text-white">Editar perfil</h1>
            <p className="text-sm text-[#63665E] dark:text-[#A5B29A]">Actualiza tu información personal</p>
          </div>
        </div>

        {/* Formulario */}
        <div className="bg-white dark:bg-[#2A312C] rounded-[1.5rem] p-6 shadow-sm border border-transparent dark:border-white/5">
          <form className="space-y-5" onSubmit={handleGuardar}>
            
            <div>
              <label className="text-xs font-medium text-[#232621] dark:text-[#D1D5CD] block mb-1.5">Nombre completo</label>
              <input
                type="text"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                className="w-full bg-[#F2EFE9] dark:bg-[#18201C] text-[#232621] dark:text-white rounded-xl px-4 h-12 text-sm focus:outline-none focus:ring-2 focus:ring-[#728C69] transition-all border border-transparent dark:border-white/5"
              />
            </div>
            
            <div>
              <label className="text-xs font-medium text-[#232621] dark:text-[#D1D5CD] block mb-1.5">Correo electrónico</label>
              <input
                type="email"
                value={correo}
                onChange={(e) => setCorreo(e.target.value)}
                className="w-full bg-[#F2EFE9] dark:bg-[#18201C] text-[#232621] dark:text-white rounded-xl px-4 h-12 text-sm focus:outline-none focus:ring-2 focus:ring-[#728C69] transition-all border border-transparent dark:border-white/5"
              />
            </div>

            <div>
              <label className="text-xs font-medium text-[#232621] dark:text-[#D1D5CD] block mb-1.5">Nueva contraseña</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Deja en blanco para no cambiarla"
                className="w-full bg-[#F2EFE9] dark:bg-[#18201C] text-[#232621] dark:text-white placeholder-[#8C9287] dark:placeholder-[#63665E] rounded-xl px-4 h-12 text-sm focus:outline-none focus:ring-2 focus:ring-[#728C69] transition-all border border-transparent dark:border-white/5"
              />
            </div>

            <button 
              type="submit"
              className="w-full bg-[#728C69] hover:bg-[#5B7153] dark:bg-[#85A07A] dark:hover:bg-[#A5B29A] text-white font-semibold rounded-xl h-12 mt-4 transition-colors shadow-sm"
            >
              Guardar cambios
            </button>
            
          </form>
        </div>

      </div>
    </main>
  );
}