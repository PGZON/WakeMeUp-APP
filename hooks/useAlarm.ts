import { useEffect } from 'react';
import { Platform } from 'react-native';
import * as Haptics from 'expo-haptics';
import { useLocationStore } from './useLocationStore';

export function useAlarm() {
  const { 
    isAlarmActive, 
    setAlarmActive, 
    alarmSettings, 
    activeTrip,
    endTrip
  } = useLocationStore();

  // Trigger the alarm based on settings
  const triggerAlarm = () => {
    if (!isAlarmActive || !activeTrip) return;

    // Vibration
    if (alarmSettings.vibration && Platform.OS !== 'web') {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      
      // Repeat vibration
      const interval = setInterval(() => {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      }, 2000);
      
      // Stop after 10 seconds
      setTimeout(() => {
        clearInterval(interval);
      }, 10000);
    }

    // Sound would be implemented here with expo-av
    // But we're keeping it simple for this implementation
    
    // For web, we can use a simple alert
    if (Platform.OS === 'web') {
      alert("You're approaching your destination!");
    }
  };

  // Stop the alarm
  const stopAlarm = () => {
    setAlarmActive(false);
  };

  // Snooze the alarm (reset it to trigger again in 1 minute)
  const snoozeAlarm = () => {
    stopAlarm();
    
    // Re-enable after 1 minute
    setTimeout(() => {
      setAlarmActive(true);
    }, 60000);
  };

  // Complete the trip
  const completeTrip = () => {
    stopAlarm();
    endTrip();
  };

  // Watch for alarm activation
  useEffect(() => {
    if (isAlarmActive) {
      triggerAlarm();
    }
  }, [isAlarmActive]);

  return {
    isAlarmActive,
    triggerAlarm,
    stopAlarm,
    snoozeAlarm,
    completeTrip,
  };
}