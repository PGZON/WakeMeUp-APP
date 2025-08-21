import { useState, useEffect, useCallback } from "react";
import { saveTrips as saveTripsToStorage, getTrips as getTripsFromStorage } from "@/lib/storage";
import { tripService } from "@/services/api";
import { v4 as uuidv4 } from "uuid";

// Define types
interface Location {
  name: string;
  address: string;
  latitude: number;
  longitude: number;
}

interface Stop {
  id: string;
  location: Location;
}

export interface Trip {
  id: string;
  name: string;
  startDate: string;
  stops: Stop[];
  travelType?: string;
  createdAt: string;
  updatedAt: string;
}

export function useTrips() {
  const [trips, setTrips] = useState<Trip[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isOffline, setIsOffline] = useState(false);

  // Load trips on mount
  useEffect(() => {
    loadTrips();
  }, []);

  const loadTrips = async () => {
    setIsLoading(true);
    try {
      // Try to fetch from API first
      const apiTrips = await tripService.getTrips();
      setTrips(apiTrips);
      setIsOffline(false);
      
      // Update local storage with the latest data
      await saveTripsToStorage(apiTrips);
    } catch (error) {
      console.error("Error loading trips from API:", error);
      // Fallback to local storage if API fails
      try {
        const storedTrips = await getTripsFromStorage();
        setTrips(storedTrips || []);
        setIsOffline(true);
      } catch (storageError) {
        console.error("Error loading trips from storage:", storageError);
        setTrips([]);
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Save trips to storage
  const saveTrips = async (updatedTrips: Trip[]) => {
    try {
      await saveTripsToStorage(updatedTrips);
      setTrips(updatedTrips);
    } catch (error) {
      console.error("Error saving trips:", error);
      throw error;
    }
  };

  // Create a new trip
  const createTrip = async (tripData: Omit<Trip, "id" | "createdAt" | "updatedAt">) => {
    try {
      if (isOffline) {
        // If offline, save to local storage only
        const newTrip: Trip = {
          id: uuidv4(),
          ...tripData,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        
        const updatedTrips = [...trips, newTrip];
        await saveTrips(updatedTrips);
        return newTrip;
      } else {
        // If online, save to API
        const newTrip = await tripService.createTrip(tripData);
        const updatedTrips = [...trips, newTrip];
        await saveTripsToStorage(updatedTrips);
        setTrips(updatedTrips);
        return newTrip;
      }
    } catch (error) {
      console.error("Error creating trip:", error);
      throw error;
    }
  };

  // Get a trip by ID
  const getTrip = async (id: string) => {
    try {
      if (!isOffline) {
        // If online, get from API
        try {
          const trip = await tripService.getTripById(id);
          return trip;
        } catch (apiError) {
          console.error(`Error getting trip ${id} from API:`, apiError);
          // Fall back to local cache if API fails
        }
      }
      
      // Use local data as fallback
      return trips.find((trip) => trip.id === id) || null;
    } catch (error) {
      console.error("Error getting trip:", error);
      throw error;
    }
  };

  // Update a trip
  const updateTrip = async (id: string, tripData: Partial<Trip>) => {
    try {
      if (isOffline) {
        // If offline, update in local storage only
        const updatedTrips = trips.map((trip) => {
          if (trip.id === id) {
            return {
              ...trip,
              ...tripData,
              updatedAt: new Date().toISOString(),
            };
          }
          return trip;
        });

        await saveTrips(updatedTrips);
        return updatedTrips.find((trip) => trip.id === id) || null;
      } else {
        // If online, update via API
        const updatedTrip = await tripService.updateTrip(id, tripData);
        
        const updatedTrips = trips.map(trip => 
          trip.id === id ? updatedTrip : trip
        );
        
        setTrips(updatedTrips);
        await saveTripsToStorage(updatedTrips);
        return updatedTrip;
      }
    } catch (error) {
      console.error("Error updating trip:", error);
      throw error;
    }
  };

  // Delete a trip
  const deleteTrip = async (id: string) => {
    try {
      if (!isOffline) {
        // If online, delete via API
        await tripService.deleteTrip(id);
      }
      
      // Always update local state and storage
      const updatedTrips = trips.filter((trip) => trip.id !== id);
      await saveTripsToStorage(updatedTrips);
      setTrips(updatedTrips);
    } catch (error) {
      console.error("Error deleting trip:", error);
      throw error;
    }
  };

  const refreshTrips = useCallback(async () => {
    setIsLoading(true);
    try {
      const apiTrips = await tripService.getTrips();
      setTrips(apiTrips);
      setIsOffline(false);
      await saveTripsToStorage(apiTrips);
    } catch (error) {
      console.error("Error refreshing trips:", error);
      setIsOffline(true);
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    trips,
    isLoading,
    isOffline,
    createTrip,
    getTrip,
    updateTrip,
    deleteTrip,
    loadTrips,
    refreshTrips
  };
}