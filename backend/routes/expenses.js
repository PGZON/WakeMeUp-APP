const express = require('express');
const router = express.Router();

// Get all expenses
router.get('/', (req, res) => {
  try {
    // Mock data - in a real app, this would fetch from a database
    res.json({
      status: 'success',
      data: [
        {
          id: '1',
          tripId: '1',
          amount: 120.50,
          category: 'Food',
          date: new Date().toISOString(),
          description: 'Dinner at Mountain View Restaurant'
        },
        {
          id: '2',
          tripId: '1',
          amount: 75.00,
          category: 'Transportation',
          date: new Date().toISOString(),
          description: 'Gas refill'
        }
      ]
    });
  } catch (error) {
    console.error('Error fetching expenses:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to fetch expenses'
    });
  }
});

// Get expenses for a specific trip
router.get('/trip/:tripId', (req, res) => {
  const { tripId } = req.params;
  try {
    // Mock data - in a real app, this would fetch from a database
    res.json({
      status: 'success',
      data: [
        {
          id: '1',
          tripId,
          amount: 120.50,
          category: 'Food',
          date: new Date().toISOString(),
          description: 'Dinner at Mountain View Restaurant'
        },
        {
          id: '2',
          tripId,
          amount: 75.00,
          category: 'Transportation',
          date: new Date().toISOString(),
          description: 'Gas refill'
        }
      ]
    });
  } catch (error) {
    console.error(`Error fetching expenses for trip ${tripId}:`, error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to fetch expenses'
    });
  }
});

// Get a single expense by ID
router.get('/:id', (req, res) => {
  const { id } = req.params;
  try {
    // Mock data - in a real app, this would fetch from a database
    if (id === '1') {
      res.json({
        status: 'success',
        data: {
          id: '1',
          tripId: '1',
          amount: 120.50,
          category: 'Food',
          date: new Date().toISOString(),
          description: 'Dinner at Mountain View Restaurant'
        }
      });
    } else {
      res.status(404).json({
        status: 'error',
        message: 'Expense not found'
      });
    }
  } catch (error) {
    console.error(`Error fetching expense ${id}:`, error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to fetch expense'
    });
  }
});

// Create a new expense
router.post('/', (req, res) => {
  try {
    // In a real app, this would save to a database
    const newExpense = {
      id: Date.now().toString(),
      ...req.body,
      date: req.body.date || new Date().toISOString()
    };
    
    res.status(201).json({
      status: 'success',
      data: newExpense
    });
  } catch (error) {
    console.error('Error creating expense:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to create expense'
    });
  }
});

// Update an expense
router.put('/:id', (req, res) => {
  const { id } = req.params;
  try {
    // In a real app, this would update in a database
    res.json({
      status: 'success',
      data: {
        id,
        ...req.body
      }
    });
  } catch (error) {
    console.error(`Error updating expense ${id}:`, error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to update expense'
    });
  }
});

// Delete an expense
router.delete('/:id', (req, res) => {
  const { id } = req.params;
  try {
    // In a real app, this would delete from a database
    res.json({
      status: 'success',
      message: `Expense ${id} deleted successfully`
    });
  } catch (error) {
    console.error(`Error deleting expense ${id}:`, error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to delete expense'
    });
  }
});

module.exports = router;
