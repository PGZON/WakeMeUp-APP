const API_BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL;

// --- TRIPS ---
type Trip = Record<string, any>;
type Expense = Record<string, any>;

console.log('API_BASE_URL:', API_BASE_URL);

export async function createTrip(trip: Trip) {
  console.log('POST /trips', trip);
  const res = await fetch(`${API_BASE_URL}/trips`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(trip),
  });
  return res.json();
}

export async function getTrips() {
  console.log('GET /trips');
  const res = await fetch(`${API_BASE_URL}/trips`);
  return res.json();
}

export async function getTrip(tripId: string) {
  console.log('GET /trips/' + tripId);
  const res = await fetch(`${API_BASE_URL}/trips/${tripId}`);
  return res.json();
}

export async function triggerStop(tripId: string, stopId: string, triggeredAt: string) {
  console.log('PUT /trips/' + tripId + '/stops/' + stopId + '/trigger', triggeredAt);
  const res = await fetch(`${API_BASE_URL}/trips/${tripId}/stops/${stopId}/trigger`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ triggeredAt }),
  });
  return res.json();
}

export async function deleteTrip(tripId: string) {
  console.log('DELETE /trips/' + tripId);
  const res = await fetch(`${API_BASE_URL}/trips/${tripId}`, { method: 'DELETE' });
  return res.json();
}

// --- EXPENSES ---
export async function createExpense(expense: Expense) {
  console.log('POST /expenses', expense);
  const res = await fetch(`${API_BASE_URL}/expenses`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(expense),
  });
  return res.json();
}

export async function getExpenses(tripId: string) {
  console.log('GET /expenses?tripId=' + tripId);
  const res = await fetch(`${API_BASE_URL}/expenses?tripId=${tripId}`);
  return res.json();
}

// --- WEATHER ---
export async function getWeather(lat: number, lng: number) {
  console.log('GET /weather?lat=' + lat + '&lng=' + lng);
  const res = await fetch(`${API_BASE_URL}/weather?lat=${lat}&lng=${lng}`);
  return res.json();
}

// --- ROUTES ---
export async function getRoute(origin: string, destination: string, travelMode: string) {
  console.log('GET /routes?origin=' + origin + '&destination=' + destination + '&travelMode=' + travelMode);
  const res = await fetch(`${API_BASE_URL}/routes?origin=${origin}&destination=${destination}&travelMode=${travelMode}`);
  return res.json();
} 