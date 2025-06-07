import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  FlatList,
  ActivityIndicator,
  Platform,
} from "react-native";
import { useTheme } from "@/context/ThemeContext";
import { X, Check, Volume2, Play, Pause } from "lucide-react-native";
import { Audio } from "expo-av";

interface SoundPickerProps {
  visible: boolean;
  onClose: () => void;
  onSelectSound: (sound: string) => void;
  selectedSound: string;
}

export const SoundPicker: React.FC<SoundPickerProps> = ({
  visible,
  onClose,
  onSelectSound,
  selectedSound,
}) => {
  const { theme } = useTheme();
  const [playingSound, setPlayingSound] = useState<string | null>(null);
  const [sound, setSound] = useState<Audio.Sound | null>(null);
  const [loading, setLoading] = useState<string | null>(null);

  // Sound options with online URLs
  const soundOptions = [
    { id: "default", name: "Default", url: "https://assets.mixkit.co/active_storage/sfx/212/212-preview.mp3" },
    { id: "bell", name: "Bell", url: "https://assets.mixkit.co/active_storage/sfx/1/1-preview.mp3" },
    { id: "chime", name: "Chime", url: "https://assets.mixkit.co/active_storage/sfx/208/208-preview.mp3" },
    { id: "digital", name: "Digital", url: "https://assets.mixkit.co/active_storage/sfx/2/2-preview.mp3" },
    { id: "electronic", name: "Electronic", url: "https://assets.mixkit.co/active_storage/sfx/209/209-preview.mp3" },
    { id: "marimba", name: "Marimba", url: "https://assets.mixkit.co/active_storage/sfx/213/213-preview.mp3" },
    { id: "xylophone", name: "Xylophone", url: "https://assets.mixkit.co/active_storage/sfx/219/219-preview.mp3" },
  ];

  const playSound = async (soundId: string) => {
    try {
      // Stop any currently playing sound
      if (sound) {
        await sound.stopAsync();
        await sound.unloadAsync();
        setSound(null);
      }

      if (playingSound === soundId) {
        setPlayingSound(null);
        return;
      }

      const soundOption = soundOptions.find(option => option.id === soundId);
      if (!soundOption) return;

      setLoading(soundId);
      
      // Load and play the new sound
      const { sound: newSound } = await Audio.Sound.createAsync(
        { uri: soundOption.url },
        { shouldPlay: true }
      );
      
      setSound(newSound);
      setPlayingSound(soundId);
      setLoading(null);

      // When sound finishes playing
      newSound.setOnPlaybackStatusUpdate((status) => {
        if (status.didJustFinish) {
          setPlayingSound(null);
        }
      });
    } catch (error) {
      console.error("Error playing sound:", error);
      setLoading(null);
      setPlayingSound(null);
    }
  };

  React.useEffect(() => {
    return () => {
      // Clean up sound when component unmounts
      if (sound) {
        sound.stopAsync().then(() => sound.unloadAsync());
      }
    };
  }, [sound]);

  React.useEffect(() => {
    // Stop sound when modal closes
    if (!visible && sound) {
      sound.stopAsync().then(() => {
        sound.unloadAsync();
        setSound(null);
        setPlayingSound(null);
      });
    }
  }, [visible, sound]);

  const styles = StyleSheet.create({
    modalContainer: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
    header: {
      flexDirection: "row",
      alignItems: "center",
      padding: 16,
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.border,
    },
    closeButton: {
      padding: 8,
    },
    title: {
      flex: 1,
      fontSize: 18,
      fontWeight: "600",
      color: theme.colors.text,
      textAlign: "center",
    },
    soundItem: {
      flexDirection: "row",
      alignItems: "center",
      padding: 16,
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.border,
    },
    soundInfo: {
      flex: 1,
      flexDirection: "row",
      alignItems: "center",
    },
    soundIcon: {
      marginRight: 12,
    },
    soundName: {
      fontSize: 16,
      color: theme.colors.text,
    },
    playButton: {
      width: 36,
      height: 36,
      borderRadius: 18,
      backgroundColor: theme.colors.primary,
      justifyContent: "center",
      alignItems: "center",
      marginRight: 12,
    },
    selectedIcon: {
      width: 24,
      height: 24,
      borderRadius: 12,
      backgroundColor: theme.colors.primary,
      justifyContent: "center",
      alignItems: "center",
    },
  });

  return (
    <Modal visible={visible} animationType="slide">
      <View style={styles.modalContainer}>
        <View style={styles.header}>
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <X size={24} color={theme.colors.text} />
          </TouchableOpacity>
          <Text style={styles.title}>Select Sound</Text>
          <View style={{ width: 40 }} />
        </View>

        <FlatList
          data={soundOptions}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.soundItem}
              onPress={() => onSelectSound(item.id)}
            >
              <View style={styles.soundInfo}>
                <Volume2
                  size={24}
                  color={theme.colors.primary}
                  style={styles.soundIcon}
                />
                <Text style={styles.soundName}>{item.name}</Text>
              </View>
              
              <TouchableOpacity
                style={styles.playButton}
                onPress={() => playSound(item.id)}
                disabled={loading !== null}
              >
                {loading === item.id ? (
                  <ActivityIndicator size="small" color="#FFFFFF" />
                ) : playingSound === item.id ? (
                  <Pause size={16} color="#FFFFFF" />
                ) : (
                  <Play size={16} color="#FFFFFF" />
                )}
              </TouchableOpacity>
              
              {selectedSound === item.id && (
                <View style={styles.selectedIcon}>
                  <Check size={16} color="#FFFFFF" />
                </View>
              )}
            </TouchableOpacity>
          )}
        />
      </View>
    </Modal>
  );
};