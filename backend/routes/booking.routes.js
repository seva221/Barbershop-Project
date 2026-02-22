import express from "express";
import authMiddleware from "../middleware/auth.middleware.js"

import { 
  createAppointment, 
  deleteAppointment,
  getAppointments,
  updateAppointment 
} from "../controllers/booking.controller.js";

const router = express.Router();

router.get("/", authMiddleware, getAppointments);
router.post("/", authMiddleware, createAppointment);
// PUT /api/booking/:id
router.put("/:id", authMiddleware, updateAppointment);
// DELETE /api/booking/:id
router.delete("/:id", authMiddleware, deleteAppointment);

// the middleware handles JWT confirmation
// if none or incorrect -> reject (400, 401) 

// Route to create a new appointment
// POST http://localhost:4000/api/booking/create
router.post("/create",authMiddleware, createAppointment);

// Route to permanently delete an appointment by ID
// DELETE http://localhost:4000/api/booking/delete/:id
router.delete("/delete/:id",authMiddleware, deleteAppointment);

export default router;