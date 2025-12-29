import mongoose from "mongoose";

const ServiceSchema = new mongoose.Schema({
  name: { type: String, required: true }, // e.g., "Haircut"
  duration: { type: Number, required: true }, // in minutes, e.g., 30
  price: { type: Number, required: true }, // e.g., 100
  businessId: { type: mongoose.Schema.Types.ObjectId, ref: "Business", required: true },
});

export default mongoose.model("Service", ServiceSchema);