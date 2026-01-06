import mongoose from "mongoose";

const ServiceSchema = new mongoose.Schema({
  name: { type: String, required: true }, 
  duration: { type: Number, required: true }, 
  price: { type: Number, required: true },
  businessId: { type: mongoose.Schema.Types.ObjectId, ref: "Business", required: true },
});

export default mongoose.model("Service", ServiceSchema);