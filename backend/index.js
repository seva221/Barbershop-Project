import express from "express";
import dotenv from "dotenv";
import connectDB from "./lib/connect.js";
import userAuthRoutes from "./routes/auth.user.routes.js";
import businessAuthRoutes from "./routes/auth.business.routes.js";
import cors from "cors";

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());


// Routes
app.use("/api/auth/user", userAuthRoutes);
app.use("/api/auth/business", businessAuthRoutes);

// Global error handler
app.use((err, req, res, next) => {
  console.error(err);
  res.status(err.status || 500).json({
    message: err.message || "Server error",
  });
});

// Start server
const PORT = process.env.PORT || 4000;
connectDB().then(() => {
  app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
});
