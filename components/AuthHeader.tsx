'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { ModeToggle } from "@/components/ThemeToggle"
import { motion } from 'framer-motion'

export default function AuthHeader() {
  const pathname = usePathname()
  const isOnLoginPage = pathname.includes('/login')

  return (
    <motion.header 
      className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur-sm"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="container mx-auto flex h-14 items-center justify-between px-4">
        
        <Link href="/" className="text-xl font-bold text-foreground">
          Ticko
        </Link>

        <div className="flex items-center gap-3">
          <ModeToggle />
          <nav>
            {isOnLoginPage ? (
              <Button variant="default" asChild>
                <Link href="/register">Regístrate</Link>
              </Button>
            ) : (
              <Button variant="default" asChild>
                <Link href="/login">Iniciar Sesión</Link>
              </Button>
            )}
          </nav>
        </div>
      </div>
    </motion.header>
  )
}