// controllers/auth.business.controller.js
import bcrypt from "bcrypt";
import User from "backend\models\User.model.js";
import Business from "../models/Business.model.js";

export const registerBusiness = async (req, res) => {
  const { ownerName, email, password, businessName } = req.body;

  const exists = await User.findOne({ email });
  if (exists) return res.status(409).json({ message: "Email already exists" });

  const passwordHash = await bcrypt.hash(password, 10);

  const owner = await User.create({
    name: ownerName,
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

  res.status(201).json({ owner, business });
};

export const loginBusiness = async (req, res) => {
  const { email, password } = req.body;

  const owner = await User.findOne({ email, role: "business" }).populate(
    "businessId"
  );

  if (!owner) return res.status(401).json({ message: "Invalid credentials" });

  const valid = await bcrypt.compare(password, owner.passwordHash);
  if (!valid) return res.status(401).json({ message: "Invalid credentials" });

  res.json(owner);
};
