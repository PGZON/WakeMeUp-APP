import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { Clock, Navigation, Calendar } from 'lucide-react-native';
import { colors } from '@/constants/colors';
import { dimensions } from '@/constants/dimensions';
import { Trip } from '@/types/location';

interface TripHistoryListProps {
  trips: Trip[];
  onSelectTrip: (trip: Trip) => void;
}

export const TripHistoryList: React.FC<TripHistoryListProps> = ({
  trips,
  onSelectTrip,
}) => {
  if (trips.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>No trip history yet</Text>
        <Text style={styles.emptySubtext}>Your completed trips will appear here</Text>
      </View>
    );
  }
  
  // Format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString(undefined, {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };
  
  // Format time for display
  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString(undefined, {
      hour: '2-digit',
      minute: '2-digit',
    });
  };
  
  return (
    <FlatList
      data={trips}
      keyExtractor={(item) => item.id}
      contentContainerStyle={styles.listContainer}
      renderItem={({ item }) => (
        <TouchableOpacity
          style={styles.tripItem}
          onPress={() => onSelectTrip(item)}
        >
          <View style={styles.tripHeader}>
            <View style={styles.tripIconContainer}>
              <Navigation size={dimensions.icon.md} color={colors.card} />
            </View>
            <View style={styles.tripInfo}>
              <Text style={styles.tripDestination}>{item.destination.name}</Text>
              <Text style={styles.tripAddress}>{item.destination.address}</Text>
            </View>
          </View>
          
          <View style={styles.tripDetails}>
            <View style={styles.tripDetailItem}>
              <Calendar size={dimensions.icon.sm} color={colors.textMuted} style={styles.detailIcon} />
              <Text style={styles.detailText}>{formatDate(item.createdAt)}</Text>
            </View>
            
            <View style={styles.tripDetailItem}>
              <Clock size={dimensions.icon.sm} color={colors.textMuted} style={styles.detailIcon} />
              <Text style={styles.detailText}>{formatTime(item.createdAt)}</Text>
            </View>
          </View>
        </TouchableOpacity>
      )}
    />
  );
};

const styles = StyleSheet.create({
  listContainer: {
    padding: dimensions.spacing.md,
  },
  tripItem: {
    backgroundColor: colors.card,
    borderRadius: dimensions.borderRadius.md,
    marginBottom: dimensions.spacing.md,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
    overflow: 'hidden',
  },
  tripHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: dimensions.spacing.md,
  },
  tripIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: dimensions.spacing.md,
  },
  tripInfo: {
    flex: 1,
  },
  tripDestination: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.text,
    marginBottom: dimensions.spacing.xs,
  },
  tripAddress: {
    fontSize: 14,
    color: colors.textLight,
  },
  tripDetails: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: colors.border,
    padding: dimensions.spacing.md,
  },
  tripDetailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: dimensions.spacing.lg,
  },
  detailIcon: {
    marginRight: dimensions.spacing.xs,
  },
  detailText: {
    fontSize: 12,
    color: colors.textMuted,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: dimensions.spacing.xl,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '500',
    color: colors.text,
    marginBottom: dimensions.spacing.sm,
  },
  emptySubtext: {
    fontSize: 14,
    color: colors.textMuted,
    textAlign: 'center',
  },
});