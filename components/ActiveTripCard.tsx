import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Navigation, Bell, BellOff, Check } from 'lucide-react-native';
import { colors } from '@/constants/Colors';
import { dimensions } from '@/constants/dimensions';
import { Trip } from '@/types/location';

interface ActiveTripCardProps {
  trip: Trip;
  distance: number | null;
  isAlarmActive: boolean;
  onToggleAlarm: () => void;
  onCompleteTrip: () => void;
}

export const ActiveTripCard: React.FC<ActiveTripCardProps> = ({
  trip,
  distance,
  isAlarmActive,
  onToggleAlarm,
  onCompleteTrip,
}) => {
  // Format distance for display
  const formatDistance = (meters: number | null) => {
    if (meters === null) return 'Calculating...';
    if (meters < 1000) return `${meters.toFixed(0)} m`;
    return `${(meters / 1000).toFixed(1)} km`;
  };
  
  // Get ETA based on distance and travel mode (very rough estimate)
  const getEstimatedTime = (meters: number | null, mode: string) => {
    if (meters === null) return 'Calculating...';
    
    let speedMps = 0;
    switch (mode) {
      case 'walking':
        speedMps = 1.4; // ~5 km/h
        break;
      case 'bus':
        speedMps = 8.3; // ~30 km/h
        break;
      case 'train':
        speedMps = 13.9; // ~50 km/h
        break;
      case 'car':
      default:
        speedMps = 11.1; // ~40 km/h
        break;
    }
    
    const seconds = meters / speedMps;
    if (seconds < 60) return 'Less than a minute';
    if (seconds < 3600) return `${Math.round(seconds / 60)} min`;
    return `${Math.round(seconds / 3600)} hr ${Math.round((seconds % 3600) / 60)} min`;
  };
  
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Active Trip</Text>
        <TouchableOpacity
          style={[styles.alarmButton, isAlarmActive ? styles.alarmButtonActive : {}]}
          onPress={onToggleAlarm}
        >
          {isAlarmActive ? (
            <Bell size={dimensions.icon.md} color={colors.card} />
          ) : (
            <BellOff size={dimensions.icon.md} color={colors.textMuted} />
          )}
        </TouchableOpacity>
      </View>
      
      <View style={styles.destinationContainer}>
        <Navigation size={dimensions.icon.md} color={colors.primary} style={styles.icon} />
        <View style={styles.destinationInfo}>
          <Text style={styles.destinationName}>{trip.destination.name}</Text>
          <Text style={styles.destinationAddress}>{trip.destination.address}</Text>
        </View>
      </View>
      
      <View style={styles.statsContainer}>
        <View style={styles.statItem}>
          <Text style={styles.statLabel}>Distance</Text>
          <Text style={styles.statValue}>{formatDistance(distance)}</Text>
        </View>
        
        <View style={styles.statDivider} />
        
        <View style={styles.statItem}>
          <Text style={styles.statLabel}>ETA</Text>
          <Text style={styles.statValue}>{getEstimatedTime(distance, trip.travelMode)}</Text>
        </View>
        
        <View style={styles.statDivider} />
        
        <View style={styles.statItem}>
          <Text style={styles.statLabel}>Alarm at</Text>
          <Text style={styles.statValue}>{formatDistance(trip.alarmDistance)}</Text>
        </View>
      </View>
      
      <TouchableOpacity style={styles.completeButton} onPress={onCompleteTrip}>
        <Check size={dimensions.icon.md} color={colors.card} />
        <Text style={styles.completeButtonText}>Complete Trip</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.card,
    borderRadius: dimensions.borderRadius.lg,
    padding: dimensions.spacing.lg,
    margin: dimensions.spacing.md,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: dimensions.spacing.md,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text,
  },
  alarmButton: {
    padding: dimensions.spacing.sm,
    borderRadius: dimensions.borderRadius.md,
    backgroundColor: colors.backgroundDark,
  },
  alarmButtonActive: {
    backgroundColor: colors.primary,
  },
  destinationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.backgroundDark,
    borderRadius: dimensions.borderRadius.md,
    padding: dimensions.spacing.md,
    marginBottom: dimensions.spacing.lg,
  },
  icon: {
    marginRight: dimensions.spacing.md,
  },
  destinationInfo: {
    flex: 1,
  },
  destinationName: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.text,
    marginBottom: dimensions.spacing.xs,
  },
  destinationAddress: {
    fontSize: 14,
    color: colors.textLight,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: dimensions.spacing.lg,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statDivider: {
    width: 1,
    backgroundColor: colors.border,
  },
  statLabel: {
    fontSize: 12,
    color: colors.textMuted,
    marginBottom: dimensions.spacing.xs,
  },
  statValue: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.text,
  },
  completeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.success,
    borderRadius: dimensions.borderRadius.md,
    paddingVertical: dimensions.spacing.md,
  },
  completeButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.card,
    marginLeft: dimensions.spacing.sm,
  },
});