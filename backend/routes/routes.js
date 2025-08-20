const express = require("express");
const axios = require("axios");
const { protect } = require("../middleware/auth");
const LocationCache = require("../models/LocationCache");
const router = express.Router();

// @desc    Get directions between two points
// @route   GET /api/routes?origin=lat,lng&destination=lat,lng&travelMode=driving
// @access  Private
router.get("/", protect, async (req, res, next) => {
  try {
    const { origin, destination, travelMode = "driving" } = req.query;

    if (!origin || !destination) {
      return res.status(400).json({
        success: false,
        error: "Origin and destination are required",
      });
    }

    const apiKey = process.env.GOOGLE_MAPS_API_KEY;
    if (!apiKey) {
      return res.status(500).json({
        success: false,
        error: "Google Maps API key not configured",
      });
    }

    // Validate travel mode
    const validModes = ["driving", "walking", "bicycling", "transit"];
    if (!validModes.includes(travelMode)) {
      return res.status(400).json({
        success: false,
        error: `Travel mode must be one of: ${validModes.join(", ")}`,
      });
    }

    // Google Maps Directions API
    const url = `https://maps.googleapis.com/maps/api/directions/json?origin=${origin}&destination=${destination}&mode=${travelMode}&key=${apiKey}`;
    const response = await axios.get(url);
    const data = response.data;

    if (data.status !== "OK") {
      return res.status(404).json({
        success: false,
        error: `Google Maps API error: ${data.status}`,
      });
    }

    if (!data.routes || !data.routes[0]) {
      return res.status(404).json({
        success: false,
        error: "No route found",
      });
    }

    const route = data.routes[0];
    const leg = route.legs[0];

    // Format response
    const formattedRoute = {
      polyline: route.overview_polyline.points,
      summary: route.summary,
      durationText: leg.duration.text,
      durationMin: Math.round(leg.duration.value / 60),
      distanceText: leg.distance.text,
      distanceKm: (leg.distance.value / 1000).toFixed(2),
      startAddress: leg.start_address,
      endAddress: leg.end_address,
      startLocation: leg.start_location,
      endLocation: leg.end_location,
      steps: leg.steps.map((step) => ({
        instruction: step.html_instructions,
        distance: (step.distance.value / 1000).toFixed(2),
        distanceText: step.distance.text,
        duration: Math.round(step.duration.value / 60),
        durationText: step.duration.text,
        startLocation: step.start_location,
        endLocation: step.end_location,
        travelMode: step.travel_mode,
        maneuver: step.maneuver || null,
      })),
    };

    res.json({
      success: true,
      route: formattedRoute,
    });
  } catch (err) {
    console.error("Google Maps API Error:", err);

    if (err.response) {
      return res.status(err.response.status).json({
        success: false,
        error: `Google Maps service error: ${
          err.response.data.error_message || "Unknown error"
        }`,
      });
    } else if (err.request) {
      return res.status(503).json({
        success: false,
        error: "Google Maps service is unavailable",
      });
    } else {
      next(err);
    }
  }
});

// @desc    Get travel time estimate between two points
// @route   GET /api/routes/eta?origin=lat,lng&destination=lat,lng&travelMode=driving
// @access  Private
router.get("/eta", protect, async (req, res, next) => {
  try {
    const { origin, destination, travelMode = "driving" } = req.query;

    if (!origin || !destination) {
      return res.status(400).json({
        success: false,
        error: "Origin and destination are required",
      });
    }

    const apiKey = process.env.GOOGLE_MAPS_API_KEY;
    if (!apiKey) {
      return res.status(500).json({
        success: false,
        error: "Google Maps API key not configured",
      });
    }

    // Google Maps Distance Matrix API
    const url = `https://maps.googleapis.com/maps/api/distancematrix/json?origins=${origin}&destinations=${destination}&mode=${travelMode}&key=${apiKey}`;
    const response = await axios.get(url);
    const data = response.data;

    if (data.status !== "OK") {
      return res.status(404).json({
        success: false,
        error: `Google Maps API error: ${data.status}`,
      });
    }

    const result = data.rows[0].elements[0];
    if (result.status !== "OK") {
      return res.status(404).json({
        success: false,
        error: `Route not found: ${result.status}`,
      });
    }

    res.json({
      success: true,
      origin: data.origin_addresses[0],
      destination: data.destination_addresses[0],
      distance: {
        text: result.distance.text,
        value: result.distance.value, // in meters
      },
      duration: {
        text: result.duration.text,
        value: result.duration.value, // in seconds
      },
    });
  } catch (err) {
    console.error("Google Maps API Error:", err);

    if (err.response) {
      return res.status(err.response.status).json({
        success: false,
        error: `Google Maps service error: ${
          err.response.data.error_message || "Unknown error"
        }`,
      });
    } else if (err.request) {
      return res.status(503).json({
        success: false,
        error: "Google Maps service is unavailable",
      });
    } else {
      next(err);
    }
  }
});

// @desc    Geocode an address or place
// @route   GET /api/routes/geocode?address=...
// @access  Private
router.get("/geocode", protect, async (req, res, next) => {
  try {
    const { address } = req.query;

    if (!address) {
      return res.status(400).json({
        success: false,
        error: "Address is required",
      });
    }

    const apiKey = process.env.GOOGLE_MAPS_API_KEY;
    if (!apiKey) {
      return res.status(500).json({
        success: false,
        error: "Google Maps API key not configured",
      });
    }

    // Check cache first
    const cachedLocation = await LocationCache.findOne({
      $or: [
        { name: { $regex: new RegExp(address, "i") } },
        { address: { $regex: new RegExp(address, "i") } },
      ],
    });

    if (cachedLocation) {
      return res.json({
        success: true,
        location: {
          name: cachedLocation.name,
          address: cachedLocation.address,
          coordinates: cachedLocation.coordinates,
          placeId: cachedLocation.placeId,
          source: "cache",
        },
      });
    }

    // Google Maps Geocoding API
    const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
      address
    )}&key=${apiKey}`;
    const response = await axios.get(url);
    const data = response.data;

    if (data.status !== "OK") {
      return res.status(404).json({
        success: false,
        error: `Geocoding API error: ${data.status}`,
      });
    }

    if (data.results.length === 0) {
      return res.status(404).json({
        success: false,
        error: "No results found for this address",
      });
    }

    const result = data.results[0];

    // Save to cache
    const newCacheEntry = new LocationCache({
      placeId: result.place_id,
      name: address,
      coordinates: {
        lat: result.geometry.location.lat,
        lng: result.geometry.location.lng,
      },
      address: result.formatted_address,
    });

    await newCacheEntry.save();

    res.json({
      success: true,
      location: {
        name: address,
        address: result.formatted_address,
        coordinates: {
          lat: result.geometry.location.lat,
          lng: result.geometry.location.lng,
        },
        placeId: result.place_id,
        source: "api",
      },
    });
  } catch (err) {
    console.error("Google Maps API Error:", err);

    if (err.response) {
      return res.status(err.response.status).json({
        success: false,
        error: `Google Maps service error: ${
          err.response.data.error_message || "Unknown error"
        }`,
      });
    } else if (err.request) {
      return res.status(503).json({
        success: false,
        error: "Google Maps service is unavailable",
      });
    } else {
      next(err);
    }
  }
});

// @desc    Get place details
// @route   GET /api/routes/place?placeId=...
// @access  Private
router.get("/place", protect, async (req, res, next) => {
  try {
    const { placeId } = req.query;

    if (!placeId) {
      return res.status(400).json({
        success: false,
        error: "Place ID is required",
      });
    }

    const apiKey = process.env.GOOGLE_MAPS_API_KEY;
    if (!apiKey) {
      return res.status(500).json({
        success: false,
        error: "Google Maps API key not configured",
      });
    }

    // Check cache first
    const cachedLocation = await LocationCache.findOne({ placeId });

    if (cachedLocation) {
      return res.json({
        success: true,
        place: {
          name: cachedLocation.name,
          address: cachedLocation.address,
          coordinates: cachedLocation.coordinates,
          placeId: cachedLocation.placeId,
          source: "cache",
        },
      });
    }

    // Google Maps Place Details API
    const fields = "name,formatted_address,geometry,place_id";
    const url = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&fields=${fields}&key=${apiKey}`;
    const response = await axios.get(url);
    const data = response.data;

    if (data.status !== "OK") {
      return res.status(404).json({
        success: false,
        error: `Places API error: ${data.status}`,
      });
    }

    const result = data.result;

    // Save to cache
    const newCacheEntry = new LocationCache({
      placeId: result.place_id,
      name: result.name,
      coordinates: {
        lat: result.geometry.location.lat,
        lng: result.geometry.location.lng,
      },
      address: result.formatted_address,
    });

    await newCacheEntry.save();

    res.json({
      success: true,
      place: {
        name: result.name,
        address: result.formatted_address,
        coordinates: {
          lat: result.geometry.location.lat,
          lng: result.geometry.location.lng,
        },
        placeId: result.place_id,
        source: "api",
      },
    });
  } catch (err) {
    console.error("Google Maps API Error:", err);

    if (err.response) {
      return res.status(err.response.status).json({
        success: false,
        error: `Google Maps service error: ${
          err.response.data.error_message || "Unknown error"
        }`,
      });
    } else if (err.request) {
      return res.status(503).json({
        success: false,
        error: "Google Maps service is unavailable",
      });
    } else {
      next(err);
    }
  }
});

module.exports = router;
