import mongoose from "mongoose";
import Appointment from "../models/Appointment.model.js";
import { createBookingSchema } from "../validations/booking.schema.js";

export const getAppointments = async (req, res) => {
  try {
    // req.user is populated by your authMiddleware
    const { id, role, businessId } = req.user; 
    let query = {};

    if (role === "business") {
      query = { businessId: businessId || id };
    } else {
      query = { customerId: id };
    }

    const appointments = await Appointment.find(query)
      .populate("businessId", "name address")
      .populate("serviceId", "name price")
      .populate("workerId", "name")
      .populate("customerId", "name email");

    return res.status(200).json(appointments);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// Required for the Admin dashboard to approve/reject
export const updateAppointment = async (req, res) => {
  try {
    const { id } = req.params;
    const { date } = req.body; // התאריך החדש מגיע מה-body

    // אם נשלח תאריך לעדכון, נבדוק שהוא לא בעבר
    if (date) {
      const incomingDate = new Date(date);
      const today = new Date();
      
      // מאפסים את השעות של היום כדי לאפשר קביעת תור להיום מאוחר יותר
      today.setHours(0, 0, 0, 0); 

      if (incomingDate < today) {
        return res.status(400).json({ 
          success: false, 
          message: "לא ניתן לקבוע תור לתאריך שעבר" 
        });
      }
    }

    const appointment = await Appointment.findByIdAndUpdate(id, req.body, { new: true });
    
    if (!appointment) {
      return res.status(404).json({ success: false, message: "התור לא נמצא" });
    }

    return res.status(200).json({ success: true, appointment });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const createAppointment = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    // 🔐 Validate request body with Zod
    const parsed = createBookingSchema.safeParse(req.body);

    if (!parsed.success) {
      await session.abortTransaction();
      session.endSession();

      return res.status(400).json({
        success: false,
        errors: parsed.error.flatten(),
      });
    }

    const {
      businessId,
      workerId,
      serviceId,
      date,
      customerId,
      guestDetails,
    } = parsed.data;

    const bookingDate = new Date(date);

    // ⛔ Check if slot is already taken (exact match)
    const existing = await Appointment.findOne({
      workerId,
      date: bookingDate,
      status: { $ne: "cancelled" },
    }).session(session);

    if (existing) {
      await session.abortTransaction();
      session.endSession();

      return res.status(409).json({
        success: false,
        message: "Time slot already taken",
      });
    }

    // ✅ Create appointment
    const appointment = await Appointment.create(
      [
        {
          businessId,
          workerId,
          serviceId,
          date: bookingDate,
          customerId: customerId || null,
          guestDetails: guestDetails || null,
          status: "pending",
        },
      ],
      { session }
    );

    await session.commitTransaction();
    session.endSession();

    return res.status(201).json({
      success: true,
      appointment: appointment[0],
    });
  } catch (err) {
    await session.abortTransaction();
    session.endSession();

    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

export const deleteAppointment = async (req, res) => {
  try {
    const { id } = req.params;

    // 🗑 Hard delete
    const appointment = await Appointment.findByIdAndDelete(id);

    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: "Appointment not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Appointment deleted permanently from the database",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
