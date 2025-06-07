import AsyncStorage from '@react-native-async-storage/async-storage';

// Storage keys
const TRIPS_KEY = '@trips';
const ALARMS_KEY = '@alarms';
const EXPENSES_KEY = '@expenses';

// Generic storage functions
export const saveData = async (key: string, data: any) => {
  try {
    const jsonValue = JSON.stringify(data);
    await AsyncStorage.setItem(key, jsonValue);
    return true;
  } catch (error) {
    console.error('Error saving data:', error);
    return false;
  }
};

export const getData = async (key: string) => {
  try {
    const jsonValue = await AsyncStorage.getItem(key);
    return jsonValue != null ? JSON.parse(jsonValue) : null;
  } catch (error) {
    console.error('Error getting data:', error);
    return null;
  }
};

// Trip storage functions
export const saveTrips = async (trips: any[]) => {
  return saveData(TRIPS_KEY, trips);
};

export const getTrips = async () => {
  return getData(TRIPS_KEY) || [];
};

// Alarm storage functions
export const saveAlarms = async (alarms: any[]) => {
  return saveData(ALARMS_KEY, alarms);
};

export const getAlarms = async () => {
  return getData(ALARMS_KEY) || [];
};

// Expense storage functions
export const saveExpenses = async (expenses: any[]) => {
  return saveData(EXPENSES_KEY, expenses);
};

export const getExpenses = async () => {
  return getData(EXPENSES_KEY) || [];
}; 