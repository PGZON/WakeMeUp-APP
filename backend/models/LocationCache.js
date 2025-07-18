const mongoose = require('mongoose');

const LocationCacheSchema = new mongoose.Schema({
  placeId: String,
  name: String,
  coordinates: {
    lat: Number,
    lng: Number,
  },
  address: String,
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('LocationCache', LocationCacheSchema); 