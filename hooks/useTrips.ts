import { useState, useEffect } from "react";
import { saveTrips as saveTripsToStorage, getTrips } from "@/lib/storage";
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

  // Load trips from storage on mount
  useEffect(() => {
    loadTrips();
  }, []);

  const loadTrips = async () => {
    try {
      const storedTrips = await getTrips();
      setTrips(storedTrips || []);
    } catch (error) {
      console.error("Error loading trips:", error);
      setTrips([]);
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
      const newTrip: Trip = {
        id: Date.now().toString(), // Use timestamp instead of UUID
        ...tripData,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      const updatedTrips = [...trips, newTrip];
      await saveTrips(updatedTrips);
      return newTrip;
    } catch (error) {
      console.error("Error creating trip:", error);
      throw error;
    }
  };

  // Get a trip by ID
  const getTrip = async (id: string) => {
    try {
      return trips.find((trip) => trip.id === id) || null;
    } catch (error) {
      console.error("Error getting trip:", error);
      throw error;
    }
  };

  // Update a trip
  const updateTrip = async (id: string, tripData: Partial<Trip>) => {
    try {
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
      setTrips(updatedTrips);
      return updatedTrips.find((trip) => trip.id === id) || null;
    } catch (error) {
      console.error("Error updating trip:", error);
      throw error;
    }
  };

  // Delete a trip
  const deleteTrip = async (id: string) => {
    try {
      const updatedTrips = trips.filter((trip) => trip.id !== id);
      await saveTrips(updatedTrips);
      setTrips(updatedTrips);
    } catch (error) {
      console.error("Error deleting trip:", error);
      throw error;
    }
  };

  return {
    trips,
    isLoading,
    createTrip,
    getTrip,
    updateTrip,
    deleteTrip,
    loadTrips,
  };
}