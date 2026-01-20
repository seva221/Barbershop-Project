import { z } from "zod";
import mongoose from "mongoose";

const objectId = z.string().refine(
  (val) => mongoose.Types.ObjectId.isValid(val),
  { message: "Invalid ObjectId" }
);

export const registerBusinessSchema = z.object({
  name: z.string().min(2),
  ownerId: objectId,
  category: z.string().optional(),
  email: z.string().email(),
  password: z.string().min(6),
});

export const loginBusinessSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});
