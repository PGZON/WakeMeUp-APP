import { useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { v4 as uuidv4 } from "uuid";
import * as Location from "expo-location";
import { Platform, Alert } from "react-native";
import { saveAlarms, getAlarms } from '@/lib/storage';

// Define types
interface AlarmLocation {
  name: string;
  address: string;
  latitude: number;
  longitude: number;
}

export interface Alarm {
  id: string;
  name: string;
  location: AlarmLocation;
  radius: number; // in meters
  sound: string;
  vibration: boolean;
  message: string;
  active: boolean;
  tripId?: string;
  createdAt: string;
  updatedAt: string;
}

export function useAlarms() {
  const [alarms, setAlarms] = useState<Alarm[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeAlarms, setActiveAlarms] = useState<Alarm[]>([]);
  const [currentLocation, setCurrentLocation] = useState<Location.LocationObject | null>(null);
  const [locationSubscription, setLocationSubscription] = useState<Location.LocationSubscription | null>(null);

  // Load alarms from storage on mount
  useEffect(() => {
    loadAlarms();
  }, []);

  const loadAlarms = async () => {
    try {
      const storedAlarms = await getAlarms();
      const alarmsArray = storedAlarms || [];
      setAlarms(alarmsArray);
      
      // Set active alarms
      const active = alarmsArray.filter((alarm: Alarm) => alarm.active);
      setActiveAlarms(active);
    } catch (error) {
      console.error('Error loading alarms:', error);
      setAlarms([]);
      setActiveAlarms([]);
    } finally {
      setIsLoading(false);
    }
  };

  // Start location tracking if there are active alarms
  useEffect(() => {
    if (activeAlarms.length > 0) {
      startLocationTracking();
    } else {
      stopLocationTracking();
    }

    return () => {
      stopLocationTracking();
    };
  }, [activeAlarms]);

  // Check if user is near any active alarm locations
  useEffect(() => {
    if (!currentLocation || activeAlarms.length === 0) return;

    const checkProximity = async () => {
      for (const alarm of activeAlarms) {
        const distance = calculateDistance(
          currentLocation.coords.latitude,
          currentLocation.coords.longitude,
          alarm.location.latitude,
          alarm.location.longitude
        );

        // If user is within the alarm radius, trigger alert
        if (distance <= alarm.radius / 1000) { // Convert meters to kilometers
          triggerAlarmAlert(alarm);
          
          // Deactivate the alarm after triggering
          await toggleAlarmActive(alarm.id, false);
        }
      }
    };

    checkProximity();
  }, [currentLocation, activeAlarms]);

  // Start location tracking
  const startLocationTracking = async () => {
    try {
      if (Platform.OS === "web") {
        // Web doesn't support background location tracking
        const location = await Location.getCurrentPositionAsync({});
        setCurrentLocation(location);
        return;
      }

      // Stop any existing subscription
      if (locationSubscription) {
        locationSubscription.remove();
      }

      // Start watching location
      const subscription = await Location.watchPositionAsync(
        {
          accuracy: Location.Accuracy.High,
          distanceInterval: 10, // Update every 10 meters
        },
        (location) => {
          setCurrentLocation(location);
        }
      );

      setLocationSubscription(subscription);
    } catch (error) {
      console.error("Error starting location tracking:", error);
    }
  };

  // Stop location tracking
  const stopLocationTracking = () => {
    if (locationSubscription) {
      locationSubscription.remove();
      setLocationSubscription(null);
    }
  };

  // Calculate distance between two coordinates using Haversine formula
  const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
    const R = 6371; // Radius of the earth in km
    const dLat = deg2rad(lat2 - lat1);
    const dLon = deg2rad(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c; // Distance in km
    return distance;
  };

  const deg2rad = (deg: number) => {
    return deg * (Math.PI / 180);
  };

  // Trigger alarm alert
  const triggerAlarmAlert = (alarm: Alarm) => {
    Alert.alert(
      `Alarm: ${alarm.name}`,
      alarm.message,
      [{ text: "OK" }]
    );
  };

  // Create a new alarm
  const createAlarm = async (alarmData: any) => {
    try {
      const newAlarm = {
        ...alarmData,
        id: Date.now().toString(),
        createdAt: new Date().toISOString(),
      };
      const updatedAlarms = [...alarms, newAlarm];
      await saveAlarms(updatedAlarms);
      setAlarms(updatedAlarms);
      return newAlarm;
    } catch (error) {
      console.error('Error creating alarm:', error);
      throw error;
    }
  };

  // Get a single alarm
  const getAlarm = async (id: string) => {
    return alarms?.find((alarm) => alarm.id === id);
  };

  // Update an existing alarm
  const updateAlarm = async (id: string, updates: any) => {
    try {
      const updatedAlarms = alarms.map(alarm =>
        alarm.id === id ? { ...alarm, ...updates, updatedAt: new Date().toISOString() } : alarm
      );
      await saveAlarms(updatedAlarms);
      setAlarms(updatedAlarms);
    } catch (error) {
      console.error('Error updating alarm:', error);
      throw error;
    }
  };

  // Delete an alarm
  const deleteAlarm = async (id: string) => {
    try {
      const updatedAlarms = alarms.filter(alarm => alarm.id !== id);
      await saveAlarms(updatedAlarms);
      setAlarms(updatedAlarms);
    } catch (error) {
      console.error('Error deleting alarm:', error);
      throw error;
    }
  };

  // Toggle alarm active state
  const toggleAlarmActive = async (id: string, active: boolean) => {
    await updateAlarm(id, { active });
  };

  return {
    alarms,
    isLoading,
    activeAlarms,
    createAlarm,
    getAlarm,
    updateAlarm,
    deleteAlarm,
    toggleAlarmActive,
    loadAlarms,
  };
}