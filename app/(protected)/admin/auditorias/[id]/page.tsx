"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import AdminHeader from "@/components/AdminHeader";
import { ArrowLeft, FileText, CheckCircle2, XCircle, ExternalLink, ShieldCheck, MapPin, User } from "lucide-react";

export default function RevisarEvidenciaPage() {
  const params = useParams();
  const id = typeof params?.id === "string" ? params.id : Array.isArray(params?.id) ? params.id[0] : "";
  const router = useRouter();
  const [proveedor, setProveedor] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [retroalimentacion, setRetroalimentacion] = useState("");
  const [statusMessage, setStatusMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  useEffect(() => {
    async function fetchDetalle() {
      if (!id) return;
      try {
        const res = await fetch("/api/admin/auditorias");
        const data = await res.json();
        if (data.success && Array.isArray(data.data)) {
          const found = data.data.find((p: any) => p.id === id);
          setProveedor(found || null);
        }
      } catch (error) {
        console.error("Error al cargar detalle de auditoría", error);
      } finally {
        setIsLoading(false);
      }
    }
    fetchDetalle();
  }, [id]);

  const handleDictamen = async (estado: "APROBADO" | "RECHAZADO") => {
    if (!proveedor?.documentos || proveedor.documentos.length === 0) return;
    setIsSubmitting(true);
    setStatusMessage(null);

    try {
      for (const doc of proveedor.documentos) {
        const res = await fetch("/api/admin/auditorias", {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            documentoId: doc.id,
            estado,
            retroalimentacion: estado === "RECHAZADO" ? (retroalimentacion.trim() || "Documentación no cumple con los criterios de sustentabilidad de la CDMX.") : "",
          }),
        });

        if (!res.ok) {
          const errData = await res.json();
          throw new Error(errData.error || "Error al actualizar dictamen");
        }
      }

      setStatusMessage({
        type: "success",
        text: `El proveedor ha sido dictaminado como ${estado} con éxito.`,
      });

      setTimeout(() => {
        router.push("/admin/auditorias");
      }, 1200);
    } catch (error: any) {
      console.error("Error al dictaminar", error);
      setStatusMessage({ type: "error", text: error.message || "Error al procesar dictamen" });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col bg-[#F4F1EA] dark:bg-[#18201C]">
        <AdminHeader activeTab="revision" />
        <div className="flex-1 flex items-center justify-center p-8 text-[#728C69]">
          Cargando datos del proveedor...
        </div>
      </div>
    );
  }

  if (!proveedor) {
    return (
      <div className="min-h-screen flex flex-col bg-[#F4F1EA] dark:bg-[#18201C]">
        <AdminHeader activeTab="revision" />
        <main className="container mx-auto flex-1 p-10 max-w-4xl text-center">
          <p className="text-sm text-[#8C9287] mb-4">No se encontró el proveedor solicitado.</p>
          <Link href="/admin/auditorias" className="inline-block bg-[#728C69] text-white text-xs px-5 py-2.5 rounded-xl font-semibold">
            Volver a auditorías
          </Link>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#F4F1EA] dark:bg-[#18201C] transition-colors duration-300 pb-28">
      <AdminHeader activeTab="revision" />

      <main className="container mx-auto flex-1 p-6 md:p-10 max-w-6xl">
        {/* Encabezado y Regreso */}
        <div className="flex items-center gap-3 mb-6">
          <Link
            href="/admin/auditorias"
            className="w-9 h-9 rounded-full bg-white dark:bg-[#2A312C] flex items-center justify-center shadow-sm text-foreground hover:bg-[#E3E5D8] dark:hover:bg-[#3D453F] transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <h1 className="font-serif text-3xl text-[#1E201D] dark:text-white font-bold">
              Dictamen de Sustentabilidad
            </h1>
            <p className="text-xs text-[#63665E] dark:text-[#A5B29A]">
              Verificación documental y probatoria ecológica
            </p>
          </div>
        </div>

        {statusMessage && (
          <div
            className={`p-4 rounded-xl text-xs mb-6 text-center font-medium ${
              statusMessage.type === "success"
                ? "bg-green-100 text-green-800 dark:bg-green-950/40 dark:text-green-300 border border-green-300"
                : "bg-red-100 text-red-800 dark:bg-red-950/40 dark:text-red-300 border border-red-300"
            }`}
          >
            {statusMessage.text}
          </div>
        )}

        <div className="grid gap-8 lg:grid-cols-3">
          {/* Columna Izquierda: Tarjeta del Negocio e Imágenes */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-white dark:bg-[#2A312C] rounded-3xl p-6 shadow-sm border border-transparent dark:border-white/5">
              <div className="w-full h-40 bg-[#B4CBB0] rounded-2xl mb-4 relative overflow-hidden">
                <svg viewBox="0 0 400 120" className="w-full h-full object-cover" preserveAspectRatio="none">
                  <circle cx="320" cy="40" r="20" fill="#F4E6B4" />
                  <polygon points="0,120 150,50 350,120" fill="#758C6E" />
                  <polygon points="100,120 280,70 450,120" fill="#586E52" />
                </svg>
                <span className="absolute top-3 right-3 bg-white/90 dark:bg-black/60 backdrop-blur-sm text-[10px] font-bold px-2.5 py-1 rounded-full text-[#1E201D] dark:text-white">
                  {proveedor.estadoValidacion}
                </span>
              </div>

              <div className="flex items-center gap-2 mb-2">
                <span className="text-xs font-bold text-[#728C69] uppercase tracking-wider">
                  {proveedor.categoria || "Ecoturismo"}
                </span>
                <span className="text-gray-300 dark:text-gray-600">·</span>
                <span className="text-xs text-[#63665E] dark:text-[#A5B29A] flex items-center gap-1">
                  <MapPin className="w-3 h-3" />
                  {proveedor.alcaldiaCDMX || "CDMX"}
                </span>
              </div>

              <h2 className="font-serif text-2xl font-bold text-[#1E201D] dark:text-white mb-2">
                {proveedor.nombreNegocio || "Negocio sin nombre"}
              </h2>

              <p className="text-xs text-[#63665E] dark:text-[#A5B29A] leading-relaxed mb-4">
                {proveedor.descripcionBreve || "Sin descripción proporcionada."}
              </p>

              <div className="pt-4 border-t border-[#E3E5D8] dark:border-white/10 text-xs text-[#8C9287] space-y-1">
                <div className="flex items-center gap-1.5 text-foreground font-medium">
                  <User className="w-3.5 h-3.5 text-[#728C69]" />
                  Titular: {proveedor.user?.name || "Sin nombre"}
                </div>
                <p className="truncate">Email: {proveedor.user?.email}</p>
                <p>Registrado: {new Date(proveedor.createdAt).toLocaleDateString("es-MX")}</p>
              </div>
            </div>

            {/* Galería de Fotografías Probatorias */}
            <div className="bg-white dark:bg-[#2A312C] rounded-3xl p-6 shadow-sm border border-transparent dark:border-white/5">
              <h3 className="font-serif text-lg font-bold text-[#1E201D] dark:text-white mb-3">
                Galería de evidencias
              </h3>
              <div className="grid grid-cols-3 gap-2">
                <div className="col-span-2 h-32 bg-[#B4CBB0] rounded-xl overflow-hidden relative">
                  <svg viewBox="0 0 400 120" className="w-full h-full object-cover" preserveAspectRatio="none">
                    <circle cx="320" cy="40" r="20" fill="#F4E6B4" />
                    <polygon points="0,120 150,50 350,120" fill="#758C6E" />
                    <polygon points="100,120 280,70 450,120" fill="#586E52" />
                  </svg>
                </div>
                <div className="col-span-1 flex flex-col gap-2">
                  <div className="h-[60px] bg-[#C3CEB9] rounded-xl"></div>
                  <div className="h-[60px] bg-[#E3E5D8] dark:bg-[#3D453F] rounded-xl"></div>
                </div>
              </div>
            </div>
          </div>

          {/* Columna Derecha: Documentos de Evidencia y Dictamen */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white dark:bg-[#2A312C] rounded-3xl p-6 shadow-sm border border-transparent dark:border-white/5">
              <h3 className="font-serif text-xl font-bold text-[#1E201D] dark:text-white mb-4">
                Documentos adjuntos de sustentabilidad
              </h3>

              <div className="space-y-4">
                {proveedor.documentos && proveedor.documentos.length > 0 ? (
                  proveedor.documentos.map((doc: any) => (
                    <div
                      key={doc.id}
                      className="p-5 rounded-2xl bg-[#F4F1EA] dark:bg-[#18201C] border border-[#728C69]/20 flex flex-col sm:flex-row justify-between sm:items-center gap-4"
                    >
                      <div className="flex items-start gap-3.5">
                        <div className="w-11 h-11 bg-[#728C69]/20 text-[#728C69] rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5">
                          <FileText className="w-5 h-5" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-[10px] font-bold text-[#728C69] uppercase tracking-wider">
                              {doc.tipo}
                            </span>
                            <span
                              className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                                doc.estado === "APROBADO"
                                  ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-300"
                                  : doc.estado === "RECHAZADO"
                                  ? "bg-red-100 text-red-800 dark:bg-red-950/40 dark:text-red-300"
                                  : "bg-amber-100 text-amber-800 dark:bg-amber-950/40 dark:text-amber-300"
                              }`}
                            >
                              {doc.estado}
                            </span>
                          </div>
                          <h4 className="text-sm font-bold text-[#1E201D] dark:text-white">
                            {doc.titulo}
                          </h4>
                          {doc.descripcion && (
                            <p className="text-xs text-[#63665E] dark:text-[#A5B29A] mt-1 leading-relaxed">
                              {doc.descripcion}
                            </p>
                          )}
                        </div>
                      </div>

                      {doc.archivoUrl && (
                        <a
                          href={doc.archivoUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 bg-white dark:bg-[#2A312C] text-[#728C69] text-xs font-semibold px-4 py-2 rounded-xl border border-gray-200 dark:border-white/10 hover:border-[#728C69] transition-all flex-shrink-0 shadow-sm"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                          Ver archivo
                        </a>
                      )}
                    </div>
                  ))
                ) : (
                  <p className="text-xs text-[#8C9287] italic p-6 text-center">
                    No hay documentos cargados en la base de datos para este proveedor.
                  </p>
                )}
              </div>
            </div>

            {/* Retroalimentación opcional del auditor */}
            <div className="bg-white dark:bg-[#2A312C] rounded-3xl p-6 shadow-sm border border-transparent dark:border-white/5">
              <h3 className="font-serif text-lg font-bold text-[#1E201D] dark:text-white mb-2">
                Observaciones y Retroalimentación Técnica
              </h3>
              <p className="text-xs text-[#63665E] dark:text-[#A5B29A] mb-3">
                Si rechazas la documentación, es obligatorio proveer el motivo técnico para que el proveedor pueda subsanarlo.
              </p>
              <textarea
                value={retroalimentacion}
                onChange={(e) => setRetroalimentacion(e.target.value)}
                placeholder="ej. El certificado no cuenta con sello vigente de CONABIO o los planes de residuos carecen de firma ejidal..."
                rows={3}
                className="w-full text-xs p-3 rounded-xl bg-[#F4F1EA] dark:bg-[#18201C] border border-gray-200 dark:border-white/10 focus:outline-none focus:ring-2 focus:ring-[#728C69]"
              />
            </div>
          </div>
        </div>

        {/* Botones Flotantes Inferiores */}
        <div className="fixed bottom-0 left-0 w-full bg-[#F4F1EA]/95 dark:bg-[#18201C]/95 backdrop-blur-md p-4 flex gap-4 justify-center border-t border-[#E3E5D8] dark:border-white/10 shadow-lg z-30">
          <button
            disabled={isSubmitting || !proveedor?.documentos?.length}
            onClick={() => handleDictamen("RECHAZADO")}
            className="w-full max-w-xs bg-[#C81D77] hover:bg-[#A91864] text-white font-semibold rounded-2xl py-3.5 text-sm transition-colors shadow-sm disabled:opacity-50 flex items-center justify-center gap-2"
          >
            <XCircle className="w-4 h-4" />
            {isSubmitting ? "Procesando..." : "Rechazar Evidencias"}
          </button>
          <button
            disabled={isSubmitting || !proveedor?.documentos?.length}
            onClick={() => handleDictamen("APROBADO")}
            className="w-full max-w-xs bg-[#728C69] hover:bg-[#5B7153] text-white font-semibold rounded-2xl py-3.5 text-sm transition-colors shadow-sm disabled:opacity-50 flex items-center justify-center gap-2"
          >
            <CheckCircle2 className="w-4 h-4" />
            {isSubmitting ? "Procesando..." : "Aprobar Proveedor"}
          </button>
        </div>
      </main>
    </div>
  );
}
