import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { auth } from "@/auth";

// Registro en memoria para control de cooldown por usuario (20 segundos)
const cooldowns = new Map<string, number>();
const COOLDOWN_SECONDS = 20;

interface GeminiFunctionCall {
  name: string;
  args: Record<string, any>;
}

// Tool Definition para Gemini (Protocolo Function Calling / MCP Tool)
const TOOLS_DECLARATION = [
  {
    functionDeclarations: [
      {
        name: "buscarExperienciasSustentables",
        description:
          "Busca en la base de datos de Ciudad de México experiencias turísticas sustentables, cooperativas locales y destinos certificados contra el greenwashing.",
        parameters: {
          type: "OBJECT",
          properties: {
            categoria: {
              type: "STRING",
              description:
                "Categoría deseada: 'Ecoturismo', 'Naturaleza', 'Cultura', 'Gastronomía', 'Aventura', 'Relax' o 'Mascotas'.",
            },
            alcaldia: {
              type: "STRING",
              description:
                "Alcaldía de la CDMX: e.g. 'Xochimilco', 'Tlalpan', 'Coyoacán', 'Tláhuac', 'Magdalena Contreras', 'Cuauhtémoc'.",
            },
            presupuestoMaximo: {
              type: "NUMBER",
              description: "Precio máximo por persona en pesos mexicanos (MXN).",
            },
            terminoBusqueda: {
              type: "STRING",
              description: "Término libre de búsqueda, e.g. 'chinampas', 'senderismo', 'ajolotes', 'apicultura'.",
            },
          },
        },
      },
    ],
  },
];

// Función ejecutora que consulta directamente la BD
async function executeBuscarExperiencias(args: {
  categoria?: string;
  alcaldia?: string;
  presupuestoMaximo?: number;
  terminoBusqueda?: string;
}) {
  const { categoria, alcaldia, presupuestoMaximo, terminoBusqueda } = args;

  const whereClause: any = { activo: true };

  if (categoria && categoria !== "Todas") {
    whereClause.categoria = { contains: categoria };
  }
  if (alcaldia) {
    whereClause.alcaldiaCDMX = { contains: alcaldia };
  }
  if (presupuestoMaximo && !isNaN(presupuestoMaximo)) {
    whereClause.precio = { lte: Number(presupuestoMaximo) };
  }
  if (terminoBusqueda) {
    whereClause.OR = [
      { titulo: { contains: terminoBusqueda } },
      { descripcion: { contains: terminoBusqueda } },
    ];
  }

  const experiencias = await prisma.experiencia.findMany({
    where: whereClause,
    include: {
      proveedor: {
        select: {
          nombreNegocio: true,
          estadoValidacion: true,
          alcaldiaCDMX: true,
        },
      },
      resenas: {
        select: {
          calificacion: true,
        },
      },
    },
    take: 6,
    orderBy: { createdAt: "desc" },
  });

  return experiencias.map((exp) => {
    const totalResenas = exp.resenas.length;
    const promedio =
      totalResenas > 0
        ? exp.resenas.reduce((acc, r) => acc + r.calificacion, 0) / totalResenas
        : 5.0;

    return {
      id: exp.id,
      titulo: exp.titulo,
      descripcion: exp.descripcion,
      categoria: exp.categoria,
      alcaldia: exp.alcaldiaCDMX,
      ubicacion: exp.ubicacionDetallada,
      precio: Number(exp.precio),
      duracionMinutos: exp.duracionMinutos,
      capacidadCarga: exp.capacidadCarga,
      proveedor: exp.proveedor.nombreNegocio,
      estadoSello: exp.proveedor.estadoValidacion,
      rating: Number(promedio.toFixed(1)),
      totalResenas,
    };
  });
}

export async function POST(req: NextRequest) {
  try {
    // 1. Requisito de Inicio de Sesión
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json(
        {
          success: false,
          error: "Debes iniciar sesión para interactuar con el recomendador con IA.",
          requiresAuth: true,
        },
        { status: 401 }
      );
    }

    const userId = session.user.id;
    const now = Date.now();
    const lastRequest = cooldowns.get(userId);

    // 2. Cooldown para evitar spam (20 segundos)
    if (lastRequest && now - lastRequest < COOLDOWN_SECONDS * 1000) {
      const remainingSeconds = Math.ceil(
        (COOLDOWN_SECONDS * 1000 - (now - lastRequest)) / 1000
      );
      return NextResponse.json(
        {
          success: false,
          error: `Por favor espera ${remainingSeconds} segundo${
            remainingSeconds > 1 ? "s" : ""
          } antes de realizar otra consulta.`,
          cooldownRemaining: remainingSeconds,
        },
        { status: 429 }
      );
    }

    const body = await req.json();
    const prompt = body?.prompt?.trim();

    if (!prompt) {
      return NextResponse.json(
        { success: false, error: "Por favor proporciona una consulta o preferencia." },
        { status: 400 }
      );
    }

    // Registramos la marca de tiempo del cooldown
    cooldowns.set(userId, now);

    // Limpieza periódica de cooldowns antiguos para evitar acumulación
    if (cooldowns.size > 2000) {
      const expiredThreshold = now - COOLDOWN_SECONDS * 1000;
      for (const [id, timestamp] of cooldowns.entries()) {
        if (timestamp < expiredThreshold) {
          cooldowns.delete(id);
        }
      }
    }

    const apiKey = process.env.GEMINI_API_KEY?.trim();

    // Si la clave no está configurada, devolvemos un modo seguro con datos de la BD y aviso claro
    if (!apiKey) {
      const fallbackExperiencias = await executeBuscarExperiencias({});
      return NextResponse.json({
        success: true,
        isDemo: true,
        texto:
          "⚠️ Para habilitar recomendaciones inteligentes en tiempo real con Gemini, agrega tu GEMINI_API_KEY en el archivo .env de tu proyecto.\n\nMientras tanto, aquí tienes experiencias sustentables y cooperativas verificadas disponibles en nuestra base de datos:",
        experiencias: fallbackExperiencias,
      });
    }

    const systemInstruction = `Eres el Asistente Experto en Turismo Sustentable de la Ciudad de México.
Tu objetivo es recomendar planes y experiencias turísticas auténticas, ecológicas y de cooperativas locales registradas en la plataforma, evitando estrictamente el greenwashing.
Tienes a tu disposición la herramienta 'buscarExperienciasSustentables' para consultar la base de datos real.
SIEMPRE debes invocar la herramienta para buscar opciones concretas que coincidan con lo que el turista solicita (categoría, alcaldía, presupuesto o palabras clave).
Una vez que recibas los resultados de la herramienta, explica con tono cordial y motivador en español neutro por qué recomiendas esas opciones, destacando su impacto positivo y prácticas ecológicas.`;

    const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`;

    // Paso 1: Enviar prompt con declaración de herramientas (MCP Tool Protocol)
    const primerPayload = {
      contents: [
        {
          role: "user",
          parts: [{ text: prompt }],
        },
      ],
      systemInstruction: {
        parts: [{ text: systemInstruction }],
      },
      tools: TOOLS_DECLARATION,
    };

    const firstRes = await fetch(geminiUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(primerPayload),
    });

    if (!firstRes.ok) {
      const errText = await firstRes.text();
      console.error("Error en Gemini API:", errText);
      throw new Error(`Error en el servicio de Gemini (${firstRes.status})`);
    }

    const firstData = await firstRes.json();
    const candidate = firstData.candidates?.[0];
    const firstParts = candidate?.content?.parts || [];

    // Verificamos si Gemini decidió llamar a nuestra herramienta
    const functionCallPart = firstParts.find((p: any) => p.functionCall);
    let matchedExperiencias: any[] = [];
    let finalText = "";

    if (functionCallPart && functionCallPart.functionCall) {
      const fnCall: GeminiFunctionCall = functionCallPart.functionCall;

      if (fnCall.name === "buscarExperienciasSustentables") {
        matchedExperiencias = await executeBuscarExperiencias(fnCall.args || {});

        // Paso 2: Enviar el resultado de la función de vuelta a Gemini para que elabore la recomendación
        const segundoPayload = {
          contents: [
            {
              role: "user",
              parts: [{ text: prompt }],
            },
            {
              role: "model",
              parts: [{ functionCall: fnCall }],
            },
            {
              role: "function",
              parts: [
                {
                  functionResponse: {
                    name: "buscarExperienciasSustentables",
                    response: {
                      experienciasEncontradas: matchedExperiencias,
                    },
                  },
                },
              ],
            },
          ],
          systemInstruction: {
            parts: [{ text: systemInstruction }],
          },
        };

        const secondRes = await fetch(geminiUrl, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(segundoPayload),
        });

        if (secondRes.ok) {
          const secondData = await secondRes.json();
          const secondParts = secondData.candidates?.[0]?.content?.parts || [];
          finalText = secondParts.map((p: any) => p.text).filter(Boolean).join("\n\n");
        }
      }
    } else {
      // Si respondió con texto directo sin invocar la herramienta, hacemos búsqueda general en BD
      finalText = firstParts.map((p: any) => p.text).filter(Boolean).join("\n\n");
      matchedExperiencias = await executeBuscarExperiencias({ terminoBusqueda: prompt });
    }

    return NextResponse.json({
      success: true,
      isDemo: false,
      texto: finalText || "Aquí tienes las opciones seleccionadas según tu búsqueda:",
      experiencias: matchedExperiencias,
    });
  } catch (error: any) {
    console.error("Error al procesar recomendación con Gemini:", error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || "Error al conectar con el asistente de IA.",
      },
      { status: 500 }
    );
  }
}

