// server.js
import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./lib/connect.js";

import userAuthRoutes from "./routes/auth.user.routes.js";
import businessAuthRoutes from "./routes/auth.business.routes.js";

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/auth/user", userAuthRoutes);
app.use("/api/auth/business", businessAuthRoutes);

const PORT = process.env.PORT || 4000;
connectDB().then(() =>
  app.listen(PORT, () => console.log(`🚀 Server running on ${PORT}`))
);
