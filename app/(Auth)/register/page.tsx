"use client";
import Link from "next/link";
import FormRegister from "@/components/FormRegister";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { motion } from "framer-motion";

const RegisterPage = () => {
  return (
    <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
    <Card className="w-full max-w-md">
      
      <CardHeader className="text-center">
        <CardTitle className="text-2xl font-bold">
          Crear una cuenta
        </CardTitle>
        <CardDescription className="mb-4">
          Regístrate para empezar a usar Ticko.
        </CardDescription>
      </CardHeader>

      <CardContent>
        <FormRegister />
      </CardContent>

      <CardFooter className="flex justify-center">
        <p className="text-sm text-muted-foreground">
          ¿Ya tienes una cuenta?{' '}
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

export default RegisterPage;