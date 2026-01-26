// routes/auth.business.routes.js
import express from "express";
import {
  registerBusiness,
  loginBusiness,
} from "../controllers/auth.business.controller.js";
import authMiddleware from "../middleware/auth.middleware.js";

const router = express.Router();

// the middleware handles JWT confirmation
// if none or incorrect -> reject (400, 401)
router.post("/register",authMiddleware, registerBusiness);
router.post("/login", loginBusiness);

export default router;
