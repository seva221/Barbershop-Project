// routes/auth.business.routes.js
import express from "express";
import {
  registerBusiness,
  loginBusiness,
} from "../controllers/auth.business.controller.js";

const router = express.Router();

router.post("/register", registerBusiness);
router.post("/login", loginBusiness);

export default router;
