import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
} from "react-native";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTheme } from "@/context/ThemeContext";
import { useExpenses } from "@/hooks/useExpenses";
import { Plus, History, PieChart } from "lucide-react-native";
import { ExpenseCard } from "@/components/expenses/ExpenseCard";
import { ExpenseSummary } from "@/components/expenses/ExpenseSummary";

export default function ExpensesScreen() {
  const router = useRouter();
  const { theme } = useTheme();
  const { expenses, loading, deleteExpense } = useExpenses();
  
  // Get recent expenses (last 5)
  const recentExpenses = expenses
    ? [...expenses]
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
        .slice(0, 5)
    : [];
  
  // Calculate total amount
  const totalAmount = expenses
    ? expenses.reduce((sum, expense) => sum + expense.amount, 0)
    : 0;

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
    header: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      paddingHorizontal: 16,
      paddingVertical: 12,
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.border,
      backgroundColor: theme.colors.card,
    },
    title: {
      fontSize: 20,
      fontWeight: "bold",
      color: theme.colors.text,
    },
    headerButtons: {
      flexDirection: "row",
    },
    historyButton: {
      marginRight: 12,
      padding: 8,
    },
    addButton: {
      padding: 8,
    },
    content: {
      flex: 1,
      padding: 16,
    },
    summaryContainer: {
      marginBottom: 24,
    },
    recentExpensesHeader: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: 16,
    },
    recentExpensesTitle: {
      fontSize: 18,
      fontWeight: "600",
      color: theme.colors.text,
    },
    viewAllButton: {
      flexDirection: "row",
      alignItems: "center",
    },
    viewAllText: {
      fontSize: 14,
      color: theme.colors.primary,
    },
    loadingContainer: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
    },
    emptyContainer: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      padding: 24,
    },
    emptyIcon: {
      marginBottom: 16,
    },
    emptyText: {
      fontSize: 16,
      color: theme.colors.textSecondary,
      textAlign: "center",
      marginBottom: 24,
    },
    createButton: {
      backgroundColor: theme.colors.primary,
      borderRadius: 12,
      paddingVertical: 12,
      paddingHorizontal: 24,
      flexDirection: "row",
      alignItems: "center",
    },
    createButtonText: {
      color: "#FFFFFF",
      fontSize: 16,
      fontWeight: "600",
      marginLeft: 8,
    },
  });

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={theme.colors.primary} />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={["bottom"]}>
      <View style={styles.header}>
        <Text style={styles.title}>Expenses</Text>
        <View style={styles.headerButtons}>
          <TouchableOpacity
            style={styles.historyButton}
            onPress={() => router.push("/expense/history")}
          >
            <History size={24} color={theme.colors.text} />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.addButton}
            onPress={() => router.push("/expense/create")}
          >
            <Plus size={24} color={theme.colors.text} />
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.content}>
        <View style={styles.summaryContainer}>
          <ExpenseSummary
            totalAmount={totalAmount}
            expenseCount={expenses?.length || 0}
            onAddExpense={() => router.push("/expense/create")}
          />
        </View>

        {expenses && expenses.length > 0 ? (
          <>
            <View style={styles.recentExpensesHeader}>
              <Text style={styles.recentExpensesTitle}>Recent Expenses</Text>
              <TouchableOpacity
                style={styles.viewAllButton}
                onPress={() => router.push("/expense/history")}
              >
                <Text style={styles.viewAllText}>View All</Text>
              </TouchableOpacity>
            </View>

            <FlatList
              data={recentExpenses}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <ExpenseCard
                  expense={item}
                  onPress={() => router.push(`/expense/edit/${item.id}`)}
                  onDelete={() => deleteExpense(item.id)}
                />
              )}
            />
          </>
        ) : (
          <View style={styles.emptyContainer}>
            <PieChart
              size={64}
              color={theme.colors.textSecondary}
              style={styles.emptyIcon}
            />
            <Text style={styles.emptyText}>
              You haven't added any expenses yet. Start tracking your travel expenses!
            </Text>
            <TouchableOpacity
              style={styles.createButton}
              onPress={() => router.push("/expense/create")}
            >
              <Plus size={20} color="#FFFFFF" />
              <Text style={styles.createButtonText}>Add Expense</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </SafeAreaView>
  );
}