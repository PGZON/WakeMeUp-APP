const express = require('express');
const axios = require('axios');
const router = express.Router();

// GET /api/weather?lat=...&lng=...
router.get('/', async (req, res) => {
  try {
    const { lat, lng } = req.query;
    const apiKey = process.env.WEATHER_API_KEY;
    // WeatherAPI.com endpoint
    const url = `http://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${lat},${lng}`;
    const response = await axios.get(url);
    const data = response.data;
    res.json({
      locationName: data.location.name,
      temperature: data.current.temp_c,
      description: data.current.condition.text,
      icon: data.current.condition.icon,
      conditionCode: data.current.condition.code,
      humidity: data.current.humidity,
      wind_kph: data.current.wind_kph,
      wind_dir: data.current.wind_dir,
      is_day: data.current.is_day,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router; 