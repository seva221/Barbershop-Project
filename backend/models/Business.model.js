// models/Business.model.js
import mongoose from "mongoose";

const businessSchema = new mongoose.Schema({
  // owner can own 1 business
  // business can be owned by 1 owner
  name: { type: String, required: true, unique: true },
  ownerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
    unique: true
  },
  category: { type: String, default: "Barbershop" },
  createdAt: { type: Date, default: Date.now },
});

// for now the complex key shouldn't be used, it works differently then adding a "unique" tag to each column
// the 1 is for ascending in the DB, convention
// it can be used for optimizing queries by sorting in a way but not for now(???)
// businessSchema.index({ ownerId: 1, name: 1 }, { unique: true });
export default mongoose.model("Business", businessSchema);
