"use client";
import Link from "next/link";
import FormForgotPassword from "@/components/FormForgotPassword";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { motion } from "framer-motion";

const ForgotPasswordPage = () => {
  return (
    <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
    <Card className="w-full max-w-md">
      
      <CardHeader className="text-center">
        <CardTitle className="text-2xl font-bold">
          Recuperar Contraseña
        </CardTitle>
        <CardDescription className="mb-4">
          Ingresa tu email.
        </CardDescription>
      </CardHeader>

      <CardContent>
        <FormForgotPassword />
      </CardContent>

      <CardFooter className="flex justify-center">
        <p className="text-sm text-muted-foreground">
          ¿Recordaste tu contraseña?{' '}
          <Link 
            href="/login" 
            className="font-medium text-primary hover:underline"
          >
            Inicia sesión
          </Link>
        </p>
      </CardFooter>
    </Card>
    </motion.div>
  )
}

export default ForgotPasswordPage;