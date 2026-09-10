"use client";

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ModeToggle } from "@/components/ThemeToggle"
import { useState, useEffect } from 'react'

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header 
      className={`
        sticky top-0 z-50 w-full border-b 
        transition-all duration-300 ease-in-out
        ${isScrolled 
          ? 'bg-background/95 backdrop-blur-lg shadow-md'
          : 'bg-background/80 backdrop-blur-sm shadow-none'
        }
      `}
    >
      <div className="container mx-auto flex h-14 items-center justify-between px-4">
        
        <Link href="/" className="text-xl font-bold text-foreground">
          Ticko
        </Link>

        <nav className="hidden items-center gap-6 md:flex">
          <Link 
            href="/" 
            className="text-sm font-medium text-muted-foreground hover:text-foreground"
          >
            Inicio
          </Link>
          <Link 
            href="/aboutPage" 
            className="text-sm font-medium text-muted-foreground hover:text-foreground"
          >
            Acerca de
          </Link>
          <Link 
            href="/contactPage" 
            className="text-sm font-medium text-muted-foreground hover:text-foreground"
          >
            Contacto
          </Link>
        </nav>

        <div className="flex items-center gap-3">
          <ModeToggle />
          <Button variant="ghost" size="sm" asChild>
            <Link href="/login">Iniciar Sesión</Link>
          </Button>
          <Button size="sm" asChild>
            <Link href="/register">Registrarse</Link>
          </Button>
        </div>
      </div>
    </header>
  )
}