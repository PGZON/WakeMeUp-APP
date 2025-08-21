const express = require('express');
const router = express.Router();

// Get all trips
router.get('/', (req, res) => {
  try {
    // Mock data - in a real app, this would fetch from a database
    res.json({
      status: 'success',
      data: [
        {
          id: '1',
          name: 'Weekend Getaway',
          startDate: new Date().toISOString(),
          endDate: new Date(Date.now() + 172800000).toISOString(), // 2 days later
          travelType: 'car',
          stops: [
            {
              id: '101',
              location: {
                name: 'Mountain View Resort',
                address: '123 Mountain Rd, Hill Valley',
                latitude: 37.7749,
                longitude: -122.4194,
              },
              alarmEnabled: true,
            }
          ]
        },
        {
          id: '2',
          name: 'Business Trip',
          startDate: new Date(Date.now() + 604800000).toISOString(), // 7 days later
          endDate: new Date(Date.now() + 864000000).toISOString(), // 10 days later
          travelType: 'plane',
          stops: [
            {
              id: '201',
              location: {
                name: 'Downtown Hotel',
                address: '456 Main St, Business City',
                latitude: 34.0522,
                longitude: -118.2437,
              },
              alarmEnabled: true,
            }
          ]
        }
      ]
    });
  } catch (error) {
    console.error('Error fetching trips:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to fetch trips'
    });
  }
});

// Get a single trip by ID
router.get('/:id', (req, res) => {
  const { id } = req.params;
  try {
    // Mock data - in a real app, this would fetch from a database
    if (id === '1') {
      res.json({
        status: 'success',
        data: {
          id: '1',
          name: 'Weekend Getaway',
          startDate: new Date().toISOString(),
          endDate: new Date(Date.now() + 172800000).toISOString(),
          travelType: 'car',
          stops: [
            {
              id: '101',
              location: {
                name: 'Mountain View Resort',
                address: '123 Mountain Rd, Hill Valley',
                latitude: 37.7749,
                longitude: -122.4194,
              },
              alarmEnabled: true,
            }
          ]
        }
      });
    } else {
      res.status(404).json({
        status: 'error',
        message: 'Trip not found'
      });
    }
  } catch (error) {
    console.error(`Error fetching trip ${id}:`, error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to fetch trip'
    });
  }
});

// Create a new trip
router.post('/', (req, res) => {
  try {
    // In a real app, this would save to a database
    const newTrip = {
      id: Date.now().toString(),
      ...req.body,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    res.status(201).json({
      status: 'success',
      data: newTrip
    });
  } catch (error) {
    console.error('Error creating trip:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to create trip'
    });
  }
});

// Update a trip
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
    console.error(`Error updating trip ${id}:`, error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to update trip'
    });
  }
});

// Delete a trip
router.delete('/:id', (req, res) => {
  const { id } = req.params;
  try {
    // In a real app, this would delete from a database
    res.json({
      status: 'success',
      message: `Trip ${id} deleted successfully`
    });
  } catch (error) {
    console.error(`Error deleting trip ${id}:`, error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to delete trip'
    });
  }
});

module.exports = router;
