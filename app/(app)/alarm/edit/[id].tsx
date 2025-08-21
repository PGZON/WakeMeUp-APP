import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Switch, TextInput, ActivityIndicator } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useTheme } from '@/context/ThemeContext';
import { useAlarms } from '@/hooks/useAlarms';
import { Bell, MapPin, Volume2, Vibrate } from 'lucide-react-native';
import { SliderInput } from '@/components/common/SliderInput';
import { LocationPicker } from '@/components/alarms/LocationPicker';
import { SoundPicker } from '@/components/alarms/SoundPicker';

export default function EditAlarmScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const { theme } = useTheme();
  const { getAlarm, updateAlarm, deleteAlarm } = useAlarms();
  
  const [isLoading, setIsLoading] = useState(true);
  const [alarm, setAlarm] = useState<any>(null);
  const [name, setName] = useState('');
  const [radius, setRadius] = useState(100);
  const [sound, setSound] = useState('default');
  const [vibration, setVibration] = useState(true);
  const [message, setMessage] = useState('');
  const [active, setActive] = useState(true);

  useEffect(() => {
    const loadAlarm = async () => {
      if (typeof id === 'string') {
        const loadedAlarm = await getAlarm(id);
        if (loadedAlarm) {
          setAlarm(loadedAlarm);
          setName(loadedAlarm.name);
          setRadius(loadedAlarm.radius);
          setSound(loadedAlarm.sound);
          setVibration(loadedAlarm.vibration);
          setMessage(loadedAlarm.message || '');
          setActive(loadedAlarm.active);
        }
      }
      setIsLoading(false);
    };
    
    loadAlarm();
  }, [id]);

  const handleSave = async () => {
    if (typeof id === 'string' && alarm) {
      await updateAlarm(id, {
        name,
        radius,
        sound,
        vibration,
        message,
        active,
      });
      router.back();
    }
  };

  const handleDelete = async () => {
    if (typeof id === 'string') {
      await deleteAlarm(id);
      router.back();
    }
  };

  if (isLoading) {
    return (
      <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </View>
    );
  }

  if (!alarm) {
    return (
      <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
        <Text style={{ color: theme.colors.text }}>Alarm not found</Text>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <View style={[styles.card, { backgroundColor: theme.colors.card }]}>
        <Text style={[styles.label, { color: theme.colors.text }]}>Alarm Name</Text>
        <TextInput
          style={[styles.input, { 
            color: theme.colors.text,
            backgroundColor: theme.colors.background,
            borderColor: theme.colors.border
          }]}
          value={name}
          onChangeText={setName}
          placeholder="Enter alarm name"
          placeholderTextColor={theme.colors.textSecondary}
        />
        
        <Text style={[styles.label, { color: theme.colors.text }]}>Location</Text>
        <TouchableOpacity 
          style={[styles.locationButton, { 
            backgroundColor: theme.colors.background,
            borderColor: theme.colors.border
          }]}
        >
          <MapPin size={20} color={theme.colors.primary} />
          <Text style={[styles.locationText, { color: theme.colors.text }]}>
            {alarm.location.name}
          </Text>
        </TouchableOpacity>
        
        <Text style={[styles.label, { color: theme.colors.text }]}>Radius (meters)</Text>
        <SliderInput 
          value={radius}
          onValueChange={setRadius}
          minimumValue={50}
          maximumValue={1000}
          step={50}
        />
        
        <Text style={[styles.label, { color: theme.colors.text }]}>Sound</Text>
        <TouchableOpacity 
          style={[styles.soundButton, { 
            backgroundColor: theme.colors.background,
            borderColor: theme.colors.border
          }]}
        >
          <Volume2 size={20} color={theme.colors.primary} />
          <Text style={[styles.soundText, { color: theme.colors.text }]}>
            {sound}
          </Text>
        </TouchableOpacity>
        
        <View style={styles.switchRow}>
          <Text style={[styles.switchLabel, { color: theme.colors.text }]}>Vibration</Text>
          <Switch
            value={vibration}
            onValueChange={setVibration}
            trackColor={{ false: theme.colors.border, true: theme.colors.primary + '80' }}
            thumbColor={vibration ? theme.colors.primary : theme.colors.textSecondary}
          />
        </View>
        
        <View style={styles.switchRow}>
          <Text style={[styles.switchLabel, { color: theme.colors.text }]}>Active</Text>
          <Switch
            value={active}
            onValueChange={setActive}
            trackColor={{ false: theme.colors.border, true: theme.colors.primary + '80' }}
            thumbColor={active ? theme.colors.primary : theme.colors.textSecondary}
          />
        </View>
        
        <Text style={[styles.label, { color: theme.colors.text }]}>Message (Optional)</Text>
        <TextInput
          style={[styles.textArea, { 
            color: theme.colors.text,
            backgroundColor: theme.colors.background,
            borderColor: theme.colors.border
          }]}
          value={message}
          onChangeText={setMessage}
          placeholder="Enter message to show when alarm triggers"
          placeholderTextColor={theme.colors.textSecondary}
          multiline
          numberOfLines={3}
        />
      </View>
      
      <View style={styles.buttonRow}>
        <TouchableOpacity 
          style={[styles.deleteButton, { backgroundColor: theme.colors.error }]}
          onPress={handleDelete}
        >
          <Text style={styles.buttonText}>Delete</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.saveButton, { backgroundColor: theme.colors.primary }]}
          onPress={handleSave}
        >
          <Text style={styles.buttonText}>Save</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  card: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  label: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 8,
  },
  input: {
    height: 48,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    marginBottom: 16,
  },
  locationButton: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 48,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    marginBottom: 16,
  },
  locationText: {
    marginLeft: 8,
  },
  soundButton: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 48,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    marginBottom: 16,
  },
  soundText: {
    marginLeft: 8,
  },
  switchRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  switchLabel: {
    fontSize: 16,
  },
  textArea: {
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingTop: 12,
    textAlignVertical: 'top',
    marginBottom: 16,
    minHeight: 80,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  saveButton: {
    flex: 1,
    height: 50,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },
  deleteButton: {
    flex: 1,
    height: 50,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  buttonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '600',
  },
});
