import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { useTheme } from "@/context/ThemeContext";
import { Tag, Calendar, Trash2 } from "lucide-react-native";

interface ExpenseCardProps {
  expense: any;
  onPress: () => void;
  onDelete: () => void;
}

export const ExpenseCard: React.FC<ExpenseCardProps> = ({
  expense,
  onPress,
  onDelete,
}) => {
  const { theme } = useTheme();

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString(undefined, {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const formatAmount = (amount: number) => {
    return amount.toFixed(2);
  };

  const styles = StyleSheet.create({
    container: {
      backgroundColor: theme.colors.card,
      borderRadius: 12,
      padding: 16,
      marginBottom: 12,
      shadowColor: theme.colors.shadow,
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.1,
      shadowRadius: 2,
      elevation: 1,
    },
    header: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: 12,
    },
    categoryContainer: {
      flexDirection: "row",
      alignItems: "center",
    },
    category: {
      fontSize: 16,
      fontWeight: "500",
      color: theme.colors.text,
      marginLeft: 8,
    },
    amount: {
      fontSize: 18,
      fontWeight: "bold",
      color: theme.colors.primary,
    },
    footer: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
    },
    dateContainer: {
      flexDirection: "row",
      alignItems: "center",
    },
    date: {
      fontSize: 14,
      color: theme.colors.textSecondary,
      marginLeft: 4,
    },
    notes: {
      fontSize: 14,
      color: theme.colors.textSecondary,
      marginTop: 8,
      marginBottom: 12,
    },
    actions: {
      flexDirection: "row",
    },
    deleteButton: {
      padding: 8,
    },
  });

  return (
    <TouchableOpacity style={styles.container} onPress={onPress}>
      <View style={styles.header}>
        <View style={styles.categoryContainer}>
          <Tag size={20} color={theme.colors.primary} />
          <Text style={styles.category}>{expense.category}</Text>
        </View>
        <Text style={styles.amount}>₹{formatAmount(expense.amount)}</Text>
      </View>

      {expense.notes && <Text style={styles.notes}>{expense.notes}</Text>}

      <View style={styles.footer}>
        <View style={styles.dateContainer}>
          <Calendar size={16} color={theme.colors.textSecondary} />
          <Text style={styles.date}>{formatDate(expense.date)}</Text>
        </View>
        <View style={styles.actions}>
          <TouchableOpacity
            style={styles.deleteButton}
            onPress={(e) => {
              e.stopPropagation();
              onDelete();
            }}
          >
            <Trash2 size={20} color={theme.colors.error} />
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );
};