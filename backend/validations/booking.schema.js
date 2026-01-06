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

/**
 * Guest details validation
 */
const guestDetailsSchema = z.object({
  name: z
    .string()
    .min(2, "Name must be at least 2 characters")
    .regex(/^[A-Za-z\s]+$/, "Name must contain letters only"),
    
  phone: z
    .string()
    .min(10, "Phone number must be at least 10 digits")
    .regex(/^[0-9]+$/, "Phone number must contain numbers only"),
});

/**
 * Create booking schema
 */
export const createBookingSchema = z
  .object({
    businessId: objectId,
    workerId: objectId,
    serviceId: objectId,

    customerId: objectId.optional(),
    guestDetails: guestDetailsSchema.optional(),

    date: z
      .string()
      .or(z.date())
      .transform((val) => new Date(val))
      .refine((date) => !isNaN(date.getTime()), {
        message: "Invalid date",
      })
      .refine((date) => date > new Date(), {
        message: "Booking date must be in the future",
      }),
  })
  .refine(
    (data) => data.customerId || data.guestDetails,
    {
      message: "Either customerId or guestDetails must be provided",
      path: ["customerId"],
    }
  );
