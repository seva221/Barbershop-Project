import mongoose from "mongoose";
import Appointment from "../models/Appointment.model.js";
import Business from "../models/Business.model.js";
import { createBookingSchema } from "../validations/booking.schema.js";

/* ========================= CREATE APPOINTMENT ========================= */
export const createAppointment = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    // 🔐 Must be logged in (set by authMiddleware)
    const { id: userId, role } = req.user;

    // 🛑 Only customers can create bookings
    if (role !== "customer") {
      await session.abortTransaction();
      session.endSession();
      return res.status(403).json({
        success: false,
        message: "Only customers can create appointments",
      });
    }

    // 🔐 Validate request body
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
      guestDetails,
    } = parsed.data;

    const bookingDate = new Date(date);

    // 🔎 Verify business exists
    const businessExists = await Business.findById(businessId).session(session);
    if (!businessExists) {
      await session.abortTransaction();
      session.endSession();
      return res.status(404).json({
        success: false,
        message: "Business not found",
      });
    }

    // ⛔ Check if slot is already taken
    const existing = await Appointment.findOne({
      businessId,
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
          customerId: userId, // 🔥 Taken from JWT, NOT from frontend
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

/* ========================= DELETE APPOINTMENT ========================= */
export const deleteAppointment = async (req, res) => {
  try {
    const { id: userId, role, businessId } = req.user;
    const { id } = req.params;

    const appointment = await Appointment.findById(id);
    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: "Appointment not found",
      });
    }

    const isCustomerOwner =
      role === "customer" &&
      appointment.customerId?.toString() === userId;

    const isBusinessOwner =
      role === "business" &&
      appointment.businessId.toString() === businessId;

    if (!isCustomerOwner && !isBusinessOwner) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to delete this appointment",
      });
    }

    await Appointment.findByIdAndDelete(id);

    return res.status(200).json({
      success: true,
      message: "Appointment deleted permanently",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
