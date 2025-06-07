import React, { useState } from "react";
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
import { useTrips } from "@/hooks/useTrips";
import { Plus, Navigation, Filter } from "lucide-react-native";
import { TripCard } from "@/components/trips/TripCard";
import { FilterModal } from "@/components/common/FilterModal";

export default function TripsScreen() {
  const router = useRouter();
  const { theme } = useTheme();
  const { trips, loading } = useTrips();
  const [filterVisible, setFilterVisible] = useState(false);
  const [filterType, setFilterType] = useState("all"); // all, upcoming, past

  const filteredTrips = trips?.filter((trip) => {
    if (filterType === "all") return true;
    
    const tripDate = new Date(trip.startDate);
    const today = new Date();
    
    if (filterType === "upcoming") return tripDate >= today;
    if (filterType === "past") return tripDate < today;
    
    return true;
  });

  const filterOptions = [
    { label: "All Trips", value: "all" },
    { label: "Upcoming Trips", value: "upcoming" },
    { label: "Past Trips", value: "past" },
  ];

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
    filterButton: {
      marginRight: 12,
      padding: 8,
    },
    addButton: {
      padding: 8,
    },
    content: {
      flex: 1,
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
    loadingContainer: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
    },
    listContainer: {
      padding: 16,
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
        <Text style={styles.title}>My Trips</Text>
        <View style={styles.headerButtons}>
          <TouchableOpacity
            style={styles.filterButton}
            onPress={() => setFilterVisible(true)}
          >
            <Filter size={24} color={theme.colors.text} />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.addButton}
            onPress={() => router.push("/trip/create")}
          >
            <Plus size={24} color={theme.colors.text} />
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.content}>
        {filteredTrips && filteredTrips.length > 0 ? (
          <FlatList
            data={filteredTrips}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.listContainer}
            renderItem={({ item }) => (
              <TripCard
                trip={item}
                onPress={() => router.push(`/trip/details/${item.id}`)}
              />
            )}
          />
        ) : (
          <View style={styles.emptyContainer}>
            <Navigation
              size={64}
              color={theme.colors.textSecondary}
              style={styles.emptyIcon}
            />
            <Text style={styles.emptyText}>
              You don't have any trips yet. Create one to get started!
            </Text>
            <TouchableOpacity
              style={styles.createButton}
              onPress={() => router.push("/trip/create")}
            >
              <Plus size={20} color="#FFFFFF" />
              <Text style={styles.createButtonText}>Create Trip</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>

      <FilterModal
        visible={filterVisible}
        onClose={() => setFilterVisible(false)}
        options={filterOptions}
        selectedValue={filterType}
        onSelect={(value) => {
          setFilterType(value);
          setFilterVisible(false);
        }}
        title="Filter Trips"
      />
    </SafeAreaView>
  );
}