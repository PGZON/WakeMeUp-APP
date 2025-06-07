import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { useRouter, Stack } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTheme } from "@/context/ThemeContext";
import { useTrips } from "@/hooks/useTrips";
import { ArrowLeft, Calendar, Navigation } from "lucide-react-native";
import { TripCard } from "@/components/trips/TripCard";

export default function UpcomingTripsScreen() {
  const router = useRouter();
  const { theme } = useTheme();
  const { trips, loading } = useTrips();
  
  const upcomingTrips = trips?.filter((trip) => {
    const tripDate = new Date(trip.startDate);
    const today = new Date();
    return tripDate >= today;
  });

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
    content: {
      flex: 1,
      padding: 16,
    },
    header: {
      marginBottom: 16,
    },
    title: {
      fontSize: 24,
      fontWeight: "bold",
      color: theme.colors.text,
    },
    subtitle: {
      fontSize: 16,
      color: theme.colors.textSecondary,
      marginTop: 4,
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
        <Stack.Screen
          options={{
            title: "Upcoming Trips",
            headerLeft: () => (
              <TouchableOpacity onPress={() => router.back()}>
                <ArrowLeft size={24} color={theme.colors.text} />
              </TouchableOpacity>
            ),
          }}
        />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={theme.colors.primary} />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={["bottom"]}>
      <Stack.Screen
        options={{
          title: "Upcoming Trips",
          headerLeft: () => (
            <TouchableOpacity onPress={() => router.back()}>
              <ArrowLeft size={24} color={theme.colors.text} />
            </TouchableOpacity>
          ),
        }}
      />

      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.title}>Upcoming Trips</Text>
          <Text style={styles.subtitle}>
            {upcomingTrips?.length || 0} trips planned
          </Text>
        </View>

        {upcomingTrips && upcomingTrips.length > 0 ? (
          <FlatList
            data={upcomingTrips}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <TripCard
                trip={item}
                onPress={() => router.push(`/trip/details/${item.id}`)}
              />
            )}
          />
        ) : (
          <View style={styles.emptyContainer}>
            <Calendar
              size={64}
              color={theme.colors.textSecondary}
              style={styles.emptyIcon}
            />
            <Text style={styles.emptyText}>
              You don't have any upcoming trips. Plan your next adventure!
            </Text>
            <TouchableOpacity
              style={styles.createButton}
              onPress={() => router.push("/trip/create")}
            >
              <Navigation size={20} color="#FFFFFF" />
              <Text style={styles.createButtonText}>Create Trip</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </SafeAreaView>
  );
}