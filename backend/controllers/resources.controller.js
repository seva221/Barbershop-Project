import Worker from "../models/worker.model.js";
import Service from "../models/service.model.js";
import { createWorkerSchema, createServiceSchema } from "../validations/resources.schema.js";

/* =========================
   WORKER CONTROLLERS
========================= */

export const createWorker = async (req, res) => {
  try {
    // 🔐 Zod validation (excluding businessId, since we take it from JWT)
    const parsed = createWorkerSchema.safeParse(req.body);

    if (!parsed.success) {
      return res.status(400).json({
        success: false,
        errors: parsed.error.flatten(),
      });
    }

    const { name, phone } = parsed.data;

    // 🔑 Get businessId from JWT (set by authMiddleware)
    const { role, businessId } = req.user;
    if (role !== "business" || !businessId) {
      return res.status(403).json({
        success: false,
        message: "Only logged-in businesses can create workers",
      });
    }

    const worker = await Worker.create({
      name,
      phone,
      businessId, // automatically from JWT
    });

    return res.status(201).json({
      success: true,
      worker,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getWorkers = async (req, res) => {
  try {
    const { businessId } = req.params;

    const workers = await Worker.find({ businessId });

    return res.status(200).json({
      success: true,
      workers,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/* =========================
   SERVICE CONTROLLERS
========================= */

export const createService = async (req, res) => {
  try {
    // 🔐 Zod validation (excluding businessId, taken from JWT)
    const parsed = createServiceSchema.safeParse(req.body);

    if (!parsed.success) {
      return res.status(400).json({
        success: false,
        errors: parsed.error.flatten(),
      });
    }

    const { name, duration, price } = parsed.data;

    // 🔑 Get businessId from JWT
    const { role, businessId } = req.user;
    if (role !== "business" || !businessId) {
      return res.status(403).json({
        success: false,
        message: "Only logged-in businesses can create services",
      });
    }

    const service = await Service.create({
      name,
      duration,
      price,
      businessId, // automatically from JWT
    });

    return res.status(201).json({
      success: true,
      service,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getServices = async (req, res) => {
  try {
    const { businessId } = req.params;

    const services = await Service.find({ businessId });

    return res.status(200).json({
      success: true,
      services,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
