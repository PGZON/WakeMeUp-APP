import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { useColorScheme } from "react-native";
import { useRouter } from "expo-router";
import { Feather } from '@expo/vector-icons';
import { Card } from "@/components/ui/Card";
import Colors from "@/constants/colors";
import { FONT_SIZE, FONT_WEIGHT, SPACING } from "@/constants/theme";

interface ExpenseCardProps {
  id: string;
  title: string;
  amount: number;
  currency: string;
  category: string;
  date: string;
  onPress?: () => void;
}

export function ExpenseCard({
  id,
  title,
  amount,
  currency,
  category,
  date,
  onPress,
}: ExpenseCardProps) {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme === "dark" ? "dark" : "light"];
  const router = useRouter();

  const handlePress = () => {
    if (onPress) {
      onPress();
    } else {
      router.push(`/expense/${id}`);
    }
  };

  return (
    <TouchableOpacity onPress={handlePress} activeOpacity={0.7}>
      <Card
        variant="elevated"
        style={styles.card}
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
            {title}
          </Text>
          <View style={styles.amountContainer}>
            <Feather name="dollar-sign" size={16} color={colors.primary} />
            <Text
              style={[
                styles.amount,
                {
                  color: colors.text,
                },
              ]}
            >
              {amount} {currency}
            </Text>
          </View>
        </View>

        <View style={styles.footer}>
          <View style={styles.categoryContainer}>
            <Feather name="tag" size={14} color={colors.subtext} />
            <Text
              style={[
                styles.category,
                {
                  color: colors.subtext,
                },
              ]}
            >
              {category}
            </Text>
          </View>
          <Text
            style={[
              styles.date,
              {
                color: colors.subtext,
              },
            ]}
          >
            {date}
          </Text>
        </View>
      </Card>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    marginHorizontal: SPACING.md,
    marginVertical: SPACING.sm,
    padding: SPACING.md,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: SPACING.md,
  },
  title: {
    fontSize: FONT_SIZE.md,
    fontWeight: FONT_WEIGHT.medium,
    flex: 1,
  },
  amountContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  amount: {
    fontSize: FONT_SIZE.md,
    fontWeight: FONT_WEIGHT.semibold,
    marginLeft: SPACING.xs,
  },
  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  categoryContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  category: {
    fontSize: FONT_SIZE.sm,
    marginLeft: SPACING.xs,
  },
  date: {
    fontSize: FONT_SIZE.sm,
  },
});