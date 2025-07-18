import React, { useState } from "react";
import { StyleSheet, Text, View, ScrollView, useColorScheme, Switch, TouchableOpacity } from "react-native";
import { useColorSchemeStore } from "@/hooks/useColorScheme";
import { Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import Colors from "@/constants/colors";
import { FONT_SIZE, FONT_WEIGHT, SPACING } from "@/constants/theme";

export default function SettingsScreen() {
  const systemColorScheme = useColorScheme();
  const { colorScheme, setColorScheme } = useColorSchemeStore();
  const colors = Colors[systemColorScheme === "dark" ? "dark" : "light"];

  // User settings are stored in local state. Persist to backend if/when supported.
  const [defaultTravelMode, setDefaultTravelMode] = useState("car");
  const [defaultAlarmTone, setDefaultAlarmTone] = useState("chime");
  const [vibrationEnabled, setVibrationEnabled] = useState(true);
  const [currency, setCurrency] = useState("USD");
  const [units, setUnits] = useState("mi");

  const travelModes = [
    { id: "car", label: "Car" },
    { id: "train", label: "Train" },
    { id: "bus", label: "Bus" },
    { id: "plane", label: "Plane" },
    { id: "walk", label: "Walk" },
  ];

  const alarmTones = [
    { id: "chime", label: "Chime" },
    { id: "bell", label: "Bell" },
    { id: "digital", label: "Digital" },
    { id: "nature", label: "Nature" },
  ];

  const currencies = [
    { id: "USD", label: "USD ($)" },
    { id: "EUR", label: "EUR (€)" },
    { id: "GBP", label: "GBP (£)" },
    { id: "JPY", label: "JPY (¥)" },
  ];

  const handleClearCache = () => {
    // In a real app, this would clear the cache
    alert("Cache cleared");
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
      <Text
        style={[
          styles.title,
          {
            color: colors.text,
          },
        ]}
      >
        Settings
      </Text>

      <Text
        style={[
          styles.sectionTitle,
          {
            color: colors.text,
          },
        ]}
      >
        Appearance
      </Text>
      <Card variant="outlined" style={styles.card}>
        <View style={styles.settingRow}>
          <View style={styles.settingLabelContainer}>
            {colorScheme === "dark" ? (
              <Feather name="moon" size={20} color={colors.primary} />
            ) : (
              <Feather name="sun" size={20} color={colors.primary} />
            )}
            <Text
              style={[
                styles.settingLabel,
                {
                  color: colors.text,
                },
              ]}
            >
              Dark Mode
            </Text>
          </View>
          <View style={styles.themeSelector}>
            <TouchableOpacity
              style={[
                styles.themeButton,
                colorScheme === "light" && {
                  backgroundColor: colors.primary,
                },
              ]}
              onPress={() => setColorScheme("light")}
            >
              <Text
                style={[
                  styles.themeButtonText,
                  {
                    color: colorScheme === "light" ? "#FFFFFF" : colors.text,
                  },
                ]}
              >
                Light
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.themeButton,
                colorScheme === "system" && {
                  backgroundColor: colors.primary,
                },
              ]}
              onPress={() => setColorScheme("system")}
            >
              <Text
                style={[
                  styles.themeButtonText,
                  {
                    color: colorScheme === "system" ? "#FFFFFF" : colors.text,
                  },
                ]}
              >
                Auto
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.themeButton,
                colorScheme === "dark" && {
                  backgroundColor: colors.primary,
                },
              ]}
              onPress={() => setColorScheme("dark")}
            >
              <Text
                style={[
                  styles.themeButtonText,
                  {
                    color: colorScheme === "dark" ? "#FFFFFF" : colors.text,
                  },
                ]}
              >
                Dark
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Card>

      <Text
        style={[
          styles.sectionTitle,
          {
            color: colors.text,
          },
        ]}
      >
        Trip Preferences
      </Text>
      <Card variant="outlined" style={styles.card}>
        <View style={styles.settingRow}>
          <View style={styles.settingLabelContainer}>
            <Feather name="smartphone" size={20} color={colors.primary} />
            <Text
              style={[
                styles.settingLabel,
                {
                  color: colors.text,
                },
              ]}
            >
              Default Travel Mode
            </Text>
          </View>
          <View style={styles.optionsContainer}>
            {travelModes.map((mode) => (
              <TouchableOpacity
                key={mode.id}
                style={[
                  styles.optionButton,
                  defaultTravelMode === mode.id && {
                    backgroundColor: colors.primary,
                  },
                  {
                    borderColor: colors.border,
                  },
                ]}
                onPress={() => setDefaultTravelMode(mode.id)}
              >
                <Text
                  style={[
                    styles.optionButtonText,
                    {
                      color:
                        defaultTravelMode === mode.id
                          ? "#FFFFFF"
                          : colors.text,
                    },
                  ]}
                >
                  {mode.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </Card>

      <Text
        style={[
          styles.sectionTitle,
          {
            color: colors.text,
          },
        ]}
      >
        Alarm Settings
      </Text>
      <Card variant="outlined" style={styles.card}>
        <View style={styles.settingRow}>
          <View style={styles.settingLabelContainer}>
            <Feather name="volume-2" size={20} color={colors.primary} />
            <Text
              style={[
                styles.settingLabel,
                {
                  color: colors.text,
                },
              ]}
            >
              Default Alarm Tone
            </Text>
          </View>
          <View style={styles.optionsContainer}>
            {alarmTones.map((tone) => (
              <TouchableOpacity
                key={tone.id}
                style={[
                  styles.optionButton,
                  defaultAlarmTone === tone.id && {
                    backgroundColor: colors.primary,
                  },
                  {
                    borderColor: colors.border,
                  },
                ]}
                onPress={() => setDefaultAlarmTone(tone.id)}
              >
                <Text
                  style={[
                    styles.optionButtonText,
                    {
                      color:
                        defaultAlarmTone === tone.id
                          ? "#FFFFFF"
                          : colors.text,
                    },
                  ]}
                >
                  {tone.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.settingRow}>
          <View style={styles.settingLabelContainer}>
            <MaterialCommunityIcons name="vibrate" size={20} color={colors.primary} />
            <Text
              style={[
                styles.settingLabel,
                {
                  color: colors.text,
                },
              ]}
            >
              Vibration
            </Text>
          </View>
          <Switch
            value={vibrationEnabled}
            onValueChange={setVibrationEnabled}
            trackColor={{ false: "#767577", true: colors.primary }}
            thumbColor="#FFFFFF"
          />
        </View>
      </Card>

      <Text
        style={[
          styles.sectionTitle,
          {
            color: colors.text,
          },
        ]}
      >
        Regional Settings
      </Text>
      <Card variant="outlined" style={styles.card}>
        <View style={styles.settingRow}>
          <View style={styles.settingLabelContainer}>
            <Feather name="dollar-sign" size={20} color={colors.primary} />
            <Text
              style={[
                styles.settingLabel,
                {
                  color: colors.text,
                },
              ]}
            >
              Currency
            </Text>
          </View>
          <View style={styles.optionsContainer}>
            {currencies.map((curr) => (
              <TouchableOpacity
                key={curr.id}
                style={[
                  styles.optionButton,
                  currency === curr.id && {
                    backgroundColor: colors.primary,
                  },
                  {
                    borderColor: colors.border,
                  },
                ]}
                onPress={() => setCurrency(curr.id)}
              >
                <Text
                  style={[
                    styles.optionButtonText,
                    {
                      color:
                        currency === curr.id ? "#FFFFFF" : colors.text,
                    },
                  ]}
                >
                  {curr.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.settingRow}>
          <View style={styles.settingLabelContainer}>
            <Feather name="globe" size={20} color={colors.primary} />
            <Text
              style={[
                styles.settingLabel,
                {
                  color: colors.text,
                },
              ]}
            >
              Distance Units
            </Text>
          </View>
          <View style={styles.unitsSelector}>
            <TouchableOpacity
              style={[
                styles.unitButton,
                units === "km" && {
                  backgroundColor: colors.primary,
                },
                {
                  borderColor: colors.border,
                },
              ]}
              onPress={() => setUnits("km")}
            >
              <Text
                style={[
                  styles.unitButtonText,
                  {
                    color: units === "km" ? "#FFFFFF" : colors.text,
                  },
                ]}
              >
                Kilometers
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.unitButton,
                units === "mi" && {
                  backgroundColor: colors.primary,
                },
                {
                  borderColor: colors.border,
                },
              ]}
              onPress={() => setUnits("mi")}
            >
              <Text
                style={[
                  styles.unitButtonText,
                  {
                    color: units === "mi" ? "#FFFFFF" : colors.text,
                  },
                ]}
              >
                Miles
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Card>

      <Text
        style={[
          styles.sectionTitle,
          {
            color: colors.text,
          },
        ]}
      >
        Data Management
      </Text>
      <Card variant="outlined" style={styles.card}>
        <Button
          title="Clear Cache"
          variant="outline"
          leftIcon={<Feather name="trash" size={16} color={colors.error} />}
          style={[
            styles.dangerButton,
            {
              borderColor: colors.error,
            },
          ]}
          onPress={handleClearCache}
        />
      </Card>

      <Text
        style={[
          styles.versionText,
          {
            color: colors.subtext,
          },
        ]}
      >
        WakeMeUp v1.0.0
      </Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    paddingBottom: SPACING.xl,
  },
  title: {
    fontSize: FONT_SIZE.xxl,
    fontWeight: FONT_WEIGHT.bold,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.md,
  },
  sectionTitle: {
    fontSize: FONT_SIZE.lg,
    fontWeight: FONT_WEIGHT.semibold,
    marginHorizontal: SPACING.md,
    marginTop: SPACING.lg,
    marginBottom: SPACING.xs,
  },
  card: {
    marginHorizontal: SPACING.md,
  },
  settingRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: SPACING.sm,
  },
  settingLabelContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  settingLabel: {
    fontSize: FONT_SIZE.md,
    marginLeft: SPACING.sm,
  },
  themeSelector: {
    flexDirection: "row",
    borderRadius: 8,
    overflow: "hidden",
  },
  themeButton: {
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
  },
  themeButtonText: {
    fontSize: FONT_SIZE.sm,
    fontWeight: FONT_WEIGHT.medium,
  },
  optionsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "flex-end",
    maxWidth: "60%",
  },
  optionButton: {
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.xs,
    borderRadius: 8,
    marginLeft: SPACING.xs,
    marginBottom: SPACING.xs,
    borderWidth: 1,
  },
  optionButtonText: {
    fontSize: FONT_SIZE.xs,
    fontWeight: FONT_WEIGHT.medium,
  },
  unitsSelector: {
    flexDirection: "row",
  },
  unitButton: {
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.xs,
    borderRadius: 8,
    marginLeft: SPACING.xs,
    borderWidth: 1,
  },
  unitButtonText: {
    fontSize: FONT_SIZE.xs,
    fontWeight: FONT_WEIGHT.medium,
  },
  dangerButton: {
    borderWidth: 1,
  },
  versionText: {
    textAlign: "center",
    marginTop: SPACING.xl,
    fontSize: FONT_SIZE.sm,
  },
});