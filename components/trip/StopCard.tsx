import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { useColorScheme } from "react-native";
import { Feather } from '@expo/vector-icons';
import { Card } from "@/components/ui/Card";
import Colors from "@/constants/colors";
import { FONT_SIZE, FONT_WEIGHT, SPACING } from "@/constants/theme";

interface StopCardProps {
  name: string;
  eta?: string;
  distance?: string;
  radius: number;
  triggered?: boolean;
}

export function StopCard({
  name,
  eta,
  distance,
  radius,
  triggered = false,
}: StopCardProps) {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme === "dark" ? "dark" : "light"];

  return (
    <Card
      variant="outlined"
      style={[
        styles.card,
        {
          borderColor: triggered ? colors.success : colors.border,
          backgroundColor: triggered
            ? `${colors.success}10`
            : colors.card,
        },
      ]}
    >
      <View style={styles.header}>
        <View style={styles.titleContainer}>
          <Feather
            name="map-pin"
            size={18}
            color={triggered ? colors.success : colors.primary}
          />
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
        </View>
        {triggered && (
          <Feather name="check-circle" size={20} color={colors.success} />
        )}
      </View>

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

      <View style={styles.radiusContainer}>
        <Text
          style={[
            styles.radiusLabel,
            {
              color: colors.subtext,
            },
          ]}
        >
          Alarm radius:
        </Text>
        <Text
          style={[
            styles.radiusValue,
            {
              color: colors.text,
            },
          ]}
        >
          {radius} m
        </Text>
      </View>
    </Card>
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
  titleContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  title: {
    fontSize: FONT_SIZE.md,
    fontWeight: FONT_WEIGHT.semibold,
    marginLeft: SPACING.sm,
  },
  infoContainer: {
    flexDirection: "row",
    marginVertical: SPACING.sm,
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
  radiusContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  radiusLabel: {
    fontSize: FONT_SIZE.sm,
    marginRight: SPACING.xs,
  },
  radiusValue: {
    fontSize: FONT_SIZE.sm,
    fontWeight: FONT_WEIGHT.medium,
  },
});