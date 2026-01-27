import { z } from "zod";
import mongoose from "mongoose";

/**
 * MongoDB ObjectId validator
 */
const objectId = z
  .string()
  .refine((val) => mongoose.Types.ObjectId.isValid(val), {
    message: "Invalid ObjectId",
  });

/* =========================
   WORKER VALIDATION
========================= */

export const createWorkerSchema = z.object({
  name: z
    .string()
    .min(2, "Worker name must be at least 2 characters")
    .regex(/^[A-Za-z\s]+$/, "Worker name must contain letters only"),

  phone: z
    .string()
    .min(10, "Phone number must be at least 10 digits")
    .regex(/^[0-9]+$/, "Phone number must contain numbers only")
    .optional(),
});

/* =========================
   SERVICE VALIDATION
========================= */

export const createServiceSchema = z.object({
  name: z
    .string()
    .min(2, "Service name must be at least 2 characters")
    .max(50, "Service name too long"),

  duration: z
    .number()
    .min(1, "Service duration must be at least 1 minute"), // ✅ allows decimal now

  price: z
    .number()
    .min(0, "Price cannot be negative"),
});
