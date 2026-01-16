// routes/auth.user.routes.js
import express from "express";
import { registerUser, loginUser } from "../controllers/auth.user.controller.js";

const router = express.Router();

// /api/auth/user/ [register | login]
router.post("/register", registerUser);
router.post("/login", loginUser);

export default router;
