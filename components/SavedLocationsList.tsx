import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { MapPin, Star, StarOff, Trash2 } from 'lucide-react-native';
import { colors } from '@/constants/colors';
import { dimensions } from '@/constants/dimensions';
import { Location } from '@/types/location';

interface SavedLocationsListProps {
  locations: Location[];
  onSelectLocation: (location: Location) => void;
  onToggleFavorite: (id: string) => void;
  onDeleteLocation: (id: string) => void;
}

export const SavedLocationsList: React.FC<SavedLocationsListProps> = ({
  locations,
  onSelectLocation,
  onToggleFavorite,
  onDeleteLocation,
}) => {
  if (locations.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>No saved locations yet</Text>
        <Text style={styles.emptySubtext}>Search for a location to save it</Text>
      </View>
    );
  }
  
  return (
    <FlatList
      data={locations}
      keyExtractor={(item) => item.id}
      contentContainerStyle={styles.listContainer}
      renderItem={({ item }) => (
        <TouchableOpacity
          style={styles.locationItem}
          onPress={() => onSelectLocation(item)}
        >
          <MapPin size={dimensions.icon.md} color={colors.primary} style={styles.locationIcon} />
          
          <View style={styles.locationInfo}>
            <Text style={styles.locationName}>{item.name}</Text>
            <Text style={styles.locationAddress}>{item.address}</Text>
          </View>
          
          <View style={styles.actionsContainer}>
            <TouchableOpacity
              style={styles.actionButton}
              onPress={() => onToggleFavorite(item.id)}
            >
              {item.isFavorite ? (
                <Star size={dimensions.icon.md} color={colors.warning} />
              ) : (
                <StarOff size={dimensions.icon.md} color={colors.textMuted} />
              )}
            </TouchableOpacity>
            
            <TouchableOpacity
              style={styles.actionButton}
              onPress={() => onDeleteLocation(item.id)}
            >
              <Trash2 size={dimensions.icon.md} color={colors.error} />
            </TouchableOpacity>
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
  locationItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.card,
    borderRadius: dimensions.borderRadius.md,
    padding: dimensions.spacing.md,
    marginBottom: dimensions.spacing.md,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
  },
  locationIcon: {
    marginRight: dimensions.spacing.md,
  },
  locationInfo: {
    flex: 1,
  },
  locationName: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.text,
    marginBottom: dimensions.spacing.xs,
  },
  locationAddress: {
    fontSize: 14,
    color: colors.textLight,
  },
  actionsContainer: {
    flexDirection: 'row',
  },
  actionButton: {
    padding: dimensions.spacing.sm,
    marginLeft: dimensions.spacing.sm,
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