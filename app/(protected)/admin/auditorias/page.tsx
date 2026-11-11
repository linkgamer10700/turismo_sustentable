"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { FileText, ArrowRight, ShieldAlert, CheckCircle2, Clock } from "lucide-react";

export default function AuditoriasAdminPage() {
  const [proveedores, setProveedores] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState("Todos");

  useEffect(() => {
    async function fetchAuditorias() {
      try {
        // Obtenemos proveedores pendientes de auditoría desde la base de datos
        const res = await fetch("/api/admin/auditorias?estado=PENDIENTE");
        const data = await res.json();
        if (data.success && Array.isArray(data.data)) {
          setProveedores(data.data);
        }
      } catch (error) {
        console.error("Error al cargar auditorias", error);
      } finally {
        setIsLoading(false);
      }
    }
    fetchAuditorias();
  }, []);

  const categorias = ["Todos", "Naturaleza", "Comida", "Con mascotas", "Cultura", "Ecoturismo"];

  const proveedoresFiltrados = proveedores.filter((prov) => {
    if (selectedCategory === "Todos") return true;
    return prov.categoria?.toLowerCase() === selectedCategory.toLowerCase();
  });

  const totalPendientes = proveedores.length;
  const totalDocsPendientes = proveedores.reduce(
    (acc, prov) => acc + (prov.documentos?.filter((d: any) => d.estado === "PENDIENTE")?.length || 0),
    0
  );

  return (
    <div className="min-h-screen flex flex-col bg-[#F4F1EA] dark:bg-[#18201C] transition-colors duration-300">
      <Header />

      <main className="container mx-auto flex-1 p-6 md:p-10 max-w-6xl">
        <div className="mb-8">
          <h1 className="text-3xl font-serif text-[#1E201D] dark:text-white mb-2 font-bold">
            Evidencias de Proveedores
          </h1>
          <p className="text-sm text-[#63665E] dark:text-[#A5B29A]">
            Revisa y dictamina las certificaciones ecológicas y de sustentabilidad presentadas por los negocios en la CDMX.
          </p>
        </div>

        {/* Métricas Rápidas */}
        <div className="grid gap-4 sm:grid-cols-3 mb-8">
          <div className="rounded-2xl border bg-white dark:bg-[#2A312C] p-5 shadow-sm border-transparent dark:border-white/5">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold text-[#8C9287] uppercase tracking-wider">
                Proveedores por Auditar
              </span>
              <Clock className="h-5 w-5 text-amber-500" />
            </div>
            <p className="text-2xl font-serif text-amber-600 dark:text-amber-400 mt-2 font-bold">
              {isLoading ? "..." : totalPendientes}
            </p>
            <p className="text-xs text-[#63665E] dark:text-[#A5B29A] mt-1">
              negocios con validación pendiente en BD
            </p>
          </div>

          <div className="rounded-2xl border bg-white dark:bg-[#2A312C] p-5 shadow-sm border-transparent dark:border-white/5">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold text-[#8C9287] uppercase tracking-wider">
                Documentos sin Dictaminar
              </span>
              <ShieldAlert className="h-5 w-5 text-[#C81D77]" />
            </div>
            <p className="text-2xl font-serif text-[#C81D77] dark:text-[#E24A96] mt-2 font-bold">
              {isLoading ? "..." : totalDocsPendientes}
            </p>
            <p className="text-xs text-[#63665E] dark:text-[#A5B29A] mt-1">
              certificados y planes ambientales adjuntos
            </p>
          </div>

          <div className="rounded-2xl border bg-white dark:bg-[#2A312C] p-5 shadow-sm border-transparent dark:border-white/5">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold text-[#8C9287] uppercase tracking-wider">
                Criterios de Validación
              </span>
              <CheckCircle2 className="h-5 w-5 text-[#728C69]" />
            </div>
            <p className="text-2xl font-serif text-[#728C69] mt-2 font-bold">
              100% CDMX
            </p>
            <p className="text-xs text-[#63665E] dark:text-[#A5B29A] mt-1">
              conservación del suelo y greenwashing cero
            </p>
          </div>
        </div>

        {/* Filtros de Categorías */}
        <div className="flex gap-2 overflow-x-auto pb-4 mb-6">
          {categorias.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`whitespace-nowrap px-4 py-2 rounded-full text-xs font-medium transition-all ${
                selectedCategory === cat
                  ? "bg-[#728C69] text-white shadow-sm"
                  : "bg-white dark:bg-[#2A312C] text-[#63665E] dark:text-[#A5B29A] border border-gray-200 dark:border-white/10 hover:border-[#728C69]"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Grilla de Proveedores a Auditar */}
        {isLoading ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 animate-pulse">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-64 bg-white dark:bg-[#2A312C] rounded-[2rem] shadow-sm" />
            ))}
          </div>
        ) : proveedoresFiltrados.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-gray-300 dark:border-white/10 p-12 text-center bg-white dark:bg-[#2A312C]">
            <p className="text-[#8C9287] text-sm">No hay evidencias pendientes en la categoría seleccionada.</p>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {proveedoresFiltrados.map((prov) => (
              <div
                key={prov.id}
                className="bg-white dark:bg-[#2A312C] rounded-[2rem] p-5 shadow-sm border border-transparent dark:border-white/5 flex flex-col justify-between hover:shadow-md transition-shadow"
              >
                <div>
                  <div className="w-full h-36 bg-[#B4CBB0] rounded-2xl mb-4 relative overflow-hidden">
                    <svg viewBox="0 0 400 120" className="w-full h-full object-cover" preserveAspectRatio="none">
                      <circle cx="320" cy="40" r="20" fill="#F4E6B4" />
                      <polygon points="0,120 150,50 350,120" fill="#758C6E" />
                      <polygon points="100,120 280,70 450,120" fill="#586E52" />
                    </svg>
                    <span className="absolute top-3 right-3 bg-white/90 dark:bg-black/60 backdrop-blur-sm text-[10px] font-bold px-2.5 py-1 rounded-full text-[#1E201D] dark:text-white">
                      {prov.alcaldiaCDMX || "CDMX"}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[10px] font-bold text-[#728C69] uppercase tracking-wider">
                      {prov.categoria || "Sustentable"}
                    </span>
                    <span className="text-gray-300 dark:text-gray-600">·</span>
                    <span className="text-[10px] text-amber-600 dark:text-amber-400 font-semibold flex items-center gap-1">
                      <FileText className="w-3 h-3" />
                      {prov.documentos?.length || 0} documento{prov.documentos?.length === 1 ? "" : "s"}
                    </span>
                  </div>

                  <h3 className="font-serif text-xl text-[#1E201D] dark:text-white font-bold mb-2">
                    {prov.nombreNegocio || "Negocio sin nombre"}
                  </h3>

                  <p className="text-xs text-[#63665E] dark:text-[#9EA399] line-clamp-2 mb-4 leading-relaxed">
                    {prov.descripcionBreve || "Sin descripción"}
                  </p>
                </div>

                <div className="pt-4 border-t border-[#E3E5D8] dark:border-white/10 flex items-center justify-between">
                  <span className="text-[11px] text-[#8C9287]">
                    Titular: {prov.user?.name || "Sin nombre"}
                  </span>
                  <Link
                    href={`/admin/auditorias/${prov.id}`}
                    className="inline-flex items-center gap-1.5 bg-[#C81D77] hover:bg-[#A91864] text-white text-xs font-semibold px-4 py-2 rounded-xl transition-colors shadow-sm"
                  >
                    Revisar
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}
