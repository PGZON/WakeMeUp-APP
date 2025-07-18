import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TextInput,
  useColorScheme,
  TouchableOpacity,
  Image,
} from "react-native";
import { useRouter } from "expo-router";
import { Feather } from '@expo/vector-icons';
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import Colors from "@/constants/colors";
import { FONT_SIZE, FONT_WEIGHT, SPACING, RADIUS } from "@/constants/theme";
import { createExpense } from '../../utils/api';
import api from "@/utils/api";

export default function AddExpenseScreen() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme === "dark" ? "dark" : "light"];
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("");
  const [currency, setCurrency] = useState("USD");
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [receipt, setReceipt] = useState("");
  const [selectedTrip, setSelectedTrip] = useState<string | null>(null);
  const [trips, setTrips] = useState([]);

  useEffect(() => {
    const fetchTrips = async () => {
      try {
        const response = await api.get('/trips');
        setTrips(response.data || []);
      } catch (error) {
        setTrips([]);
      }
    };
    fetchTrips();
  }, []);

  const categories = [
    "Food",
    "Transportation",
    "Accommodation",
    "Entertainment",
    "Shopping",
    "Other",
  ];

  const currencies = ["USD", "EUR", "GBP", "JPY"];

  const handleSave = async () => {
    const expenseData = {
      title,
      amount,
      category,
      currency,
      date,
      receipt,
      trip: selectedTrip,
    };
    try {
      await api.post('/expenses', expenseData);
      router.back();
    } catch (error) {
      alert('Failed to save expense');
    }
  };

  const handleTakePhoto = () => {
    // In a real app, this would open the camera
    // For this example, we'll just set a placeholder image URL
    setReceipt("https://images.unsplash.com/photo-1554224155-6726b3ff858f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1011&q=80");
  };

  const handleRemovePhoto = () => {
    setReceipt(null);
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
      <Text
        style={[
          styles.title,
          {
            color: colors.text,
          },
        ]}
      >
        Add Expense
      </Text>

      <Card variant="outlined" style={styles.card}>
        <Text
          style={[
            styles.inputLabel,
            {
              color: colors.text,
            },
          ]}
        >
          Trip
        </Text>
        <View style={styles.tripsContainer}>
          {trips.map((trip) => (
            <TouchableOpacity
              key={trip.id}
              style={[
                styles.tripButton,
                selectedTrip === trip.id && {
                  backgroundColor: colors.primary,
                },
                {
                  borderColor: colors.border,
                },
              ]}
              onPress={() => setSelectedTrip(trip.id)}
            >
              <Text
                style={[
                  styles.tripButtonText,
                  {
                    color: selectedTrip === trip.id ? "#FFFFFF" : colors.text,
                  },
                ]}
              >
                {trip.name}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <Text
          style={[
            styles.inputLabel,
            {
              color: colors.text,
              marginTop: SPACING.md,
            },
          ]}
        >
          Title
        </Text>
        <TextInput
          style={[
            styles.input,
            {
              color: colors.text,
              borderColor: colors.border,
              backgroundColor: colors.card,
            },
          ]}
          placeholder="Enter expense title"
          placeholderTextColor={colors.subtext}
          value={title}
          onChangeText={setTitle}
        />

        <View style={styles.rowContainer}>
          <View style={styles.halfInput}>
            <Text
              style={[
                styles.inputLabel,
                {
                  color: colors.text,
                  marginTop: SPACING.md,
                },
              ]}
            >
              Amount
            </Text>
            <View style={styles.amountContainer}>
              <Feather
                name="dollar-sign"
                size={20}
                color={colors.primary}
                style={styles.inputIcon}
              />
              <TextInput
                style={[
                  styles.amountInput,
                  {
                    color: colors.text,
                    borderColor: colors.border,
                    backgroundColor: colors.card,
                  },
                ]}
                placeholder="0.00"
                placeholderTextColor={colors.subtext}
                keyboardType="numeric"
                value={amount}
                onChangeText={setAmount}
              />
            </View>
          </View>

          <View style={styles.halfInput}>
            <Text
              style={[
                styles.inputLabel,
                {
                  color: colors.text,
                  marginTop: SPACING.md,
                },
              ]}
            >
              Currency
            </Text>
            <View style={styles.currencyContainer}>
              {currencies.map((curr) => (
                <TouchableOpacity
                  key={curr}
                  style={[
                    styles.currencyButton,
                    currency === curr && {
                      backgroundColor: colors.primary,
                    },
                    {
                      borderColor: colors.border,
                    },
                  ]}
                  onPress={() => setCurrency(curr)}
                >
                  <Text
                    style={[
                      styles.currencyButtonText,
                      {
                        color: currency === curr ? "#FFFFFF" : colors.text,
                      },
                    ]}
                  >
                    {curr}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </View>

        <Text
          style={[
            styles.inputLabel,
            {
              color: colors.text,
              marginTop: SPACING.md,
            },
          ]}
        >
          Category
        </Text>
        <View style={styles.categoriesContainer}>
          {categories.map((cat) => (
            <TouchableOpacity
              key={cat}
              style={[
                styles.categoryButton,
                category === cat && {
                  backgroundColor: colors.primary,
                },
                {
                  borderColor: colors.border,
                },
              ]}
              onPress={() => setCategory(cat)}
            >
              <Feather
                name="tag"
                size={16}
                color={category === cat ? "#FFFFFF" : colors.text}
                style={styles.categoryIcon}
              />
              <Text
                style={[
                  styles.categoryButtonText,
                  {
                    color: category === cat ? "#FFFFFF" : colors.text,
                  },
                ]}
              >
                {cat}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <Text
          style={[
            styles.inputLabel,
            {
              color: colors.text,
              marginTop: SPACING.md,
            },
          ]}
        >
          Date
        </Text>
        <View style={styles.dateContainer}>
          <Feather
            name="calendar"
            size={20}
            color={colors.primary}
            style={styles.inputIcon}
          />
          <TextInput
            style={[
              styles.dateInput,
              {
                color: colors.text,
                borderColor: colors.border,
                backgroundColor: colors.card,
              },
            ]}
            placeholder="YYYY-MM-DD"
            placeholderTextColor={colors.subtext}
            value={date}
            onChangeText={setDate}
          />
        </View>

        <Text
          style={[
            styles.inputLabel,
            {
              color: colors.text,
              marginTop: SPACING.md,
            },
          ]}
        >
          Receipt (Optional)
        </Text>
        {receipt ? (
          <View style={styles.receiptContainer}>
            <Image
              source={{ uri: receipt }}
              style={styles.receiptImage}
              resizeMode="cover"
            />
            <TouchableOpacity
              style={[
                styles.removePhotoButton,
                {
                  backgroundColor: colors.error,
                },
              ]}
              onPress={handleRemovePhoto}
            >
              <Feather name="x" size={16} color="#FFFFFF" />
            </TouchableOpacity>
          </View>
        ) : (
          <TouchableOpacity
            style={[
              styles.takePhotoButton,
              {
                borderColor: colors.primary,
              },
            ]}
            onPress={handleTakePhoto}
          >
            <Feather name="camera" size={24} color={colors.primary} />
            <Text
              style={[
                styles.takePhotoText,
                {
                  color: colors.primary,
                },
              ]}
            >
              Take Photo
            </Text>
          </TouchableOpacity>
        )}
      </Card>

      <View style={styles.buttonContainer}>
        <Button
          title="Cancel"
          variant="outline"
          onPress={() => router.back()}
          style={{ marginRight: SPACING.md }}
        />
        <Button
          title="Save Expense"
          variant="primary"
          onPress={handleSave}
          disabled={!title || !amount || !category || !selectedTrip}
        />
      </View>
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
  title: {
    fontSize: FONT_SIZE.xl,
    fontWeight: FONT_WEIGHT.bold,
    marginBottom: SPACING.md,
  },
  card: {
    marginBottom: SPACING.md,
  },
  inputLabel: {
    fontSize: FONT_SIZE.md,
    fontWeight: FONT_WEIGHT.medium,
    marginBottom: SPACING.sm,
  },
  input: {
    borderWidth: 1,
    borderRadius: RADIUS.md,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    fontSize: FONT_SIZE.md,
  },
  rowContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  halfInput: {
    width: "48%",
  },
  amountContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderRadius: RADIUS.md,
    paddingHorizontal: SPACING.md,
  },
  inputIcon: {
    marginRight: SPACING.sm,
  },
  amountInput: {
    flex: 1,
    paddingVertical: SPACING.sm,
    fontSize: FONT_SIZE.md,
  },
  currencyContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  currencyButton: {
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.xs,
    borderRadius: RADIUS.md,
    borderWidth: 1,
    marginRight: SPACING.xs,
    marginBottom: SPACING.xs,
  },
  currencyButtonText: {
    fontSize: FONT_SIZE.sm,
    fontWeight: FONT_WEIGHT.medium,
  },
  tripsContainer: {
    marginBottom: SPACING.sm,
  },
  tripButton: {
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    borderRadius: RADIUS.md,
    borderWidth: 1,
    marginBottom: SPACING.sm,
  },
  tripButtonText: {
    fontSize: FONT_SIZE.sm,
    fontWeight: FONT_WEIGHT.medium,
  },
  categoriesContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  categoryButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.xs,
    borderRadius: RADIUS.md,
    borderWidth: 1,
    marginRight: SPACING.sm,
    marginBottom: SPACING.sm,
  },
  categoryIcon: {
    marginRight: SPACING.xs,
  },
  categoryButtonText: {
    fontSize: FONT_SIZE.sm,
    fontWeight: FONT_WEIGHT.medium,
  },
  dateContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderRadius: RADIUS.md,
    paddingHorizontal: SPACING.md,
  },
  dateInput: {
    flex: 1,
    paddingVertical: SPACING.sm,
    fontSize: FONT_SIZE.md,
  },
  takePhotoButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: SPACING.md,
    borderWidth: 1,
    borderStyle: "dashed",
    borderRadius: RADIUS.md,
  },
  takePhotoText: {
    marginLeft: SPACING.sm,
    fontSize: FONT_SIZE.md,
    fontWeight: FONT_WEIGHT.medium,
  },
  receiptContainer: {
    position: "relative",
    marginBottom: SPACING.md,
  },
  receiptImage: {
    width: "100%",
    height: 200,
    borderRadius: RADIUS.md,
  },
  removePhotoButton: {
    position: "absolute",
    top: SPACING.sm,
    right: SPACING.sm,
    width: 30,
    height: 30,
    borderRadius: 15,
    justifyContent: "center",
    alignItems: "center",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginTop: SPACING.md,
  },
});