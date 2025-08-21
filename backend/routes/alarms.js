const express = require('express');
const router = express.Router();

// Get all alarms
router.get('/', (req, res) => {
  try {
    // Mock data - in a real app, this would fetch from a database
    res.json({
      status: 'success',
      data: [
        {
          id: '1',
          tripId: '1',
          stopId: '101',
          time: new Date(Date.now() + 3600000).toISOString(), // 1 hour later
          isEnabled: true,
          soundName: 'Bells',
          label: 'Wake up for Mountain View'
        }
      ]
    });
  } catch (error) {
    console.error('Error fetching alarms:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to fetch alarms'
    });
  }
});

// Get alarms for a specific trip
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
          stopId: '101',
          time: new Date(Date.now() + 3600000).toISOString(), // 1 hour later
          isEnabled: true,
          soundName: 'Bells',
          label: 'Wake up for Mountain View'
        }
      ]
    });
  } catch (error) {
    console.error(`Error fetching alarms for trip ${tripId}:`, error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to fetch alarms'
    });
  }
});

// Get a single alarm by ID
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
          stopId: '101',
          time: new Date(Date.now() + 3600000).toISOString(),
          isEnabled: true,
          soundName: 'Bells',
          label: 'Wake up for Mountain View'
        }
      });
    } else {
      res.status(404).json({
        status: 'error',
        message: 'Alarm not found'
      });
    }
  } catch (error) {
    console.error(`Error fetching alarm ${id}:`, error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to fetch alarm'
    });
  }
});

// Create a new alarm
router.post('/', (req, res) => {
  try {
    // In a real app, this would save to a database
    const newAlarm = {
      id: Date.now().toString(),
      ...req.body,
      createdAt: new Date().toISOString()
    };
    
    res.status(201).json({
      status: 'success',
      data: newAlarm
    });
  } catch (error) {
    console.error('Error creating alarm:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to create alarm'
    });
  }
});

// Update an alarm
router.put('/:id', (req, res) => {
  const { id } = req.params;
  try {
    // In a real app, this would update in a database
    res.json({
      status: 'success',
      data: {
        id,
        ...req.body,
        updatedAt: new Date().toISOString()
      }
    });
  } catch (error) {
    console.error(`Error updating alarm ${id}:`, error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to update alarm'
    });
  }
});

// Toggle alarm status
router.patch('/:id/toggle', (req, res) => {
  const { id } = req.params;
  const { isEnabled } = req.body;
  
  try {
    // In a real app, this would update in a database
    res.json({
      status: 'success',
      data: {
        id,
        isEnabled,
        updatedAt: new Date().toISOString()
      }
    });
  } catch (error) {
    console.error(`Error toggling alarm ${id}:`, error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to toggle alarm'
    });
  }
});

// Delete an alarm
router.delete('/:id', (req, res) => {
  const { id } = req.params;
  try {
    // In a real app, this would delete from a database
    res.json({
      status: 'success',
      message: `Alarm ${id} deleted successfully`
    });
  } catch (error) {
    console.error(`Error deleting alarm ${id}:`, error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to delete alarm'
    });
  }
});

module.exports = router;
