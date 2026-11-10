"use client";

import React, { useEffect, useState, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { QRCodeSVG } from "qrcode.react";

interface ComprobanteData {
  codigo: string;
  titular: string;
  experiencia: string;
  fecha: string;
  numeroPersonas: number;
  precioTotal: number | string;
  alcaldia: string;
}

function ExitosaContent() {
  const searchParams = useSearchParams();
  const codigoUrl = searchParams.get("codigo") || "ECO-RES-EXITOSA";

  const [comprobante, setComprobante] = useState<ComprobanteData | null>(null);

  useEffect(() => {
    try {
      const stored = sessionStorage.getItem("ultimoComprobante");
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed.codigo === codigoUrl || !codigoUrl) {
          setComprobante(parsed);
          return;
        }
      }
    } catch {
      // sessionStorage read failed
    }

    // Default fallback
    setComprobante({
      codigo: codigoUrl,
      titular: "Turista Sustentable",
      experiencia: "Experiencia Sustentable CDMX",
      fecha: new Date().toISOString(),
      numeroPersonas: 2,
      precioTotal: 0,
      alcaldia: "CDMX",
    });
  }, [codigoUrl]);

  const codigo = comprobante?.codigo || codigoUrl;
  const qrValidationUrl = `https://turismo-sustentable.cdmx.gob.mx/validar/${codigo}`;

  const formattedDate = comprobante?.fecha
    ? new Date(comprobante.fecha).toLocaleDateString("es-MX", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : "Fecha confirmada";

  return (
    <div className="w-full max-w-md flex flex-col">
      {/* Header Superior */}
      <div className="flex items-center gap-4 mb-8">
        <Link
          href="/reservas"
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
        </Link>
        <h1 className="font-serif text-xl text-[#1E201D] dark:text-white">Tu reserva</h1>
      </div>

      {/* Mensaje Principal */}
      <div className="text-center mb-8">
        <div className="w-12 h-12 rounded-full bg-[#E3E5D8] dark:bg-[#2A312C] mx-auto flex items-center justify-center mb-4">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#728C69" strokeWidth="2">
            <path d="M20 6 9 17l-5-5" />
          </svg>
        </div>
        <h2 className="font-serif text-3xl text-[#1E201D] dark:text-white mb-2">¡Reserva exitosa!</h2>
        <p className="text-[#63665E] dark:text-[#A5B29A] text-sm">
          Tu lugar está asegurado respetando la capacidad de carga ecológica.
        </p>
      </div>

      {/* Tarjeta de la Reserva (Ticket) */}
      <div className="bg-white dark:bg-[#2A312C] rounded-[2rem] overflow-hidden shadow-sm border border-transparent dark:border-white/5 mb-6">
        <div className="w-full h-32 bg-[#B4CBB0] relative">
          <svg viewBox="0 0 400 120" className="w-full h-full object-cover" preserveAspectRatio="none">
            <circle cx="320" cy="40" r="20" fill="#F4E6B4" />
            <polygon points="0,120 150,50 350,120" fill="#758C6E" />
            <polygon points="100,120 280,70 450,120" fill="#586E52" />
          </svg>
        </div>

        <div className="p-6">
          <p className="text-[10px] font-bold tracking-widest text-[#8C9287] dark:text-[#A5B29A] uppercase mb-1">
            Experiencia Sustentable CDMX
          </p>
          <h3 className="font-serif text-2xl text-[#1E201D] dark:text-white mb-4">
            {comprobante?.experiencia}
          </h3>

          <div className="bg-[#E3E5D8]/50 dark:bg-[#3D453F]/30 rounded-lg p-2.5 flex items-center gap-2 mb-6 w-max">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#728C69" strokeWidth="2">
              <path d="M20 6 9 17l-5-5" />
            </svg>
            <span className="text-xs text-[#4A4D46] dark:text-[#D1D5CD] font-medium">
              Reserva confirmada
            </span>
          </div>

          <div className="flex flex-col gap-4 mb-6">
            <div>
              <p className="text-[10px] text-[#8C9287]">Titular</p>
              <p className="text-sm text-[#1E201D] dark:text-white font-medium">
                {comprobante?.titular}
              </p>
            </div>
            <div>
              <p className="text-[10px] text-[#8C9287]">Fecha</p>
              <p className="text-sm text-[#1E201D] dark:text-white font-medium capitalize">
                {formattedDate}
              </p>
            </div>
            <div>
              <p className="text-[10px] text-[#8C9287]">Personas</p>
              <p className="text-sm text-[#1E201D] dark:text-white font-medium">
                {comprobante?.numeroPersonas} {comprobante?.numeroPersonas === 1 ? "persona" : "personas"}
              </p>
            </div>
            <div>
              <p className="text-[10px] text-[#8C9287]">Ubicación</p>
              <p className="text-sm text-[#1E201D] dark:text-white font-medium">
                {comprobante?.alcaldia}, CDMX
              </p>
            </div>
          </div>

          <hr className="border-[#E3E5D8] dark:border-[#3D453F] mb-6" />

          {/* Código QR */}
          <div className="text-center pb-2">
            <p className="text-xs font-medium text-[#1E201D] dark:text-white mb-4">
              Tu pase de acceso digital
            </p>
            <div className="bg-white p-3 rounded-2xl inline-block mb-3 border border-[#E3E5D8] shadow-sm hover:scale-105 transition-transform">
              <QRCodeSVG
                value={qrValidationUrl}
                size={140}
                bgColor={"#ffffff"}
                fgColor={"#1E201D"}
                level={"H"}
                includeMargin={false}
              />
            </div>
            <p className="text-xs font-bold tracking-widest text-[#1E201D] dark:text-white font-mono">
              {codigo}
            </p>
            <p className="text-[10px] text-[#8C9287] mt-1">
              Presenta este código al prestador de servicios
            </p>
          </div>
        </div>
      </div>

      {/* Recomendaciones ecológicas */}
      <div className="bg-[#E3E5D8]/50 dark:bg-[#2A312C] rounded-2xl p-5 mb-6">
        <p className="text-xs font-bold text-[#1E201D] dark:text-white mb-1">
          Compromiso sustentable
        </p>
        <p className="text-xs text-[#63665E] dark:text-[#A5B29A] leading-relaxed">
          Evita plásticos de un solo uso, respeta la flora y fauna local y apoya a los comercios comunitarios.
        </p>
      </div>

      {/* Botones Finales */}
      <Link
        href="/reservas"
        className="w-full bg-[#C81D77] hover:bg-[#A91864] text-white font-medium rounded-2xl py-4 transition-colors shadow-md text-center flex justify-center items-center gap-2 mb-4"
      >
        Ver mis reservas
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M5 12h14" />
          <path d="m12 5 7 7-7 7" />
        </svg>
      </Link>

      <Link
        href="/busqueda"
        className="w-full text-center text-[#728C69] dark:text-[#A5B29A] text-sm font-medium hover:underline"
      >
        Seguir explorando experiencias
      </Link>
    </div>
  );
}

export default function ReservaExitosaPage() {
  return (
    <main className="min-h-screen w-full bg-[#F4F1EA] dark:bg-[#1E2420] transition-colors duration-300 py-8 px-4 flex justify-center pb-24">
      <Suspense
        fallback={
          <div className="w-full max-w-md p-8 text-center text-muted-foreground">
            Cargando confirmación...
          </div>
        }
      >
        <ExitosaContent />
      </Suspense>
    </main>
  );
}
