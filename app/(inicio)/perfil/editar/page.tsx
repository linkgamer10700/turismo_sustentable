"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function EditarPerfilPage() {
  const router = useRouter();

  const [nombre, setNombre] = useState("");
  const [correo, setCorreo] = useState("");
  const [password, setPassword] = useState("");
  const [rol, setRol] = useState<string>("TURISTA");
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [feedback, setFeedback] = useState<{ type: "success" | "error"; text: string } | null>(null);

  useEffect(() => {
    async function loadUserData() {
      setIsLoading(true);
      try {
        const res = await fetch("/api/user/profile");
        if (res.status === 401) {
          router.push("/login/loginUser?callbackUrl=/perfil/editar");
          return;
        }

        const data = await res.json();
        if (data.success && data.data) {
          setNombre(data.data.name || "");
          setCorreo(data.data.email || "");
          if (data.data.rol) setRol(data.data.rol);
        }
      } catch {
        setFeedback({ type: "error", text: "Error al cargar la información del perfil" });
      } finally {
        setIsLoading(false);
      }
    }

    loadUserData();
  }, [router]);

  const backUrl = rol === "ADMINISTRADOR" ? "/admin/auditorias" : rol === "PROVEEDOR" ? "/negocio/dashboard" : "/perfil";

  const handleGuardar = async (e: React.FormEvent) => {
    e.preventDefault();
    if (nombre.trim().length < 2) {
      setFeedback({ type: "error", text: "El nombre debe tener al menos 2 caracteres" });
      return;
    }

    if (password && password.length < 6) {
      setFeedback({ type: "error", text: "La nueva contraseña debe tener al menos 6 caracteres" });
      return;
    }

    setIsSaving(true);
    setFeedback(null);

    try {
      const payload: { name: string; password?: string } = {
        name: nombre.trim(),
      };

      if (password && password.trim().length >= 6) {
        payload.password = password.trim();
      }

      const res = await fetch("/api/user/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error || "No se pudo actualizar el perfil");
      }

      setFeedback({ type: "success", text: "¡Perfil actualizado con éxito!" });
      setTimeout(() => {
        router.push(backUrl);
      }, 1000);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Error al guardar cambios";
      setFeedback({ type: "error", text: message });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <main className="min-h-screen w-full bg-[#F4F1EA] dark:bg-[#1E2420] transition-colors duration-300 py-8 px-4 flex justify-center pb-24">
      <div className="w-full max-w-md flex flex-col">
        {/* Encabezado con botón de regreso */}
        <div className="flex items-center gap-4 mb-8">
          <Link
            href={backUrl}
            className="w-10 h-10 rounded-full bg-white dark:bg-[#2A312C] flex items-center justify-center shadow-sm text-[#728C69] dark:text-[#A5B29A] hover:bg-[#E3E5D8] dark:hover:bg-[#3D453F] transition-colors"
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="m15 18-6-6 6-6" />
            </svg>
          </Link>
          <div>
            <h1 className="font-serif text-3xl text-[#1E201D] dark:text-white">Editar perfil</h1>
            <p className="text-sm text-[#63665E] dark:text-[#A5B29A]">
              Actualiza tu información personal
            </p>
          </div>
        </div>

        {feedback && (
          <div
            className={`p-4 rounded-xl text-xs mb-4 text-center ${
              feedback.type === "success"
                ? "bg-green-100 text-green-800 dark:bg-green-950/40 dark:text-green-300 border border-green-300"
                : "bg-red-100 text-red-800 dark:bg-red-950/40 dark:text-red-300 border border-red-300"
            }`}
          >
            {feedback.text}
          </div>
        )}

        {/* Formulario */}
        <div className="bg-white dark:bg-[#2A312C] rounded-[1.5rem] p-6 shadow-sm border border-transparent dark:border-white/5">
          {isLoading ? (
            <div className="space-y-4 animate-pulse">
              <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded-xl" />
              <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded-xl" />
              <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded-xl" />
            </div>
          ) : (
            <form className="space-y-5" onSubmit={handleGuardar}>
              <div>
                <label className="text-xs font-medium text-[#232621] dark:text-[#D1D5CD] block mb-1.5">
                  Nombre completo
                </label>
                <input
                  type="text"
                  value={nombre}
                  onChange={(e) => setNombre(e.target.value)}
                  placeholder="Tu nombre completo"
                  className="w-full bg-[#F2EFE9] dark:bg-[#18201C] text-[#232621] dark:text-white rounded-xl px-4 h-12 text-sm focus:outline-none focus:ring-2 focus:ring-[#728C69] transition-all border border-transparent dark:border-white/5"
                />
              </div>

              <div>
                <label className="text-xs font-medium text-[#232621] dark:text-[#D1D5CD] block mb-1.5">
                  Correo electrónico
                </label>
                <input
                  type="email"
                  value={correo}
                  disabled
                  className="w-full bg-[#E8E5DE] dark:bg-[#141A16] text-[#71756D] dark:text-[#7C8379] rounded-xl px-4 h-12 text-sm border border-transparent cursor-not-allowed opacity-80"
                />
                <span className="text-[10px] text-[#8C9287] mt-1 block">
                  El correo está vinculado a tu cuenta y no puede modificarse.
                </span>
              </div>

              <div>
                <label className="text-xs font-medium text-[#232621] dark:text-[#D1D5CD] block mb-1.5">
                  Nueva contraseña (Opcional)
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Deja en blanco para conservar la actual"
                  className="w-full bg-[#F2EFE9] dark:bg-[#18201C] text-[#232621] dark:text-white placeholder-[#8C9287] dark:placeholder-[#63665E] rounded-xl px-4 h-12 text-sm focus:outline-none focus:ring-2 focus:ring-[#728C69] transition-all border border-transparent dark:border-white/5"
                />
              </div>

              <button
                type="submit"
                disabled={isSaving}
                className="w-full bg-[#728C69] hover:bg-[#5B7153] dark:bg-[#85A07A] dark:hover:bg-[#A5B29A] text-white font-semibold rounded-xl h-12 mt-4 transition-colors shadow-sm disabled:opacity-50"
              >
                {isSaving ? "Guardando..." : "Guardar cambios"}
              </button>
            </form>
          )}
        </div>
      </div>
    </main>
  );
}
