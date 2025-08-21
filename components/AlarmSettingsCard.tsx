import React, { useState } from 'react';
import { View, Text, StyleSheet, Switch, TouchableOpacity, Platform } from 'react-native';
import { Bell, Vibrate, Volume2, MapPin, Clock } from 'lucide-react-native';
import { colors } from '@/constants/Colors';
import { dimensions } from '@/constants/dimensions';
import { AlarmSettings, TravelMode } from '@/types/location';
import { TravelModeSelector } from './TravelModeSelector';

interface AlarmSettingsCardProps {
  settings: AlarmSettings;
  onUpdateSettings: (settings: Partial<AlarmSettings>) => void;
  onStartTrip: (travelMode: TravelMode) => void;
}

export const AlarmSettingsCard: React.FC<AlarmSettingsCardProps> = ({
  settings,
  onUpdateSettings,
  onStartTrip,
}) => {
  const [selectedTravelMode, setSelectedTravelMode] = useState<TravelMode>('car');
  
  const distanceOptions = [
    { label: '100m', value: 100 },
    { label: '500m', value: 500 },
    { label: '1km', value: 1000 },
    { label: '2km', value: 2000 },
  ];
  
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Alarm Settings</Text>
      
      <View style={styles.settingRow}>
        <View style={styles.settingIconContainer}>
          <Bell size={dimensions.icon.md} color={colors.primary} />
        </View>
        <Text style={styles.settingLabel}>Sound</Text>
        <Switch
          value={settings.sound}
          onValueChange={(value) => onUpdateSettings({ sound: value })}
          trackColor={{ false: colors.border, true: colors.primary }}
          thumbColor={Platform.OS === 'ios' ? undefined : colors.card}
        />
      </View>
      
      <View style={styles.settingRow}>
        <View style={styles.settingIconContainer}>
          <Vibrate size={dimensions.icon.md} color={colors.primary} />
        </View>
        <Text style={styles.settingLabel}>Vibration</Text>
        <Switch
          value={settings.vibration}
          onValueChange={(value) => onUpdateSettings({ vibration: value })}
          trackColor={{ false: colors.border, true: colors.primary }}
          thumbColor={Platform.OS === 'ios' ? undefined : colors.card}
        />
      </View>
      
      <View style={styles.settingRow}>
        <View style={styles.settingIconContainer}>
          <Volume2 size={dimensions.icon.md} color={colors.primary} />
        </View>
        <Text style={styles.settingLabel}>Volume</Text>
        <View style={styles.volumeButtons}>
          {[0.2, 0.4, 0.6, 0.8, 1].map((volume) => (
            <TouchableOpacity
              key={volume}
              style={[
                styles.volumeButton,
                settings.volume >= volume && styles.volumeButtonActive,
              ]}
              onPress={() => onUpdateSettings({ volume })}
            />
          ))}
        </View>
      </View>
      
      <View style={styles.settingRow}>
        <View style={styles.settingIconContainer}>
          <MapPin size={dimensions.icon.md} color={colors.primary} />
        </View>
        <Text style={styles.settingLabel}>Alert Distance</Text>
      </View>
      
      <View style={styles.distanceContainer}>
        {distanceOptions.map((option) => (
          <TouchableOpacity
            key={option.value}
            style={[
              styles.distanceButton,
              settings.distance === option.value && styles.distanceButtonActive,
            ]}
            onPress={() => onUpdateSettings({ distance: option.value })}
          >
            <Text
              style={[
                styles.distanceButtonText,
                settings.distance === option.value && styles.distanceButtonTextActive,
              ]}
            >
              {option.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
      
      <View style={styles.divider} />
      
      <Text style={styles.sectionTitle}>Travel Mode</Text>
      <TravelModeSelector
        selectedMode={selectedTravelMode}
        onSelectMode={setSelectedTravelMode}
      />
      
      <TouchableOpacity
        style={styles.startButton}
        onPress={() => onStartTrip(selectedTravelMode)}
      >
        <Clock size={dimensions.icon.md} color={colors.card} />
        <Text style={styles.startButtonText}>Start Trip</Text>
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
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: dimensions.spacing.lg,
  },
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: dimensions.spacing.md,
  },
  settingIconContainer: {
    width: 40,
    alignItems: 'center',
  },
  settingLabel: {
    flex: 1,
    fontSize: 16,
    color: colors.text,
  },
  volumeButtons: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  volumeButton: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: colors.border,
    marginLeft: dimensions.spacing.xs,
  },
  volumeButtonActive: {
    backgroundColor: colors.primary,
  },
  distanceContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: dimensions.spacing.lg,
  },
  distanceButton: {
    paddingVertical: dimensions.spacing.sm,
    paddingHorizontal: dimensions.spacing.md,
    borderRadius: dimensions.borderRadius.md,
    backgroundColor: colors.backgroundDark,
    alignItems: 'center',
    justifyContent: 'center',
  },
  distanceButtonActive: {
    backgroundColor: colors.primary,
  },
  distanceButtonText: {
    fontSize: 14,
    color: colors.text,
  },
  distanceButtonTextActive: {
    color: colors.card,
    fontWeight: '500',
  },
  divider: {
    height: 1,
    backgroundColor: colors.border,
    marginVertical: dimensions.spacing.lg,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.text,
    marginBottom: dimensions.spacing.md,
  },
  startButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primary,
    borderRadius: dimensions.borderRadius.md,
    paddingVertical: dimensions.spacing.md,
    marginTop: dimensions.spacing.lg,
  },
  startButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.card,
    marginLeft: dimensions.spacing.sm,
  },
});