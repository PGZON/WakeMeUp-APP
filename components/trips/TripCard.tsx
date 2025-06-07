import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { useTheme } from "@/context/ThemeContext";
import { MapPin, Calendar, Navigation } from "lucide-react-native";

interface TripCardProps {
  trip: any;
  onPress: () => void;
}

export const TripCard: React.FC<TripCardProps> = ({ trip, onPress }) => {
  const { theme } = useTheme();

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString(undefined, {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const isUpcoming = new Date(trip.startDate) > new Date();

  const styles = StyleSheet.create({
    container: {
      backgroundColor: theme.colors.card,
      borderRadius: 16,
      padding: 16,
      marginBottom: 16,
      shadowColor: theme.colors.shadow,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 2,
    },
    header: {
      flexDirection: "row",
      alignItems: "center",
      marginBottom: 12,
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
    dateRange: {
      fontSize: 14,
      color: theme.colors.textSecondary,
      marginTop: 2,
    },
    stopsContainer: {
      marginBottom: 12,
    },
    stopsHeader: {
      fontSize: 14,
      fontWeight: "500",
      color: theme.colors.textSecondary,
      marginBottom: 8,
    },
    stopItem: {
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: theme.colors.backgroundSecondary,
      borderRadius: 12,
      padding: 12,
      marginBottom: 8,
    },
    stopNumber: {
      width: 20,
      height: 20,
      borderRadius: 10,
      backgroundColor: theme.colors.primary,
      justifyContent: "center",
      alignItems: "center",
      marginRight: 8,
    },
    stopNumberText: {
      fontSize: 12,
      fontWeight: "bold",
      color: "#FFFFFF",
    },
    stopInfo: {
      flex: 1,
    },
    stopName: {
      fontSize: 14,
      fontWeight: "500",
      color: theme.colors.text,
    },
    stopAddress: {
      fontSize: 12,
      color: theme.colors.textSecondary,
      marginTop: 2,
    },
    footer: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
    },
    dateContainer: {
      flexDirection: "row",
      alignItems: "center",
    },
    dateText: {
      fontSize: 14,
      color: theme.colors.textSecondary,
      marginLeft: 4,
    },
    statusContainer: {
      paddingHorizontal: 12,
      paddingVertical: 6,
      borderRadius: 12,
      backgroundColor: isUpcoming
        ? theme.colors.successBackground
        : theme.colors.backgroundSecondary,
    },
    statusText: {
      fontSize: 12,
      fontWeight: "500",
      color: isUpcoming ? theme.colors.success : theme.colors.textSecondary,
    },
  });

  return (
    <TouchableOpacity style={styles.container} onPress={onPress}>
      <View style={styles.header}>
        <View style={styles.iconContainer}>
          <Navigation size={20} color="#FFFFFF" />
        </View>
        <View style={styles.titleContainer}>
          <Text style={styles.title}>{trip.name}</Text>
          <Text style={styles.dateRange}>
            {formatDate(trip.startDate)} - {formatDate(trip.endDate)}
          </Text>
        </View>
      </View>

      <View style={styles.stopsContainer}>
        <Text style={styles.stopsHeader}>
          {trip.stops.length} {trip.stops.length === 1 ? "Stop" : "Stops"}
        </Text>
        {trip.stops.slice(0, 2).map((stop: any, index: number) => (
          <View key={stop.id} style={styles.stopItem}>
            <View style={styles.stopNumber}>
              <Text style={styles.stopNumberText}>{index + 1}</Text>
            </View>
            <View style={styles.stopInfo}>
              <Text style={styles.stopName}>{stop.location.name}</Text>
              <Text style={styles.stopAddress}>{stop.location.address}</Text>
            </View>
          </View>
        ))}
        {trip.stops.length > 2 && (
          <Text style={[styles.stopAddress, { textAlign: "center" }]}>
            +{trip.stops.length - 2} more stops
          </Text>
        )}
      </View>

      <View style={styles.footer}>
        <View style={styles.dateContainer}>
          <Calendar size={16} color={theme.colors.textSecondary} />
          <Text style={styles.dateText}>{formatDate(trip.startDate)}</Text>
        </View>
        <View style={styles.statusContainer}>
          <Text style={styles.statusText}>
            {isUpcoming ? "Upcoming" : "Past Trip"}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};