import React from 'react';
import { View, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Stack, useRouter } from 'expo-router';
import { useLocationStore } from '@/hooks/useLocationStore';
import { TripHistoryList } from '@/components/TripHistoryList';
import { Trip } from '@/types/location';
import { colors } from '@/constants/Colors';

export default function HistoryScreen() {
  const router = useRouter();
  const { recentTrips } = useLocationStore();
  
  // Handle selecting a trip
  const handleSelectTrip = (trip: Trip) => {
    // Navigate to home screen with the selected location
    router.push({
      pathname: '/',
      params: { locationId: trip.destination.id },
    });
  };
  
  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <Stack.Screen options={{ title: "Trip History" }} />
      
      <TripHistoryList
        trips={recentTrips}
        onSelectTrip={handleSelectTrip}
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