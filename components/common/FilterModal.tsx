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
import { X, Check } from "lucide-react-native";

interface FilterOption {
  label: string;
  value: string;
}

interface FilterModalProps {
  visible: boolean;
  onClose: () => void;
  options: FilterOption[];
  selectedValue: string;
  onSelect: (value: string) => void;
  title: string;
}

export const FilterModal: React.FC<FilterModalProps> = ({
  visible,
  onClose,
  options,
  selectedValue,
  onSelect,
  title,
}) => {
  const { theme } = useTheme();

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
    optionItem: {
      flexDirection: "row",
      alignItems: "center",
      padding: 16,
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.border,
    },
    optionLabel: {
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
          <Text style={styles.title}>{title}</Text>
          <View style={{ width: 40 }} />
        </View>

        <FlatList
          data={options}
          keyExtractor={(item) => item.value}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.optionItem}
              onPress={() => onSelect(item.value)}
            >
              <Text style={styles.optionLabel}>{item.label}</Text>
              {selectedValue === item.value && (
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