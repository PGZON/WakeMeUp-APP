import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from "react-native";
import { useLocalSearchParams, useRouter, Stack } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTheme } from "@/context/ThemeContext";
import { useTrips } from "@/hooks/useTrips";
import {
  MapPin,
  Calendar,
  Clock,
  Edit2,
  Trash2,
  Navigation,
  ArrowLeft,
  Car,
  Bus,
  Train,
  Plane,
  Bike,
} from "lucide-react-native";
import { MapView } from "@/components/MapView";

export default function TripDetailsScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const { theme } = useTheme();
  const { getTrip, deleteTrip } = useTrips();
  const [trip, setTrip] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadTrip = async () => {
      try {
        setLoading(true);
        const tripData = await getTrip(id as string);
        setTrip(tripData);
      } catch (error) {
        console.error("Error loading trip:", error);
        Alert.alert("Error", "Failed to load trip details");
      } finally {
        setLoading(false);
      }
    };

    loadTrip();
  }, [id]);

  const handleDeleteTrip = () => {
    Alert.alert(
      "Delete Trip",
      "Are you sure you want to delete this trip?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              await deleteTrip(id as string);
              router.back();
            } catch (error) {
              console.error("Error deleting trip:", error);
              Alert.alert("Error", "Failed to delete trip");
            }
          },
        },
      ]
    );
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString(undefined, {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString(undefined, {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getTravelTypeIcon = (type: string) => {
    switch (type) {
      case "car":
        return <Car size={24} color={theme.colors.primary} />;
      case "bus":
        return <Bus size={24} color={theme.colors.primary} />;
      case "train":
        return <Train size={24} color={theme.colors.primary} />;
      case "plane":
        return <Plane size={24} color={theme.colors.primary} />;
      case "bike":
        return <Bike size={24} color={theme.colors.primary} />;
      default:
        return <Car size={24} color={theme.colors.primary} />;
    }
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
    content: {
      flex: 1,
      padding: 16,
    },
    loadingContainer: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
    },
    header: {
      marginBottom: 24,
    },
    tripName: {
      fontSize: 24,
      fontWeight: "bold",
      color: theme.colors.text,
      marginBottom: 8,
    },
    dateTimeRow: {
      flexDirection: "row",
      alignItems: "center",
      marginBottom: 4,
    },
    dateTimeText: {
      fontSize: 16,
      color: theme.colors.textSecondary,
      marginLeft: 8,
    },
    travelTypeContainer: {
      flexDirection: "row",
      alignItems: "center",
      marginTop: 8,
    },
    travelTypeText: {
      fontSize: 16,
      color: theme.colors.textSecondary,
      marginLeft: 8,
    },
    mapContainer: {
      height: 200,
      marginBottom: 24,
      borderRadius: 12,
      overflow: "hidden",
    },
    sectionTitle: {
      fontSize: 18,
      fontWeight: "600",
      color: theme.colors.text,
      marginBottom: 12,
    },
    stopsList: {
      marginBottom: 24,
    },
    stopItem: {
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: theme.colors.card,
      borderRadius: 12,
      padding: 16,
      marginBottom: 8,
    },
    stopNumber: {
      width: 24,
      height: 24,
      borderRadius: 12,
      backgroundColor: theme.colors.primary,
      alignItems: "center",
      justifyContent: "center",
      marginRight: 12,
    },
    stopNumberText: {
      color: "#FFFFFF",
      fontWeight: "bold",
      fontSize: 12,
    },
    stopInfo: {
      flex: 1,
    },
    stopName: {
      fontSize: 16,
      color: theme.colors.text,
      marginBottom: 2,
    },
    stopAddress: {
      fontSize: 14,
      color: theme.colors.textSecondary,
    },
    actionsContainer: {
      flexDirection: "row",
      justifyContent: "space-between",
      marginTop: 24,
    },
    actionButton: {
      flex: 1,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      padding: 16,
      borderRadius: 12,
      marginHorizontal: 4,
    },
    editButton: {
      backgroundColor: theme.colors.primary,
    },
    deleteButton: {
      backgroundColor: theme.colors.error,
    },
    actionButtonText: {
      fontSize: 16,
      fontWeight: "600",
      color: "#FFFFFF",
      marginLeft: 8,
    },
  });

  return (
    <SafeAreaView style={styles.container} edges={["bottom"]}>
      <Stack.Screen
        options={{
          title: "Trip Details",
          headerLeft: () => (
            <TouchableOpacity onPress={() => router.back()}>
              <ArrowLeft size={24} color={theme.colors.text} />
            </TouchableOpacity>
          ),
        }}
      />

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={theme.colors.primary} />
        </View>
      ) : trip ? (
        <ScrollView style={styles.content}>
          <View style={styles.header}>
            <Text style={styles.tripName}>{trip.name}</Text>
            <View style={styles.dateTimeRow}>
              <Calendar size={20} color={theme.colors.textSecondary} />
              <Text style={styles.dateTimeText}>{formatDate(trip.startDate)}</Text>
            </View>
            <View style={styles.dateTimeRow}>
              <Clock size={20} color={theme.colors.textSecondary} />
              <Text style={styles.dateTimeText}>{formatTime(trip.startDate)}</Text>
            </View>
            {trip.travelType && (
              <View style={styles.travelTypeContainer}>
                {getTravelTypeIcon(trip.travelType)}
                <Text style={styles.travelTypeText}>
                  {trip.travelType.charAt(0).toUpperCase() + trip.travelType.slice(1)}
                </Text>
              </View>
            )}
          </View>

          <View style={styles.mapContainer}>
            <MapView
              currentLocation={null}
              destination={
                trip.stops && trip.stops.length > 0
                  ? {
                      latitude: trip.stops[0].location.latitude,
                      longitude: trip.stops[0].location.longitude,
                      name: trip.stops[0].location.name,
                    }
                  : null
              }
            />
          </View>

          <Text style={styles.sectionTitle}>Stops</Text>
          <View style={styles.stopsList}>
            {trip.stops && trip.stops.map((stop: any, index: number) => (
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
          </View>

          <View style={styles.actionsContainer}>
            <TouchableOpacity
              style={[styles.actionButton, styles.editButton]}
              onPress={() => router.push(`/trip/edit/${id}`)}
            >
              <Edit2 size={20} color="#FFFFFF" />
              <Text style={styles.actionButtonText}>Edit Trip</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.actionButton, styles.deleteButton]}
              onPress={handleDeleteTrip}
            >
              <Trash2 size={20} color="#FFFFFF" />
              <Text style={styles.actionButtonText}>Delete</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      ) : (
        <View style={styles.loadingContainer}>
          <Text>Trip not found</Text>
        </View>
      )}
    </SafeAreaView>
  );
}