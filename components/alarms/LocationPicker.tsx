import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  TextInput,
  ActivityIndicator,
  FlatList,
} from "react-native";
import { useTheme } from "@/context/ThemeContext";
import { X, Search, MapPin } from "lucide-react-native";
import * as Location from "expo-location";

interface LocationPickerProps {
  visible: boolean;
  onClose: () => void;
  onSelectLocation: (location: any) => void;
}

export const LocationPicker: React.FC<LocationPickerProps> = ({
  visible,
  onClose,
  onSelectLocation,
}) => {
  const { theme } = useTheme();
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [currentLocation, setCurrentLocation] = useState<Location.LocationObject | null>(null);

  // Get current location
  const getCurrentLocation = async () => {
    try {
      setLoading(true);
      const { status } = await Location.requestForegroundPermissionsAsync();
      
      if (status !== "granted") {
        console.log("Permission to access location was denied");
        return;
      }
      
      const location = await Location.getCurrentPositionAsync({});
      setCurrentLocation(location);
      
      // Reverse geocode to get address
      const reverseGeocode = await Location.reverseGeocodeAsync({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      });
      
      if (reverseGeocode.length > 0) {
        const address = reverseGeocode[0];
        const formattedAddress = [
          address.street,
          address.city,
          address.region,
          address.postalCode,
          address.country,
        ]
          .filter(Boolean)
          .join(", ");
        
        const locationData = {
          name: "Current Location",
          address: formattedAddress,
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
        };
        
        onSelectLocation(locationData);
        onClose();
      }
    } catch (error) {
      console.error("Error getting current location:", error);
    } finally {
      setLoading(false);
    }
  };

  // Search for locations
  const searchLocations = async () => {
    if (!searchQuery.trim()) return;
    
    try {
      setLoading(true);
      const geocodeResults = await Location.geocodeAsync(searchQuery);
      
      if (geocodeResults.length > 0) {
        const results = await Promise.all(
          geocodeResults.map(async (result) => {
            const reverseGeocode = await Location.reverseGeocodeAsync({
              latitude: result.latitude,
              longitude: result.longitude,
            });
            
            const address = reverseGeocode[0];
            const formattedAddress = [
              address.street,
              address.city,
              address.region,
              address.postalCode,
              address.country,
            ]
              .filter(Boolean)
              .join(", ");
            
            return {
              name: searchQuery,
              address: formattedAddress,
              latitude: result.latitude,
              longitude: result.longitude,
            };
          })
        );
        
        setSearchResults(results);
      } else {
        setSearchResults([]);
      }
    } catch (error) {
      console.error("Error searching locations:", error);
      setSearchResults([]);
    } finally {
      setLoading(false);
    }
  };

  const styles = StyleSheet.create({
    modalContainer: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
    header: {
      flexDirection: "row",
      alignItems: "center",
      padding: 16,
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.border,
    },
    closeButton: {
      padding: 8,
    },
    title: {
      flex: 1,
      fontSize: 18,
      fontWeight: "600",
      color: theme.colors.text,
      textAlign: "center",
    },
    searchContainer: {
      padding: 16,
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.border,
    },
    searchInputContainer: {
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: theme.colors.card,
      borderRadius: 12,
      paddingHorizontal: 12,
      marginBottom: 16,
    },
    searchInput: {
      flex: 1,
      height: 48,
      fontSize: 16,
      color: theme.colors.text,
    },
    searchButton: {
      padding: 8,
    },
    currentLocationButton: {
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: theme.colors.primary,
      borderRadius: 12,
      padding: 12,
      justifyContent: "center",
    },
    currentLocationText: {
      color: "#FFFFFF",
      fontSize: 16,
      fontWeight: "600",
      marginLeft: 8,
    },
    resultsContainer: {
      flex: 1,
    },
    resultItem: {
      flexDirection: "row",
      alignItems: "center",
      padding: 16,
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.border,
    },
    resultIcon: {
      marginRight: 12,
    },
    resultInfo: {
      flex: 1,
    },
    resultName: {
      fontSize: 16,
      fontWeight: "500",
      color: theme.colors.text,
      marginBottom: 4,
    },
    resultAddress: {
      fontSize: 14,
      color: theme.colors.textSecondary,
    },
    loadingContainer: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
    },
    noResultsContainer: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      padding: 24,
    },
    noResultsText: {
      fontSize: 16,
      color: theme.colors.textSecondary,
      textAlign: "center",
    },
  });

  return (
    <Modal visible={visible} animationType="slide">
      <View style={styles.modalContainer}>
        <View style={styles.header}>
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <X size={24} color={theme.colors.text} />
          </TouchableOpacity>
          <Text style={styles.title}>Select Location</Text>
          <View style={{ width: 40 }} />
        </View>

        <View style={styles.searchContainer}>
          <View style={styles.searchInputContainer}>
            <TextInput
              style={styles.searchInput}
              value={searchQuery}
              onChangeText={setSearchQuery}
              placeholder="Search for a location"
              placeholderTextColor={theme.colors.textSecondary}
              returnKeyType="search"
              onSubmitEditing={searchLocations}
            />
            <TouchableOpacity
              style={styles.searchButton}
              onPress={searchLocations}
            >
              <Search size={24} color={theme.colors.primary} />
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            style={styles.currentLocationButton}
            onPress={getCurrentLocation}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator size="small" color="#FFFFFF" />
            ) : (
              <>
                <MapPin size={20} color="#FFFFFF" />
                <Text style={styles.currentLocationText}>
                  Use Current Location
                </Text>
              </>
            )}
          </TouchableOpacity>
        </View>

        <View style={styles.resultsContainer}>
          {loading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color={theme.colors.primary} />
            </View>
          ) : searchResults.length > 0 ? (
            <FlatList
              data={searchResults}
              keyExtractor={(item, index) => `location-${index}`}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.resultItem}
                  onPress={() => {
                    onSelectLocation(item);
                    onClose();
                  }}
                >
                  <MapPin
                    size={24}
                    color={theme.colors.primary}
                    style={styles.resultIcon}
                  />
                  <View style={styles.resultInfo}>
                    <Text style={styles.resultName}>{item.name}</Text>
                    <Text style={styles.resultAddress}>{item.address}</Text>
                  </View>
                </TouchableOpacity>
              )}
            />
          ) : searchQuery ? (
            <View style={styles.noResultsContainer}>
              <Text style={styles.noResultsText}>
                No results found for "{searchQuery}".
                {"\n"}
                Try a different search term or use your current location.
              </Text>
            </View>
          ) : null}
        </View>
      </View>
    </Modal>
  );
};