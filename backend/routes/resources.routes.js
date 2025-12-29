import express from "express";
import { 
  createWorker, 
  getWorkers, 
  createService, 
  getServices 
} from "../controllers/resources.controller.js";

const router = express.Router();

// Workers
router.post("/workers", createWorker); // Create
router.get("/workers/:businessId", getWorkers); // Get list

// Services
router.post("/services", createService); // Create
router.get("/services/:businessId", getServices); // Get list

export default router;