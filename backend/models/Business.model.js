// models/Business.model.js
import mongoose from "mongoose";

const businessSchema = new mongoose.Schema({
  name: { type: String, required: true },
  ownerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  category: { type: String, default: "Barbershop" },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model("Business", businessSchema);
