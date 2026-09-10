"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Users, Cpu, Goal, ShieldCheck, MapPin } from 'lucide-react'

import { Fade, Slide } from "react-awesome-reveal";

export default function AboutPage() {
  return (
    <div className="container mx-auto max-w-5xl py-16 px-4 space-y-12">
      
      <Fade direction="down" triggerOnce>
        <section className="text-center">
          <h1 className="text-4xl font-extrabold tracking-tight mb-3">
            Acerca de "Ticko"
          </h1>
          <p className="text-2xl text-muted-foreground">
            Agilizando el soporte y la gestión de incidencias.
          </p>
        </section>
      </Fade>

      <Slide direction="up" triggerOnce>
        <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <Card className="h-full">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-2xl">
                <Goal className="h-6 w-6 text-primary" />
                Nuestra Visión
              </CardTitle>
            </CardHeader>
            <CardContent className="text-muted-foreground">
              <p className="mb-4">El soporte tradicional por email es lento e ineficiente. Las solicitudes se pierden y no hay transparencia en el proceso.</p>
              <p className="text-foreground"> Crear un sistema que se adapte a las necesidades de las personas y con el que cada una de ellas pueda ser beneficiada, con la que podamos transformar la atención al cliente, logrando resolver sus problemas de una forma más rápida.</p>
            </CardContent>
          </Card>
          <Card className="h-full">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-2xl">
                <ShieldCheck className="h-6 w-6 text-primary" />
                Materia y Objetivo
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <p><strong>Materia:</strong> Análisis y Diseño de Sistemas (ADS)</p>
              <p><strong>Objetivo:</strong> Mejorar la eficiencia operativa, reducir los tiempos de resolución, aumentar la satisfacción del cliente ofreciendo datos y métricas confiables para una toma de decisiones informada y la optimización continua de los procesos de soporte. </p>
            </CardContent>
          </Card>
        </section>
      </Slide>

      <section className="text-center">
        <Slide direction="up" triggerOnce>
          <h2 className="text-3xl font-bold mb-8 flex items-center justify-center gap-3">
            <Users className="h-8 w-8" />
            Conoce al Equipo
          </h2>
        </Slide>
        
        <Fade direction="up" cascade damping={0.1} triggerOnce>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            <Card>
              <CardHeader className="p-4">
                <CardTitle className="text-base">Christian</CardTitle>
                <CardDescription>Asistente de Servidor</CardDescription>
              </CardHeader>
            </Card>
            <Card>
              <CardHeader className="p-4">
                <CardTitle className="text-base">Santiago</CardTitle>
                <CardDescription>Lider de Backend</CardDescription>
              </CardHeader>
            </Card>
            <Card>
              <CardHeader className="p-4">
                <CardTitle className="text-base">Uriel</CardTitle>
                <CardDescription>Lider de Frontend</CardDescription>
              </CardHeader>
            </Card>
            <Card>
              <CardHeader className="p-4">
                <CardTitle className="text-base">Jonathan</CardTitle>
                <CardDescription>Lider de Servidor</CardDescription>
              </CardHeader>
            </Card>
            <Card>
              <CardHeader className="p-4">
                <CardTitle className="text-base">Julian</CardTitle>
                <CardDescription>Asistente de Frontend</CardDescription>
              </CardHeader>
            </Card>
          </div>
        </Fade>
      </section>

      <Slide direction="up" triggerOnce>
        <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-2xl">
                <MapPin className="h-6 w-6" />
                Ubicación ESCOM - IPN
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <address className="not-italic text-muted-foreground">
                Av. Juan de Dios Bátiz s/n esq. Miguel Othón de Mendizábal, <br />
                Col. Nueva Industrial Vallejo, Alcaldía Gustavo A. Madero, <br />
                C.P. 07738, Ciudad de México, México.
              </address>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="w-full h-48 bg-muted dark:bg-zinc-900 rounded-lg flex items-center justify-center">
                <p className="text-muted-foreground">(Espacio para mapa de Google Maps)</p>
              </div>
            </CardContent>
          </Card>

        </section>
      </Slide>

      <section>
        <Slide direction="up" triggerOnce>
          <h2 className="text-3xl font-bold text-center mb-8 flex items-center justify-center gap-3">
            <Cpu className="h-8 w-8" />
            Nuestro Stack Tecnológico
          </h2>
        </Slide>
        
        <ul className="list-disc list-inside space-y-2 max-w-2xl mx-auto text-muted-foreground">
          <Fade direction="left" cascade damping={0.2} triggerOnce>
            <li><strong>Next.js & React:</strong> Interfaz veloz y renderizado en el servidor (SSR).</li>
            <li><strong>Prisma ORM:</strong> Gstión de base de datos segura y tipada con PostgreSQL.</li>
            <li><strong>Auth.js (v5):</strong> Proteccion de rutas y gestion de autenticación.</li>
            <li><strong>Tailwind & shadcn/ui:</strong> Diseño moderno y un desarrollo ágil de componentes.</li>
          </Fade>
        </ul>
      </section>

    </div>
  )
}