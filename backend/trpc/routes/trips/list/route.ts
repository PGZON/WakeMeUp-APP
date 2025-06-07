import { protectedProcedure } from "@/backend/trpc/create-context";
import { z } from "zod";

export const listTripsProcedure = protectedProcedure
  .query(async ({ ctx }) => {
    try {
      // In a real backend, you would fetch trips from a database
      // For now, we'll return a mock response
      return {
        success: true,
        trips: [
          {
            id: "1",
            name: "Weekend Getaway",
            startDate: new Date().toISOString(),
            stops: [
              {
                id: "stop1",
                location: {
                  name: "Beach Resort",
                  address: "123 Beach Road, Coastal City",
                  latitude: 12.9716,
                  longitude: 77.5946,
                },
              },
            ],
            travelType: "car",
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          },
          {
            id: "2",
            name: "Business Trip",
            startDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
            stops: [
              {
                id: "stop2",
                location: {
                  name: "Conference Center",
                  address: "456 Business Ave, Metro City",
                  latitude: 13.0827,
                  longitude: 80.2707,
                },
              },
            ],
            travelType: "plane",
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          },
        ],
      };
    } catch (error) {
      console.error("Error fetching trips:", error);
      return {
        success: false,
        error: "Failed to fetch trips",
      };
    }
  });