import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  useColorScheme,
  Image,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Feather } from '@expo/vector-icons';
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import Colors from "@/constants/colors";
import { FONT_SIZE, FONT_WEIGHT, SPACING, RADIUS } from "@/constants/theme";
import { getExpenses } from '../../utils/api';

export default function ExpenseDetailScreen() {
  const { id } = useLocalSearchParams();
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme === "dark" ? "dark" : "light"];
  const router = useRouter();

  const [expense, setExpense] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    if (id) {
      getExpenses(id as string).then(data => {
        setExpense(data[0]);
        setLoading(false);
      });
    }
  }, [id]);

  const handleEdit = () => {
    // In a real app, this would navigate to the edit screen
    router.push("/expense/add");
  };

  const handleDelete = () => {
    // In a real app, this would delete the expense
    router.back();
  };

  if (loading) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <Text style={{ color: colors.text }}>Loading expense...</Text>
      </View>
    );
  }

  if (!expense) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <Text style={{ color: colors.text }}>Expense not found.</Text>
      </View>
    );
  }

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
          {expense.title}
        </Text>
        <View
          style={[
            styles.categoryBadge,
            {
              backgroundColor: colors.primary,
            },
          ]}
        >
          <Text style={styles.categoryText}>{expense.category}</Text>
        </View>
      </View>

      <Card variant="elevated" style={styles.amountCard}>
        <Text
          style={[
            styles.amountLabel,
            {
              color: colors.subtext,
            },
          ]}
        >
          Amount
        </Text>
        <View style={styles.amountContainer}>
          <Feather name="dollar-sign" size={24} color={colors.primary} />
          <Text
            style={[
              styles.amount,
              {
                color: colors.text,
              },
            ]}
          >
            {expense.amount.toFixed(2)} {expense.currency}
          </Text>
        </View>
      </Card>

      <Card variant="outlined" style={styles.detailsCard}>
        <View style={styles.detailRow}>
          <View style={styles.detailLabelContainer}>
            <Feather name="calendar" size={20} color={colors.primary} />
            <Text
              style={[
                styles.detailLabel,
                {
                  color: colors.text,
                },
              ]}
            >
              Date
            </Text>
          </View>
          <Text
            style={[
              styles.detailValue,
              {
                color: colors.text,
              },
            ]}
          >
            {expense.date}
          </Text>
        </View>

        <View style={styles.detailRow}>
          <View style={styles.detailLabelContainer}>
            <Feather name="map-pin" size={20} color={colors.primary} />
            <Text
              style={[
                styles.detailLabel,
                {
                  color: colors.text,
                },
              ]}
            >
              Trip
            </Text>
          </View>
          <Text
            style={[
              styles.detailValue,
              {
                color: colors.text,
              },
            ]}
          >
            {expense.tripName}
          </Text>
        </View>

        <View style={styles.detailRow}>
          <View style={styles.detailLabelContainer}>
            <Feather name="map-pin" size={20} color={colors.primary} />
            <Text
              style={[
                styles.detailLabel,
                {
                  color: colors.text,
                },
              ]}
            >
              Location
            </Text>
          </View>
          <Text
            style={[
              styles.detailValue,
              {
                color: colors.text,
              },
            ]}
          >
            {expense.location}
          </Text>
        </View>
      </Card>

      {expense.receipt && (
        <View style={styles.receiptContainer}>
          <Text
            style={[
              styles.receiptTitle,
              {
                color: colors.text,
              },
            ]}
          >
            Receipt
          </Text>
          <Image
            source={{ uri: expense.receipt }}
            style={styles.receiptImage}
            resizeMode="cover"
          />
        </View>
      )}

      <View style={styles.buttonContainer}>
        <Button
          title="Edit"
          variant="primary"
          onPress={handleEdit}
          style={{ marginRight: SPACING.md }}
        />
        <Button
          title="Delete"
          variant="outline"
          leftIcon={<Feather name="trash" size={16} color={colors.error} />}
          style={[
            styles.deleteButton,
            {
              borderColor: colors.error,
            },
          ]}
          onPress={handleDelete}
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
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: SPACING.md,
  },
  title: {
    fontSize: FONT_SIZE.xl,
    fontWeight: FONT_WEIGHT.bold,
  },
  categoryBadge: {
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.xs,
    borderRadius: RADIUS.round,
  },
  categoryText: {
    color: "#FFFFFF",
    fontSize: FONT_SIZE.xs,
    fontWeight: FONT_WEIGHT.medium,
  },
  amountCard: {
    marginBottom: SPACING.md,
  },
  amountLabel: {
    fontSize: FONT_SIZE.sm,
    marginBottom: SPACING.xs,
  },
  amountContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  amount: {
    fontSize: FONT_SIZE.xxxl,
    fontWeight: FONT_WEIGHT.bold,
    marginLeft: SPACING.sm,
  },
  detailsCard: {
    marginBottom: SPACING.md,
  },
  detailRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: SPACING.sm,
  },
  detailLabelContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  detailLabel: {
    fontSize: FONT_SIZE.md,
    marginLeft: SPACING.sm,
  },
  detailValue: {
    fontSize: FONT_SIZE.md,
    fontWeight: FONT_WEIGHT.medium,
  },
  receiptContainer: {
    marginBottom: SPACING.md,
  },
  receiptTitle: {
    fontSize: FONT_SIZE.lg,
    fontWeight: FONT_WEIGHT.semibold,
    marginBottom: SPACING.sm,
  },
  receiptImage: {
    width: "100%",
    height: 300,
    borderRadius: RADIUS.md,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: SPACING.md,
  },
  deleteButton: {
    borderWidth: 1,
  },
});