"use client";

import { useRouter } from "next/navigation";
import { z } from "zod";
import { loginSchema } from "@/lib/zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { login } from "@/actions/login";
import { useState, useTransition } from "react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { ExclamationTriangleIcon } from "@radix-ui/react-icons";
import Link from "next/link"; 

const FormLoginUser = () => {
  const [error, setError] = useState<string | undefined>("");
  const [success, setSuccess] = useState<string | undefined>(""); 
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const form = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
      // Se eliminó 'company' de los valores por defecto
    },
  });

  function onSubmit(values: z.infer<typeof loginSchema>) {
    setError("");
    setSuccess("");

    startTransition(() => {
      login(values).then((data) => {
        if (data?.error) {
          setError(data.error); // Si la contraseña está mal, muestra el error
        } else {
          // 👇 Si todo salió bien, simula la sesión y redirige
          localStorage.setItem("userToken", "fake-token-123");
          router.push("/perfil");
        }
      });
    });
  }

  return (
    <>
      <div className="w-12 h-12 rounded-full bg-[#EBE9E0] dark:bg-[#2A352F] flex items-center justify-center mb-6">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#3B523E" className="dark:stroke-[#A5B29A]" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z" />
          <path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12" />
        </svg>
      </div>
      <h2 className="font-serif text-3xl lg:text-4xl text-[#1E201D] dark:text-white mb-2">Bienvenido de nuevo</h2>
      <p className="text-sm text-[#63665E] dark:text-[#9EA399] mb-8">Inicia sesión para planear tu próxima escapada.</p>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem className="space-y-1.5">
                <FormLabel className="text-xs font-medium text-[#232621] dark:text-[#D1D5CD]">Correo / Usuario</FormLabel>
                <FormControl>
                  <Input
                    disabled={isPending}
                    type="email"
                    placeholder="usuario@correo.com"
                    className="w-full bg-[#F2EFE9] dark:bg-[#18201C] text-[#232621] dark:text-white placeholder-[#8C9287] dark:placeholder-[#63665E] rounded-xl px-4 h-12 text-sm focus:outline-none focus:ring-2 focus:ring-[#C81D77]/50 border border-transparent dark:border-white/5 transition-colors duration-300"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem className="space-y-1.5">
                <FormLabel className="text-xs font-medium text-[#232621] dark:text-[#D1D5CD]">Contraseña</FormLabel>
                <FormControl>
                  <Input 
                    disabled={isPending} 
                    type="password" 
                    placeholder="••••••••" 
                    className="w-full bg-[#F2EFE9] dark:bg-[#18201C] text-[#232621] dark:text-white placeholder-[#8C9287] dark:placeholder-[#63665E] rounded-xl px-4 h-12 text-sm focus:outline-none focus:ring-2 focus:ring-[#C81D77]/50 border border-transparent dark:border-white/5 transition-colors duration-300"
                    {...field} 
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* El campo de Compañía fue eliminado completamente de aquí */}

          {error && (
            <Alert variant="destructive">
              <ExclamationTriangleIcon className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <Button 
            disabled={isPending} 
            type="submit" 
            className="w-full bg-[#C81D77] hover:bg-[#A91864] dark:bg-[#E24A96] dark:hover:bg-[#C81D77] text-white font-medium rounded-xl h-12 mt-2 transition-colors duration-300"
          >
            Iniciar Sesión
          </Button>
        </form>
      </Form>

      <div className="flex items-center gap-3 my-8">
        <div className="flex-1 h-px bg-[#E3E5D8] dark:bg-white/10" />
        <span className="text-[10px] uppercase font-semibold text-[#8C9287] dark:text-[#63665E] tracking-widest">O continua con</span>
        <div className="flex-1 h-px bg-[#E3E5D8] dark:bg-white/10" />
      </div>

      <div className="space-y-3">
        <button type="button" className="w-full flex items-center justify-center gap-3 bg-[#F2EFE9] dark:bg-[#18201C] hover:bg-[#E5E4DB] dark:hover:bg-[#121815] text-[#232621] dark:text-[#E2E4DE] text-sm font-medium rounded-xl px-4 py-3 border border-transparent dark:border-white/5 transition-colors duration-300">
          <div className="w-5 h-5 rounded-full bg-[#E5E4DB] dark:bg-[#2A352F] flex items-center justify-center text-[10px] font-bold">G</div>
          Continuar con Google
        </button>
        <button type="button" className="w-full flex items-center justify-center gap-3 bg-[#F2EFE9] dark:bg-[#18201C] hover:bg-[#E5E4DB] dark:hover:bg-[#121815] text-[#232621] dark:text-[#E2E4DE] text-sm font-medium rounded-xl px-4 py-3 border border-transparent dark:border-white/5 transition-colors duration-300">
          <div className="w-5 h-5 rounded-full bg-[#E5E4DB] dark:bg-[#2A352F] flex items-center justify-center text-[10px] font-bold">f</div>
          Continuar con Facebook
        </button>
      </div>

      {/* Nueva sección de registro y términos */}
      <div className="mt-8 flex flex-col gap-8">
        <div className="flex justify-between items-center text-sm text-[#63665E] dark:text-[#9EA399]">
          <span>¿Aún no tienes cuenta?</span>
          <Link href="/register" className="text-[#C81D77] dark:text-[#E24A96] font-medium hover:underline">
            Crear perfil
          </Link>
        </div>
        
        <p className="text-center text-xs text-[#63665E] dark:text-[#9EA399]">
          Al continuar, aceptas nuestros Términos y privacidad.
        </p>
      </div>
    </>
  );
};
export default FormLoginUser;