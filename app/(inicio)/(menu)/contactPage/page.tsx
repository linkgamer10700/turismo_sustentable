"use client"; // <-- ¡CRUCIAL! Debe ser un Componente de Cliente.

import React from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { 
  ArrowRight, 
  CheckCircle, 
  LineChart, 
  Mail, 
  Users 
} from "lucide-react";

// --- 1. Importa los componentes de animación ---
import { Fade, Slide } from "react-awesome-reveal";

export default function ContactPage() {
  return (
    <div className="container mx-auto max-w-5xl py-16 px-4">
      
      {/* --- 2. Animación para el Encabezado --- */}
      <Fade direction="down" triggerOnce>
        <div className="text-center mb-12">
          <h1 className="text-4xl font-extrabold tracking-tight mb-3">
            Lleva tu soporte al siguiente nivel
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Descubre cómo Ticko puede transformar la gestión de incidencias en tu empresa.
            Solicita una demo personalizada hoy mismo.
          </p>
        </div>
      </Fade>

      {/* Grid: Formulario a la izquierda, Info/Beneficios a la derecha */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
        
        {/* --- 3. Animación para la Columna 1 (Formulario) --- */}
        <Slide direction="left" triggerOnce>
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">Solicita una Demo Gratuita</CardTitle>
              <CardDescription>
                Completa tus datos y un especialista se pondrá en contacto 
                a la brevedad.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form className="space-y-4">
                {/* ... (Contenido del formulario sin cambios) ... */}
                <div className="space-y-2">
                  <Label htmlFor="name">Nombre Completo</Label>
                  <Input id="name" placeholder="Tu nombre" />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="email">Email de Trabajo</Label>
                  <Input id="email" type="email" placeholder="nombre@tuempresa.com" />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="company">Nombre de la Empresa</Label>
                  <Input id="company" placeholder="Tu Empresa S.A. de C.V." />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="company-size">Tamaño de la Empresa</Label>
                  <Select>
                    <SelectTrigger id="company-size">
                      <SelectValue placeholder="Selecciona un rango..." />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1-10">1-10 empleados</SelectItem>
                      <SelectItem value="11-50">11-50 empleados</SelectItem>
                      <SelectItem value="51-200">51-200 empleados</SelectItem>
                      <SelectItem value="201-500">201-500 empleados</SelectItem>
                      <SelectItem value="501+">Más de 500 empleados</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="message">¿Cómo podemos ayudarte?</Label>
                  <Textarea id="message" placeholder="Ej: 'Me gustaría ver cómo funcionan los reportes...'" rows={4} />
                </div>
                
                <Button type="submit" className="w-full" size="lg">
                  Solicitar Demo
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </form>
            </CardContent>
          </Card>
        </Slide>

        {/* --- 4. Animación para la Columna 2 (Corregido) --- */}
        {/* Volvemos a poner el <div> para mantener la estructura del grid
            y el espaciado 'space-y-6'.
        */}
        <div className="space-y-6">
          
          {/* El <Fade> ahora va ADENTRO, envolviendo solo
              a las tarjetas que queremos animar.
          */}
          <Fade 
            direction="right" 
            cascade 
            damping={0.2} 
            triggerOnce
          >
            <Card>
              <CardHeader>
                <CardTitle>¿Qué obtienes con Ticko?</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-primary flex-shrink-0 mt-1" />
                  <p className="text-muted-foreground">
                    <strong className="text-foreground">Centralización total: </strong> 
                    Todos tus tickets de soporte en un solo lugar.
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <Users className="h-5 w-5 text-primary flex-shrink-0 mt-1" />
                  <p className="text-muted-foreground">
                    <strong className="text-foreground">Asignación clara: </strong> 
                    Asigna responsables a cada ticket y da seguimiento.
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <LineChart className="h-5 w-5 text-primary flex-shrink-0 mt-1" />
                  <p className="text-muted-foreground">
                    <strong className="text-foreground">Reportes y Métricas: </strong> 
                    Mide el tiempo de respuesta y la eficiencia de tu equipo.
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Mail className="h-5 w-5 text-primary" />
                  Contacto Directo de Ventas
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <p className="text-muted-foreground">
                  ¿Eres una gran empresa (Enterprise) o prefieres hablar con nosotros primero?
                </p>
                <a 
                  href="mailto:ventas@ticko.com"
                  className="font-medium text-primary hover:underline text-lg"
                >
                  ventas@ticko.com
                </a>
              </CardContent>
            </Card>
          </Fade>
        </div>
      </div>
    </div>
  )
}