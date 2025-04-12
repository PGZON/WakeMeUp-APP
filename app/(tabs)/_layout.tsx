import React from "react";
import { Tabs } from "expo-router";
import { MapPin, Clock, Settings, Home } from "lucide-react-native";
import { colors } from "@/constants/colors";
import { dimensions } from "@/constants/dimensions";

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textMuted,
        tabBarStyle: {
          backgroundColor: colors.card,
          borderTopColor: colors.border,
        },
        headerStyle: {
          backgroundColor: colors.card,
        },
        headerTitleStyle: {
          color: colors.text,
          fontWeight: '600',
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: ({ color }) => <Home size={dimensions.icon.md} color={color} />,
        }}
      />
      <Tabs.Screen
        name="locations"
        options={{
          title: "Saved Places",
          tabBarIcon: ({ color }) => <MapPin size={dimensions.icon.md} color={color} />,
        }}
      />
      <Tabs.Screen
        name="history"
        options={{
          title: "Trip History",
          tabBarIcon: ({ color }) => <Clock size={dimensions.icon.md} color={color} />,
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: "Settings",
          tabBarIcon: ({ color }) => <Settings size={dimensions.icon.md} color={color} />,
        }}
      />
    </Tabs>
  );
}