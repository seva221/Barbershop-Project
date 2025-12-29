import express from "express";
import { 
  createAppointment, 
  deleteAppointment 
} from "../controllers/booking.controller.js";

const router = express.Router();

// Route to create a new appointment
// POST http://localhost:4000/api/booking/create
router.post("/create", createAppointment);

// Route to permanently delete an appointment by ID
// DELETE http://localhost:4000/api/booking/delete/:id
router.delete("/delete/:id", deleteAppointment);

export default router;