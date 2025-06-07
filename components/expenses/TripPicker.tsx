import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  FlatList,
} from "react-native";
import { useTheme } from "@/context/ThemeContext";
import { X, Check, Navigation } from "lucide-react-native";

interface TripPickerProps {
  visible: boolean;
  onClose: () => void;
  onSelectTrip: (tripId: string | null) => void;
  selectedTripId: string | null;
  trips: any[];
  allowClear?: boolean;
}

export const TripPicker: React.FC<TripPickerProps> = ({
  visible,
  onClose,
  onSelectTrip,
  selectedTripId,
  trips,
  allowClear = false,
}) => {
  const { theme } = useTheme();

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString(undefined, {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const styles = StyleSheet.create({
    modalContainer: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
    header: {
      flexDirection: "row",
      alignItems: "center",
      padding: 16,
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.border,
    },
    closeButton: {
      padding: 8,
    },
    title: {
      flex: 1,
      fontSize: 18,
      fontWeight: "600",
      color: theme.colors.text,
      textAlign: "center",
    },
    tripItem: {
      flexDirection: "row",
      alignItems: "center",
      padding: 16,
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.border,
    },
    tripIcon: {
      marginRight: 16,
    },
    tripInfo: {
      flex: 1,
    },
    tripName: {
      fontSize: 16,
      fontWeight: "500",
      color: theme.colors.text,
    },
    tripDate: {
      fontSize: 14,
      color: theme.colors.textSecondary,
      marginTop: 2,
    },
    selectedIcon: {
      width: 24,
      height: 24,
      borderRadius: 12,
      backgroundColor: theme.colors.primary,
      justifyContent: "center",
      alignItems: "center",
    },
    clearOption: {
      flexDirection: "row",
      alignItems: "center",
      padding: 16,
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.border,
    },
    clearText: {
      fontSize: 16,
      color: theme.colors.error,
    },
  });

  return (
    <Modal visible={visible} animationType="slide">
      <View style={styles.modalContainer}>
        <View style={styles.header}>
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <X size={24} color={theme.colors.text} />
          </TouchableOpacity>
          <Text style={styles.title}>Select Trip</Text>
          <View style={{ width: 40 }} />
        </View>

        <FlatList
          data={trips}
          keyExtractor={(item) => item.id}
          ListHeaderComponent={
            allowClear ? (
              <TouchableOpacity
                style={styles.clearOption}
                onPress={() => {
                  onSelectTrip(null);
                  onClose();
                }}
              >
                <Text style={styles.clearText}>No Trip (Clear Selection)</Text>
              </TouchableOpacity>
            ) : null
          }
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.tripItem}
              onPress={() => {
                onSelectTrip(item.id);
                onClose();
              }}
            >
              <Navigation
                size={24}
                color={theme.colors.primary}
                style={styles.tripIcon}
              />
              <View style={styles.tripInfo}>
                <Text style={styles.tripName}>{item.name}</Text>
                <Text style={styles.tripDate}>
                  {formatDate(item.startDate)}
                </Text>
              </View>
              {selectedTripId === item.id && (
                <View style={styles.selectedIcon}>
                  <Check size={16} color="#FFFFFF" />
                </View>
              )}
            </TouchableOpacity>
          )}
        />
      </View>
    </Modal>
  );
};