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
import { BackendStatus } from "@/components/common/BackendStatus";
import { useBackend } from "@/context/BackendContext";

export default function HomeScreen() {
  const { theme } = useTheme();
  const { isConnected } = useBackend();
  
  // Use our hooks instead of tRPC queries
  const [alarmsLoading, setAlarmsLoading] = React.useState(true);
  const [tripsLoading, setTripsLoading] = React.useState(true);
  const [expensesLoading, setExpensesLoading] = React.useState(true);
  const [alarms, setAlarms] = React.useState<any[]>([]);
  const [trips, setTrips] = React.useState<any[]>([]);
  const [expenses, setExpenses] = React.useState<any[]>([]);

  // Load data on component mount
  React.useEffect(() => {
    const loadData = async () => {
      try {
        // Mock data for now
        setAlarms([
          {
            id: '1',
            name: 'Morning Alarm',
            title: 'Morning Alarm',
            time: '7:00 AM',
            location: { name: 'Home' },
            active: true,
          },
          {
            id: '2',
            name: 'Work Arrival',
            title: 'Work Arrival',
            time: '8:30 AM',
            location: { name: 'Office' },
            active: false,
          }
        ]);
        setTrips([
          {
            id: '1',
            name: 'Weekend Trip',
            date: new Date().toLocaleDateString(),
            startDate: new Date().toISOString(),
            destination: 'Beach Resort',
            stops: [{ location: { name: 'Beach Resort' } }]
          },
          {
            id: '2',
            name: 'Business Trip',
            date: new Date(Date.now() + 604800000).toLocaleDateString(),
            startDate: new Date(Date.now() + 604800000).toISOString(),
            destination: 'Conference Center',
            stops: [{ location: { name: 'Conference Center' } }]
          }
        ]);
        setExpenses([
          {
            id: '1',
            amount: 120.50,
            category: 'Food',
            date: new Date().toISOString(),
            notes: 'Dinner'
          },
          {
            id: '2',
            amount: 75.30,
            category: 'Transportation',
            date: new Date().toISOString(),
            notes: 'Taxi'
          }
        ]);
      } catch (error) {
        console.error('Error loading data:', error);
      } finally {
        setAlarmsLoading(false);
        setTripsLoading(false);
        setExpensesLoading(false);
      }
    };

    loadData();
  }, []);

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
        onPress={() => router.push(route as any)}
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
        <View style={{ marginTop: 8 }}>
          <BackendStatus showRefresh={true} />
        </View>
      </View>

      <View style={styles.content}>
        <View style={styles.quickActions}>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => router.push("/alarm/create" as any)}
          >
            <View style={styles.actionIcon}>
              <Bell size={24} color={theme.colors.primary} />
            </View>
            <Text style={styles.actionText}>New Alarm</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => router.push("/trip/create" as any)}
          >
            <View style={styles.actionIcon}>
              <MapPin size={24} color={theme.colors.primary} />
            </View>
            <Text style={styles.actionText}>New Trip</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => router.push("/expense/create" as any)}
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
          <TouchableOpacity onPress={() => router.push("/alarms" as any)}>
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
              onPress={() => router.push(`/alarm/edit/${alarm.id}` as any)}
            >
              <View style={styles.cardHeader}>
                <View style={styles.cardIcon}>
                  <Bell size={20} color={theme.colors.primary} />
                </View>
                <View>
                  <Text style={styles.cardTitle}>{alarm?.name || 'Unnamed Alarm'}</Text>
                  <Text style={styles.cardSubtitle}>
                    {alarm?.time || 'No time set'} • {alarm?.location?.name || 'No location set'}
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
          <TouchableOpacity onPress={() => router.push("/trips" as any)}>
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
              onPress={() => router.push(`/trip/details/${trip.id}` as any)}
            >
              <View style={styles.cardHeader}>
                <View style={styles.cardIcon}>
                  <MapPin size={20} color={theme.colors.primary} />
                </View>
                <View>
                  <Text style={styles.cardTitle}>{trip?.name || 'Unnamed Trip'}</Text>
                  <Text style={styles.cardSubtitle}>
                    {trip?.date || 'No date set'} • {trip?.destination || 'No destination set'}
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
          <TouchableOpacity onPress={() => router.push("/expenses" as any)}>
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
              onPress={() => router.push(`/expense/edit/${expense.id}` as any)}
            >
              <View style={styles.cardHeader}>
                <View style={styles.cardIcon}>
                  <DollarSign size={20} color={theme.colors.primary} />
                </View>
                <View>
                  <Text style={styles.cardTitle}>${typeof expense.amount === 'number' ? expense.amount.toFixed(2) : '0.00'}</Text>
                  <Text style={styles.cardSubtitle}>
                    {expense.category || 'Uncategorized'} • {typeof expense.date === 'string' ? expense.date : 'Unknown date'}
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