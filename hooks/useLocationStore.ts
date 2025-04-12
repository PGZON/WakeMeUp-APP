import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Location, Trip, AlarmSettings, TravelMode } from '@/types/location';

interface LocationState {
  currentLocation: { latitude: number; longitude: number } | null;
  savedLocations: Location[];
  recentTrips: Trip[];
  activeTrip: Trip | null;
  alarmSettings: AlarmSettings;
  isAlarmActive: boolean;
  
  // Actions
  setCurrentLocation: (location: { latitude: number; longitude: number } | null) => void;
  addSavedLocation: (location: Omit<Location, 'id' | 'createdAt'>) => void;
  removeSavedLocation: (id: string) => void;
  toggleFavorite: (id: string) => void;
  startTrip: (destination: Location, alarmDistance: number, alarmType: 'sound' | 'vibration' | 'both', travelMode: TravelMode) => void;
  endTrip: () => void;
  updateAlarmSettings: (settings: Partial<AlarmSettings>) => void;
  setAlarmActive: (active: boolean) => void;
}

export const useLocationStore = create<LocationState>()(
  persist(
    (set) => ({
      currentLocation: null,
      savedLocations: [],
      recentTrips: [],
      activeTrip: null,
      isAlarmActive: false,
      alarmSettings: {
        sound: true,
        vibration: true,
        notification: true,
        ringtone: 'default',
        distance: 500, // 500 meters by default
        volume: 0.8,
      },
      
      setCurrentLocation: (location) => set({ currentLocation: location }),
      
      addSavedLocation: (location) => set((state) => {
        const newLocation: Location = {
          ...location,
          id: Date.now().toString(),
          createdAt: new Date().toISOString(),
        };
        return { savedLocations: [...state.savedLocations, newLocation] };
      }),
      
      removeSavedLocation: (id) => set((state) => ({
        savedLocations: state.savedLocations.filter(location => location.id !== id)
      })),
      
      toggleFavorite: (id) => set((state) => ({
        savedLocations: state.savedLocations.map(location => 
          location.id === id 
            ? { ...location, isFavorite: !location.isFavorite } 
            : location
        )
      })),
      
      startTrip: (destination, alarmDistance, alarmType, travelMode) => set((state) => {
        const newTrip: Trip = {
          id: Date.now().toString(),
          destination,
          alarmDistance,
          alarmType,
          travelMode,
          createdAt: new Date().toISOString(),
        };
        return { 
          activeTrip: newTrip,
          isAlarmActive: true,
        };
      }),
      
      endTrip: () => set((state) => {
        if (!state.activeTrip) return state;
        
        const completedTrip = {
          ...state.activeTrip,
          completedAt: new Date().toISOString(),
        };
        
        return {
          activeTrip: null,
          isAlarmActive: false,
          recentTrips: [completedTrip, ...state.recentTrips].slice(0, 10), // Keep only 10 most recent trips
        };
      }),
      
      updateAlarmSettings: (settings) => set((state) => ({
        alarmSettings: { ...state.alarmSettings, ...settings }
      })),
      
      setAlarmActive: (active) => set({ isAlarmActive: active }),
    }),
    {
      name: 'location-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);