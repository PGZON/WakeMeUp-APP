import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Switch,
  Platform,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTheme } from "@/context/ThemeContext";
import {
  Moon,
  Sun,
  Bell,
  Vibrate,
  MapPin,
  Info,
  ChevronRight,
  Smartphone,
} from "lucide-react-native";

export default function SettingsScreen() {
  const { theme, themeType, toggleTheme } = useTheme();
  const [vibrationEnabled, setVibrationEnabled] = React.useState(true);
  const [notificationsEnabled, setNotificationsEnabled] = React.useState(true);
  const [locationEnabled, setLocationEnabled] = React.useState(true);

  const getThemeText = () => {
    switch (themeType) {
      case "light":
        return "Light";
      case "dark":
        return "Dark";
      case "system":
        return "System";
      default:
        return "System";
    }
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
    header: {
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
    content: {
      flex: 1,
    },
    section: {
      marginBottom: 24,
    },
    sectionHeader: {
      paddingHorizontal: 16,
      paddingVertical: 8,
      backgroundColor: theme.colors.backgroundSecondary || theme.colors.background,
    },
    sectionTitle: {
      fontSize: 14,
      fontWeight: "600",
      color: theme.colors.textSecondary,
      textTransform: "uppercase",
      letterSpacing: 1,
    },
    settingItem: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      paddingHorizontal: 16,
      paddingVertical: 16,
      backgroundColor: theme.colors.card,
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.border,
    },
    settingLeft: {
      flexDirection: "row",
      alignItems: "center",
    },
    settingIcon: {
      marginRight: 12,
    },
    settingText: {
      fontSize: 16,
      color: theme.colors.text,
    },
    settingValue: {
      fontSize: 16,
      color: theme.colors.textSecondary,
    },
    themeButton: {
      flexDirection: "row",
      alignItems: "center",
    },
    themeIcon: {
      marginRight: 8,
    },
    versionContainer: {
      padding: 16,
      alignItems: "center",
    },
    versionText: {
      fontSize: 14,
      color: theme.colors.textSecondary,
    },
  });

  return (
    <SafeAreaView style={styles.container} edges={["bottom"]}>
      <View style={styles.header}>
        <Text style={styles.title}>Settings</Text>
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Appearance</Text>
          </View>

          <TouchableOpacity style={styles.settingItem} onPress={toggleTheme}>
            <View style={styles.settingLeft}>
              {themeType === "dark" ? (
                <Moon size={24} color={theme.colors.primary} style={styles.settingIcon} />
              ) : themeType === "light" ? (
                <Sun size={24} color={theme.colors.primary} style={styles.settingIcon} />
              ) : (
                <Smartphone size={24} color={theme.colors.primary} style={styles.settingIcon} />
              )}
              <Text style={styles.settingText}>Theme</Text>
            </View>
            <View style={styles.themeButton}>
              <Text style={styles.settingValue}>{getThemeText()}</Text>
              <ChevronRight size={20} color={theme.colors.textSecondary} />
            </View>
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Notifications</Text>
          </View>

          <View style={styles.settingItem}>
            <View style={styles.settingLeft}>
              <Bell size={24} color={theme.colors.primary} style={styles.settingIcon} />
              <Text style={styles.settingText}>Notifications</Text>
            </View>
            <Switch
              value={notificationsEnabled}
              onValueChange={setNotificationsEnabled}
              trackColor={{ false: theme.colors.border, true: theme.colors.primary }}
              thumbColor={Platform.OS === "ios" ? undefined : "#FFFFFF"}
            />
          </View>

          <View style={styles.settingItem}>
            <View style={styles.settingLeft}>
              <Vibrate size={24} color={theme.colors.primary} style={styles.settingIcon} />
              <Text style={styles.settingText}>Vibration</Text>
            </View>
            <Switch
              value={vibrationEnabled}
              onValueChange={setVibrationEnabled}
              trackColor={{ false: theme.colors.border, true: theme.colors.primary }}
              thumbColor={Platform.OS === "ios" ? undefined : "#FFFFFF"}
            />
          </View>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Location</Text>
          </View>

          <View style={styles.settingItem}>
            <View style={styles.settingLeft}>
              <MapPin size={24} color={theme.colors.primary} style={styles.settingIcon} />
              <Text style={styles.settingText}>Location Services</Text>
            </View>
            <Switch
              value={locationEnabled}
              onValueChange={setLocationEnabled}
              trackColor={{ false: theme.colors.border, true: theme.colors.primary }}
              thumbColor={Platform.OS === "ios" ? undefined : "#FFFFFF"}
            />
          </View>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>About</Text>
          </View>

          <TouchableOpacity style={styles.settingItem}>
            <View style={styles.settingLeft}>
              <Info size={24} color={theme.colors.primary} style={styles.settingIcon} />
              <Text style={styles.settingText}>About WakeMeUp</Text>
            </View>
            <ChevronRight size={20} color={theme.colors.textSecondary} />
          </TouchableOpacity>
        </View>

        <View style={styles.versionContainer}>
          <Text style={styles.versionText}>Version 1.0.0</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}