import 'dotenv/config';
import './app.env';
import express from 'express';
import cors from 'cors';
import { expressMiddleware } from '@apollo/server/express4';
import { ApolloServer } from '@apollo/server';
import bodyParser from 'body-parser';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

// Import routes
import tripsRoutes from './routes/trips.js';
import alarmsRoutes from './routes/alarms.js';
import expensesRoutes from './routes/expenses.js';

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 3000;
const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

// Health check endpoint
app.get('/api', (req, res) => {
  res.json({ status: 'ok', message: 'API is running' });
});

// Use routes
app.use('/api/trips', tripsRoutes);
app.use('/api/expenses', expensesRoutes);
app.use('/api/alarms', alarmsRoutes);

// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
