import express from "express";
import authRoutes from "./auth.user.routes.js";

const router = express.Router();

router.use("/auth", authRoutes);

export default router;
