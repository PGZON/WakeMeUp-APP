import React, { useState } from 'react';
import { View, Text, StyleSheet, Switch, TouchableOpacity, ScrollView, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Stack } from 'expo-router';
import { Bell, Vibrate, Volume2, MapPin, Clock, Trash2, Info, HelpCircle } from 'lucide-react-native';
import { colors } from '../../constants/Colors';
import { dimensions } from '../../constants/dimensions';
import { useLocationStore } from '../../hooks/useLocationStore';

export default function SettingsScreen() {
  const { alarmSettings, updateAlarmSettings } = useLocationStore();
  const [showConfirmClear, setShowConfirmClear] = useState(false);
  
  // Clear all data
  const handleClearAllData = () => {
    // In a real app, this would clear all data
    setShowConfirmClear(false);
  };
  
  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <Stack.Screen options={{ title: "Settings" }} />
      
      <ScrollView style={styles.scrollView}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Alarm Settings</Text>
          
          <View style={styles.settingRow}>
            <View style={styles.settingIconContainer}>
              <Bell size={dimensions.icon.md} color={colors.primary} />
            </View>
            <Text style={styles.settingLabel}>Sound</Text>
            <Switch
              value={alarmSettings.sound}
              onValueChange={(value) => updateAlarmSettings({ sound: value })}
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
              value={alarmSettings.vibration}
              onValueChange={(value) => updateAlarmSettings({ vibration: value })}
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
                    alarmSettings.volume >= volume && styles.volumeButtonActive,
                  ]}
                  onPress={() => updateAlarmSettings({ volume })}
                />
              ))}
            </View>
          </View>
          
          <View style={styles.settingRow}>
            <View style={styles.settingIconContainer}>
              <MapPin size={dimensions.icon.md} color={colors.primary} />
            </View>
            <Text style={styles.settingLabel}>Default Alert Distance</Text>
          </View>
          
          <View style={styles.distanceContainer}>
            {[
              { label: '100m', value: 100 },
              { label: '500m', value: 500 },
              { label: '1km', value: 1000 },
              { label: '2km', value: 2000 },
            ].map((option) => (
              <TouchableOpacity
                key={option.value}
                style={[
                  styles.distanceButton,
                  alarmSettings.distance === option.value && styles.distanceButtonActive,
                ]}
                onPress={() => updateAlarmSettings({ distance: option.value })}
              >
                <Text
                  style={[
                    styles.distanceButtonText,
                    alarmSettings.distance === option.value && styles.distanceButtonTextActive,
                  ]}
                >
                  {option.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>App Settings</Text>
          
          <TouchableOpacity style={styles.actionButton}>
            <View style={styles.actionIconContainer}>
              <Info size={dimensions.icon.md} color={colors.card} />
            </View>
            <Text style={styles.actionButtonText}>About WakeMeUp</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.actionButton}>
            <View style={styles.actionIconContainer}>
              <HelpCircle size={dimensions.icon.md} color={colors.card} />
            </View>
            <Text style={styles.actionButtonText}>Help & Support</Text>
          </TouchableOpacity>
          
          {showConfirmClear ? (
            <View style={styles.confirmContainer}>
              <Text style={styles.confirmText}>Are you sure? This will delete all your saved locations and trip history.</Text>
              <View style={styles.confirmButtons}>
                <TouchableOpacity
                  style={[styles.confirmButton, styles.cancelButton]}
                  onPress={() => setShowConfirmClear(false)}
                >
                  <Text style={styles.cancelButtonText}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.confirmButton, styles.confirmDeleteButton]}
                  onPress={handleClearAllData}
                >
                  <Text style={styles.confirmDeleteButtonText}>Delete All</Text>
                </TouchableOpacity>
              </View>
            </View>
          ) : (
            <TouchableOpacity
              style={[styles.actionButton, styles.dangerButton]}
              onPress={() => setShowConfirmClear(true)}
            >
              <View style={[styles.actionIconContainer, styles.dangerIconContainer]}>
                <Trash2 size={dimensions.icon.md} color={colors.card} />
              </View>
              <Text style={styles.dangerButtonText}>Clear All Data</Text>
            </TouchableOpacity>
          )}
        </View>
        
        <View style={styles.versionContainer}>
          <Text style={styles.versionText}>WakeMeUp v1.0.0</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.backgroundDark,
  },
  scrollView: {
    flex: 1,
  },
  section: {
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
  sectionTitle: {
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
    marginBottom: dimensions.spacing.md,
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
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: dimensions.spacing.md,
    marginBottom: dimensions.spacing.md,
  },
  actionIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: dimensions.spacing.md,
  },
  actionButtonText: {
    fontSize: 16,
    color: colors.text,
  },
  dangerButton: {
    marginTop: dimensions.spacing.md,
  },
  dangerIconContainer: {
    backgroundColor: colors.error,
  },
  dangerButtonText: {
    fontSize: 16,
    color: colors.error,
  },
  confirmContainer: {
    marginTop: dimensions.spacing.md,
    padding: dimensions.spacing.md,
    backgroundColor: colors.backgroundDark,
    borderRadius: dimensions.borderRadius.md,
  },
  confirmText: {
    fontSize: 14,
    color: colors.text,
    marginBottom: dimensions.spacing.md,
    textAlign: 'center',
  },
  confirmButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  confirmButton: {
    flex: 1,
    paddingVertical: dimensions.spacing.md,
    borderRadius: dimensions.borderRadius.md,
    alignItems: 'center',
    marginHorizontal: dimensions.spacing.xs,
  },
  cancelButton: {
    backgroundColor: colors.backgroundDark,
    borderWidth: 1,
    borderColor: colors.border,
  },
  cancelButtonText: {
    fontSize: 14,
    color: colors.text,
    fontWeight: '500',
  },
  confirmDeleteButton: {
    backgroundColor: colors.error,
  },
  confirmDeleteButtonText: {
    fontSize: 14,
    color: colors.card,
    fontWeight: '500',
  },
  versionContainer: {
    padding: dimensions.spacing.lg,
    alignItems: 'center',
  },
  versionText: {
    fontSize: 14,
    color: colors.textMuted,
  },
});