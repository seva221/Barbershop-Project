import { ZodError } from "zod";
import jwt from "jsonwebtoken";
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


    res.cookie('token', token, {
      httpOnly: true,  // ACTIVATE HTTP ONLY TO PREVENT XSS, DO NOT TOUCH !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!1
      secure: process.env.NODE_ENV === 'production', // sends cookies only over https
      sameSite: 'strict', // prevent cross site request forgery CSRF, only accept cookies that were made on the site 
      maxAge: 3600_000 // N * 1000ms = N seconds
    });

    res.status(201).json({
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

    // ownerId is to check if it matches the business
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

    res.cookie('token', token, {
      httpOnly: true,  // ACTIVATE HTTP ONLY TO PREVENT XSS, DO NOT TOUCH !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!1
      secure: process.env.NODE_ENV === 'production', // sends cookies only over https
      sameSite: 'strict', // prevent cross site request forgery CSRF, only accept cookies that were made on the site 
      maxAge: 3600_000 // N * 1000ms = N seconds
    });

    res.status(200).json({
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
