import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  useColorScheme,
  TouchableOpacity,
} from "react-native";
import { useRouter } from "expo-router";
import { Feather } from '@expo/vector-icons';
import { TripCard } from "@/components/trip/TripCard";
import { Card } from "@/components/ui/Card";
import Colors from "@/constants/colors";
import { FONT_SIZE, FONT_WEIGHT, SPACING, RADIUS } from "@/constants/theme";
import { getTrips } from '../../utils/api';

export default function TripHistoryScreen() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme === "dark" ? "dark" : "light"];
  const router = useRouter();
  const [expandedTrip, setExpandedTrip] = useState<string | null>(null);
  const [filterMonth, setFilterMonth] = useState<string | null>(null);
  const [trips, setTrips] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getTrips().then(data => {
      setTrips(data);
      setLoading(false);
    });
  }, []);

  const months = [...new Set(trips.map((trip) => trip.month))];

  const filteredTrips = filterMonth
    ? trips.filter((trip) => trip.month === filterMonth)
    : trips;

  const toggleTripDetails = (tripId: string) => {
    if (expandedTrip === tripId) {
      setExpandedTrip(null);
    } else {
      setExpandedTrip(tripId);
    }
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
          Trip History
        </Text>
      </View>

      <View style={styles.filterContainer}>
        <View
          style={[
            styles.filterWrapper,
            {
              backgroundColor: colors.card,
              borderColor: colors.border,
            },
          ]}
        >
          <View style={styles.filterLabelContainer}>
            <Feather name="calendar" size={16} color={colors.primary} />
            <Text
              style={[
                styles.filterLabel,
                {
                  color: colors.text,
                },
              ]}
            >
              Filter by Month:
            </Text>
          </View>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.monthsContainer}
          >
            <TouchableOpacity
              style={[
                styles.monthButton,
                filterMonth === null && {
                  backgroundColor: colors.primary,
                },
                {
                  borderColor: colors.border,
                },
              ]}
              onPress={() => setFilterMonth(null)}
            >
              <Text
                style={[
                  styles.monthButtonText,
                  {
                    color: filterMonth === null ? "#FFFFFF" : colors.text,
                  },
                ]}
              >
                All
              </Text>
            </TouchableOpacity>
            {months.map((month) => (
              <TouchableOpacity
                key={month}
                style={[
                  styles.monthButton,
                  filterMonth === month && {
                    backgroundColor: colors.primary,
                  },
                  {
                    borderColor: colors.border,
                  },
                ]}
                onPress={() => setFilterMonth(month)}
              >
                <Text
                  style={[
                    styles.monthButtonText,
                    {
                      color: filterMonth === month ? "#FFFFFF" : colors.text,
                    },
                  ]}
                >
                  {month}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      </View>

      {filteredTrips.map((trip) => (
        <View key={trip.id} style={styles.tripContainer}>
          <TouchableOpacity
            onPress={() => toggleTripDetails(trip.id)}
            activeOpacity={0.7}
          >
            <Card
              variant="elevated"
              style={styles.tripCard}
            >
              <View style={styles.tripHeader}>
                <Text
                  style={[
                    styles.tripName,
                    {
                      color: colors.text,
                    },
                  ]}
                >
                  {trip.name}
                </Text>
                {expandedTrip === trip.id ? (
                  <Feather name="chevron-up" size={20} color={colors.text} />
                ) : (
                  <Feather name="chevron-down" size={20} color={colors.text} />
                )}
              </View>

              <View style={styles.tripBasicInfo}>
                <Text
                  style={[
                    styles.tripDate,
                    {
                      color: colors.subtext,
                    },
                  ]}
                >
                  {trip.date}
                </Text>
                <View style={styles.tripStats}>
                  <Text
                    style={[
                      styles.tripStat,
                      {
                        color: colors.text,
                      },
                    ]}
                  >
                    {trip.duration}
                  </Text>
                  <Text
                    style={[
                      styles.tripStat,
                      {
                        color: colors.text,
                      },
                    ]}
                  >
                    {trip.distance}
                  </Text>
                </View>
              </View>

              <View style={styles.tripRoute}>
                <Text
                  style={[
                    styles.tripLocation,
                    {
                      color: colors.text,
                    },
                  ]}
                >
                  From: {trip.startLocation}
                </Text>
                <Text
                  style={[
                    styles.tripLocation,
                    {
                      color: colors.text,
                    },
                  ]}
                >
                  To: {trip.endLocation}
                </Text>
              </View>

              {expandedTrip === trip.id && (
                <View style={styles.expandedContent}>
                  <View
                    style={[
                      styles.separator,
                      {
                        backgroundColor: colors.border,
                      },
                    ]}
                  />

                  <Text
                    style={[
                      styles.expandedTitle,
                      {
                        color: colors.text,
                      },
                    ]}
                  >
                    Stops
                  </Text>
                  {trip.stops.length > 0 ? (
                    <View style={styles.stopsContainer}>
                      {trip.stops.map((stop, index) => (
                        <View
                          key={index}
                          style={[
                            styles.stopItem,
                            {
                              backgroundColor: stop.triggered
                                ? `${colors.success}20`
                                : `${colors.error}20`,
                              borderColor: stop.triggered
                                ? colors.success
                                : colors.error,
                            },
                          ]}
                        >
                          <Text
                            style={[
                              styles.stopName,
                              {
                                color: colors.text,
                              },
                            ]}
                          >
                            {stop.name}
                          </Text>
                          <Text
                            style={[
                              styles.stopStatus,
                              {
                                color: stop.triggered
                                  ? colors.success
                                  : colors.error,
                              },
                            ]}
                          >
                            {stop.triggered ? "Visited" : "Missed"}
                          </Text>
                        </View>
                      ))}
                    </View>
                  ) : (
                    <Text
                      style={[
                        styles.noDataText,
                        {
                          color: colors.subtext,
                        },
                      ]}
                    >
                      No stops for this trip
                    </Text>
                  )}

                  <Text
                    style={[
                      styles.expandedTitle,
                      {
                        color: colors.text,
                        marginTop: SPACING.md,
                      },
                    ]}
                  >
                    Expenses
                  </Text>
                  {trip.expenses.length > 0 ? (
                    <View style={styles.expensesContainer}>
                      {trip.expenses.map((expense, index) => (
                        <View
                          key={index}
                          style={[
                            styles.expenseItem,
                            {
                              backgroundColor: colors.card,
                              borderColor: colors.border,
                            },
                          ]}
                        >
                          <Text
                            style={[
                              styles.expenseCategory,
                              {
                                color: colors.text,
                              },
                            ]}
                          >
                            {expense.category}
                          </Text>
                          <Text
                            style={[
                              styles.expenseAmount,
                              {
                                color: colors.text,
                              },
                            ]}
                          >
                            ${expense.amount.toFixed(2)}
                          </Text>
                        </View>
                      ))}
                      <View
                        style={[
                          styles.totalExpense,
                          {
                            borderTopColor: colors.border,
                          },
                        ]}
                      >
                        <Text
                          style={[
                            styles.totalLabel,
                            {
                              color: colors.text,
                            },
                          ]}
                        >
                          Total
                        </Text>
                        <Text
                          style={[
                            styles.totalAmount,
                            {
                              color: colors.text,
                            },
                          ]}
                        >
                          $
                          {trip.expenses
                            .reduce((sum, exp) => sum + exp.amount, 0)
                            .toFixed(2)}
                        </Text>
                      </View>
                    </View>
                  ) : (
                    <Text
                      style={[
                        styles.noDataText,
                        {
                          color: colors.subtext,
                        },
                      ]}
                    >
                      No expenses for this trip
                    </Text>
                  )}
                </View>
              )}
            </Card>
          </TouchableOpacity>
        </View>
      ))}

      {filteredTrips.length === 0 && (
        <View style={styles.emptyContainer}>
          <Text
            style={[
              styles.emptyText,
              {
                color: colors.subtext,
              },
            ]}
          >
            No trips found for the selected filter
          </Text>
        </View>
      )}
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
    marginBottom: SPACING.md,
  },
  title: {
    fontSize: FONT_SIZE.xxl,
    fontWeight: FONT_WEIGHT.bold,
  },
  filterContainer: {
    marginBottom: SPACING.md,
  },
  filterWrapper: {
    borderRadius: RADIUS.md,
    borderWidth: 1,
    padding: SPACING.md,
  },
  filterLabelContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: SPACING.sm,
  },
  filterLabel: {
    fontSize: FONT_SIZE.md,
    fontWeight: FONT_WEIGHT.medium,
    marginLeft: SPACING.sm,
  },
  monthsContainer: {
    paddingVertical: SPACING.xs,
  },
  monthButton: {
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    borderRadius: RADIUS.md,
    marginRight: SPACING.sm,
    borderWidth: 1,
  },
  monthButtonText: {
    fontSize: FONT_SIZE.sm,
    fontWeight: FONT_WEIGHT.medium,
  },
  tripContainer: {
    marginBottom: SPACING.md,
  },
  tripCard: {
    padding: SPACING.md,
  },
  tripHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: SPACING.sm,
  },
  tripName: {
    fontSize: FONT_SIZE.lg,
    fontWeight: FONT_WEIGHT.semibold,
  },
  tripBasicInfo: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: SPACING.sm,
  },
  tripDate: {
    fontSize: FONT_SIZE.sm,
  },
  tripStats: {
    flexDirection: "row",
  },
  tripStat: {
    fontSize: FONT_SIZE.sm,
    fontWeight: FONT_WEIGHT.medium,
    marginLeft: SPACING.md,
  },
  tripRoute: {
    marginBottom: SPACING.sm,
  },
  tripLocation: {
    fontSize: FONT_SIZE.md,
    marginBottom: SPACING.xs,
  },
  expandedContent: {
    marginTop: SPACING.md,
  },
  separator: {
    height: 1,
    marginBottom: SPACING.md,
  },
  expandedTitle: {
    fontSize: FONT_SIZE.md,
    fontWeight: FONT_WEIGHT.semibold,
    marginBottom: SPACING.sm,
  },
  stopsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  stopItem: {
    borderRadius: RADIUS.md,
    borderWidth: 1,
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.xs,
    marginRight: SPACING.sm,
    marginBottom: SPACING.sm,
  },
  stopName: {
    fontSize: FONT_SIZE.sm,
    fontWeight: FONT_WEIGHT.medium,
  },
  stopStatus: {
    fontSize: FONT_SIZE.xs,
    marginTop: 2,
  },
  expensesContainer: {
    borderRadius: RADIUS.md,
  },
  expenseItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: SPACING.sm,
    paddingHorizontal: SPACING.md,
    borderWidth: 1,
    borderRadius: RADIUS.md,
    marginBottom: SPACING.xs,
  },
  expenseCategory: {
    fontSize: FONT_SIZE.sm,
  },
  expenseAmount: {
    fontSize: FONT_SIZE.sm,
    fontWeight: FONT_WEIGHT.medium,
  },
  totalExpense: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: SPACING.sm,
    paddingHorizontal: SPACING.md,
    borderTopWidth: 1,
    marginTop: SPACING.xs,
  },
  totalLabel: {
    fontSize: FONT_SIZE.md,
    fontWeight: FONT_WEIGHT.semibold,
  },
  totalAmount: {
    fontSize: FONT_SIZE.md,
    fontWeight: FONT_WEIGHT.bold,
  },
  noDataText: {
    fontSize: FONT_SIZE.sm,
    fontStyle: "italic",
    marginBottom: SPACING.md,
  },
  emptyContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: SPACING.xl,
  },
  emptyText: {
    fontSize: FONT_SIZE.md,
    fontStyle: "italic",
  },
});