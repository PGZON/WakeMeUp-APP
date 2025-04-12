import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Train, Bus, Car, PersonStanding } from 'lucide-react-native';
import { colors } from '@/constants/colors';
import { dimensions } from '@/constants/dimensions';
import { TravelMode } from '@/types/location';

interface TravelModeSelectorProps {
  selectedMode: TravelMode;
  onSelectMode: (mode: TravelMode) => void;
}

export const TravelModeSelector: React.FC<TravelModeSelectorProps> = ({
  selectedMode,
  onSelectMode,
}) => {
  const travelModes: { id: TravelMode; icon: React.ReactNode; label: string }[] = [
    {
      id: 'train',
      icon: <Train size={dimensions.icon.md} color={selectedMode === 'train' ? colors.card : colors.text} />,
      label: 'Train',
    },
    {
      id: 'bus',
      icon: <Bus size={dimensions.icon.md} color={selectedMode === 'bus' ? colors.card : colors.text} />,
      label: 'Bus',
    },
    {
      id: 'car',
      icon: <Car size={dimensions.icon.md} color={selectedMode === 'car' ? colors.card : colors.text} />,
      label: 'Car',
    },
    {
      id: 'walking',
      icon: <PersonStanding size={dimensions.icon.md} color={selectedMode === 'walking' ? colors.card : colors.text} />,
      label: 'Walking',
    },
  ];
  
  return (
    <View style={styles.container}>
      {travelModes.map((mode) => (
        <TouchableOpacity
          key={mode.id}
          style={[
            styles.modeButton,
            selectedMode === mode.id && styles.modeButtonActive,
          ]}
          onPress={() => onSelectMode(mode.id)}
        >
          {mode.icon}
          <Text
            style={[
              styles.modeLabel,
              selectedMode === mode.id && styles.modeLabelActive,
            ]}
          >
            {mode.label}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  modeButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: dimensions.spacing.md,
    marginHorizontal: dimensions.spacing.xs,
    borderRadius: dimensions.borderRadius.md,
    backgroundColor: colors.backgroundDark,
  },
  modeButtonActive: {
    backgroundColor: colors.primary,
  },
  modeLabel: {
    marginTop: dimensions.spacing.xs,
    fontSize: 12,
    color: colors.text,
  },
  modeLabelActive: {
    color: colors.card,
    fontWeight: '500',
  },
});