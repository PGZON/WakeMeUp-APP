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
import { X, Check, Tag } from "lucide-react-native";

interface CategoryPickerProps {
  visible: boolean;
  onClose: () => void;
  onSelectCategory: (category: string) => void;
  selectedCategory: string;
}

export const CategoryPicker: React.FC<CategoryPickerProps> = ({
  visible,
  onClose,
  onSelectCategory,
  selectedCategory,
}) => {
  const { theme } = useTheme();

  const categories = [
    "Food",
    "Transportation",
    "Accommodation",
    "Shopping",
    "Entertainment",
    "Sightseeing",
    "Health",
    "Gifts",
    "Other",
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
    categoryItem: {
      flexDirection: "row",
      alignItems: "center",
      padding: 16,
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.border,
    },
    categoryIcon: {
      marginRight: 16,
    },
    categoryName: {
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
          <Text style={styles.title}>Select Category</Text>
          <View style={{ width: 40 }} />
        </View>

        <FlatList
          data={categories}
          keyExtractor={(item) => item}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.categoryItem}
              onPress={() => onSelectCategory(item)}
            >
              <Tag
                size={24}
                color={theme.colors.primary}
                style={styles.categoryIcon}
              />
              <Text style={styles.categoryName}>{item}</Text>
              {selectedCategory === item && (
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