import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { useTheme } from "@/context/ThemeContext";
import { Bell, MapPin, DollarSign, Plus } from "lucide-react-native";
import { router } from "expo-router";
import { trpc } from "@/lib/trpc";

export default function HomeScreen() {
  const { theme } = useTheme();
  
  // Fetch data from backend
  const { data: alarms, isLoading: alarmsLoading } = trpc.alarms.list.useQuery();
  const { data: trips, isLoading: tripsLoading } = trpc.trips.list.useQuery();
  const { data: expenses, isLoading: expensesLoading } = trpc.expenses.list.useQuery();

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
    header: {
      padding: 20,
      backgroundColor: theme.colors.card,
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.border,
    },
    greeting: {
      fontSize: 24,
      fontWeight: "700",
      color: theme.colors.text,
      marginBottom: 4,
    },
    subGreeting: {
      fontSize: 16,
      color: theme.colors.textSecondary,
    },
    content: {
      padding: 20,
    },
    sectionHeader: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: 12,
    },
    sectionTitle: {
      fontSize: 18,
      fontWeight: "600",
      color: theme.colors.text,
    },
    sectionLink: {
      fontSize: 14,
      color: theme.colors.primary,
    },
    card: {
      backgroundColor: theme.colors.card,
      borderRadius: 12,
      padding: 16,
      marginBottom: 20,
      borderWidth: 1,
      borderColor: theme.colors.border,
    },
    cardHeader: {
      flexDirection: "row",
      alignItems: "center",
      marginBottom: 12,
    },
    cardIcon: {
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: theme.colors.primary + "20",
      justifyContent: "center",
      alignItems: "center",
      marginRight: 12,
    },
    cardTitle: {
      fontSize: 16,
      fontWeight: "600",
      color: theme.colors.text,
    },
    cardSubtitle: {
      fontSize: 14,
      color: theme.colors.textSecondary,
    },
    emptyState: {
      alignItems: "center",
      padding: 20,
    },
    emptyStateText: {
      fontSize: 16,
      color: theme.colors.textSecondary,
      marginBottom: 16,
      textAlign: "center",
    },
    addButton: {
      backgroundColor: theme.colors.primary,
      borderRadius: 8,
      paddingVertical: 10,
      paddingHorizontal: 16,
      flexDirection: "row",
      alignItems: "center",
    },
    addButtonText: {
      color: "#FFFFFF",
      fontSize: 16,
      fontWeight: "500",
      marginLeft: 8,
    },
    quickActions: {
      flexDirection: "row",
      justifyContent: "space-between",
      marginBottom: 24,
    },
    actionButton: {
      flex: 1,
      backgroundColor: theme.colors.card,
      borderRadius: 12,
      padding: 16,
      alignItems: "center",
      marginHorizontal: 6,
      borderWidth: 1,
      borderColor: theme.colors.border,
    },
    actionIcon: {
      width: 50,
      height: 50,
      borderRadius: 25,
      backgroundColor: theme.colors.primary + "20",
      justifyContent: "center",
      alignItems: "center",
      marginBottom: 8,
    },
    actionText: {
      fontSize: 14,
      fontWeight: "500",
      color: theme.colors.text,
      textAlign: "center",
    },
  });

  const renderEmptyState = (type: string, route: string) => (
    <View style={styles.emptyState}>
      <Text style={styles.emptyStateText}>
        You don't have any {type} yet. Create your first one!
      </Text>
      <TouchableOpacity
        style={styles.addButton}
        onPress={() => router.push(route)}
      >
        <Plus size={20} color="#FFFFFF" />
        <Text style={styles.addButtonText}>Add {type}</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.greeting}>
          Welcome to WakeMeUp
        </Text>
        <Text style={styles.subGreeting}>
          Your location-based alarm app
        </Text>
      </View>

      <View style={styles.content}>
        <View style={styles.quickActions}>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => router.push("/alarm/create")}
          >
            <View style={styles.actionIcon}>
              <Bell size={24} color={theme.colors.primary} />
            </View>
            <Text style={styles.actionText}>New Alarm</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => router.push("/trip/create")}
          >
            <View style={styles.actionIcon}>
              <MapPin size={24} color={theme.colors.primary} />
            </View>
            <Text style={styles.actionText}>New Trip</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => router.push("/expense/create")}
          >
            <View style={styles.actionIcon}>
              <DollarSign size={24} color={theme.colors.primary} />
            </View>
            <Text style={styles.actionText}>Add Expense</Text>
          </TouchableOpacity>
        </View>

        {/* Upcoming Alarms */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Upcoming Alarms</Text>
          <TouchableOpacity onPress={() => router.push("/alarms")}>
            <Text style={styles.sectionLink}>View All</Text>
          </TouchableOpacity>
        </View>

        {alarmsLoading ? (
          <View style={styles.card}>
            <Text style={styles.cardSubtitle}>Loading alarms...</Text>
          </View>
        ) : alarms && alarms.length > 0 ? (
          alarms.slice(0, 2).map((alarm) => (
            <TouchableOpacity
              key={alarm.id}
              style={styles.card}
              onPress={() => router.push(`/alarm/edit/${alarm.id}`)}
            >
              <View style={styles.cardHeader}>
                <View style={styles.cardIcon}>
                  <Bell size={20} color={theme.colors.primary} />
                </View>
                <View>
                  <Text style={styles.cardTitle}>{alarm.title}</Text>
                  <Text style={styles.cardSubtitle}>
                    {alarm.time} • {alarm.location}
                  </Text>
                </View>
              </View>
            </TouchableOpacity>
          ))
        ) : (
          renderEmptyState("alarms", "/alarm/create")
        )}

        {/* Recent Trips */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Recent Trips</Text>
          <TouchableOpacity onPress={() => router.push("/trips")}>
            <Text style={styles.sectionLink}>View All</Text>
          </TouchableOpacity>
        </View>

        {tripsLoading ? (
          <View style={styles.card}>
            <Text style={styles.cardSubtitle}>Loading trips...</Text>
          </View>
        ) : trips && trips.length > 0 ? (
          trips.slice(0, 2).map((trip) => (
            <TouchableOpacity
              key={trip.id}
              style={styles.card}
              onPress={() => router.push(`/trip/details/${trip.id}`)}
            >
              <View style={styles.cardHeader}>
                <View style={styles.cardIcon}>
                  <MapPin size={20} color={theme.colors.primary} />
                </View>
                <View>
                  <Text style={styles.cardTitle}>{trip.name}</Text>
                  <Text style={styles.cardSubtitle}>
                    {trip.date} • {trip.destination}
                  </Text>
                </View>
              </View>
            </TouchableOpacity>
          ))
        ) : (
          renderEmptyState("trips", "/trip/create")
        )}

        {/* Recent Expenses */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Recent Expenses</Text>
          <TouchableOpacity onPress={() => router.push("/expenses")}>
            <Text style={styles.sectionLink}>View All</Text>
          </TouchableOpacity>
        </View>

        {expensesLoading ? (
          <View style={styles.card}>
            <Text style={styles.cardSubtitle}>Loading expenses...</Text>
          </View>
        ) : expenses && expenses.length > 0 ? (
          expenses.slice(0, 2).map((expense) => (
            <TouchableOpacity
              key={expense.id}
              style={styles.card}
              onPress={() => router.push(`/expense/edit/${expense.id}`)}
            >
              <View style={styles.cardHeader}>
                <View style={styles.cardIcon}>
                  <DollarSign size={20} color={theme.colors.primary} />
                </View>
                <View>
                  <Text style={styles.cardTitle}>${expense.amount}</Text>
                  <Text style={styles.cardSubtitle}>
                    {expense.category} • {expense.date}
                  </Text>
                </View>
              </View>
            </TouchableOpacity>
          ))
        ) : (
          renderEmptyState("expenses", "/expense/create")
        )}
      </View>
    </ScrollView>
  );
}