import React from "react";
import { Stack } from "expo-router";
import { useTheme } from "@/context/ThemeContext";

export default function AppLayout() {
  const { theme } = useTheme();
  
  return (
    <Stack
      screenOptions={{
        headerStyle: {
          backgroundColor: theme.colors.card,
        },
        headerTintColor: theme.colors.text,
        headerTitleStyle: {
          fontWeight: "600",
        },
        contentStyle: {
          backgroundColor: theme.colors.background,
        },
      }}
    >
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="alarm/create" options={{ title: "Create Alarm" }} />
      <Stack.Screen name="alarm/edit/[id]" options={{ title: "Edit Alarm" }} />
      <Stack.Screen name="trip/create" options={{ title: "Create Trip" }} />
      <Stack.Screen name="trip/edit/[id]" options={{ title: "Edit Trip" }} />
      <Stack.Screen name="trip/details/[id]" options={{ title: "Trip Details" }} />
      <Stack.Screen name="expense/create" options={{ title: "Add Expense" }} />
      <Stack.Screen name="expense/edit/[id]" options={{ title: "Edit Expense" }} />
    </Stack>
  );
}