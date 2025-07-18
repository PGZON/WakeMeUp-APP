const express = require('express');
const Expense = require('../models/Expense');
const router = express.Router();

// POST /api/expenses - Create expense for a trip
router.post('/', async (req, res) => {
  try {
    const expense = new Expense(req.body);
    await expense.save();
    res.status(201).json({ message: 'Expense created', expenseId: expense._id });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// GET /api/expenses?tripId=... - List expenses for a trip
router.get('/', async (req, res) => {
  try {
    const { tripId } = req.query;
    const query = tripId ? { tripId } : {};
    const expenses = await Expense.find(query);
    res.json(expenses);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router; 