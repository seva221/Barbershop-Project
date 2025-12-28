import express from "express";
import { register, login, returnUsers } from "../controllers/auth.controller.js";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.get("/users", returnUsers)

export default router;
