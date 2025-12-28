// routes/auth.business.routes.js
import express from "express";
import {
  registerBusiness,
  loginBusiness,
} from "../controllers/auth.business.controller.js";

const router = express.Router();

router.post("/business/register", registerBusiness);
router.post("/business/login", loginBusiness);

export default router;
