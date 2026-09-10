"use client";

import Link from 'next/link'
import { Button } from '@/components/ui/button' 
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Ticket, Users, BarChartHorizontal, ArrowRight } from 'lucide-react' 

import { TypeAnimation } from 'react-type-animation'
import { Fade, Slide } from "react-awesome-reveal"

const HomePage = () => {
  return (
    <>
      <section className="container mx-auto px-4 py-24">
        <div className="grid grid-cols-1 md:grid-cols-2 items-center gap-12">
          
          <div className="space-y-6">
            <TypeAnimation
              sequence={[
                'Transforma tu Soporte al Cliente con Ticko',
                2000,
                'Centraliza, Gestiona y Resuelve Incidencias',
                2000,
                'Reportes, Métricas y Asignación de Equipo',
                2000,
              ]}
              wrapper="h1"
              speed={40}
              className="text-4xl md:text-5xl font-extrabold tracking-tight"
              repeat={Infinity}
            />
            
            <p className="text-lg text-muted-foreground max-w-xl">
              Centraliza, gestiona y resuelve todas las incidencias de tus clientes
              en una plataforma simple y potente.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <Button size="lg" asChild>
                <Link href="/register">Comenzar Ahora</Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link href="/contactPage">
                  Solicitar una Demo
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
          
          <div className="bg-muted rounded-lg h-80 w-full flex items-center justify-center">
            <p className="text-muted-foreground">(No se que poner aqui pero se ve chido C:)</p>
          </div>
          
        </div>
      </section>

      <section className="bg-gray-50 dark:bg-zinc-950 py-24 px-4">
        <div className="container mx-auto text-center">
          
          <h2 className="text-3xl font-bold mb-4">
            Todo lo que necesitas en un solo lugar
          </h2>
          <p className="text-lg text-muted-foreground mb-12 max-w-2xl mx-auto">
            Desde la creación del ticket hasta la resolución, Ticko optimiza tu flujo de trabajo.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            
            <Fade direction="up" cascade damping={0.2} triggerOnce>
              <div className="bg-card text-card-foreground p-6 rounded-lg shadow-md text-left space-y-3 h-full">
                <Ticket className="h-10 w-10 text-primary" />
                <h3 className="text-xl font-bold">Gestión Centralizada</h3>
                <p className="text-muted-foreground">
                  Recibe y gestiona tickets de múltiples canales en una bandeja de entrada unificada.
                </p>
              </div>
              
              <div className="bg-card text-card-foreground p-6 rounded-lg shadow-md text-left space-y-3 h-full">
                <Users className="h-10 w-10 text-primary" />
                <h3 className="text-xl font-bold">Asignación de Equipo</h3>
                <p className="text-muted-foreground">
                  Asigna tickets automáticamente a los agentes correctos basado en reglas o departamento.
                </p>
              </div>
              
              <div className="bg-card text-card-foreground p-6 rounded-lg shadow-md text-left space-y-3 h-full">
                <BarChartHorizontal className="h-10 w-10 text-primary" />
                <h3 className="text-xl font-bold">Reportes y Métricas</h3>
                <p className="text-muted-foreground">
                  Mide el tiempo de respuesta, la satisfacción del cliente y el rendimiento de tu equipo.
                </p>
              </div>
            
            </Fade>
          </div>
        </div>
      </section>

      <Slide direction="up" triggerOnce>
        <section className="container mx-auto text-center py-24 px-4">
          <h2 className="text-3xl font-bold mb-4">
            ¿Listo para optimizar tu soporte?
          </h2>
          <p className="text-lg text-muted-foreground mb-8 max-w-xl mx-auto">
            No dejes que otro ticket se pierda. Únete a las empresas que ya
            confían en Ticko para gestionar su soporte.
          </p>
          <Button size="lg" asChild>
            <Link href="/contactPage">Solicita tu Demo Gratuita</Link>
          </Button>
        </section>
      </Slide>
    </>
  )
}

export default HomePage

// Checar porque no aparecen las tarjetas al scrollear para abajo 