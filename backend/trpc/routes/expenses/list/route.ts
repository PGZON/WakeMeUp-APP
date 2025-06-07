import { protectedProcedure } from "@/backend/trpc/create-context";
import { z } from "zod";

export const listExpensesProcedure = protectedProcedure
  .query(async ({ ctx }) => {
    try {
      // In a real backend, you would fetch expenses from a database
      // For now, we'll return a mock response
      return {
        success: true,
        expenses: [
          {
            id: "1",
            amount: 1500,
            category: "Transportation",
            date: new Date().toISOString(),
            notes: "Taxi fare to hotel",
            tripId: "1",
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          },
          {
            id: "2",
            amount: 2500,
            category: "Food",
            date: new Date().toISOString(),
            notes: "Dinner at restaurant",
            tripId: "1",
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          },
          {
            id: "3",
            amount: 5000,
            category: "Accommodation",
            date: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000).toISOString(),
            notes: "Hotel booking",
            tripId: "2",
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          },
        ],
      };
    } catch (error) {
      console.error("Error fetching expenses:", error);
      return {
        success: false,
        error: "Failed to fetch expenses",
      };
    }
  });