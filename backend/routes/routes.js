const express = require('express');
const axios = require('axios');
const router = express.Router();

// GET /api/routes?origin=lat,lng&destination=lat,lng&travelMode=train
router.get('/', async (req, res) => {
  try {
    const { origin, destination, travelMode } = req.query;
    const apiKey = process.env.GOOGLE_MAPS_API_KEY;
    const url = `https://maps.googleapis.com/maps/api/directions/json?origin=${origin}&destination=${destination}&mode=${travelMode}&key=${apiKey}`;
    const response = await axios.get(url);
    const data = response.data;
    if (!data.routes || !data.routes[0]) {
      return res.status(404).json({ error: 'No route found' });
    }
    const route = data.routes[0];
    const leg = route.legs[0];
    res.json({
      polyline: route.overview_polyline.points,
      durationMin: leg.duration.value / 60,
      distanceKm: leg.distance.value / 1000,
      steps: leg.steps.map(step => ({
        instruction: step.html_instructions,
        distance: step.distance.value / 1000,
        duration: step.duration.value / 60,
      })),
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router; 