const express = require("express");
const axios = require("axios");
const { protect } = require("../middleware/auth");
const router = express.Router();

// @desc    Get current weather for a location
// @route   GET /api/weather?lat=...&lng=...
// @access  Private
router.get("/", protect, async (req, res, next) => {
  try {
    const { lat, lng } = req.query;

    if (!lat || !lng) {
      return res.status(400).json({
        success: false,
        error: "Latitude and longitude are required",
      });
    }

    const apiKey = process.env.WEATHER_API_KEY;
    if (!apiKey) {
      return res.status(500).json({
        success: false,
        error: "Weather API key not configured",
      });
    }

    // WeatherAPI.com endpoint
    const url = `http://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${lat},${lng}`;
    const response = await axios.get(url);
    const data = response.data;

    res.json({
      success: true,
      weather: {
        locationName: data.location.name,
        region: data.location.region,
        country: data.location.country,
        temperature: data.current.temp_c,
        temperatureF: data.current.temp_f,
        description: data.current.condition.text,
        icon: data.current.condition.icon,
        conditionCode: data.current.condition.code,
        humidity: data.current.humidity,
        wind_kph: data.current.wind_kph,
        wind_mph: data.current.wind_mph,
        wind_dir: data.current.wind_dir,
        is_day: data.current.is_day,
        uv: data.current.uv,
        feelslike_c: data.current.feelslike_c,
        feelslike_f: data.current.feelslike_f,
      },
    });
  } catch (err) {
    console.error("Weather API Error:", err);

    if (err.response) {
      // The request was made and the server responded with a status code
      return res.status(err.response.status).json({
        success: false,
        error: `Weather service error: ${
          err.response.data.error?.message || "Unknown error"
        }`,
      });
    } else if (err.request) {
      // The request was made but no response was received
      return res.status(503).json({
        success: false,
        error: "Weather service is unavailable",
      });
    } else {
      // Something happened in setting up the request
      next(err);
    }
  }
});

// @desc    Get forecast for a location
// @route   GET /api/weather/forecast?lat=...&lng=...&days=3
// @access  Private
router.get("/forecast", protect, async (req, res, next) => {
  try {
    const { lat, lng, days = 3 } = req.query;

    if (!lat || !lng) {
      return res.status(400).json({
        success: false,
        error: "Latitude and longitude are required",
      });
    }

    const apiKey = process.env.WEATHER_API_KEY;
    if (!apiKey) {
      return res.status(500).json({
        success: false,
        error: "Weather API key not configured",
      });
    }

    // WeatherAPI.com forecast endpoint
    const url = `http://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=${lat},${lng}&days=${days}`;
    const response = await axios.get(url);
    const data = response.data;

    // Format forecast data
    const forecastDays = data.forecast.forecastday.map((day) => ({
      date: day.date,
      maxtemp_c: day.day.maxtemp_c,
      maxtemp_f: day.day.maxtemp_f,
      mintemp_c: day.day.mintemp_c,
      mintemp_f: day.day.mintemp_f,
      avgtemp_c: day.day.avgtemp_c,
      avgtemp_f: day.day.avgtemp_f,
      condition: day.day.condition,
      daily_chance_of_rain: day.day.daily_chance_of_rain,
      sunrise: day.astro.sunrise,
      sunset: day.astro.sunset,
      hourly: day.hour.map((hour) => ({
        time: hour.time,
        temp_c: hour.temp_c,
        temp_f: hour.temp_f,
        condition: hour.condition,
        chance_of_rain: hour.chance_of_rain,
      })),
    }));

    res.json({
      success: true,
      location: {
        name: data.location.name,
        region: data.location.region,
        country: data.location.country,
      },
      current: {
        temperature: data.current.temp_c,
        temperatureF: data.current.temp_f,
        description: data.current.condition.text,
        icon: data.current.condition.icon,
      },
      forecast: forecastDays,
    });
  } catch (err) {
    console.error("Weather API Error:", err);

    if (err.response) {
      return res.status(err.response.status).json({
        success: false,
        error: `Weather service error: ${
          err.response.data.error?.message || "Unknown error"
        }`,
      });
    } else if (err.request) {
      return res.status(503).json({
        success: false,
        error: "Weather service is unavailable",
      });
    } else {
      next(err);
    }
  }
});

module.exports = router;
