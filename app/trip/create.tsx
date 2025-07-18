import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TextInput,
  useColorScheme,
  TouchableOpacity,
} from "react-native";
import { useRouter } from "expo-router";
import { Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { MapPreview } from "@/components/home/MapPreview";
import Colors from "@/constants/colors";
import { FONT_SIZE, FONT_WEIGHT, SPACING, RADIUS } from "@/constants/theme";
import { createTrip } from '../../utils/api';

export default function CreateTripScreen() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme === "dark" ? "dark" : "light"];
  const router = useRouter();

  const [tripName, setTripName] = useState("");
  const [travelMode, setTravelMode] = useState("car");
  const [startLocation, setStartLocation] = useState("");
  const [endLocation, setEndLocation] = useState("");
  const [stops, setStops] = useState<Array<{ name: string; radius: number }>>([]);
  const [currentStep, setCurrentStep] = useState(1);

  const travelModes = [];

  const addStop = () => {
    setStops([...stops, { name: "", radius: 500 }]);
  };

  const removeStop = (index: number) => {
    const newStops = [...stops];
    newStops.splice(index, 1);
    setStops(newStops);
  };

  const updateStopName = (index: number, name: string) => {
    const newStops = [...stops];
    newStops[index].name = name;
    setStops(newStops);
  };

  const updateStopRadius = (index: number, radius: number) => {
    const newStops = [...stops];
    newStops[index].radius = radius;
    setStops(newStops);
  };

  const handleNext = () => {
    setCurrentStep(currentStep + 1);
  };

  const handleBack = () => {
    setCurrentStep(currentStep - 1);
  };

  const handleSaveTrip = async () => {
    const tripData = {
      name: tripName,
      travelMode,
      startLocation,
      endLocation,
      stops,
    };
    await createTrip(tripData);
    router.replace("/(tabs)");
  };

  const renderStep1 = () => {
    return (
      <>
        <Text
          style={[
            styles.stepTitle,
            {
              color: colors.text,
            },
          ]}
        >
          Trip Details
        </Text>

        <Card variant="outlined" style={styles.card}>
          <Text
            style={[
              styles.inputLabel,
              {
                color: colors.text,
              },
            ]}
          >
            Trip Name
          </Text>
          <TextInput
            style={[
              styles.input,
              {
                color: colors.text,
                borderColor: colors.border,
                backgroundColor: colors.card,
              },
            ]}
            placeholder="Enter trip name"
            placeholderTextColor={colors.subtext}
            value={tripName}
            onChangeText={setTripName}
          />

          <Text
            style={[
              styles.inputLabel,
              {
                color: colors.text,
                marginTop: SPACING.md,
              },
            ]}
          >
            Travel Mode
          </Text>
          <View style={styles.travelModeContainer}>
            {travelModes.map((mode) => (
              <TouchableOpacity
                key={mode.id}
                style={[
                  styles.travelModeButton,
                  travelMode === mode.id && {
                    backgroundColor: colors.primary,
                  },
                  {
                    borderColor: colors.border,
                  },
                ]}
                onPress={() => setTravelMode(mode.id)}
              >
                {mode.icon}
              </TouchableOpacity>
            ))}
          </View>
        </Card>

        <View style={styles.buttonContainer}>
          <Button
            title="Next"
            variant="primary"
            onPress={handleNext}
            disabled={!tripName}
          />
        </View>
      </>
    );
  };

  const renderStep2 = () => {
    return (
      <>
        <Text
          style={[
            styles.stepTitle,
            {
              color: colors.text,
            },
          ]}
        >
          Locations
        </Text>

        <Card variant="outlined" style={styles.card}>
          <Text
            style={[
              styles.inputLabel,
              {
                color: colors.text,
              },
            ]}
          >
            Start Location
          </Text>
          <View style={styles.locationInputContainer}>
            <Feather name="map-pin" size={20} color={colors.primary} style={styles.locationIcon} />
            <TextInput
              style={[
                styles.locationInput,
                {
                  color: colors.text,
                  borderColor: colors.border,
                  backgroundColor: colors.card,
                },
              ]}
              placeholder="Enter start location"
              placeholderTextColor={colors.subtext}
              value={startLocation}
              onChangeText={setStartLocation}
            />
          </View>

          <Text
            style={[
              styles.inputLabel,
              {
                color: colors.text,
                marginTop: SPACING.md,
              },
            ]}
          >
            End Location
          </Text>
          <View style={styles.locationInputContainer}>
            <Feather name="map-pin" size={20} color={colors.secondary} style={styles.locationIcon} />
            <TextInput
              style={[
                styles.locationInput,
                {
                  color: colors.text,
                  borderColor: colors.border,
                  backgroundColor: colors.card,
                },
              ]}
              placeholder="Enter destination"
              placeholderTextColor={colors.subtext}
              value={endLocation}
              onChangeText={setEndLocation}
            />
          </View>
        </Card>

        <View style={styles.buttonContainer}>
          <Button
            title="Back"
            variant="outline"
            onPress={handleBack}
            style={{ marginRight: SPACING.md }}
          />
          <Button
            title="Next"
            variant="primary"
            onPress={handleNext}
            disabled={!startLocation || !endLocation}
          />
        </View>
      </>
    );
  };

  const renderStep3 = () => {
    return (
      <>
        <Text
          style={[
            styles.stepTitle,
            {
              color: colors.text,
            },
          ]}
        >
          Stops (Optional)
        </Text>

        <Card variant="outlined" style={styles.card}>
          {stops.map((stop, index) => (
            <View key={index} style={styles.stopContainer}>
              <View style={styles.stopHeader}>
                <Text
                  style={[
                    styles.stopNumber,
                    {
                      color: colors.text,
                    },
                  ]}
                >
                  Stop {index + 1}
                </Text>
                <TouchableOpacity onPress={() => removeStop(index)}>
                  <Feather name="minus-circle" size={20} color={colors.error} />
                </TouchableOpacity>
              </View>

              <View style={styles.locationInputContainer}>
                <Feather name="map-pin" size={20} color={colors.primary} style={styles.locationIcon} />
                <TextInput
                  style={[
                    styles.locationInput,
                    {
                      color: colors.text,
                      borderColor: colors.border,
                      backgroundColor: colors.card,
                    },
                  ]}
                  placeholder="Enter stop location"
                  placeholderTextColor={colors.subtext}
                  value={stop.name}
                  onChangeText={(text) => updateStopName(index, text)}
                />
              </View>

              <Text
                style={[
                  styles.radiusLabel,
                  {
                    color: colors.text,
                  },
                ]}
              >
                Alarm Radius: {stop.radius}m
              </Text>
              <View style={styles.radiusContainer}>
                <Text
                  style={[
                    styles.radiusValue,
                    {
                      color: colors.subtext,
                    },
                  ]}
                >
                  100m
                </Text>
                <View
                  style={[
                    styles.radiusSlider,
                    {
                      backgroundColor: colors.border,
                    },
                  ]}
                >
                  <View
                    style={[
                      styles.radiusSliderFill,
                      {
                        backgroundColor: colors.primary,
                        width: `${((stop.radius - 100) / 900) * 100}%`,
                      },
                    ]}
                  />
                </View>
                <Text
                  style={[
                    styles.radiusValue,
                    {
                      color: colors.subtext,
                    },
                  ]}
                >
                  1000m
                </Text>
              </View>
              <View style={styles.radiusButtonsContainer}>
                <TouchableOpacity
                  style={[
                    styles.radiusButton,
                    {
                      backgroundColor: colors.card,
                      borderColor: colors.border,
                    },
                  ]}
                  onPress={() => updateStopRadius(index, Math.max(100, stop.radius - 100))}
                >
                  <Text
                    style={[
                      styles.radiusButtonText,
                      {
                        color: colors.text,
                      },
                    ]}
                  >
                    -100m
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    styles.radiusButton,
                    {
                      backgroundColor: colors.card,
                      borderColor: colors.border,
                    },
                  ]}
                  onPress={() => updateStopRadius(index, Math.min(1000, stop.radius + 100))}
                >
                  <Text
                    style={[
                      styles.radiusButtonText,
                      {
                        color: colors.text,
                      },
                    ]}
                  >
                    +100m
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          ))}

          <TouchableOpacity
            style={[
              styles.addStopButton,
              {
                borderColor: colors.primary,
              },
            ]}
            onPress={addStop}
          >
            <Feather name="plus-circle" size={20} color={colors.primary} />
            <Text
              style={[
                styles.addStopText,
                {
                  color: colors.primary,
                },
              ]}
            >
              Add Stop
            </Text>
          </TouchableOpacity>
        </Card>

        <View style={styles.buttonContainer}>
          <Button
            title="Back"
            variant="outline"
            onPress={handleBack}
            style={{ marginRight: SPACING.md }}
          />
          <Button title="Next" variant="primary" onPress={handleNext} />
        </View>
      </>
    );
  };

  const renderStep4 = () => {
    return (
      <>
        <Text
          style={[
            styles.stepTitle,
            {
              color: colors.text,
            },
          ]}
        >
          Preview Route
        </Text>

        <MapPreview title="Route Preview" />

        <Card variant="outlined" style={styles.summaryCard}>
          <Text
            style={[
              styles.summaryTitle,
              {
                color: colors.text,
              },
            ]}
          >
            Trip Summary
          </Text>
          <View style={styles.summaryItem}>
            <Text
              style={[
                styles.summaryLabel,
                {
                  color: colors.subtext,
                },
              ]}
            >
              Name:
            </Text>
            <Text
              style={[
                styles.summaryValue,
                {
                  color: colors.text,
                },
              ]}
            >
              {tripName}
            </Text>
          </View>
          <View style={styles.summaryItem}>
            <Text
              style={[
                styles.summaryLabel,
                {
                  color: colors.subtext,
                },
              ]}
            >
              Travel Mode:
            </Text>
            <Text
              style={[
                styles.summaryValue,
                {
                  color: colors.text,
                },
              ]}
            >
              {travelMode.charAt(0).toUpperCase() + travelMode.slice(1)}
            </Text>
          </View>
          <View style={styles.summaryItem}>
            <Text
              style={[
                styles.summaryLabel,
                {
                  color: colors.subtext,
                },
              ]}
            >
              From:
            </Text>
            <Text
              style={[
                styles.summaryValue,
                {
                  color: colors.text,
                },
              ]}
            >
              {startLocation}
            </Text>
          </View>
          <View style={styles.summaryItem}>
            <Text
              style={[
                styles.summaryLabel,
                {
                  color: colors.subtext,
                },
              ]}
            >
              To:
            </Text>
            <Text
              style={[
                styles.summaryValue,
                {
                  color: colors.text,
                },
              ]}
            >
              {endLocation}
            </Text>
          </View>
          <View style={styles.summaryItem}>
            <Text
              style={[
                styles.summaryLabel,
                {
                  color: colors.subtext,
                },
              ]}
            >
              Stops:
            </Text>
            <Text
              style={[
                styles.summaryValue,
                {
                  color: colors.text,
                },
              ]}
            >
              {stops.length}
            </Text>
          </View>
        </Card>

        <View style={styles.buttonContainer}>
          <Button
            title="Back"
            variant="outline"
            onPress={handleBack}
            style={{ marginRight: SPACING.md }}
          />
          <Button
            title="Save & Start Trip"
            variant="primary"
            onPress={handleSaveTrip}
          />
        </View>
      </>
    );
  };

  return (
    <ScrollView
      style={[
        styles.container,
        {
          backgroundColor: colors.background,
        },
      ]}
      contentContainerStyle={styles.contentContainer}
    >
      <View style={styles.progressContainer}>
        {[1, 2, 3, 4].map((step) => (
          <View
            key={step}
            style={[
              styles.progressStep,
              {
                backgroundColor:
                  step <= currentStep ? colors.primary : colors.border,
              },
            ]}
          />
        ))}
      </View>

      {currentStep === 1 && renderStep1()}
      {currentStep === 2 && renderStep2()}
      {currentStep === 3 && renderStep3()}
      {currentStep === 4 && renderStep4()}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    padding: SPACING.md,
    paddingBottom: SPACING.xxl,
  },
  progressContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: SPACING.lg,
  },
  progressStep: {
    height: 4,
    flex: 1,
    marginHorizontal: 2,
    borderRadius: 2,
  },
  stepTitle: {
    fontSize: FONT_SIZE.xl,
    fontWeight: FONT_WEIGHT.bold,
    marginBottom: SPACING.md,
  },
  card: {
    marginBottom: SPACING.md,
  },
  inputLabel: {
    fontSize: FONT_SIZE.md,
    fontWeight: FONT_WEIGHT.medium,
    marginBottom: SPACING.sm,
  },
  input: {
    borderWidth: 1,
    borderRadius: RADIUS.md,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    fontSize: FONT_SIZE.md,
  },
  travelModeContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  travelModeButton: {
    width: 60,
    height: 60,
    borderRadius: RADIUS.md,
    borderWidth: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  locationInputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderRadius: RADIUS.md,
    paddingHorizontal: SPACING.md,
  },
  locationIcon: {
    marginRight: SPACING.sm,
  },
  locationInput: {
    flex: 1,
    paddingVertical: SPACING.sm,
    fontSize: FONT_SIZE.md,
  },
  stopContainer: {
    marginBottom: SPACING.md,
    paddingBottom: SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: "#EEEEEE",
  },
  stopHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: SPACING.sm,
  },
  stopNumber: {
    fontSize: FONT_SIZE.md,
    fontWeight: FONT_WEIGHT.semibold,
  },
  radiusLabel: {
    fontSize: FONT_SIZE.md,
    fontWeight: FONT_WEIGHT.medium,
    marginTop: SPACING.md,
    marginBottom: SPACING.sm,
  },
  radiusContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: SPACING.sm,
  },
  radiusValue: {
    fontSize: FONT_SIZE.sm,
    width: 50,
  },
  radiusSlider: {
    flex: 1,
    height: 6,
    borderRadius: 3,
    marginHorizontal: SPACING.sm,
  },
  radiusSliderFill: {
    height: 6,
    borderRadius: 3,
  },
  radiusButtonsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  radiusButton: {
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    borderRadius: RADIUS.md,
    borderWidth: 1,
  },
  radiusButtonText: {
    fontSize: FONT_SIZE.sm,
    fontWeight: FONT_WEIGHT.medium,
  },
  addStopButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: SPACING.md,
    borderWidth: 1,
    borderStyle: "dashed",
    borderRadius: RADIUS.md,
  },
  addStopText: {
    marginLeft: SPACING.sm,
    fontSize: FONT_SIZE.md,
    fontWeight: FONT_WEIGHT.medium,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginTop: SPACING.md,
  },
  summaryCard: {
    marginVertical: SPACING.md,
  },
  summaryTitle: {
    fontSize: FONT_SIZE.lg,
    fontWeight: FONT_WEIGHT.semibold,
    marginBottom: SPACING.md,
  },
  summaryItem: {
    flexDirection: "row",
    marginBottom: SPACING.sm,
  },
  summaryLabel: {
    fontSize: FONT_SIZE.md,
    width: 100,
  },
  summaryValue: {
    fontSize: FONT_SIZE.md,
    fontWeight: FONT_WEIGHT.medium,
    flex: 1,
  },
});