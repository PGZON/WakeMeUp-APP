import React from "react";
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, useColorScheme, ViewStyle, TextStyle } from "react-native";
import { useRouter } from "expo-router";
import { Feather } from '@expo/vector-icons';
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { TripCard } from "@/components/trip/TripCard";
import { StopCard } from "@/components/trip/StopCard";
import { WeatherWidget } from "@/components/home/WeatherWidget";
import { MapPreview } from "@/components/home/MapPreview";
import { getTrips } from '../../utils/api';
import Colors from "@/constants/colors";
import { FONT_SIZE, FONT_WEIGHT, SPACING } from "@/constants/theme";

export default function HomeScreen() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme === "dark" ? "dark" : "light"];
  const router = useRouter();

  const [activeTrip, setActiveTrip] = React.useState<any>(null);
  const [nextStop, setNextStop] = React.useState<any>(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    async function fetchTrips() {
      try {
        const response = await getTrips();
        
        if (response.success && response.trips) {
          const active = response.trips.find((t: any) => !t.completedAt);
          setActiveTrip(active || null);
          // Optionally, fetch next stop from trip details if available
          setNextStop(active?.stops?.find((s: any) => !s.triggeredAt) || null);
        } else {
          console.log("No trips found or error:", response);
          setError("Unable to load trips");
        }
      } catch (err) {
        console.error("Error fetching trips:", err);
        setError("Network error: Unable to connect to server");
      } finally {
        setLoading(false);
      }
    }

    fetchTrips();
  }, []);

  const handleCreateTrip = () => {
    router.push("/trip/create");
  };

  return (
    <ScrollView
      style={[
        styles.container,
        {
          backgroundColor: colors.background,
        },
      ]}
      contentContainerStyle={styles.contentContainer}
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
          WakeMeUp
        </Text>
        <Button
          title="New Trip"
          variant="primary"
          size="sm"
          leftIcon={<Feather name="plus" size={16} color="#FFFFFF" />}
          onPress={handleCreateTrip}
        />
      </View>

      {loading ? (
        <Text style={{ color: colors.text, textAlign: 'center', marginTop: 32 }}>Loading...</Text>
      ) : error ? (
        <View style={{ padding: 20, alignItems: 'center' }}>
          <Text style={{ color: colors.text, textAlign: 'center', marginTop: 32, fontSize: 16 }}>
            {error}
          </Text>
          <TouchableOpacity 
            style={styles.retryButton}
            onPress={() => {
              setLoading(true);
              setError(null);
              getTrips().then(response => {
                const active = response.trips?.find((t: any) => !t.completedAt);
                setActiveTrip(active || null);
                setNextStop(active?.stops?.find((s: any) => !s.triggeredAt) || null);
              }).catch(err => {
                setError("Failed to load trips. Please try again.");
              }).finally(() => {
                setLoading(false);
              });
            }}
          >
            <Text style={styles.retryButtonText}>Retry</Text>
          </TouchableOpacity>
        </View>
      ) : activeTrip ? (
        <>
          <Text
            style={[
              styles.sectionTitle,
              {
                color: colors.text,
              },
            ]}
          >
            Active Trip
          </Text>
          <TripCard {...activeTrip} />

          <Text
            style={[
              styles.sectionTitle,
              {
                color: colors.text,
              },
            ]}
          >
            Next Stop
          </Text>
          {nextStop ? <StopCard {...nextStop} /> : <Text style={{ color: colors.text, marginLeft: 16 }}>No upcoming stops.</Text>}

          <Text
            style={[
              styles.sectionTitle,
              {
                color: colors.text,
              },
            ]}
          >
            Current Location
          </Text>
          <MapPreview />
        </>
      ) : (
        <View style={styles.emptyStateContainer}>
          <Card
            variant="outlined"
            style={styles.emptyStateCard}
          >
            <Text
              style={[
                styles.emptyStateTitle,
                {
                  color: colors.text,
                },
              ]}
            >
              No Active Trip
            </Text>
            <Text
              style={[
                styles.emptyStateDescription,
                {
                  color: colors.subtext,
                },
              ]}
            >
              Create a new trip to get started with WakeMeUp
            </Text>
            <Button
              title="Create Trip"
              variant="primary"
              style={styles.emptyStateButton}
              leftIcon={<Feather name="plus" size={16} color="#FFFFFF" />}
              onPress={handleCreateTrip}
            />
          </Card>
        </View>
      )}

      <Text
        style={[
          styles.sectionTitle,
          {
            color: colors.text,
          },
        ]}
      >
        Weather
      </Text>
      <WeatherWidget
        temperature={28}
        condition="sunny"
        location="Los Angeles, CA"
      />
    </ScrollView>
  );
}

interface Styles {
  container: ViewStyle;
  contentContainer: ViewStyle;
  header: ViewStyle;
  title: TextStyle;
  sectionTitle: TextStyle;
  emptyStateContainer: ViewStyle;
  emptyStateCard: ViewStyle;
  emptyStateTitle: TextStyle;
  emptyStateDescription: TextStyle;
  emptyStateButton: ViewStyle;
  retryButton: ViewStyle;
  retryButtonText: TextStyle;
}

const styles = StyleSheet.create<Styles>({
  container: {
    flex: 1,
  },
  contentContainer: {
    paddingBottom: SPACING.xl,
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
    fontWeight: '700',
  },
  sectionTitle: {
    fontSize: FONT_SIZE.lg,
    fontWeight: '600',
    marginHorizontal: SPACING.md,
    marginTop: SPACING.lg,
    marginBottom: SPACING.xs,
  },
  emptyStateContainer: {
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.lg,
  },
  emptyStateCard: {
    alignItems: "center",
    padding: SPACING.xl,
  },
  emptyStateTitle: {
    fontSize: FONT_SIZE.xl,
    fontWeight: '700',
    marginBottom: SPACING.sm,
    textAlign: "center",
  },
  emptyStateDescription: {
    fontSize: FONT_SIZE.md,
    textAlign: "center",
    marginBottom: SPACING.lg,
  },
  emptyStateButton: {
    minWidth: 200,
  },
  retryButton: {
    marginTop: 16,
    padding: 10,
    backgroundColor: '#3498db', // Use a fixed color that works in both modes
    borderRadius: 8,
    alignItems: 'center',
  },
  retryButtonText: {
    color: '#FFFFFF',
    fontWeight: '500',
  },
});