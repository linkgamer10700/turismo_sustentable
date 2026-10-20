"use client";

import React, { useState, useEffect } from "react";
import { useSession, signIn, signOut } from "next-auth/react";
import { useTheme } from "next-themes";
import { register as registerServerAction } from "@/actions/register";
import {
  Sun,
  Moon,
  Laptop,
  User,
  Shield,
  Store,
  Compass,
  Send,
  RefreshCw,
  LogOut,
  LogIn,
  Key,
  CheckCircle2,
  AlertTriangle,
  Code2,
  Sliders,
  Sparkles,
  FileCheck,
  UploadCloud,
  FileText,
  CheckCircle,
  XCircle,
  Clock,
  ArrowRightLeft,
  Filter,
  MapPin,
  Users,
  DollarSign,
  Eye,
  Trees,
  Calendar,
  Heart,
  Bookmark,
  Receipt,
  AlertCircle,
} from "lucide-react";

const CDMX_ALCALDIAS = [
  "Álvaro Obregón",
  "Azcapotzalco",
  "Benito Juárez",
  "Coyoacán",
  "Cuajimalpa de Morelos",
  "Cuauhtémoc",
  "Gustavo A. Madero",
  "Iztacalco",
  "Iztapalapa",
  "La Magdalena Contreras",
  "Miguel Hidalgo",
  "Milpa Alta",
  "Tláhuac",
  "Tlalpan",
  "Venustiano Carranza",
  "Xochimilco",
];

const AVAILABLE_INTERESTS = [
  "Naturaleza",
  "Cultura",
  "Comunidad",
  "Gastronomía",
  "Aventura",
  "Historia",
];

const AVAILABLE_TRAVEL_STYLES = [
  "Bajo impacto",
  "Ecológico",
  "Accesible",
  "Familiar",
  "Mochilero",
];

const TIPOS_DOCUMENTO = [
  { value: "CERTIFICACION_ECOLOGICA", label: "Certificación Ecológica" },
  { value: "MANEJO_RESIDUOS", label: "Manejo de Residuos" },
  { value: "USO_AGUA_ENERGIA", label: "Uso Eficiente de Agua y Energía" },
  { value: "IMPACTO_COMUNITARIO", label: "Impacto Comunitario" },
  { value: "OTRO", label: "Otro Documento" },
];

export default function PlaygroundPage() {
  const { data: session, status, update } = useSession();
  const { theme: currentTheme, setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Tab State
  const [activeTab, setActiveTab] = useState<
    "register" | "auth" | "profile" | "sustainability" | "catalog" | "reservas"
  >("register");

  // ==========================================
  // 1. MÓDULO DE REGISTRO
  // ==========================================
  const [regForm, setRegForm] = useState({
    name: "Mariana Morales",
    email: "mariana.cdmx@test.com",
    password: "password123",
    rol: "TURISTA" as "TURISTA" | "PROVEEDOR",
    nombreNegocio: "Trajineras Sustentables",
    categoria: "Ecoturismo",
    alcaldiaCDMX: "Xochimilco",
  });
  const [selectedIntereses, setSelectedIntereses] = useState<string[]>([
    "Naturaleza",
    "Cultura",
  ]);
  const [selectedEstilos, setSelectedEstilos] = useState<string[]>([
    "Bajo impacto",
    "Ecológico",
  ]);
  const [regMethod, setRegMethod] = useState<"api" | "serverAction">("api");
  const [regLoading, setRegLoading] = useState(false);
  const [regResponse, setRegResponse] = useState<any>(null);

  const toggleInterest = (interest: string) => {
    setSelectedIntereses((prev) =>
      prev.includes(interest)
        ? prev.filter((i) => i !== interest)
        : [...prev, interest]
    );
  };

  const toggleTravelStyle = (style: string) => {
    setSelectedEstilos((prev) =>
      prev.includes(style) ? prev.filter((s) => s !== style) : [...prev, style]
    );
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setRegLoading(true);
    setRegResponse(null);

    const payload = {
      name: regForm.name,
      email: regForm.email,
      password: regForm.password,
      rol: regForm.rol,
      theme: "SYSTEM" as const,
      preferencias: {
        intereses: selectedIntereses,
        estiloViaje: selectedEstilos,
      },
      ...(regForm.rol === "PROVEEDOR"
        ? {
            nombreNegocio: regForm.nombreNegocio,
            categoria: regForm.categoria,
            alcaldiaCDMX: regForm.alcaldiaCDMX,
            descripcionBreve: "Experiencias locales de alto valor sustentable.",
          }
        : {}),
    };

    try {
      if (regMethod === "api") {
        const res = await fetch("/api/auth/register", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        const data = await res.json();
        setRegResponse({
          status: res.status,
          statusText: res.statusText,
          body: data,
        });
      } else {
        const actionResult = await registerServerAction(payload);
        setRegResponse({
          method: "Server Action (register)",
          result: actionResult,
        });
      }
    } catch (err: any) {
      setRegResponse({
        error: "Client Request Exception",
        message: err.message,
      });
    } finally {
      setRegLoading(false);
    }
  };

  // ==========================================
  // 2. MÓDULO DE LOGIN & SESIÓN
  // ==========================================
  const [loginEmail, setLoginEmail] = useState("turista@test.com");
  const [loginPassword, setLoginPassword] = useState("admin123");
  const [loginLoading, setLoginLoading] = useState(false);
  const [loginResult, setLoginResult] = useState<any>(null);

  const fillCredentials = (email: string, pass: string) => {
    setLoginEmail(email);
    setLoginPassword(pass);
  };

  const executeLogin = async (email: string, pass: string) => {
    setLoginLoading(true);
    setLoginResult(null);

    try {
      const res = await signIn("credentials", {
        email,
        password: pass,
        redirect: false,
      });

      setLoginResult(res);
      if (res && !res.error) {
        await update();
      }
    } catch (err: any) {
      setLoginResult({ error: err.message });
    } finally {
      setLoginLoading(false);
    }
  };

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await executeLogin(loginEmail, loginPassword);
  };

  const handleSignOut = async () => {
    await signOut({ redirect: false });
    setLoginResult({ message: "Sesión cerrada con éxito" });
    setProfileData(null);
    setMisDocs([]);
    setAuditorias([]);
  };

  // ==========================================
  // 3. MÓDULO DE PERFIL & PREFERENCIAS
  // ==========================================
  const [profileLoading, setProfileLoading] = useState(false);
  const [profileData, setProfileData] = useState<any>(null);
  const [editTheme, setEditTheme] = useState<"LIGHT" | "DARK" | "SYSTEM">("SYSTEM");
  const [editIdioma, setEditIdioma] = useState<string>("es");
  const [patchLoading, setPatchLoading] = useState(false);
  const [patchResponse, setPatchResponse] = useState<any>(null);

  const fetchProfile = async () => {
    setProfileLoading(true);
    setProfileData(null);
    try {
      const res = await fetch("/api/user/profile");
      const data = await res.json();
      setProfileData({
        status: res.status,
        data,
      });
      if (data?.data?.theme) {
        setEditTheme(data.data.theme);
      }
      if (data?.data?.idioma) {
        setEditIdioma(data.data.idioma);
      }
    } catch (err: any) {
      setProfileData({ error: err.message });
    } finally {
      setProfileLoading(false);
    }
  };

  const handleUpdatePreferences = async (e: React.FormEvent) => {
    e.preventDefault();
    setPatchLoading(true);
    setPatchResponse(null);

    try {
      const res = await fetch("/api/user/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          theme: editTheme,
          idioma: editIdioma,
        }),
      });
      const data = await res.json();
      setPatchResponse({
        status: res.status,
        data,
      });

      await update({
        theme: editTheme,
        idioma: editIdioma,
      });

      if (editTheme === "DARK") setTheme("dark");
      else if (editTheme === "LIGHT") setTheme("light");
      else setTheme("system");

      await fetchProfile();
    } catch (err: any) {
      setPatchResponse({ error: err.message });
    } finally {
      setPatchLoading(false);
    }
  };

  // ==========================================
  // 4. MÓDULO DE AUDITORÍAS & SUSTENTABILIDAD
  // ==========================================
  const [docForm, setDocForm] = useState({
    tipo: "CERTIFICACION_ECOLOGICA",
    titulo: "Certificado Huella de Carbono Neutral 2026",
    descripcion: "Certificación emitida por SEMARNAT para manejo de bajo impacto ambiental.",
    archivoUrl: "https://evidencias.turismo-cdmx.gob.mx/cert-carbono-2026.pdf",
  });
  const [docLoading, setDocLoading] = useState(false);
  const [docResponse, setDocResponse] = useState<any>(null);
  const [misDocs, setMisDocs] = useState<any[]>([]);
  const [loadingMisDocs, setLoadingMisDocs] = useState(false);

  // Admin audit state
  const [filtroEstado, setFiltroEstado] = useState<string>("TODOS");
  const [auditorias, setAuditorias] = useState<any[]>([]);
  const [loadingAuditorias, setLoadingAuditorias] = useState(false);
  const [auditResponse, setAuditResponse] = useState<any>(null);
  const [feedbackMap, setFeedbackMap] = useState<Record<string, string>>({});
  const [dictamenLoading, setDictamenLoading] = useState<string | null>(null);

  const fetchMisDocumentos = async () => {
    setLoadingMisDocs(true);
    try {
      const res = await fetch("/api/proveedor/documentos");
      const data = await res.json();
      setDocResponse({ status: res.status, data });
      if (data?.success && data?.data?.documentos) {
        setMisDocs(data.data.documentos);
      }
    } catch (err: any) {
      setDocResponse({ error: err.message });
    } finally {
      setLoadingMisDocs(false);
    }
  };

  const handleSubirEvidencia = async (e: React.FormEvent) => {
    e.preventDefault();
    setDocLoading(true);
    setDocResponse(null);

    try {
      const res = await fetch("/api/proveedor/documentos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(docForm),
      });
      const data = await res.json();
      setDocResponse({ status: res.status, data });
      if (res.ok) {
        await fetchMisDocumentos();
      }
    } catch (err: any) {
      setDocResponse({ error: err.message });
    } finally {
      setDocLoading(false);
    }
  };

  const fetchAuditorias = async () => {
    setLoadingAuditorias(true);
    try {
      const query = filtroEstado !== "TODOS" ? `?estado=${filtroEstado}` : "";
      const res = await fetch(`/api/admin/auditorias${query}`);
      const data = await res.json();
      setAuditResponse({ status: res.status, data });
      if (data?.success && data?.data) {
        setAuditorias(data.data);
      }
    } catch (err: any) {
      setAuditResponse({ error: err.message });
    } finally {
      setLoadingAuditorias(false);
    }
  };

  const handleDictamen = async (
    documentoId: string,
    estado: "APROBADO" | "RECHAZADO"
  ) => {
    setDictamenLoading(documentoId);
    setAuditResponse(null);

    const retroalimentacion = feedbackMap[documentoId] || "";

    if (estado === "RECHAZADO" && !retroalimentacion.trim()) {
      alert("La retroalimentación es obligatoria si el documento es RECHAZADO.");
      setDictamenLoading(null);
      return;
    }

    try {
      const res = await fetch("/api/admin/auditorias", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          documentoId,
          estado,
          retroalimentacion,
        }),
      });
      const data = await res.json();
      setAuditResponse({ status: res.status, data });
      if (res.ok) {
        await fetchAuditorias();
      }
    } catch (err: any) {
      setAuditResponse({ error: err.message });
    } finally {
      setDictamenLoading(null);
    }
  };

  // ==========================================
  // 5. MÓDULO DE EXPERIENCIAS & CATÁLOGO CDMX
  // ==========================================
  const [expForm, setExpForm] = useState({
    titulo: "Ruta de Conservación del Ajolote y Canales Viejos",
    descripcion: "Navegación sustentable en canoa tradicional guiada por chinamperos certificados, conociendo refugios de axolotes y técnicas agrícolas milenarias.",
    categoria: "Ecoturismo",
    alcaldiaCDMX: "Xochimilco",
    ubicacionDetallada: "Embarcadero Cuemanco, Muelle Ecológico 4",
    precio: "390",
    duracionMinutos: "150",
    capacidadCarga: "10",
    imagenUrl: "https://images.unsplash.com/photo-1518638150340-f706e86654de?auto=format&fit=crop&w=800&q=80",
  });
  const [expCreateLoading, setExpCreateLoading] = useState(false);
  const [expCreateResponse, setExpCreateResponse] = useState<any>(null);

  // Filtros de Catálogo
  const [catalogFilters, setCatalogFilters] = useState({
    alcaldia: "",
    categoria: "",
    precioMax: "",
    duracionMaxMinutos: "",
    buscar: "",
  });
  const [catalogLoading, setCatalogLoading] = useState(false);
  const [catalogResponse, setCatalogResponse] = useState<any>(null);
  const [experienciasList, setExperienciasList] = useState<any[]>([]);
  const [selectedExpDetail, setSelectedExpDetail] = useState<any>(null);
  const [detailLoading, setDetailLoading] = useState(false);

  const fetchExperiencias = async (customFilters?: typeof catalogFilters) => {
    setCatalogLoading(true);
    setCatalogResponse(null);
    const filters = customFilters || catalogFilters;
    const params = new URLSearchParams();
    if (filters.alcaldia) params.append("alcaldia", filters.alcaldia);
    if (filters.categoria) params.append("categoria", filters.categoria);
    if (filters.precioMax) params.append("precioMax", filters.precioMax);
    if (filters.duracionMaxMinutos) params.append("duracionMaxMinutos", filters.duracionMaxMinutos);
    if (filters.buscar) params.append("buscar", filters.buscar);

    const queryString = params.toString() ? `?${params.toString()}` : "";
    try {
      const res = await fetch(`/api/experiencias${queryString}`);
      const data = await res.json();
      setCatalogResponse({ status: res.status, data });
      if (data?.success && Array.isArray(data?.data)) {
        setExperienciasList(data.data);
      }
    } catch (err: any) {
      setCatalogResponse({ error: err.message });
    } finally {
      setCatalogLoading(false);
    }
  };

  const handleCrearExperiencia = async (e: React.FormEvent) => {
    e.preventDefault();
    setExpCreateLoading(true);
    setExpCreateResponse(null);

    const payload = {
      titulo: expForm.titulo,
      descripcion: expForm.descripcion,
      categoria: expForm.categoria,
      alcaldiaCDMX: expForm.alcaldiaCDMX,
      ubicacionDetallada: expForm.ubicacionDetallada || undefined,
      precio: Number(expForm.precio),
      duracionMinutos: Number(expForm.duracionMinutos),
      capacidadCarga: Number(expForm.capacidadCarga),
      imagenes: expForm.imagenUrl ? [expForm.imagenUrl] : [],
    };

    try {
      const res = await fetch("/api/experiencias", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      setExpCreateResponse({ status: res.status, data });
      if (res.ok && data?.success) {
        await fetchExperiencias();
      }
    } catch (err: any) {
      setExpCreateResponse({ error: err.message });
    } finally {
      setExpCreateLoading(false);
    }
  };

  const fetchExpDetail = async (id: string) => {
    setDetailLoading(true);
    setSelectedExpDetail(null);
    try {
      const res = await fetch(`/api/experiencias/${id}`);
      const data = await res.json();
      setCatalogResponse({ status: res.status, detail: data });
      if (data?.success && data?.data) {
        setSelectedExpDetail(data.data);
      }
    } catch (err: any) {
      setCatalogResponse({ error: err.message });
    } finally {
      setDetailLoading(false);
    }
  };

  // ==========================================
  // 6. MÓDULO DE RESERVAS & CAPACIDAD ECOLÓGICA
  // ==========================================
  const getFutureDate = (daysAhead: number = 3) => {
    const d = new Date();
    d.setDate(d.getDate() + daysAhead);
    return d.toISOString().split("T")[0];
  };

  const [reservaForm, setReservaForm] = useState({
    experienciaId: "",
    fecha: getFutureDate(3),
    numeroPersonas: 2,
    notasEspeciales: "Grupo de viajeros interesados en ecoturismo y bajo impacto ambiental.",
  });
  const [reservaLoading, setReservaLoading] = useState(false);
  const [reservaResponse, setReservaResponse] = useState<any>(null);

  const [reservasList, setReservasList] = useState<any[]>([]);
  const [reservasMetrics, setReservasMetrics] = useState<any>(null);
  const [reservasLoading, setReservasLoading] = useState(false);
  const [reservasResponse, setReservasResponse] = useState<any>(null);

  const [favoritosList, setFavoritosList] = useState<any[]>([]);
  const [favoritosLoading, setFavoritosLoading] = useState(false);
  const [favoritoResponse, setFavoritoResponse] = useState<any>(null);

  const fetchReservas = async () => {
    setReservasLoading(true);
    try {
      const res = await fetch("/api/reservas");
      const data = await res.json();
      setReservasResponse(data);
      if (data?.success && data?.reservas) {
        setReservasList(data.reservas);
        if (data?.metricas) {
          setReservasMetrics(data.metricas);
        }
      }
    } catch (err: any) {
      setReservasResponse({ error: err.message });
    } finally {
      setReservasLoading(false);
    }
  };

  const fetchFavoritos = async () => {
    setFavoritosLoading(true);
    try {
      const res = await fetch("/api/user/favoritos");
      const data = await res.json();
      if (data?.success && data?.favoritos) {
        setFavoritosList(data.favoritos);
      }
    } catch (err: any) {
      console.error(err);
    } finally {
      setFavoritosLoading(false);
    }
  };

  const handleCreateReserva = async (e: React.FormEvent) => {
    e.preventDefault();
    setReservaLoading(true);
    setReservaResponse(null);

    const targetExpId = reservaForm.experienciaId || (experienciasList[0]?.id ?? "");
    const payload = {
      experienciaId: targetExpId,
      fecha: reservaForm.fecha,
      numeroPersonas: Number(reservaForm.numeroPersonas),
      notasEspeciales: reservaForm.notasEspeciales,
    };

    try {
      const res = await fetch("/api/reservas", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      setReservaResponse({
        status: res.status,
        statusText: res.statusText,
        data,
      });

      if (res.ok && data?.success) {
        await fetchReservas();
      }
    } catch (err: any) {
      setReservaResponse({
        error: "Client Request Exception",
        message: err.message,
      });
    } finally {
      setReservaLoading(false);
    }
  };

  const handleToggleFavorito = async (expId: string) => {
    setFavoritoResponse(null);
    try {
      const res = await fetch("/api/user/favoritos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ experienciaId: expId }),
      });
      const data = await res.json();
      setFavoritoResponse({
        status: res.status,
        data,
      });

      if (res.ok) {
        await fetchFavoritos();
      }
    } catch (err: any) {
      setFavoritoResponse({
        error: "Client Request Exception",
        message: err.message,
      });
    }
  };

  useEffect(() => {
    if (activeTab === "catalog" && experienciasList.length === 0) {
      fetchExperiencias();
    }
    if (activeTab === "reservas") {
      if (experienciasList.length === 0) {
        fetchExperiencias();
      }
      if (session?.user?.id) {
        fetchReservas();
        fetchFavoritos();
      }
    }
  }, [activeTab, session]);

  useEffect(() => {
    if (experienciasList.length > 0 && !reservaForm.experienciaId) {
      setReservaForm((prev) => ({
        ...prev,
        experienciaId: experienciasList[0].id,
      }));
    }
  }, [experienciasList]);

  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8 space-y-8 font-sans">
      {/* HEADER PRINCIPAL */}
      <header className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-slate-200 dark:border-zinc-800">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400">
              <Compass className="w-6 h-6 animate-pulse" />
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
              Backend Testing Playground
            </h1>
          </div>
          <p className="mt-1 text-sm text-slate-500 dark:text-zinc-400">
            Sandbox interactivo para validar Autenticación, Roles, Evidencias Ecológicas y Auditorías de Proveedores.
          </p>
        </div>

        {/* CONTROLES DE TEMA Y ESTADO DE SESIÓN */}
        <div className="flex items-center gap-3 self-stretch sm:self-auto justify-between sm:justify-end">
          {/* BADGE DE SESIÓN */}
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900">
            <span
              className={`w-2 h-2 rounded-full ${
                mounted && status === "authenticated"
                  ? "bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.8)]"
                  : !mounted || status === "loading"
                  ? "bg-amber-500 animate-ping"
                  : "bg-slate-400"
              }`}
            />
            <span className="text-slate-600 dark:text-zinc-300">
              {mounted && status === "authenticated"
                ? `${session?.user?.name || session?.user?.email} (${session?.user?.rol})`
                : !mounted || status === "loading"
                ? "Cargando..."
                : "No autenticado"}
            </span>
          </div>

          {/* TOGGLE FLOTANTE / TOP DE TEMA UI */}
          <div className="flex items-center p-1 rounded-lg border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900">
            <button
              onClick={() => setTheme("light")}
              className={`p-1.5 rounded-md transition-colors ${
                mounted && resolvedTheme === "light"
                  ? "bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300"
                  : "text-slate-400 hover:text-slate-700 dark:hover:text-zinc-200"
              }`}
              title="Tema Claro"
            >
              <Sun className="w-4 h-4" />
            </button>
            <button
              onClick={() => setTheme("dark")}
              className={`p-1.5 rounded-md transition-colors ${
                mounted && resolvedTheme === "dark"
                  ? "bg-indigo-100 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300"
                  : "text-slate-400 hover:text-slate-700 dark:hover:text-zinc-200"
              }`}
              title="Tema Oscuro"
            >
              <Moon className="w-4 h-4" />
            </button>
            <button
              onClick={() => setTheme("system")}
              className={`p-1.5 rounded-md transition-colors ${
                mounted && currentTheme === "system"
                  ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300"
                  : "text-slate-400 hover:text-slate-700 dark:hover:text-zinc-200"
              }`}
              title="Tema del Sistema"
            >
              <Laptop className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      {/* PESTAÑAS PRINCIPALES */}
      <nav className="flex space-x-2 border-b border-slate-200 dark:border-zinc-800 pb-2 overflow-x-auto">
        <button
          onClick={() => setActiveTab("register")}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all whitespace-nowrap ${
            activeTab === "register"
              ? "bg-emerald-600 text-white shadow-sm shadow-emerald-500/20"
              : "text-slate-600 dark:text-zinc-400 hover:bg-slate-100 dark:hover:bg-zinc-900"
          }`}
        >
          <User className="w-4 h-4" />
          1. Registro
        </button>
        <button
          onClick={() => setActiveTab("auth")}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all whitespace-nowrap ${
            activeTab === "auth"
              ? "bg-emerald-600 text-white shadow-sm shadow-emerald-500/20"
              : "text-slate-600 dark:text-zinc-400 hover:bg-slate-100 dark:hover:bg-zinc-900"
          }`}
        >
          <Key className="w-4 h-4" />
          2. Login & Sesión
        </button>
        <button
          onClick={() => setActiveTab("profile")}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all whitespace-nowrap ${
            activeTab === "profile"
              ? "bg-emerald-600 text-white shadow-sm shadow-emerald-500/20"
              : "text-slate-600 dark:text-zinc-400 hover:bg-slate-100 dark:hover:bg-zinc-900"
          }`}
        >
          <Sliders className="w-4 h-4" />
          3. Perfil & Preferencias
        </button>
        <button
          onClick={() => setActiveTab("sustainability")}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all whitespace-nowrap ${
            activeTab === "sustainability"
              ? "bg-emerald-600 text-white shadow-sm shadow-emerald-500/20"
              : "text-slate-600 dark:text-zinc-400 hover:bg-slate-100 dark:hover:bg-zinc-900"
          }`}
        >
          <FileCheck className="w-4 h-4" />
          4. Auditorías & Sustentabilidad
        </button>
        <button
          onClick={() => setActiveTab("catalog")}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all whitespace-nowrap ${
            activeTab === "catalog"
              ? "bg-emerald-600 text-white shadow-sm shadow-emerald-500/20"
              : "text-slate-600 dark:text-zinc-400 hover:bg-slate-100 dark:hover:bg-zinc-900"
          }`}
        >
          <Compass className="w-4 h-4" />
          5. Catálogo & Experiencias CDMX
        </button>
        <button
          onClick={() => setActiveTab("reservas")}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all whitespace-nowrap ${
            activeTab === "reservas"
              ? "bg-emerald-600 text-white shadow-sm shadow-emerald-500/20"
              : "text-slate-600 dark:text-zinc-400 hover:bg-slate-100 dark:hover:bg-zinc-900"
          }`}
        >
          <Calendar className="w-4 h-4" />
          6. Reservas & Capacidad Ecológica
        </button>
      </nav>

      {/* GRID DE CONTENIDO PRINCIPAL */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* PANEL IZQUIERDO: FORMULARIOS ACTIVOS SEGÚN TAB (7 COLS) */}
        <section className="lg:col-span-7 space-y-6">
          {/* TAB 1: REGISTRO */}
          {activeTab === "register" && (
            <div className="p-6 rounded-2xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-sm space-y-5">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    <User className="w-5 h-5 text-emerald-600" />
                    Registro de Usuarios & Proveedores
                  </h2>
                  <p className="text-xs text-slate-500 dark:text-zinc-400">
                    Inserta un nuevo registro transaccional en la entidad unificada User.
                  </p>
                </div>

                <div className="flex items-center gap-1 p-1 rounded-lg bg-slate-100 dark:bg-zinc-800 text-xs font-medium">
                  <button
                    type="button"
                    onClick={() => setRegMethod("api")}
                    className={`px-2.5 py-1 rounded-md transition-all ${
                      regMethod === "api"
                        ? "bg-white dark:bg-zinc-700 text-emerald-600 dark:text-emerald-400 shadow-xs font-semibold"
                        : "text-slate-600 dark:text-zinc-400"
                    }`}
                  >
                    API Route
                  </button>
                  <button
                    type="button"
                    onClick={() => setRegMethod("serverAction")}
                    className={`px-2.5 py-1 rounded-md transition-all ${
                      regMethod === "serverAction"
                        ? "bg-white dark:bg-zinc-700 text-emerald-600 dark:text-emerald-400 shadow-xs font-semibold"
                        : "text-slate-600 dark:text-zinc-400"
                    }`}
                  >
                    Server Action
                  </button>
                </div>
              </div>

              <form onSubmit={handleRegisterSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-zinc-300 mb-1">
                      Nombre Completo
                    </label>
                    <input
                      type="text"
                      required
                      value={regForm.name}
                      onChange={(e) => setRegForm({ ...regForm, name: e.target.value })}
                      className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 dark:border-zinc-700 bg-transparent text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-zinc-300 mb-1">
                      Correo Electrónico
                    </label>
                    <input
                      type="email"
                      required
                      value={regForm.email}
                      onChange={(e) => setRegForm({ ...regForm, email: e.target.value })}
                      className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 dark:border-zinc-700 bg-transparent text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-zinc-300 mb-1">
                      Contraseña (mín 6 caracteres)
                    </label>
                    <input
                      type="password"
                      required
                      value={regForm.password}
                      onChange={(e) => setRegForm({ ...regForm, password: e.target.value })}
                      className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 dark:border-zinc-700 bg-transparent text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-zinc-300 mb-1">
                      Rol de Usuario
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        type="button"
                        onClick={() => setRegForm({ ...regForm, rol: "TURISTA" })}
                        className={`flex items-center justify-center gap-1.5 py-2 px-3 text-xs font-semibold rounded-lg border transition-all ${
                          regForm.rol === "TURISTA"
                            ? "border-emerald-500 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300"
                            : "border-slate-200 dark:border-zinc-700 text-slate-600 dark:text-zinc-400 hover:bg-slate-50 dark:hover:bg-zinc-800"
                        }`}
                      >
                        <User className="w-3.5 h-3.5" />
                        TURISTA
                      </button>
                      <button
                        type="button"
                        onClick={() => setRegForm({ ...regForm, rol: "PROVEEDOR" })}
                        className={`flex items-center justify-center gap-1.5 py-2 px-3 text-xs font-semibold rounded-lg border transition-all ${
                          regForm.rol === "PROVEEDOR"
                            ? "border-emerald-500 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300"
                            : "border-slate-200 dark:border-zinc-700 text-slate-600 dark:text-zinc-400 hover:bg-slate-50 dark:hover:bg-zinc-800"
                        }`}
                      >
                        <Store className="w-3.5 h-3.5" />
                        PROVEEDOR
                      </button>
                    </div>
                  </div>
                </div>

                {regForm.rol === "PROVEEDOR" && (
                  <div className="p-4 rounded-xl border border-emerald-200 dark:border-emerald-900/60 bg-emerald-50/50 dark:bg-emerald-950/20 space-y-3">
                    <div className="flex items-center gap-2 text-xs font-bold text-emerald-800 dark:text-emerald-300">
                      <Store className="w-4 h-4" />
                      Datos del Negocio Proveedor
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div>
                        <label className="block text-[11px] font-semibold text-slate-700 dark:text-zinc-300 mb-1">
                          Nombre del Negocio
                        </label>
                        <input
                          type="text"
                          required
                          value={regForm.nombreNegocio}
                          onChange={(e) =>
                            setRegForm({ ...regForm, nombreNegocio: e.target.value })
                          }
                          className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-slate-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-slate-900 dark:text-white"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] font-semibold text-slate-700 dark:text-zinc-300 mb-1">
                          Categoría
                        </label>
                        <input
                          type="text"
                          value={regForm.categoria}
                          onChange={(e) =>
                            setRegForm({ ...regForm, categoria: e.target.value })
                          }
                          className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-slate-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-slate-900 dark:text-white"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] font-semibold text-slate-700 dark:text-zinc-300 mb-1">
                          Alcaldía CDMX
                        </label>
                        <select
                          value={regForm.alcaldiaCDMX}
                          onChange={(e) =>
                            setRegForm({ ...regForm, alcaldiaCDMX: e.target.value })
                          }
                          className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-slate-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-slate-900 dark:text-white"
                        >
                          {CDMX_ALCALDIAS.map((alc) => (
                            <option key={alc} value={alc}>
                              {alc}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </div>
                )}

                <div className="space-y-3 pt-2">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-zinc-300 mb-1.5">
                      Intereses Sustentables
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {AVAILABLE_INTERESTS.map((interest) => {
                        const isSelected = selectedIntereses.includes(interest);
                        return (
                          <button
                            key={interest}
                            type="button"
                            onClick={() => toggleInterest(interest)}
                            className={`px-3 py-1 rounded-full text-xs font-medium transition-all ${
                              isSelected
                                ? "bg-emerald-600 text-white shadow-xs"
                                : "bg-slate-100 dark:bg-zinc-800 text-slate-600 dark:text-zinc-400 hover:bg-slate-200 dark:hover:bg-zinc-700"
                            }`}
                          >
                            {isSelected ? "✓ " : "+ "}
                            {interest}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-zinc-300 mb-1.5">
                      Estilo de Viaje
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {AVAILABLE_TRAVEL_STYLES.map((style) => {
                        const isSelected = selectedEstilos.includes(style);
                        return (
                          <button
                            key={style}
                            type="button"
                            onClick={() => toggleTravelStyle(style)}
                            className={`px-3 py-1 rounded-full text-xs font-medium transition-all ${
                              isSelected
                                ? "bg-teal-600 text-white shadow-xs"
                                : "bg-slate-100 dark:bg-zinc-800 text-slate-600 dark:text-zinc-400 hover:bg-slate-200 dark:hover:bg-zinc-700"
                            }`}
                          >
                            {isSelected ? "✓ " : "+ "}
                            {style}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={regLoading}
                  className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-sm transition-all disabled:opacity-50 shadow-md shadow-emerald-600/20"
                >
                  {regLoading ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      Enviando registro...
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      Ejecutar Registro ({regMethod === "api" ? "POST /api/auth/register" : "Server Action"})
                    </>
                  )}
                </button>
              </form>
            </div>
          )}

          {/* TAB 2: AUTH & LOGIN */}
          {activeTab === "auth" && (
            <div className="p-6 rounded-2xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-sm space-y-6">
              <div>
                <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <Key className="w-5 h-5 text-emerald-600" />
                  Prueba de Login & NextAuth v5
                </h2>
                <p className="text-xs text-slate-500 dark:text-zinc-400">
                  Prueba el inicio de sesión con credentials contra Prisma y observa la inyección de claims en el token JWT.
                </p>
              </div>

              <div className="space-y-2">
                <span className="text-xs font-semibold text-slate-600 dark:text-zinc-400">
                  Usuarios de Prueba (Seed):
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => fillCredentials("admin@test.com", "admin123")}
                    className="flex flex-col items-start p-2.5 rounded-xl border border-slate-200 dark:border-zinc-800 bg-slate-50 dark:bg-zinc-800/60 hover:border-emerald-500 transition-all text-left"
                  >
                    <span className="text-xs font-bold text-slate-800 dark:text-zinc-200 flex items-center gap-1">
                      <Shield className="w-3.5 h-3.5 text-purple-500" /> Admin
                    </span>
                    <span className="text-[10px] text-slate-500 dark:text-zinc-400 truncate w-full">
                      admin@test.com
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={() => fillCredentials("negocio@test.com", "admin123")}
                    className="flex flex-col items-start p-2.5 rounded-xl border border-slate-200 dark:border-zinc-800 bg-slate-50 dark:bg-zinc-800/60 hover:border-emerald-500 transition-all text-left"
                  >
                    <span className="text-xs font-bold text-slate-800 dark:text-zinc-200 flex items-center gap-1">
                      <Store className="w-3.5 h-3.5 text-blue-500" /> Proveedor
                    </span>
                    <span className="text-[10px] text-slate-500 dark:text-zinc-400 truncate w-full">
                      negocio@test.com
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={() => fillCredentials("turista@test.com", "admin123")}
                    className="flex flex-col items-start p-2.5 rounded-xl border border-slate-200 dark:border-zinc-800 bg-slate-50 dark:bg-zinc-800/60 hover:border-emerald-500 transition-all text-left"
                  >
                    <span className="text-xs font-bold text-slate-800 dark:text-zinc-200 flex items-center gap-1">
                      <User className="w-3.5 h-3.5 text-emerald-500" /> Turista
                    </span>
                    <span className="text-[10px] text-slate-500 dark:text-zinc-400 truncate w-full">
                      turista@test.com
                    </span>
                  </button>
                </div>
              </div>

              <form onSubmit={handleLoginSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-zinc-300 mb-1">
                    Correo Electrónico
                  </label>
                  <input
                    type="email"
                    required
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 dark:border-zinc-700 bg-transparent text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-zinc-300 mb-1">
                    Contraseña
                  </label>
                  <input
                    type="password"
                    required
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 dark:border-zinc-700 bg-transparent text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div className="flex gap-3">
                  <button
                    type="submit"
                    disabled={loginLoading}
                    className="flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-sm transition-all disabled:opacity-50 shadow-md shadow-emerald-600/20"
                  >
                    {loginLoading ? (
                      <>
                        <RefreshCw className="w-4 h-4 animate-spin" />
                        Autenticando...
                      </>
                    ) : (
                      <>
                        <LogIn className="w-4 h-4" />
                        Iniciar Sesión (NextAuth Credentials)
                      </>
                    )}
                  </button>

                  {status === "authenticated" && (
                    <button
                      type="button"
                      onClick={handleSignOut}
                      className="flex items-center gap-1.5 py-2.5 px-4 rounded-xl border border-red-300 dark:border-red-900 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/40 text-sm font-semibold transition-all"
                    >
                      <LogOut className="w-4 h-4" />
                      Cerrar Sesión
                    </button>
                  )}
                </div>

                {loginResult?.error && (
                  <div className="p-3 rounded-xl border border-red-200 dark:border-red-900/60 bg-red-50 dark:bg-red-950/30 text-red-700 dark:text-red-300 text-xs flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 shrink-0 text-red-500" />
                    <span>Error al iniciar sesión: <strong>{loginResult.error}</strong>. Verifica el correo y la contraseña.</span>
                  </div>
                )}

                {status === "authenticated" && (
                  <div className="p-3 rounded-xl border border-emerald-200 dark:border-emerald-900/60 bg-emerald-50 dark:bg-emerald-950/30 text-emerald-800 dark:text-emerald-200 text-xs flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
                      <span>Sesión iniciada correctamente como <strong>{session?.user?.email}</strong>.</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => setActiveTab("profile")}
                      className="px-2.5 py-1 rounded-md bg-emerald-600 text-white font-semibold hover:bg-emerald-700 transition-colors"
                    >
                      Ir a Pestaña 3 →
                    </button>
                  </div>
                )}
              </form>
            </div>
          )}

          {/* TAB 3: PERFIL & PREFERENCIAS */}
          {activeTab === "profile" && (
            <div className="p-6 rounded-2xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-sm space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    <Sliders className="w-5 h-5 text-emerald-600" />
                    Perfil & Preferencias Reactivas
                  </h2>
                  <p className="text-xs text-slate-500 dark:text-zinc-400">
                    Consulta y persiste dinámicamente el tema (claro/oscuro) e idioma sin recargar la página.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={fetchProfile}
                  disabled={profileLoading}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-zinc-700 hover:bg-slate-100 dark:hover:bg-zinc-800 text-xs font-semibold text-slate-700 dark:text-zinc-300 transition-all"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${profileLoading ? "animate-spin" : ""}`} />
                  Consultar GET /api/user/profile
                </button>
              </div>

              {status !== "authenticated" ? (
                <div className="p-4 rounded-xl border border-amber-200 dark:border-amber-900/60 bg-amber-50 dark:bg-amber-950/20 text-amber-800 dark:text-amber-300 text-xs flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 shrink-0" />
                  Debes iniciar sesión en la pestaña 2 para poder consultar y actualizar el perfil autenticado.
                </div>
              ) : (
                <form onSubmit={handleUpdatePreferences} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 dark:text-zinc-300 mb-1.5">
                        Preferencia de Tema Persistida
                      </label>
                      <div className="grid grid-cols-3 gap-2">
                        {(["LIGHT", "DARK", "SYSTEM"] as const).map((t) => (
                          <button
                            key={t}
                            type="button"
                            onClick={() => setEditTheme(t)}
                            className={`py-2 px-2 text-xs font-semibold rounded-lg border transition-all text-center ${
                              editTheme === t
                                ? "border-emerald-500 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300"
                                : "border-slate-200 dark:border-zinc-700 text-slate-600 dark:text-zinc-400 hover:bg-slate-50 dark:hover:bg-zinc-800"
                            }`}
                          >
                            {t}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 dark:text-zinc-300 mb-1.5">
                        Idioma de la Plataforma
                      </label>
                      <div className="grid grid-cols-2 gap-2">
                        {[
                          { code: "es", label: "Español (es)" },
                          { code: "en", label: "English (en)" },
                        ].map((lang) => (
                          <button
                            key={lang.code}
                            type="button"
                            onClick={() => setEditIdioma(lang.code)}
                            className={`py-2 px-2 text-xs font-semibold rounded-lg border transition-all text-center ${
                              editIdioma === lang.code
                                ? "border-emerald-500 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300"
                                : "border-slate-200 dark:border-zinc-700 text-slate-600 dark:text-zinc-400 hover:bg-slate-50 dark:hover:bg-zinc-800"
                            }`}
                          >
                            {lang.label}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={patchLoading}
                    className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-sm transition-all disabled:opacity-50 shadow-md shadow-emerald-600/20"
                  >
                    {patchLoading ? (
                      <>
                        <RefreshCw className="w-4 h-4 animate-spin" />
                        Persistiendo y actualizando sesión...
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-4 h-4" />
                        Guardar Preferencias (PATCH /api/user/profile + session.update())
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>
          )}

          {/* TAB 4: AUDITORÍAS & SUSTENTABILIDAD */}
          {activeTab === "sustainability" && (
            <div className="space-y-6">
              {/* ACCESO RÁPIDO PARA CAMBIO DE ROL */}
              <div className="p-4 rounded-2xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div className="flex items-center gap-2 text-xs">
                  <ArrowRightLeft className="w-4 h-4 text-emerald-600" />
                  <span className="font-semibold text-slate-700 dark:text-zinc-300">
                    Cambio rápido de rol para pruebas:
                  </span>
                </div>
                <div className="flex items-center gap-2 w-full sm:w-auto">
                  <button
                    type="button"
                    onClick={() => executeLogin("negocio@test.com", "admin123")}
                    className={`flex-1 sm:flex-initial px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all flex items-center justify-center gap-1.5 ${
                      session?.user?.rol === "PROVEEDOR"
                        ? "bg-blue-600 text-white border-blue-600 shadow-xs"
                        : "border-slate-200 dark:border-zinc-700 text-slate-700 dark:text-zinc-300 hover:bg-slate-50 dark:hover:bg-zinc-800"
                    }`}
                  >
                    <Store className="w-3.5 h-3.5" />
                    Rol Proveedor
                  </button>
                  <button
                    type="button"
                    onClick={() => executeLogin("admin@test.com", "admin123")}
                    className={`flex-1 sm:flex-initial px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all flex items-center justify-center gap-1.5 ${
                      session?.user?.rol === "ADMINISTRADOR"
                        ? "bg-purple-600 text-white border-purple-600 shadow-xs"
                        : "border-slate-200 dark:border-zinc-700 text-slate-700 dark:text-zinc-300 hover:bg-slate-50 dark:hover:bg-zinc-800"
                    }`}
                  >
                    <Shield className="w-3.5 h-3.5" />
                    Rol Admin
                  </button>
                </div>
              </div>

              {/* SECCIÓN 1: VISTA PROVEEDOR (CARGA Y LISTADO) */}
              <div className="p-6 rounded-2xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-sm space-y-5">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                      <UploadCloud className="w-5 h-5 text-blue-600" />
                      1. Subir Documentación Ecológica (Proveedor)
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-zinc-400">
                      Endpoint: <code>POST /api/proveedor/documentos</code>
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={fetchMisDocumentos}
                    disabled={loadingMisDocs || session?.user?.rol !== "PROVEEDOR"}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-zinc-700 hover:bg-slate-100 dark:hover:bg-zinc-800 text-xs font-semibold text-slate-700 dark:text-zinc-300 transition-all disabled:opacity-40"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 ${loadingMisDocs ? "animate-spin" : ""}`} />
                    Mis Documentos (GET)
                  </button>
                </div>

                {session?.user?.rol !== "PROVEEDOR" ? (
                  <div className="p-3.5 rounded-xl border border-blue-200 dark:border-blue-900/60 bg-blue-50 dark:bg-blue-950/20 text-blue-800 dark:text-blue-300 text-xs flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 shrink-0 text-blue-500" />
                    <span>Inicia sesión como <strong>Proveedor (negocio@test.com)</strong> para probar la subida y consulta de tus evidencias.</span>
                  </div>
                ) : (
                  <form onSubmit={handleSubirEvidencia} className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-semibold text-slate-700 dark:text-zinc-300 mb-1">
                          Tipo de Evidencia Ecológica
                        </label>
                        <select
                          value={docForm.tipo}
                          onChange={(e) => setDocForm({ ...docForm, tipo: e.target.value as any })}
                          className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 dark:border-zinc-700 bg-transparent text-slate-900 dark:text-white"
                        >
                          {TIPOS_DOCUMENTO.map((t) => (
                            <option key={t.value} value={t.value}>
                              {t.label}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-slate-700 dark:text-zinc-300 mb-1">
                          Título del Documento
                        </label>
                        <input
                          type="text"
                          required
                          value={docForm.titulo}
                          onChange={(e) => setDocForm({ ...docForm, titulo: e.target.value })}
                          className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 dark:border-zinc-700 bg-transparent text-slate-900 dark:text-white"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 dark:text-zinc-300 mb-1">
                        URL / Path del Archivo Digital
                      </label>
                      <input
                        type="text"
                        required
                        value={docForm.archivoUrl}
                        onChange={(e) => setDocForm({ ...docForm, archivoUrl: e.target.value })}
                        className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 dark:border-zinc-700 bg-transparent text-slate-900 dark:text-white"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 dark:text-zinc-300 mb-1">
                        Descripción Breve (opcional)
                      </label>
                      <textarea
                        rows={2}
                        value={docForm.descripcion}
                        onChange={(e) => setDocForm({ ...docForm, descripcion: e.target.value })}
                        className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 dark:border-zinc-700 bg-transparent text-slate-900 dark:text-white"
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={docLoading}
                      className="w-full flex items-center justify-center gap-2 py-2 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs transition-all disabled:opacity-50 shadow-md shadow-blue-600/20"
                    >
                      {docLoading ? (
                        <>
                          <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                          Subiendo evidencia...
                        </>
                      ) : (
                        <>
                          <UploadCloud className="w-3.5 h-3.5" />
                          Subir Evidencia (POST /api/proveedor/documentos)
                        </>
                      )}
                    </button>
                  </form>
                )}

                {/* LISTADO DE MIS DOCUMENTOS */}
                {misDocs.length > 0 && (
                  <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-zinc-800">
                    <h4 className="text-xs font-bold text-slate-800 dark:text-zinc-200 flex items-center gap-1.5">
                      <FileText className="w-3.5 h-3.5 text-blue-500" />
                      Evidencias Registradas de este Proveedor ({misDocs.length})
                    </h4>
                    <div className="space-y-2">
                      {misDocs.map((doc) => (
                        <div
                          key={doc.id}
                          className="p-3 rounded-xl border border-slate-200 dark:border-zinc-800 bg-slate-50 dark:bg-zinc-800/40 text-xs space-y-1.5"
                        >
                          <div className="flex items-center justify-between">
                            <span className="font-bold text-slate-800 dark:text-zinc-200">
                              {doc.titulo}
                            </span>
                            <span
                              className={`px-2 py-0.5 rounded font-bold text-[10px] ${
                                doc.estado === "APROBADO"
                                  ? "bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300"
                                  : doc.estado === "RECHAZADO"
                                  ? "bg-red-100 dark:bg-red-950 text-red-700 dark:text-red-300"
                                  : "bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300"
                              }`}
                            >
                              {doc.estado}
                            </span>
                          </div>
                          <div className="text-[11px] text-slate-500 dark:text-zinc-400 flex items-center gap-3">
                            <span>Tipo: <strong>{doc.tipo}</strong></span>
                            <span>ID: <code className="font-mono">{doc.id}</code></span>
                          </div>
                          {doc.retroalimentacionAdmin && (
                            <div className="p-2 rounded bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900 text-amber-800 dark:text-amber-300 text-[11px]">
                              <strong>Retroalimentación Admin:</strong> {doc.retroalimentacionAdmin}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* SECCIÓN 2: VISTA ADMIN (AUDITORÍAS Y DICTAMEN) */}
              <div className="p-6 rounded-2xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-sm space-y-5">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                  <div>
                    <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                      <Shield className="w-5 h-5 text-purple-600" />
                      2. Auditorías & Dictamen de Evidencias (Admin)
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-zinc-400">
                      Endpoints: <code>GET /api/admin/auditorias</code> y <code>PATCH /api/admin/auditorias</code>
                    </p>
                  </div>

                  <div className="flex items-center gap-2 w-full sm:w-auto">
                    <select
                      value={filtroEstado}
                      onChange={(e) => setFiltroEstado(e.target.value)}
                      className="px-2.5 py-1.5 text-xs rounded-lg border border-slate-300 dark:border-zinc-700 bg-transparent text-slate-900 dark:text-white"
                    >
                      <option value="TODOS">Todos los Estados</option>
                      <option value="PENDIENTE">PENDIENTE</option>
                      <option value="APROBADO">APROBADO</option>
                      <option value="RECHAZADO">RECHAZADO</option>
                    </select>

                    <button
                      type="button"
                      onClick={fetchAuditorias}
                      disabled={loadingAuditorias || session?.user?.rol !== "ADMINISTRADOR"}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-purple-600 hover:bg-purple-700 text-white text-xs font-semibold transition-all disabled:opacity-40 whitespace-nowrap shadow-xs"
                    >
                      <RefreshCw className={`w-3.5 h-3.5 ${loadingAuditorias ? "animate-spin" : ""}`} />
                      Listar Auditorías
                    </button>
                  </div>
                </div>

                {session?.user?.rol !== "ADMINISTRADOR" ? (
                  <div className="p-3.5 rounded-xl border border-purple-200 dark:border-purple-900/60 bg-purple-50 dark:bg-purple-950/20 text-purple-800 dark:text-purple-300 text-xs flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 shrink-0 text-purple-500" />
                    <span>Inicia sesión como <strong>Administrador (admin@test.com)</strong> para revisar y dictaminar los documentos ecológicos.</span>
                  </div>
                ) : auditorias.length === 0 ? (
                  <p className="text-xs text-slate-500 dark:text-zinc-400 italic">
                    Haz clic en &quot;Listar Auditorías&quot; para consultar los proveedores y sus expedientes.
                  </p>
                ) : (
                  <div className="space-y-4">
                    {auditorias.map((prov) => (
                      <div
                        key={prov.id}
                        className="p-4 rounded-xl border border-slate-200 dark:border-zinc-800 bg-slate-50 dark:bg-zinc-800/30 space-y-3"
                      >
                        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 border-b border-slate-200 dark:border-zinc-800 pb-2">
                          <div>
                            <span className="font-bold text-sm text-slate-900 dark:text-white">
                              {prov.nombreNegocio || "Negocio sin nombre"}
                            </span>
                            <span className="ml-2 text-xs text-slate-500 dark:text-zinc-400">
                              ({prov.alcaldiaCDMX || "CDMX"} · {prov.categoria || "General"})
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-[11px] text-slate-500 dark:text-zinc-400">Estado Proveedor:</span>
                            <span
                              className={`px-2 py-0.5 rounded font-extrabold text-[10px] ${
                                prov.estadoValidacion === "APROBADO"
                                  ? "bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300"
                                  : prov.estadoValidacion === "RECHAZADO"
                                  ? "bg-red-100 dark:bg-red-950 text-red-700 dark:text-red-300"
                                  : "bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300"
                              }`}
                            >
                              {prov.estadoValidacion}
                            </span>
                          </div>
                        </div>

                        {/* LISTADO DE DOCUMENTOS DEL EXPEDIENTE */}
                        <div className="space-y-3">
                          {prov.documentos?.length === 0 ? (
                            <p className="text-xs text-slate-400 italic">Este proveedor aún no ha subido documentos.</p>
                          ) : (
                            prov.documentos.map((doc: any) => (
                              <div
                                key={doc.id}
                                className="p-3 rounded-lg border border-slate-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-xs space-y-2"
                              >
                                <div className="flex items-center justify-between">
                                  <div className="flex items-center gap-2">
                                    <FileText className="w-4 h-4 text-purple-600 shrink-0" />
                                    <span className="font-bold text-slate-800 dark:text-zinc-200">
                                      {doc.titulo}
                                    </span>
                                  </div>
                                  <span
                                    className={`px-2 py-0.5 rounded font-bold text-[10px] ${
                                      doc.estado === "APROBADO"
                                        ? "bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300"
                                        : doc.estado === "RECHAZADO"
                                        ? "bg-red-100 dark:bg-red-950 text-red-700 dark:text-red-300"
                                        : "bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300"
                                    }`}
                                  >
                                    {doc.estado}
                                  </span>
                                </div>

                                <div className="text-[11px] text-slate-500 dark:text-zinc-400 space-y-0.5">
                                  <p>Tipo: <strong className="text-slate-700 dark:text-zinc-300">{doc.tipo}</strong></p>
                                  <p>Archivo: <a href={doc.archivoUrl} target="_blank" rel="noreferrer" className="text-blue-600 dark:text-blue-400 underline truncate">{doc.archivoUrl}</a></p>
                                  {doc.descripcion && <p className="italic">{doc.descripcion}</p>}
                                </div>

                                {/* FORMULARIO DE DICTAMEN */}
                                <div className="pt-2 border-t border-slate-100 dark:border-zinc-800 flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                                  <input
                                    type="text"
                                    placeholder="Comentarios / Retroalimentación (obligatorio si rechazas)..."
                                    value={feedbackMap[doc.id] || ""}
                                    onChange={(e) =>
                                      setFeedbackMap({
                                        ...feedbackMap,
                                        [doc.id]: e.target.value,
                                      })
                                    }
                                    className="flex-1 px-2.5 py-1.5 text-xs rounded-lg border border-slate-300 dark:border-zinc-700 bg-transparent text-slate-900 dark:text-white"
                                  />

                                  <div className="flex gap-2">
                                    <button
                                      type="button"
                                      disabled={dictamenLoading === doc.id}
                                      onClick={() => handleDictamen(doc.id, "APROBADO")}
                                      className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs transition-all disabled:opacity-50 shadow-xs"
                                    >
                                      <CheckCircle className="w-3.5 h-3.5" />
                                      Aprobar
                                    </button>

                                    <button
                                      type="button"
                                      disabled={dictamenLoading === doc.id}
                                      onClick={() => handleDictamen(doc.id, "RECHAZADO")}
                                      className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-red-600 hover:bg-red-700 text-white font-semibold text-xs transition-all disabled:opacity-50 shadow-xs"
                                    >
                                      <XCircle className="w-3.5 h-3.5" />
                                      Rechazar
                                    </button>
                                  </div>
                                </div>
                              </div>
                            ))
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 5: CATÁLOGO & EXPERIENCIAS CDMX */}
          {activeTab === "catalog" && (
            <div className="space-y-6">
              {/* SECCIÓN 1: FORMULARIO DE ALTA DE EXPERIENCIA (POST /api/experiencias) */}
              <div className="p-6 rounded-2xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-sm space-y-5">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100 dark:border-zinc-800">
                  <div>
                    <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                      <Trees className="w-5 h-5 text-emerald-600" />
                      Publicar Experiencia Sustentable
                    </h2>
                    <p className="text-xs text-slate-500 dark:text-zinc-400">
                      Endpoint: <code className="font-mono text-emerald-600 dark:text-emerald-400">POST /api/experiencias</code> (Requiere rol PROVEEDOR con estado APROBADO)
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <span
                      className={`text-xs px-2.5 py-1 rounded-full font-semibold border ${
                        session?.user?.rol === "PROVEEDOR"
                          ? "bg-emerald-50 border-emerald-300 text-emerald-700 dark:bg-emerald-950/40 dark:border-emerald-800 dark:text-emerald-300"
                          : "bg-amber-50 border-amber-300 text-amber-700 dark:bg-amber-950/40 dark:border-amber-800 dark:text-amber-300"
                      }`}
                    >
                      {status === "authenticated"
                        ? `Sesión: ${session?.user?.rol}`
                        : "Sin sesión activa"}
                    </span>
                  </div>
                </div>

                {/* BANNER INFORMATIVO / REGLA DE NEGOCIO */}
                <div className="p-3.5 rounded-xl border border-blue-200 dark:border-blue-900/60 bg-blue-50/70 dark:bg-blue-950/30 text-blue-800 dark:text-blue-300 text-xs space-y-1">
                  <div className="flex items-center gap-1.5 font-bold">
                    <Shield className="w-4 h-4 text-blue-600 shrink-0" />
                    <span>Regla de Negocio Crítica (RF4, RNF2):</span>
                  </div>
                  <p className="text-[11px] leading-relaxed text-blue-700 dark:text-blue-400">
                    Solo los proveedores cuyo dictamen ecológico esté en estado <strong>APROBADO</strong> pueden dar de alta experiencias. Si un proveedor con estado <strong>PENDIENTE</strong>, <strong>RECHAZADO</strong> o un usuario <strong>TURISTA</strong> intenta publicar, el backend rechaza con <strong>HTTP 403 Forbidden</strong>.
                  </p>
                </div>

                <form onSubmit={handleCrearExperiencia} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="sm:col-span-2">
                      <label className="block text-xs font-semibold text-slate-700 dark:text-zinc-300 mb-1">
                        Título de la Experiencia (mín. 5 car.)
                      </label>
                      <input
                        type="text"
                        required
                        value={expForm.titulo}
                        onChange={(e) => setExpForm({ ...expForm, titulo: e.target.value })}
                        className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 dark:border-zinc-700 bg-transparent text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 dark:text-zinc-300 mb-1">
                        Categoría
                      </label>
                      <select
                        value={expForm.categoria}
                        onChange={(e) => setExpForm({ ...expForm, categoria: e.target.value })}
                        className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      >
                        <option value="Ecoturismo">Ecoturismo</option>
                        <option value="Naturaleza">Naturaleza</option>
                        <option value="Gastronomía">Gastronomía</option>
                        <option value="Cultura">Cultura</option>
                        <option value="Aventura">Aventura</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 dark:text-zinc-300 mb-1">
                        Alcaldía de la CDMX (Estricto 16 alcaldías)
                      </label>
                      <select
                        value={expForm.alcaldiaCDMX}
                        onChange={(e) => setExpForm({ ...expForm, alcaldiaCDMX: e.target.value })}
                        className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      >
                        {CDMX_ALCALDIAS.map((alc) => (
                          <option key={alc} value={alc}>
                            {alc}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 dark:text-zinc-300 mb-1">
                        Precio por Persona ($ MXN)
                      </label>
                      <div className="relative">
                        <span className="absolute left-3 top-2.5 text-xs text-slate-400">$</span>
                        <input
                          type="number"
                          min="0"
                          step="10"
                          required
                          value={expForm.precio}
                          onChange={(e) => setExpForm({ ...expForm, precio: e.target.value })}
                          className="w-full pl-7 pr-3 py-2 text-sm rounded-lg border border-slate-300 dark:border-zinc-700 bg-transparent text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 dark:text-zinc-300 mb-1">
                        Duración Estimada (Minutos)
                      </label>
                      <input
                        type="number"
                        min="15"
                        step="15"
                        required
                        value={expForm.duracionMinutos}
                        onChange={(e) => setExpForm({ ...expForm, duracionMinutos: e.target.value })}
                        className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 dark:border-zinc-700 bg-transparent text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      />
                    </div>

                    <div className="sm:col-span-2">
                      <div className="p-3 rounded-xl border border-emerald-200 dark:border-emerald-900/60 bg-emerald-50/50 dark:bg-emerald-950/20 space-y-2">
                        <div className="flex items-center justify-between">
                          <label className="text-xs font-bold text-emerald-800 dark:text-emerald-300 flex items-center gap-1.5">
                            <Users className="w-4 h-4 text-emerald-600" />
                            Capacidad de Carga Ecológica (Máx. personas por grupo)
                          </label>
                          <span className="text-xs font-bold px-2 py-0.5 rounded bg-emerald-200 dark:bg-emerald-900 text-emerald-800 dark:text-emerald-200">
                            {expForm.capacidadCarga} personas
                          </span>
                        </div>
                        <input
                          type="range"
                          min="1"
                          max="40"
                          value={expForm.capacidadCarga}
                          onChange={(e) => setExpForm({ ...expForm, capacidadCarga: e.target.value })}
                          className="w-full accent-emerald-600 cursor-pointer"
                        />
                        <p className="text-[11px] text-emerald-700 dark:text-emerald-400">
                          Medida anti-sobreturismo: evita el deterioro de los ecosistemas locales y garantiza una experiencia de bajo impacto ambiental.
                        </p>
                      </div>
                    </div>

                    <div className="sm:col-span-2">
                      <label className="block text-xs font-semibold text-slate-700 dark:text-zinc-300 mb-1">
                        Ubicación Detallada (Punto de encuentro)
                      </label>
                      <input
                        type="text"
                        value={expForm.ubicacionDetallada}
                        onChange={(e) => setExpForm({ ...expForm, ubicacionDetallada: e.target.value })}
                        placeholder="Ej. Entrada principal del embarcadero, Calle X #123"
                        className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 dark:border-zinc-700 bg-transparent text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      />
                    </div>

                    <div className="sm:col-span-2">
                      <label className="block text-xs font-semibold text-slate-700 dark:text-zinc-300 mb-1">
                        URL de Imagen Representativa
                      </label>
                      <input
                        type="url"
                        value={expForm.imagenUrl}
                        onChange={(e) => setExpForm({ ...expForm, imagenUrl: e.target.value })}
                        className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 dark:border-zinc-700 bg-transparent text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      />
                    </div>

                    <div className="sm:col-span-2">
                      <label className="block text-xs font-semibold text-slate-700 dark:text-zinc-300 mb-1">
                        Descripción Detallada (mín. 20 car.)
                      </label>
                      <textarea
                        rows={3}
                        required
                        value={expForm.descripcion}
                        onChange={(e) => setExpForm({ ...expForm, descripcion: e.target.value })}
                        className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 dark:border-zinc-700 bg-transparent text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      />
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-2">
                    <button
                      type="submit"
                      disabled={expCreateLoading}
                      className="flex items-center justify-center gap-2 py-2.5 px-6 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-sm transition-all shadow-md shadow-emerald-600/20 disabled:opacity-50"
                    >
                      {expCreateLoading ? (
                        <>
                          <RefreshCw className="w-4 h-4 animate-spin" />
                          Enviando...
                        </>
                      ) : (
                        <>
                          <Send className="w-4 h-4" />
                          Publicar Experiencia Sustentable (POST)
                        </>
                      )}
                    </button>

                    {session?.user?.rol !== "PROVEEDOR" && (
                      <span className="text-[11px] text-amber-600 dark:text-amber-400 font-medium">
                        ⚠️ Al enviar con rol actual se comprobará el bloqueo 403 Forbidden.
                      </span>
                    )}
                  </div>
                </form>

                {/* RESPUESTA VISUAL DE ALTA */}
                {expCreateResponse && (
                  <div
                    className={`p-3.5 rounded-xl border text-xs flex items-start gap-2.5 ${
                      expCreateResponse.status === 201
                        ? "border-emerald-200 dark:border-emerald-900/60 bg-emerald-50 dark:bg-emerald-950/30 text-emerald-800 dark:text-emerald-300"
                        : "border-red-200 dark:border-red-900/60 bg-red-50 dark:bg-red-950/30 text-red-800 dark:text-red-300"
                    }`}
                  >
                    {expCreateResponse.status === 201 ? (
                      <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                    ) : (
                      <AlertTriangle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
                    )}
                    <div className="space-y-1">
                      <p className="font-bold">
                        Respuesta HTTP {expCreateResponse.status}:
                      </p>
                      <p className="font-mono text-[11px]">
                        {expCreateResponse.data?.error ||
                          (expCreateResponse.data?.success &&
                            `Experiencia creada con éxito: "${expCreateResponse.data?.data?.titulo}"`)}
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* SECCIÓN 2: CATÁLOGO GENERAL & FILTROS (GET /api/experiencias) */}
              <div className="p-6 rounded-2xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-sm space-y-5">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100 dark:border-zinc-800">
                  <div>
                    <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                      <Compass className="w-5 h-5 text-emerald-600" />
                      Explorador de Experiencias Sustentables CDMX
                    </h2>
                    <p className="text-xs text-slate-500 dark:text-zinc-400">
                      Endpoint público: <code className="font-mono text-emerald-600 dark:text-emerald-400">GET /api/experiencias</code> (Filtros por Alcaldía, Categoría, Presupuesto y Sobreturismo)
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => fetchExperiencias()}
                    disabled={catalogLoading}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-zinc-700 hover:bg-slate-50 dark:hover:bg-zinc-800 text-xs font-semibold text-slate-700 dark:text-zinc-300 transition-all shadow-xs"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 ${catalogLoading ? "animate-spin" : ""}`} />
                    Refrescar Catálogo
                  </button>
                </div>

                {/* BARRA DE FILTROS INTERACTIVOS */}
                <div className="p-4 rounded-xl border border-slate-200 dark:border-zinc-800 bg-slate-50/70 dark:bg-zinc-800/40 space-y-3">
                  <div className="flex items-center gap-2 text-xs font-bold text-slate-700 dark:text-zinc-300">
                    <Filter className="w-4 h-4 text-emerald-600" />
                    <span>Filtros Dinámicos</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-600 dark:text-zinc-400 mb-1">
                        Alcaldía CDMX
                      </label>
                      <select
                        value={catalogFilters.alcaldia}
                        onChange={(e) =>
                          setCatalogFilters({ ...catalogFilters, alcaldia: e.target.value })
                        }
                        className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-slate-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-slate-900 dark:text-white"
                      >
                        <option value="">Todas las Alcaldías</option>
                        {CDMX_ALCALDIAS.map((alc) => (
                          <option key={alc} value={alc}>
                            {alc}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-[11px] font-semibold text-slate-600 dark:text-zinc-400 mb-1">
                        Categoría
                      </label>
                      <select
                        value={catalogFilters.categoria}
                        onChange={(e) =>
                          setCatalogFilters({ ...catalogFilters, categoria: e.target.value })
                        }
                        className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-slate-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-slate-900 dark:text-white"
                      >
                        <option value="">Todas las Categorías</option>
                        <option value="Ecoturismo">Ecoturismo</option>
                        <option value="Naturaleza">Naturaleza</option>
                        <option value="Gastronomía">Gastronomía</option>
                        <option value="Cultura">Cultura</option>
                        <option value="Aventura">Aventura</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-[11px] font-semibold text-slate-600 dark:text-zinc-400 mb-1">
                        Precio Máximo ($ MXN)
                      </label>
                      <input
                        type="number"
                        placeholder="Ej. 500"
                        value={catalogFilters.precioMax}
                        onChange={(e) =>
                          setCatalogFilters({ ...catalogFilters, precioMax: e.target.value })
                        }
                        className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-slate-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-slate-900 dark:text-white"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-semibold text-slate-600 dark:text-zinc-400 mb-1">
                        Duración Máxima (minutos)
                      </label>
                      <input
                        type="number"
                        placeholder="Ej. 180"
                        value={catalogFilters.duracionMaxMinutos}
                        onChange={(e) =>
                          setCatalogFilters({ ...catalogFilters, duracionMaxMinutos: e.target.value })
                        }
                        className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-slate-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-slate-900 dark:text-white"
                      />
                    </div>

                    <div className="sm:col-span-2">
                      <label className="block text-[11px] font-semibold text-slate-600 dark:text-zinc-400 mb-1">
                        Palabra Clave (Búsqueda en título/descripción)
                      </label>
                      <input
                        type="text"
                        placeholder="Ej. Chinampas, Bosque, Ajolote..."
                        value={catalogFilters.buscar}
                        onChange={(e) =>
                          setCatalogFilters({ ...catalogFilters, buscar: e.target.value })
                        }
                        className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-slate-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-slate-900 dark:text-white"
                      />
                    </div>
                  </div>

                  <div className="flex items-center gap-2 pt-1">
                    <button
                      type="button"
                      onClick={() => fetchExperiencias()}
                      className="px-4 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs transition-all shadow-xs"
                    >
                      Aplicar Filtros
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        const reset = {
                          alcaldia: "",
                          categoria: "",
                          precioMax: "",
                          duracionMaxMinutos: "",
                          buscar: "",
                        };
                        setCatalogFilters(reset);
                        fetchExperiencias(reset);
                      }}
                      className="px-3 py-1.5 rounded-lg border border-slate-300 dark:border-zinc-700 text-slate-600 dark:text-zinc-300 hover:bg-slate-100 dark:hover:bg-zinc-800 text-xs font-medium transition-all"
                    >
                      Limpiar
                    </button>
                  </div>
                </div>

                {/* LISTADO DE EXPERIENCIAS */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between text-xs text-slate-500 dark:text-zinc-400">
                    <span>
                      Mostrando <strong>{experienciasList.length}</strong> experiencias ecológicas verificadas
                    </span>
                  </div>

                  {catalogLoading ? (
                    <div className="p-8 text-center text-xs text-slate-500 dark:text-zinc-400 flex items-center justify-center gap-2">
                      <RefreshCw className="w-4 h-4 animate-spin text-emerald-600" />
                      Cargando experiencias sustentables...
                    </div>
                  ) : experienciasList.length === 0 ? (
                    <div className="p-8 text-center rounded-xl border border-dashed border-slate-300 dark:border-zinc-700 text-xs text-slate-500 dark:text-zinc-400 space-y-2">
                      <Trees className="w-8 h-8 mx-auto text-slate-400" />
                      <p>No se encontraron experiencias con los filtros seleccionados.</p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {experienciasList.map((exp) => (
                        <div
                          key={exp.id}
                          className="flex flex-col justify-between p-4 rounded-xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-800/50 hover:border-emerald-500/50 transition-all shadow-xs space-y-3"
                        >
                          <div className="space-y-2">
                            {/* BADGES */}
                            <div className="flex flex-wrap items-center gap-1.5 text-[10px]">
                              <span className="px-2 py-0.5 rounded-md font-semibold bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300">
                                {exp.categoria}
                              </span>
                              <span className="flex items-center gap-1 px-2 py-0.5 rounded-md font-semibold bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300">
                                <MapPin className="w-3 h-3" />
                                {exp.alcaldiaCDMX}
                              </span>
                              <span className="flex items-center gap-1 px-2 py-0.5 rounded-md font-semibold bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-200">
                                <Users className="w-3 h-3" />
                                Máx {exp.capacidadCarga} pers.
                              </span>
                            </div>

                            <h3 className="font-bold text-sm text-slate-900 dark:text-white leading-snug">
                              {exp.titulo}
                            </h3>

                            <p className="text-xs text-slate-600 dark:text-zinc-300 line-clamp-2">
                              {exp.descripcion}
                            </p>

                            <div className="pt-1 text-[11px] text-slate-500 dark:text-zinc-400 flex items-center gap-1">
                              <Store className="w-3.5 h-3.5 text-emerald-600" />
                              <span>{exp.proveedor?.nombreNegocio || "Proveedor Acreditado"}</span>
                            </div>
                          </div>

                          <div className="pt-3 border-t border-slate-100 dark:border-zinc-700/60 flex items-center justify-between">
                            <div>
                              <span className="text-xs text-slate-400 block text-[10px]">Por persona</span>
                              <span className="text-sm font-extrabold text-emerald-600 dark:text-emerald-400">
                                ${exp.precio} MXN
                              </span>
                              <span className="text-[10px] text-slate-400 ml-1.5">
                                • {exp.duracionMinutos} min
                              </span>
                            </div>

                            <button
                              type="button"
                              onClick={() => fetchExpDetail(exp.id)}
                              disabled={detailLoading}
                              className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-zinc-700 hover:bg-slate-50 dark:hover:bg-zinc-700 text-xs font-semibold text-slate-700 dark:text-zinc-200 transition-all"
                            >
                              <Eye className="w-3.5 h-3.5 text-emerald-600" />
                              Detalle
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* MODAL / PANEL DE DETALLE INDIVIDUAL (GET /api/experiencias/[id]) */}
                  {selectedExpDetail && (
                    <div className="p-4 rounded-xl border border-emerald-300 dark:border-emerald-800 bg-emerald-50/40 dark:bg-emerald-950/20 space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                          <h4 className="font-bold text-xs text-emerald-900 dark:text-emerald-200">
                            Detalle Completo (GET /api/experiencias/{selectedExpDetail.id})
                          </h4>
                        </div>
                        <button
                          type="button"
                          onClick={() => setSelectedExpDetail(null)}
                          className="text-xs text-slate-400 hover:text-slate-600 dark:hover:text-zinc-200 font-bold"
                        >
                          ✕ Cerrar
                        </button>
                      </div>

                      <div className="text-xs space-y-2 text-slate-700 dark:text-zinc-300">
                        <p>
                          <strong>Ubicación Detallada:</strong> {selectedExpDetail.ubicacionDetallada || "No especificada"}
                        </p>
                        <p>
                          <strong>Proveedor:</strong> {selectedExpDetail.proveedor?.nombreNegocio} (Estado ecológico:{" "}
                          <span className="font-bold text-emerald-600">
                            {selectedExpDetail.proveedor?.estadoValidacion}
                          </span>)
                        </p>
                        <p>
                          <strong>Contacto:</strong> {selectedExpDetail.proveedor?.user?.email}
                        </p>
                        <p className="text-[11px] text-slate-500 italic">
                          "{selectedExpDetail.proveedor?.descripcionBreve}"
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* TAB 6: RESERVAS, CAPACIDAD ECOLÓGICA Y FAVORITOS */}
          {activeTab === "reservas" && (
            <div className="space-y-6">
              {/* BANNER INTRODUCTORIO Y SESIÓN */}
              <div className="p-5 rounded-2xl border border-emerald-200 dark:border-emerald-900/40 bg-emerald-50/50 dark:bg-emerald-950/20 space-y-2">
                <div className="flex items-center gap-2 text-emerald-800 dark:text-emerald-300 font-bold text-base">
                  <Trees className="w-5 h-5 text-emerald-600" />
                  Módulo Transaccional: Reservas y Capacidad de Carga Ecológica
                </div>
                <p className="text-xs text-slate-600 dark:text-zinc-300 leading-relaxed">
                  Implementación de los requerimientos <strong>RF3, RF7 y RF8</strong> (Procesos 7, 8 y 9).
                  Garantiza mediante transacciones atómicas que el número de visitantes no sature los ecosistemas protegidos de la CDMX (humedales de Xochimilco, bosques de Tlalpan, etc.).
                </p>
                {status !== "authenticated" && (
                  <div className="mt-3 p-3 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 flex items-center justify-between text-xs text-amber-800 dark:text-amber-300">
                    <span className="flex items-center gap-2">
                      <AlertTriangle className="w-4 h-4 text-amber-600" />
                      Debes iniciar sesión para reservar o gestionar tu itinerario de favoritos.
                    </span>
                    <button
                      type="button"
                      onClick={() => setActiveTab("auth")}
                      className="px-2.5 py-1 rounded-lg bg-amber-600 text-white font-bold hover:bg-amber-700 transition"
                    >
                      Ir a Login
                    </button>
                  </div>
                )}
              </div>

              {/* CARD 1: FORMULARIO DE RESERVA CON CONTROL DE CAPACIDAD */}
              <div className="p-6 rounded-2xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-sm space-y-6">
                <div className="flex items-center justify-between border-b border-slate-100 dark:border-zinc-800 pb-3">
                  <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    <Calendar className="w-5 h-5 text-emerald-600" />
                    Reservar Experiencia Sustentable
                  </h2>
                  <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 font-bold">
                    POST /api/reservas
                  </span>
                </div>

                <form onSubmit={handleCreateReserva} className="space-y-4">
                  {/* Selector de Experiencia */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700 dark:text-zinc-300 flex items-center justify-between">
                      <span>Seleccionar Experiencia del Catálogo:</span>
                      <span className="text-[10px] text-slate-400 font-normal">
                        ({experienciasList.length} experiencias disponibles)
                      </span>
                    </label>
                    <select
                      value={reservaForm.experienciaId}
                      onChange={(e) =>
                        setReservaForm({ ...reservaForm, experienciaId: e.target.value })
                      }
                      className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-zinc-700 bg-slate-50 dark:bg-zinc-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    >
                      {experienciasList.map((exp) => (
                        <option key={exp.id} value={exp.id}>
                          {exp.titulo} — {exp.alcaldiaCDMX} (${Number(exp.precio).toFixed(2)} MXN | Capacidad: {exp.capacidadCarga} pax)
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Badge informativo de la experiencia seleccionada */}
                  {(() => {
                    const selected = experienciasList.find(
                      (e) => e.id === (reservaForm.experienciaId || experienciasList[0]?.id)
                    );
                    if (!selected) return null;
                    return (
                      <div className="p-3 rounded-xl bg-slate-50 dark:bg-zinc-800/60 border border-slate-200/80 dark:border-zinc-700/60 flex flex-wrap items-center justify-between gap-2 text-xs">
                        <div className="flex items-center gap-2">
                          <MapPin className="w-3.5 h-3.5 text-emerald-600" />
                          <span className="font-semibold text-slate-800 dark:text-zinc-200">
                            {selected.alcaldiaCDMX}
                          </span>
                          <span className="text-slate-400">•</span>
                          <span className="text-slate-600 dark:text-zinc-400">
                            {selected.categoria}
                          </span>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="px-2 py-0.5 rounded bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 font-bold text-[11px]">
                            Límite Ecológico: {selected.capacidadCarga} personas/día
                          </span>
                          <span className="font-bold text-slate-900 dark:text-white">
                            ${Number(selected.precio).toFixed(2)} MXN / pax
                          </span>
                        </div>
                      </div>
                    );
                  })()}

                  {/* Fecha y Número de Personas */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-700 dark:text-zinc-300">
                        Fecha de la Actividad:
                      </label>
                      <input
                        type="date"
                        min={new Date().toISOString().split("T")[0]}
                        value={reservaForm.fecha}
                        onChange={(e) =>
                          setReservaForm({ ...reservaForm, fecha: e.target.value })
                        }
                        required
                        className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-zinc-700 bg-slate-50 dark:bg-zinc-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-700 dark:text-zinc-300">
                        Número de Personas:
                      </label>
                      <input
                        type="number"
                        min={1}
                        max={100}
                        value={reservaForm.numeroPersonas}
                        onChange={(e) =>
                          setReservaForm({
                            ...reservaForm,
                            numeroPersonas: parseInt(e.target.value) || 1,
                          })
                        }
                        required
                        className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-zinc-700 bg-slate-50 dark:bg-zinc-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      />
                    </div>
                  </div>

                  {/* Botones de prueba rápida para simulación de sobrecupo (Error 409) */}
                  <div className="space-y-1">
                    <span className="text-[11px] text-slate-500 dark:text-zinc-400 font-medium">
                      Accesos rápidos para pruebas de capacidad ecológica:
                    </span>
                    <div className="flex flex-wrap gap-2">
                      <button
                        type="button"
                        onClick={() => setReservaForm({ ...reservaForm, numeroPersonas: 1 })}
                        className="px-2.5 py-1 text-[11px] font-semibold rounded-lg bg-slate-100 dark:bg-zinc-800 hover:bg-slate-200 dark:hover:bg-zinc-700 text-slate-700 dark:text-zinc-300 transition"
                      >
                        1 Persona
                      </button>
                      <button
                        type="button"
                        onClick={() => setReservaForm({ ...reservaForm, numeroPersonas: 2 })}
                        className="px-2.5 py-1 text-[11px] font-semibold rounded-lg bg-slate-100 dark:bg-zinc-800 hover:bg-slate-200 dark:hover:bg-zinc-700 text-slate-700 dark:text-zinc-300 transition"
                      >
                        2 Personas
                      </button>
                      <button
                        type="button"
                        onClick={() => setReservaForm({ ...reservaForm, numeroPersonas: 5 })}
                        className="px-2.5 py-1 text-[11px] font-semibold rounded-lg bg-slate-100 dark:bg-zinc-800 hover:bg-slate-200 dark:hover:bg-zinc-700 text-slate-700 dark:text-zinc-300 transition"
                      >
                        5 Personas
                      </button>
                      <button
                        type="button"
                        onClick={() => setReservaForm({ ...reservaForm, numeroPersonas: 25 })}
                        className="px-2.5 py-1 text-[11px] font-bold rounded-lg bg-amber-100 dark:bg-amber-950/60 hover:bg-amber-200 text-amber-800 dark:text-amber-300 border border-amber-300 dark:border-amber-800 transition flex items-center gap-1"
                      >
                        <AlertTriangle className="w-3 h-3 text-amber-600" />
                        25 Personas (Forzar Sobrecupo Ecológico - Probar 409)
                      </button>
                    </div>
                  </div>

                  {/* Notas Especiales */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700 dark:text-zinc-300">
                      Notas Especiales / Requerimientos:
                    </label>
                    <textarea
                      rows={2}
                      value={reservaForm.notasEspeciales}
                      onChange={(e) =>
                        setReservaForm({ ...reservaForm, notasEspeciales: e.target.value })
                      }
                      placeholder="Ej. Interés en avistamiento de aves, requerimientos de accesibilidad..."
                      className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-zinc-700 bg-slate-50 dark:bg-zinc-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>

                  {/* Resumen de Costo y Envío */}
                  <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-zinc-800/80 border border-slate-200 dark:border-zinc-700 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                    {(() => {
                      const selected = experienciasList.find(
                        (e) => e.id === (reservaForm.experienciaId || experienciasList[0]?.id)
                      );
                      const unit = selected ? Number(selected.precio) : 0;
                      const total = unit * reservaForm.numeroPersonas;
                      return (
                        <div className="text-xs">
                          <span className="text-slate-500 dark:text-zinc-400">Total a pagar estimado: </span>
                          <span className="font-extrabold text-sm text-emerald-600 dark:text-emerald-400">
                            ${total.toFixed(2)} MXN
                          </span>
                          <span className="text-[10px] text-slate-400 ml-1">
                            ({reservaForm.numeroPersonas} x ${unit.toFixed(2)})
                          </span>
                        </div>
                      );
                    })()}

                    <button
                      type="submit"
                      disabled={reservaLoading || status !== "authenticated"}
                      className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md shadow-emerald-600/20 disabled:opacity-50 transition flex items-center justify-center gap-2"
                    >
                      {reservaLoading ? (
                        <>
                          <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                          Procesando Reserva...
                        </>
                      ) : (
                        <>
                          <Calendar className="w-3.5 h-3.5" />
                          Confirmar Reserva Sustentable
                        </>
                      )}
                    </button>
                  </div>
                </form>

                {/* Banner de Resultado de la Reserva */}
                {reservaResponse && (
                  <div className="pt-2">
                    {reservaResponse.status === 201 ? (
                      <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-800 space-y-2 text-xs">
                        <div className="flex items-center gap-2 text-emerald-800 dark:text-emerald-300 font-bold text-sm">
                          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                          ¡Reserva Confirmada Exitosamente! (HTTP 201 Created)
                        </div>
                        <p className="text-slate-600 dark:text-zinc-300">
                          {reservaResponse.data?.message}
                        </p>
                        <div className="p-3 rounded-lg bg-white dark:bg-zinc-900 border border-emerald-200 dark:border-emerald-900/60 font-mono text-[11px] space-y-1">
                          <div className="flex justify-between">
                            <span className="text-slate-500">Comprobante Único:</span>
                            <span className="font-bold text-emerald-600">
                              {reservaResponse.data?.comprobante?.codigo}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-slate-500">Experiencia:</span>
                            <span className="font-semibold text-slate-800 dark:text-zinc-200">
                              {reservaResponse.data?.comprobante?.experiencia}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-slate-500">Titular:</span>
                            <span>{reservaResponse.data?.comprobante?.titular}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-slate-500">Personas:</span>
                            <span>{reservaResponse.data?.comprobante?.numeroPersonas} visitantes</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-slate-500">Total Liquidado:</span>
                            <span className="font-bold">
                              ${Number(reservaResponse.data?.comprobante?.precioTotal).toFixed(2)} MXN
                            </span>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="p-4 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-300 dark:border-rose-800 space-y-2 text-xs">
                        <div className="flex items-center gap-2 text-rose-800 dark:text-rose-300 font-bold text-sm">
                          <AlertTriangle className="w-4 h-4 text-rose-600" />
                          {reservaResponse.status === 409
                            ? "HTTP 409 Conflict: Capacidad de Carga Ecológica Excedida"
                            : `Error al procesar reserva (Status ${reservaResponse.status})`}
                        </div>
                        <p className="text-rose-700 dark:text-rose-200 font-medium leading-relaxed">
                          {reservaResponse.data?.error || reservaResponse.message || "Error al emitir la reserva."}
                        </p>
                        {reservaResponse.status === 409 && (
                          <div className="p-2.5 rounded-lg bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 text-[11px] text-amber-800 dark:text-amber-300">
                            <strong>Principio de Sustentabilidad:</strong> El cupo no puede incrementarse discrecionalmente porque sobrepasa el límite biológico y social establecido para el suelo de conservación de la CDMX.
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* CARD 2: FAVORITOS / ITINERARIO DEL TURISTA */}
              <div className="p-6 rounded-2xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-sm space-y-4">
                <div className="flex items-center justify-between border-b border-slate-100 dark:border-zinc-800 pb-3">
                  <div className="flex items-center gap-2">
                    <Heart className="w-5 h-5 text-rose-500" />
                    <h2 className="text-base font-bold text-slate-900 dark:text-white">
                      Favoritos e Itinerario Guardado
                    </h2>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-slate-100 dark:bg-zinc-800 text-slate-600 dark:text-zinc-300 font-bold">
                      POST /api/user/favoritos
                    </span>
                    <button
                      type="button"
                      onClick={fetchFavoritos}
                      className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-zinc-200"
                      title="Refrescar favoritos"
                    >
                      <RefreshCw className={`w-3.5 h-3.5 ${favoritosLoading ? "animate-spin" : ""}`} />
                    </button>
                  </div>
                </div>

                <p className="text-xs text-slate-500 dark:text-zinc-400">
                  Haz clic en el corazón para agregar o retirar experiencias de tu itinerario de viaje sustentable en la CDMX:
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-60 overflow-y-auto pr-1">
                  {experienciasList.map((exp) => {
                    const isFavorito = favoritosList.some((fav) => fav.experienciaId === exp.id);
                    return (
                      <div
                        key={exp.id}
                        className={`p-3 rounded-xl border transition-all flex items-center justify-between gap-2 text-xs ${
                          isFavorito
                            ? "bg-rose-50/60 dark:bg-rose-950/20 border-rose-200 dark:border-rose-900/50"
                            : "bg-slate-50/50 dark:bg-zinc-800/40 border-slate-200 dark:border-zinc-700"
                        }`}
                      >
                        <div className="space-y-0.5 truncate">
                          <p className="font-bold text-slate-900 dark:text-white truncate">
                            {exp.titulo}
                          </p>
                          <p className="text-[11px] text-slate-500 dark:text-zinc-400">
                            {exp.alcaldiaCDMX} • ${Number(exp.precio).toFixed(2)} MXN
                          </p>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleToggleFavorito(exp.id)}
                          disabled={status !== "authenticated"}
                          className={`p-2 rounded-lg transition shrink-0 ${
                            isFavorito
                              ? "bg-rose-500 text-white shadow-sm shadow-rose-500/20"
                              : "bg-slate-200 dark:bg-zinc-700 text-slate-600 dark:text-zinc-300 hover:text-rose-500"
                          }`}
                          title={isFavorito ? "Quitar de favoritos" : "Guardar en favoritos"}
                        >
                          <Heart className={`w-4 h-4 ${isFavorito ? "fill-white" : ""}`} />
                        </button>
                      </div>
                    );
                  })}
                </div>

                {favoritosList.length > 0 && (
                  <div className="p-3 rounded-xl bg-slate-50 dark:bg-zinc-800/60 border border-slate-200 dark:border-zinc-700 text-xs flex items-center justify-between">
                    <span className="font-semibold text-slate-700 dark:text-zinc-300">
                      Total en tu itinerario: {favoritosList.length} experiencias guardadas
                    </span>
                    <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-bold">
                      Listo para planificar
                    </span>
                  </div>
                )}
              </div>

              {/* CARD 3: CONSULTA DE RESERVAS ACTIVAS SEGÚN ROL */}
              <div className="p-6 rounded-2xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-sm space-y-4">
                <div className="flex items-center justify-between border-b border-slate-100 dark:border-zinc-800 pb-3">
                  <div className="flex items-center gap-2">
                    <Receipt className="w-5 h-5 text-emerald-600" />
                    <h2 className="text-base font-bold text-slate-900 dark:text-white">
                      Consultar Reservas Activas
                    </h2>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 font-bold">
                      GET /api/reservas
                    </span>
                    <button
                      type="button"
                      onClick={fetchReservas}
                      className="px-2.5 py-1 text-xs rounded-lg bg-slate-100 dark:bg-zinc-800 hover:bg-slate-200 dark:hover:bg-zinc-700 text-slate-700 dark:text-zinc-300 flex items-center gap-1 font-semibold transition"
                    >
                      <RefreshCw className={`w-3 h-3 ${reservasLoading ? "animate-spin" : ""}`} />
                      Actualizar
                    </button>
                  </div>
                </div>

                {/* Rol info & Métricas (si es Administrador) */}
                {session?.user?.rol === "ADMINISTRADOR" && reservasMetrics && (
                  <div className="grid grid-cols-3 gap-3">
                    <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-center">
                      <span className="text-[10px] uppercase font-bold text-slate-400">Total Reservas</span>
                      <p className="text-lg font-extrabold text-emerald-700 dark:text-emerald-300">
                        {reservasMetrics.totalReservas}
                      </p>
                    </div>
                    <div className="p-3 rounded-xl bg-teal-50 dark:bg-teal-950/40 border border-teal-200 dark:border-teal-800 text-center">
                      <span className="text-[10px] uppercase font-bold text-slate-400">Visitantes</span>
                      <p className="text-lg font-extrabold text-teal-700 dark:text-teal-300">
                        {reservasMetrics.totalPersonas}
                      </p>
                    </div>
                    <div className="p-3 rounded-xl bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800 text-center">
                      <span className="text-[10px] uppercase font-bold text-slate-400">Derrama Económica</span>
                      <p className="text-lg font-extrabold text-blue-700 dark:text-blue-300">
                        ${Number(reservasMetrics.totalIngresos).toFixed(2)}
                      </p>
                    </div>
                  </div>
                )}

                {/* Lista de Reservas */}
                <div className="space-y-3">
                  {reservasLoading && reservasList.length === 0 ? (
                    <p className="text-xs text-slate-500 italic py-4 text-center">
                      Cargando historial de reservas...
                    </p>
                  ) : reservasList.length === 0 ? (
                    <div className="p-6 rounded-xl border border-dashed border-slate-200 dark:border-zinc-800 text-center text-xs text-slate-500 dark:text-zinc-400">
                      No hay reservas registradas para esta cuenta ({session?.user?.rol || "Sin sesión"}). Realiza una reserva arriba para verificar su creación.
                    </div>
                  ) : (
                    <div className="space-y-2.5 max-h-80 overflow-y-auto pr-1">
                      {reservasList.map((res) => (
                        <div
                          key={res.id}
                          className="p-3.5 rounded-xl border border-slate-200 dark:border-zinc-800 bg-slate-50/50 dark:bg-zinc-800/40 space-y-1.5 text-xs"
                        >
                          <div className="flex items-center justify-between">
                            <span className="font-mono font-bold text-emerald-700 dark:text-emerald-400 bg-emerald-100 dark:bg-emerald-950 px-2 py-0.5 rounded text-[11px]">
                              {res.codigoComprobante}
                            </span>
                            <span className="px-2 py-0.5 rounded font-bold text-[10px] bg-slate-200 dark:bg-zinc-700 text-slate-800 dark:text-zinc-200">
                              {res.estado}
                            </span>
                          </div>

                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                            <p className="font-bold text-slate-900 dark:text-white">
                              {res.experiencia?.titulo}
                            </p>
                            <span className="font-bold text-slate-800 dark:text-zinc-200">
                              ${Number(res.precioTotal).toFixed(2)} MXN
                            </span>
                          </div>

                          <div className="flex flex-wrap items-center gap-3 text-[11px] text-slate-500 dark:text-zinc-400">
                            <span className="flex items-center gap-1">
                              <Calendar className="w-3 h-3 text-emerald-600" />
                              {new Date(res.fecha).toLocaleDateString("es-MX", { timeZone: "UTC" })}
                            </span>
                            <span className="flex items-center gap-1">
                              <Users className="w-3 h-3 text-emerald-600" />
                              {res.numeroPersonas} {res.numeroPersonas === 1 ? "persona" : "personas"}
                            </span>
                            {res.user?.name && (
                              <span className="flex items-center gap-1">
                                <User className="w-3 h-3 text-slate-400" />
                                {res.user.name} ({res.user.email})
                              </span>
                            )}
                          </div>

                          {res.notasEspeciales && (
                            <p className="text-[11px] text-slate-500 italic border-t border-slate-200/60 dark:border-zinc-700/60 pt-1 mt-1">
                              "{res.notasEspeciales}"
                            </p>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </section>

        {/* PANEL DERECHO: VISOR EN VIVO DE SESIÓN Y CONSOLA JSON (5 COLS) */}
        <section className="lg:col-span-5 space-y-6">
          {/* VISOR DE SESIÓN EN VIVO */}
          <div className="p-5 rounded-2xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Shield className="w-4 h-4 text-emerald-600" />
                Sesión Activa en Memoria (useSession)
              </h3>
              <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-slate-100 dark:bg-zinc-800 text-slate-600 dark:text-zinc-300">
                {status}
              </span>
            </div>

            {status === "authenticated" && session?.user ? (
              <div className="space-y-2 text-xs">
                <div className="flex justify-between py-1.5 border-b border-slate-100 dark:border-zinc-800">
                  <span className="text-slate-500 dark:text-zinc-400 font-medium">User ID:</span>
                  <code className="font-mono text-slate-800 dark:text-zinc-200 font-semibold">
                    {session.user.id}
                  </code>
                </div>
                <div className="flex justify-between py-1.5 border-b border-slate-100 dark:border-zinc-800">
                  <span className="text-slate-500 dark:text-zinc-400 font-medium">Rol:</span>
                  <span className="px-2 py-0.5 rounded font-bold bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300">
                    {session.user.rol}
                  </span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-slate-100 dark:border-zinc-800">
                  <span className="text-slate-500 dark:text-zinc-400 font-medium">Tema en Token:</span>
                  <span className="font-semibold text-slate-800 dark:text-zinc-200">
                    {session.user.theme}
                  </span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-slate-100 dark:border-zinc-800">
                  <span className="text-slate-500 dark:text-zinc-400 font-medium">Idioma en Token:</span>
                  <span className="font-semibold text-slate-800 dark:text-zinc-200">
                    {session.user.idioma}
                  </span>
                </div>
                <div className="flex justify-between py-1.5">
                  <span className="text-slate-500 dark:text-zinc-400 font-medium">Email:</span>
                  <span className="text-slate-800 dark:text-zinc-200">{session.user.email}</span>
                </div>
              </div>
            ) : (
              <p className="text-xs text-slate-500 dark:text-zinc-400 italic">
                No hay ninguna sesión activa. Inicia sesión en la pestaña 2 para verificar el token JWT y los datos de usuario.
              </p>
            )}
          </div>

          {/* CONSOLA DE SALIDA JSON EN CRUDO */}
          <div className="p-5 rounded-2xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Code2 className="w-4 h-4 text-emerald-600" />
                Respuesta del Servidor (Raw Output)
              </h3>
              <span className="text-[10px] uppercase font-bold text-slate-400 dark:text-zinc-500">
                Live Console
              </span>
            </div>

            <div className="relative">
              <pre className="p-4 rounded-xl bg-slate-950 text-emerald-400 font-mono text-[11px] leading-relaxed overflow-x-auto max-h-[380px] border border-slate-800">
                {activeTab === "register" &&
                  (regResponse
                    ? JSON.stringify(regResponse, null, 2)
                    : "// Envía el formulario de registro para inspeccionar la respuesta JSON aquí.")}
                {activeTab === "auth" &&
                  (loginResult
                    ? JSON.stringify(loginResult, null, 2)
                    : "// Inicia sesión para ver el resultado de NextAuth signIn() aquí.")}
                {activeTab === "profile" &&
                  (patchResponse || profileData
                    ? JSON.stringify(patchResponse || profileData, null, 2)
                    : "// Consulta o actualiza el perfil para ver la respuesta aquí.")}
                {activeTab === "sustainability" &&
                  (docResponse || auditResponse
                    ? JSON.stringify(docResponse || auditResponse, null, 2)
                    : "// Sube una evidencia o consulta auditorías para ver la respuesta JSON aquí.")}
                {activeTab === "catalog" &&
                  (expCreateResponse || catalogResponse
                    ? JSON.stringify(expCreateResponse || catalogResponse, null, 2)
                    : "// Aplica un filtro o da de alta una experiencia para inspeccionar la respuesta JSON aquí.")}
                {activeTab === "reservas" &&
                  (reservaResponse || reservasResponse || favoritoResponse
                    ? JSON.stringify(reservaResponse || reservasResponse || favoritoResponse, null, 2)
                    : "// Realiza una reserva o consulta la lista para inspeccionar la respuesta JSON aquí.")}
              </pre>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
