import { auth, signOut } from "@/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { prisma } from "@/lib/db";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import {
  Compass,
  Calendar,
  Heart,
  LogOut,
  MapPin,
  CheckCircle2,
  ArrowRight,
  Sparkles,
  Ticket,
  User,
} from "lucide-react";

export default async function UserDashboardPage() {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/login/loginUser");
  }

  // Role-based routing: avoid showing tourist dashboard to admin or provider
  if (session.user.rol === "ADMINISTRADOR") {
    redirect("/admin/auditorias");
  }

  if (session.user.rol === "PROVEEDOR") {
    redirect("/negocio/dashboard");
  }

  // Fetch complete tourist data directly in the Server Component
  const userData = await prisma.user.findUnique({
    where: { id: session.user.id },
    include: {
      reservas: {
        include: {
          experiencia: {
            include: {
              proveedor: {
                select: {
                  nombreNegocio: true,
                  alcaldiaCDMX: true,
                },
              },
            },
          },
        },
        orderBy: { fecha: "asc" },
      },
      favoritos: {
        include: {
          experiencia: {
            select: {
              id: true,
              titulo: true,
              categoria: true,
              alcaldiaCDMX: true,
              precio: true,
              imagenes: true,
            },
          },
        },
        take: 4,
        orderBy: { createdAt: "desc" },
      },
    },
  });

  const userName = userData?.name || session.user.name || "Viajero Consciente";
  const userEmail = userData?.email || session.user.email || "";
  const reservas = userData?.reservas || [];
  const favoritos = userData?.favoritos || [];

  const now = new Date();
  now.setHours(0, 0, 0, 0);

  const proximasReservas = reservas.filter((r) => {
    const rDate = new Date(r.fecha);
    return r.estado === "CONFIRMADA" && rDate >= now;
  });

  const historialReservas = reservas.filter((r) => {
    const rDate = new Date(r.fecha);
    return r.estado === "COMPLETADA" || r.estado === "CANCELADA" || rDate < now;
  });

  const proximaAventura = proximasReservas[0] || null;

  return (
    <div className="min-h-screen flex flex-col bg-[#F4F1EA] dark:bg-[#18201C] transition-colors duration-300">
      <Header />

      {/* Main Container */}
      <main className="container mx-auto flex-1 p-6 md:p-10 max-w-5xl">
        {/* Bienvenida */}
        <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-serif text-[#1E201D] dark:text-white mb-1">
              Hola, {userName.split(" ")[0]}
            </h1>
            <p className="text-sm text-[#63665E] dark:text-[#A5B29A]">
              Bienvenido a tu panel de viajero consciente en la Ciudad de México.
            </p>
          </div>

          <Link
            href="/busqueda"
            className="inline-flex items-center gap-2 bg-[#728C69] hover:bg-[#5B7153] text-white text-xs font-semibold px-5 py-2.5 rounded-full transition-colors w-max shadow-sm"
          >
            <Compass className="w-4 h-4" />
            Explorar actividades
          </Link>
        </div>

        {/* Tarjetas de Métricas de Impacto */}
        <div className="grid gap-4 sm:grid-cols-3 mb-8">
          <div className="rounded-2xl border bg-white dark:bg-[#2A312C] p-5 shadow-sm border-transparent dark:border-white/5">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold text-[#8C9287] uppercase tracking-wider">
                Próximas Actividades
              </span>
              <Calendar className="h-4 w-4 text-[#728C69]" />
            </div>
            <p className="text-2xl font-serif text-[#1E201D] dark:text-white mt-2 font-bold">
              {proximasReservas.length}
            </p>
            <p className="text-xs text-[#63665E] dark:text-[#A5B29A] mt-1">
              {proximasReservas.length === 1 ? "reserva confirmada" : "reservas confirmadas"}
            </p>
          </div>

          <div className="rounded-2xl border bg-white dark:bg-[#2A312C] p-5 shadow-sm border-transparent dark:border-white/5">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold text-[#8C9287] uppercase tracking-wider">
                Lugares Favoritos
              </span>
              <Heart className="h-4 w-4 text-[#C81D77]" />
            </div>
            <p className="text-2xl font-serif text-[#1E201D] dark:text-white mt-2 font-bold">
              {favoritos.length}
            </p>
            <p className="text-xs text-[#63665E] dark:text-[#A5B29A] mt-1">
              experiencias guardadas en tu ruta
            </p>
          </div>

          <div className="rounded-2xl border bg-white dark:bg-[#2A312C] p-5 shadow-sm border-transparent dark:border-white/5">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold text-[#8C9287] uppercase tracking-wider">
                Impacto Local
              </span>
              <Sparkles className="h-4 w-4 text-[#D98A5F]" />
            </div>
            <p className="text-2xl font-serif text-[#1E201D] dark:text-white mt-2 font-bold">
              {reservas.length}
            </p>
            <p className="text-xs text-[#63665E] dark:text-[#A5B29A] mt-1">
              apoyos a cooperativas comunitarias
            </p>
          </div>
        </div>

        {/* Sección de Próxima Aventura */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-serif text-[#1E201D] dark:text-white font-bold">
              Tu Próxima Aventura
            </h2>
            <Link
              href="/reservas"
              className="text-xs text-[#728C69] dark:text-[#A5B29A] hover:underline font-medium flex items-center gap-1"
            >
              Ver todas mis reservas <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {proximaAventura ? (
            <div className="bg-white dark:bg-[#2A312C] rounded-3xl p-6 shadow-sm border border-transparent dark:border-white/5 flex flex-col sm:flex-row justify-between sm:items-center gap-6">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-bold text-[#728C69] bg-[#728C69]/10 px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                    {proximaAventura.experiencia.categoria}
                  </span>
                  <span className="text-[10px] font-mono text-[#8C9287]">
                    Pase: {proximaAventura.codigoComprobante}
                  </span>
                </div>
                <h3 className="text-xl font-serif font-bold text-[#1E201D] dark:text-white">
                  {proximaAventura.experiencia.titulo}
                </h3>
                <div className="flex flex-wrap gap-4 text-xs text-[#63665E] dark:text-[#A5B29A]">
                  <span className="flex items-center gap-1 capitalize">
                    <Calendar className="w-3.5 h-3.5 text-[#728C69]" />
                    {new Date(proximaAventura.fecha).toLocaleDateString("es-MX", {
                      weekday: "long",
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </span>
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-[#728C69]" />
                    {proximaAventura.experiencia.alcaldiaCDMX}, CDMX
                  </span>
                  <span>
                    👥 {proximaAventura.numeroPersonas}{" "}
                    {proximaAventura.numeroPersonas === 1 ? "persona" : "personas"}
                  </span>
                </div>
              </div>

              <Link
                href={`/reservas/exitosa?codigo=${encodeURIComponent(
                  proximaAventura.codigoComprobante
                )}`}
                className="bg-[#C81D77] hover:bg-[#A91864] text-white text-xs font-semibold px-5 py-3 rounded-2xl transition-colors flex items-center justify-center gap-2 w-full sm:w-auto flex-shrink-0 shadow-sm"
              >
                <Ticket className="w-4 h-4" />
                Ver pase QR
              </Link>
            </div>
          ) : (
            <div className="bg-white dark:bg-[#2A312C] rounded-3xl p-8 text-center border border-dashed border-[#8C9287]/40">
              <Compass className="w-10 h-10 text-[#728C69] mx-auto mb-2" />
              <p className="text-sm text-[#8C9287] mb-4">No tienes ninguna experiencia próxima programada.</p>
              <Link
                href="/busqueda"
                className="inline-block bg-[#728C69] hover:bg-[#5B7153] text-white text-xs font-semibold px-5 py-2.5 rounded-full transition-colors"
              >
                Explorar experiencias en la CDMX
              </Link>
            </div>
          )}
        </div>

        {/* Sección de Favoritos Recientes */}
        {favoritos.length > 0 && (
          <div className="mb-8">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-serif text-[#1E201D] dark:text-white font-bold">
                Tus Favoritos Guardados
              </h2>
              <Link
                href="/perfil/favoritos"
                className="text-xs text-[#728C69] dark:text-[#A5B29A] hover:underline font-medium flex items-center gap-1"
              >
                Ver todos <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              {favoritos.map((fav) => (
                <div
                  key={fav.id}
                  className="bg-white dark:bg-[#2A312C] rounded-2xl p-4 shadow-sm border border-transparent dark:border-white/5 flex justify-between items-center"
                >
                  <div>
                    <span className="text-[10px] font-bold text-[#8C9287] uppercase">
                      {fav.experiencia.categoria}
                    </span>
                    <h3 className="text-sm font-semibold text-[#1E201D] dark:text-white line-clamp-1">
                      {fav.experiencia.titulo}
                    </h3>
                    <p className="text-xs text-[#63665E] dark:text-[#A5B29A]">
                      {fav.experiencia.alcaldiaCDMX}, CDMX · Desde ${Number(fav.experiencia.precio)} MXN
                    </p>
                  </div>
                  <Link
                    href={`/reservas/checkout?experienciaId=${fav.experiencia.id}`}
                    className="text-xs bg-[#728C69] hover:bg-[#5B7153] text-white px-3.5 py-2 rounded-xl font-medium transition-colors flex-shrink-0 ml-3"
                  >
                    Reservar
                  </Link>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Accesos Rápidos */}
        <div className="grid gap-3 sm:grid-cols-3">
          <Link
            href="/perfil"
            className="bg-white dark:bg-[#2A312C] rounded-2xl p-4 shadow-sm border border-transparent dark:border-white/5 hover:bg-[#F4F1EA] dark:hover:bg-[#3D453F] transition-colors flex items-center gap-3"
          >
            <div className="w-9 h-9 rounded-xl bg-[#728C69]/10 text-[#728C69] flex items-center justify-center">
              <User className="w-4 h-4" />
            </div>
            <div>
              <p className="text-xs font-bold text-[#1E201D] dark:text-white">Mi Perfil</p>
              <p className="text-[10px] text-[#8C9287]">Preferencias y cuenta</p>
            </div>
          </Link>

          <Link
            href="/reservas"
            className="bg-white dark:bg-[#2A312C] rounded-2xl p-4 shadow-sm border border-transparent dark:border-white/5 hover:bg-[#F4F1EA] dark:hover:bg-[#3D453F] transition-colors flex items-center gap-3"
          >
            <div className="w-9 h-9 rounded-xl bg-[#728C69]/10 text-[#728C69] flex items-center justify-center">
              <Ticket className="w-4 h-4" />
            </div>
            <div>
              <p className="text-xs font-bold text-[#1E201D] dark:text-white">Mis Reservas</p>
              <p className="text-[10px] text-[#8C9287]">Historial y pases QR</p>
            </div>
          </Link>

          <Link
            href="/busqueda"
            className="bg-white dark:bg-[#2A312C] rounded-2xl p-4 shadow-sm border border-transparent dark:border-white/5 hover:bg-[#F4F1EA] dark:hover:bg-[#3D453F] transition-colors flex items-center gap-3"
          >
            <div className="w-9 h-9 rounded-xl bg-[#728C69]/10 text-[#728C69] flex items-center justify-center">
              <Compass className="w-4 h-4" />
            </div>
            <div>
              <p className="text-xs font-bold text-[#1E201D] dark:text-white">Catálogo CDMX</p>
              <p className="text-[10px] text-[#8C9287]">Buscar actividades</p>
            </div>
          </Link>
        </div>
      </main>

      <Footer />
    </div>
  );
}
