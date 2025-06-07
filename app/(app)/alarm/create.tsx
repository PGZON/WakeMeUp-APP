import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Switch,
  Platform,
  ActivityIndicator,
  Alert,
} from "react-native";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTheme } from "@/context/ThemeContext";
import { useAlarms } from "@/hooks/useAlarms";
import {
  MapPin,
  Bell,
  Vibrate,
  Volume2,
  MessageCircle,
  ChevronDown,
  Plus,
} from "lucide-react-native";
import { LocationPicker } from "@/components/alarms/LocationPicker";
import { SliderInput } from "@/components/common/SliderInput";
import { SoundPicker } from "@/components/alarms/SoundPicker";

export default function CreateAlarmScreen() {
  const router = useRouter();
  const { theme } = useTheme();
  const { createAlarm } = useAlarms();
  const [isLoading, setIsLoading] = useState(false);
  const [showLocationPicker, setShowLocationPicker] = useState(false);
  const [showSoundPicker, setShowSoundPicker] = useState(false);

  // Alarm state
  const [name, setName] = useState("");
  const [location, setLocation] = useState<any>(null);
  const [radius, setRadius] = useState(500); // meters
  const [sound, setSound] = useState("default");
  const [vibration, setVibration] = useState(true);
  const [message, setMessage] = useState("You've reached your destination!");
  const [active, setActive] = useState(true);
  const [volume, setVolume] = useState(0.8); // Add volume state with default value

  const handleCreateAlarm = async () => {
    if (!name.trim()) {
      Alert.alert("Error", "Please enter an alarm name");
      return;
    }

    if (!location) {
      Alert.alert("Error", "Please select a location");
      return;
    }

    try {
      setIsLoading(true);
      await createAlarm({
        name: name.trim(),
        location,
        radius,
        sound,
        vibration,
        message,
        active,
      });
      router.back();
    } catch (error) {
      console.error("Error creating alarm:", error);
      Alert.alert("Error", "Failed to create alarm. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectLocation = (selectedLocation: any) => {
    setLocation(selectedLocation);
    setShowLocationPicker(false);
  };

  const handleSelectSound = (selectedSound: string) => {
    setSound(selectedSound);
    setShowSoundPicker(false);
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
    locationButton: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      backgroundColor: theme.colors.card,
      borderRadius: 12,
      padding: 16,
      marginBottom: 8,
    },
    locationPlaceholder: {
      fontSize: 16,
      color: theme.colors.textSecondary,
    },
    locationText: {
      fontSize: 16,
      color: theme.colors.text,
    },
    settingRow: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      backgroundColor: theme.colors.card,
      borderRadius: 12,
      padding: 16,
      marginBottom: 8,
    },
    settingLabel: {
      fontSize: 16,
      color: theme.colors.text,
    },
    soundButton: {
      flexDirection: "row",
      alignItems: "center",
    },
    soundText: {
      fontSize: 16,
      color: theme.colors.primary,
      marginRight: 4,
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
    sliderContainer: {
      backgroundColor: theme.colors.card,
      borderRadius: 12,
      padding: 16,
      marginBottom: 8,
    },
    sliderLabel: {
      flexDirection: "row",
      justifyContent: "space-between",
      marginBottom: 8,
    },
    sliderLabelText: {
      fontSize: 16,
      color: theme.colors.text,
    },
    sliderValue: {
      fontSize: 16,
      color: theme.colors.primary,
      fontWeight: "500",
    },
  });

  return (
    <SafeAreaView style={styles.container} edges={["bottom"]}>
      <ScrollView style={styles.content}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Alarm Details</Text>
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Alarm Name</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter alarm name"
              placeholderTextColor={theme.colors.textSecondary}
              value={name}
              onChangeText={setName}
            />
          </View>

          <TouchableOpacity
            style={styles.locationButton}
            onPress={() => setShowLocationPicker(true)}
          >
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <MapPin
                size={20}
                color={location ? theme.colors.primary : theme.colors.textSecondary}
                style={{ marginRight: 8 }}
              />
              {location ? (
                <Text style={styles.locationText}>{location.name}</Text>
              ) : (
                <Text style={styles.locationPlaceholder}>Select Location</Text>
              )}
            </View>
            <ChevronDown size={20} color={theme.colors.textSecondary} />
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Alarm Settings</Text>
          
          <View style={styles.sliderContainer}>
            <View style={styles.sliderLabel}>
              <Text style={styles.sliderLabelText}>Alarm Radius</Text>
              <Text style={styles.sliderValue}>
                {radius >= 1000 ? `${(radius / 1000).toFixed(1)} km` : `${radius} m`}
              </Text>
            </View>
            <SliderInput
              value={radius}
              minimumValue={100}
              maximumValue={5000}
              step={100}
              onValueChange={setRadius}
              minimumTrackTintColor={theme.colors.primary}
              maximumTrackTintColor={theme.colors.border}
            />
          </View>

          <TouchableOpacity
            style={styles.settingRow}
            onPress={() => setShowSoundPicker(true)}
          >
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <Bell
                size={20}
                color={theme.colors.primary}
                style={{ marginRight: 8 }}
              />
              <Text style={styles.settingLabel}>Alarm Sound</Text>
            </View>
            <View style={styles.soundButton}>
              <Text style={styles.soundText}>
                {sound === "default" ? "Default" : sound}
              </Text>
              <ChevronDown size={20} color={theme.colors.primary} />
            </View>
          </TouchableOpacity>

          <View style={styles.settingRow}>
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <Vibrate
                size={20}
                color={theme.colors.primary}
                style={{ marginRight: 8 }}
              />
              <Text style={styles.settingLabel}>Vibration</Text>
            </View>
            <Switch
              value={vibration}
              onValueChange={setVibration}
              trackColor={{
                false: theme.colors.border,
                true: theme.colors.primary,
              }}
              thumbColor={Platform.OS === "ios" ? undefined : theme.colors.card}
            />
          </View>

          <View style={styles.sliderContainer}>
            <View style={styles.sliderLabel}>
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <Volume2
                  size={20}
                  color={theme.colors.primary}
                  style={{ marginRight: 8 }}
                />
                <Text style={styles.sliderLabelText}>Volume</Text>
              </View>
              <Text style={styles.sliderValue}>{Math.round(volume * 100)}%</Text>
            </View>
            <SliderInput
              value={volume}
              minimumValue={0}
              maximumValue={1}
              step={0.1}
              onValueChange={setVolume}
              minimumTrackTintColor={theme.colors.primary}
              maximumTrackTintColor={theme.colors.border}
            />
          </View>

          <View style={styles.inputContainer}>
            <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 8 }}>
              <MessageCircle
                size={20}
                color={theme.colors.primary}
                style={{ marginRight: 8 }}
              />
              <Text style={styles.inputLabel}>Notification Text</Text>
            </View>
            <TextInput
              style={styles.input}
              placeholder="Enter notification text"
              placeholderTextColor={theme.colors.textSecondary}
              value={message}
              onChangeText={setMessage}
              multiline
            />
          </View>
        </View>

        <TouchableOpacity
          style={[styles.createButton, isLoading && { opacity: 0.7 }]}
          onPress={handleCreateAlarm}
          disabled={isLoading}
        >
          {isLoading ? (
            <ActivityIndicator color="#FFFFFF" />
          ) : (
            <Text style={styles.createButtonText}>Create Alarm</Text>
          )}
        </TouchableOpacity>
      </ScrollView>

      <LocationPicker
        visible={showLocationPicker}
        onClose={() => setShowLocationPicker(false)}
        onSelectLocation={handleSelectLocation}
      />

      <SoundPicker
        visible={showSoundPicker}
        onClose={() => setShowSoundPicker(false)}
        onSelectSound={handleSelectSound}
        selectedSound={sound}
      />
    </SafeAreaView>
  );
}