import mongoose from "mongoose";

const WorkerSchema = new mongoose.Schema({
  name: { type: String, required: true },
  businessId: { type: mongoose.Schema.Types.ObjectId, ref: "Business", required: true },
  phone: { type: String },
  // You can add 'availability' later
});

export default mongoose.model("Worker", WorkerSchema);