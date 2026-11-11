"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Sparkles,
  Send,
  MapPin,
  Clock,
  Users,
  Star,
  ShieldCheck,
  AlertCircle,
  Compass,
  ArrowRight,
  Filter,
  DollarSign,
  Lock,
} from "lucide-react";
import { useLanguage } from "@/lib/i18n/LanguageContext";

interface ExperienciaRecomendada {
  id: string;
  titulo: string;
  descripcion: string;
  categoria: string;
  alcaldia: string;
  ubicacion?: string;
  precio: number;
  duracionMinutos: number;
  capacidadCarga: number;
  proveedor?: string;
  estadoSello?: string;
  rating: number;
  totalResenas: number;
}

export default function RecomendacionesIAPage() {
  const { t, language } = useLanguage();
  const [consulta, setConsulta] = useState("");
  const [categoriaFiltro, setCategoriaFiltro] = useState("Todas");
  const [presupuestoFiltro, setPresupuestoFiltro] = useState<number | "">("");
  const [isLoading, setIsLoading] = useState(false);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [isLoadingAuth, setIsLoadingAuth] = useState(true);
  const [cooldown, setCooldown] = useState(0);
  const [resultadoTexto, setResultadoTexto] = useState<string | null>(null);
  const [experiencias, setExperiencias] = useState<ExperienciaRecomendada[]>([]);
  const [isDemo, setIsDemo] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Verificar autenticación del usuario
  useEffect(() => {
    async function checkAuth() {
      try {
        const res = await fetch("/api/user/profile");
        if (res.ok) {
          const data = await res.json();
          if (data.success && data.data) {
            setCurrentUser(data.data);
          }
        }
      } catch {
        setCurrentUser(null);
      } finally {
        setIsLoadingAuth(false);
      }
    }
    checkAuth();
  }, []);

  // Temporizador para el cooldown
  useEffect(() => {
    if (cooldown <= 0) return;
    const timer = setInterval(() => {
      setCooldown((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, [cooldown]);

  const sugerencias =
    language === "en"
      ? [
          "🌿 I want to explore agroecological chinampas in Xochimilco for 2 people",
          "🐾 Looking for a pet-friendly nature hike in Los Dinamos",
          "☕ Low-impact gastronomic and cultural experience in Coyoacán",
          "🏕️ Mountain ecotourism in Tlalpan with budget under $800 MXN",
        ]
      : [
          "🌿 Quiero recorrer chinampas agroecológicas en Xochimilco para 2 personas",
          "🐾 Busco una caminata en la naturaleza pet-friendly por Los Dinamos",
          "☕ Experiencia gastronómica y cultural de bajo impacto en Coyoacán",
          "🏕️ Ecoturismo de montaña en Tlalpan con presupuesto menor a $800",
        ];

  const handleSubmit = async (textoAEnviar?: string) => {
    if (!currentUser) {
      setError("Debes iniciar sesión para interactuar con el recomendador.");
      return;
    }
    if (cooldown > 0) return;

    const promptFinal = (textoAEnviar || consulta).trim();
    if (!promptFinal) return;

    setIsLoading(true);
    setError(null);
    setResultadoTexto(null);

    let queryCompuesta = promptFinal;
    if (categoriaFiltro !== "Todas") {
      queryCompuesta += ` (Categoría preferida: ${categoriaFiltro})`;
    }
    if (presupuestoFiltro) {
      queryCompuesta += ` (Presupuesto máximo: $${presupuestoFiltro} MXN por persona)`;
    }

    try {
      const res = await fetch("/api/ai/recomendaciones", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: queryCompuesta }),
      });

      const data = await res.json();

      if (res.status === 429) {
        setCooldown(data.cooldownRemaining || 20);
        throw new Error(data.error);
      }

      if (!res.ok || !data.success) {
        if (data.requiresAuth) {
          setCurrentUser(null);
        }
        throw new Error(data.error || "Error al obtener recomendaciones.");
      }

      // Activar cooldown de 20s
      setCooldown(20);
      setResultadoTexto(data.texto || "");
      setExperiencias(data.experiencias || []);
      setIsDemo(Boolean(data.isDemo));
    } catch (err: any) {
      setError(err.message || "No se pudo conectar con el asistente de IA.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="min-h-screen w-full bg-[#F4F1EA] dark:bg-[#1E2420] transition-colors duration-300 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto space-y-8">
        {/* Encabezado Principal */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#728C69]/15 text-[#728C69] dark:text-[#A5B29A] text-xs font-bold uppercase tracking-wider">
            <Sparkles className="w-4 h-4" />
            {t("ai_badge")}
          </div>
          <h1 className="font-serif text-3xl sm:text-5xl text-[#1E201D] dark:text-white">
            {t("ai_title")}
          </h1>
          <p className="text-sm sm:text-base text-[#8C9287] dark:text-[#9EA399] max-w-2xl mx-auto">
            {t("ai_subtitle")}
          </p>
        </div>

        {/* Banner de requisito de inicio de sesión */}
        {!isLoadingAuth && !currentUser && (
          <div className="bg-white dark:bg-[#2A312C] rounded-3xl p-6 sm:p-8 shadow-sm border border-amber-200 dark:border-amber-700/30 flex flex-col sm:flex-row items-center justify-between gap-6">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-2xl bg-[#728C69]/15 flex items-center justify-center text-[#728C69] flex-shrink-0">
                <Lock className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <h3 className="font-serif text-lg text-[#1E201D] dark:text-white">
                  {t("ai_auth_required_title")}
                </h3>
                <p className="text-xs sm:text-sm text-[#8C9287] dark:text-[#9EA399]">
                  {t("ai_auth_required_desc")}
                </p>
              </div>
            </div>
            <Link
              href="/login/loginUser?callbackUrl=/ia-recomendaciones"
              className="px-6 py-2.5 rounded-full bg-[#728C69] hover:bg-[#5b7353] text-white text-xs font-semibold whitespace-nowrap transition-all shadow-sm flex items-center gap-2"
            >
              <span>{t("ai_auth_login_btn")}</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        )}

        {/* Caja de Interacción Principal */}
        <div className="bg-white dark:bg-[#2A312C] rounded-3xl p-6 sm:p-8 shadow-sm border border-transparent dark:border-white/5 space-y-6">
          {/* Campo de Texto Principal */}
          <div className="relative">
            <textarea
              rows={3}
              value={consulta}
              disabled={!currentUser}
              onChange={(e) => setConsulta(e.target.value)}
              placeholder={
                currentUser ? t("ai_placeholder") : t("ai_auth_required_desc")
              }
              className="w-full bg-[#FAF9F5] dark:bg-[#1E2420] border border-gray-200 dark:border-white/10 rounded-2xl p-4 text-sm text-[#1E201D] dark:text-white placeholder-[#8C9287] focus:outline-none focus:ring-2 focus:ring-[#728C69] resize-none transition-all disabled:opacity-60 disabled:cursor-not-allowed"
            />
          </div>

          {/* Filtros Opcionales Rápidos */}
          <div className="flex flex-wrap items-center gap-4 text-xs">
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-[#728C69]" />
              <span className="font-semibold text-[#1E201D] dark:text-white">{t("ai_category")}</span>
              <select
                value={categoriaFiltro}
                disabled={!currentUser}
                onChange={(e) => setCategoriaFiltro(e.target.value)}
                className="bg-[#FAF9F5] dark:bg-[#1E2420] border border-gray-200 dark:border-white/10 rounded-xl px-3 py-1.5 text-xs text-[#1E201D] dark:text-white focus:outline-none disabled:opacity-60"
              >
                <option value="Todas">{language === "en" ? "All" : "Todas"}</option>
                <option value="Ecoturismo">{language === "en" ? "Ecotourism" : "Ecoturismo"}</option>
                <option value="Naturaleza">{language === "en" ? "Nature" : "Naturaleza"}</option>
                <option value="Cultura">{language === "en" ? "Culture" : "Cultura"}</option>
                <option value="Gastronomía">{language === "en" ? "Gastronomy" : "Gastronomía"}</option>
                <option value="Relax">{language === "en" ? "Relax" : "Relax"}</option>
                <option value="Mascotas">{language === "en" ? "Pet friendly" : "Mascotas"}</option>
              </select>
            </div>

            <div className="flex items-center gap-2">
              <DollarSign className="w-4 h-4 text-[#728C69]" />
              <span className="font-semibold text-[#1E201D] dark:text-white">{t("ai_budget")}</span>
              <input
                type="number"
                placeholder="Ej. 600"
                value={presupuestoFiltro}
                disabled={!currentUser}
                onChange={(e) =>
                  setPresupuestoFiltro(e.target.value ? Number(e.target.value) : "")
                }
                className="w-24 bg-[#FAF9F5] dark:bg-[#1E2420] border border-gray-200 dark:border-white/10 rounded-xl px-3 py-1.5 text-xs text-[#1E201D] dark:text-white focus:outline-none disabled:opacity-60"
              />
              <span className="text-[#8C9287]">MXN</span>
            </div>

            <div className="ml-auto w-full sm:w-auto">
              {!currentUser ? (
                <Link
                  href="/login/loginUser?callbackUrl=/ia-recomendaciones"
                  className="w-full sm:w-auto px-6 py-2.5 rounded-full bg-[#728C69] hover:bg-[#5b7353] text-white text-xs font-semibold transition-all shadow-sm flex items-center justify-center gap-2"
                >
                  <Lock className="w-4 h-4" />
                  <span>{t("ai_btn_login_to_query")}</span>
                </Link>
              ) : (
                <button
                  onClick={() => handleSubmit()}
                  disabled={isLoading || !consulta.trim() || cooldown > 0}
                  className="w-full sm:w-auto px-6 py-2.5 rounded-full bg-[#728C69] hover:bg-[#5b7353] disabled:opacity-50 text-white text-xs font-semibold transition-all shadow-sm flex items-center justify-center gap-2"
                >
                  {isLoading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>{t("ai_btn_consulting")}</span>
                    </>
                  ) : cooldown > 0 ? (
                    <>
                      <Clock className="w-4 h-4" />
                      <span>{language === "en" ? `Wait ${cooldown}s` : `Espera ${cooldown}s`}</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      <span>{t("ai_btn_generate")}</span>
                    </>
                  )}
                </button>
              )}
            </div>
          </div>

          {/* Sugerencias en Chips */}
          <div className="space-y-2 pt-2 border-t border-gray-100 dark:border-white/5">
            <span className="text-[11px] font-medium text-[#8C9287] dark:text-[#9EA399] uppercase tracking-wider block">
              {t("ai_suggestions_title")}
            </span>
            <div className="flex flex-wrap gap-2">
              {sugerencias.map((sug, i) => (
                <button
                  key={i}
                  disabled={!currentUser || cooldown > 0 || isLoading}
                  onClick={() => {
                    setConsulta(sug);
                    handleSubmit(sug);
                  }}
                  className="text-xs text-left px-3 py-1.5 rounded-full bg-[#FAF9F5] dark:bg-[#1E2420] hover:bg-[#E3E5D8] dark:hover:bg-[#3D453F] border border-gray-200/60 dark:border-white/5 text-[#63665E] dark:text-[#A5B29A] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {sug}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Notificación si la clave aún no está configurada */}
        {isDemo && (
          <div className="bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/40 rounded-3xl p-5 flex items-start gap-4 text-amber-800 dark:text-amber-200">
            <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5 text-amber-600 dark:text-amber-400" />
            <div className="text-xs space-y-1">
              <p className="font-semibold text-sm">Modo Demostración Activo</p>
              <p>
                Para habilitar respuestas generadas por Gemini AI en tiempo real, agrega tu clave{" "}
                <code className="bg-amber-100 dark:bg-amber-900/50 px-1.5 py-0.5 rounded font-mono">
                  GEMINI_API_KEY
                </code>{" "}
                en tu archivo <code className="font-mono">.env</code>.
              </p>
            </div>
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800/40 rounded-3xl p-5 text-xs text-red-600 dark:text-red-300 flex items-center gap-3">
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Resultados de la Recomendación */}
        {resultadoTexto && (
          <div className="space-y-6 animate-in fade-in duration-300">
            {/* Texto Explicativo del Asistente */}
            <div className="bg-white dark:bg-[#2A312C] rounded-3xl p-6 sm:p-8 shadow-sm border border-transparent dark:border-white/5">
              <div className="flex items-center gap-2 mb-4 text-[#728C69] dark:text-[#A5B29A] font-semibold text-xs uppercase tracking-wider">
                <Sparkles className="w-4 h-4" />
                {t("ai_assistant_response")}
              </div>
              <div className="text-sm sm:text-base leading-relaxed text-[#1E201D] dark:text-[#D1D5CD] whitespace-pre-line">
                {resultadoTexto}
              </div>
            </div>

            {/* Tarjetas de Experiencias Sugeridas */}
            {experiencias.length > 0 && (
              <div className="space-y-4">
                <h3 className="font-serif text-xl text-[#1E201D] dark:text-white flex items-center gap-2">
                  <Compass className="w-5 h-5 text-[#728C69]" />
                  {language === "en"
                    ? "Recommended Experiences from Database"
                    : "Experiencias Recomendadas en la Base de Datos"}
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {experiencias.map((exp) => (
                    <div
                      key={exp.id}
                      className="group bg-white dark:bg-[#2A312C] rounded-3xl p-5 shadow-sm border border-transparent dark:border-white/5 hover:border-[#728C69]/30 transition-all flex flex-col justify-between"
                    >
                      <div>
                        {/* Cabecera de la Tarjeta */}
                        <div className="flex items-center justify-between gap-2 mb-3">
                          <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-[#728C69]/15 text-[#728C69] dark:text-[#A5B29A] uppercase">
                            {exp.categoria}
                          </span>
                          {exp.estadoSello === "APROBADO" && (
                            <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-green-600 dark:text-green-400">
                              <ShieldCheck className="w-3.5 h-3.5" />
                              {t("ai_verified_badge")}
                            </span>
                          )}
                        </div>

                        <h4 className="font-serif text-lg text-[#1E201D] dark:text-white group-hover:text-[#728C69] transition-colors line-clamp-1 mb-1">
                          {exp.titulo}
                        </h4>

                        <p className="text-xs text-[#8C9287] dark:text-[#9EA399] mb-3 line-clamp-2 leading-relaxed">
                          {exp.descripcion}
                        </p>

                        <div className="space-y-1.5 text-xs text-[#63665E] dark:text-[#A5B29A] mb-4">
                          <div className="flex items-center gap-1.5">
                            <MapPin className="w-3.5 h-3.5 text-[#728C69]" />
                            <span>{exp.alcaldia} · CDMX</span>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <Clock className="w-3.5 h-3.5 text-[#728C69]" />
                            <span>{exp.duracionMinutos} min</span>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <Users className="w-3.5 h-3.5 text-[#728C69]" />
                            <span>{language === "en" ? `Max ${exp.capacidadCarga} people` : `Máx. ${exp.capacidadCarga} personas`}</span>
                          </div>
                        </div>
                      </div>

                      {/* Pie de la Tarjeta: Precio y Acción */}
                      <div className="pt-3 border-t border-gray-100 dark:border-white/5 flex items-center justify-between">
                        <div>
                          <span className="text-xs text-[#8C9287] block">{t("ai_price_per_person")}</span>
                          <span className="font-serif text-lg font-bold text-[#1E201D] dark:text-white">
                            ${exp.precio.toLocaleString("es-MX")} MXN
                          </span>
                        </div>

                        <Link
                          href={`/recomendaciones/${exp.categoria.toLowerCase().includes("cultura") ? "cultura" : exp.categoria.toLowerCase().includes("mascota") ? "mascotas" : exp.categoria.toLowerCase().includes("relax") ? "relax" : "naturaleza"}/${encodeURIComponent(exp.titulo.toLowerCase().replace(/\s+/g, "-"))}`}
                          className="px-4 py-2 rounded-full bg-[#728C69] hover:bg-[#5b7353] text-white text-xs font-semibold transition-all shadow-sm flex items-center gap-1"
                        >
                          <span>{t("ai_view_details")}</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </main>
  );
}

