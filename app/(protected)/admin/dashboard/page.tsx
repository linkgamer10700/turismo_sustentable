"use client";

import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import AdminHeader from "@/components/AdminHeader";
import {
  ShieldCheck,
  CheckCircle,
  XCircle,
  Clock,
  LogOut,
  FileText,
  AlertTriangle,
  Building,
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface DocumentoEvidencia {
  id: string;
  proveedorId: string;
  tipo: string;
  titulo: string;
  descripcion?: string | null;
  archivoUrl: string;
  estado: "PENDIENTE" | "APROBADO" | "RECHAZADO";
  retroalimentacionAdmin?: string | null;
  createdAt: string;
}

interface ProveedorItem {
  id: string;
  userId: string;
  nombreNegocio?: string | null;
  descripcionBreve?: string | null;
  categoria?: string | null;
  alcaldiaCDMX?: string | null;
  estadoValidacion: "PENDIENTE" | "APROBADO" | "RECHAZADO";
  createdAt: string;
  user: {
    id: string;
    name: string | null;
    email: string | null;
    image: string | null;
  };
  documentos: DocumentoEvidencia[];
}

export default function AdminDashboardPage() {
  const [auditorias, setAuditorias] = useState<ProveedorItem[]>([]);
  const [filtroEstado, setFiltroEstado] = useState<string>("TODOS");
  const [isLoading, setIsLoading] = useState(true);
  const [dictamenDocId, setDictamenDocId] = useState<string | null>(null);
  const [retroalimentacion, setRetroalimentacion] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const fetchAuditorias = useCallback(async () => {
    setIsLoading(true);
    try {
      const endpoint =
        filtroEstado === "TODOS"
          ? "/api/admin/auditorias"
          : `/api/admin/auditorias?estado=${filtroEstado}`;
      const res = await fetch(endpoint);
      const data = await res.json();
      if (data.success && Array.isArray(data.data)) {
        setAuditorias(data.data);
      }
    } catch {
      setStatusMessage({ type: "error", text: "Error al cargar las auditorías." });
    } finally {
      setIsLoading(false);
    }
  }, [filtroEstado]);

  useEffect(() => {
    fetchAuditorias();
  }, [fetchAuditorias]);

  const handleDictaminar = async (documentoId: string, estado: "APROBADO" | "RECHAZADO") => {
    setIsSubmitting(true);
    setStatusMessage(null);

    try {
      const res = await fetch("/api/admin/auditorias", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          documentoId,
          estado,
          retroalimentacion: retroalimentacion.trim() || undefined,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "No se pudo actualizar el dictamen.");
      }

      setStatusMessage({
        type: "success",
        text: `Documento dictaminado como ${estado} exitosamente.`,
      });
      setDictamenDocId(null);
      setRetroalimentacion("");
      fetchAuditorias();
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Error al procesar dictamen";
      setStatusMessage({ type: "error", text: message });
    } finally {
      setIsSubmitting(false);
    }
  };

  const totalProveedores = auditorias.length;
  const pendientes = auditorias.filter((a) => a.estadoValidacion === "PENDIENTE").length;
  const aprobados = auditorias.filter((a) => a.estadoValidacion === "APROBADO").length;

  return (
    <div className="min-h-screen flex flex-col bg-[#F4F1EA] dark:bg-[#18201C] transition-colors duration-300">
      <AdminHeader activeTab="dashboard" />

      {/* Main Container */}
      <main className="container mx-auto flex-1 p-6 md:p-10 max-w-6xl">
        <div className="mb-8">
          <h1 className="text-3xl font-serif text-[#1E201D] dark:text-white mb-2">
            Auditoría de Proveedores y Evidencias
          </h1>
          <p className="text-sm text-[#63665E] dark:text-[#A5B29A]">
            Valida los certificados ecológicos para prevenir greenwashing antes de autorizar la publicación de experiencias.
          </p>
        </div>

        {/* Métricas */}
        <div className="grid gap-4 sm:grid-cols-3 mb-8">
          <div className="rounded-2xl border bg-white dark:bg-[#2A312C] p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-[#8C9287] uppercase">Total Proveedores</span>
              <Building className="h-5 w-5 text-[#728C69]" />
            </div>
            <p className="text-2xl font-serif text-[#1E201D] dark:text-white mt-2 font-bold">
              {totalProveedores}
            </p>
          </div>

          <div className="rounded-2xl border bg-white dark:bg-[#2A312C] p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-[#8C9287] uppercase">Pendientes de Dictamen</span>
              <Clock className="h-5 w-5 text-amber-500" />
            </div>
            <p className="text-2xl font-serif text-amber-600 dark:text-amber-400 mt-2 font-bold">
              {pendientes}
            </p>
          </div>

          <div className="rounded-2xl border bg-white dark:bg-[#2A312C] p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-[#8C9287] uppercase">Aprobados Activos</span>
              <ShieldCheck className="h-5 w-5 text-emerald-500" />
            </div>
            <p className="text-2xl font-serif text-emerald-600 dark:text-emerald-400 mt-2 font-bold">
              {aprobados}
            </p>
          </div>
        </div>

        {statusMessage && (
          <div
            className={`p-4 rounded-xl text-xs mb-6 text-center ${
              statusMessage.type === "success"
                ? "bg-green-100 text-green-800 dark:bg-green-950/40 dark:text-green-300 border border-green-300"
                : "bg-red-100 text-red-800 dark:bg-red-950/40 dark:text-red-300 border border-red-300"
            }`}
          >
            {statusMessage.text}
          </div>
        )}

        {/* Filtros */}
        <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
          {["TODOS", "PENDIENTE", "APROBADO", "RECHAZADO"].map((estado) => (
            <button
              key={estado}
              onClick={() => setFiltroEstado(estado)}
              className={`px-4 py-1.5 rounded-full text-xs font-medium transition-colors border ${
                filtroEstado === estado
                  ? "bg-[#728C69] text-white border-transparent"
                  : "bg-white dark:bg-[#2A312C] text-[#63665E] dark:text-[#A5B29A] border-gray-200 dark:border-white/10 hover:border-[#728C69]"
              }`}
            >
              {estado === "TODOS" ? "Todos los estados" : estado}
            </button>
          ))}
        </div>

        {/* Lista de Auditorías */}
        {isLoading ? (
          <div className="space-y-4 animate-pulse">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-44 bg-white dark:bg-[#2A312C] rounded-2xl shadow-sm" />
            ))}
          </div>
        ) : auditorias.length === 0 ? (
          <div className="rounded-3xl border border-dashed p-12 text-center bg-white dark:bg-[#2A312C]">
            <p className="text-[#8C9287] text-sm">No hay proveedores en este estado de auditoría.</p>
          </div>
        ) : (
          <div className="space-y-6">
            {auditorias.map((prov) => (
              <div
                key={prov.id}
                className="bg-white dark:bg-[#2A312C] rounded-3xl p-6 shadow-sm border border-transparent dark:border-white/5"
              >
                <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 border-b border-[#E3E5D8] dark:border-[#3D453F] pb-4 mb-4">
                  <div>
                    <h2 className="text-xl font-serif text-[#1E201D] dark:text-white font-bold">
                      {prov.nombreNegocio || "Negocio sin nombre"}
                    </h2>
                    <p className="text-xs text-[#63665E] dark:text-[#A5B29A]">
                      Titular: {prov.user.name} ({prov.user.email}) · {prov.alcaldiaCDMX || "CDMX"} · Cat:{" "}
                      {prov.categoria || "Ecoturismo"}
                    </p>
                  </div>

                  <span
                    className={`inline-block px-3 py-1 rounded-full text-xs font-bold w-max ${
                      prov.estadoValidacion === "APROBADO"
                        ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-400"
                        : prov.estadoValidacion === "RECHAZADO"
                        ? "bg-red-100 text-red-800 dark:bg-red-950/40 dark:text-red-400"
                        : "bg-amber-100 text-amber-800 dark:bg-amber-950/40 dark:text-amber-400"
                    }`}
                  >
                    Estado: {prov.estadoValidacion}
                  </span>
                </div>

                {/* Evidencias registradas */}
                <div className="space-y-3">
                  <h3 className="text-xs font-bold text-[#8C9287] uppercase">Documentos de Evidencia Ecológica</h3>
                  {prov.documentos.length === 0 ? (
                    <p className="text-xs text-muted-foreground italic">
                      El proveedor aún no ha adjuntado documentos de evidencia.
                    </p>
                  ) : (
                    <div className="grid gap-3 sm:grid-cols-2">
                      {prov.documentos.map((doc) => (
                        <div
                          key={doc.id}
                          className="bg-[#F4F1EA] dark:bg-[#1E2420] rounded-2xl p-4 border border-transparent dark:border-white/5 flex flex-col justify-between"
                        >
                          <div>
                            <div className="flex justify-between items-start mb-2">
                              <span className="text-[10px] font-bold text-[#728C69] uppercase">
                                {doc.tipo}
                              </span>
                              <span
                                className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                                  doc.estado === "APROBADO"
                                    ? "bg-emerald-200/60 text-emerald-800 dark:text-emerald-300"
                                    : doc.estado === "RECHAZADO"
                                    ? "bg-red-200/60 text-red-800 dark:text-red-300"
                                    : "bg-amber-200/60 text-amber-800 dark:text-amber-300"
                                }`}
                              >
                                {doc.estado}
                              </span>
                            </div>
                            <h4 className="text-sm font-semibold text-[#1E201D] dark:text-white">
                              {doc.titulo}
                            </h4>
                            {doc.descripcion && (
                              <p className="text-xs text-[#63665E] dark:text-[#A5B29A] mt-1 line-clamp-2">
                                {doc.descripcion}
                              </p>
                            )}
                            <a
                              href={doc.archivoUrl}
                              target="_blank"
                              rel="noreferrer"
                              className="inline-flex items-center gap-1 text-xs text-[#728C69] hover:underline mt-2"
                            >
                              <FileText className="w-3.5 h-3.5" /> Ver documento cargado
                            </a>
                          </div>

                          {/* Acciones de dictamen si está pendiente o reevaluación */}
                          <div className="mt-4 pt-3 border-t border-[#E3E5D8] dark:border-[#3D453F]">
                            {dictamenDocId === doc.id ? (
                              <div className="space-y-2">
                                <input
                                  type="text"
                                  value={retroalimentacion}
                                  onChange={(e) => setRetroalimentacion(e.target.value)}
                                  placeholder="Razón o retroalimentación técnica..."
                                  className="w-full text-xs p-2 rounded-lg bg-white dark:bg-[#2A312C] border focus:outline-none"
                                />
                                <div className="flex gap-2">
                                  <button
                                    onClick={() => handleDictaminar(doc.id, "APROBADO")}
                                    disabled={isSubmitting}
                                    className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white text-xs py-1.5 rounded-lg font-medium"
                                  >
                                    Confirmar Aprobado
                                  </button>
                                  <button
                                    onClick={() => handleDictaminar(doc.id, "RECHAZADO")}
                                    disabled={isSubmitting}
                                    className="flex-1 bg-red-600 hover:bg-red-700 text-white text-xs py-1.5 rounded-lg font-medium"
                                  >
                                    Rechazar
                                  </button>
                                </div>
                              </div>
                            ) : (
                              <button
                                onClick={() => {
                                  setDictamenDocId(doc.id);
                                  setRetroalimentacion(doc.retroalimentacionAdmin || "");
                                }}
                                className="text-xs text-[#728C69] dark:text-[#A5B29A] hover:underline font-semibold"
                              >
                                {doc.estado === "PENDIENTE" ? "Evaluar evidencia" : "Modificar dictamen"}
                              </button>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
