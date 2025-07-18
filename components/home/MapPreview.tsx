import React from "react";
import { View, Text, StyleSheet, Platform } from "react-native";
import { useColorScheme } from "react-native";
import { Card } from "@/components/ui/Card";
import Colors from "@/constants/colors";
import { FONT_SIZE, FONT_WEIGHT, SPACING, RADIUS } from "@/constants/theme";
import { Feather } from '@expo/vector-icons';

interface MapPreviewProps {
  title?: string;
}

export function MapPreview({ title = "Current Location" }: MapPreviewProps) {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme === "dark" ? "dark" : "light"];

  // In a real app, this would be a MapView component from react-native-maps
  // For this example, we'll just show a placeholder
  return (
    <Card variant="elevated" style={styles.card}>
      <Text
        style={[
          styles.title,
          {
            color: colors.text,
          },
        ]}
      >
        {title}
      </Text>
      <View
        style={[
          styles.mapContainer,
          {
            backgroundColor: colors.mapBackground,
          },
        ]}
      >
        <View style={styles.mapPlaceholder}>
          <Feather name="map-pin" size={32} color={colors.primary} />
          <Text
            style={[
              styles.mapText,
              {
                color: colors.subtext,
              },
            ]}
          >
            {Platform.OS === "web"
              ? "Map preview not available on web"
              : "Map preview"}
          </Text>
        </View>
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
  title: {
    fontSize: FONT_SIZE.md,
    fontWeight: FONT_WEIGHT.semibold,
    marginBottom: SPACING.sm,
  },
  mapContainer: {
    height: 180,
    borderRadius: RADIUS.md,
    overflow: "hidden",
  },
  mapPlaceholder: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  mapText: {
    marginTop: SPACING.sm,
    fontSize: FONT_SIZE.sm,
  },
});