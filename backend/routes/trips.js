const express = require('express');
const Trip = require('../models/Trip');
const Expense = require('../models/Expense');
const router = express.Router();

// POST /api/trips - Create a new trip
router.post('/', async (req, res) => {
  try {
    const trip = new Trip(req.body);
    await trip.save();
    res.status(201).json({ message: 'Trip created', tripId: trip._id });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// GET /api/trips - List all trips
router.get('/', async (req, res) => {
  try {
    const trips = await Trip.find({}, 'tripName startLocation endLocation completedAt');
    res.json(trips);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/trips/:tripId - Get trip details
router.get('/:tripId', async (req, res) => {
  try {
    const trip = await Trip.findById(req.params.tripId).populate('expenses');
    if (!trip) return res.status(404).json({ error: 'Trip not found' });
    res.json(trip);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PUT /api/trips/:tripId/stops/:stopId/trigger - Mark stop as triggered
router.put('/:tripId/stops/:stopId/trigger', async (req, res) => {
  try {
    const { triggeredAt } = req.body;
    const trip = await Trip.findById(req.params.tripId);
    if (!trip) return res.status(404).json({ error: 'Trip not found' });
    const stop = trip.stops.id(req.params.stopId);
    if (!stop) return res.status(404).json({ error: 'Stop not found' });
    stop.triggeredAt = triggeredAt;
    await trip.save();
    res.json({ message: 'Stop triggered' });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// DELETE /api/trips/:tripId - Delete a trip
router.delete('/:tripId', async (req, res) => {
  try {
    await Trip.findByIdAndDelete(req.params.tripId);
    res.json({ message: 'Trip deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router; 