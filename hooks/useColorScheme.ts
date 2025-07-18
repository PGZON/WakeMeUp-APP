import { useColorScheme as _useColorScheme } from "react-native";
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";

type ColorScheme = "light" | "dark" | "system";

interface ColorSchemeState {
  colorScheme: ColorScheme;
  setColorScheme: (scheme: ColorScheme) => void;
}

export const useColorSchemeStore = create<ColorSchemeState>()(
  persist(
    (set) => ({
      colorScheme: "system",
      setColorScheme: (scheme) => set({ colorScheme: scheme }),
    }),
    {
      name: "color-scheme-storage",
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);

export default function useColorScheme(): "light" | "dark" {
  const systemColorScheme = _useColorScheme() as "light" | "dark";
  const { colorScheme } = useColorSchemeStore();

  if (colorScheme === "system") {
    return systemColorScheme || "light";
  }

  return colorScheme;
}