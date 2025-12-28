// controllers/booking.controller.js
import mongoose from "mongoose";
import Appointment from "../models/Appointment.js";

export const createAppointment = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const {
      businessId,
      workerId,
      serviceId,
      date,
      customerId,
      guestDetails,
    } = req.body;

    const bookingDate = new Date(date);

    // Check if slot is already taken
    const existing = await Appointment.findOne({
      workerId,
      date: bookingDate,
      status: { $ne: "cancelled" },
    }).session(session);

    if (existing) {
      return res.status(409).json({
        success: false,
        message: "Time slot already taken",
      });
    }

    // Create appointment
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

    return res.status(201).json({
      success: true,
      appointment: appointment[0],
    });
  } catch (err) {
    await session.abortTransaction();
    return res.status(400).json({
      success: false,
      message: err.message,
    });
  } finally {
    session.endSession();
  }
};
