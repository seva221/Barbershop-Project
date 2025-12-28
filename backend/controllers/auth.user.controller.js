import bcrypt from "bcrypt";
import User from "../models/user.model.js";
import { registerSchema, loginSchema } from "../validations/auth.schema.js";

// 📝 REGISTER
export const register = async (req, res) => {
  try {
    const parsed = registerSchema.safeParse(req.body);

    if (!parsed.success) {
      const errors = parsed.error?.errors?.map(e => e.message) || [];
      return res.status(400).json({ message: "Validation failed", errors });
    }

    const { name, email, password } = parsed.data;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ message: "Invalid Credentials" });
    }

    // Hash password
    const passwordHash = await bcrypt.hash(password, 10);

    // Create user
    const user = await User.create({ name, email, passwordHash });

    return res.status(201).json({
      message: "User registered successfully",
      user: user.toJSON(name,email),
    });
  } catch (err) {
    console.error("Register error:", err);
    return res.status(500).json({ message: "Server error" });
  }
};

// 🔑 LOGIN
export const login = async (req, res) => {
  try {
    const parsed = loginSchema.safeParse(req.body);

    if (!parsed.success) {
      const errors = parsed.error?.errors?.map(e => e.message) || [];
      return res.status(400).json({ message: "Validation failed", errors });
    }

    const { email, password } = parsed.data;

    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Compare passwords
    const valid = await bcrypt.compare(password, user.passwordHash);
    if (!valid) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Successful login
    return res.status(200).json({
      message: "Login successful",
      user: user.toJSON(),
    });
  } catch (err) {
    console.error("Login error:", err);
    return res.status(500).json({ message: "Server error" });
  }
};

//Return all Users

export const returnUsers = async (req, res) => {
  try {
    const users = await User.find();
    return res.status(200).json(users);
  } 
  catch (err) {
    console.error("Error:", err);
    return res.status(500).json({ message: "Server error" });
  }
};
