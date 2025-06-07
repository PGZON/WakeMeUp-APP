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
import { X, Check, Car, Bus, Train, Plane, Bike } from "lucide-react-native";

interface TravelTypeSelectorProps {
  visible: boolean;
  onClose: () => void;
  onSelectType: (type: string) => void;
  selectedType: string;
}

export const TravelTypeSelector: React.FC<TravelTypeSelectorProps> = ({
  visible,
  onClose,
  onSelectType,
  selectedType,
}) => {
  const { theme } = useTheme();

  const travelTypes = [
    { id: "car", name: "Car", icon: <Car size={24} color={theme.colors.primary} /> },
    { id: "bus", name: "Bus", icon: <Bus size={24} color={theme.colors.primary} /> },
    { id: "train", name: "Train", icon: <Train size={24} color={theme.colors.primary} /> },
    { id: "plane", name: "Airplane", icon: <Plane size={24} color={theme.colors.primary} /> },
    { id: "bike", name: "Bike", icon: <Bike size={24} color={theme.colors.primary} /> },
  ];

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
    typeItem: {
      flexDirection: "row",
      alignItems: "center",
      padding: 16,
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.border,
    },
    typeIcon: {
      marginRight: 16,
    },
    typeName: {
      flex: 1,
      fontSize: 16,
      color: theme.colors.text,
    },
    selectedIcon: {
      width: 24,
      height: 24,
      borderRadius: 12,
      backgroundColor: theme.colors.primary,
      justifyContent: "center",
      alignItems: "center",
    },
  });

  return (
    <Modal visible={visible} animationType="slide">
      <View style={styles.modalContainer}>
        <View style={styles.header}>
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <X size={24} color={theme.colors.text} />
          </TouchableOpacity>
          <Text style={styles.title}>Select Travel Mode</Text>
          <View style={{ width: 40 }} />
        </View>

        <FlatList
          data={travelTypes}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.typeItem}
              onPress={() => onSelectType(item.id)}
            >
              <View style={styles.typeIcon}>{item.icon}</View>
              <Text style={styles.typeName}>{item.name}</Text>
              {selectedType === item.id && (
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