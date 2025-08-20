# WakeMeUp Backend API

Backend REST API for the WakeMeUp travel application that provides services for trip planning, expense tracking, weather monitoring, and route planning.

## Features

- User authentication and authorization
- Trip management (create, read, update, delete)
- Expense tracking per trip
- Real-time weather information
- Route planning with Google Maps integration
- Location geocoding and caching

## Tech Stack

- Node.js & Express.js - API framework
- MongoDB & Mongoose - Database and ODM
- JWT - Authentication
- Axios - HTTP client for external API calls
- Morgan - HTTP request logger
- bcrypt.js - Password hashing

## Installation

1. Clone the repository

```bash
git clone https://github.com/PGZON/WakeMeUp-APP.git
cd WakeMeUp-APP/backend
```

2. Install dependencies

```bash
npm install
```

3. Create a `.env` file in the backend directory with the following variables:

```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/wakemeup
JWT_SECRET=your_jwt_secret_key_replace_this_in_production
WEATHER_API_KEY=your_weather_api_key
GOOGLE_MAPS_API_KEY=your_google_maps_api_key
```

4. Start the server

```bash
# Development mode
npm run dev

# Production mode
npm start
```

## API Endpoints

### Authentication

- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login a user

### User Management

- `GET /api/users/me` - Get current user profile
- `PUT /api/users/me` - Update user profile
- `PUT /api/users/preferences` - Update user preferences
- `PUT /api/users/change-password` - Change user password

### Trips

- `POST /api/trips` - Create a new trip
- `GET /api/trips` - Get all trips for current user
- `GET /api/trips/:tripId` - Get a trip by ID
- `PUT /api/trips/:tripId` - Update a trip
- `DELETE /api/trips/:tripId` - Delete a trip
- `PUT /api/trips/:tripId/complete` - Mark trip as completed
- `POST /api/trips/:tripId/stops` - Add a stop to a trip
- `PUT /api/trips/:tripId/stops/:stopId` - Update a stop
- `PUT /api/trips/:tripId/stops/:stopId/trigger` - Mark stop as triggered
- `DELETE /api/trips/:tripId/stops/:stopId` - Delete a stop
- `POST /api/trips/:tripId/weather` - Add weather snapshot to trip

### Expenses

- `POST /api/expenses` - Create a new expense
- `GET /api/expenses?tripId=...` - Get all expenses for a trip
- `GET /api/expenses/:id` - Get an expense by ID
- `PUT /api/expenses/:id` - Update an expense
- `DELETE /api/expenses/:id` - Delete an expense
- `GET /api/expenses/stats/:tripId` - Get expense statistics for a trip

### Weather

- `GET /api/weather?lat=...&lng=...` - Get current weather for location
- `GET /api/weather/forecast?lat=...&lng=...&days=3` - Get weather forecast

### Routes

- `GET /api/routes?origin=...&destination=...&travelMode=...` - Get directions
- `GET /api/routes/eta?origin=...&destination=...&travelMode=...` - Get ETA
- `GET /api/routes/geocode?address=...` - Geocode an address
- `GET /api/routes/place?placeId=...` - Get place details

## License

ISC
