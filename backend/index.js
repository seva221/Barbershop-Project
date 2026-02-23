import express from "express";
import dotenv from "dotenv";
import connectDB from "./lib/connect.js";
import userAuthRoutes from "./routes/auth.user.routes.js";
import businessAuthRoutes from "./routes/auth.business.routes.js";
import resourceRoutes from "./routes/resources.routes.js";
import bookingRoutes from "./routes/booking.routes.js";
import cors from "cors";
import cookieParser from "cookie-parser";

dotenv.config();

const app = express();
app.use(express.json());
app.use(cookieParser());
app.use(cors());

app.use("/uploads", express.static("uploads"));


// Routes

// /api/auth/user/ [register | login]
app.use("/api/auth/user", userAuthRoutes);
app.use("/api/auth/business", businessAuthRoutes);
app.use("/api/resources", resourceRoutes);
app.use("/api/booking", bookingRoutes);

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
