"use client";

import React, { useEffect, useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { TrendingUp, Users, DollarSign, Building2, Award } from "lucide-react";

export default function PanelBIPage() {
  const [metricas, setMetricas] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadMetrics() {
      try {
        const res = await fetch("/api/reservas");
        const data = await res.json();
        if (data.success && data.metricas) {
          setMetricas(data.metricas);
        }
      } catch (error) {
        console.error("Error al cargar BI", error);
      } finally {
        setIsLoading(false);
      }
    }
    loadMetrics();
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-[#F4F1EA] dark:bg-[#18201C] transition-colors duration-300">
      <Header />

      <main className="container mx-auto flex-1 p-6 md:p-10 max-w-6xl">
        <div className="mb-8">
          <h1 className="text-3xl font-serif text-[#1E201D] dark:text-white mb-2 font-bold">
            Panel de Inteligencia de Negocio (BI)
          </h1>
          <p className="text-sm text-[#63665E] dark:text-[#A5B29A]">
            Métricas reales de impacto económico y reservas sustentables consolidadas en la Ciudad de México.
          </p>
        </div>

        {/* Tarjetas de Métricas Principales (Consolidadas desde BD) */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-8">
          <div className="bg-white dark:bg-[#2A312C] rounded-3xl p-5 shadow-sm border border-transparent dark:border-white/5 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-bold text-[#8C9287] uppercase tracking-wider">
                  Reservas Totales
                </span>
                <TrendingUp className="h-4 w-4 text-[#728C69]" />
              </div>
              <p className="text-2xl font-serif text-[#1E201D] dark:text-white font-bold">
                {isLoading ? "..." : metricas?.totalReservas || 0}
              </p>
            </div>
            <p className="text-xs text-[#728C69] mt-2 font-medium">
              Actividades confirmadas
            </p>
          </div>

          <div className="bg-white dark:bg-[#2A312C] rounded-3xl p-5 shadow-sm border border-transparent dark:border-white/5 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-bold text-[#8C9287] uppercase tracking-wider">
                  Ingresos Generados
                </span>
                <DollarSign className="h-4 w-4 text-[#C81D77]" />
              </div>
              <p className="text-2xl font-serif text-[#1E201D] dark:text-white font-bold">
                ${isLoading ? "..." : Number(metricas?.totalIngresos || 0).toLocaleString("es-MX")} MXN
              </p>
            </div>
            <p className="text-xs text-[#C81D77] dark:text-[#E24A96] mt-2 font-medium">
              Impacto económico local directo
            </p>
          </div>

          <div className="bg-white dark:bg-[#2A312C] rounded-3xl p-5 shadow-sm border border-transparent dark:border-white/5 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-bold text-[#8C9287] uppercase tracking-wider">
                  Turistas Movilizados
                </span>
                <Users className="h-4 w-4 text-[#728C69]" />
              </div>
              <p className="text-2xl font-serif text-[#1E201D] dark:text-white font-bold">
                {isLoading ? "..." : metricas?.totalPersonas || 0}
              </p>
            </div>
            <p className="text-xs text-[#63665E] dark:text-[#A5B29A] mt-2 font-medium">
              Viajeros con huella responsable
            </p>
          </div>

          <div className="bg-white dark:bg-[#2A312C] rounded-3xl p-5 shadow-sm border border-transparent dark:border-white/5 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-bold text-[#8C9287] uppercase tracking-wider">
                  Proveedores Activos
                </span>
                <Building2 className="h-4 w-4 text-emerald-600" />
              </div>
              <p className="text-2xl font-serif text-[#1E201D] dark:text-white font-bold">
                {isLoading ? "..." : metricas?.totalProveedores || 0}
              </p>
            </div>
            <p className="text-xs text-[#63665E] dark:text-[#A5B29A] mt-2 font-medium">
              {metricas?.proveedoresAprobados || 0} aprobados · {metricas?.proveedoresPendientes || 0} pendientes
            </p>
          </div>
        </div>

        <div className="grid gap-8 lg:grid-cols-2 mb-8">
          {/* Gráfico Dinámico de Barras por Categoría (Calculado en tiempo real desde BD) */}
          <div className="bg-white dark:bg-[#2A312C] rounded-3xl p-6 shadow-sm border border-transparent dark:border-white/5">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-serif text-[#1E201D] dark:text-white font-bold">
                Reservas por Categoría
              </h2>
              <span className="text-xs text-[#8C9287]">En tiempo real</span>
            </div>

            {isLoading ? (
              <div className="space-y-4 animate-pulse">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="h-10 bg-[#F4F1EA] dark:bg-[#18201C] rounded-xl" />
                ))}
              </div>
            ) : !metricas?.porCategoria || metricas.porCategoria.length === 0 ? (
              <p className="text-xs text-[#8C9287] italic p-6 text-center">
                Aún no hay reservas registradas por categoría.
              </p>
            ) : (
              <div className="flex flex-col gap-5">
                {metricas.porCategoria.map((cat: any) => (
                  <div key={cat.categoria} className="flex flex-col gap-1.5">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-semibold text-[#1E201D] dark:text-white">
                        {cat.categoria}
                      </span>
                      <span className="text-[#8C9287] font-medium">
                        {cat.cantidad} reserva{cat.cantidad === 1 ? "" : "s"} (${Number(cat.ingresos).toLocaleString("es-MX")} MXN)
                      </span>
                    </div>
                    <div className="w-full h-3 bg-[#E3E5D8] dark:bg-[#3D453F] rounded-full overflow-hidden">
                      <div
                        className="h-full bg-[#728C69] rounded-full transition-all duration-500"
                        style={{ width: `${Math.max(10, cat.porcentaje)}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Ranking Dinámico de Proveedores (Calculado desde BD) */}
          <div className="bg-white dark:bg-[#2A312C] rounded-3xl p-6 shadow-sm border border-transparent dark:border-white/5">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-serif text-[#1E201D] dark:text-white font-bold">
                Proveedores con Más Reservas
              </h2>
              <Award className="w-4 h-4 text-[#728C69]" />
            </div>

            {isLoading ? (
              <div className="space-y-4 animate-pulse">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="h-14 bg-[#F4F1EA] dark:bg-[#18201C] rounded-2xl" />
                ))}
              </div>
            ) : !metricas?.topProveedores || metricas.topProveedores.length === 0 ? (
              <p className="text-xs text-[#8C9287] italic p-6 text-center">
                No hay actividad de proveedores registrada aún.
              </p>
            ) : (
              <div className="flex flex-col gap-3">
                {metricas.topProveedores.map((prov: any, idx: number) => (
                  <div
                    key={prov.id || idx}
                    className="p-3.5 rounded-2xl bg-[#F4F1EA] dark:bg-[#18201C] flex items-center justify-between gap-3"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-[#728C69]/20 text-[#728C69] font-bold text-xs flex items-center justify-center flex-shrink-0">
                        #{idx + 1}
                      </div>
                      <div>
                        <p className="text-xs font-bold text-[#1E201D] dark:text-white">
                          {prov.nombre}
                        </p>
                        <p className="text-[10px] text-[#8C9287]">
                          {prov.alcaldia} · {prov.categoria}
                        </p>
                      </div>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <span className="text-xs font-bold text-[#728C69] block">
                        {prov.reservas} reserva{prov.reservas === 1 ? "" : "s"}
                      </span>
                      <span className="text-[10px] text-[#8C9287]">
                        ${Number(prov.ingresos).toLocaleString("es-MX")} MXN
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
