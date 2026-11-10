"use client";

import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import TarjetaActividad from "@/components/TarjetaActividad";

interface FavoritoItem {
  id: string;
  experienciaId: string;
  experiencia: {
    id: string;
    titulo: string;
    categoria: string;
    alcaldiaCDMX: string;
    precio: number | string;
    imagenes?: string[] | null;
    proveedor?: {
      nombreNegocio: string | null;
      alcaldiaCDMX: string | null;
    };
  };
}

export default function FavoritosPage() {
  const [favoritos, setFavoritos] = useState<FavoritoItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isUnauthorized, setIsUnauthorized] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const loadFavoritos = useCallback(async () => {
    setIsLoading(true);
    setErrorMessage(null);
    setIsUnauthorized(false);

    try {
      const res = await fetch("/api/user/favoritos");

      if (res.status === 401) {
        setIsUnauthorized(true);
        return;
      }

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Error al cargar favoritos");
      }

      setFavoritos(data.favoritos || []);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Error al consultar tus favoritos";
      setErrorMessage(message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadFavoritos();
  }, [loadFavoritos]);

  return (
    <main className="min-h-screen w-full bg-[#F4F1EA] dark:bg-[#1E2420] transition-colors duration-300 py-8 px-4 flex justify-center pb-24">
      <div className="w-full max-w-4xl flex flex-col">
        {/* Encabezado con botón de regreso */}
        <div className="flex items-center gap-4 mb-8">
          <Link
            href="/perfil"
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
            <h1 className="font-serif text-3xl text-[#1E201D] dark:text-white">Mis Favoritos</h1>
            <p className="text-sm text-[#63665E] dark:text-[#A5B29A]">
              {isLoading
                ? "Cargando tus actividades guardadas..."
                : `${favoritos.length} experiencia${
                    favoritos.length === 1 ? "" : "s"
                  } guardada${favoritos.length === 1 ? "" : "s"}`}
            </p>
          </div>
        </div>

        {/* Estado no autenticado */}
        {isUnauthorized && (
          <div className="bg-white dark:bg-[#2A312C] rounded-[2rem] p-8 text-center shadow-sm border border-transparent dark:border-white/5 my-4">
            <h2 className="font-serif text-2xl text-[#1E201D] dark:text-white mb-2">
              Inicia sesión para guardar favoritos
            </h2>
            <p className="text-sm text-[#63665E] dark:text-[#A5B29A] max-w-md mx-auto mb-6">
              Organiza tu itinerario sustentable guardando las mejores actividades de la CDMX.
            </p>
            <Link
              href="/login/loginUser?callbackUrl=/perfil/favoritos"
              className="inline-block bg-[#728C69] hover:bg-[#5B7153] text-white text-sm font-medium px-6 py-3 rounded-xl transition-colors"
            >
              Iniciar sesión
            </Link>
          </div>
        )}

        {/* Error */}
        {errorMessage && !isUnauthorized && (
          <div className="bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800/40 rounded-2xl p-6 text-center mb-6">
            <p className="text-sm text-red-600 dark:text-red-400 mb-3">{errorMessage}</p>
            <button
              onClick={loadFavoritos}
              className="text-xs bg-[#728C69] text-white px-4 py-2 rounded-lg hover:bg-[#5B7153]"
            >
              Reintentar
            </button>
          </div>
        )}

        {/* Loading Skeletons */}
        {isLoading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 animate-pulse">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="bg-white dark:bg-[#2A312C] rounded-[1.5rem] h-72 shadow-sm"
              >
                <div className="h-44 bg-gray-200 dark:bg-gray-700" />
                <div className="p-4 space-y-2">
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4" />
                  <div className="h-3 bg-gray-100 dark:bg-gray-800 rounded w-1/2" />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Sin Favoritos */}
        {!isLoading && !isUnauthorized && !errorMessage && favoritos.length === 0 && (
          <div className="bg-white dark:bg-[#2A312C] border border-dashed border-[#8C9287]/40 rounded-3xl p-12 text-center my-6">
            <h3 className="text-lg font-serif text-[#1E201D] dark:text-white mb-2">
              Aún no has guardado favoritos
            </h3>
            <p className="text-sm text-[#63665E] dark:text-[#A5B29A] max-w-sm mx-auto mb-6">
              Explora el catálogo y presiona el corazón en cualquier experiencia para armar tu ruta ecológica.
            </p>
            <Link
              href="/busqueda"
              className="text-xs bg-[#728C69] text-white px-5 py-2.5 rounded-full hover:bg-[#5B7153] transition-colors"
            >
              Ir a explorar experiencias
            </Link>
          </div>
        )}

        {/* Cuadrícula de Favoritos */}
        {!isLoading && !isUnauthorized && !errorMessage && favoritos.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {favoritos.map((fav) => {
              const exp = fav.experiencia;
              const firstImage =
                Array.isArray(exp.imagenes) && exp.imagenes.length > 0
                  ? exp.imagenes[0]
                  : null;

              return (
                <TarjetaActividad
                  key={fav.id}
                  id={exp.id}
                  titulo={exp.titulo}
                  ubicacion={`${exp.alcaldiaCDMX}, CDMX`}
                  categoria={exp.categoria}
                  precio={Number(exp.precio)}
                  rating="4.9"
                  imagenUrl={firstImage}
                  isFavoritoInicial={true}
                />
              );
            })}
          </div>
        )}
      </div>
    </main>
  );
}
