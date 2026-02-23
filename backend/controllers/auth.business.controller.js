import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { ZodError } from "zod";
import { registerBusinessSchema, loginBusinessSchema } from "../validations/business.auth.schema.js";
import Business from "../models/Business.model.js";

const createCookie = (res, token) => {
  res.cookie("token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  });
  return res
}

/* ========================= REGISTER BUSINESS ========================= */
export const registerBusiness = async (req, res) => {
  try {
    // Validate input
    const { name, ownerId, category, email, password, address } = registerBusinessSchema.parse(req.body);

    // Check if email or owner already exists
    const existingBusiness = await Business.findOne({ email });
    if (existingBusiness) {
      return res.status(409).json({ message: "email already in use" });
    }

    // Hash password
    const passwordHash = await bcrypt.hash(password, 10);

    // Create business
    const business = await Business.create({
      name,
      ownerId,
      category,
      email,
      passwordHash,
      address,
    });
    // need to assign owner id somewhere
    
    // Generate JWT
    const token = jwt.sign(
      {
        businessId: business._id,
        ownerId: business.ownerId,
        role: "business",
      },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    // Prepare the business to be packaged in the response
    const businessResponse = business.toObject();
    delete businessResponse.passwordHash;

    // Set HTTP-only cookie
    res = createCookie(res, token);

    res.status(201).json({
      message: "Business registered successfully",
      business: businessResponse,
    });
  } catch (err) {
    if (err instanceof ZodError) {
      return res.status(400).json({
        message: "Validation failed",
        errors: err.issues.map((e) => e.message),
      });
    }
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

/* ========================= LOGIN BUSINESS ========================= */
export const loginBusiness = async (req, res) => {
  try {
    // Validate input
    const { email, password } = loginBusinessSchema.parse(req.body);

    // Find business by email
    const business = await Business.findOne({ email });
    if (!business) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Verify password
    const isMatch = await bcrypt.compare(password, business.passwordHash);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials (pass change later)" });
    }

    // Generate JWT
    const token = jwt.sign(
      {
        businessId: business._id,
        ownerId: business.ownerId,
        role: "business",
      },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    // Prepare the business to be packaged in the response
    const businessResponse = business.toObject();
    delete businessResponse.passwordHash;

    // Set HTTP-only cookie
    res = createCookie(res, token);
    res.status(200).json({
      message: "Business login successful",
      business: businessResponse,
    });
  } catch (err) {
    if (err instanceof ZodError) {
      return res.status(400).json({
        message: "Validation failed",
        errors: err.issues.map((e) => e.message),
      });
    }
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

/* ========================= UPDATE BUSINESS (IMAGE/DETAILS) ========================= */
export const updateBusiness = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body; // { image: "url" }

    const updatedBusiness = await Business.findByIdAndUpdate(
      id,
      { $set: updates },
      { new: true, runValidators: true }
    );

    if (!updatedBusiness) return res.status(404).json({ message: "Business not found" });

    const businessResponse = updatedBusiness.toObject();
    delete businessResponse.passwordHash;

    res.status(200).json({
      message: "Business updated successfully",
      business: businessResponse,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};