"use client";

import Link from "next/link";
import FormLogin from "@/components/FormLoginAdmin";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { motion } from "framer-motion";

const LoginPage = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold">
            Acceso de Administrador
          </CardTitle>
          <CardDescription className="mb-4">
            Inicia sesión con tu cuenta de administrador.
          </CardDescription>
        </CardHeader>

        <CardContent>
          <FormLogin />
        </CardContent>

        <CardFooter className="flex flex-col items-center space-y-4">
          <Link
            href="/login/Password"
            className="text-sm font-medium text-primary hover:underline"
          >
            ¿Olvidaste tu contraseña?
          </Link>
          
          <Separator className="w-3/4" /> 
          
          <div className="text-center text-sm text-muted-foreground space-y-1">
            <p>
              ¿No tienes una cuenta?{' '}
              <Link 
                href="/register" 
                className="font-medium text-primary hover:underline"
              >
                Regístrate
              </Link>
            </p>
            <p>
              ¿Eres un usuario?{' '}
              <Link 
                href="/login/loginUser" 
                className="font-medium text-primary hover:underline"
              >
                Inicia sesión aquí
              </Link>
            </p>
          </div>
        </CardFooter>
      </Card>
    </motion.div>
  )
}

export default LoginPage;