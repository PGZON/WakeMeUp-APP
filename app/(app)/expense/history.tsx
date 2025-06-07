import React, { useState, useMemo } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { useRouter, Stack } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTheme } from "@/context/ThemeContext";
import { useExpenses } from "@/hooks/useExpenses";
import { ArrowLeft, Filter, PieChart } from "lucide-react-native";
import { ExpenseCard } from "@/components/expenses/ExpenseCard";
import { FilterModal } from "@/components/common/FilterModal";

export default function ExpenseHistoryScreen() {
  const router = useRouter();
  const { theme } = useTheme();
  const { expenses, loading, deleteExpense } = useExpenses();
  const [filterVisible, setFilterVisible] = useState(false);
  const [filterType, setFilterType] = useState("all"); // all, thisMonth, thisWeek, byCategory
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const categories = useMemo(() => {
    if (!expenses) return [];
    const uniqueCategories = new Set(expenses.map(expense => expense.category));
    return Array.from(uniqueCategories);
  }, [expenses]);

  const filteredExpenses = useMemo(() => {
    if (!expenses) return [];
    
    // First filter by time period
    let timeFiltered = expenses;
    
    if (filterType === "thisMonth") {
      const today = new Date();
      const thisMonth = today.getMonth();
      const thisYear = today.getFullYear();
      
      timeFiltered = expenses.filter(expense => {
        const expenseDate = new Date(expense.date);
        return expenseDate.getMonth() === thisMonth && expenseDate.getFullYear() === thisYear;
      });
    } else if (filterType === "thisWeek") {
      const today = new Date();
      const startOfWeek = new Date(today);
      startOfWeek.setDate(today.getDate() - today.getDay());
      startOfWeek.setHours(0, 0, 0, 0);
      
      timeFiltered = expenses.filter(expense => {
        const expenseDate = new Date(expense.date);
        return expenseDate >= startOfWeek;
      });
    }
    
    // Then filter by category if needed
    if (filterType === "byCategory" && selectedCategory) {
      return timeFiltered.filter(expense => expense.category === selectedCategory);
    }
    
    return timeFiltered;
  }, [expenses, filterType, selectedCategory]);

  const totalAmount = useMemo(() => {
    return filteredExpenses.reduce((sum, expense) => sum + expense.amount, 0);
  }, [filteredExpenses]);

  const filterOptions = [
    { label: "All Expenses", value: "all" },
    { label: "This Month", value: "thisMonth" },
    { label: "This Week", value: "thisWeek" },
    { label: "By Category", value: "byCategory" },
  ];

  const handleFilterSelect = (value: string) => {
    setFilterType(value);
    if (value === "byCategory") {
      // Show category selection
      if (categories.length > 0) {
        setSelectedCategory(categories[0]);
      }
    } else {
      setSelectedCategory(null);
    }
    setFilterVisible(false);
  };

  const formatCurrency = (amount: number) => {
    return `₹${amount.toFixed(2)}`;
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
    header: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      paddingHorizontal: 16,
      paddingVertical: 12,
    },
    filterButton: {
      padding: 8,
    },
    content: {
      flex: 1,
      padding: 16,
    },
    summaryContainer: {
      backgroundColor: theme.colors.card,
      borderRadius: 16,
      padding: 16,
      marginBottom: 24,
    },
    summaryTitle: {
      fontSize: 16,
      color: theme.colors.textSecondary,
      marginBottom: 8,
    },
    totalAmount: {
      fontSize: 28,
      fontWeight: "bold",
      color: theme.colors.text,
      marginBottom: 16,
    },
    filterInfo: {
      fontSize: 14,
      color: theme.colors.textSecondary,
    },
    categoryContainer: {
      marginTop: 16,
    },
    categoryTitle: {
      fontSize: 16,
      fontWeight: "600",
      color: theme.colors.textSecondary,
      marginBottom: 8,
    },
    categoryList: {
      flexDirection: "row",
      flexWrap: "wrap",
    },
    categoryChip: {
      paddingHorizontal: 12,
      paddingVertical: 6,
      borderRadius: 16,
      marginRight: 8,
      marginBottom: 8,
    },
    categoryChipSelected: {
      backgroundColor: theme.colors.primary,
    },
    categoryChipUnselected: {
      backgroundColor: theme.colors.backgroundSecondary || theme.colors.card,
    },
    categoryChipText: {
      fontSize: 14,
    },
    categoryChipTextSelected: {
      color: "#FFFFFF",
    },
    categoryChipTextUnselected: {
      color: theme.colors.text,
    },
    listHeader: {
      fontSize: 18,
      fontWeight: "600",
      color: theme.colors.text,
      marginBottom: 16,
    },
    loadingContainer: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
    },
    emptyContainer: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      padding: 24,
    },
    emptyText: {
      fontSize: 16,
      color: theme.colors.textSecondary,
      textAlign: "center",
    },
  });

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <Stack.Screen
          options={{
            title: "Expense History",
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
          title: "Expense History",
          headerRight: () => (
            <TouchableOpacity
              style={styles.filterButton}
              onPress={() => setFilterVisible(true)}
            >
              <Filter size={24} color={theme.colors.text} />
            </TouchableOpacity>
          ),
        }}
      />

      <View style={styles.content}>
        <View style={styles.summaryContainer}>
          <Text style={styles.summaryTitle}>Total Expenses</Text>
          <Text style={styles.totalAmount}>{formatCurrency(totalAmount)}</Text>
          <Text style={styles.filterInfo}>
            {filterType === "all"
              ? "Showing all expenses"
              : filterType === "thisMonth"
              ? "Showing expenses for this month"
              : filterType === "thisWeek"
              ? "Showing expenses for this week"
              : `Showing expenses for ${selectedCategory} category`}
          </Text>

          {filterType === "byCategory" && (
            <View style={styles.categoryContainer}>
              <Text style={styles.categoryTitle}>Categories</Text>
              <View style={styles.categoryList}>
                {categories.map((category) => (
                  <TouchableOpacity
                    key={category}
                    style={[
                      styles.categoryChip,
                      selectedCategory === category
                        ? styles.categoryChipSelected
                        : styles.categoryChipUnselected,
                    ]}
                    onPress={() => setSelectedCategory(category)}
                  >
                    <Text
                      style={[
                        styles.categoryChipText,
                        selectedCategory === category
                          ? styles.categoryChipTextSelected
                          : styles.categoryChipTextUnselected,
                      ]}
                    >
                      {category}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          )}
        </View>

        {filteredExpenses.length > 0 ? (
          <FlatList
            data={filteredExpenses}
            keyExtractor={(item) => item.id}
            ListHeaderComponent={<Text style={styles.listHeader}>Expenses</Text>}
            renderItem={({ item }) => (
              <ExpenseCard
                expense={item}
                onPress={() => router.push(`/expense/edit/${item.id}`)}
                onDelete={() => deleteExpense(item.id)}
              />
            )}
          />
        ) : (
          <View style={styles.emptyContainer}>
            <PieChart size={64} color={theme.colors.textSecondary} />
            <Text style={styles.emptyText}>
              No expenses found for the selected filter.
            </Text>
          </View>
        )}
      </View>

      <FilterModal
        visible={filterVisible}
        onClose={() => setFilterVisible(false)}
        options={filterOptions}
        selectedValue={filterType}
        onSelect={handleFilterSelect}
        title="Filter Expenses"
      />
    </SafeAreaView>
  );
}