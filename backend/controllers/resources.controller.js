import Worker from "../models/worker.model.js";
import Service from "../models/service.model.js";

// --- WORKER FUNCTIONS ---
export const createWorker = async (req, res) => {
  try {
    const { name, businessId, phone } = req.body;
    const worker = await Worker.create({ name, businessId, phone });
    res.status(201).json(worker);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getWorkers = async (req, res) => {
  try {
    const { businessId } = req.params;
    const workers = await Worker.find({ businessId });
    res.json(workers);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// --- SERVICE FUNCTIONS ---
export const createService = async (req, res) => {
  try {
    const { name, duration, price, businessId } = req.body;
    const service = await Service.create({ name, duration, price, businessId });
    res.status(201).json(service);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getServices = async (req, res) => {
  try {
    const { businessId } = req.params;
    const services = await Service.find({ businessId });
    res.json(services);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};