import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  useColorScheme,
  TouchableOpacity,
  useEffect,
  useState,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { StopCard } from "@/components/trip/StopCard";
import { MapPreview } from "@/components/home/MapPreview";
import Colors from "@/constants/colors";
import { FONT_SIZE, FONT_WEIGHT, SPACING, RADIUS } from "@/constants/theme";
import { getTrip, triggerStop } from '../../utils/api';
import api from "@/utils/api";

export default function TripDetailScreen() {
  const { id } = useLocalSearchParams();
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme === "dark" ? "dark" : "light"];
  const router = useRouter();

  const [isPaused, setIsPaused] = useState(false);
  const [alarmTone, setAlarmTone] = useState("chime");
  const [vibrationEnabled, setVibrationEnabled] = useState(true);
  const [trip, setTrip] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [stops, setStops] = useState<any[]>([]);
  const [alarmTones, setAlarmTones] = useState<any[]>([]);

  useEffect(() => {
    if (id) {
      getTrip(id as string).then(data => {
        setTrip(data);
        setLoading(false);
      });
    }
  }, [id]);

  useEffect(() => {
    if (trip) {
      // Fetch stops from backend if available
      const fetchStops = async () => {
        try {
          const response = await api.get(`/trips/${id}/stops`);
          setStops(response.data.stops || []);
        } catch (error) {
          setStops([]); // fallback if API fails
        }
      };
      fetchStops();
      // Alarm tones as a constant (if not from backend)
      setAlarmTones([
        { id: "chime", label: "Chime" },
        { id: "bell", label: "Bell" },
        { id: "digital", label: "Digital" },
        { id: "nature", label: "Nature" },
      ]);
    }
  }, [trip]);

  const handleTogglePause = () => {
    setIsPaused(!isPaused);
  };

  const handleEndTrip = () => {
    // In a real app, this would end the trip and navigate back
    router.replace("/(tabs)");
  };

  return (
    <ScrollView
      style={[
        styles.container,
        {
          backgroundColor: colors.background,
        },
      ]}
      contentContainerStyle={styles.contentContainer}
    >
      <View style={styles.header}>
        <Text
          style={[
            styles.title,
            {
              color: colors.text,
            },
          ]}
        >
          {trip?.name || "Loading..."}
        </Text>
        <View
          style={[
            styles.statusBadge,
            {
              backgroundColor: isPaused
                ? colors.warning
                : colors.primary,
            },
          ]}
        >
          <Text style={styles.statusText}>
            {isPaused ? "Paused" : "Active"}
          </Text>
        </View>
      </View>

      <MapPreview title="Current Route" />

      <Card variant="elevated" style={styles.infoCard}>
        <View style={styles.tripInfoContainer}>
          <View style={styles.infoItem}>
            <Feather name="clock" size={20} color={colors.primary} />
            <Text
              style={[
                styles.infoText,
                {
                  color: colors.text,
                },
              ]}
            >
              ETA: {trip?.eta || "N/A"}
            </Text>
          </View>
          <View style={styles.infoItem}>
            <Feather name="navigation" size={20} color={colors.primary} />
            <Text
              style={[
                styles.infoText,
                {
                  color: colors.text,
                },
              ]}
            >
              {trip?.distance || "N/A"}
            </Text>
          </View>
        </View>

        <Text
          style={[
            styles.progressLabel,
            {
              color: colors.text,
            },
          ]}
        >
          Trip Progress
        </Text>
        <View
          style={[
            styles.progressBar,
            {
              backgroundColor: colors.border,
            },
          ]}
        >
          <View
            style={[
              styles.progressFill,
              {
                backgroundColor: colors.primary,
                width: `${trip?.progress || 0}%`,
              },
            ]}
          />
        </View>

        <View style={styles.actionButtons}>
          <Button
            title={isPaused ? "Resume Trip" : "Pause Trip"}
            variant={isPaused ? "primary" : "outline"}
            leftIcon={
              isPaused ? (
                <Feather name="play" size={16} color={isPaused ? "#FFFFFF" : colors.primary} />
              ) : (
                <Feather name="pause" size={16} color={colors.primary} />
              )
            }
            style={{ flex: 1, marginRight: SPACING.sm }}
            onPress={handleTogglePause}
          />
          <Button
            title="End Trip"
            variant="outline"
            style={[
              { flex: 1 },
              {
                borderColor: colors.error,
              },
            ]}
            leftIcon={<Feather name="alert-circle" size={16} color={colors.error} />}
            onPress={handleEndTrip}
          />
        </View>
      </Card>

      <Text
        style={[
          styles.sectionTitle,
          {
            color: colors.text,
          },
        ]}
      >
        Stops
      </Text>
      {loading ? (
        <Text>Loading stops...</Text>
      ) : stops.length === 0 ? (
        <Text>No stops defined for this trip.</Text>
      ) : (
        stops.map((stop, index) => (
          <StopCard key={index} {...stop} />
        ))
      )}

      <Text
        style={[
          styles.sectionTitle,
          {
            color: colors.text,
          },
        ]}
      >
        Alarm Settings
      </Text>
      <Card variant="outlined" style={styles.card}>
        <Text
          style={[
            styles.settingLabel,
            {
              color: colors.text,
            },
          ]}
        >
          Alarm Tone
        </Text>
        <View style={styles.tonesContainer}>
          {alarmTones.map((tone) => (
            <TouchableOpacity
              key={tone.id}
              style={[
                styles.toneButton,
                alarmTone === tone.id && {
                  backgroundColor: colors.primary,
                },
                {
                  borderColor: colors.border,
                },
              ]}
              onPress={() => setAlarmTone(tone.id)}
            >
              <Feather
                name="bell"
                size={16}
                color={alarmTone === tone.id ? "#FFFFFF" : colors.text}
              />
              <Text
                style={[
                  styles.toneText,
                  {
                    color: alarmTone === tone.id ? "#FFFFFF" : colors.text,
                  },
                ]}
              >
                {tone.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.vibrationContainer}>
          <View style={styles.vibrationLabelContainer}>
            <MaterialCommunityIcons name="vibrate" size={20} color={colors.primary} />
            <Text
              style={[
                styles.vibrationLabel,
                {
                  color: colors.text,
                },
              ]}
            >
              Vibration
            </Text>
          </View>
          <TouchableOpacity
            style={[
              styles.toggleButton,
              {
                backgroundColor: vibrationEnabled
                  ? colors.primary
                  : colors.border,
              },
            ]}
            onPress={() => setVibrationEnabled(!vibrationEnabled)}
          >
            <View
              style={[
                styles.toggleCircle,
                {
                  transform: [
                    {
                      translateX: vibrationEnabled ? 16 : 0,
                    },
                  ],
                },
              ]}
            />
          </TouchableOpacity>
        </View>
      </Card>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    padding: SPACING.md,
    paddingBottom: SPACING.xxl,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: SPACING.md,
  },
  title: {
    fontSize: FONT_SIZE.xl,
    fontWeight: FONT_WEIGHT.bold,
    flex: 1,
  },
  statusBadge: {
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.xs,
    borderRadius: RADIUS.round,
  },
  statusText: {
    color: "#FFFFFF",
    fontSize: FONT_SIZE.xs,
    fontWeight: FONT_WEIGHT.medium,
  },
  infoCard: {
    marginVertical: SPACING.md,
  },
  tripInfoContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: SPACING.md,
  },
  infoItem: {
    flexDirection: "row",
    alignItems: "center",
  },
  infoText: {
    marginLeft: SPACING.sm,
    fontSize: FONT_SIZE.md,
    fontWeight: FONT_WEIGHT.medium,
  },
  progressLabel: {
    fontSize: FONT_SIZE.md,
    fontWeight: FONT_WEIGHT.medium,
    marginBottom: SPACING.sm,
  },
  progressBar: {
    height: 8,
    borderRadius: 4,
    marginBottom: SPACING.md,
  },
  progressFill: {
    height: 8,
    borderRadius: 4,
  },
  actionButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  sectionTitle: {
    fontSize: FONT_SIZE.lg,
    fontWeight: FONT_WEIGHT.semibold,
    marginTop: SPACING.lg,
    marginBottom: SPACING.sm,
  },
  card: {
    marginBottom: SPACING.md,
  },
  settingLabel: {
    fontSize: FONT_SIZE.md,
    fontWeight: FONT_WEIGHT.medium,
    marginBottom: SPACING.sm,
  },
  tonesContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginBottom: SPACING.md,
  },
  toneButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.xs,
    borderRadius: RADIUS.md,
    borderWidth: 1,
    marginRight: SPACING.sm,
    marginBottom: SPACING.sm,
  },
  toneText: {
    marginLeft: SPACING.xs,
    fontSize: FONT_SIZE.sm,
  },
  vibrationContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  vibrationLabelContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  vibrationLabel: {
    marginLeft: SPACING.sm,
    fontSize: FONT_SIZE.md,
  },
  toggleButton: {
    width: 40,
    height: 24,
    borderRadius: 12,
    padding: 2,
  },
  toggleCircle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: "#FFFFFF",
  },
});