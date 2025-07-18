import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { useColorScheme } from "react-native";
import { Feather } from '@expo/vector-icons';
import { Card } from "@/components/ui/Card";
import Colors from "@/constants/colors";
import { FONT_SIZE, FONT_WEIGHT, SPACING } from "@/constants/theme";
import { getWeather } from '../../utils/api';

interface WeatherWidgetProps {
  temperature: number;
  condition: "sunny" | "cloudy" | "rainy" | "stormy";
  location: string;
}

export function WeatherWidget({
  temperature,
  condition,
  location,
}: WeatherWidgetProps) {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme === "dark" ? "dark" : "light"];

  const getWeatherIcon = () => {
    switch (condition) {
      case "sunny":
        return <Feather name="sun" size={32} color="#FFB347" />;
      case "cloudy":
        return <Feather name="cloud" size={32} color="#A9A9A9" />;
      case "rainy":
        return <Feather name="cloud-rain" size={32} color="#6495ED" />;
      case "stormy":
        return <Feather name="cloud-rain" size={32} color="#4682B4" />;
      default:
        return <Feather name="sun" size={32} color="#FFB347" />;
    }
  };

  const getConditionText = () => {
    return condition.charAt(0).toUpperCase() + condition.slice(1);
  };

  return (
    <Card
      variant="elevated"
      style={styles.card}
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
          Weather
        </Text>
        <Text
          style={[
            styles.location,
            {
              color: colors.subtext,
            },
          ]}
        >
          {location}
        </Text>
      </View>

      <View style={styles.content}>
        <View style={styles.iconContainer}>{getWeatherIcon()}</View>
        <View style={styles.infoContainer}>
          <View style={styles.temperatureContainer}>
            <Feather name="thermometer" size={16} color={colors.primary} />
            <Text
              style={[
                styles.temperature,
                {
                  color: colors.text,
                },
              ]}
            >
              {temperature}°C
            </Text>
          </View>
          <Text
            style={[
              styles.condition,
              {
                color: colors.text,
              },
            ]}
          >
            {getConditionText()}
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
  header: {
    marginBottom: SPACING.md,
  },
  title: {
    fontSize: FONT_SIZE.md,
    fontWeight: FONT_WEIGHT.semibold,
  },
  location: {
    fontSize: FONT_SIZE.sm,
    marginTop: SPACING.xs,
  },
  content: {
    flexDirection: "row",
    alignItems: "center",
  },
  iconContainer: {
    marginRight: SPACING.lg,
  },
  infoContainer: {},
  temperatureContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: SPACING.xs,
  },
  temperature: {
    fontSize: FONT_SIZE.lg,
    fontWeight: FONT_WEIGHT.bold,
    marginLeft: SPACING.xs,
  },
  condition: {
    fontSize: FONT_SIZE.md,
  },
});