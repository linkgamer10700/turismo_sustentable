"use client";

import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { ModeToggle } from "@/components/ThemeToggle";
import { logout } from "@/actions/login";
import {
  UploadCloud,
  ShieldCheck,
  AlertTriangle,
  LogOut,
  ArrowLeft,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { ALCALDIAS_CDMX } from "@/lib/validations/experiencia";

interface DocumentoItem {
  id: string;
  tipo: string;
  titulo: string;
  descripcion?: string | null;
  archivoUrl: string;
  estado: "PENDIENTE" | "APROBADO" | "RECHAZADO";
  retroalimentacionAdmin?: string | null;
  createdAt: string;
}

interface ProveedorData {
  id: string;
  nombreNegocio: string | null;
  descripcionBreve: string | null;
  categoria: string | null;
  alcaldiaCDMX: string | null;
  estadoValidacion: "PENDIENTE" | "APROBADO" | "RECHAZADO";
  documentos: DocumentoItem[];
}

export default function NegocioDocumentosPage() {
  const [proveedor, setProveedor] = useState<ProveedorData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"resumen" | "evidencias" | "nuevaExp">("resumen");
  const [feedback, setFeedback] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form states for Subir Evidencia
  const [evidenciaTipo, setEvidenciaTipo] = useState("CERTIFICACION_ECOLOGICA");
  const [evidenciaTitulo, setEvidenciaTitulo] = useState("");
  const [evidenciaDesc, setEvidenciaDesc] = useState("");
  const [evidenciaUrl, setEvidenciaUrl] = useState("");

  // Form states for Crear Experiencia
  const [expTitulo, setExpTitulo] = useState("");
  const [expDesc, setExpDesc] = useState("");
  const [expCategoria, setExpCategoria] = useState("Ecoturismo");
  const [expAlcaldia, setExpAlcaldia] = useState<string>("Xochimilco");
  const [expPrecio, setExpPrecio] = useState(350);
  const [expDuracion, setExpDuracion] = useState(120);
  const [expCapacidad, setExpCapacidad] = useState(10);
  const [expImagen, setExpImagen] = useState("https://images.unsplash.com/photo-1518638150340-f706e86654de?auto=format&fit=crop&w=800&q=80");

  const loadProveedorData = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/proveedor/documentos");
      if (res.status === 401 || res.status === 403) {
        setFeedback({ type: "error", text: "Acceso no autorizado para rol de proveedor." });
        return;
      }

      const data = await res.json();
      if (data.success && data.data) {
        setProveedor(data.data);
      }
    } catch {
      setFeedback({ type: "error", text: "Error al cargar la información del negocio." });
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadProveedorData();
  }, [loadProveedorData]);

  const handleSubirEvidencia = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!evidenciaTitulo.trim() || !evidenciaUrl.trim()) {
      setFeedback({ type: "error", text: "Título y URL del documento son requeridos." });
      return;
    }

    setIsSubmitting(true);
    setFeedback(null);

    try {
      const res = await fetch("/api/proveedor/documentos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          tipo: evidenciaTipo,
          titulo: evidenciaTitulo.trim(),
          descripcion: evidenciaDesc.trim() || undefined,
          archivoUrl: evidenciaUrl.trim(),
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "No se pudo registrar la evidencia.");
      }

      setFeedback({ type: "success", text: "Evidencia ecológica subida correctamente. Esperando dictamen." });
      setEvidenciaTitulo("");
      setEvidenciaDesc("");
      setEvidenciaUrl("");
      setActiveTab("resumen");
      loadProveedorData();
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Error al registrar evidencia";
      setFeedback({ type: "error", text: message });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCrearExperiencia = async (e: React.FormEvent) => {
    e.preventDefault();
    if (proveedor?.estadoValidacion !== "APROBADO") {
      setFeedback({
        type: "error",
        text: "Tu negocio debe estar APROBADO por auditoría antes de poder publicar experiencias.",
      });
      return;
    }

    setIsSubmitting(true);
    setFeedback(null);

    try {
      const res = await fetch("/api/experiencias", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          titulo: expTitulo.trim(),
          descripcion: expDesc.trim(),
          categoria: expCategoria,
          alcaldiaCDMX: expAlcaldia,
          precio: Number(expPrecio),
          duracionMinutos: Number(expDuracion),
          capacidadCarga: Number(expCapacidad),
          imagenes: expImagen.trim() ? [expImagen.trim()] : [],
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Error al publicar experiencia.");
      }

      setFeedback({ type: "success", text: "¡Experiencia sustentable creada y publicada en el catálogo!" });
      setExpTitulo("");
      setExpDesc("");
      setActiveTab("resumen");
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Error al publicar la experiencia";
      setFeedback({ type: "error", text: message });
    } finally {
      setIsSubmitting(false);
    }
  };

  const isAprobado = proveedor?.estadoValidacion === "APROBADO";

  return (
    <div className="min-h-screen flex flex-col bg-[#F4F1EA] dark:bg-[#18201C] transition-colors duration-300">
      <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur-md">
        <div className="container mx-auto flex h-16 items-center justify-between px-6">
          <div className="flex items-center gap-3">
            <Link href="/negocio/dashboard" className="text-sm font-bold tracking-widest text-foreground flex items-center gap-2">
              <ArrowLeft className="w-4 h-4 text-[#728C69]" />
              <span className="w-2.5 h-2.5 rounded-full bg-[#728C69]" />
              MI CUENTA
            </Link>
            <span className="rounded-full bg-[#728C69]/15 px-2.5 py-0.5 text-xs font-semibold text-[#728C69]">
              Documentos y Evidencias
            </span>
          </div>

          <div className="flex items-center gap-3">
            <ModeToggle />
            <Button
              variant="outline"
              size="sm"
              onClick={() => logout()}
              className="gap-2 rounded-full text-xs"
            >
              <LogOut className="h-3.5 w-3.5" />
              Cerrar Sesión
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto flex-1 p-6 md:p-10 max-w-5xl">
        <div className="mb-8">
          <h1 className="text-3xl font-serif text-[#1E201D] dark:text-white mb-1">
            {proveedor?.nombreNegocio || "Mi Negocio Sustentable"} - Documentos
          </h1>
          <p className="text-sm text-[#63665E] dark:text-[#A5B29A]">
            Gestiona tus evidencias ecológicas y catálogo de experiencias responsables en la CDMX.
          </p>
        </div>

        <div
          className={`rounded-2xl p-5 mb-8 border flex items-start gap-3.5 ${
            isAprobado
              ? "bg-emerald-50 dark:bg-emerald-950/30 border-emerald-300 dark:border-emerald-800 text-emerald-900 dark:text-emerald-300"
              : proveedor?.estadoValidacion === "RECHAZADO"
              ? "bg-red-50 dark:bg-red-950/30 border-red-300 dark:border-red-800 text-red-900 dark:text-red-300"
              : "bg-amber-50 dark:bg-amber-950/30 border-amber-300 dark:border-amber-800 text-amber-900 dark:text-amber-300"
          }`}
        >
          {isAprobado ? (
            <ShieldCheck className="h-6 w-6 text-emerald-600 flex-shrink-0 mt-0.5" />
          ) : (
            <AlertTriangle className="h-6 w-6 text-amber-600 flex-shrink-0 mt-0.5" />
          )}
          <div>
            <h3 className="text-sm font-bold">
              Estado de Validación: {proveedor?.estadoValidacion || "PENDIENTE"}
            </h3>
            <p className="text-xs mt-1 leading-relaxed">
              {isAprobado
                ? "Tus certificaciones han sido aprobadas por el comité auditor. Puedes publicar y recibir reservas."
                : "Para proteger los ecosistemas de la CDMX contra el greenwashing, debes tener evidencias aprobadas por un administrador antes de publicar actividades."}
            </p>
          </div>
        </div>

        {feedback && (
          <div
            className={`p-4 rounded-xl text-xs mb-6 text-center ${
              feedback.type === "success"
                ? "bg-green-100 text-green-800 dark:bg-green-950/40 dark:text-green-300 border border-green-300"
                : "bg-red-100 text-red-800 dark:bg-red-950/40 dark:text-red-300 border border-red-300"
            }`}
          >
            {feedback.text}
          </div>
        )}

        <div className="flex bg-[#E3E5D8] dark:bg-[#2A312C] p-1 rounded-xl mb-8 max-w-md">
          <button
            onClick={() => setActiveTab("resumen")}
            className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-all ${
              activeTab === "resumen"
                ? "bg-white dark:bg-[#3D453F] text-[#1E201D] dark:text-white shadow-sm"
                : "text-[#63665E] dark:text-[#A5B29A]"
            }`}
          >
            Evidencias ({proveedor?.documentos.length || 0})
          </button>
          <button
            onClick={() => setActiveTab("evidencias")}
            className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-all ${
              activeTab === "evidencias"
                ? "bg-white dark:bg-[#3D453F] text-[#1E201D] dark:text-white shadow-sm"
                : "text-[#63665E] dark:text-[#A5B29A]"
            }`}
          >
            + Subir Evidencia
          </button>
          <button
            onClick={() => setActiveTab("nuevaExp")}
            disabled={!isAprobado}
            className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-all disabled:opacity-40 disabled:cursor-not-allowed ${
              activeTab === "nuevaExp"
                ? "bg-white dark:bg-[#3D453F] text-[#1E201D] dark:text-white shadow-sm"
                : "text-[#63665E] dark:text-[#A5B29A]"
            }`}
          >
            + Nueva Actividad
          </button>
        </div>

        {activeTab === "resumen" && (
          <div className="space-y-4">
            <h2 className="text-lg font-serif text-[#1E201D] dark:text-white font-bold">
              Evidencias Ambientales Presentadas
            </h2>
            {isLoading ? (
              <div className="h-32 bg-white dark:bg-[#2A312C] rounded-2xl animate-pulse" />
            ) : proveedor?.documentos.length === 0 ? (
              <div className="p-8 text-center bg-white dark:bg-[#2A312C] rounded-2xl border border-dashed border-[#8C9287]/40">
                <UploadCloud className="h-10 w-10 text-[#728C69] mx-auto mb-2" />
                <p className="text-sm text-[#8C9287] mb-3">No has cargado ninguna evidencia ecológica.</p>
                <button
                  onClick={() => setActiveTab("evidencias")}
                  className="text-xs bg-[#728C69] text-white px-4 py-2 rounded-xl"
                >
                  Subir mi primer certificado
                </button>
              </div>
            ) : (
              <div className="grid gap-4 sm:grid-cols-2">
                {proveedor?.documentos.map((doc) => (
                  <div
                    key={doc.id}
                    className="bg-white dark:bg-[#2A312C] rounded-2xl p-5 shadow-sm border border-transparent dark:border-white/5"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <span className="text-[10px] font-bold text-[#728C69] uppercase tracking-wider">
                        {doc.tipo}
                      </span>
                      <span
                        className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full ${
                          doc.estado === "APROBADO"
                            ? "bg-emerald-100 text-emerald-800 dark:text-emerald-300"
                            : doc.estado === "RECHAZADO"
                            ? "bg-red-100 text-red-800 dark:text-red-300"
                            : "bg-amber-100 text-amber-800 dark:text-amber-300"
                        }`}
                      >
                        {doc.estado}
                      </span>
                    </div>
                    <h3 className="font-semibold text-sm text-[#1E201D] dark:text-white">
                      {doc.titulo}
                    </h3>
                    {doc.descripcion && (
                      <p className="text-xs text-[#63665E] dark:text-[#A5B29A] mt-1">{doc.descripcion}</p>
                    )}
                    {doc.retroalimentacionAdmin && (
                      <div className="mt-3 p-2 bg-[#F4F1EA] dark:bg-[#1E2420] rounded-lg text-xs text-[#C81D77]">
                        <strong>Retroalimentación auditor:</strong> {doc.retroalimentacionAdmin}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === "evidencias" && (
          <div className="bg-white dark:bg-[#2A312C] rounded-3xl p-6 shadow-sm max-w-xl">
            <h2 className="text-xl font-serif text-[#1E201D] dark:text-white mb-4 font-bold">
              Registrar Nueva Evidencia Ecológica
            </h2>
            <form onSubmit={handleSubirEvidencia} className="space-y-4">
              <div>
                <label className="text-xs font-medium text-[#1E201D] dark:text-white block mb-1">
                  Tipo de Documento
                </label>
                <select
                  value={evidenciaTipo}
                  onChange={(e) => setEvidenciaTipo(e.target.value)}
                  className="w-full text-xs p-3 rounded-xl bg-[#F4F1EA] dark:bg-[#1E2420] border focus:outline-none"
                >
                  <option value="CERTIFICACION_ECOLOGICA">Certificación Ecológica</option>
                  <option value="MANEJO_RESIDUOS">Plan de Manejo de Residuos</option>
                  <option value="USO_AGUA_ENERGIA">Uso Eficiente de Agua y Energía</option>
                  <option value="IMPACTO_COMUNITARIO">Impacto Social y Comunitario</option>
                  <option value="OTRO">Otro documento aval</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-medium text-[#1E201D] dark:text-white block mb-1">
                  Título del Documento
                </label>
                <input
                  type="text"
                  value={evidenciaTitulo}
                  onChange={(e) => setEvidenciaTitulo(e.target.value)}
                  placeholder="ej. Certificado de agricultura orgánica chinampera"
                  className="w-full text-xs p-3 rounded-xl bg-[#F4F1EA] dark:bg-[#1E2420] border focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="text-xs font-medium text-[#1E201D] dark:text-white block mb-1">
                  Descripción o Alcance
                </label>
                <textarea
                  value={evidenciaDesc}
                  onChange={(e) => setEvidenciaDesc(e.target.value)}
                  placeholder="Detalles sobre las prácticas ambientales demostradas..."
                  rows={3}
                  className="w-full text-xs p-3 rounded-xl bg-[#F4F1EA] dark:bg-[#1E2420] border focus:outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-medium text-[#1E201D] dark:text-white block mb-1">
                  URL del Documento o Imagen Probatoria
                </label>
                <input
                  type="url"
                  value={evidenciaUrl}
                  onChange={(e) => setEvidenciaUrl(e.target.value)}
                  placeholder="https://ejemplo.com/documento.pdf"
                  className="w-full text-xs p-3 rounded-xl bg-[#F4F1EA] dark:bg-[#1E2420] border focus:outline-none"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-[#728C69] hover:bg-[#5B7153] text-white py-3 rounded-xl text-xs font-bold transition-colors disabled:opacity-50"
              >
                {isSubmitting ? "Registrando..." : "Enviar a Auditoría"}
              </button>
            </form>
          </div>
        )}

        {activeTab === "nuevaExp" && isAprobado && (
          <div className="bg-white dark:bg-[#2A312C] rounded-3xl p-6 shadow-sm max-w-xl">
            <h2 className="text-xl font-serif text-[#1E201D] dark:text-white mb-4 font-bold">
              Dar de Alta Experiencia Sustentable
            </h2>
            <form onSubmit={handleCrearExperiencia} className="space-y-4">
              <div>
                <label className="text-xs font-medium text-[#1E201D] dark:text-white block mb-1">
                  Título de la Actividad
                </label>
                <input
                  type="text"
                  value={expTitulo}
                  onChange={(e) => setExpTitulo(e.target.value)}
                  placeholder="ej. Recorrido guiado de agrobiodiversidad"
                  className="w-full text-xs p-3 rounded-xl bg-[#F4F1EA] dark:bg-[#1E2420] border focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="text-xs font-medium text-[#1E201D] dark:text-white block mb-1">
                  Descripción Detallada
                </label>
                <textarea
                  value={expDesc}
                  onChange={(e) => setExpDesc(e.target.value)}
                  placeholder="Explica la experiencia y su valor ambiental..."
                  rows={3}
                  className="w-full text-xs p-3 rounded-xl bg-[#F4F1EA] dark:bg-[#1E2420] border focus:outline-none"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-medium text-[#1E201D] dark:text-white block mb-1">
                    Categoría
                  </label>
                  <select
                    value={expCategoria}
                    onChange={(e) => setExpCategoria(e.target.value)}
                    className="w-full text-xs p-3 rounded-xl bg-[#F4F1EA] dark:bg-[#1E2420] border focus:outline-none"
                  >
                    <option value="Ecoturismo">Ecoturismo</option>
                    <option value="Naturaleza">Naturaleza</option>
                    <option value="Gastronomía">Gastronomía</option>
                    <option value="Cultura">Cultura</option>
                    <option value="Aventura">Aventura</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-medium text-[#1E201D] dark:text-white block mb-1">
                    Alcaldía CDMX
                  </label>
                  <select
                    value={expAlcaldia}
                    onChange={(e) => setExpAlcaldia(e.target.value)}
                    className="w-full text-xs p-3 rounded-xl bg-[#F4F1EA] dark:bg-[#1E2420] border focus:outline-none"
                  >
                    {ALCALDIAS_CDMX.map((alc) => (
                      <option key={alc} value={alc}>
                        {alc}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="text-xs font-medium text-[#1E201D] dark:text-white block mb-1">
                    Precio (MXN)
                  </label>
                  <input
                    type="number"
                    min={0}
                    value={expPrecio}
                    onChange={(e) => setExpPrecio(Number(e.target.value))}
                    className="w-full text-xs p-3 rounded-xl bg-[#F4F1EA] dark:bg-[#1E2420] border focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-xs font-medium text-[#1E201D] dark:text-white block mb-1">
                    Duración (min)
                  </label>
                  <input
                    type="number"
                    min={15}
                    value={expDuracion}
                    onChange={(e) => setExpDuracion(Number(e.target.value))}
                    className="w-full text-xs p-3 rounded-xl bg-[#F4F1EA] dark:bg-[#1E2420] border focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-xs font-medium text-[#1E201D] dark:text-white block mb-1">
                    Capacidad Máx
                  </label>
                  <input
                    type="number"
                    min={1}
                    max={100}
                    value={expCapacidad}
                    onChange={(e) => setExpCapacidad(Number(e.target.value))}
                    className="w-full text-xs p-3 rounded-xl bg-[#F4F1EA] dark:bg-[#1E2420] border focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-medium text-[#1E201D] dark:text-white block mb-1">
                  URL de Imagen Principal
                </label>
                <input
                  type="url"
                  value={expImagen}
                  onChange={(e) => setExpImagen(e.target.value)}
                  className="w-full text-xs p-3 rounded-xl bg-[#F4F1EA] dark:bg-[#1E2420] border focus:outline-none"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-[#728C69] hover:bg-[#5B7153] text-white py-3 rounded-xl text-xs font-bold transition-colors disabled:opacity-50"
              >
                {isSubmitting ? "Publicando..." : "Publicar Experiencia en el Catálogo"}
              </button>
            </form>
          </div>
        )}
      </main>
    </div>
  );
}

