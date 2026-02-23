import Worker from "../models/worker.model.js";
import Service from "../models/service.model.js";
import {
  createWorkerSchema,
  createServiceSchema,
} from "../validations/resources.schema.js";
import Business from "../models/Business.model.js"; 

/* =========================
   BUSINESS CONTROLLERS (NEW)
========================= */

// Fetches all approved businesses for the frontend home page grid
export const getAllBusinesses = async (req, res) => {
  try {
    const businesses = await Business.find({}).select("-passwordHash");
    return res.status(200).json(businesses);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// Fetches workers and services for a specific business booking modal
export const getBusinessData = async (req, res) => {
  try {
    const { businessId } = req.query;
    if (!businessId) {
      return res.status(400).json({ message: "businessId query parameter is required" });
    }

    const services = await Service.find({ businessId });
    const workers = await Worker.find({ businessId });

    return res.status(200).json({ services, workers });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

/* =========================
   WORKER CONTROLLERS
========================= */

export const createWorker = async (req, res) => {
  try {
    // 🔐 Zod validation
    const parsed = createWorkerSchema.safeParse(req.body);

    if (!parsed.success) {
      return res.status(400).json({
        success: false,
        errors: parsed.error.flatten(),
      });
    }

    const { name, businessId, phone } = parsed.data;

    const worker = await Worker.create({
      name,
      businessId,
      phone,
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
    // 🔐 Zod validation
    const parsed = createServiceSchema.safeParse(req.body);

    if (!parsed.success) {
      return res.status(400).json({
        success: false,
        errors: parsed.error.flatten(),
      });
    }

    const { name, duration, price, businessId } = parsed.data;

    const service = await Service.create({
      name,
      duration,
      price,
      businessId,
    });
    console.log(businessId);
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
