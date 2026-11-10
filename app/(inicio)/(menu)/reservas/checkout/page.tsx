"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import PaymentErrorModal from "@/components/ui/PaymentErrorModal";
import AddCardModal from "@/components/ui/AddCardModal";

interface ExperienciaDetail {
  id: string;
  titulo: string;
  descripcion: string;
  categoria: string;
  alcaldiaCDMX: string;
  precio: number | string;
  duracionMinutos: number;
  capacidadCarga: number;
  proveedor?: {
    nombreNegocio: string | null;
    alcaldiaCDMX: string | null;
  };
}

function CheckoutContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const experienciaIdParam = searchParams.get("experienciaId");

  const [experiencia, setExperiencia] = useState<ExperienciaDetail | null>(null);
  const [isLoadingExp, setIsLoadingExp] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);

  // Form states
  const [fecha, setFecha] = useState("");
  const [personas, setPersonas] = useState(2);
  const [hasPaymentMethod, setHasPaymentMethod] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [showAddCardModal, setShowAddCardModal] = useState(false);

  // Set default date to tomorrow
  useEffect(() => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const yyyy = tomorrow.getFullYear();
    const mm = String(tomorrow.getMonth() + 1).padStart(2, "0");
    const dd = String(tomorrow.getDate()).padStart(2, "0");
    setFecha(`${yyyy}-${mm}-${dd}`);
  }, []);

  // Fetch experience data
  useEffect(() => {
    async function loadExperiencia() {
      setIsLoadingExp(true);
      setApiError(null);

      try {
        let expId = experienciaIdParam;

        if (!expId) {
          // Fallback: pick first available experience from catalogue
          const catalogRes = await fetch("/api/experiencias");
          const catalogData = await catalogRes.json();
          if (catalogData.success && catalogData.data?.length > 0) {
            expId = catalogData.data[0].id;
          } else {
            throw new Error("No hay experiencias activas disponibles para reservar.");
          }
        }

        const res = await fetch(`/api/experiencias/${expId}`);
        const data = await res.json();

        if (!res.ok || !data.success) {
          throw new Error(data.error || "No se pudo cargar la experiencia.");
        }

        setExperiencia(data.data);
      } catch (err: unknown) {
        const message = err instanceof Error ? err.message : "Error al cargar la experiencia";
        setApiError(message);
      } finally {
        setIsLoadingExp(false);
      }
    }

    loadExperiencia();
  }, [experienciaIdParam]);

  const unitPrice = experiencia ? Number(experiencia.precio) : 0;
  const subtotal = unitPrice * personas;
  const cuotaImpacto = 50;
  const total = subtotal + cuotaImpacto;

  const handlePagar = async () => {
    if (!hasPaymentMethod) {
      setShowErrorModal(true);
      return;
    }

    if (!experiencia) return;
    if (!fecha) {
      setApiError("Por favor selecciona una fecha válida para tu experiencia.");
      return;
    }

    setIsSubmitting(true);
    setApiError(null);

    try {
      const response = await fetch("/api/reservas", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          experienciaId: experiencia.id,
          fecha,
          numeroPersonas: personas,
        }),
      });

      if (response.status === 401) {
        // Redirigir al login si no hay sesión
        router.push(`/login/loginUser?callbackUrl=/reservas/checkout?experienciaId=${experiencia.id}`);
        return;
      }

      const result = await response.json();

      if (!response.ok || !result.success) {
        setApiError(result.error || "Error al procesar la reserva.");
        return;
      }

      // Guardar comprobante temporal en sessionStorage para la pantalla de éxito
      if (result.comprobante) {
        sessionStorage.setItem("ultimoComprobante", JSON.stringify(result.comprobante));
      }

      const codigo = result.comprobante?.codigo || result.reserva?.codigoComprobante || "";
      router.push(`/reservas/exitosa?codigo=${encodeURIComponent(codigo)}`);
    } catch {
      setApiError("Error de conexión al procesar el pago. Inténtalo de nuevo.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoadingExp) {
    return (
      <div className="w-full max-w-md p-8 text-center animate-pulse">
        <div className="h-8 bg-gray-200 dark:bg-gray-800 rounded mb-4" />
        <div className="h-40 bg-gray-200 dark:bg-gray-800 rounded-2xl mb-4" />
        <p className="text-sm text-muted-foreground">Cargando detalles de tu reserva...</p>
      </div>
    );
  }

  if (apiError && !experiencia) {
    return (
      <div className="w-full max-w-md p-6 bg-red-50 dark:bg-red-950/30 border border-red-200 rounded-2xl text-center">
        <p className="text-sm text-red-600 dark:text-red-400 mb-4">{apiError}</p>
        <Link
          href="/busqueda"
          className="text-xs bg-[#728C69] text-white px-4 py-2 rounded-lg hover:bg-[#5B7153]"
        >
          Explorar otras experiencias
        </Link>
      </div>
    );
  }

  return (
    <div className="w-full max-w-md flex flex-col">
      <div className="flex items-center gap-4 mb-6">
        <button
          onClick={() => window.history.back()}
          className="text-[#3B523E] dark:text-[#A5B29A] hover:text-[#C81D77] transition-colors"
        >
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="m15 18-6-6 6-6" />
          </svg>
        </button>
        <h1 className="font-serif text-2xl text-[#1E201D] dark:text-white">Confirma tu reserva</h1>
      </div>

      {/* Alerta de Error en Submit */}
      {apiError && (
        <div className="bg-red-50 dark:bg-red-950/40 border border-red-300 dark:border-red-800 rounded-xl p-4 mb-4 text-xs text-red-700 dark:text-red-300">
          {apiError}
        </div>
      )}

      {/* Resumen de Experiencia */}
      <div className="bg-white dark:bg-[#2A312C] rounded-[2rem] p-5 mb-6 shadow-sm border border-transparent dark:border-white/5">
        <div className="flex gap-4 mb-4">
          <div className="w-16 h-16 rounded-xl bg-[#728C69] text-white flex items-center justify-center flex-shrink-0 font-serif text-xl font-bold">
            {experiencia?.titulo.charAt(0) || "E"}
          </div>
          <div>
            <h2 className="text-[#1E201D] dark:text-white font-medium text-lg leading-tight line-clamp-2">
              {experiencia?.titulo}
            </h2>
            <p className="text-[#8C9287] text-xs mb-1">
              {experiencia?.alcaldiaCDMX}, CDMX · {experiencia?.categoria}
            </p>
            <p className="text-[#728C69] dark:text-[#A5B29A] text-[10px] flex items-center gap-1">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M20 6 9 17l-5-5" />
              </svg>
              Proveedor sustentable validado
            </p>
          </div>
        </div>

        {/* Selector de Fecha y Personas */}
        <div className="pt-4 border-t border-[#E3E5D8] dark:border-[#3D453F] space-y-4">
          <div>
            <label className="block text-xs font-medium text-[#1E201D] dark:text-white mb-1.5">
              Fecha de la actividad
            </label>
            <input
              type="date"
              value={fecha}
              min={new Date().toISOString().split("T")[0]}
              onChange={(e) => setFecha(e.target.value)}
              className="w-full bg-[#F4F1EA] dark:bg-[#1E2420] border border-transparent dark:border-white/10 rounded-xl px-3 py-2 text-sm text-[#1E201D] dark:text-white focus:outline-none focus:ring-2 focus:ring-[#728C69]"
            />
          </div>

          <div>
            <div className="flex justify-between items-center mb-1.5">
              <label className="text-xs font-medium text-[#1E201D] dark:text-white">
                Número de personas
              </label>
              <span className="text-[10px] text-[#8C9287]">
                Capacidad máx: {experiencia?.capacidadCarga}
              </span>
            </div>
            <div className="flex items-center gap-3">
              <button
                type="button"
                disabled={personas <= 1}
                onClick={() => setPersonas((p) => Math.max(1, p - 1))}
                className="w-9 h-9 rounded-lg bg-[#F4F1EA] dark:bg-[#1E2420] text-lg font-bold hover:bg-[#E3E5D8] disabled:opacity-40 transition-colors"
              >
                -
              </button>
              <span className="text-sm font-semibold w-8 text-center">{personas}</span>
              <button
                type="button"
                disabled={Boolean(experiencia && personas >= experiencia.capacidadCarga)}
                onClick={() =>
                  setPersonas((p) =>
                    experiencia ? Math.min(experiencia.capacidadCarga, p + 1) : p + 1
                  )
                }
                className="w-9 h-9 rounded-lg bg-[#F4F1EA] dark:bg-[#1E2420] text-lg font-bold hover:bg-[#E3E5D8] disabled:opacity-40 transition-colors"
              >
                +
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Método de pago */}
      <h3 className="text-lg font-serif text-[#1E201D] dark:text-white mb-4">Método de pago</h3>

      {hasPaymentMethod ? (
        <div className="bg-[#E3E5D8]/50 dark:bg-[#3D453F]/50 border border-[#728C69] dark:border-[#85A07A] rounded-2xl p-4 flex items-center justify-between mb-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-7 bg-[#728C69] rounded-md flex items-center justify-center">
              <div className="w-2 h-2 bg-white/50 rounded-full ml-auto mr-1" />
            </div>
            <div>
              <p className="text-[#1E201D] dark:text-white text-sm font-medium">
                Tarjeta terminada en 4582
              </p>
              <p className="text-[#8C9287] text-xs">Visa · Crédito ecológico</p>
            </div>
          </div>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#728C69" strokeWidth="2">
            <path d="M20 6 9 17l-5-5" />
          </svg>
        </div>
      ) : (
        <div className="bg-white dark:bg-[#2A312C] border border-dashed border-[#8C9287] rounded-2xl p-5 flex flex-col items-center justify-center text-center mb-3">
          <p className="text-[#8C9287] text-xs mb-2">Aún no has agregado un método de pago.</p>
        </div>
      )}

      <button
        onClick={() => setShowAddCardModal(true)}
        className="w-full bg-[#E3E5D8]/50 dark:bg-[#2A312C] text-[#4A4D46] dark:text-[#D1D5CD] text-sm font-medium rounded-2xl py-3 flex justify-center items-center gap-2 mb-6 hover:bg-[#E3E5D8] transition-colors"
      >
        <span className="text-lg">+</span> {hasPaymentMethod ? "Cambiar método" : "Agregar método de pago"}
      </button>

      {/* Detalle del cobro */}
      <h3 className="text-lg font-serif text-[#1E201D] dark:text-white mb-3">Detalle del cobro</h3>
      <div className="flex flex-col gap-2.5 mb-6 border-b border-[#E3E5D8] dark:border-[#3D453F] pb-4">
        <div className="flex justify-between text-sm">
          <span className="text-[#8C9287]">
            Experiencia (${unitPrice} x {personas})
          </span>
          <span className="text-[#1E201D] dark:text-white font-medium">${subtotal}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-[#8C9287]">Aportación de impacto ecológico</span>
          <span className="text-[#1E201D] dark:text-white font-medium">${cuotaImpacto}</span>
        </div>
        <div className="flex justify-between text-base mt-2 pt-2 border-t border-[#E3E5D8] dark:border-[#3D453F]">
          <span className="text-[#1E201D] dark:text-white font-bold">Total</span>
          <span className="text-[#1E201D] dark:text-white font-bold">${total} MXN</span>
        </div>
      </div>

      <div className="bg-[#E3E5D8]/50 dark:bg-[#3D453F]/30 rounded-xl p-3 flex items-center gap-2 mb-6">
        <div className="w-5 h-5 bg-[#728C69] rotate-45 rounded-sm flex items-center justify-center flex-shrink-0">
          <div className="w-2 h-2 bg-white rounded-full" />
        </div>
        <p className="text-xs text-[#63665E] dark:text-[#A5B29A]">
          Validación de capacidad ecológica en tiempo real contra sobrecarga ambiental.
        </p>
      </div>

      <button
        onClick={handlePagar}
        disabled={isSubmitting}
        className="w-full bg-[#C81D77] hover:bg-[#A91864] text-white font-medium rounded-2xl py-4 transition-colors shadow-md mb-3 disabled:opacity-50"
      >
        {isSubmitting ? "Confirmando reserva..." : `Pagar $${total} MXN`}
      </button>
      <p className="text-center text-[10px] text-[#8C9287]">
        Al confirmar aceptas las normas de turismo responsable y límites ecológicos.
      </p>

      <PaymentErrorModal isOpen={showErrorModal} onClose={() => setShowErrorModal(false)} />
      <AddCardModal
        isOpen={showAddCardModal}
        onClose={() => setShowAddCardModal(false)}
        onAdd={() => setHasPaymentMethod(true)}
      />
    </div>
  );
}

export default function CheckoutPage() {
  return (
    <main className="min-h-screen w-full bg-[#F4F1EA] dark:bg-[#1E2420] transition-colors duration-300 py-8 px-4 flex justify-center">
      <Suspense
        fallback={
          <div className="w-full max-w-md p-8 text-center text-muted-foreground">
            Cargando checkout...
          </div>
        }
      >
        <CheckoutContent />
      </Suspense>
    </main>
  );
}
