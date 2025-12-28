// routes/booking.routes.js
import express from "express";
import { createAppointment } from "../controllers/booking.controller.js";

const router = express.Router();

router.post("/create", createAppointment);

export default router;
