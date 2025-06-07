import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, Switch, Platform } from "react-native";
import { useTheme } from "@/context/ThemeContext";
import { Bell, MapPin, Edit, Trash2 } from "lucide-react-native";

interface AlarmCardProps {
  alarm: any;
  onToggle: (isActive: boolean) => void;
  onEdit: () => void;
  onDelete: () => void;
}

export const AlarmCard: React.FC<AlarmCardProps> = ({
  alarm,
  onToggle,
  onEdit,
  onDelete,
}) => {
  const { theme } = useTheme();

  const formatRadius = (meters: number) => {
    return meters >= 1000 ? `${(meters / 1000).toFixed(1)} km` : `${meters} m`;
  };

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
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: 12,
    },
    title: {
      fontSize: 18,
      fontWeight: "600",
      color: theme.colors.text,
    },
    locationContainer: {
      flexDirection: "row",
      alignItems: "center",
      marginBottom: 16,
    },
    locationText: {
      fontSize: 14,
      color: theme.colors.textSecondary,
      marginLeft: 8,
    },
    detailsContainer: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      backgroundColor: theme.colors.backgroundSecondary,
      borderRadius: 12,
      padding: 12,
      marginBottom: 16,
    },
    detailItem: {
      alignItems: "center",
    },
    detailLabel: {
      fontSize: 12,
      color: theme.colors.textSecondary,
      marginBottom: 4,
    },
    detailValue: {
      fontSize: 14,
      fontWeight: "500",
      color: theme.colors.text,
    },
    actionsContainer: {
      flexDirection: "row",
      justifyContent: "flex-end",
    },
    actionButton: {
      padding: 8,
      marginLeft: 8,
    },
  });

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>{alarm.name}</Text>
        <Switch
          value={alarm.isActive}
          onValueChange={onToggle}
          trackColor={{
            false: theme.colors.border,
            true: theme.colors.primary,
          }}
          thumbColor={Platform.OS === "ios" ? undefined : theme.colors.card}
        />
      </View>

      <View style={styles.locationContainer}>
        <MapPin size={16} color={theme.colors.primary} />
        <Text style={styles.locationText}>{alarm.location.name}</Text>
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

      <View style={styles.actionsContainer}>
        <TouchableOpacity style={styles.actionButton} onPress={onEdit}>
          <Edit size={20} color={theme.colors.primary} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionButton} onPress={onDelete}>
          <Trash2 size={20} color={theme.colors.error} />
        </TouchableOpacity>
      </View>
    </View>
  );
};