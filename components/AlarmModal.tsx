import React, { useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, Platform } from 'react-native';
import { Bell, Clock, X, ZapOff } from 'lucide-react-native';
import { colors } from '@/constants/Colors';
import { dimensions } from '@/constants/dimensions';
import * as Haptics from 'expo-haptics';

interface AlarmModalProps {
  visible: boolean;
  destination: string;
  onSnooze: () => void;
  onStop: () => void;
}

export const AlarmModal: React.FC<AlarmModalProps> = ({
  visible,
  destination,
  onSnooze,
  onStop,
}) => {
  // Trigger haptic feedback when the alarm is shown
  useEffect(() => {
    if (visible && Platform.OS !== 'web') {
      const triggerHaptics = async () => {
        await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      };
      
      triggerHaptics();
      
      // Repeat haptics every 2 seconds
      const interval = setInterval(() => {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      }, 2000);
      
      return () => clearInterval(interval);
    }
  }, [visible]);
  
  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="slide"
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContainer}>
          <View style={styles.alarmIconContainer}>
            <Bell size={dimensions.icon.xl} color={colors.card} />
          </View>
          
          <Text style={styles.alarmTitle}>Wake Up!</Text>
          <Text style={styles.alarmMessage}>
            You are approaching your destination:
          </Text>
          <Text style={styles.destinationText}>{destination}</Text>
          
          <View style={styles.buttonsContainer}>
            <TouchableOpacity
              style={[styles.button, styles.snoozeButton]}
              onPress={onSnooze}
            >
              <Clock size={dimensions.icon.md} color={colors.primary} />
              <Text style={styles.snoozeButtonText}>Snooze</Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={[styles.button, styles.stopButton]}
              onPress={onStop}
            >
              <ZapOff size={dimensions.icon.md} color={colors.card} />
              <Text style={styles.stopButtonText}>Stop</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    width: '80%',
    backgroundColor: colors.card,
    borderRadius: dimensions.borderRadius.lg,
    padding: dimensions.spacing.xl,
    alignItems: 'center',
  },
  alarmIconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: dimensions.spacing.lg,
  },
  alarmTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: dimensions.spacing.md,
  },
  alarmMessage: {
    fontSize: 16,
    color: colors.textLight,
    textAlign: 'center',
    marginBottom: dimensions.spacing.sm,
  },
  destinationText: {
    fontSize: 18,
    fontWeight: '500',
    color: colors.primary,
    textAlign: 'center',
    marginBottom: dimensions.spacing.xl,
  },
  buttonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: dimensions.spacing.md,
    paddingHorizontal: dimensions.spacing.lg,
    borderRadius: dimensions.borderRadius.md,
    flex: 1,
    marginHorizontal: dimensions.spacing.xs,
  },
  snoozeButton: {
    backgroundColor: colors.backgroundDark,
    borderWidth: 1,
    borderColor: colors.primary,
  },
  snoozeButtonText: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.primary,
    marginLeft: dimensions.spacing.sm,
  },
  stopButton: {
    backgroundColor: colors.primary,
  },
  stopButtonText: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.card,
    marginLeft: dimensions.spacing.sm,
  },
});