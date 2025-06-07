import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Alert,
} from "react-native";
import { useLocalSearchParams, useRouter, Stack } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTheme } from "@/context/ThemeContext";
import { useExpenses } from "@/hooks/useExpenses";
import { useTrips } from "@/hooks/useTrips";
import { ArrowLeft, Calendar, Save, Tag } from "lucide-react-native";
import { DateTimePicker } from "@/components/common/DateTimePicker";
import { CategoryPicker } from "@/components/expenses/CategoryPicker";
import { TripPicker } from "@/components/expenses/TripPicker";

export default function EditExpenseScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const { theme } = useTheme();
  const { getExpense, updateExpense } = useExpenses();
  const { trips } = useTrips();
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showCategoryPicker, setShowCategoryPicker] = useState(false);
  const [showTripPicker, setShowTripPicker] = useState(false);

  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("Food");
  const [date, setDate] = useState(new Date());
  const [notes, setNotes] = useState("");
  const [tripId, setTripId] = useState<string | null>(null);

  useEffect(() => {
    const loadExpense = async () => {
      try {
        setLoading(true);
        const expenseData = await getExpense(id as string);
        if (expenseData) {
          setAmount(expenseData.amount.toString());
          setCategory(expenseData.category);
          setDate(new Date(expenseData.date));
          setNotes(expenseData.notes || "");
          setTripId(expenseData.tripId || null);
        }
      } catch (error) {
        console.error("Error loading expense:", error);
        Alert.alert("Error", "Failed to load expense details");
      } finally {
        setLoading(false);
      }
    };

    loadExpense();
  }, [id]);

  const handleSave = async () => {
    if (!amount || isNaN(parseFloat(amount))) {
      Alert.alert("Error", "Please enter a valid amount");
      return;
    }

    if (!category) {
      Alert.alert("Error", "Please select a category");
      return;
    }

    try {
      setSaving(true);
      await updateExpense(id as string, {
        amount: parseFloat(amount),
        category,
        date: date.toISOString(),
        notes,
        tripId,
      });
      router.back();
    } catch (error) {
      console.error("Error updating expense:", error);
      Alert.alert("Error", "Failed to update expense");
    } finally {
      setSaving(false);
    }
  };

  const handleDateChange = (event: any, selectedDate?: Date) => {
    setShowDatePicker(false);
    if (selectedDate) {
      setDate(selectedDate);
    }
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString(undefined, {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const getSelectedTripName = () => {
    if (!tripId || !trips) return "Select Trip (Optional)";
    const trip = trips.find((t) => t.id === tripId);
    return trip ? trip.name : "Select Trip (Optional)";
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
    loadingContainer: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
    },
    inputContainer: {
      marginBottom: 20,
    },
    label: {
      fontSize: 16,
      fontWeight: "500",
      color: theme.colors.text,
      marginBottom: 8,
    },
    input: {
      backgroundColor: theme.colors.card,
      borderRadius: 12,
      padding: 12,
      fontSize: 16,
      color: theme.colors.text,
      borderWidth: 1,
      borderColor: theme.colors.border,
    },
    amountInput: {
      fontSize: 24,
      fontWeight: "bold",
    },
    selectButton: {
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: theme.colors.card,
      borderRadius: 12,
      padding: 12,
      borderWidth: 1,
      borderColor: theme.colors.border,
    },
    selectButtonText: {
      fontSize: 16,
      color: theme.colors.text,
      marginLeft: 8,
    },
    notesInput: {
      height: 100,
      textAlignVertical: "top",
    },
    saveButton: {
      backgroundColor: theme.colors.primary,
      borderRadius: 12,
      padding: 16,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      marginTop: 20,
    },
    saveButtonText: {
      color: "#FFFFFF",
      fontSize: 16,
      fontWeight: "600",
      marginLeft: 8,
    },
    currencyPrefix: {
      position: "absolute",
      left: 12,
      top: 12,
      fontSize: 24,
      fontWeight: "bold",
      color: theme.colors.text,
    },
    amountInputWithPrefix: {
      paddingLeft: 30,
    },
  });

  if (loading) {
    return (
      <SafeAreaView style={styles.container} edges={["bottom"]}>
        <Stack.Screen
          options={{
            title: "Edit Expense",
            headerLeft: () => (
              <TouchableOpacity onPress={() => router.back()}>
                <ArrowLeft size={24} color={theme.colors.text} />
              </TouchableOpacity>
            ),
          }}
        />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={theme.colors.primary} />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={["bottom"]}>
      <Stack.Screen
        options={{
          title: "Edit Expense",
          headerLeft: () => (
            <TouchableOpacity onPress={() => router.back()}>
              <ArrowLeft size={24} color={theme.colors.text} />
            </TouchableOpacity>
          ),
        }}
      />

      <ScrollView style={styles.content}>
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Amount</Text>
          <View>
            <Text style={styles.currencyPrefix}>₹</Text>
            <TextInput
              style={[styles.input, styles.amountInput, styles.amountInputWithPrefix]}
              value={amount}
              onChangeText={setAmount}
              keyboardType="numeric"
              placeholder="0.00"
              placeholderTextColor={theme.colors.textSecondary}
            />
          </View>
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Category</Text>
          <TouchableOpacity
            style={styles.selectButton}
            onPress={() => setShowCategoryPicker(true)}
          >
            <Tag size={20} color={theme.colors.primary} />
            <Text style={styles.selectButtonText}>{category}</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Date</Text>
          <TouchableOpacity
            style={styles.selectButton}
            onPress={() => setShowDatePicker(true)}
          >
            <Calendar size={20} color={theme.colors.primary} />
            <Text style={styles.selectButtonText}>{formatDate(date)}</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Trip (Optional)</Text>
          <TouchableOpacity
            style={styles.selectButton}
            onPress={() => setShowTripPicker(true)}
          >
            <Text style={styles.selectButtonText}>{getSelectedTripName()}</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Notes (Optional)</Text>
          <TextInput
            style={[styles.input, styles.notesInput]}
            value={notes}
            onChangeText={setNotes}
            placeholder="Add notes about this expense"
            placeholderTextColor={theme.colors.textSecondary}
            multiline
          />
        </View>

        <TouchableOpacity
          style={styles.saveButton}
          onPress={handleSave}
          disabled={saving}
        >
          {saving ? (
            <ActivityIndicator size="small" color="#FFFFFF" />
          ) : (
            <>
              <Save size={20} color="#FFFFFF" />
              <Text style={styles.saveButtonText}>Save Changes</Text>
            </>
          )}
        </TouchableOpacity>
      </ScrollView>

      {showDatePicker && (
        <DateTimePicker
          value={date}
          mode="date"
          onChange={handleDateChange}
        />
      )}

      <CategoryPicker
        visible={showCategoryPicker}
        onClose={() => setShowCategoryPicker(false)}
        onSelectCategory={setCategory}
        selectedCategory={category}
      />

      <TripPicker
        visible={showTripPicker}
        onClose={() => setShowTripPicker(false)}
        onSelectTrip={(id) => setTripId(id)}
        selectedTripId={tripId}
        trips={trips || []}
        allowClear
      />
    </SafeAreaView>
  );
}