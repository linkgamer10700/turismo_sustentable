import { object, string } from "zod";

export const loginSchema = object({
  email: string()
    .min(1, "Email is required")
    .email("Invalid email"),
  password: string()
    .min(1, "Password is required")
    .min(8, "Password must be more than 8 characters")
    .max(32, "Password must be less than 32 characters"),
  company: string().optional(),
});

export const loginAdminSchema = object({
  email: string()
    .min(1, "Email is required")
    .email("Invalid email"),
  password: string()
    .min(1, "Password is required")
    .min(8, "Password must be more than 8 characters")
    .max(32, "Password must be less than 32 characters"),
});

export const registerSchema = object({
  email: string()
    .min(1, "Email is required")
    .email("Invalid email"),
  password: string()
    .min(1, "Password is required")
    .min(8, "Password must be more than 8 characters")
    .max(32, "Password must be less than 32 characters"),
  name: string()
    .min(1, "Name is required")
    .max(32, "Name must be less than 32 characters"),
  phone: string()
    .min(1, "Phone number is required")
    .max(20, "Phone number must be less than 20 characters"),
});

export const forgotPasswordSchema = object({
  email: string()
    .min(1, "Email is required")
    .email("Invalid email"),
});