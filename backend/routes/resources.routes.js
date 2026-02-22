import express from "express";
import authMiddleware from "../middleware/auth.middleware.js"
import { 
  createWorker, 
  getWorkers, 
  createService, 
  getServices,
  getAllBusinesses, // <-- Add this
  getBusinessData   // <-- Add this
} from "../controllers/resources.controller.js";

const router = express.Router();
// Businesse *data* !!!
router.get("/businesses", getAllBusinesses);

// GET /api/resources?businessId=...
router.get("/", getBusinessData);


// Workers
// the middleware handles JWT confirmation
// if none or incorrect -> reject (400, 401) 
router.post("/workers",authMiddleware, createWorker); // Create
router.get("/workers/:businessId",authMiddleware, getWorkers); // Get list

// Services
router.post("/services",authMiddleware, createService); // Create
router.get("/services/:businessId",authMiddleware, getServices); // Get list

export default router;