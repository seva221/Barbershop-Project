// validations/business.auth.schema.js
import { z } from "zod";

export const registerBusinessSchema = z.object({
  name: z.string().min(2, "Business name is required"), // Business name
  category: z.string().optional(),                       // Optional category
  email: z.string().email("Valid email required"),      // Business / owner email
  password: z.string().min(6, "Password must be at least 6 chars"), // Plain password
});

export const loginBusinessSchema = z.object({
  email: z.string().email("Valid email required"),
  password: z.string().min(6, "Password must be at least 6 chars"),
});
