import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Platform, ActivityIndicator } from 'react-native';
import { MapPin, Navigation } from 'lucide-react-native';
import { useTheme } from '@/context/ThemeContext';
import WebView from 'react-native-webview';

interface MapViewProps {
  currentLocation: { latitude: number; longitude: number } | null;
  destination: { latitude: number; longitude: number; name: string } | null;
}

export const MapView: React.FC<MapViewProps> = ({ currentLocation, destination }) => {
  const { theme } = useTheme();
  const [loading, setLoading] = useState(true);

  // Generate Google Maps URL
  const getGoogleMapsUrl = () => {
    let url = 'https://www.google.com/maps/embed/v1/view?key=AIzaSyD-9tSrke72PouQMnMX-a7eZSW0jkFMBWY'; // This is a placeholder key, you should use your own
    
    if (destination) {
      url = `https://www.google.com/maps/embed/v1/place?key=AIzaSyD-9tSrke72PouQMnMX-a7eZSW0jkFMBWY&q=${destination.latitude},${destination.longitude}`;
    } else if (currentLocation) {
      url = `https://www.google.com/maps/embed/v1/view?key=AIzaSyD-9tSrke72PouQMnMX-a7eZSW0jkFMBWY&center=${currentLocation.latitude},${currentLocation.longitude}&zoom=15`;
    }
    
    return url;
  };

  // Generate directions URL if both locations are available
  const getDirectionsUrl = () => {
    if (currentLocation && destination) {
      return `https://www.google.com/maps/embed/v1/directions?key=AIzaSyD-9tSrke72PouQMnMX-a7eZSW0jkFMBWY&origin=${currentLocation.latitude},${currentLocation.longitude}&destination=${destination.latitude},${destination.longitude}&mode=driving`;
    }
    return null;
  };

  const directionsUrl = getDirectionsUrl();
  const mapUrl = directionsUrl || getGoogleMapsUrl();

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      overflow: 'hidden',
      borderRadius: 12,
    },
    mapContainer: {
      flex: 1,
    },
    webView: {
      flex: 1,
    },
    mapPlaceholder: {
      flex: 1,
      backgroundColor: theme.colors.backgroundSecondary || theme.colors.card,
      justifyContent: 'center',
      alignItems: 'center',
      padding: 16,
    },
    mapPlaceholderText: {
      fontSize: 18,
      fontWeight: 'bold',
      color: theme.colors.textSecondary,
      marginBottom: 16,
    },
    locationInfo: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: theme.colors.card,
      padding: 12,
      borderRadius: 12,
      marginVertical: 8,
      width: '100%',
    },
    locationText: {
      marginLeft: 8,
      color: theme.colors.text,
      fontSize: 14,
    },
    loadingContainer: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: 'rgba(0,0,0,0.3)',
    },
  });

  // For web, we'll use a different approach
  if (Platform.OS === 'web') {
    return (
      <View style={styles.container}>
        <iframe
          src={mapUrl}
          width="100%"
          height="100%"
          style={{ border: 0 }}
          allowFullScreen
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.mapContainer}>
        <WebView
          source={{ uri: mapUrl }}
          style={styles.webView}
          onLoadStart={() => setLoading(true)}
          onLoadEnd={() => setLoading(false)}
        />
        {loading && (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={theme.colors.primary} />
          </View>
        )}
      </View>
    </View>
  );
};