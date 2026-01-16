// routes/auth.user.routes.js
import express from "express";
import authMiddleware from "../middleware/auth.middleware.js"

import { registerUser, loginUser } from "../controllers/auth.user.controller.js";

const router = express.Router();

// the middleware handles JWT confirmation
// if none or incorrect -> reject (400, 401) 
router.post("/register", authMiddleware, registerUser);
router.post("/login", authMiddleware, loginUser);

export default router;
