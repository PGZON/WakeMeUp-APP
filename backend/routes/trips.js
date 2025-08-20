const express = require("express");
const Trip = require("../models/Trip");
const Expense = require("../models/Expense");
const { protect } = require("../middleware/auth");
const router = express.Router();

// @desc    Create a new trip
// @route   POST /api/trips
// @access  Private
router.post("/", protect, async (req, res, next) => {
  try {
    // Add user ID to trip data
    const tripData = {
      ...req.body,
      userId: req.user._id,
    };

    const trip = new Trip(tripData);
    await trip.save();

    res.status(201).json({
      success: true,
      message: "Trip created",
      tripId: trip._id,
    });
  } catch (err) {
    next(err);
  }
});

// @desc    List all trips for current user
// @route   GET /api/trips
// @access  Private
router.get("/", protect, async (req, res, next) => {
  try {
    // Add filtering options
    const { status, sort } = req.query;

    // Build query
    const query = { userId: req.user._id };

    // Filter by status if provided
    if (status === "active") {
      query.completedAt = null;
    } else if (status === "completed") {
      query.completedAt = { $ne: null };
    }

    // Build sort options
    let sortOption = {};
    if (sort === "newest") {
      sortOption = { startedAt: -1 };
    } else if (sort === "oldest") {
      sortOption = { startedAt: 1 };
    } else if (sort === "name") {
      sortOption = { tripName: 1 };
    } else {
      // Default sort
      sortOption = { startedAt: -1 };
    }

    const trips = await Trip.find(
      query,
      "tripName startLocation endLocation startedAt completedAt"
    ).sort(sortOption);

    res.json({
      success: true,
      count: trips.length,
      trips,
    });
  } catch (err) {
    next(err);
  }
});

// @desc    Get trip details by ID
// @route   GET /api/trips/:tripId
// @access  Private
router.get("/:tripId", protect, async (req, res, next) => {
  try {
    const trip = await Trip.findOne({
      _id: req.params.tripId,
      userId: req.user._id,
    }).populate("expenses");

    if (!trip) {
      return res.status(404).json({ success: false, error: "Trip not found" });
    }

    res.json({
      success: true,
      trip,
    });
  } catch (err) {
    next(err);
  }
});

// @desc    Update trip details
// @route   PUT /api/trips/:tripId
// @access  Private
router.put("/:tripId", protect, async (req, res, next) => {
  try {
    const trip = await Trip.findOneAndUpdate(
      { _id: req.params.tripId, userId: req.user._id },
      req.body,
      { new: true, runValidators: true }
    );

    if (!trip) {
      return res.status(404).json({ success: false, error: "Trip not found" });
    }

    res.json({
      success: true,
      trip,
    });
  } catch (err) {
    next(err);
  }
});

// @desc    Mark trip as completed
// @route   PUT /api/trips/:tripId/complete
// @access  Private
router.put("/:tripId/complete", protect, async (req, res, next) => {
  try {
    const trip = await Trip.findOneAndUpdate(
      { _id: req.params.tripId, userId: req.user._id },
      { completedAt: new Date() },
      { new: true }
    );

    if (!trip) {
      return res.status(404).json({ success: false, error: "Trip not found" });
    }

    res.json({
      success: true,
      message: "Trip marked as completed",
      trip,
    });
  } catch (err) {
    next(err);
  }
});

// @desc    Mark stop as triggered
// @route   PUT /api/trips/:tripId/stops/:stopId/trigger
// @access  Private
router.put(
  "/:tripId/stops/:stopId/trigger",
  protect,
  async (req, res, next) => {
    try {
      const { triggeredAt } = req.body;

      const trip = await Trip.findOne({
        _id: req.params.tripId,
        userId: req.user._id,
      });

      if (!trip) {
        return res
          .status(404)
          .json({ success: false, error: "Trip not found" });
      }

      const stop = trip.stops.id(req.params.stopId);
      if (!stop) {
        return res
          .status(404)
          .json({ success: false, error: "Stop not found" });
      }

      stop.triggeredAt = triggeredAt;
      await trip.save();

      res.json({
        success: true,
        message: "Stop triggered",
        stop,
      });
    } catch (err) {
      next(err);
    }
  }
);

// @desc    Add a stop to a trip
// @route   POST /api/trips/:tripId/stops
// @access  Private
router.post("/:tripId/stops", protect, async (req, res, next) => {
  try {
    const trip = await Trip.findOne({
      _id: req.params.tripId,
      userId: req.user._id,
    });

    if (!trip) {
      return res.status(404).json({ success: false, error: "Trip not found" });
    }

    trip.stops.push(req.body);
    await trip.save();

    // Get the newly added stop
    const newStop = trip.stops[trip.stops.length - 1];

    res.status(201).json({
      success: true,
      message: "Stop added to trip",
      stop: newStop,
    });
  } catch (err) {
    next(err);
  }
});

// @desc    Update a stop
// @route   PUT /api/trips/:tripId/stops/:stopId
// @access  Private
router.put("/:tripId/stops/:stopId", protect, async (req, res, next) => {
  try {
    const trip = await Trip.findOne({
      _id: req.params.tripId,
      userId: req.user._id,
    });

    if (!trip) {
      return res.status(404).json({ success: false, error: "Trip not found" });
    }

    const stop = trip.stops.id(req.params.stopId);
    if (!stop) {
      return res.status(404).json({ success: false, error: "Stop not found" });
    }

    // Update stop fields
    Object.keys(req.body).forEach((key) => {
      stop[key] = req.body[key];
    });

    await trip.save();

    res.json({
      success: true,
      message: "Stop updated",
      stop,
    });
  } catch (err) {
    next(err);
  }
});

// @desc    Delete a stop
// @route   DELETE /api/trips/:tripId/stops/:stopId
// @access  Private
router.delete("/:tripId/stops/:stopId", protect, async (req, res, next) => {
  try {
    const trip = await Trip.findOne({
      _id: req.params.tripId,
      userId: req.user._id,
    });

    if (!trip) {
      return res.status(404).json({ success: false, error: "Trip not found" });
    }

    const stop = trip.stops.id(req.params.stopId);
    if (!stop) {
      return res.status(404).json({ success: false, error: "Stop not found" });
    }

    stop.remove();
    await trip.save();

    res.json({
      success: true,
      message: "Stop removed from trip",
    });
  } catch (err) {
    next(err);
  }
});

// @desc    Add weather snapshot to trip
// @route   POST /api/trips/:tripId/weather
// @access  Private
router.post("/:tripId/weather", protect, async (req, res, next) => {
  try {
    const trip = await Trip.findOne({
      _id: req.params.tripId,
      userId: req.user._id,
    });

    if (!trip) {
      return res.status(404).json({ success: false, error: "Trip not found" });
    }

    // Add fetchedAt timestamp if not provided
    const weatherData = {
      ...req.body,
      fetchedAt: req.body.fetchedAt || new Date(),
    };

    trip.weatherSnapshots.push(weatherData);
    await trip.save();

    // Get the newly added weather snapshot
    const newWeatherSnapshot =
      trip.weatherSnapshots[trip.weatherSnapshots.length - 1];

    res.status(201).json({
      success: true,
      message: "Weather snapshot added to trip",
      weatherSnapshot: newWeatherSnapshot,
    });
  } catch (err) {
    next(err);
  }
});

// @desc    Delete a trip
// @route   DELETE /api/trips/:tripId
// @access  Private
router.delete("/:tripId", protect, async (req, res, next) => {
  try {
    const trip = await Trip.findOneAndDelete({
      _id: req.params.tripId,
      userId: req.user._id,
    });

    if (!trip) {
      return res.status(404).json({ success: false, error: "Trip not found" });
    }

    // Delete associated expenses
    await Expense.deleteMany({ tripId: req.params.tripId });

    res.json({
      success: true,
      message: "Trip and associated expenses deleted",
    });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
