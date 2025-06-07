import React from "react";
import { View, StyleSheet } from "react-native";
import Slider from "@react-native-community/slider";
import { useTheme } from "@/context/ThemeContext";

interface SliderInputProps {
  value: number;
  minimumValue: number;
  maximumValue: number;
  step: number;
  onValueChange: (value: number) => void;
  minimumTrackTintColor?: string;
  maximumTrackTintColor?: string;
}

export const SliderInput: React.FC<SliderInputProps> = ({
  value,
  minimumValue,
  maximumValue,
  step,
  onValueChange,
  minimumTrackTintColor,
  maximumTrackTintColor,
}) => {
  const { theme } = useTheme();

  return (
    <Slider
      value={value}
      minimumValue={minimumValue}
      maximumValue={maximumValue}
      step={step}
      onValueChange={onValueChange}
      minimumTrackTintColor={minimumTrackTintColor || theme.colors.primary}
      maximumTrackTintColor={maximumTrackTintColor || theme.colors.border}
      thumbTintColor={theme.colors.primary}
    />
  );
};