import bcrypt from "bcrypt";
import User from "../models/user.model.js";
import jwt from "jsonwebtoken";
import { registerSchema, loginSchema } from "../validations/auth.schema.js";

/**
 * REGISTER USER
 */
export const registerUser = async (req, res) => {
  try {
    // note - Idan K.
    // this function is unsafe and shouldn't be used by the clients without authorization
    // creating of a user with a role that is not authorized is a major vulnerability
    // @@@@
    // the function should be called only internally after validations have been made for the request.
    
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

    // JWT TOKEN
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET, 
      { expiresIn: "7d" } 
    );

    // Remove passwordHash from the response for security
    const userResponse = user.toObject();
    delete userResponse.passwordHash;

    res.status(201).json({ token, user: userResponse });
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

    // ✅ Generate Token for Login
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    // Remove passwordHash from the response for security
    const userResponse = user.toObject();
    delete userResponse.passwordHash;

    res.status(200).json({ token, user: userResponse });

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
