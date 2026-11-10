"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ModeToggle } from "@/components/ThemeToggle";
import { useState, useEffect } from "react";
import { logout } from "@/actions/login";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface SessionUser {
  id: string;
  name: string | null;
  email: string | null;
  rol: string;
}

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [user, setUser] = useState<SessionUser | null>(null);
  const [isLoadingUser, setIsLoadingUser] = useState(true);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Fetch authenticated session status on mount and path change
  useEffect(() => {
    let isMounted = true;
    async function checkSession() {
      try {
        const res = await fetch("/api/user/profile");
        if (res.ok) {
          const data = await res.json();
          if (data.success && data.data && isMounted) {
            setUser(data.data);
            setIsLoadingUser(false);
            return;
          }
        }
      } catch {
        // Not authenticated or network error
      }
      if (isMounted) {
        setUser(null);
        setIsLoadingUser(false);
      }
    }

    checkSession();
    return () => {
      isMounted = false;
    };
  }, [pathname]);

  const navLinks = user?.rol === "ADMINISTRADOR"
    ? [
        { name: "Home", href: "/" },
        { name: "Evidencias", href: "/admin/auditorias" },
        { name: "Panel BI", href: "/admin/panel-bi" },
        { name: "Auditor", href: "/admin/dashboard" },
        { name: "Catálogo", href: "/busqueda" },
        { name: "Acerca de", href: "/aboutPage" },
      ]
    : user?.rol === "PROVEEDOR"
    ? [
        { name: "Home", href: "/" },
        { name: "Mi Negocio", href: "/negocio/dashboard" },
        { name: "Documentos", href: "/negocio/documentos" },
        { name: "Reservas", href: "/reservas" },
        { name: "Catálogo", href: "/busqueda" },
        { name: "Acerca de", href: "/aboutPage" },
      ]
    : [
        { name: "Home", href: "/" },
        { name: "Explorar", href: "/busqueda" },
        { name: "Recomendaciones", href: "/recomendaciones" },
        { name: "Reservas", href: "/reservas" },
        { name: "Acerca de", href: "/aboutPage" },
        { name: "Colab", href: "/contactPage" },
      ];

  const getInitials = (name?: string | null, email?: string | null) => {
    if (name) {
      const parts = name.trim().split(" ");
      if (parts.length >= 2) return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
      return parts[0].substring(0, 2).toUpperCase();
    }
    if (email) return email.substring(0, 2).toUpperCase();
    return "TS";
  };

  const handleCerrarSesion = async () => {
    setUser(null);
    await logout();
  };

  return (
    <header
      className={`
        sticky top-0 z-50 w-full border-b 
        transition-all duration-300 ease-in-out
        ${
          isScrolled
            ? "bg-background/95 backdrop-blur-lg shadow-md"
            : "bg-background/80 backdrop-blur-sm shadow-none"
        }
      `}
    >
      <div className="container mx-auto flex h-16 items-center justify-between px-4 lg:px-8">
        {/* Contenedor del logo */}
        <div className="flex items-center">
          <Link
            href="/"
            className="text-sm font-bold tracking-widest text-foreground flex items-center gap-2 ml-2"
          >
            <div className="bg-green-700/10 p-1.5 rounded-full flex items-center justify-center">
              <Image src="/hoja.svg" alt="Hoja" width={16} height={16} />
            </div>
            <span>TURISMO SUSTENTABLE</span>
          </Link>
        </div>

        {/* Navegación central */}
        <nav className="hidden items-center gap-6 md:flex">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.name}
                href={link.href}
                className={`relative text-sm font-medium transition-colors ${
                  isActive ? "text-foreground" : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {link.name}
                {isActive && (
                  <span className="absolute -bottom-2.5 left-1/2 -translate-x-1/2 block w-1.5 h-1.5 bg-[#728C69] rounded-full" />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Acciones de usuario y tema */}
        <div className="flex items-center gap-3">
          <ModeToggle />

          {!isLoadingUser && user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  className="rounded-full pl-2 pr-3.5 h-10 flex items-center gap-2 border-gray-200 dark:border-white/10 hover:border-[#728C69] transition-all"
                >
                  <span className="w-7 h-7 rounded-full bg-[#728C69] text-white text-xs font-bold flex items-center justify-center">
                    {getInitials(user.name, user.email)}
                  </span>
                  <span className="text-xs font-medium max-w-[100px] truncate hidden sm:inline-block">
                    {user.name?.split(" ")[0] || "Mi cuenta"}
                  </span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56 p-2 rounded-2xl shadow-lg">
                <DropdownMenuLabel className="px-2 py-1.5">
                  <p className="text-sm font-semibold text-foreground truncate">
                    {user.name || "Usuario"}
                  </p>
                  <p className="text-xs text-muted-foreground truncate">{user.email}</p>
                  <span className="inline-block mt-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#728C69]/15 text-[#728C69] dark:text-[#A5B29A] uppercase tracking-wider">
                    {user.rol}
                  </span>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />

                {user.rol === "ADMINISTRADOR" ? (
                  <>
                    <DropdownMenuItem asChild>
                      <Link
                        href="/admin/auditorias"
                        className="cursor-pointer text-xs font-medium py-2 text-[#C81D77] dark:text-[#E24A96]"
                      >
                        Evidencias y Auditorías
                      </Link>
                    </DropdownMenuItem>

                    <DropdownMenuItem asChild>
                      <Link href="/admin/panel-bi" className="cursor-pointer text-xs font-medium py-2">
                        Panel BI y Métricas
                      </Link>
                    </DropdownMenuItem>

                    <DropdownMenuItem asChild>
                      <Link href="/admin/dashboard" className="cursor-pointer text-xs font-medium py-2">
                        Panel General Admin
                      </Link>
                    </DropdownMenuItem>

                    <DropdownMenuItem asChild>
                      <Link href="/perfil/editar" className="cursor-pointer text-xs font-medium py-2">
                        Datos de la Cuenta
                      </Link>
                    </DropdownMenuItem>

                    <DropdownMenuItem asChild>
                      <Link href="/perfil/preferencias" className="cursor-pointer text-xs font-medium py-2">
                        Preferencias de Sistema
                      </Link>
                    </DropdownMenuItem>
                  </>
                ) : user.rol === "PROVEEDOR" ? (
                  <>
                    <DropdownMenuItem asChild>
                      <Link
                        href="/negocio/dashboard"
                        className="cursor-pointer text-xs font-medium py-2 text-[#728C69] dark:text-[#A5B29A]"
                      >
                        Mi Cuenta (Negocio)
                      </Link>
                    </DropdownMenuItem>

                    <DropdownMenuItem asChild>
                      <Link href="/negocio/documentos" className="cursor-pointer text-xs font-medium py-2">
                        Documentos y Evidencias
                      </Link>
                    </DropdownMenuItem>

                    <DropdownMenuItem asChild>
                      <Link href="/reservas" className="cursor-pointer text-xs font-medium py-2">
                        Reservas Recibidas
                      </Link>
                    </DropdownMenuItem>

                    <DropdownMenuItem asChild>
                      <Link href="/perfil/editar" className="cursor-pointer text-xs font-medium py-2">
                        Datos de la Cuenta
                      </Link>
                    </DropdownMenuItem>

                    <DropdownMenuItem asChild>
                      <Link href="/perfil/preferencias" className="cursor-pointer text-xs font-medium py-2">
                        Preferencias
                      </Link>
                    </DropdownMenuItem>
                  </>
                ) : (
                  <>
                    <DropdownMenuItem asChild>
                      <Link href="/perfil" className="cursor-pointer text-xs font-medium py-2">
                        Mi Perfil
                      </Link>
                    </DropdownMenuItem>

                    <DropdownMenuItem asChild>
                      <Link href="/reservas" className="cursor-pointer text-xs font-medium py-2">
                        Mis Reservas
                      </Link>
                    </DropdownMenuItem>

                    <DropdownMenuItem asChild>
                      <Link href="/perfil/favoritos" className="cursor-pointer text-xs font-medium py-2">
                        Favoritos
                      </Link>
                    </DropdownMenuItem>

                    <DropdownMenuItem asChild>
                      <Link href="/perfil/editar" className="cursor-pointer text-xs font-medium py-2">
                        Datos de la Cuenta
                      </Link>
                    </DropdownMenuItem>

                    <DropdownMenuItem asChild>
                      <Link href="/perfil/preferencias" className="cursor-pointer text-xs font-medium py-2">
                        Preferencias
                      </Link>
                    </DropdownMenuItem>
                  </>
                )}

                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={handleCerrarSesion}
                  className="cursor-pointer text-xs font-medium py-2 text-red-600 dark:text-red-400 focus:text-red-600 focus:bg-red-50 dark:focus:bg-red-950/30"
                >
                  Cerrar sesión
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button
              variant="outline"
              className="rounded-full px-5 h-10 flex items-center gap-2 border-gray-200 dark:border-white/10 hover:border-[#728C69] transition-all"
              asChild
            >
              <Link href="/login/loginUser">
                <Image src="/usuario.svg" alt="Usuario" width={16} height={16} />
                <span className="text-xs font-medium">Login</span>
              </Link>
            </Button>
          )}
        </div>
      </div>
    </header>
  );
}
