import React, { useState } from "react";
import { StyleSheet, Text, View, ScrollView, useColorScheme, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import { Feather } from '@expo/vector-icons';
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { ExpenseCard } from "@/components/expense/ExpenseCard";
import { getTrips, getExpenses } from '../../utils/api';
import Colors from "@/constants/colors";
import { FONT_SIZE, FONT_WEIGHT, SPACING } from "@/constants/theme";

export default function ExpensesScreen() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme === "dark" ? "dark" : "light"];
  const router = useRouter();
  const [selectedTrip, setSelectedTrip] = useState<string | null>(null);

  const [trips, setTrips] = React.useState<any[]>([]);
  const [expenses, setExpenses] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(true);
  React.useEffect(() => {
    getTrips().then(tripData => {
      setTrips(tripData);
      getExpenses(tripData[0]?.id).then(expenseData => {
        setExpenses(expenseData);
        setLoading(false);
      });
    });
  }, []);
  React.useEffect(() => {
    if (selectedTrip) {
      setLoading(true);
      getExpenses(selectedTrip).then(expenseData => {
        setExpenses(expenseData);
        setLoading(false);
      });
    }
  }, [selectedTrip]);
  const filteredExpenses = expenses;
  const totalAmount = filteredExpenses.reduce(
    (sum, expense) => sum + (expense.amount || 0),
    0
  );

  const handleAddExpense = () => {
    router.push("/expense/add");
  };

  const handleExport = () => {
    // In a real app, this would export the expenses as CSV/PDF
    alert("Exporting expenses...");
  };

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: colors.background,
        },
      ]}
    >
      <View style={styles.header}>
        <Text
          style={[
            styles.title,
            {
              color: colors.text,
            },
          ]}
        >
          Expenses
        </Text>
        <Button
          title="Add"
          variant="primary"
          size="sm"
          leftIcon={<Feather name="plus" size={16} color="#FFFFFF" />}
          onPress={handleAddExpense}
        />
      </View>

      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.tripSelector}>
        <TouchableOpacity
          style={[
            styles.tripButton,
            selectedTrip === null && {
              backgroundColor: colors.primary,
            },
            {
              borderColor: colors.border,
            },
          ]}
          onPress={() => setSelectedTrip(null)}
        >
          <Text
            style={[
              styles.tripButtonText,
              {
                color: selectedTrip === null ? "#FFFFFF" : colors.text,
              },
            ]}
          >
            All Trips
          </Text>
        </TouchableOpacity>
        {trips.map((trip) => (
          <TouchableOpacity
            key={trip.id}
            style={[
              styles.tripButton,
              selectedTrip === trip.id && {
                backgroundColor: colors.primary,
              },
              {
                borderColor: colors.border,
              },
            ]}
            onPress={() => setSelectedTrip(trip.id)}
          >
            <Text
              style={[
                styles.tripButtonText,
                {
                  color: selectedTrip === trip.id ? "#FFFFFF" : colors.text,
                },
              ]}
            >
              {trip.name}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <Card
        variant="outlined"
        style={styles.summaryCard}
      >
        <Text
          style={[
            styles.summaryTitle,
            {
              color: colors.text,
            },
          ]}
        >
          Total Expenses
        </Text>
        <Text
          style={[
            styles.summaryAmount,
            {
              color: colors.text,
            },
          ]}
        >
          ${totalAmount.toFixed(2)} USD
        </Text>
      </Card>

      <ScrollView contentContainerStyle={styles.contentContainer}>
        {loading ? (
          <Text style={{ color: colors.text, textAlign: 'center', marginTop: 32 }}>Loading...</Text>
        ) : filteredExpenses.length > 0 ? (
          filteredExpenses.map((expense) => (
            <ExpenseCard
              key={expense._id || expense.id}
              {...expense}
            />
          ))
        ) : (
          <View style={styles.emptyStateContainer}>
            <Text
              style={[
                styles.emptyStateText,
                {
                  color: colors.subtext,
                },
              ]}
            >
              No expenses found
            </Text>
            <Button
              title="Add Expense"
              variant="primary"
              style={styles.emptyStateButton}
              onPress={handleAddExpense}
            />
          </View>
        )}
      </ScrollView>

      <View style={styles.footer}>
        <Button
          title="Export as CSV"
          variant="outline"
          leftIcon={<Feather name="download" size={16} color={colors.primary} />}
          onPress={handleExport}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.md,
  },
  title: {
    fontSize: FONT_SIZE.xxl,
    fontWeight: FONT_WEIGHT.bold,
  },
  tripSelector: {
    paddingHorizontal: SPACING.md,
    marginBottom: SPACING.md,
  },
  tripButton: {
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    borderRadius: 8,
    marginRight: SPACING.sm,
    borderWidth: 1,
  },
  tripButtonText: {
    fontSize: FONT_SIZE.sm,
    fontWeight: FONT_WEIGHT.medium,
  },
  summaryCard: {
    marginHorizontal: SPACING.md,
    marginBottom: SPACING.md,
  },
  summaryTitle: {
    fontSize: FONT_SIZE.md,
    fontWeight: FONT_WEIGHT.medium,
    marginBottom: SPACING.xs,
  },
  summaryAmount: {
    fontSize: FONT_SIZE.xl,
    fontWeight: FONT_WEIGHT.bold,
  },
  contentContainer: {
    paddingBottom: SPACING.xl,
  },
  emptyStateContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: SPACING.xl,
  },
  emptyStateText: {
    fontSize: FONT_SIZE.md,
    marginBottom: SPACING.md,
  },
  emptyStateButton: {
    minWidth: 200,
  },
  footer: {
    padding: SPACING.md,
    borderTopWidth: 1,
    borderTopColor: "#EEEEEE",
  },
});