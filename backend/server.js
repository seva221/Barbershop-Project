import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./lib/connect.js";

// Import Routes
import userAuthRoutes from "./routes/auth.user.routes.js";
import businessAuthRoutes from "./routes/auth.business.routes.js";
import resourceRoutes from "./routes/resources.routes.js"; 

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());

// --- MOUNT ROUTES ---
// 1. User Auth: http://localhost:4000/api/auth/user/...
app.use("/api/auth/user", userAuthRoutes);

// 2. Business Auth: http://localhost:4000/api/auth/business/...
app.use("/api/auth/business", businessAuthRoutes);

// 3. Resources (Workers/Services): http://localhost:4000/api/resources/...
app.use("/api/resources", resourceRoutes);

const PORT = process.env.PORT || 4000;

connectDB().then(() =>
  app.listen(PORT, () => console.log(`🚀 Server running on ${PORT}`))
);