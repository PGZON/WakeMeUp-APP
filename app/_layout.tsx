import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";
import { StatusBar } from "expo-status-bar";
import { useColorScheme } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";

export const unstable_settings = {
  initialRouteName: "(tabs)",
};

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded, error] = useFonts({
    // We're not using custom fonts as per instructions
  });

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

  if (!loaded) {
    return null;
  }

  return <RootLayoutNav />;
}

function RootLayoutNav() {
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
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="modal" options={{ presentation: "modal" }} />
        <Stack.Screen name="trip/create" options={{ title: "Create Trip" }} />
        <Stack.Screen name="trip/[id]" options={{ title: "Trip Details" }} />
        <Stack.Screen name="trip/history" options={{ title: "Trip History" }} />
        <Stack.Screen name="expense/add" options={{ title: "Add Expense" }} />
        <Stack.Screen name="expense/[id]" options={{ title: "Expense Details" }} />
      </Stack>
    </GestureHandlerRootView>
  );
}