import { z } from "zod";
import mongoose from "mongoose";

const objectId = z
  .string()
  .refine((val) => mongoose.Types.ObjectId.isValid(val), {
    message: "Invalid ObjectId",
  });


export const registerBusinessSchema = z.object({
  name: z.string().min(2, "Business name must be at least 2 characters"),
  ownerId: objectId,
  category: z.string().optional(),
});


export const loginBusinessSchema = z.object({
  businessId: objectId,
  ownerId: objectId,
});
