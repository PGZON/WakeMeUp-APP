import { useState, useEffect } from "react";
import { saveExpenses as saveExpensesToStorage, getExpenses } from "@/lib/storage";
import { v4 as uuidv4 } from "uuid";

// Define types
export interface Expense {
  id: string;
  amount: number;
  category: string;
  date: string;
  notes?: string;
  tripId?: string | null;
  createdAt: string;
  updatedAt: string;
}

export function useExpenses() {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Load expenses from storage on mount
  useEffect(() => {
    loadExpenses();
  }, []);

  const loadExpenses = async () => {
    try {
      const storedExpenses = await getExpenses();
      setExpenses(storedExpenses || []);
    } catch (error) {
      console.error("Error loading expenses:", error);
      setExpenses([]);
    } finally {
      setIsLoading(false);
    }
  };

  // Save expenses to storage
  const saveExpenses = async (updatedExpenses: Expense[]) => {
    try {
      await saveExpensesToStorage(updatedExpenses);
      setExpenses(updatedExpenses);
    } catch (error) {
      console.error("Error saving expenses:", error);
      throw error;
    }
  };

  // Create a new expense
  const createExpense = async (expenseData: Omit<Expense, "id" | "createdAt" | "updatedAt">) => {
    try {
      const newExpense: Expense = {
        id: Date.now().toString(), // Use timestamp instead of UUID
        ...expenseData,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      const updatedExpenses = [...expenses, newExpense];
      await saveExpenses(updatedExpenses);
      return newExpense;
    } catch (error) {
      console.error("Error creating expense:", error);
      throw error;
    }
  };

  // Get an expense by ID
  const getExpense = async (id: string) => {
    try {
      return expenses.find((expense) => expense.id === id) || null;
    } catch (error) {
      console.error("Error getting expense:", error);
      throw error;
    }
  };

  // Update an expense
  const updateExpense = async (id: string, expenseData: Partial<Expense>) => {
    try {
      const updatedExpenses = expenses.map((expense) => {
        if (expense.id === id) {
          return {
            ...expense,
            ...expenseData,
            updatedAt: new Date().toISOString(),
          };
        }
        return expense;
      });

      await saveExpenses(updatedExpenses);
      setExpenses(updatedExpenses);
      return updatedExpenses.find((expense) => expense.id === id) || null;
    } catch (error) {
      console.error("Error updating expense:", error);
      throw error;
    }
  };

  // Delete an expense
  const deleteExpense = async (id: string) => {
    try {
      const updatedExpenses = expenses.filter((expense) => expense.id !== id);
      await saveExpenses(updatedExpenses);
      setExpenses(updatedExpenses);
    } catch (error) {
      console.error("Error deleting expense:", error);
      throw error;
    }
  };

  // Get expenses for a specific trip
  const getExpensesForTrip = (tripId: string) => {
    return expenses.filter((expense) => expense.tripId === tripId);
  };

  // Calculate total expenses
  const calculateTotalExpenses = () => {
    return expenses.reduce((total, expense) => total + expense.amount, 0);
  };

  return {
    expenses,
    isLoading,
    createExpense,
    getExpense,
    updateExpense,
    deleteExpense,
    getExpensesForTrip,
    calculateTotalExpenses,
  };
}