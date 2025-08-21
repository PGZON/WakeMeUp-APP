import '@/lib/crypto-polyfill';
import { ErrorBoundary } from "./error-boundary";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect, useState } from "react";
import { Platform, View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { trpc, trpcClient } from "@/lib/trpc";
import { ThemeProvider, useTheme } from "../context/ThemeContext";
import { BackendProvider } from "../context/BackendContext";
import * as Location from "expo-location";

export const unstable_settings = {
  initialRouteName: "(app)",
};

// Create a client
const queryClient = new QueryClient();

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded, error] = useFonts({
    ...FontAwesome.font,
  });
  const [permissionsChecked, setPermissionsChecked] = useState(false);
  const [locationPermission, setLocationPermission] = useState(false);

  useEffect(() => {
    if (error) {
      console.error(error);
      throw error;
    }
  }, [error]);

  useEffect(() => {
    async function checkPermissions() {
      // Check location permission
      const { status: locationStatus } = await Location.requestForegroundPermissionsAsync();
      setLocationPermission(locationStatus === "granted");
      setPermissionsChecked(true);
    }

    if (loaded) {
      checkPermissions();
    }
  }, [loaded]);

  useEffect(() => {
    if (loaded && permissionsChecked) {
      SplashScreen.hideAsync();
    }
  }, [loaded, permissionsChecked]);

  if (!loaded || !permissionsChecked) {
    return null;
  }

  return (
    <ErrorBoundary>
      <trpc.Provider client={trpcClient} queryClient={queryClient}>
        <QueryClientProvider client={queryClient}>
          <ThemeProvider>
            <BackendProvider>
              <SafeAreaProvider>
                <RootLayoutNav 
                  locationPermission={locationPermission}
                />
              </SafeAreaProvider>
            </BackendProvider>
          </ThemeProvider>
        </QueryClientProvider>
      </trpc.Provider>
    </ErrorBoundary>
  );
}

function RootLayoutNav({ 
  locationPermission
}: { 
  locationPermission: boolean
}) {
  const { theme } = useTheme();

  const styles = StyleSheet.create({
    permissionContainer: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      padding: 20,
      backgroundColor: theme.colors.background,
    },
    permissionTitle: {
      fontSize: 22,
      fontWeight: "bold",
      color: theme.colors.text,
      marginBottom: 16,
      textAlign: "center",
    },
    permissionText: {
      fontSize: 16,
      color: theme.colors.textSecondary,
      marginBottom: 24,
      textAlign: "center",
      lineHeight: 24,
    },
    permissionButton: {
      backgroundColor: theme.colors.primary,
      paddingVertical: 12,
      paddingHorizontal: 24,
      borderRadius: 12,
    },
    permissionButtonText: {
      color: "#FFFFFF",
      fontSize: 16,
      fontWeight: "600",
    },
  });

  // If permissions are not granted, show a screen explaining why they're needed
  if (!locationPermission) {
    return (
      <View style={styles.permissionContainer}>
        <Text style={styles.permissionTitle}>Location Permission Required</Text>
        <Text style={styles.permissionText}>
          This app needs location permission to function properly.
          {"\n\n"}
          Location is needed to track your position relative to your destinations.
        </Text>
        <TouchableOpacity
          style={styles.permissionButton}
          onPress={() => {
            // Reload the app to trigger permission requests again
            SplashScreen.preventAutoHideAsync();
            window.location.reload();
          }}
        >
          <Text style={styles.permissionButtonText}>Grant Permission</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="(app)" options={{ headerShown: false }} />
    </Stack>
  );
}