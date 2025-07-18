import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { useColorScheme } from "react-native";
import { useRouter } from "expo-router";
import { Feather } from '@expo/vector-icons';
import { Card } from "@/components/ui/Card";
import Colors from "@/constants/colors";
import { FONT_SIZE, FONT_WEIGHT, SPACING } from "@/constants/theme";

interface TripCardProps {
  id: string;
  name: string;
  startLocation: string;
  endLocation: string;
  eta?: string;
  distance?: string;
  isActive?: boolean;
  onPress?: () => void;
}

export function TripCard({
  id,
  name,
  startLocation,
  endLocation,
  eta,
  distance,
  isActive = false,
  onPress,
}: TripCardProps) {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme === "dark" ? "dark" : "light"];
  const router = useRouter();

  const handlePress = () => {
    if (onPress) {
      onPress();
    } else {
      router.push(`/trip/${id}`);
    }
  };

  return (
    <TouchableOpacity onPress={handlePress} activeOpacity={0.7}>
      <Card
        variant="elevated"
        style={[
          styles.card,
          {
            borderLeftWidth: 4,
            borderLeftColor: isActive ? colors.primary : "transparent",
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
            {name}
          </Text>
          {isActive && (
            <View
              style={[
                styles.activeIndicator,
                {
                  backgroundColor: colors.primary,
                },
              ]}
            >
              <Text style={styles.activeText}>Active</Text>
            </View>
          )}
        </View>

        <View style={styles.locationContainer}>
          <View style={styles.locationRow}>
            <Feather name="map-pin" size={16} color={colors.primary} />
            <Text
              style={[
                styles.locationText,
                {
                  color: colors.text,
                },
              ]}
            >
              From: {startLocation}
            </Text>
          </View>
          <View style={styles.locationRow}>
            <Feather name="navigation" size={16} color={colors.secondary} />
            <Text
              style={[
                styles.locationText,
                {
                  color: colors.text,
                },
              ]}
            >
              To: {endLocation}
            </Text>
          </View>
        </View>

        {(eta || distance) && (
          <View style={styles.infoContainer}>
            {eta && (
              <View style={styles.infoItem}>
                <Feather name="clock" size={14} color={colors.subtext} />
                <Text
                  style={[
                    styles.infoText,
                    {
                      color: colors.subtext,
                    },
                  ]}
                >
                  ETA: {eta}
                </Text>
              </View>
            )}
            {distance && (
              <View style={styles.infoItem}>
                <Text
                  style={[
                    styles.infoText,
                    {
                      color: colors.subtext,
                    },
                  ]}
                >
                  {distance}
                </Text>
              </View>
            )}
          </View>
        )}
      </Card>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    marginHorizontal: SPACING.md,
    marginVertical: SPACING.sm,
    padding: SPACING.md,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: SPACING.sm,
  },
  title: {
    fontSize: FONT_SIZE.lg,
    fontWeight: FONT_WEIGHT.semibold,
    flex: 1,
  },
  activeIndicator: {
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.xs,
    borderRadius: 12,
  },
  activeText: {
    color: "#FFFFFF",
    fontSize: FONT_SIZE.xs,
    fontWeight: FONT_WEIGHT.medium,
  },
  locationContainer: {
    marginVertical: SPACING.sm,
  },
  locationRow: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: SPACING.xs,
  },
  locationText: {
    marginLeft: SPACING.sm,
    fontSize: FONT_SIZE.md,
  },
  infoContainer: {
    flexDirection: "row",
    marginTop: SPACING.sm,
  },
  infoItem: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: SPACING.md,
  },
  infoText: {
    marginLeft: SPACING.xs,
    fontSize: FONT_SIZE.sm,
  },
});