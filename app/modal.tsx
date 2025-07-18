import React, { useState, useEffect } from "react";
import { StyleSheet, Text, View, TouchableOpacity, useColorScheme } from "react-native";
import { StatusBar } from "expo-status-bar";
import { Feather } from '@expo/vector-icons';
import { useRouter } from "expo-router";
import Colors from "@/constants/colors";
import { FONT_SIZE, FONT_WEIGHT, SPACING } from "@/constants/theme";
import api from "@/utils/api";

export default function WeatherModal() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme === "dark" ? "dark" : "light"];
  const router = useRouter();

  const [weatherData, setWeatherData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchWeather = async () => {
      setLoading(true);
      try {
        const response = await api.get('/weather');
        setWeatherData(response.data);
        setError(null);
      } catch (err) {
        setError('Failed to fetch weather data');
        setWeatherData(null);
      } finally {
        setLoading(false);
      }
    };
    fetchWeather();
  }, []);

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: colors.background,
        },
      ]}
    >
      <StatusBar style={colorScheme === "dark" ? "light" : "dark"} />

      <View style={styles.header}>
        <Text
          style={[
            styles.title,
            {
              color: colors.text,
            },
          ]}
        >
          Weather Details
        </Text>
        <TouchableOpacity onPress={() => router.back()}>
          <Feather name="x" size={24} color={colors.text} />
        </TouchableOpacity>
      </View>

      <View style={styles.locationContainer}>
        {loading ? (
          <Text>Loading...</Text>
        ) : error ? (
          <Text>{error}</Text>
        ) : weatherData ? (
          <>
            <Text style={[styles.location, { color: colors.text }]}>{weatherData.location}</Text>
            <Text style={[styles.fetchedTime, { color: colors.subtext }]}>Updated at {weatherData.fetchedTime}</Text>
          </>
        ) : null}
      </View>

      <View style={styles.weatherIconContainer}>
        <Feather name="cloud" size={80} color={colors.primary} />
        <Text
          style={[
            styles.temperature,
            {
              color: colors.text,
            },
          ]}
        >
          {weatherData?.temperature}°F
        </Text>
        <Text
          style={[
            styles.condition,
            {
              color: colors.text,
            },
          ]}
        >
          {weatherData?.condition}
        </Text>
      </View>

      <View
        style={[
          styles.detailsContainer,
          {
            backgroundColor: colors.card,
            borderColor: colors.border,
          },
        ]}
      >
        <View style={styles.detailRow}>
          <View style={styles.detailItem}>
            <Feather name="wind" size={24} color={colors.primary} />
            <View style={styles.detailTextContainer}>
              <Text
                style={[
                  styles.detailLabel,
                  {
                    color: colors.subtext,
                  },
                ]}
              >
                Wind
              </Text>
              <Text
                style={[
                  styles.detailValue,
                  {
                    color: colors.text,
                  },
                ]}
              >
                {weatherData?.windSpeed} mph {weatherData?.windDirection}
              </Text>
            </View>
          </View>
          <View style={styles.detailItem}>
            <Feather name="droplet" size={24} color={colors.primary} />
            <View style={styles.detailTextContainer}>
              <Text
                style={[
                  styles.detailLabel,
                  {
                    color: colors.subtext,
                  },
                ]}
              >
                Humidity
              </Text>
              <Text
                style={[
                  styles.detailValue,
                  {
                    color: colors.text,
                  },
                ]}
              >
                {weatherData?.humidity}%
              </Text>
            </View>
          </View>
        </View>
      </View>

      <Text
        style={[
          styles.forecastTitle,
          {
            color: colors.text,
          },
        ]}
      >
        Forecast
      </Text>

      <View
        style={[
          styles.forecastContainer,
          {
            backgroundColor: colors.card,
            borderColor: colors.border,
          },
        ]}
      >
        <View style={styles.forecastItem}>
          <Text
            style={[
              styles.forecastDay,
              {
                color: colors.text,
              },
            ]}
          >
            Today
          </Text>
          <Feather name="cloud" size={24} color={colors.primary} />
          <Text
            style={[
              styles.forecastTemp,
              {
                color: colors.text,
              },
            ]}
          >
            {weatherData?.temperature}°F
          </Text>
        </View>
        <View style={styles.forecastItem}>
          <Text
            style={[
              styles.forecastDay,
              {
                color: colors.text,
              },
            ]}
          >
            Tomorrow
          </Text>
          <Feather name="sun" size={24} color="#FFB347" />
          <Text
            style={[
              styles.forecastTemp,
              {
                color: colors.text,
              },
            ]}
          >
            72°F
          </Text>
        </View>
        <View style={styles.forecastItem}>
          <Text
            style={[
              styles.forecastDay,
              {
                color: colors.text,
              },
            ]}
          >
            Wed
          </Text>
          <Feather name="sun" size={24} color="#FFB347" />
          <Text
            style={[
              styles.forecastTemp,
              {
                color: colors.text,
              },
            ]}
          >
            75°F
          </Text>
        </View>
        <View style={styles.forecastItem}>
          <Text
            style={[
              styles.forecastDay,
              {
                color: colors.text,
              },
            ]}
          >
            Thu
          </Text>
          <Feather name="cloud-rain" size={24} color="#6495ED" />
          <Text
            style={[
              styles.forecastTemp,
              {
                color: colors.text,
              },
            ]}
          >
            65°F
          </Text>
        </View>
        <View style={styles.forecastItem}>
          <Text
            style={[
              styles.forecastDay,
              {
                color: colors.text,
              },
            ]}
          >
            Fri
          </Text>
          <Feather name="cloud" size={24} color={colors.primary} />
          <Text
            style={[
              styles.forecastTemp,
              {
                color: colors.text,
              },
            ]}
          >
            70°F
          </Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: SPACING.md,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: SPACING.lg,
  },
  title: {
    fontSize: FONT_SIZE.xl,
    fontWeight: FONT_WEIGHT.bold,
  },
  locationContainer: {
    marginBottom: SPACING.lg,
  },
  location: {
    fontSize: FONT_SIZE.lg,
    fontWeight: FONT_WEIGHT.semibold,
  },
  fetchedTime: {
    fontSize: FONT_SIZE.sm,
    marginTop: SPACING.xs,
  },
  weatherIconContainer: {
    alignItems: "center",
    marginBottom: SPACING.xl,
  },
  temperature: {
    fontSize: FONT_SIZE.xxxl,
    fontWeight: FONT_WEIGHT.bold,
    marginTop: SPACING.md,
  },
  condition: {
    fontSize: FONT_SIZE.lg,
    marginTop: SPACING.xs,
  },
  detailsContainer: {
    borderRadius: 12,
    borderWidth: 1,
    padding: SPACING.md,
    marginBottom: SPACING.xl,
  },
  detailRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  detailItem: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  detailTextContainer: {
    marginLeft: SPACING.sm,
  },
  detailLabel: {
    fontSize: FONT_SIZE.sm,
  },
  detailValue: {
    fontSize: FONT_SIZE.md,
    fontWeight: FONT_WEIGHT.medium,
    marginTop: SPACING.xs,
  },
  forecastTitle: {
    fontSize: FONT_SIZE.lg,
    fontWeight: FONT_WEIGHT.semibold,
    marginBottom: SPACING.md,
  },
  forecastContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    borderRadius: 12,
    borderWidth: 1,
    padding: SPACING.md,
  },
  forecastItem: {
    alignItems: "center",
  },
  forecastDay: {
    fontSize: FONT_SIZE.sm,
    marginBottom: SPACING.sm,
  },
  forecastTemp: {
    fontSize: FONT_SIZE.md,
    fontWeight: FONT_WEIGHT.medium,
    marginTop: SPACING.sm,
  },
});