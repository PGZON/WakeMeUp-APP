import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Text, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Stack } from 'expo-router';
import { useLocationStore } from '@/hooks/useLocationStore';
import { useLocationTracking } from '@/hooks/useLocationTracking';
import { useAlarm } from '@/hooks/useAlarm';
import { LocationSearchBar } from '@/components/LocationSearchBar';
import { MapView } from '@/components/MapView';
import { AlarmSettingsCard } from '@/components/AlarmSettingsCard';
import { ActiveTripCard } from '@/components/ActiveTripCard';
import { AlarmModal } from '@/components/AlarmModal';
import { Location, TravelMode } from '@/types/location';
import { colors } from '@/constants/colors';
import { dimensions } from '@/constants/dimensions';

export default function HomeScreen() {
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(null);
  const [distance, setDistance] = useState<number | null>(null);
  const [showAlarmModal, setShowAlarmModal] = useState(false);
  
  const { 
    savedLocations, 
    activeTrip, 
    alarmSettings, 
    updateAlarmSettings,
    startTrip,
    endTrip,
    isAlarmActive,
    setAlarmActive
  } = useLocationStore();
  
  const { 
    currentLocation, 
    errorMsg, 
    startTracking, 
    stopTracking,
    isTracking
  } = useLocationTracking();
  
  const { 
    isAlarmActive: alarmTriggered,
    snoozeAlarm,
    stopAlarm,
    completeTrip
  } = useAlarm();
  
  // Calculate distance to destination
  useEffect(() => {
    if (currentLocation && activeTrip) {
      const { latitude: lat1, longitude: lon1 } = currentLocation;
      const { latitude: lat2, longitude: lon2 } = activeTrip.destination;
      
      // Calculate distance using Haversine formula
      const R = 6371e3; // Earth's radius in meters
      const φ1 = (lat1 * Math.PI) / 180;
      const φ2 = (lat2 * Math.PI) / 180;
      const Δφ = ((lat2 - lat1) * Math.PI) / 180;
      const Δλ = ((lon2 - lon1) * Math.PI) / 180;

      const a =
        Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
        Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
      const distance = R * c;

      setDistance(distance);
    }
  }, [currentLocation, activeTrip]);
  
  // Show alarm modal when alarm is triggered
  useEffect(() => {
    if (alarmTriggered && activeTrip) {
      setShowAlarmModal(true);
    }
  }, [alarmTriggered, activeTrip]);
  
  // Start tracking when a trip is active
  useEffect(() => {
    if (activeTrip && !isTracking) {
      startTracking();
    } else if (!activeTrip && isTracking) {
      stopTracking();
    }
    
    return () => {
      if (isTracking) {
        stopTracking();
      }
    };
  }, [activeTrip, isTracking]);
  
  // Handle location selection
  const handleSelectLocation = (location: Location) => {
    setSelectedLocation(location);
  };
  
  // Handle starting a trip
  const handleStartTrip = (travelMode: TravelMode) => {
    if (selectedLocation) {
      startTrip(
        selectedLocation,
        alarmSettings.distance,
        alarmSettings.sound && alarmSettings.vibration ? 'both' : alarmSettings.sound ? 'sound' : 'vibration',
        travelMode
      );
    }
  };
  
  // Handle completing a trip
  const handleCompleteTrip = () => {
    completeTrip();
    setSelectedLocation(null);
  };
  
  // Handle snoozing the alarm
  const handleSnoozeAlarm = () => {
    snoozeAlarm();
    setShowAlarmModal(false);
  };
  
  // Handle stopping the alarm
  const handleStopAlarm = () => {
    stopAlarm();
    setShowAlarmModal(false);
  };
  
  // Render the main content based on app state
  const renderMainContent = () => {
    if (activeTrip) {
      return (
        <ActiveTripCard
          trip={activeTrip}
          distance={distance}
          isAlarmActive={isAlarmActive}
          onToggleAlarm={() => setAlarmActive(!isAlarmActive)}
          onCompleteTrip={handleCompleteTrip}
        />
      );
    } 
    
    if (selectedLocation) {
      return (
        <AlarmSettingsCard
          settings={alarmSettings}
          onUpdateSettings={updateAlarmSettings}
          onStartTrip={handleStartTrip}
        />
      );
    }
    
    return (
      <View style={styles.instructionsContainer}>
        <Text style={styles.instructionsTitle}>How to use WakeMeUp</Text>
        <Text style={styles.instructionsText}>
          1. Search for your destination above
        </Text>
        <Text style={styles.instructionsText}>
          2. Set your alarm preferences
        </Text>
        <Text style={styles.instructionsText}>
          3. Start your trip and relax
        </Text>
        <Text style={styles.instructionsText}>
          4. We'll wake you up when you're close!
        </Text>
      </View>
    );
  };
  
  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <Stack.Screen options={{ title: "WakeMeUp" }} />
      
      <View style={styles.contentContainer}>
        <LocationSearchBar
          onSelectLocation={handleSelectLocation}
          savedLocations={savedLocations}
        />
        
        <MapView
          currentLocation={currentLocation}
          destination={activeTrip ? activeTrip.destination : selectedLocation}
        />
        
        {errorMsg && (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>{errorMsg}</Text>
          </View>
        )}
        
        {renderMainContent()}
      </View>
      
      <AlarmModal
        visible={showAlarmModal}
        destination={activeTrip?.destination.name || ""}
        onSnooze={handleSnoozeAlarm}
        onStop={handleStopAlarm}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.backgroundDark,
  },
  contentContainer: {
    flex: 1,
    paddingBottom: dimensions.spacing.xl,
  },
  errorContainer: {
    backgroundColor: colors.error,
    padding: dimensions.spacing.md,
    margin: dimensions.spacing.md,
    borderRadius: dimensions.borderRadius.md,
  },
  errorText: {
    color: colors.card,
    textAlign: 'center',
  },
  instructionsContainer: {
    backgroundColor: colors.card,
    borderRadius: dimensions.borderRadius.lg,
    padding: dimensions.spacing.xl,
    margin: dimensions.spacing.md,
    alignItems: 'center',
  },
  instructionsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: dimensions.spacing.lg,
  },
  instructionsText: {
    fontSize: 16,
    color: colors.textLight,
    marginBottom: dimensions.spacing.md,
    textAlign: 'center',
  },
});