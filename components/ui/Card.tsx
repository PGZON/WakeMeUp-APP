import React from "react";
import { View, StyleSheet, ViewProps } from "react-native";
import { useColorScheme } from "react-native";
import Colors from "@/constants/colors";
import { RADIUS, SHADOWS } from "@/constants/theme";

interface CardProps extends ViewProps {
  variant?: "default" | "elevated" | "outlined";
}

export function Card({ children, style, variant = "default", ...props }: CardProps) {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme === "dark" ? "dark" : "light"];
  const shadows = SHADOWS[colorScheme === "dark" ? "dark" : "light"];

  const cardStyles = [
    styles.card,
    {
      backgroundColor: colors.card,
      borderRadius: RADIUS.md,
    },
    variant === "elevated" && {
      ...shadows.medium,
    },
    variant === "outlined" && {
      borderWidth: 1,
      borderColor: colors.border,
    },
    style,
  ];

  return (
    <View style={cardStyles} {...props}>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    padding: 16,
    marginVertical: 8,
  },
});