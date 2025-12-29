import bcrypt from "bcrypt";
import User from "../models/user.model.js";
import { registerSchema, loginSchema } from "../validations/auth.schema.js";

/**
 * REGISTER USER
 */
export const registerUser = async (req, res) => {
  try {
    // ✅ Validate input using Zod
    const { name, email, password, role, businessId } = registerSchema.parse(req.body);

    // Check if user already exists
    const exists = await User.findOne({ email });
    if (exists) {
      return res.status(409).json({ message: "Email already exists" });
    }

    // Hash password
    const passwordHash = await bcrypt.hash(password, 10);

    // Create user
    const user = await User.create({
      name,
      email,
      passwordHash,
      role: role || "customer",
      businessId: businessId || null,
    });

    res.status(201).json(user);
  } catch (err) {
    if (err.name === "ZodError") {
      return res.status(400).json({
        message: "Validation failed",
        errors: err.errors.map((e) => e.message),
      });
    }

    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

/**
 * LOGIN USER
 */
export const loginUser = async (req, res) => {
  try {
    // ✅ Validate input using Zod
    const { email, password } = loginSchema.parse(req.body);

    // Find user with role customer
    const user = await User.findOne({ email, role: "customer" });
    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Verify password
    const valid = await bcrypt.compare(password, user.passwordHash);
    if (!valid) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    res.json(user);
  } catch (err) {
    if (err.name === "ZodError") {
      return res.status(400).json({
        message: "Validation failed",
        errors: err.errors.map((e) => e.message),
      });
    }

    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};
