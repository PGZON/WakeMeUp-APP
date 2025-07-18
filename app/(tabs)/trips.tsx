import React, { useState } from "react";
import { StyleSheet, Text, View, ScrollView, useColorScheme, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import { Feather } from '@expo/vector-icons';
import { Button } from "@/components/ui/Button";
import { TripCard } from "@/components/trip/TripCard";
import { getTrips } from '../../utils/api';
import Colors from "@/constants/colors";
import { FONT_SIZE, FONT_WEIGHT, SPACING } from "@/constants/theme";

export default function TripsScreen() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme === "dark" ? "dark" : "light"];
  const router = useRouter();
  const [activeFilter, setActiveFilter] = useState<"all" | "active" | "completed">("all");

  const [trips, setTrips] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(true);
  React.useEffect(() => {
    getTrips().then(data => {
      setTrips(data);
      setLoading(false);
    });
  }, []);
  const filteredTrips = trips.filter((trip) => {
    if (activeFilter === "all") return true;
    if (activeFilter === "active") return trip.isActive;
    if (activeFilter === "completed") return !trip.isActive;
    return true;
  });

  const handleCreateTrip = () => {
    router.push("/trip/create");
  };

  const handleViewTripHistory = () => {
    router.push("/trip/history");
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
          My Trips
        </Text>
        <Button
          title="New Trip"
          variant="primary"
          size="sm"
          leftIcon={<Feather name="plus" size={16} color="#FFFFFF" />}
          onPress={handleCreateTrip}
        />
      </View>

      <View style={styles.filterContainer}>
        <View
          style={[
            styles.filterWrapper,
            {
              backgroundColor: colors.card,
              borderColor: colors.border,
            },
          ]}
        >
          <TouchableOpacity
            style={[
              styles.filterButton,
              activeFilter === "all" && {
                backgroundColor: colors.primary,
              },
            ]}
            onPress={() => setActiveFilter("all")}
          >
            <Text
              style={[
                styles.filterText,
                {
                  color:
                    activeFilter === "all" ? "#FFFFFF" : colors.text,
                },
              ]}
            >
              All
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.filterButton,
              activeFilter === "active" && {
                backgroundColor: colors.primary,
              },
            ]}
            onPress={() => setActiveFilter("active")}
          >
            <Text
              style={[
                styles.filterText,
                {
                  color:
                    activeFilter === "active" ? "#FFFFFF" : colors.text,
                },
              ]}
            >
              Active
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.filterButton,
              activeFilter === "completed" && {
                backgroundColor: colors.primary,
              },
            ]}
            onPress={() => setActiveFilter("completed")}
          >
            <Text
              style={[
                styles.filterText,
                {
                  color:
                    activeFilter === "completed" ? "#FFFFFF" : colors.text,
                },
              ]}
            >
              Completed
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.contentContainer}>
        {loading ? (
          <Text style={{ color: colors.text, textAlign: 'center', marginTop: 32 }}>Loading...</Text>
        ) : filteredTrips.length > 0 ? (
          filteredTrips.map((trip) => <TripCard key={trip.id} {...trip} />)
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
              No trips found
            </Text>
            <Button
              title="Create Trip"
              variant="primary"
              style={styles.emptyStateButton}
              onPress={handleCreateTrip}
            />
          </View>
        )}
      </ScrollView>

      <View style={styles.footer}>
        <Button
          title="View Trip History"
          variant="outline"
          onPress={handleViewTripHistory}
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
  filterContainer: {
    paddingHorizontal: SPACING.md,
    marginBottom: SPACING.md,
  },
  filterWrapper: {
    flexDirection: "row",
    borderRadius: 8,
    borderWidth: 1,
    overflow: "hidden",
  },
  filterButton: {
    flex: 1,
    paddingVertical: SPACING.sm,
    alignItems: "center",
  },
  filterText: {
    fontSize: FONT_SIZE.sm,
    fontWeight: FONT_WEIGHT.medium,
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