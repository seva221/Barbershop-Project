import { z } from "zod";

export const registerSchema = z.object({
  name: z.string("Name must be string").min(2, "Name must be at least 2 characters"),
  email: z.string("Email must be string").email("Invalid email address"),
  phone: z
  .string("Phone number must be string")
  .min(10, "Phone number must be at least 10 digits")
  .regex(/^[0-9]+$/, "Phone number must contain numbers only"),
  password: z
    .string("Password must be string")
    .min(8, "Password must be at least 8 characters long")
    .regex(/\d/, "Password must contain at least one number")
    .regex(/[!@#$%^&*]/, "Password must contain at least one special character"),

  role: z.enum(["customer", "business"]).optional(),
  businessId: z.string().optional(),
});


export const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});
