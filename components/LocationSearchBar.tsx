import React, { useState } from 'react';
import { View, TextInput, StyleSheet, TouchableOpacity, Text, FlatList } from 'react-native';
import { Search, MapPin, X } from 'lucide-react-native';
import { colors } from '@/constants/Colors';
import { dimensions } from '@/constants/dimensions';
import { Location } from '@/types/location';

interface LocationSearchBarProps {
  onSelectLocation: (location: Location) => void;
  savedLocations: Location[];
}

export const LocationSearchBar: React.FC<LocationSearchBarProps> = ({ 
  onSelectLocation,
  savedLocations
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [showResults, setShowResults] = useState(false);
  
  // Mock search results - in a real app, this would call a geocoding API
  const mockSearchResults: Location[] = [
    {
      id: 'mock1',
      name: 'Central Station',
      address: '123 Main St, City',
      latitude: 40.7128,
      longitude: -74.006,
      isFavorite: false,
      createdAt: new Date().toISOString(),
    },
    {
      id: 'mock2',
      name: 'Downtown Mall',
      address: '456 Market St, City',
      latitude: 40.7138,
      longitude: -74.016,
      isFavorite: false,
      createdAt: new Date().toISOString(),
    },
    {
      id: 'mock3',
      name: 'City Park',
      address: '789 Park Ave, City',
      latitude: 40.7148,
      longitude: -74.026,
      isFavorite: false,
      createdAt: new Date().toISOString(),
    },
  ];
  
  // Filter locations based on search query
  const filteredLocations = searchQuery.length > 0
    ? [...mockSearchResults, ...savedLocations.filter(location => 
        location.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        location.address.toLowerCase().includes(searchQuery.toLowerCase())
      )]
    : savedLocations.filter(location => location.isFavorite);
  
  const handleClearSearch = () => {
    setSearchQuery('');
    setShowResults(false);
  };
  
  const handleSelectLocation = (location: Location) => {
    onSelectLocation(location);
    setSearchQuery(location.name);
    setShowResults(false);
  };
  
  // Render a single location item
  const renderLocationItem = ({ item }: { item: Location }) => (
    <TouchableOpacity 
      style={styles.resultItem}
      onPress={() => handleSelectLocation(item)}
    >
      <MapPin size={dimensions.icon.md} color={colors.primary} style={styles.resultIcon} />
      <View style={styles.resultTextContainer}>
        <Text style={styles.resultTitle}>{item.name}</Text>
        <Text style={styles.resultAddress}>{item.address}</Text>
      </View>
    </TouchableOpacity>
  );
  
  // Render empty state
  const renderEmptyComponent = () => (
    <View style={styles.emptyContainer}>
      <Text style={styles.emptyText}>No locations found</Text>
    </View>
  );
  
  return (
    <View style={styles.container}>
      <View style={styles.searchBarContainer}>
        <Search size={dimensions.icon.md} color={colors.textMuted} style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search for a destination..."
          value={searchQuery}
          onChangeText={(text) => {
            setSearchQuery(text);
            setShowResults(text.length > 0);
          }}
          onFocus={() => setShowResults(true)}
          placeholderTextColor={colors.textMuted}
        />
        {searchQuery.length > 0 && (
          <TouchableOpacity onPress={handleClearSearch} style={styles.clearButton}>
            <X size={dimensions.icon.sm} color={colors.textMuted} />
          </TouchableOpacity>
        )}
      </View>
      
      {showResults && (
        <View style={styles.resultsContainer}>
          <FlatList
            data={filteredLocations}
            keyExtractor={(item) => item.id}
            renderItem={renderLocationItem}
            ListEmptyComponent={renderEmptyComponent}
            nestedScrollEnabled={true}
            scrollEnabled={true}
            keyboardShouldPersistTaps="handled"
          />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    zIndex: 10,
  },
  searchBarContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.card,
    borderRadius: dimensions.borderRadius.md,
    paddingHorizontal: dimensions.spacing.md,
    paddingVertical: dimensions.spacing.sm,
    marginHorizontal: dimensions.spacing.md,
    marginVertical: dimensions.spacing.md,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  searchIcon: {
    marginRight: dimensions.spacing.sm,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: colors.text,
    paddingVertical: dimensions.spacing.sm,
  },
  clearButton: {
    padding: dimensions.spacing.xs,
  },
  resultsContainer: {
    backgroundColor: colors.card,
    borderRadius: dimensions.borderRadius.md,
    marginHorizontal: dimensions.spacing.md,
    marginTop: -dimensions.spacing.sm,
    marginBottom: dimensions.spacing.md,
    maxHeight: 300,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    zIndex: 20,
  },
  resultItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: dimensions.spacing.md,
    paddingVertical: dimensions.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  resultIcon: {
    marginRight: dimensions.spacing.md,
  },
  resultTextContainer: {
    flex: 1,
  },
  resultTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.text,
    marginBottom: dimensions.spacing.xs,
  },
  resultAddress: {
    fontSize: 14,
    color: colors.textLight,
  },
  emptyContainer: {
    padding: dimensions.spacing.lg,
    alignItems: 'center',
  },
  emptyText: {
    color: colors.textMuted,
    fontSize: 14,
  },
});