import mongoose from "mongoose";

const AppointmentSchema = new mongoose.Schema({
  businessId: { type: mongoose.Schema.Types.ObjectId, ref: 'Business', required: true, index: true },
  workerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Worker', required: true },
  serviceId: { type: mongoose.Schema.Types.ObjectId, ref: 'Service', required: true },
  customerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, 
  guestDetails: { 
    name: String,
    phone: String
  },
  date: { type: Date, required: true },
  status: { type: String, enum: ['pending', 'approved', 'cancelled', 'completed'], default: 'pending' },
  priceSnapshot: Number 
});

export default mongoose.model('Appointment', AppointmentSchema);