import {
  registerBusinessSchema,
  loginBusinessSchema,
} from "../validations/business.auth.schema.js";

import Business from "../models/Business.model.js";

export const registerBusiness = async (req, res) => {
  try {
    // ✅ Validate business input
    const { name, ownerId, category } =
      registerBusinessSchema.parse(req.body);

    // Optional: prevent duplicate business for same owner
    const existingBusiness = await Business.findOne({ ownerId });
    if (existingBusiness) {
      return res
        .status(409)
        .json({ message: "Owner already has a business" });
    }

    // Create business
    const business = await Business.create({
      name,
      ownerId,
      category,
    });

    res.status(201).json({
      message: "Business registered successfully",
      business,
    });
  } catch (err) {
    if (err.name === "ZodError") {
      return res.status(400).json({
        message: "Validation failed",
        errors: err.errors.map((e) => e.message),
      });
    }

    res.status(500).json({ message: "Server error" });
  }
};

export const loginBusiness = async (req, res) => {
  try {
    // ✅ Validate login input
    const { businessId, ownerId } =
      loginBusinessSchema.parse(req.body);

    const business = await Business.findOne({
      _id: businessId,
      ownerId,
    });

    if (!business) {
      return res
        .status(401)
        .json({ message: "Invalid business credentials" });
    }

    res.json({
      message: "Business login successful",
      business,
    });
  } catch (err) {
    if (err.name === "ZodError") {
      return res.status(400).json({
        message: "Validation failed",
        errors: err.errors.map((e) => e.message),
      });
    }

    res.status(500).json({ message: "Server error" });
  }
};
