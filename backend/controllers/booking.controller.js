import mongoose from "mongoose";

import Appointment from "../models/Appointment.model.js"; 

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

    // Check if slot is already taken (Exact Match)
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
    session.endSession();

    return res.status(201).json({
      success: true,
      appointment: appointment[0],
    });
  } catch (err) {
    await session.abortTransaction();
    session.endSession();
    return res.status(400).json({
      success: false,
      message: err.message,
    });
  }
};

export const deleteAppointment = async (req, res) => {
  try {
    const { id } = req.params;

    // Hard Delete: Removes document entirely from DB
    const appointment = await Appointment.findByIdAndDelete(id);

    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: "Appointment not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Appointment deleted permanently from the database",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};