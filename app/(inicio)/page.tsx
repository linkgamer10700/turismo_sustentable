import Image from "next/image";
import Link from "next/link";
import { auth } from "@/auth";
import { prisma } from "@/lib/db";
import {
  ShieldCheck,
  FileText,
  BarChart3,
  CalendarCheck2,
  Compass,
  ArrowRight,
  Clock,
  Sparkles,
  Building2,
  Star,
  CheckCircle2,
  AlertCircle,
  FolderOpen,
} from "lucide-react";

export default async function Home() {
  const session = await auth();
  const user = session?.user;
  const rol = user?.rol;

  // ==========================================
  // 1. INICIO DINÁMICO: ROL ADMINISTRADOR
  // ==========================================
  if (user && rol === "ADMINISTRADOR") {
    let pendingCount = 0;
    let totalReservas = 0;
    let totalProveedores = 0;
    let totalResenas = 0;
    let ultimasEvidencias: any[] = [];

    try {
      const [pendientes, reservas, proveedores, resenas, ultimas] = await Promise.all([
        prisma.documentoEvidencia.count({ where: { estado: "PENDIENTE" } }),
        prisma.reserva.count(),
        prisma.proveedor.count(),
        prisma.resena.count(),
        prisma.documentoEvidencia.findMany({
          where: { estado: "PENDIENTE" },
          take: 3,
          include: { proveedor: true },
          orderBy: { createdAt: "desc" },
        }),
      ]);

      pendingCount = pendientes;
      totalReservas = reservas;
      totalProveedores = proveedores;
      totalResenas = resenas;
      ultimasEvidencias = ultimas;
    } catch (err) {
      console.error("Error al cargar métricas de administrador en Home:", err);
    }

    return (
      <main className="min-h-[calc(100vh-4.75rem)] w-full bg-[#F4F1EA] dark:bg-[#1E2420] transition-colors duration-300 py-10 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto space-y-8">
          {/* Bienvenida y Encabezado de Rol */}
          <div className="bg-white dark:bg-[#2A312C] rounded-3xl p-6 sm:p-8 shadow-sm border border-transparent dark:border-white/5 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#C81D77]/10 text-[#C81D77] dark:text-[#E24A96] text-xs font-bold uppercase tracking-wider mb-3">
                <ShieldCheck className="w-4 h-4" />
                Panel de Administración General
              </div>
              <h1 className="font-serif text-3xl sm:text-4xl text-[#1E201D] dark:text-white">
                Hola, {user.name || "Administrador"}
              </h1>
              <p className="text-sm text-[#8C9287] dark:text-[#9EA399] mt-1 max-w-xl">
                Supervisa el estado de la plataforma sustentable, audita las evidencias contra greenwashing y analiza el impacto en la CDMX.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Link
                href="/admin/auditorias"
                className="px-5 py-2.5 rounded-full bg-[#C81D77] hover:bg-[#a61763] text-white text-xs font-medium transition-all shadow-sm flex items-center gap-2"
              >
                <FileText className="w-4 h-4" />
                Auditar Evidencias ({pendingCount})
              </Link>
              <Link
                href="/admin/panel-bi"
                className="px-5 py-2.5 rounded-full bg-[#728C69] hover:bg-[#5b7353] text-white text-xs font-medium transition-all shadow-sm flex items-center gap-2"
              >
                <BarChart3 className="w-4 h-4" />
                Métricas BI
              </Link>
            </div>
          </div>

          {/* Tarjetas de Métricas en Tiempo Real */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            <div className="bg-white dark:bg-[#2A312C] rounded-3xl p-5 shadow-sm border border-transparent dark:border-white/5">
              <div className="flex items-center justify-between text-[#8C9287] dark:text-[#9EA399] mb-2">
                <span className="text-xs font-medium">Por Auditar</span>
                <Clock className="w-4 h-4 text-[#C81D77]" />
              </div>
              <p className="font-serif text-3xl font-bold text-[#C81D77] dark:text-[#E24A96]">
                {pendingCount}
              </p>
              <p className="text-[11px] text-[#8C9287] dark:text-[#9EA399] mt-1">
                Evidencias pendientes
              </p>
            </div>

            <div className="bg-white dark:bg-[#2A312C] rounded-3xl p-5 shadow-sm border border-transparent dark:border-white/5">
              <div className="flex items-center justify-between text-[#8C9287] dark:text-[#9EA399] mb-2">
                <span className="text-xs font-medium">Proveedores</span>
                <Building2 className="w-4 h-4 text-[#728C69]" />
              </div>
              <p className="font-serif text-3xl font-bold text-[#1E201D] dark:text-white">
                {totalProveedores}
              </p>
              <p className="text-[11px] text-[#8C9287] dark:text-[#9EA399] mt-1">
                Cooperativas y negocios
              </p>
            </div>

            <div className="bg-white dark:bg-[#2A312C] rounded-3xl p-5 shadow-sm border border-transparent dark:border-white/5">
              <div className="flex items-center justify-between text-[#8C9287] dark:text-[#9EA399] mb-2">
                <span className="text-xs font-medium">Reservaciones</span>
                <CalendarCheck2 className="w-4 h-4 text-[#728C69]" />
              </div>
              <p className="font-serif text-3xl font-bold text-[#1E201D] dark:text-white">
                {totalReservas}
              </p>
              <p className="text-[11px] text-[#8C9287] dark:text-[#9EA399] mt-1">
                Registradas en plataforma
              </p>
            </div>

            <div className="bg-white dark:bg-[#2A312C] rounded-3xl p-5 shadow-sm border border-transparent dark:border-white/5">
              <div className="flex items-center justify-between text-[#8C9287] dark:text-[#9EA399] mb-2">
                <span className="text-xs font-medium">Reseñas Reales</span>
                <Star className="w-4 h-4 text-amber-500" />
              </div>
              <p className="font-serif text-3xl font-bold text-[#1E201D] dark:text-white">
                {totalResenas}
              </p>
              <p className="text-[11px] text-[#8C9287] dark:text-[#9EA399] mt-1">
                Experiencias calificadas
              </p>
            </div>
          </div>

          {/* Accesos a Módulos de Administración */}
          <div>
            <h2 className="font-serif text-xl text-[#1E201D] dark:text-white mb-4">
              Módulos del Sistema
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Link
                href="/admin/auditorias"
                className="group bg-white dark:bg-[#2A312C] rounded-3xl p-6 shadow-sm border border-transparent dark:border-white/5 hover:border-[#C81D77]/30 transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="w-12 h-12 rounded-2xl bg-[#C81D77]/10 flex items-center justify-center text-[#C81D77] mb-4">
                    <ShieldCheck className="w-6 h-6" />
                  </div>
                  <h3 className="font-serif text-lg text-[#1E201D] dark:text-white group-hover:text-[#C81D77] transition-colors">
                    Auditoría de Evidencias
                  </h3>
                  <p className="text-xs text-[#8C9287] dark:text-[#9EA399] mt-2 leading-relaxed">
                    Revisa documentos ecológicos, manejo de residuos y aprueba o rechaza solicitudes de certificación.
                  </p>
                </div>
                <div className="mt-6 flex items-center gap-1 text-xs font-semibold text-[#C81D77]">
                  <span>Ir a auditorías</span>
                  <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
                </div>
              </Link>

              <Link
                href="/admin/panel-bi"
                className="group bg-white dark:bg-[#2A312C] rounded-3xl p-6 shadow-sm border border-transparent dark:border-white/5 hover:border-[#728C69]/30 transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="w-12 h-12 rounded-2xl bg-[#728C69]/10 flex items-center justify-center text-[#728C69] mb-4">
                    <BarChart3 className="w-6 h-6" />
                  </div>
                  <h3 className="font-serif text-lg text-[#1E201D] dark:text-white group-hover:text-[#728C69] transition-colors">
                    Panel BI y Analítica
                  </h3>
                  <p className="text-xs text-[#8C9287] dark:text-[#9EA399] mt-2 leading-relaxed">
                    Visualiza ingresos, reservas por categoría (Naturaleza, Cultura, Relax) y las cooperativas líderes.
                  </p>
                </div>
                <div className="mt-6 flex items-center gap-1 text-xs font-semibold text-[#728C69]">
                  <span>Ver analítica</span>
                  <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
                </div>
              </Link>

              <Link
                href="/admin/dashboard"
                className="group bg-white dark:bg-[#2A312C] rounded-3xl p-6 shadow-sm border border-transparent dark:border-white/5 hover:border-[#728C69]/30 transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="w-12 h-12 rounded-2xl bg-[#E3E5D8] dark:bg-[#3D453F] flex items-center justify-center text-[#1E201D] dark:text-white mb-4">
                    <Building2 className="w-6 h-6" />
                  </div>
                  <h3 className="font-serif text-lg text-[#1E201D] dark:text-white group-hover:text-[#728C69] transition-colors">
                    Auditor y Métricas de Sistema
                  </h3>
                  <p className="text-xs text-[#8C9287] dark:text-[#9EA399] mt-2 leading-relaxed">
                    Monitoreo en tiempo real del estado de salud del backend, sincronización y métricas operativas.
                  </p>
                </div>
                <div className="mt-6 flex items-center gap-1 text-xs font-semibold text-[#728C69]">
                  <span>Auditor de sistema</span>
                  <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
                </div>
              </Link>
            </div>
          </div>

          {/* Evidencias prioritarias pendientes */}
          {ultimasEvidencias.length > 0 && (
            <div className="bg-white dark:bg-[#2A312C] rounded-3xl p-6 shadow-sm border border-transparent dark:border-white/5">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-serif text-lg text-[#1E201D] dark:text-white">
                  Evidencias pendientes más recientes
                </h3>
                <Link
                  href="/admin/auditorias"
                  className="text-xs font-medium text-[#C81D77] hover:underline"
                >
                  Ver todas
                </Link>
              </div>
              <div className="divide-y divide-gray-100 dark:divide-white/5">
                {ultimasEvidencias.map((item) => (
                  <div
                    key={item.id}
                    className="py-3 flex items-center justify-between gap-4"
                  >
                    <div>
                      <p className="text-sm font-semibold text-[#1E201D] dark:text-white">
                        {item.titulo}
                      </p>
                      <p className="text-xs text-[#8C9287] dark:text-[#9EA399]">
                        {item.proveedor?.nombreNegocio || "Proveedor"} ·{" "}
                        {item.proveedor?.alcaldiaCDMX || "CDMX"}
                      </p>
                    </div>
                    <Link
                      href={`/admin/auditorias/${item.proveedorId}`}
                      className="text-xs font-medium px-3 py-1.5 rounded-full bg-[#C81D77]/10 text-[#C81D77] hover:bg-[#C81D77] hover:text-white transition-all whitespace-nowrap"
                    >
                      Revisar
                    </Link>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </main>
    );
  }

  // ==========================================
  // 2. INICIO DINÁMICO: ROL PROVEEDOR
  // ==========================================
  if (user && rol === "PROVEEDOR") {
    let proveedorData: any = null;
    let totalDocs = 0;
    let docsAprobados = 0;
    let reservasRecibidas = 0;

    try {
      proveedorData = await prisma.proveedor.findUnique({
        where: { userId: user.id },
        include: {
          documentos: true,
          experiencias: {
            include: { reservas: true },
          },
        },
      });

      if (proveedorData) {
        totalDocs = proveedorData.documentos?.length || 0;
        docsAprobados =
          proveedorData.documentos?.filter((d: any) => d.estado === "APROBADO")
            ?.length || 0;
        reservasRecibidas =
          proveedorData.experiencias?.reduce(
            (acc: number, exp: any) => acc + (exp.reservas?.length || 0),
            0
          ) || 0;
      }
    } catch (err) {
      console.error("Error al cargar datos del proveedor en Home:", err);
    }

    const estadoValidacion = proveedorData?.estadoValidacion || "PENDIENTE";

    return (
      <main className="min-h-[calc(100vh-4.75rem)] w-full bg-[#F4F1EA] dark:bg-[#1E2420] transition-colors duration-300 py-10 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto space-y-8">
          {/* Bienvenida y Ficha del Negocio */}
          <div className="bg-white dark:bg-[#2A312C] rounded-3xl p-6 sm:p-8 shadow-sm border border-transparent dark:border-white/5 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#728C69]/15 text-[#728C69] dark:text-[#A5B29A] text-xs font-bold uppercase tracking-wider mb-3">
                <Building2 className="w-4 h-4" />
                Panel de Negocio Sustentable
              </div>
              <h1 className="font-serif text-3xl sm:text-4xl text-[#1E201D] dark:text-white">
                {proveedorData?.nombreNegocio || user.name || "Mi Cooperativa"}
              </h1>
              <p className="text-sm text-[#8C9287] dark:text-[#9EA399] mt-1 max-w-xl">
                {proveedorData?.descripcionBreve ||
                  "Gestiona tus evidencias sustentables, consulta tus reservaciones y mantén activa tu certificación."}
              </p>
              <div className="flex items-center gap-3 mt-3 text-xs text-[#63665E] dark:text-[#A5B29A]">
                <span className="font-medium">
                  {proveedorData?.alcaldiaCDMX || "Ciudad de México"}
                </span>
                <span>·</span>
                <span className="uppercase">
                  {proveedorData?.categoria || "Turismo Ecológico"}
                </span>
              </div>
            </div>

            <div className="flex flex-col items-start md:items-end gap-3">
              <div
                className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold ${
                  estadoValidacion === "APROBADO"
                    ? "bg-green-100 dark:bg-green-950/40 text-green-700 dark:text-green-300"
                    : estadoValidacion === "RECHAZADO"
                    ? "bg-red-100 dark:bg-red-950/40 text-red-700 dark:text-red-300"
                    : "bg-amber-100 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300"
                }`}
              >
                {estadoValidacion === "APROBADO" ? (
                  <CheckCircle2 className="w-4 h-4" />
                ) : (
                  <AlertCircle className="w-4 h-4" />
                )}
                Sello: {estadoValidacion}
              </div>

              <div className="flex gap-2">
                <Link
                  href="/negocio/dashboard"
                  className="px-4 py-2 rounded-full bg-[#728C69] hover:bg-[#5b7353] text-white text-xs font-medium transition-all shadow-sm"
                >
                  Mi Ficha
                </Link>
                <Link
                  href="/negocio/documentos"
                  className="px-4 py-2 rounded-full bg-white dark:bg-[#3D453F] border border-gray-200 dark:border-white/10 hover:border-[#728C69] text-xs font-medium transition-all"
                >
                  Evidencias
                </Link>
              </div>
            </div>
          </div>

          {/* Estadísticas del Proveedor */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div className="bg-white dark:bg-[#2A312C] rounded-3xl p-6 shadow-sm border border-transparent dark:border-white/5">
              <div className="flex items-center justify-between text-[#8C9287] dark:text-[#9EA399] mb-2">
                <span className="text-xs font-medium">Documentos Subidos</span>
                <FolderOpen className="w-4 h-4 text-[#728C69]" />
              </div>
              <p className="font-serif text-3xl font-bold text-[#1E201D] dark:text-white">
                {totalDocs}
              </p>
              <p className="text-[11px] text-[#8C9287] dark:text-[#9EA399] mt-1">
                {docsAprobados} validados por la administración
              </p>
            </div>

            <div className="bg-white dark:bg-[#2A312C] rounded-3xl p-6 shadow-sm border border-transparent dark:border-white/5">
              <div className="flex items-center justify-between text-[#8C9287] dark:text-[#9EA399] mb-2">
                <span className="text-xs font-medium">Experiencias Activas</span>
                <Compass className="w-4 h-4 text-[#728C69]" />
              </div>
              <p className="font-serif text-3xl font-bold text-[#1E201D] dark:text-white">
                {proveedorData?.experiencias?.length || 0}
              </p>
              <p className="text-[11px] text-[#8C9287] dark:text-[#9EA399] mt-1">
                Publicadas en el catálogo
              </p>
            </div>

            <div className="bg-white dark:bg-[#2A312C] rounded-3xl p-6 shadow-sm border border-transparent dark:border-white/5">
              <div className="flex items-center justify-between text-[#8C9287] dark:text-[#9EA399] mb-2">
                <span className="text-xs font-medium">Reservaciones Recibidas</span>
                <CalendarCheck2 className="w-4 h-4 text-[#728C69]" />
              </div>
              <p className="font-serif text-3xl font-bold text-[#1E201D] dark:text-white">
                {reservasRecibidas}
              </p>
              <p className="text-[11px] text-[#8C9287] dark:text-[#9EA399] mt-1">
                Turistas que han reservado
              </p>
            </div>
          </div>

          {/* Accesos rápidos para el Proveedor */}
          <div>
            <h2 className="font-serif text-xl text-[#1E201D] dark:text-white mb-4">
              Gestión de tu Negocio
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Link
                href="/negocio/dashboard"
                className="group bg-white dark:bg-[#2A312C] rounded-3xl p-6 shadow-sm border border-transparent dark:border-white/5 hover:border-[#728C69]/30 transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="w-12 h-12 rounded-2xl bg-[#728C69]/10 flex items-center justify-center text-[#728C69] mb-4">
                    <Building2 className="w-6 h-6" />
                  </div>
                  <h3 className="font-serif text-lg text-[#1E201D] dark:text-white group-hover:text-[#728C69] transition-colors">
                    Ficha de Mi Cuenta
                  </h3>
                  <p className="text-xs text-[#8C9287] dark:text-[#9EA399] mt-2 leading-relaxed">
                    Edita el nombre de tu cooperativa, descripción breve, categoría y alcaldía para los turistas.
                  </p>
                </div>
                <div className="mt-6 flex items-center gap-1 text-xs font-semibold text-[#728C69]">
                  <span>Ir al panel</span>
                  <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
                </div>
              </Link>

              <Link
                href="/negocio/documentos"
                className="group bg-white dark:bg-[#2A312C] rounded-3xl p-6 shadow-sm border border-transparent dark:border-white/5 hover:border-[#728C69]/30 transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="w-12 h-12 rounded-2xl bg-[#728C69]/10 flex items-center justify-center text-[#728C69] mb-4">
                    <FileText className="w-6 h-6" />
                  </div>
                  <h3 className="font-serif text-lg text-[#1E201D] dark:text-white group-hover:text-[#728C69] transition-colors">
                    Documentos y Sellos
                  </h3>
                  <p className="text-xs text-[#8C9287] dark:text-[#9EA399] mt-2 leading-relaxed">
                    Sube constancias ecológicas, manejo de residuos y certificados para mantener tu sello activo.
                  </p>
                </div>
                <div className="mt-6 flex items-center gap-1 text-xs font-semibold text-[#728C69]">
                  <span>Subir documentos</span>
                  <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
                </div>
              </Link>

              <Link
                href="/reservas"
                className="group bg-white dark:bg-[#2A312C] rounded-3xl p-6 shadow-sm border border-transparent dark:border-white/5 hover:border-[#728C69]/30 transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="w-12 h-12 rounded-2xl bg-[#E3E5D8] dark:bg-[#3D453F] flex items-center justify-center text-[#1E201D] dark:text-white mb-4">
                    <CalendarCheck2 className="w-6 h-6" />
                  </div>
                  <h3 className="font-serif text-lg text-[#1E201D] dark:text-white group-hover:text-[#728C69] transition-colors">
                    Reservas Recibidas
                  </h3>
                  <p className="text-xs text-[#8C9287] dark:text-[#9EA399] mt-2 leading-relaxed">
                    Consulta las fechas reservadas, número de visitantes y códigos de confirmación de tus clientes.
                  </p>
                </div>
                <div className="mt-6 flex items-center gap-1 text-xs font-semibold text-[#728C69]">
                  <span>Ver reservaciones</span>
                  <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
                </div>
              </Link>
            </div>
          </div>
        </div>
      </main>
    );
  }

  // ==========================================
  // 3. INICIO TURISTA / PÚBLICO GENERAL
  // ==========================================
  return (
    <main className="relative flex min-h-[calc(100vh-4.75rem)] w-full flex-col items-center justify-center overflow-hidden bg-background text-foreground transition-colors duration-300 isolate">
      {/* Banner de saludo si está logueado como Turista */}
      {user && (
        <div className="absolute top-4 z-20 px-4 py-1.5 rounded-full bg-[#728C69]/15 border border-[#728C69]/30 text-xs font-medium text-[#728C69] dark:text-[#A5B29A] flex items-center gap-2">
          <Sparkles className="w-3.5 h-3.5" />
          <span>
            Bienvenido, {user.name || "viajero"} · Explora experiencias auténticas en CDMX
          </span>
        </div>
      )}

      {/* Círculo superior izquierdo */}
      <div className="absolute w-[40rem] h-[40rem] -left-[12.5rem] -top-[16.25rem] rounded-full bg-blob-top z-0 transition-colors duration-300" />

      {/* Círculo inferior derecho */}
      <div className="absolute w-[26.25rem] h-[26.25rem] -right-[10rem] bottom-[3.75rem] rounded-full bg-blob-bottom z-0 transition-colors duration-300" />

      {/* Montañas SVG */}
      <div className="absolute bottom-0 left-0 w-full h-[140px] z-0 pointer-events-none">
        {/* Montaña Grande (Atrás) */}
        <svg
          viewBox="0 0 1440 140"
          preserveAspectRatio="none"
          className="absolute bottom-0 left-0 w-full h-[140px] text-[#8F9F7E] dark:brightness-75 transition-colors duration-300"
        >
          <path
            fill="currentColor"
            d="M0 140V76L288 20L604.8 80L950 25L1250 70L1440 35V140Z"
          />
        </svg>

        {/* Montaña Chica (Frente) */}
        <svg
          viewBox="0 0 1440 76"
          preserveAspectRatio="none"
          className="absolute bottom-0 left-0 w-full h-[76px] text-[#5A7050] dark:brightness-75 transition-colors duration-300"
        >
          <path
            fill="currentColor"
            d="M0 76V44L316.8 4L662.4 48L1050 10L1320 50L1440 25V76Z"
          />
        </svg>
      </div>

      {/* Contenido Central */}
      <div className="relative z-10 flex w-full max-w-[1200px] items-center justify-between px-8 py-12">
        {/* Texto Izquierdo */}
        <div className="w-[15.625rem] space-y-2">
          <p className="text-[0.6875rem] font-bold tracking-[0.1875rem] text-primary uppercase">
            01 · CONECTA
          </p>
          <p className="text-[0.875rem] leading-[1.3125rem] text-muted-foreground">
            Turistas y cooperativas locales en un solo lugar.
          </p>
        </div>

        {/* Órbita Central Animada */}
        <div className="relative flex h-[550px] w-[550px] flex-col items-center justify-center">
          <div className="absolute h-full w-full animate-[spin_40s_linear_infinite]">
            <div className="absolute h-full w-full rounded-full border border-dashed border-[#B0B0B0] dark:border-gray-700 transition-colors duration-300" />

            <div className="absolute left-[12%] top-[18%] -translate-x-1/2 -translate-y-1/2 z-20">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary shadow-md [animation:reverse-spin_40s_linear_infinite]">
                <Image src="/hoja_oscura.svg" alt="Hoja" width={24} height={24} />
              </div>
            </div>

            <div className="absolute bottom-[28%] left-[2%] -translate-x-1/2 translate-y-1/2 z-20">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#E2E0D5] shadow-md [animation:reverse-spin_40s_linear_infinite]">
                <Image src="/hoja.svg" alt="Hoja" width={24} height={24} />
              </div>
            </div>

            <div className="absolute bottom-[22%] right-[10%] translate-x-1/2 translate-y-1/2 z-20">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#708B63] shadow-md [animation:reverse-spin_40s_linear_infinite]">
                <Image src="/hoja_oscura.svg" alt="Hoja" width={24} height={24} />
              </div>
            </div>
          </div>

          <div className="relative h-[420px] w-[420px] rounded-full border-[1.5px] border-[#708B63] bg-card shadow-sm z-10 transition-colors duration-300" />
        </div>

        {/* Texto Derecho */}
        <div className="w-[15.625rem] space-y-2 text-right">
          <p className="text-[0.6875rem] font-bold tracking-[0.1875rem] text-primary uppercase">
            02 · VALIDA
          </p>
          <p className="text-[0.875rem] leading-[1.3125rem] text-muted-foreground">
            Reseñas y fotos reales contra el greenwashing.
          </p>
        </div>
      </div>

      {/* Texto Inferior y Botón */}
      <div className="relative z-10 -mt-10 flex flex-col items-center space-y-6">
        <h1 className="text-sm font-medium tracking-[0.4em] text-[#708B63]">
          TURISMO SUSTENTABLE · CIUDAD DE MÉXICO
        </h1>

        <div className="flex gap-4">
          <Link
            href="/busqueda"
            className="group flex items-center justify-center gap-2 rounded-full bg-primary px-8 py-3 text-sm font-medium text-primary-foreground transition-all hover:opacity-90 shadow-md"
          >
            Comenzar exploración
            <span className="transition-transform group-hover:translate-x-1">→</span>
          </Link>
          <Link
            href="/aboutPage"
            className="flex items-center justify-center gap-2 rounded-full bg-white dark:bg-[#2A312C] border border-gray-200 dark:border-white/10 px-6 py-3 text-sm font-medium text-foreground transition-all hover:border-[#728C69] shadow-sm"
          >
            Acerca de nosotros
          </Link>
        </div>
      </div>
    </main>
  );
}
