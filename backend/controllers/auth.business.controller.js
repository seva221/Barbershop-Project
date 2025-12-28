import bcrypt from "bcrypt";
import User from "../models/user.model.js";
import Business from "../models/Business.model.js";

export const registerBusiness = async (req, res) => {
  try {
    const { name, email, password, businessName } = req.body;

    if (!name || !email || !password || !businessName) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const exists = await User.findOne({ email });
    if (exists) return res.status(409).json({ message: "Email already exists" });

    const passwordHash = await bcrypt.hash(password, 10);

    const owner = await User.create({
      name,
      email,
      passwordHash,
      role: "business", 
    });

    const business = await Business.create({
      name: businessName,
      ownerId: owner._id,
    });

    owner.businessId = business._id;
    await owner.save();

    const ownerSafe = owner.toObject();
    delete ownerSafe.passwordHash;

    res.status(201).json({ owner: ownerSafe, business });
  } catch (err) {
    console.error("Register Business error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

export const loginBusiness = async (req, res) => {
  try {
    const { email, password } = req.body;

    const owner = await User.findOne({ email, role: "business" }).populate("businessId"); // ✅ match registration
    if (!owner) return res.status(401).json({ message: "Invalid credentials" });

    const valid = await bcrypt.compare(password, owner.passwordHash);
    if (!valid) return res.status(401).json({ message: "Invalid credentials" });

    const ownerSafe = owner.toObject();
    delete ownerSafe.passwordHash;

    res.json(ownerSafe);
  } catch (err) {
    console.error("Login Business error:", err);
    res.status(500).json({ message: "Server error" });
  }
};
