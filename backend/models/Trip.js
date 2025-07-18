const mongoose = require('mongoose');

const StopSchema = new mongoose.Schema({
  name: String,
  coordinates: {
    lat: Number,
    lng: Number,
  },
  radius: Number,
  triggeredAt: Date,
});

const WeatherSnapshotSchema = new mongoose.Schema({
  locationName: String,
  coordinates: {
    lat: Number,
    lng: Number,
  },
  temperature: Number,
  description: String,
  fetchedAt: Date,
});

const TripSchema = new mongoose.Schema({
  userId: mongoose.Schema.Types.ObjectId,
  tripName: String,
  startLocation: {
    name: String,
    coordinates: {
      lat: Number,
      lng: Number,
    },
  },
  endLocation: {
    name: String,
    coordinates: {
      lat: Number,
      lng: Number,
    },
  },
  stops: [StopSchema],
  travelMode: String,
  startedAt: Date,
  completedAt: Date,
  totalDistanceKm: Number,
  totalDurationMin: Number,
  weatherSnapshots: [WeatherSnapshotSchema],
  expenses: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Expense' }],
});

module.exports = mongoose.model('Trip', TripSchema); 