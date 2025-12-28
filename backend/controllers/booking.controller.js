const Appointment = require('../models/Appointment');
const Worker = require('../models/Worker');

exports.createAppointment = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction(); // שימוש בטרנזקציה למניעת התנגשויות

  try {
    const { businessId, workerId, serviceId, date } = req.body;

    // 1. בדיקה אם הספר פנוי בשעה הזו
    const existing = await Appointment.findOne({
      workerId,
      date: new Date(date), // צריך לוודא טווח שעות מדויק
      status: { $ne: 'cancelled' }
    }).session(session);

    if (existing) {
      throw new Error('Time slot already taken');
    }

    // 2. יצירת ההזמנה
    const newAppt = new Appointment({
      businessId, workerId, serviceId, date, 
      customerId: req.user ? req.user.id : null
    });

    await newAppt.save({ session });
    await session.commitTransaction();

    res.status(201).json({ success: true, data: newAppt });

  } catch (error) {
    await session.abortTransaction();
    res.status(400).json({ success: false, message: error.message });
  } finally {
    session.endSession();
  }
};