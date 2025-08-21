import { Alarm } from '@/hooks/useAlarms';
import { Expense } from '@/hooks/useExpenses';
import { Trip } from '@/hooks/useTrips';
import { Platform } from 'react-native';

// Use environment variable for API base URL
const API_BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL || 'http://localhost:3000/api';

// Generic fetch function with error handling
async function fetchApi(endpoint: string, options: RequestInit = {}) {
  try {
    const url = `${API_BASE_URL}${endpoint}`;
    console.log(`Fetching: ${url}`);
    
    // Create an AbortController for timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => {
      console.log(`Request timed out for: ${url}`);
      controller.abort();
    }, 10000); // Increase timeout to 10 seconds
    
    try {
      const response = await fetch(url, {
        ...options,
        signal: controller.signal,
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          ...options.headers,
        },
      });
      
      clearTimeout(timeoutId);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `API request failed with status ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      clearTimeout(timeoutId);
      throw error;
    }
  } catch (error: any) {
    if (error?.name === 'AbortError') {
      console.error('API request timed out');
      throw new Error('Request timed out');
    }
    console.error('API request failed:', error);
    throw error;
  }
}

// Trip APIs
export const tripService = {
  getTrips: async (): Promise<Trip[]> => {
    const response = await fetchApi('/trips');
    return response.data || [];
  },

  getTripById: async (id: string): Promise<Trip> => {
    const response = await fetchApi(`/trips/${id}`);
    return response.data;
  },

  createTrip: async (trip: Omit<Trip, 'id' | 'createdAt' | 'updatedAt'>): Promise<Trip> => {
    const response = await fetchApi('/trips', {
      method: 'POST',
      body: JSON.stringify(trip),
    });
    return response.data;
  },

  updateTrip: async (id: string, trip: Partial<Trip>): Promise<Trip> => {
    const response = await fetchApi(`/trips/${id}`, {
      method: 'PUT',
      body: JSON.stringify(trip),
    });
    return response.data;
  },

  deleteTrip: async (id: string): Promise<void> => {
    await fetchApi(`/trips/${id}`, {
      method: 'DELETE',
    });
  },
};

// Expense APIs
export const expenseService = {
  getExpenses: async (): Promise<Expense[]> => {
    const response = await fetchApi('/expenses');
    return response.data || [];
  },

  getExpensesByTripId: async (tripId: string): Promise<Expense[]> => {
    const response = await fetchApi(`/expenses/trip/${tripId}`);
    return response.data || [];
  },

  getExpenseById: async (id: string): Promise<Expense> => {
    const response = await fetchApi(`/expenses/${id}`);
    return response.data;
  },

  createExpense: async (expense: Omit<Expense, 'id' | 'createdAt' | 'updatedAt'>): Promise<Expense> => {
    const response = await fetchApi('/expenses', {
      method: 'POST',
      body: JSON.stringify(expense),
    });
    return response.data;
  },

  updateExpense: async (id: string, expense: Partial<Expense>): Promise<Expense> => {
    const response = await fetchApi(`/expenses/${id}`, {
      method: 'PUT',
      body: JSON.stringify(expense),
    });
    return response.data;
  },

  deleteExpense: async (id: string): Promise<void> => {
    await fetchApi(`/expenses/${id}`, {
      method: 'DELETE',
    });
  },
};

// Alarm APIs
export const alarmService = {
  getAlarms: async (): Promise<Alarm[]> => {
    const response = await fetchApi('/alarms');
    return response.data || [];
  },

  getAlarmsByTripId: async (tripId: string): Promise<Alarm[]> => {
    const response = await fetchApi(`/alarms/trip/${tripId}`);
    return response.data || [];
  },

  getAlarmById: async (id: string): Promise<Alarm> => {
    const response = await fetchApi(`/alarms/${id}`);
    return response.data;
  },

  createAlarm: async (alarm: Omit<Alarm, 'id' | 'createdAt' | 'updatedAt'>): Promise<Alarm> => {
    const response = await fetchApi('/alarms', {
      method: 'POST',
      body: JSON.stringify(alarm),
    });
    return response.data;
  },

  updateAlarm: async (id: string, alarm: Partial<Alarm>): Promise<Alarm> => {
    const response = await fetchApi(`/alarms/${id}`, {
      method: 'PUT',
      body: JSON.stringify(alarm),
    });
    return response.data;
  },

  toggleAlarm: async (id: string, isActive: boolean): Promise<Alarm> => {
    const response = await fetchApi(`/alarms/${id}/toggle`, {
      method: 'PATCH',
      body: JSON.stringify({ isEnabled: isActive }),
    });
    return response.data;
  },

  deleteAlarm: async (id: string): Promise<void> => {
    await fetchApi(`/alarms/${id}`, {
      method: 'DELETE',
    });
  },
};
