import { z } from "zod";
import mongoose from "mongoose";

const objectId = z.string().refine(
  (val) => mongoose.Types.ObjectId.isValid(val),
  { message: "Invalid ObjectId" }
);

export const registerBusinessSchema = z.object({
  name: z.string().min(2, "שם העסק חייב להכיל לפחות 2 תווים"),
  ownerId: objectId.optional(),
  category: z.string().optional(),
  email: z.string().email("אימייל לא תקין"),
  password: z.string().min(6, "סיסמה חייבת להכיל לפחות 6 תווים"),
  // שינינו ל-required כדי לוודא שהכתובת נכנסת לבסיס הנתונים
  address: z.string().min(1, "כתובת העסק היא שדה חובה"), 
  // הוספת שדה תמונה (אופציונלי - יכול להיות מחרוזת ריקה בהתחלה)
  image: z.string().optional(), 
});

export const loginBusinessSchema = z.object({
  email: z.string().email("אימייל לא תקין"),
  password: z.string().min(6, "סיסמה חייבת להכיל לפחות 6 תווים"),
});