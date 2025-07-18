import React from "react";
import { StyleSheet, Text, View, ScrollView, useColorScheme } from "react-native";
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
  React.useEffect(() => {
    getTrips().then(trips => {
      const active = trips.find((t: any) => t.isActive);
      setActiveTrip(active || null);
      // Optionally, fetch next stop from trip details if available
      setNextStop(active?.stops?.find((s: any) => !s.triggered) || null);
      setLoading(false);
    });
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

const styles = StyleSheet.create({
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
    fontWeight: FONT_WEIGHT.bold,
  },
  sectionTitle: {
    fontSize: FONT_SIZE.lg,
    fontWeight: FONT_WEIGHT.semibold,
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
    fontWeight: FONT_WEIGHT.bold,
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
});