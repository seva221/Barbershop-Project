import { ZodError } from "zod";
import {
  registerBusinessSchema,
  loginBusinessSchema,
} from "../validations/business.auth.schema.js";
import Business from "../models/Business.model.js";

export const registerBusiness = async (req, res) => {
  try {
    // Validate business input
    const { name, ownerId, category } = registerBusinessSchema.parse(req.body);

    // Check if owner already has a business
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

    // JWT TOKEN
    const token = jwt.sign(
      { id: business._id, role: business.name },
      process.env.JWT_SECRET, 
      { expiresIn: "7d" } 
    );

    // Remove passwordHash from the response for security
    const businessResponse = user.toObject();
    delete businessResponse.passwordHash;

    res.status(201).json({
      token, 
      message: "Business registered successfully",
      businessResponse,
    });

  } catch (err) {
    // Handle Zod validation errors
    if (err instanceof ZodError) {
      return res.status(400).json({
        message: "Validation failed",
        errors: err.issues.map((e) => e.message),
      });
    }

    // Handle other errors
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

export const loginBusiness = async (req, res) => {
  try {
    // Validate login input
    const { businessId, ownerId } = loginBusinessSchema.parse(req.body);


    // note - Idan K. 
    // putting in the owner ID to find the buisness
    // I dont think it's the best option 
    const business = await Business.findOne({
      _id: businessId,
      ownerId,
    });

    if (!business) {
      return res
        .status(401)
        .json({ message: "Invalid business credentials" });
    }

    // JWT TOKEN
    const token = jwt.sign(
      { id: business._id, role: business.name },
      process.env.JWT_SECRET, 
      { expiresIn: "7d" } 
    );

    // Remove passwordHash from the response for security
    const businessResponse = user.toObject();
    delete businessResponse.passwordHash;

    res.status(200).json({
      token, 
      message: "Business registered successfully",
      businessResponse,
    });
  } catch (err) {
    // Handle Zod validation errors
    if (err instanceof ZodError) {
      return res.status(400).json({
        message: "Validation failed",
        errors: err.issues.map((e) => e.message),
      });
    }

    // Handle other errors
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};
