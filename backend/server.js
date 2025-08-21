const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const dotenv = require('dotenv');

// Import routes
const tripsRoutes = require('./routes/trips');
const expensesRoutes = require('./routes/expenses');
const alarmsRoutes = require('./routes/alarms');

// Load environment variables
dotenv.config();

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 3000;

// Configure CORS more explicitly
const corsOptions = {
  origin: '*', // This allows all origins
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Accept'],
  credentials: true
};

// Middleware
app.use(cors(corsOptions));
app.use(bodyParser.json());
app.use(morgan('dev'));

// Add OPTIONS handling for preflight requests
app.options('*', cors(corsOptions));

// Health check endpoint
app.get('/api', (req, res) => {
  res.json({ status: 'ok', message: 'API is running' });
});

// Use routes
app.use('/api/trips', tripsRoutes);
app.use('/api/expenses', expensesRoutes);
app.use('/api/alarms', alarmsRoutes);

// Start server - listen on all network interfaces (0.0.0.0) for external access
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on http://localhost:${PORT}`);
  console.log(`For external access use http://YOUR_IP_ADDRESS:${PORT}`);
});
