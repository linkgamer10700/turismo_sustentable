"use client";

import React, { useState, useEffect, useCallback } from "react";
import TarjetaActividad from "@/components/TarjetaActividad";

interface ExperienciaItem {
  id: string;
  titulo: string;
  descripcion: string;
  categoria: string;
  alcaldiaCDMX: string;
  ubicacionDetallada?: string | null;
  precio: number | string;
  duracionMinutos: number;
  capacidadCarga: number;
  imagenes?: string[] | null;
  proveedor?: {
    id: string;
    nombreNegocio: string | null;
    alcaldiaCDMX: string | null;
  };
}

export default function BusquedaPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [activeFilter, setActiveFilter] = useState("Todas");
  const [experiencias, setExperiencias] = useState<ExperienciaItem[]>([]);
  const [favoriteIds, setFavoriteIds] = useState<Set<string>>(new Set());
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const filters = [
    "Todas",
    "Naturaleza",
    "Ecoturismo",
    "Gastronomía",
    "Cultura",
    "Aventura",
  ];

  // Debounce search input (300ms)
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchTerm.trim());
    }, 300);

    return () => clearTimeout(handler);
  }, [searchTerm]);

  // Fetch user favorites to show heart states
  useEffect(() => {
    async function loadFavorites() {
      try {
        const res = await fetch("/api/user/favoritos");
        if (res.ok) {
          const data = await res.json();
          if (data.success && Array.isArray(data.favoritos)) {
            const favIds = new Set<string>(
              data.favoritos.map((f: { experienciaId: string }) => f.experienciaId)
            );
            setFavoriteIds(favIds);
          }
        }
      } catch {
        // User may not be logged in; fail silently for public catalogue
      }
    }

    loadFavorites();
  }, []);

  // Fetch experiences matching filters
  const fetchExperiencias = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const params = new URLSearchParams();
      if (activeFilter !== "Todas") {
        params.set("categoria", activeFilter);
      }
      if (debouncedSearch) {
        params.set("buscar", debouncedSearch);
      }

      const queryString = params.toString();
      const endpoint = queryString ? `/api/experiencias?${queryString}` : "/api/experiencias";

      const res = await fetch(endpoint);
      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error || "Error al cargar las experiencias");
      }

      setExperiencias(data.data || []);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Error inesperado de conexión";
      setError(message);
    } finally {
      setIsLoading(false);
    }
  }, [activeFilter, debouncedSearch]);

  useEffect(() => {
    fetchExperiencias();
  }, [fetchExperiencias]);

  return (
    <main className="min-h-screen w-full bg-[#F2EFE9] dark:bg-[#18201C] transition-colors duration-300 py-12 px-6 flex justify-center">
      <div className="w-full max-w-4xl flex flex-col">
        {/* Cabecera */}
        <h1 className="font-serif text-4xl lg:text-5xl text-[#1E201D] dark:text-white mb-2 leading-tight">
          Tu próxima aventura,
          <br />a tu manera.
        </h1>
        <p className="text-[#63665E] dark:text-[#9EA399] text-sm mb-8">
          Descubre experiencias sustentables verificadas en la Ciudad de México.
        </p>

        {/* Buscador */}
        <div className="relative mb-6">
          <svg
            className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <circle cx="11" cy="11" r="8" />
            <path d="m21 21-4.3-4.3" />
          </svg>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Busca por nombre, alcaldía o descripción..."
            className="w-full bg-white dark:bg-[#252D28] border border-transparent dark:border-white/5 rounded-full pl-12 pr-4 h-14 text-sm focus:outline-none focus:ring-2 focus:ring-[#728C69] transition-all text-[#1E201D] dark:text-white shadow-sm"
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm("")}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 text-xs bg-gray-100 dark:bg-gray-800 rounded-full px-2 py-1"
            >
              Limpiar
            </button>
          )}
        </div>

        {/* Filtros horizontales */}
        <div className="flex gap-2 overflow-x-auto pb-4 scrollbar-hide mb-8">
          {filters.map((f) => (
            <button
              key={f}
              onClick={() => setActiveFilter(f)}
              className={`whitespace-nowrap px-5 py-2 rounded-full text-xs font-medium transition-colors border ${
                activeFilter === f
                  ? "bg-[#728C69] text-white border-[#728C69]"
                  : "bg-white dark:bg-[#252D28] text-[#63665E] dark:text-[#A5B29A] border-gray-200 dark:border-white/5 hover:border-[#728C69]"
              }`}
            >
              {f}
            </button>
          ))}
        </div>

        {/* Sección de resultados */}
        <div className="flex justify-between items-end mb-6">
          <div>
            <h2 className="font-serif text-2xl text-[#1E201D] dark:text-white">
              {activeFilter === "Todas"
                ? "Catálogo sustentable"
                : `Experiencias: ${activeFilter}`}
            </h2>
            <p className="text-xs text-[#63665E] dark:text-[#9EA399] mt-1">
              {isLoading
                ? "Buscando experiencias disponibles..."
                : `${experiencias.length} experiencia${
                    experiencias.length === 1 ? "" : "s"
                  } encontrada${experiencias.length === 1 ? "" : "s"}`}
            </p>
          </div>
        </div>

        {/* Estado de Error */}
        {error && (
          <div className="bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800/40 rounded-2xl p-6 text-center mb-8">
            <p className="text-sm text-red-600 dark:text-red-400 mb-3">{error}</p>
            <button
              onClick={fetchExperiencias}
              className="text-xs bg-[#728C69] text-white px-4 py-2 rounded-lg hover:bg-[#5B7153] transition-colors"
            >
              Reintentar
            </button>
          </div>
        )}

        {/* Skeletons de Carga */}
        {isLoading && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-pulse">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="bg-white dark:bg-[#2A312C] rounded-[1.5rem] h-80 overflow-hidden shadow-sm"
              >
                <div className="h-48 bg-gray-200 dark:bg-[#343C36]" />
                <div className="p-5 space-y-3">
                  <div className="h-5 bg-gray-200 dark:bg-[#343C36] rounded w-3/4" />
                  <div className="h-4 bg-gray-100 dark:bg-[#252D28] rounded w-1/2" />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Sin Resultados */}
        {!isLoading && !error && experiencias.length === 0 && (
          <div className="bg-white dark:bg-[#2A312C] border border-dashed border-gray-300 dark:border-gray-700 rounded-3xl p-12 text-center my-6">
            <div className="w-14 h-14 mx-auto mb-4 bg-green-100 dark:bg-green-950/40 rounded-full flex items-center justify-center text-[#728C69]">
              <svg
                width="28"
                height="28"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <circle cx="11" cy="11" r="8" />
                <path d="m21 21-4.3-4.3" />
              </svg>
            </div>
            <h3 className="text-lg font-serif text-[#1E201D] dark:text-white mb-2">
              No encontramos experiencias
            </h3>
            <p className="text-sm text-[#63665E] dark:text-[#9EA399] max-w-sm mx-auto mb-6">
              No hay actividades que coincidan con &quot;{searchTerm || activeFilter}&quot;.
              Intenta con otra búsqueda o categoría.
            </p>
            <button
              onClick={() => {
                setSearchTerm("");
                setActiveFilter("Todas");
              }}
              className="text-xs bg-[#728C69] text-white px-5 py-2.5 rounded-full hover:bg-[#5B7153] transition-colors"
            >
              Ver todas las experiencias
            </button>
          </div>
        )}

        {/* Listado de Tarjetas */}
        {!isLoading && !error && experiencias.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {experiencias.map((item) => {
              const firstImage =
                Array.isArray(item.imagenes) && item.imagenes.length > 0
                  ? item.imagenes[0]
                  : null;

              return (
                <TarjetaActividad
                  key={item.id}
                  id={item.id}
                  titulo={item.titulo}
                  ubicacion={`${item.alcaldiaCDMX}, CDMX`}
                  categoria={item.categoria}
                  precio={Number(item.precio)}
                  rating="4.9"
                  imagenUrl={firstImage}
                  isFavoritoInicial={favoriteIds.has(item.id)}
                />
              );
            })}
          </div>
        )}
      </div>
    </main>
  );
}
