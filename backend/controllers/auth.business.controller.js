import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { ZodError } from "zod";
<<<<<<< HEAD
import jwt from "jsonwebtoken";
=======

>>>>>>> 212b4ef (Fixed Buisness user with cookies)
import {
  registerBusinessSchema,
  loginBusinessSchema,
} from "../validations/business.auth.schema.js";

import Business from "../models/Business.model.js";

/* =========================
   REGISTER BUSINESS
========================= */
export const registerBusiness = async (req, res) => {
  try {
    const { name, ownerId, category, email, password } =
      registerBusinessSchema.parse(req.body);

    const existingBusiness = await Business.findOne({ email });
    if (existingBusiness) {
      return res.status(409).json({ message: "Email already in use" });
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const business = await Business.create({
      name,
      ownerId,
      category,
      email,
      passwordHash,
    });

    const token = jwt.sign(
      {
        businessId: business._id,
        ownerId: business.ownerId,
        role: "business",
      },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    const businessResponse = business.toObject();
    delete businessResponse.passwordHash;

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

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

/* =========================
   LOGIN BUSINESS
========================= */
export const loginBusiness = async (req, res) => {
  try {
    const { email, password } = loginBusinessSchema.parse(req.body);

    const business = await Business.findOne({ email });
    if (!business) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, business.passwordHash);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
      {
        businessId: business._id,
        ownerId: business.ownerId,
        role: "business",
      },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    const businessResponse = business.toObject();
    delete businessResponse.passwordHash;

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.status(200).json({
      message: "Login successful",
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
