// models/Airport.js
const mongoose = require('mongoose');

const airportSchema = new mongoose.Schema({
  code: { type: String, required: true, unique: true },
  time_zone_id: { type: String, required: true },
  name: { type: String, required: true },
  city_code: { type: String, required: true },
  country_id: { type: String, required: true },
  location: {
    type: { type: String, enum: ['Point'], default: 'Point' },
    coordinates: { type: [Number], required: true }
  },
  elevation: Number,
  url: String,
  icao: String,
  city: String,
  county: String,
  state: String
}, { timestamps: true });

airportSchema.index({ location: '2dsphere' });

module.exports = mongoose.model('Airport', airportSchema);
