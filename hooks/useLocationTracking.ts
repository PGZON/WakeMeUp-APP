import { useState, useEffect, useRef } from 'react';
import { Platform } from 'react-native';
import * as Location from 'expo-location';
import { useLocationStore } from './useLocationStore';

export function useLocationTracking() {
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [permissionStatus, setPermissionStatus] = useState<Location.PermissionStatus | null>(null);
  const [isTracking, setIsTracking] = useState(false);
  const locationSubscription = useRef<Location.LocationSubscription | null>(null);
  
  const { 
    setCurrentLocation, 
    currentLocation,
    activeTrip,
    isAlarmActive,
    setAlarmActive
  } = useLocationStore();

  // Request location permissions
  const requestPermissions = async () => {
    if (Platform.OS === 'web') {
      // Web has a different permission model
      try {
        const position = await new Promise<GeolocationPosition>((resolve, reject) => {
          navigator.geolocation.getCurrentPosition(resolve, reject);
        });
        
        setPermissionStatus('granted' as Location.PermissionStatus);
        setCurrentLocation({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });
        return 'granted';
      } catch (error) {
        setErrorMsg('Permission to access location was denied');
        setPermissionStatus('denied' as Location.PermissionStatus);
        return 'denied';
      }
    } else {
      // Native permissions
      const { status } = await Location.requestForegroundPermissionsAsync();
      setPermissionStatus(status);
      
      if (status !== 'granted') {
        setErrorMsg('Permission to access location was denied');
      }
      
      return status;
    }
  };

  // Start tracking location
  const startTracking = async () => {
    if (Platform.OS === 'web') {
      // Web implementation
      const watchId = navigator.geolocation.watchPosition(
        (position) => {
          setCurrentLocation({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          });
          checkProximityToDestination({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          });
        },
        (error) => {
          setErrorMsg(error.message);
        },
        { enableHighAccuracy: true }
      );
      
      setIsTracking(true);
      return () => navigator.geolocation.clearWatch(watchId);
    } else {
      // Native implementation
      try {
        const subscription = await Location.watchPositionAsync(
          {
            accuracy: Location.Accuracy.High,
            timeInterval: 5000, // minimum time to wait between updates (ms)
          },
          (location) => {
            setCurrentLocation({
              latitude: location.coords.latitude,
              longitude: location.coords.longitude,
            });
            checkProximityToDestination({
              latitude: location.coords.latitude,
              longitude: location.coords.longitude,
            });
          }
        );
        
        locationSubscription.current = subscription;
        setIsTracking(true);
        return () => subscription.remove();
      } catch (error) {
        if (error instanceof Error) {
          setErrorMsg(error.message);
        } else {
          setErrorMsg('An unknown error occurred');
        }
        return () => {};
      }
    }
  };

  // Stop tracking location
  const stopTracking = () => {
    if (Platform.OS === 'web') {
      // Nothing to do for web as we return the cleanup function from startTracking
    } else if (locationSubscription.current) {
      locationSubscription.current.remove();
      locationSubscription.current = null;
    }
    
    setIsTracking(false);
  };

  // Calculate distance between two coordinates in meters
  const calculateDistance = (
    lat1: number, 
    lon1: number, 
    lat2: number, 
    lon2: number
  ): number => {
    const R = 6371e3; // Earth's radius in meters
    const φ1 = (lat1 * Math.PI) / 180;
    const φ2 = (lat2 * Math.PI) / 180;
    const Δφ = ((lat2 - lat1) * Math.PI) / 180;
    const Δλ = ((lon2 - lon1) * Math.PI) / 180;

    const a =
      Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
      Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c;

    return distance;
  };

  // Check if we're close to the destination
  const checkProximityToDestination = (location: { latitude: number; longitude: number }) => {
    if (!activeTrip || !isAlarmActive) return;

    const { destination, alarmDistance } = activeTrip;
    
    const distance = calculateDistance(
      location.latitude,
      location.longitude,
      destination.latitude,
      destination.longitude
    );

    // If we're within the alarm distance, trigger the alarm
    if (distance <= alarmDistance) {
      setAlarmActive(true);
    }
  };

  // Get current location once
  const getCurrentLocation = async () => {
    if (Platform.OS === 'web') {
      try {
        const position = await new Promise<GeolocationPosition>((resolve, reject) => {
          navigator.geolocation.getCurrentPosition(resolve, reject);
        });
        
        setCurrentLocation({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });
        
        return {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        };
      } catch (error) {
        if (error instanceof Error) {
          setErrorMsg(error.message);
        } else {
          setErrorMsg('An unknown error occurred');
        }
        return null;
      }
    } else {
      try {
        const location = await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.High,
        });
        
        setCurrentLocation({
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
        });
        
        return {
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
        };
      } catch (error) {
        if (error instanceof Error) {
          setErrorMsg(error.message);
        } else {
          setErrorMsg('An unknown error occurred');
        }
        return null;
      }
    }
  };

  // Initialize location on component mount
  useEffect(() => {
    (async () => {
      await requestPermissions();
      await getCurrentLocation();
    })();

    // Cleanup on unmount
    return () => {
      if (locationSubscription.current) {
        locationSubscription.current.remove();
      }
    };
  }, []);

  return {
    currentLocation,
    errorMsg,
    permissionStatus,
    isTracking,
    startTracking,
    stopTracking,
    requestPermissions,
    getCurrentLocation,
  };
}