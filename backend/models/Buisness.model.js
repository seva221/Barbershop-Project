const mongoose = require('mongoose');

const BusinessSchema = new mongoose.Schema({
  name: { type: String, required: true },
  ownerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // המנהל של העסק
  category: { type: String, enum: ['Barbershop', 'Spa', 'Nail Salon'] },
  settings: {
    currency: { type: String, default: 'ILS' },
    openingHours: { type: Map, of: String } // e.g., "sunday": "09:00-18:00"
  },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Business', BusinessSchema);    