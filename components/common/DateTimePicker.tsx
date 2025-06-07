import React, { useState } from "react";
import {
  View,
  Platform,
  TouchableOpacity,
  Text,
  StyleSheet,
} from "react-native";
import { useTheme } from "@/context/ThemeContext";
import RNDateTimePicker from "@react-native-community/datetimepicker";

interface DateTimePickerProps {
  value: Date;
  mode: "date" | "time";
  onChange: (event: any, date?: Date) => void;
  display?: string;
}

export const DateTimePicker: React.FC<DateTimePickerProps> = ({
  value,
  mode,
  onChange,
  display = "default",
}) => {
  const { theme } = useTheme();
  const [showPicker, setShowPicker] = useState(Platform.OS === "ios");

  const handleChange = (event: any, selectedDate?: Date) => {
    if (Platform.OS === "android") {
      setShowPicker(false);
    }
    onChange(event, selectedDate);
  };

  const styles = StyleSheet.create({
    container: {
      backgroundColor: theme.colors.card,
      borderRadius: 12,
      padding: 16,
      margin: 16,
    },
    header: {
      flexDirection: "row",
      justifyContent: "space-between",
      marginBottom: 16,
    },
    title: {
      fontSize: 18,
      fontWeight: "600",
      color: theme.colors.text,
    },
    buttonContainer: {
      flexDirection: "row",
      justifyContent: "space-between",
      marginTop: 16,
    },
    button: {
      paddingVertical: 8,
      paddingHorizontal: 16,
      borderRadius: 8,
    },
    cancelButton: {
      backgroundColor: theme.colors.backgroundSecondary,
    },
    confirmButton: {
      backgroundColor: theme.colors.primary,
    },
    buttonText: {
      fontSize: 16,
      fontWeight: "500",
    },
    cancelButtonText: {
      color: theme.colors.text,
    },
    confirmButtonText: {
      color: "#FFFFFF",
    },
  });

  if (Platform.OS === "android") {
    if (!showPicker) {
      return null;
    }

    return (
      <RNDateTimePicker
        value={value}
        mode={mode}
        onChange={handleChange}
        display={display as any}
      />
    );
  }

  // iOS
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>
          {mode === "date" ? "Select Date" : "Select Time"}
        </Text>
      </View>
      <RNDateTimePicker
        value={value}
        mode={mode}
        onChange={handleChange}
        display={display as any}
        textColor={theme.colors.text}
      />
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[styles.button, styles.cancelButton]}
          onPress={() => onChange({ type: "dismissed" })}
        >
          <Text style={[styles.buttonText, styles.cancelButtonText]}>
            Cancel
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.button, styles.confirmButton]}
          onPress={() => onChange({ type: "set" }, value)}
        >
          <Text style={[styles.buttonText, styles.confirmButtonText]}>
            Confirm
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};