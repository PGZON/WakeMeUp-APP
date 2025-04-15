import React from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Stack, useRouter } from 'expo-router';
import { SavedLocationsList } from '../../components/SavedLocationsList';
import { useLocationStore } from '../../hooks/useLocationStore';
import { Location } from '../../types/location';
import { colors } from '../../constants/Colors';

export default function LocationsScreen() {
  const router = useRouter();
  const { savedLocations, toggleFavorite, removeSavedLocation } = useLocationStore();
  
  // Handle selecting a location
  const handleSelectLocation = (location: Location) => {
    // Navigate to home screen with the selected location
    router.push({
      pathname: '/',
      params: { locationId: location.id },
    });
  };
  
  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <Stack.Screen options={{ title: "Saved Places" }} />
      
      <SavedLocationsList
        locations={savedLocations}
        onSelectLocation={handleSelectLocation}
        onToggleFavorite={toggleFavorite}
        onDeleteLocation={removeSavedLocation}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.backgroundDark,
  },
});