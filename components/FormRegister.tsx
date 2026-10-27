"use client";

import { z } from "zod";
import { registerSchema } from "@/lib/zod";
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
import { register } from "@/actions/register";
import { useState, useTransition } from "react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { ExclamationTriangleIcon, CheckCircledIcon } from "@radix-ui/react-icons";

const FormRegister = () => {
  const [error, setError] = useState<string | undefined>("");
  const [success, setSuccess] = useState<string | undefined>("");
  const [isPending, startTransition] = useTransition();

  const form = useForm<z.infer<typeof registerSchema>>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      email: "",
      password: "",
      name: "",
      phone: "",
    },
  });

  function onSubmit(values: z.infer<typeof registerSchema>) {
    setError("");
    setSuccess("");

    startTransition(() => {
      register(values).then((data) => {
        if (data.error) {
          setError(data.error);
        }
        if (data.success) {
          setSuccess(data.success);
        }
      });
    });
  }

  return (
    <>
      <div className="w-12 h-12 rounded-full bg-[#EBE9E0] dark:bg-[#2A352F] flex items-center justify-center mb-6">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#3B523E" className="dark:stroke-[#A5B29A]" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
          <circle cx="9" cy="7" r="4" />
          <line x1="19" y1="8" x2="19" y2="14" />
          <line x1="22" y1="11" x2="16" y2="11" />
        </svg>
      </div>
      <h2 className="font-serif text-3xl lg:text-4xl text-[#1E201D] dark:text-white mb-2">Crear Cuenta</h2>
      <p className="text-sm text-[#63665E] dark:text-[#9EA399] mb-8">Únete a nuestra comunidad sustentable.</p>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">

          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem className="space-y-1.5">
                <FormLabel className="text-xs font-medium text-[#232621] dark:text-[#D1D5CD]">Nombre Completo</FormLabel>
                <FormControl>
                  <Input 
                    disabled={isPending} 
                    placeholder="Tu nombre" 
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
            name="email"
            render={({ field }) => (
              <FormItem className="space-y-1.5">
                <FormLabel className="text-xs font-medium text-[#232621] dark:text-[#D1D5CD]">Email</FormLabel>
                <FormControl>
                  <Input
                    disabled={isPending}
                    type="email"
                    placeholder="ejemplo@correo.com"
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
            name="phone"
            render={({ field }) => (
              <FormItem className="space-y-1.5">
                <FormLabel className="text-xs font-medium text-[#232621] dark:text-[#D1D5CD]">Teléfono</FormLabel>
                <FormControl>
                  <Input 
                    disabled={isPending} 
                    type="tel" 
                    placeholder="Ej. 55 1234 5678" 
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
                <FormLabel className="text-xs font-medium text-[#232621] dark:text-[#D1D5CD]">Password</FormLabel>
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

          {error && (
            <Alert variant="destructive">
              <ExclamationTriangleIcon className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {success && (
            <Alert className="text-green-600 border-green-600">
              <CheckCircledIcon className="h-4 w-4" />
              <AlertTitle>Éxito</AlertTitle>
              <AlertDescription>{success}</AlertDescription>
            </Alert>
          )}

          <Button 
            disabled={isPending} 
            type="submit" 
            className="w-full bg-[#C81D77] hover:bg-[#A91864] dark:bg-[#E24A96] dark:hover:bg-[#C81D77] text-white font-medium rounded-xl h-12 mt-4 transition-colors duration-300"
          >
            Crear Cuenta
          </Button>
        </form>
      </Form>
    </>
  );
};
export default FormRegister;