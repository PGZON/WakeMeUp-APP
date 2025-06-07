import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from "react-native";
import { useRouter, Stack } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTheme } from "@/context/ThemeContext";
import { useExpenses } from "@/hooks/useExpenses";
import {
  Calendar,
  ChevronDown,
  ArrowLeft,
  Tag,
  DollarSign,
  FileText,
} from "lucide-react-native";
import { DateTimePicker } from "@/components/common/DateTimePicker";
import { CategoryPicker } from "@/components/expenses/CategoryPicker";
import { TripPicker } from "@/components/expenses/TripPicker";
import { useTrips } from "@/hooks/useTrips";

export default function CreateExpenseScreen() {
  const router = useRouter();
  const { theme } = useTheme();
  const { createExpense } = useExpenses();
  const { trips } = useTrips();
  const [isLoading, setIsLoading] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showCategoryPicker, setShowCategoryPicker] = useState(false);
  const [showTripPicker, setShowTripPicker] = useState(false);

  // Expense state
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("Transportation");
  const [date, setDate] = useState(new Date());
  const [notes, setNotes] = useState("");
  const [tripId, setTripId] = useState<string | null>(null);

  const handleCreateExpense = async () => {
    const amountValue = parseFloat(amount);
    
    if (!amount || isNaN(amountValue) || amountValue <= 0) {
      Alert.alert("Error", "Please enter a valid amount");
      return;
    }

    if (!category) {
      Alert.alert("Error", "Please select a category");
      return;
    }

    try {
      setIsLoading(true);
      await createExpense({
        amount: amountValue,
        category,
        date: date.toISOString(),
        notes: notes.trim(),
        tripId,
      });
      router.back();
    } catch (error) {
      console.error("Error creating expense:", error);
      Alert.alert("Error", "Failed to create expense. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString(undefined, {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
    content: {
      flex: 1,
      padding: 16,
    },
    section: {
      marginBottom: 24,
    },
    sectionTitle: {
      fontSize: 16,
      fontWeight: "600",
      color: theme.colors.textSecondary,
      marginBottom: 12,
    },
    inputContainer: {
      backgroundColor: theme.colors.card,
      borderRadius: 12,
      padding: 16,
      marginBottom: 8,
    },
    inputLabel: {
      fontSize: 14,
      color: theme.colors.textSecondary,
      marginBottom: 8,
    },
    input: {
      fontSize: 16,
      color: theme.colors.text,
      padding: 0,
    },
    amountContainer: {
      flexDirection: "row",
      alignItems: "center",
    },
    currencySymbol: {
      fontSize: 24,
      fontWeight: "bold",
      color: theme.colors.text,
      marginRight: 8,
    },
    amountInput: {
      flex: 1,
      fontSize: 24,
      fontWeight: "bold",
      color: theme.colors.text,
      padding: 0,
    },
    optionButton: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      backgroundColor: theme.colors.card,
      borderRadius: 12,
      padding: 16,
      marginBottom: 8,
    },
    optionText: {
      fontSize: 16,
      color: theme.colors.text,
      marginLeft: 8,
    },
    notesInput: {
      height: 100,
      textAlignVertical: "top",
    },
    createButton: {
      backgroundColor: theme.colors.primary,
      borderRadius: 12,
      padding: 16,
      alignItems: "center",
      marginTop: 16,
    },
    createButtonText: {
      fontSize: 16,
      fontWeight: "600",
      color: "#FFFFFF",
    },
  });

  return (
    <SafeAreaView style={styles.container} edges={["bottom"]}>
      <Stack.Screen
        options={{
          title: "Add Expense",
          headerLeft: () => (
            <TouchableOpacity onPress={() => router.back()}>
              <ArrowLeft size={24} color={theme.colors.text} />
            </TouchableOpacity>
          ),
        }}
      />
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView style={styles.content}>
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Amount</Text>
            <View style={styles.inputContainer}>
              <View style={styles.amountContainer}>
                <Text style={styles.currencySymbol}>₹</Text>
                <TextInput
                  style={styles.amountInput}
                  placeholder="0.00"
                  placeholderTextColor={theme.colors.textSecondary}
                  value={amount}
                  onChangeText={setAmount}
                  keyboardType="numeric"
                />
              </View>
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Details</Text>
            <TouchableOpacity
              style={styles.optionButton}
              onPress={() => setShowCategoryPicker(true)}
            >
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <Tag size={20} color={theme.colors.primary} />
                <Text style={styles.optionText}>{category}</Text>
              </View>
              <ChevronDown size={20} color={theme.colors.textSecondary} />
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.optionButton}
              onPress={() => setShowDatePicker(true)}
            >
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <Calendar size={20} color={theme.colors.primary} />
                <Text style={styles.optionText}>{formatDate(date)}</Text>
              </View>
              <ChevronDown size={20} color={theme.colors.textSecondary} />
            </TouchableOpacity>

            {trips && trips.length > 0 && (
              <TouchableOpacity
                style={styles.optionButton}
                onPress={() => setShowTripPicker(true)}
              >
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                  <DollarSign size={20} color={theme.colors.primary} />
                  <Text style={styles.optionText}>
                    {tripId
                      ? `Trip: ${trips.find((t) => t.id === tripId)?.name || "Unknown"}`
                      : "Select Trip (Optional)"}
                  </Text>
                </View>
                <ChevronDown size={20} color={theme.colors.textSecondary} />
              </TouchableOpacity>
            )}

            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Notes (Optional)</Text>
              <TextInput
                style={[styles.input, styles.notesInput]}
                placeholder="Add notes about this expense"
                placeholderTextColor={theme.colors.textSecondary}
                value={notes}
                onChangeText={setNotes}
                multiline
              />
            </View>
          </View>

          <TouchableOpacity
            style={[styles.createButton, isLoading && { opacity: 0.7 }]}
            onPress={handleCreateExpense}
            disabled={isLoading || !amount || parseFloat(amount) <= 0}
          >
            {isLoading ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <Text style={styles.createButtonText}>Add Expense</Text>
            )}
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>

      <DateTimePicker
        visible={showDatePicker}
        value={date}
        mode="date"
        onClose={() => setShowDatePicker(false)}
        onChange={(selectedDate) => {
          if (selectedDate) {
            setDate(selectedDate);
          }
          setShowDatePicker(false);
        }}
      />

      <CategoryPicker
        visible={showCategoryPicker}
        onClose={() => setShowCategoryPicker(false)}
        selectedCategory={category}
        onSelectCategory={(selectedCategory) => {
          setCategory(selectedCategory);
          setShowCategoryPicker(false);
        }}
      />

      {trips && (
        <TripPicker
          visible={showTripPicker}
          onClose={() => setShowTripPicker(false)}
          trips={trips}
          selectedTripId={tripId}
          onSelectTrip={(selectedTripId) => {
            setTripId(selectedTripId);
            setShowTripPicker(false);
          }}
        />
      )}
    </SafeAreaView>
  );
}