import React from 'react';
import { View, Text, StyleSheet, Platform } from 'react-native';
import { MapPin, Navigation } from 'lucide-react-native';
import { colors } from '../constants/Colors';
import { dimensions } from '../constants/dimensions';

interface MapViewProps {
  currentLocation: { latitude: number; longitude: number } | null;
  destination: { latitude: number; longitude: number; name: string } | null;
}

export const MapView: React.FC<MapViewProps> = ({ currentLocation, destination }) => {
  // In a real app, this would be a real map component
  // For this example, we'll just show a placeholder
  
  return (
    <View style={styles.container}>
      {Platform.OS === 'web' ? (
        <View style={styles.mapPlaceholder}>
          <Text style={styles.mapPlaceholderText}>Map View</Text>
          {currentLocation && (
            <View style={styles.locationInfo}>
              <MapPin size={dimensions.icon.md} color={colors.primary} />
              <Text style={styles.locationText}>
                Your location: {currentLocation.latitude.toFixed(4)}, {currentLocation.longitude.toFixed(4)}
              </Text>
            </View>
          )}
          {destination && (
            <View style={styles.locationInfo}>
              <Navigation size={dimensions.icon.md} color={colors.secondary} />
              <Text style={styles.locationText}>
                Destination: {destination.name} ({destination.latitude.toFixed(4)}, {destination.longitude.toFixed(4)})
              </Text>
            </View>
          )}
        </View>
      ) : (
        <View style={styles.mapPlaceholder}>
          <Text style={styles.mapPlaceholderText}>Map View</Text>
          {currentLocation && (
            <View style={styles.locationInfo}>
              <MapPin size={dimensions.icon.md} color={colors.primary} />
              <Text style={styles.locationText}>
                Your location: {currentLocation.latitude.toFixed(4)}, {currentLocation.longitude.toFixed(4)}
              </Text>
            </View>
          )}
          {destination && (
            <View style={styles.locationInfo}>
              <Navigation size={dimensions.icon.md} color={colors.secondary} />
              <Text style={styles.locationText}>
                Destination: {destination.name} ({destination.latitude.toFixed(4)}, {destination.longitude.toFixed(4)})
              </Text>
            </View>
          )}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    overflow: 'hidden',
    borderRadius: dimensions.borderRadius.md,
    margin: dimensions.spacing.md,
  },
  mapPlaceholder: {
    flex: 1,
    backgroundColor: colors.backgroundDark,
    justifyContent: 'center',
    alignItems: 'center',
    padding: dimensions.spacing.lg,
  },
  mapPlaceholderText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.textMuted,
    marginBottom: dimensions.spacing.lg,
  },
  locationInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.card,
    padding: dimensions.spacing.md,
    borderRadius: dimensions.borderRadius.md,
    marginVertical: dimensions.spacing.sm,
    width: '100%',
  },
  locationText: {
    marginLeft: dimensions.spacing.sm,
    color: colors.text,
    fontSize: 14,
  },
});