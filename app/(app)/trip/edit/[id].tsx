import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
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
  Save,
  ArrowLeft,
  Navigation,
  Car,
} from "lucide-react-native";
import { DateTimePicker } from "@/components/common/DateTimePicker";
import { LocationPicker } from "@/components/alarms/LocationPicker";
import { TravelTypeSelector } from "@/components/trips/TravelTypeSelector";
import { MapView } from "@/components/MapView";

export default function EditTripScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const { theme } = useTheme();
  const { getTrip, updateTrip } = useTrips();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [showLocationPicker, setShowLocationPicker] = useState(false);
  const [showTravelTypePicker, setShowTravelTypePicker] = useState(false);

  const [tripName, setTripName] = useState("");
  const [startDate, setStartDate] = useState(new Date());
  const [stops, setStops] = useState<any[]>([]);
  const [travelType, setTravelType] = useState("car");

  useEffect(() => {
    const loadTrip = async () => {
      try {
        setLoading(true);
        const tripData = await getTrip(id as string);
        if (tripData) {
          setTripName(tripData.name);
          setStartDate(new Date(tripData.startDate));
          setStops(tripData.stops || []);
          setTravelType(tripData.travelType || "car");
        }
      } catch (error) {
        console.error("Error loading trip:", error);
        Alert.alert("Error", "Failed to load trip details");
      } finally {
        setLoading(false);
      }
    };

    loadTrip();
  }, [id]);

  const handleSave = async () => {
    if (!tripName.trim()) {
      Alert.alert("Error", "Please enter a trip name");
      return;
    }

    if (stops.length === 0) {
      Alert.alert("Error", "Please add at least one stop");
      return;
    }

    try {
      setSaving(true);
      await updateTrip(id as string, {
        name: tripName,
        startDate: startDate.toISOString(),
        stops,
        travelType,
      });
      router.push(`/trip/details/${id}`);
    } catch (error) {
      console.error("Error updating trip:", error);
      Alert.alert("Error", "Failed to update trip");
    } finally {
      setSaving(false);
    }
  };

  const handleAddStop = (location: any) => {
    const newStop = {
      id: Date.now().toString(),
      location,
    };
    setStops([...stops, newStop]);
    setShowLocationPicker(false);
  };

  const handleRemoveStop = (stopId: string) => {
    setStops(stops.filter((stop) => stop.id !== stopId));
  };

  const handleDateChange = (event: any, selectedDate?: Date) => {
    setShowDatePicker(false);
    if (selectedDate) {
      const newDate = new Date(startDate);
      newDate.setFullYear(selectedDate.getFullYear());
      newDate.setMonth(selectedDate.getMonth());
      newDate.setDate(selectedDate.getDate());
      setStartDate(newDate);
    }
  };

  const handleTimeChange = (event: any, selectedTime?: Date) => {
    setShowTimePicker(false);
    if (selectedTime) {
      const newDate = new Date(startDate);
      newDate.setHours(selectedTime.getHours());
      newDate.setMinutes(selectedTime.getMinutes());
      setStartDate(newDate);
    }
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString(undefined, {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString(undefined, {
      hour: "2-digit",
      minute: "2-digit",
    });
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
    inputContainer: {
      marginBottom: 20,
    },
    label: {
      fontSize: 16,
      fontWeight: "500",
      color: theme.colors.text,
      marginBottom: 8,
    },
    input: {
      backgroundColor: theme.colors.card,
      borderRadius: 12,
      padding: 12,
      fontSize: 16,
      color: theme.colors.text,
      borderWidth: 1,
      borderColor: theme.colors.border,
    },
    dateTimeContainer: {
      flexDirection: "row",
      justifyContent: "space-between",
    },
    dateTimeButton: {
      flex: 1,
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: theme.colors.card,
      borderRadius: 12,
      padding: 12,
      marginRight: 8,
      borderWidth: 1,
      borderColor: theme.colors.border,
    },
    timeButton: {
      flex: 1,
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: theme.colors.card,
      borderRadius: 12,
      padding: 12,
      marginLeft: 8,
      borderWidth: 1,
      borderColor: theme.colors.border,
    },
    dateTimeText: {
      fontSize: 16,
      color: theme.colors.text,
      marginLeft: 8,
    },
    travelTypeButton: {
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: theme.colors.card,
      borderRadius: 12,
      padding: 12,
      borderWidth: 1,
      borderColor: theme.colors.border,
    },
    travelTypeText: {
      fontSize: 16,
      color: theme.colors.text,
      marginLeft: 8,
    },
    mapContainer: {
      height: 200,
      marginVertical: 20,
      borderRadius: 12,
      overflow: "hidden",
    },
    stopsContainer: {
      marginBottom: 20,
    },
    stopsHeader: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: 12,
    },
    addStopButton: {
      backgroundColor: theme.colors.primary,
      borderRadius: 8,
      paddingVertical: 6,
      paddingHorizontal: 12,
    },
    addStopButtonText: {
      color: "#FFFFFF",
      fontSize: 14,
      fontWeight: "600",
    },
    stopItem: {
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: theme.colors.card,
      borderRadius: 12,
      padding: 16,
      marginBottom: 8,
      borderWidth: 1,
      borderColor: theme.colors.border,
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
    removeButton: {
      padding: 8,
    },
    saveButton: {
      backgroundColor: theme.colors.primary,
      borderRadius: 12,
      padding: 16,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
    },
    saveButtonText: {
      color: "#FFFFFF",
      fontSize: 16,
      fontWeight: "600",
      marginLeft: 8,
    },
  });

  if (loading) {
    return (
      <SafeAreaView style={styles.container} edges={["bottom"]}>
        <Stack.Screen
          options={{
            title: "Edit Trip",
            headerLeft: () => (
              <TouchableOpacity onPress={() => router.back()}>
                <ArrowLeft size={24} color={theme.colors.text} />
              </TouchableOpacity>
            ),
          }}
        />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={theme.colors.primary} />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={["bottom"]}>
      <Stack.Screen
        options={{
          title: "Edit Trip",
          headerLeft: () => (
            <TouchableOpacity onPress={() => router.back()}>
              <ArrowLeft size={24} color={theme.colors.text} />
            </TouchableOpacity>
          ),
        }}
      />

      <ScrollView style={styles.content}>
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Trip Name</Text>
          <TextInput
            style={styles.input}
            value={tripName}
            onChangeText={setTripName}
            placeholder="Enter trip name"
            placeholderTextColor={theme.colors.textSecondary}
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Date & Time</Text>
          <View style={styles.dateTimeContainer}>
            <TouchableOpacity
              style={styles.dateTimeButton}
              onPress={() => setShowDatePicker(true)}
            >
              <Calendar size={20} color={theme.colors.primary} />
              <Text style={styles.dateTimeText}>{formatDate(startDate)}</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.timeButton}
              onPress={() => setShowTimePicker(true)}
            >
              <Clock size={20} color={theme.colors.primary} />
              <Text style={styles.dateTimeText}>{formatTime(startDate)}</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Travel Mode</Text>
          <TouchableOpacity
            style={styles.travelTypeButton}
            onPress={() => setShowTravelTypePicker(true)}
          >
            <Car size={20} color={theme.colors.primary} />
            <Text style={styles.travelTypeText}>
              {travelType.charAt(0).toUpperCase() + travelType.slice(1)}
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.mapContainer}>
          <MapView
            currentLocation={null}
            destination={
              stops.length > 0
                ? {
                    latitude: stops[0].location.latitude,
                    longitude: stops[0].location.longitude,
                    name: stops[0].location.name,
                  }
                : null
            }
          />
        </View>

        <View style={styles.stopsContainer}>
          <View style={styles.stopsHeader}>
            <Text style={styles.label}>Stops</Text>
            <TouchableOpacity
              style={styles.addStopButton}
              onPress={() => setShowLocationPicker(true)}
            >
              <Text style={styles.addStopButtonText}>Add Stop</Text>
            </TouchableOpacity>
          </View>

          {stops.map((stop, index) => (
            <View key={stop.id} style={styles.stopItem}>
              <View style={styles.stopNumber}>
                <Text style={styles.stopNumberText}>{index + 1}</Text>
              </View>
              <View style={styles.stopInfo}>
                <Text style={styles.stopName}>{stop.location.name}</Text>
                <Text style={styles.stopAddress}>{stop.location.address}</Text>
              </View>
              <TouchableOpacity
                style={styles.removeButton}
                onPress={() => handleRemoveStop(stop.id)}
              >
                <Text style={{ color: theme.colors.error }}>Remove</Text>
              </TouchableOpacity>
            </View>
          ))}
        </View>

        <TouchableOpacity
          style={styles.saveButton}
          onPress={handleSave}
          disabled={saving}
        >
          {saving ? (
            <ActivityIndicator size="small" color="#FFFFFF" />
          ) : (
            <>
              <Save size={20} color="#FFFFFF" />
              <Text style={styles.saveButtonText}>Save Changes</Text>
            </>
          )}
        </TouchableOpacity>
      </ScrollView>

      {showDatePicker && (
        <DateTimePicker
          value={startDate}
          mode="date"
          onChange={handleDateChange}
        />
      )}

      {showTimePicker && (
        <DateTimePicker
          value={startDate}
          mode="time"
          onChange={handleTimeChange}
        />
      )}

      <LocationPicker
        visible={showLocationPicker}
        onClose={() => setShowLocationPicker(false)}
        onSelectLocation={handleAddStop}
      />

      <TravelTypeSelector
        visible={showTravelTypePicker}
        onClose={() => setShowTravelTypePicker(false)}
        onSelectType={setTravelType}
        selectedType={travelType}
      />
    </SafeAreaView>
  );
}