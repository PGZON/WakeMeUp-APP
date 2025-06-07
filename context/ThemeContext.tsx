import React, { createContext, useContext, useState, useEffect } from "react";
import { useColorScheme, StatusBar } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

// Define theme types
export type ThemeType = "light" | "dark" | "system";

// Define theme colors
interface ThemeColors {
  background: string;
  backgroundSecondary: string;
  card: string;
  text: string;
  textSecondary: string;
  border: string;
  primary: string;
  secondary: string;
  success: string;
  warning: string;
  error: string;
  shadow: string;
}

// Define theme interface
interface Theme {
  dark: boolean;
  colors: ThemeColors;
}

// Define light theme
const lightTheme: Theme = {
  dark: false,
  colors: {
    background: "#F8F9FA",
    backgroundSecondary: "#E9ECEF",
    card: "#FFFFFF",
    text: "#212529",
    textSecondary: "#6C757D",
    border: "#DEE2E6",
    primary: "#4361EE",
    secondary: "#7209B7",
    success: "#38B000",
    warning: "#F48C06",
    error: "#E5383B",
    shadow: "#000000",
  },
};

// Define dark theme
const darkTheme: Theme = {
  dark: true,
  colors: {
    background: "#121212",
    backgroundSecondary: "#1E1E1E",
    card: "#2A2A2A",
    text: "#E9ECEF",
    textSecondary: "#ADB5BD",
    border: "#343A40",
    primary: "#4CC9F0",
    secondary: "#F72585",
    success: "#57CC99",
    warning: "#FFD166",
    error: "#FF5A5F",
    shadow: "#000000",
  },
};

// Define context type
interface ThemeContextType {
  theme: Theme;
  themeType: ThemeType;
  setThemeType: (type: ThemeType) => void;
  toggleTheme: () => void;
}

// Create context
const ThemeContext = createContext<ThemeContextType>({
  theme: lightTheme,
  themeType: "system",
  setThemeType: () => {},
  toggleTheme: () => {},
});

// Create provider
export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const colorScheme = useColorScheme();
  const [themeType, setThemeType] = useState<ThemeType>("system");
  const [theme, setTheme] = useState<Theme>(colorScheme === "dark" ? darkTheme : lightTheme);

  // Load theme from storage
  useEffect(() => {
    const loadTheme = async () => {
      try {
        const savedTheme = await AsyncStorage.getItem("themeType");
        if (savedTheme) {
          setThemeType(savedTheme as ThemeType);
        }
      } catch (error) {
        console.log("Error loading theme:", error);
      }
    };

    loadTheme();
  }, []);

  // Update theme when themeType changes
  useEffect(() => {
    const updateTheme = async () => {
      let newTheme: Theme;

      if (themeType === "system") {
        newTheme = colorScheme === "dark" ? darkTheme : lightTheme;
      } else {
        newTheme = themeType === "dark" ? darkTheme : lightTheme;
      }

      setTheme(newTheme);
      
      // Update status bar
      StatusBar.setBarStyle(newTheme.dark ? "light-content" : "dark-content");
      
      try {
        await AsyncStorage.setItem("themeType", themeType);
      } catch (error) {
        console.log("Error saving theme:", error);
      }
    };

    updateTheme();
  }, [themeType, colorScheme]);

  // Toggle between light and dark theme
  const toggleTheme = () => {
    if (themeType === "light") {
      setThemeType("dark");
    } else if (themeType === "dark") {
      setThemeType("system");
    } else {
      setThemeType("light");
    }
  };

  return (
    <ThemeContext.Provider
      value={{
        theme,
        themeType,
        setThemeType,
        toggleTheme,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

// Create hook
export const useTheme = () => useContext(ThemeContext);