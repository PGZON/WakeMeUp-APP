import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Alert,
} from "react-native";
import { useRouter, Stack } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTheme } from "@/context/ThemeContext";
import { useTrips } from "@/hooks/useTrips";
import {
  MapPin,
  Calendar,
  Clock,
  Plus,
  Trash2,
  ChevronDown,
  ArrowLeft,
} from "lucide-react-native";
import { LocationPicker } from "@/components/alarms/LocationPicker";
import { DateTimePicker } from "@/components/common/DateTimePicker";
import { TravelTypeSelector } from "@/components/trips/TravelTypeSelector";
import { SoundPicker } from "@/components/alarms/SoundPicker";

export default function CreateTripScreen() {
  const router = useRouter();
  const { theme } = useTheme();
  const { createTrip } = useTrips();
  const [isLoading, setIsLoading] = useState(false);
  const [showLocationPicker, setShowLocationPicker] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [showTravelTypePicker, setShowTravelTypePicker] = useState(false);
  const [showSoundPicker, setShowSoundPicker] = useState(false);
  const [currentStopIndex, setCurrentStopIndex] = useState(-1);

  // Trip state
  const [name, setName] = useState("");
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date(Date.now() + 86400000)); // Tomorrow
  const [stops, setStops] = useState<any[]>([]);
  const [travelType, setTravelType] = useState("car");
  const [alarmSound, setAlarmSound] = useState("default");

  const handleCreateTrip = async () => {
    if (!name.trim()) {
      Alert.alert("Error", "Please enter a trip name");
      return;
    }

    if (stops.length === 0) {
      Alert.alert("Error", "Please add at least one stop");
      return;
    }

    try {
      setIsLoading(true);
      await createTrip({
        name: name.trim(),
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString(),
        stops,
        travelType,
        alarmSound,
      });
      router.back();
    } catch (error) {
      console.error("Error creating trip:", error);
      Alert.alert("Error", "Failed to create trip. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectLocation = (location: any) => {
    if (currentStopIndex >= 0) {
      // Edit existing stop
      const updatedStops = [...stops];
      updatedStops[currentStopIndex] = {
        ...updatedStops[currentStopIndex],
        location,
      };
      setStops(updatedStops);
    } else {
      // Add new stop
      setStops([...stops, { id: Date.now().toString(), location, alarmEnabled: true }]);
    }
    setShowLocationPicker(false);
    setCurrentStopIndex(-1);
  };

  const handleAddStop = () => {
    setCurrentStopIndex(-1);
    setShowLocationPicker(true);
  };

  const handleEditStop = (index: number) => {
    setCurrentStopIndex(index);
    setShowLocationPicker(true);
  };

  const handleRemoveStop = (index: number) => {
    const updatedStops = [...stops];
    updatedStops.splice(index, 1);
    setStops(updatedStops);
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString(undefined, {
      year: "numeric",
      month: "short",
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
    section: {
      marginBottom: 24,
    },
    sectionTitle: {
      fontSize: 16,
      fontWeight: "600",
      color: theme.colors.textSecondary,
      marginBottom: 12,
    },
    inputContainer: {
      backgroundColor: theme.colors.card,
      borderRadius: 12,
      padding: 16,
      marginBottom: 8,
    },
    inputLabel: {
      fontSize: 14,
      color: theme.colors.textSecondary,
      marginBottom: 8,
    },
    input: {
      fontSize: 16,
      color: theme.colors.text,
      padding: 0,
    },
    dateRow: {
      flexDirection: "row",
      justifyContent: "space-between",
    },
    dateButton: {
      flex: 1,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      backgroundColor: theme.colors.card,
      borderRadius: 12,
      padding: 16,
      marginHorizontal: 4,
    },
    dateButtonText: {
      fontSize: 16,
      color: theme.colors.text,
      marginLeft: 8,
    },
    optionButton: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      backgroundColor: theme.colors.card,
      borderRadius: 12,
      padding: 16,
      marginTop: 8,
    },
    optionText: {
      fontSize: 16,
      color: theme.colors.text,
      marginLeft: 8,
    },
    stopsContainer: {
      marginBottom: 16,
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
    stopActions: {
      flexDirection: "row",
    },
    stopAction: {
      padding: 8,
    },
    addStopButton: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: theme.colors.backgroundSecondary || theme.colors.card,
      borderRadius: 12,
      padding: 16,
      marginBottom: 24,
    },
    addStopText: {
      fontSize: 16,
      color: theme.colors.primary,
      marginLeft: 8,
    },
    createButton: {
      backgroundColor: theme.colors.primary,
      borderRadius: 12,
      padding: 16,
      alignItems: "center",
      marginTop: 16,
    },
    createButtonText: {
      fontSize: 16,
      fontWeight: "600",
      color: "#FFFFFF",
    },
  });

  return (
    <SafeAreaView style={styles.container} edges={["bottom"]}>
      <Stack.Screen
        options={{
          title: "Create Trip",
          headerLeft: () => (
            <TouchableOpacity onPress={() => router.back()}>
              <ArrowLeft size={24} color={theme.colors.text} />
            </TouchableOpacity>
          ),
        }}
      />
      <ScrollView style={styles.content}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Trip Details</Text>
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Trip Name</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter trip name"
              placeholderTextColor={theme.colors.textSecondary}
              value={name}
              onChangeText={setName}
            />
          </View>

          <View style={styles.dateRow}>
            <TouchableOpacity
              style={[styles.dateButton, { marginLeft: 0 }]}
              onPress={() => {
                setShowDatePicker(true);
              }}
            >
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <Calendar size={20} color={theme.colors.primary} />
                <Text style={styles.dateButtonText}>{formatDate(startDate)}</Text>
              </View>
              <ChevronDown size={20} color={theme.colors.textSecondary} />
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.dateButton, { marginRight: 0 }]}
              onPress={() => {
                setShowTimePicker(true);
              }}
            >
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <Clock size={20} color={theme.colors.primary} />
                <Text style={styles.dateButtonText}>{formatTime(startDate)}</Text>
              </View>
              <ChevronDown size={20} color={theme.colors.textSecondary} />
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            style={styles.optionButton}
            onPress={() => setShowTravelTypePicker(true)}
          >
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <Text style={styles.optionText}>
                Travel Mode: {travelType.charAt(0).toUpperCase() + travelType.slice(1)}
              </Text>
            </View>
            <ChevronDown size={20} color={theme.colors.textSecondary} />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.optionButton}
            onPress={() => setShowSoundPicker(true)}
          >
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <Text style={styles.optionText}>
                Alarm Sound: {alarmSound.charAt(0).toUpperCase() + alarmSound.slice(1)}
              </Text>
            </View>
            <ChevronDown size={20} color={theme.colors.textSecondary} />
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Stops</Text>
          
          <View style={styles.stopsContainer}>
            {stops.map((stop, index) => (
              <View key={stop.id} style={styles.stopItem}>
                <View style={styles.stopNumber}>
                  <Text style={styles.stopNumberText}>{index + 1}</Text>
                </View>
                <View style={styles.stopInfo}>
                  <Text style={styles.stopName}>{stop.location.name}</Text>
                  <Text style={styles.stopAddress}>{stop.location.address}</Text>
                </View>
                <View style={styles.stopActions}>
                  <TouchableOpacity
                    style={styles.stopAction}
                    onPress={() => handleEditStop(index)}
                  >
                    <MapPin size={20} color={theme.colors.primary} />
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.stopAction}
                    onPress={() => handleRemoveStop(index)}
                  >
                    <Trash2 size={20} color={theme.colors.error} />
                  </TouchableOpacity>
                </View>
              </View>
            ))}
          </View>

          <TouchableOpacity
            style={styles.addStopButton}
            onPress={handleAddStop}
          >
            <Plus size={20} color={theme.colors.primary} />
            <Text style={styles.addStopText}>Add Stop</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          style={[styles.createButton, isLoading && { opacity: 0.7 }]}
          onPress={handleCreateTrip}
          disabled={isLoading || stops.length === 0}
        >
          {isLoading ? (
            <ActivityIndicator color="#FFFFFF" />
          ) : (
            <Text style={styles.createButtonText}>Create Trip</Text>
          )}
        </TouchableOpacity>
      </ScrollView>

      <LocationPicker
        visible={showLocationPicker}
        onClose={() => {
          setShowLocationPicker(false);
          setCurrentStopIndex(-1);
        }}
        onSelectLocation={handleSelectLocation}
      />

      <DateTimePicker
        visible={showDatePicker}
        value={startDate}
        mode="date"
        onClose={() => setShowDatePicker(false)}
        onChange={(date) => {
          if (date) {
            const newDate = new Date(date);
            newDate.setHours(startDate.getHours(), startDate.getMinutes());
            setStartDate(newDate);
          }
          setShowDatePicker(false);
        }}
      />

      <DateTimePicker
        visible={showTimePicker}
        value={startDate}
        mode="time"
        onClose={() => setShowTimePicker(false)}
        onChange={(date) => {
          if (date) {
            const newDate = new Date(startDate);
            newDate.setHours(date.getHours(), date.getMinutes());
            setStartDate(newDate);
          }
          setShowTimePicker(false);
        }}
      />

      <TravelTypeSelector
        visible={showTravelTypePicker}
        onClose={() => setShowTravelTypePicker(false)}
        selectedType={travelType}
        onSelectType={(type) => {
          setTravelType(type);
          setShowTravelTypePicker(false);
        }}
      />

      <SoundPicker
        visible={showSoundPicker}
        onClose={() => setShowSoundPicker(false)}
        selectedSound={alarmSound}
        onSelectSound={(sound) => {
          setAlarmSound(sound);
          setShowSoundPicker(false);
        }}
      />
    </SafeAreaView>
  );
}