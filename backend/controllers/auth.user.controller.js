// backend/controllers/auth.user.controller.js
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import User from '../models/user.model.js';
import { registerSchema, loginSchema } from '../validations/auth.schema.js'; // וודא שיש לך סכמה כזו

const createCookie = (res, token) => {
  res.cookie("token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  });
  return res
};

export const registerUser = async (req, res) => {
  try {
    const { name, email, password, phone } = registerSchema.parse(req.body);
    const exists = await User.findOne({ email });
    if (exists) return res.status(409).json({ message: "Email already exists" });

    const passwordHash = await bcrypt.hash(password, 10);
    const user = await User.create({
      name,
      email,
      passwordHash,
      phone,
      role: "customer",
      businessId: null,
    });

    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: "7d" });
    res = createCookie(res, token);
    res.status(201).json({ user, token }); // הוספתי token גם ב-json לנוחות ה-Frontend
  } catch (err) {
    if (err.name === "ZodError") return res.status(400).json({ message: "Validation failed", errors: err.issues.map(e => e.message) });
    res.status(500).json({ message: "Server error" });
  }
};

// --- הוסף את הפונקציה הזו עכשיו ---
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body; // או loginSchema.parse(req.body) אם הגדרת סכמה

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res = createCookie(res, token);

    res.status(200).json({ 
      message: "Logged in successfully",
      token, 
      user: { id: user._id, name: user.name, email: user.email, role: user.role, phone: user.phone } 
    });

  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

export const getUser = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json(user);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};