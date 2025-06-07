import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
  Alert,
  ScrollView,
} from "react-native";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTheme } from "@/context/ThemeContext";
import { useAlarms } from "@/hooks/useAlarms";
import { Plus, Clock, Filter, MapPin, Bell, Trash2 } from "lucide-react-native";
import { AlarmCard } from "@/components/alarms/AlarmCard";
import { FilterModal } from "@/components/common/FilterModal";

export default function AlarmsScreen() {
  const router = useRouter();
  const { theme } = useTheme();
  const { alarms, isLoading, toggleAlarmActive, deleteAlarm } = useAlarms();
  const [filterVisible, setFilterVisible] = useState(false);
  const [filterType, setFilterType] = useState("all"); // all, active, inactive

  const filteredAlarms = alarms?.filter((alarm) => {
    if (filterType === "all") return true;
    if (filterType === "active") return alarm.active;
    if (filterType === "inactive") return !alarm.active;
    return true;
  });

  const handleToggleAlarm = (id: string, active: boolean) => {
    toggleAlarmActive(id, active);
  };

  const handleDeleteAlarm = async (id: string) => {
    Alert.alert(
      "Delete Alarm",
      "Are you sure you want to delete this alarm?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              await deleteAlarm(id);
            } catch (error) {
              console.error("Error deleting alarm:", error);
              Alert.alert("Error", "Failed to delete alarm. Please try again.");
            }
          },
        },
      ]
    );
  };

  const filterOptions = [
    { label: "All Alarms", value: "all" },
    { label: "Active Alarms", value: "active" },
    { label: "Inactive Alarms", value: "inactive" },
  ];

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
    header: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      paddingHorizontal: 16,
      paddingVertical: 12,
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.border,
      backgroundColor: theme.colors.card,
    },
    title: {
      fontSize: 20,
      fontWeight: "bold",
      color: theme.colors.text,
    },
    headerButtons: {
      flexDirection: "row",
    },
    filterButton: {
      marginRight: 12,
      padding: 8,
    },
    addButton: {
      padding: 8,
    },
    content: {
      flex: 1,
    },
    emptyContainer: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      padding: 24,
    },
    emptyIcon: {
      marginBottom: 16,
    },
    emptyText: {
      fontSize: 16,
      color: theme.colors.textSecondary,
      textAlign: "center",
      marginBottom: 24,
    },
    createButton: {
      backgroundColor: theme.colors.primary,
      borderRadius: 12,
      paddingVertical: 12,
      paddingHorizontal: 24,
      flexDirection: "row",
      alignItems: "center",
    },
    createButtonText: {
      color: "#FFFFFF",
      fontSize: 16,
      fontWeight: "600",
      marginLeft: 8,
    },
    loadingContainer: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
    },
    listContainer: {
      padding: 16,
    },
  });

  if (isLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <Text style={{ color: theme.colors.text }}>Loading alarms...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={["bottom"]}>
      <View style={styles.header}>
        <Text style={styles.title}>My Alarms</Text>
        <View style={styles.headerButtons}>
          <TouchableOpacity
            style={styles.filterButton}
            onPress={() => setFilterVisible(true)}
          >
            <Filter size={24} color={theme.colors.text} />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.addButton}
            onPress={() => router.push("/alarm/create")}
          >
            <Plus size={24} color={theme.colors.text} />
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.content}>
        {filteredAlarms && filteredAlarms.length > 0 ? (
          <FlatList
            data={filteredAlarms}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.listContainer}
            renderItem={({ item }) => (
              <AlarmCard
                alarm={item}
                onToggle={(active) => handleToggleAlarm(item.id, active)}
                onEdit={() => router.push(`/alarm/edit/${item.id}`)}
                onDelete={() => handleDeleteAlarm(item.id)}
              />
            )}
          />
        ) : (
          <View style={styles.emptyContainer}>
            <Clock
              size={64}
              color={theme.colors.textSecondary}
              style={styles.emptyIcon}
            />
            <Text style={styles.emptyText}>
              You don't have any alarms yet. Create one to get started!
            </Text>
            <TouchableOpacity
              style={styles.createButton}
              onPress={() => router.push("/alarm/create")}
            >
              <Plus size={20} color="#FFFFFF" />
              <Text style={styles.createButtonText}>Create Alarm</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>

      <FilterModal
        visible={filterVisible}
        onClose={() => setFilterVisible(false)}
        options={filterOptions}
        selectedValue={filterType}
        onSelect={(value) => {
          setFilterType(value);
          setFilterVisible(false);
        }}
        title="Filter Alarms"
      />
    </SafeAreaView>
  );
}