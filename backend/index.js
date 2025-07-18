require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
app.use(cors({ origin: '*' }));
app.use(express.json());

// Log every incoming request
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

// Connect to MongoDB with default DB name if not provided
let mongoUri = process.env.MONGODB_URI;
if (mongoUri && (mongoUri.endsWith('/') || mongoUri.endsWith(':27017'))) {
  mongoUri = mongoUri.replace(/\/?$/, '/wakemeup');
}
mongoose.connect(mongoUri, {
  // useNewUrlParser and useUnifiedTopology are not needed for Mongoose 6+
}).then(() => console.log('MongoDB connected to', mongoUri))
  .catch((err) => console.error('MongoDB connection error:', err));

// --- API ROUTES PLACEHOLDER ---
app.get('/', (req, res) => {
  res.send('API is running');
});

app.use('/api/trips', require('./routes/trips'));
app.use('/api/expenses', require('./routes/expenses'));
app.use('/api/weather', require('./routes/weather'));
app.use('/api/routes', require('./routes/routes'));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`)); 