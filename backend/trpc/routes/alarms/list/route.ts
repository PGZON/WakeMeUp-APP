import { protectedProcedure } from "@/backend/trpc/create-context";
import { z } from "zod";

export const listAlarmsProcedure = protectedProcedure
  .query(async ({ ctx }) => {
    try {
      // In a real backend, you would fetch alarms from a database
      // For now, we'll return a mock response
      return {
        success: true,
        alarms: [
          {
            id: "1",
            name: "Beach Arrival",
            location: {
              name: "Beach Resort",
              address: "123 Beach Road, Coastal City",
              latitude: 12.9716,
              longitude: 77.5946,
            },
            radius: 500, // in meters
            sound: "default",
            vibration: true,
            message: "You've arrived at the beach resort!",
            active: true,
            tripId: "1",
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          },
          {
            id: "2",
            name: "Conference Center",
            location: {
              name: "Conference Center",
              address: "456 Business Ave, Metro City",
              latitude: 13.0827,
              longitude: 80.2707,
            },
            radius: 300, // in meters
            sound: "chime",
            vibration: true,
            message: "Your business meeting is about to start!",
            active: false,
            tripId: "2",
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          },
        ],
      };
    } catch (error) {
      console.error("Error fetching alarms:", error);
      return {
        success: false,
        error: "Failed to fetch alarms",
      };
    }
  });