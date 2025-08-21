import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useBackend } from '@/context/BackendContext';
import { useTheme } from '@/context/ThemeContext';
import { WifiOff, Wifi, RefreshCw } from 'lucide-react-native';

interface BackendStatusProps {
  showRefresh?: boolean;
}

export function BackendStatus({ showRefresh = true }: BackendStatusProps) {
  const { isConnected, isLoading, checkBackendConnection } = useBackend();
  const { theme } = useTheme();

  const handleRefresh = () => {
    checkBackendConnection();
  };

  const styles = StyleSheet.create({
    container: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: 8,
      paddingVertical: 4,
      backgroundColor: isConnected 
        ? '#4CAF5020'
        : '#F4433620',
      borderRadius: 16,
    },
    indicator: {
      width: 8,
      height: 8,
      borderRadius: 4,
      marginRight: 6,
      backgroundColor: isConnected 
        ? '#4CAF50'
        : isLoading 
          ? '#FFC107'
          : '#F44336',
    },
    text: {
      fontSize: 12,
      color: isConnected
        ? '#4CAF50'
        : isLoading
          ? '#FFC107'
          : '#F44336',
    },
    refreshButton: {
      marginLeft: 8,
      padding: 4,
    }
  });

  return (
    <View style={styles.container}>
      <View style={styles.indicator} />
      <Text style={styles.text}>
        {isLoading ? 'Connecting...' : isConnected ? 'Connected' : 'Offline Mode'}
      </Text>
      {showRefresh && (
        <TouchableOpacity 
          style={styles.refreshButton}
          onPress={handleRefresh}
          disabled={isLoading}
        >
          <RefreshCw 
            size={14} 
            color={isLoading ? '#9E9E9E' : '#2196F3'} 
          />
        </TouchableOpacity>
      )}
    </View>
  );
}
