import { getAuthHeader } from './auth';


const API_BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL || 'http://localhost:5000/api';

if (API_BASE_URL.includes('localhost')) {
  console.warn(
    '[API] WARNING: API_BASE_URL is set to localhost. This will NOT work on a real device. Use your computer’s LAN IP instead.'
  );
}

// --- TRIPS ---
type Trip = Record<string, any>;
type Expense = Record<string, any>;

console.log('API_BASE_URL:', API_BASE_URL);

// Helper function to add auth headers to requests
async function fetchWithAuth(url: string, options: RequestInit = {}) {
  const authHeader = await getAuthHeader();
  
  const headers = {
    'Content-Type': 'application/json',
    ...authHeader,
    ...options.headers
  };
  
  const response = await fetch(url, {
    ...options,
    headers
  });
  
  // Handle common error scenarios
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    console.error(`API Error: ${response.status} ${response.statusText}`, errorData);
    
    // Handle 401 Unauthorized (token expired or invalid)
    if (response.status === 401) {
      // You might want to trigger a logout or token refresh here
      console.warn('Authentication token expired or invalid');
    }
  }
  
  return response;
}

export async function createTrip(trip: Trip) {
  console.log('POST /trips', trip);
  const res = await fetchWithAuth(`${API_BASE_URL}/trips`, {
    method: 'POST',
    body: JSON.stringify(trip),
  });
  return res.json();
}

export async function getTrips() {
  console.log('GET /trips');
  try {
    const res = await fetchWithAuth(`${API_BASE_URL}/trips`);
    return res.json();
  } catch (error) {
    console.error('Failed to fetch trips:', error);
    return { success: false, trips: [] };
  }
}

export async function getTrip(tripId: string) {
  console.log('GET /trips/' + tripId);
  const res = await fetchWithAuth(`${API_BASE_URL}/trips/${tripId}`);
  return res.json();
}

export async function triggerStop(tripId: string, stopId: string, triggeredAt: string) {
  console.log('PUT /trips/' + tripId + '/stops/' + stopId + '/trigger', triggeredAt);
  const res = await fetchWithAuth(`${API_BASE_URL}/trips/${tripId}/stops/${stopId}/trigger`, {
    method: 'PUT',
    body: JSON.stringify({ triggeredAt }),
  });
  return res.json();
}

export async function deleteTrip(tripId: string) {
  console.log('DELETE /trips/' + tripId);
  const res = await fetchWithAuth(`${API_BASE_URL}/trips/${tripId}`, { 
    method: 'DELETE' 
  });
  return res.json();
}

// --- EXPENSES ---
export async function createExpense(expense: Expense) {
  console.log('POST /expenses', expense);
  const res = await fetchWithAuth(`${API_BASE_URL}/expenses`, {
    method: 'POST',
    body: JSON.stringify(expense),
  });
  return res.json();
}

export async function getExpenses(tripId: string) {
  console.log('GET /expenses?tripId=' + tripId);
  const res = await fetchWithAuth(`${API_BASE_URL}/expenses?tripId=${tripId}`);
  return res.json();
}

// --- WEATHER ---
export async function getWeather(lat: number, lng: number) {
  console.log('GET /weather?lat=' + lat + '&lng=' + lng);
  try {
    const res = await fetchWithAuth(`${API_BASE_URL}/weather?lat=${lat}&lng=${lng}`);
    return res.json();
  } catch (error) {
    console.error('Failed to fetch weather:', error);
    return { 
      success: false, 
      weather: {
        locationName: 'Unknown',
        temperature: 0,
        description: 'Unavailable',
      }
    };
  }
}

// --- ROUTES ---
export async function getRoute(origin: string, destination: string, travelMode: string) {
  console.log('GET /routes?origin=' + origin + '&destination=' + destination + '&travelMode=' + travelMode);
  const res = await fetchWithAuth(`${API_BASE_URL}/routes?origin=${origin}&destination=${destination}&travelMode=${travelMode}`);
  return res.json();
} 