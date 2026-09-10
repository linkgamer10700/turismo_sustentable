import type { Metadata } from "next";
import "../globals.css";
import AuthHeader from "@/components/AuthHeader";
import { ThemeProvider } from "@/components/ThemeProvider";

import "@/components/ThemeToggle"; 

export const metadata: Metadata = {
  title: "Acceso - Ticko",
  description: "Iniciar sesión o registrarse en el sistema Ticko.",
};

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es" suppressHydrationWarning>
      
      <body>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <AuthHeader />
          
          <main className="flex flex-grow items-center justify-center p-4 
                           bg-gray-50 dark:bg-zinc-950">
            {children}
          </main>
          
        </ThemeProvider>
      </body>
    </html>
  );
}

//Ver porque no cambia el tema