import { useFonts } from "expo-font";
import { Redirect, Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect, useState } from "react";
import { StatusBar } from "expo-status-bar";
import { ActivityIndicator, useColorScheme, View } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { isAuthenticated } from "../utils/auth";
import AsyncStorage from '@react-native-async-storage/async-storage';

export const unstable_settings = {
  initialRouteName: "(tabs)",
};

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded, error] = useFonts({
    // We're not using custom fonts as per instructions
  });
  const [isAuthChecking, setIsAuthChecking] = useState(true);
  const [isSignedIn, setIsSignedIn] = useState(false);

  useEffect(() => {
    if (error) {
      console.error(error);
      throw error;
    }
  }, [error]);

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  // Check authentication status
  useEffect(() => {
    async function checkAuth() {
      console.log("[RootLayout] Checking authentication status...");
      try {
        const authed = await isAuthenticated();
        console.log("[RootLayout] Auth status:", authed);
        setIsSignedIn(authed);
      } catch (e) {
        console.error("[RootLayout] Error during isAuthenticated:", e);
      } finally {
        setIsAuthChecking(false);
      }
    }
    checkAuth();
  }, []);

  if (!loaded || isAuthChecking) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return <RootLayoutNav isSignedIn={isSignedIn} />;
}

function RootLayoutNav({ isSignedIn }: { isSignedIn: boolean }) {
  const colorScheme = useColorScheme();
  
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <StatusBar style={colorScheme === "dark" ? "light" : "dark"} />
      <Stack
        screenOptions={{
          headerBackTitle: "Back",
          headerStyle: {
            backgroundColor: colorScheme === "dark" ? "#121A2F" : "#FFFFFF",
          },
          headerTintColor: colorScheme === "dark" ? "#F5F5F5" : "#333333",
        }}
      >
        {isSignedIn ? (
          <>
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
            <Stack.Screen name="modal" options={{ presentation: "modal" }} />
            <Stack.Screen name="trip/create" options={{ title: "Create Trip" }} />
            <Stack.Screen name="trip/[id]" options={{ title: "Trip Details" }} />
            <Stack.Screen name="trip/history" options={{ title: "Trip History" }} />
            <Stack.Screen name="expense/add" options={{ title: "Add Expense" }} />
            <Stack.Screen name="expense/[id]" options={{ title: "Expense Details" }} />
          </>
        ) : (
          <>
            <Stack.Screen name="auth" options={{ headerShown: false }} />
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} redirect />
          </>
        )}
      </Stack>
    </GestureHandlerRootView>
  );
}