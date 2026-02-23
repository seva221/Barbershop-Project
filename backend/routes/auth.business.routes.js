import express from "express";
import {
  registerBusiness,
  loginBusiness,
  updateBusiness
} from "../controllers/auth.business.controller.js";

const router = express.Router();

// ===== ROUTES =====

router.post("/register", registerBusiness);
router.post("/login", loginBusiness);

// 🔥 כאן הקסם קורה
router.patch("/update/:id", updateBusiness); // רק ה-controller

export default router;