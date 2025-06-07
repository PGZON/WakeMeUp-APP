import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { useTheme } from "@/context/ThemeContext";
import { Bell, MapPin, Navigation } from "lucide-react-native";

interface ActiveAlarmCardProps {
  alarm: any;
}

export const ActiveAlarmCard: React.FC<ActiveAlarmCardProps> = ({ alarm }) => {
  const { theme } = useTheme();

  const formatRadius = (meters: number) => {
    return meters >= 1000 ? `${(meters / 1000).toFixed(1)} km` : `${meters} m`;
  };

  const styles = StyleSheet.create({
    container: {
      backgroundColor: theme.colors.card,
      borderRadius: 16,
      padding: 16,
      shadowColor: theme.colors.shadow,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 2,
    },
    header: {
      flexDirection: "row",
      alignItems: "center",
      marginBottom: 16,
    },
    iconContainer: {
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: theme.colors.primary,
      justifyContent: "center",
      alignItems: "center",
      marginRight: 12,
    },
    titleContainer: {
      flex: 1,
    },
    title: {
      fontSize: 18,
      fontWeight: "600",
      color: theme.colors.text,
    },
    subtitle: {
      fontSize: 14,
      color: theme.colors.textSecondary,
      marginTop: 2,
    },
    locationContainer: {
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: theme.colors.backgroundSecondary,
      borderRadius: 12,
      padding: 12,
      marginBottom: 16,
    },
    locationTextContainer: {
      flex: 1,
      marginLeft: 12,
    },
    locationName: {
      fontSize: 16,
      fontWeight: "500",
      color: theme.colors.text,
    },
    locationAddress: {
      fontSize: 14,
      color: theme.colors.textSecondary,
      marginTop: 2,
    },
    detailsContainer: {
      flexDirection: "row",
      justifyContent: "space-between",
      marginBottom: 16,
    },
    detailItem: {
      alignItems: "center",
      flex: 1,
    },
    detailLabel: {
      fontSize: 12,
      color: theme.colors.textSecondary,
      marginBottom: 4,
    },
    detailValue: {
      fontSize: 16,
      fontWeight: "500",
      color: theme.colors.text,
    },
    statusContainer: {
      backgroundColor: theme.colors.successBackground,
      borderRadius: 12,
      padding: 12,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
    },
    statusText: {
      fontSize: 14,
      fontWeight: "500",
      color: theme.colors.success,
      marginLeft: 8,
    },
  });

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.iconContainer}>
          <Bell size={20} color="#FFFFFF" />
        </View>
        <View style={styles.titleContainer}>
          <Text style={styles.title}>{alarm.name}</Text>
          <Text style={styles.subtitle}>Active Alarm</Text>
        </View>
      </View>

      <View style={styles.locationContainer}>
        <MapPin size={20} color={theme.colors.primary} />
        <View style={styles.locationTextContainer}>
          <Text style={styles.locationName}>{alarm.location.name}</Text>
          <Text style={styles.locationAddress}>{alarm.location.address}</Text>
        </View>
      </View>

      <View style={styles.detailsContainer}>
        <View style={styles.detailItem}>
          <Text style={styles.detailLabel}>Radius</Text>
          <Text style={styles.detailValue}>{formatRadius(alarm.radius)}</Text>
        </View>
        <View style={styles.detailItem}>
          <Text style={styles.detailLabel}>Sound</Text>
          <Text style={styles.detailValue}>
            {alarm.sound === "default" ? "Default" : alarm.sound}
          </Text>
        </View>
        <View style={styles.detailItem}>
          <Text style={styles.detailLabel}>Vibration</Text>
          <Text style={styles.detailValue}>{alarm.vibration ? "On" : "Off"}</Text>
        </View>
      </View>

      <View style={styles.statusContainer}>
        <Navigation size={16} color={theme.colors.success} />
        <Text style={styles.statusText}>Alarm is active and monitoring</Text>
      </View>
    </View>
  );
};