import { Feather } from "@expo/vector-icons";
import { useCallback, useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  RefreshControl,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import BudgetFormModal from "../../components/budget/BudgetFormModal";
import BudgetProgress from "../../components/budget/BudgetProgress";
import BudgetSummary from "../../components/budget/BudgetSummary";
import SpendingByCategory, {
  SpendingCategory,
} from "../../components/budget/SpendingByCategory";
import { useBudgetStore } from "../../store/budget.store";
import { useTransactionStore } from "../../store/transaction.store";

export default function BudgetScreen() {
  /* ---------------------------------------------------------
   * Budget state
   * ------------------------------------------------------- */

  const budget = useBudgetStore((state) => state.budget);
  const loading = useBudgetStore((state) => state.loading);
  const saving = useBudgetStore((state) => state.saving);
  const deleting = useBudgetStore((state) => state.deleting);
  const error = useBudgetStore((state) => state.error);

  const fetchBudget = useBudgetStore(
    (state) => state.fetchBudget,
  );
  const addBudget = useBudgetStore(
    (state) => state.addBudget,
  );
  const editBudget = useBudgetStore(
    (state) => state.editBudget,
  );
  const removeBudget = useBudgetStore(
    (state) => state.removeBudget,
  );
  const clearError = useBudgetStore(
    (state) => state.clearError,
  );

  /* ---------------------------------------------------------
   * Transaction state
   *
   * We use the existing centralized transaction store.
   * Budget does NOT maintain another transaction list.
   * ------------------------------------------------------- */

  const transactions = useTransactionStore(
    (state) => state.transactions,
  );

  /* ---------------------------------------------------------
   * Local UI state
   * ------------------------------------------------------- */

  const [modalVisible, setModalVisible] =
    useState(false);

  const [refreshing, setRefreshing] =
    useState(false);

  /* ---------------------------------------------------------
   * Fetch budget when screen mounts.
   * ------------------------------------------------------- */

  useEffect(() => {
    fetchBudget();
  }, [fetchBudget]);

  /* ---------------------------------------------------------
   * Current month helpers
   * ------------------------------------------------------- */

  const currentMonth = useMemo(() => {
    const now = new Date();

    return {
      month: now.getMonth(),
      year: now.getFullYear(),
    };
  }, []);

  /* ---------------------------------------------------------
   * Calculate current month's expenses.
   *
   * Only transactions with type === "expense" count
   * toward the monthly budget.
   * ------------------------------------------------------- */

  const monthlyExpenses = useMemo(() => {
    return transactions.filter((transaction) => {
      const date = new Date(transaction.date);

      return (
        transaction.type === "expense" &&
        date.getMonth() === currentMonth.month &&
        date.getFullYear() === currentMonth.year
      );
    });
  }, [transactions, currentMonth]);

  /* ---------------------------------------------------------
   * Total amount spent this month.
   * ------------------------------------------------------- */

  const spentAmount = useMemo(() => {
    return monthlyExpenses.reduce(
      (total, transaction) =>
        total + Math.abs(Number(transaction.amount) || 0),
      0,
    );
  }, [monthlyExpenses]);

  /* ---------------------------------------------------------
   * Budget calculations
   * ------------------------------------------------------- */

  const budgetAmount = budget?.amount ?? 0;

  const remainingAmount =
    budgetAmount - spentAmount;

  const percentageUsed =
    budgetAmount > 0
      ? (spentAmount / budgetAmount) * 100
      : 0;

  /* ---------------------------------------------------------
   * Calculate spending by transaction category.
   * ------------------------------------------------------- */

  const spendingCategories = useMemo<SpendingCategory[]>(
    () => {
      const categoryMap = new Map<
        string,
        {
          amount: number;
          count: number;
        }
      >();

      monthlyExpenses.forEach((transaction) => {
        const category =
          transaction.category?.trim() || "Other";

        const existing = categoryMap.get(category);

        if (existing) {
          existing.amount += Math.abs(
            Number(transaction.amount) || 0,
          );
          existing.count += 1;
        } else {
          categoryMap.set(category, {
            amount: Math.abs(
              Number(transaction.amount) || 0,
            ),
            count: 1,
          });
        }
      });

      const totalSpent = monthlyExpenses.reduce(
        (total, transaction) =>
          total +
          Math.abs(Number(transaction.amount) || 0),
        0,
      );

      return Array.from(categoryMap.entries())
        .map(([category, data]) => ({
          category,
          amount: data.amount,
          count: data.count,
          percentage:
            totalSpent > 0
              ? (data.amount / totalSpent) * 100
              : 0,
        }))
        .sort((a, b) => b.amount - a.amount);
    },
    [monthlyExpenses],
  );

  /* ---------------------------------------------------------
   * Number of expense transactions this month.
   * ------------------------------------------------------- */

  const expenseTransactionCount =
    monthlyExpenses.length;

  /* ---------------------------------------------------------
   * Highest spending category.
   * ------------------------------------------------------- */

  const highestCategory =
    spendingCategories[0]?.category ?? null;

  /* ---------------------------------------------------------
   * Open create budget modal.
   * ------------------------------------------------------- */

  const openCreateModal = useCallback(() => {
    clearError();
    setModalVisible(true);
  }, [clearError]);

  /* ---------------------------------------------------------
   * Open edit budget modal.
   *
   * The modal receives the existing budget amount.
   * ------------------------------------------------------- */

  const openEditModal = useCallback(() => {
    if (!budget) return;

    clearError();
    setModalVisible(true);
  }, [budget, clearError]);

  /* ---------------------------------------------------------
   * Close form modal.
   * ------------------------------------------------------- */

  const closeModal = useCallback(() => {
    setModalVisible(false);
  }, []);

  /* ---------------------------------------------------------
   * Save budget.
   *
   * If a budget exists → update.
   * If no budget exists → create.
   * ------------------------------------------------------- */

  const handleSubmit = async (amount: number) => {
    if (budget) {
      await editBudget(budget.id, amount);
    } else {
      await addBudget(amount);
    }
  };

  /* ---------------------------------------------------------
   * Delete budget.
   * ------------------------------------------------------- */

  const handleDelete = useCallback(() => {
    if (!budget) return;

    Alert.alert(
      "Delete Budget",
      "Are you sure you want to remove your monthly budget?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              await removeBudget(budget.id);
            } catch {
              // Store already handles the error state.
            }
          },
        },
      ],
    );
  }, [budget, removeBudget]);

  /* ---------------------------------------------------------
   * Pull-to-refresh.
   * ------------------------------------------------------- */

  const handleRefresh = async () => {
    setRefreshing(true);

    try {
      await fetchBudget();
    } finally {
      setRefreshing(false);
    }
  };

  /* ---------------------------------------------------------
   * Render
   * ------------------------------------------------------- */

  return (
    <>
      <ScrollView
        className="flex-1 bg-slate-50"
        contentContainerClassName="px-6 pb-10 pt-14"
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
          />
        }
      >
        {/* ---------------------------------------------------
         * Screen header
         * ------------------------------------------------- */}
        <View className="mb-7 flex-row items-center justify-between">
          <View className="flex-1">
            <Text className="text-2xl font-bold text-slate-900">
              Budget
            </Text>

            <Text className="mt-1 text-sm text-slate-500">
              Control your monthly spending
            </Text>
          </View>

          <TouchableOpacity
            onPress={
              budget
                ? openEditModal
                : openCreateModal
            }
            activeOpacity={0.85}
            className="ml-4 h-11 flex-row items-center rounded-full bg-blue-600 px-5"
          >
            <Feather
              name={budget ? "edit-2" : "plus"}
              size={17}
              color="#FFFFFF"
            />

            <Text className="ml-2 font-bold text-white">
              {budget ? "Edit" : "Add"}
            </Text>
          </TouchableOpacity>
        </View>

        {/* ---------------------------------------------------
         * Loading state
         * ------------------------------------------------- */}
        {loading && !budget ? (
          <View className="items-center rounded-3xl bg-white py-14">
            <ActivityIndicator
              size="large"
              color="#2563EB"
            />

            <Text className="mt-4 text-sm text-slate-500">
              Loading your budget...
            </Text>
          </View>
        ) : !budget ? (
          /* -------------------------------------------------
           * No budget state
           * ----------------------------------------------- */
          <View className="rounded-3xl bg-white px-7 py-12">
            <View className="mx-auto h-16 w-16 items-center justify-center rounded-2xl bg-blue-50">
              <Feather
                name="pie-chart"
                size={28}
                color="#2563EB"
              />
            </View>

            <Text className="mt-5 text-center text-lg font-bold text-slate-900">
              No monthly budget
            </Text>

            <Text className="mt-2 text-center text-sm leading-5 text-slate-500">
              Set a monthly spending limit and monitor
              how much of your budget you use throughout
              the month.
            </Text>

            <TouchableOpacity
              onPress={openCreateModal}
              activeOpacity={0.85}
              className="mt-6 h-14 flex-row items-center justify-center rounded-2xl bg-blue-600"
            >
              <Feather
                name="plus"
                size={18}
                color="#FFFFFF"
              />

              <Text className="ml-2 font-bold text-white">
                Create Monthly Budget
              </Text>
            </TouchableOpacity>
          </View>
        ) : (
          <>
            {/* ------------------------------------------------
             * Main budget summary
             * ---------------------------------------------- */}
            <BudgetSummary
              budgetAmount={budgetAmount}
              spentAmount={spentAmount}
              remainingAmount={remainingAmount}
              percentageUsed={percentageUsed}
            />

            {/* ------------------------------------------------
             * Progress information
             * ---------------------------------------------- */}
            <BudgetProgress
              percentageUsed={percentageUsed}
              spentAmount={spentAmount}
              budgetAmount={budgetAmount}
            />

            {/* ------------------------------------------------
             * Monthly statistics
             * ---------------------------------------------- */}
            <View className="mb-6 flex-row">
              <View className="mr-3 flex-1 rounded-3xl bg-white p-5">
                <View className="h-10 w-10 items-center justify-center rounded-xl bg-blue-50">
                  <Feather
                    name="credit-card"
                    size={18}
                    color="#2563EB"
                  />
                </View>

                <Text className="mt-4 text-xs text-slate-500">
                  Transactions
                </Text>

                <Text className="mt-1 text-xl font-bold text-slate-900">
                  {expenseTransactionCount}
                </Text>
              </View>

              <View className="ml-3 flex-1 rounded-3xl bg-white p-5">
                <View className="h-10 w-10 items-center justify-center rounded-xl bg-purple-50">
                  <Feather
                    name="tag"
                    size={18}
                    color="#7C3AED"
                  />
                </View>

                <Text className="mt-4 text-xs text-slate-500">
                  Top category
                </Text>

                <Text
                  numberOfLines={1}
                  className="mt-1 text-base font-bold text-slate-900"
                >
                  {highestCategory ?? "None"}
                </Text>
              </View>
            </View>

            {/* ------------------------------------------------
             * Category breakdown
             * ---------------------------------------------- */}
            <SpendingByCategory
              categories={spendingCategories}
            />

            {/* ------------------------------------------------
             * Budget actions
             * ---------------------------------------------- */}
            <View className="rounded-3xl bg-white p-5">
              <Text className="text-sm font-bold text-slate-900">
                Budget Settings
              </Text>

              <Text className="mt-1 text-xs leading-5 text-slate-500">
                Update or remove your current monthly
                spending limit.
              </Text>

              <TouchableOpacity
                onPress={openEditModal}
                disabled={saving || deleting}
                activeOpacity={0.8}
                className="mt-5 h-12 flex-row items-center justify-center rounded-2xl bg-slate-100"
              >
                <Feather
                  name="edit-2"
                  size={16}
                  color="#334155"
                />

                <Text className="ml-2 text-sm font-bold text-slate-700">
                  Edit Monthly Budget
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={handleDelete}
                disabled={saving || deleting}
                activeOpacity={0.8}
                className="mt-3 h-12 flex-row items-center justify-center rounded-2xl bg-red-50"
              >
                {deleting ? (
                  <ActivityIndicator
                    size="small"
                    color="#DC2626"
                  />
                ) : (
                  <>
                    <Feather
                      name="trash-2"
                      size={16}
                      color="#DC2626"
                    />

                    <Text className="ml-2 text-sm font-bold text-red-600">
                      Delete Budget
                    </Text>
                  </>
                )}
              </TouchableOpacity>
            </View>
          </>
        )}

        {/* ---------------------------------------------------
         * Error state
         * ------------------------------------------------- */}
        {error && (
          <View className="mt-5 rounded-2xl border border-red-100 bg-red-50 p-4">
            <View className="flex-row items-start">
              <Feather
                name="alert-circle"
                size={18}
                color="#DC2626"
              />

              <View className="ml-3 flex-1">
                <Text className="text-sm font-semibold text-red-700">
                  Something went wrong
                </Text>

                <Text className="mt-1 text-xs leading-5 text-red-600">
                  {error}
                </Text>

                <TouchableOpacity
                  onPress={() => {
                    clearError();
                    fetchBudget();
                  }}
                  className="mt-3 self-start"
                >
                  <Text className="text-xs font-bold text-red-700">
                    Try Again
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        )}
      </ScrollView>

      {/* -----------------------------------------------------
       * Add/Edit Budget modal
       * --------------------------------------------------- */}
      <BudgetFormModal
        visible={modalVisible}
        amount={budget?.amount ?? null}
        saving={saving}
        onClose={closeModal}
        onSubmit={handleSubmit}
      />
    </>
  );
}