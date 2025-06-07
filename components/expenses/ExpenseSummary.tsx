import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { useTheme } from "@/context/ThemeContext";
import { DollarSign, Plus, PieChart } from "lucide-react-native";

interface ExpenseSummaryProps {
  totalAmount: number;
  expenseCount: number;
  onAddExpense: () => void;
}

export const ExpenseSummary: React.FC<ExpenseSummaryProps> = ({
  totalAmount,
  expenseCount,
  onAddExpense,
}) => {
  const { theme } = useTheme();

  const formatAmount = (amount: number) => {
    return amount.toFixed(2);
  };

  const styles = StyleSheet.create({
    container: {
      backgroundColor: theme.colors.card,
      borderRadius: 16,
      padding: 16,
      shadowColor: theme.colors.shadow,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 2,
    },
    header: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: 16,
    },
    title: {
      fontSize: 16,
      fontWeight: "600",
      color: theme.colors.text,
    },
    addButton: {
      flexDirection: "row",
      alignItems: "center",
    },
    addButtonText: {
      fontSize: 14,
      color: theme.colors.primary,
      marginLeft: 4,
    },
    amountContainer: {
      alignItems: "center",
      marginBottom: 16,
    },
    amountLabel: {
      fontSize: 14,
      color: theme.colors.textSecondary,
      marginBottom: 4,
    },
    amount: {
      fontSize: 32,
      fontWeight: "bold",
      color: theme.colors.text,
    },
    statsContainer: {
      flexDirection: "row",
      justifyContent: "space-around",
      backgroundColor: theme.colors.backgroundSecondary || theme.colors.background,
      borderRadius: 12,
      padding: 16,
    },
    statItem: {
      alignItems: "center",
    },
    statValue: {
      fontSize: 18,
      fontWeight: "600",
      color: theme.colors.text,
      marginBottom: 4,
    },
    statLabel: {
      fontSize: 12,
      color: theme.colors.textSecondary,
    },
  });

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Expense Summary</Text>
        <TouchableOpacity style={styles.addButton} onPress={onAddExpense}>
          <Plus size={16} color={theme.colors.primary} />
          <Text style={styles.addButtonText}>Add</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.amountContainer}>
        <Text style={styles.amountLabel}>Total Expenses</Text>
        <Text style={styles.amount}>₹{formatAmount(totalAmount)}</Text>
      </View>

      <View style={styles.statsContainer}>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{expenseCount}</Text>
          <Text style={styles.statLabel}>Transactions</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>
            ₹{expenseCount > 0 ? formatAmount(totalAmount / expenseCount) : "0.00"}
          </Text>
          <Text style={styles.statLabel}>Average</Text>
        </View>
      </View>
    </View>
  );
};