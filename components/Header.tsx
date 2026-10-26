"use client";

import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { ModeToggle } from "@/components/ThemeToggle"
import { useState, useEffect } from 'react'

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Acerca de', href: '/aboutPage' },
    { name: 'Colab', href: '/contactPage' }, 
    { name: 'Home', href: '/' },
    { name: 'Recomendaciones', href: '#' }, 
    { name: 'Reservas', href: '#' }, 
  ];

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
      <div className="container mx-auto flex h-[4.75rem] items-center justify-between px-12">
        
        <div className="flex items-center gap-4">
          <button className="p-1 transition-opacity hover:opacity-70">
            <Image src="/menu.svg" alt="Menú" width={24} height={24} />
          </button>

          <Link href="/" className="text-sm font-bold tracking-widest text-foreground flex items-center gap-2 ml-2">
            <div className="bg-green-700/10 p-1.5 rounded-full flex items-center justify-center">
              <Image src="/hoja.svg" alt="Hoja" width={16} height={16} />
            </div>
            <span>TURISMO SUSTENTABLE</span>
          </Link>
        </div>

        <nav className="hidden items-center gap-8 md:flex">
          {navLinks.map((link) => {

            const isActive = pathname === link.href;

            return (
              <Link 
                key={link.name}
                href={link.href} 
                className={`relative text-sm font-medium transition-colors ${
                  isActive ? 'text-foreground' : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                {link.name}

                {isActive && (
                  <span className="absolute -bottom-2.5 left-1/2 -translate-x-1/2 block w-1.5 h-1.5 bg-[#D81B60] rounded-full"></span>
                )}
              </Link>
            )
          })}
        </nav>


        <div className="flex items-center gap-4">
          <ModeToggle />
          <Button variant="outline" className="rounded-full px-6 flex items-center gap-2" asChild>
            <Link href="/login/loginUser">
              <Image src="/usuario.svg" alt="Usuario" width={16} height={16} />
              Login / Sign in
            </Link>
          </Button>
        </div>
      </div>
    </header>
  )
}