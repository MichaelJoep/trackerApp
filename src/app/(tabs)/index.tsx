import { useMemo, useState } from "react";

import {
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import { Feather } from "@expo/vector-icons";
import { useAuthStore } from "../../store/auth.store";
import {useTransactionStore} from "../../store/transaction.store";
import BalanceCard from "../../components/home/BalanceCard";
import AIAssistantCard from "../../components/home/AIAssistantCard";
import BudgetCard from "../../components/home/BudgetCard";
import ExpenseBreakdown from "../../components/home/ExpenseBreakdown";
import SummaryCard from "../../components/home/SummaryCard";
import RecentTransactions from "../../components/home/RecentTransactions";
import NotificationDropdown from "../../components/home/NotificationDropdown";

export default function HomeScreen() {
  /*
   * --------------------------------------------------
   * AUTH USER
   * --------------------------------------------------
   */

  const user = useAuthStore(
    (state) => state.user,
  );

  /*
   * --------------------------------------------------
   * TRANSACTION STORE
   * --------------------------------------------------
   */

  const transactions =
    useTransactionStore(
      (state) => state.transactions,
    );

  /*
   * --------------------------------------------------
   * NOTIFICATIONS
   * --------------------------------------------------
   */

  const [
    notificationsVisible,
    setNotificationsVisible,
  ] = useState(false);

  /*
   * --------------------------------------------------
   * USER NAME
   * --------------------------------------------------
   */

  const firstName =
    user?.user_metadata?.first_name ||
    "there";

  /*
   * --------------------------------------------------
   * TOTAL BALANCE
   *
   * Income + Earnings
   * minus
   * Expense + Cash
   * --------------------------------------------------
   */

  const totalBalance = useMemo(() => {
    return transactions.reduce(
      (balance, transaction) => {
        const isIncome =
          transaction.type ===
            "income" ||
          transaction.type ===
            "earnings";

        return isIncome
          ? balance + transaction.amount
          : balance - transaction.amount;
      },
      0,
    );
  }, [transactions]);

  /*
   * --------------------------------------------------
   * MONTHLY INCOME
   * --------------------------------------------------
   *
   * For now our mock transactions
   * represent the current dashboard
   * period.
   *
   * Backend date filtering will be
   * added later.
   */

  const monthlyIncome = useMemo(() => {
    return transactions
      .filter(
        (transaction) =>
          transaction.type ===
            "income" ||
          transaction.type ===
            "earnings",
      )
      .reduce(
        (total, transaction) =>
          total + transaction.amount,
        0,
      );
  }, [transactions]);

  /*
   * --------------------------------------------------
   * MONTHLY EXPENSES
   * --------------------------------------------------
   */

  const monthlyExpenses = useMemo(() => {
    return transactions
      .filter(
        (transaction) =>
          transaction.type ===
            "expense" ||
          transaction.type ===
            "cash",
      )
      .reduce(
        (total, transaction) =>
          total + transaction.amount,
        0,
      );
  }, [transactions]);

  /*
   * --------------------------------------------------
   * MONTHLY BUDGET
   * --------------------------------------------------
   *
   * Temporary mock budget.
   *
   * Later:
   * GET /budget/current
   */

  const monthlyBudget = 250000;

  const monthlyBudgetSpent =
    monthlyExpenses;

  /*
   * --------------------------------------------------
   * EXPENSE BREAKDOWN
   *
   * Automatically generated from
   * the same transaction store.
   * --------------------------------------------------
   */

  const expenseData = useMemo(() => {
    const categoryMap: Record<
      string,
      number
    > = {};

    transactions
      .filter(
        (transaction) =>
          transaction.type ===
            "expense" ||
          transaction.type ===
            "cash",
      )
      .forEach((transaction) => {
        categoryMap[
          transaction.category
        ] =
          (categoryMap[
            transaction.category
          ] || 0) +
          transaction.amount;
      });

    const colors = [
      "#2563EB",
      "#8B5CF6",
      "#F59E0B",
      "#10B981",
      "#EF4444",
      "#EC4899",
    ];

    return Object.entries(
      categoryMap,
    ).map(
      (
        [label, amount],
        index,
      ) => ({
        label,
        amount,
        color:
          colors[
            index % colors.length
          ],
      }),
    );
  }, [transactions]);

  return (
    <ScrollView
      className="flex-1 bg-slate-50"
      contentContainerClassName="px-6 pb-10 pt-14"
      showsVerticalScrollIndicator={false}
    >
      {/* Header */}
      <View className="relative mb-7 flex-row items-center justify-between">
        <View>
          <Text className="text-sm text-slate-500">
            Welcome back,
          </Text>

          <Text className="mt-1 text-2xl font-bold text-slate-900">
            {firstName} 👋
          </Text>
        </View>

        {/* Notification button */}
        <View className="relative">
          <TouchableOpacity
            onPress={() =>
              setNotificationsVisible(
                (previous) =>
                  !previous,
              )
            }
            className="h-11 w-11 items-center justify-center rounded-full bg-white"
            activeOpacity={0.8}
          >
            <Feather
              name="bell"
              size={21}
              color="#334155"
            />

            {/* Temporary unread notification indicator */}
            <View className="absolute right-2 top-2 h-2.5 w-2.5 rounded-full border-2 border-white bg-red-500" />
          </TouchableOpacity>

          {/* Notification dropdown */}
          {notificationsVisible && (
            <NotificationDropdown
              onClose={() =>
                setNotificationsVisible(
                  false,
                )
              }
            />
          )}
        </View>
      </View>

      {/* Total Balance + Quick Actions */}
      <BalanceCard
        balance={totalBalance}
      />

      {/* AI Assistant */}
      <AIAssistantCard />

      {/* Income and Expense Summary */}
      <View className="mb-8 flex-row">
        <View className="mr-2 flex-1">
          <SummaryCard
            title="Income"
            amount={monthlyIncome}
            amountClassName="text-green-600"
            icon={
              <View className="h-9 w-9 items-center justify-center rounded-full bg-green-50">
                <Feather
                  name="arrow-down-left"
                  size={18}
                  color="#16A34A"
                />
              </View>
            }
          />
        </View>

        <View className="ml-2 flex-1">
          <SummaryCard
            title="Expenses"
            amount={monthlyExpenses}
            amountClassName="text-red-500"
            icon={
              <View className="h-9 w-9 items-center justify-center rounded-full bg-red-50">
                <Feather
                  name="arrow-up-right"
                  size={18}
                  color="#EF4444"
                />
              </View>
            }
          />
        </View>
      </View>

      {/* Monthly Budget */}
      <BudgetCard
        spent={monthlyBudgetSpent}
        budget={monthlyBudget}
      />

      {/* Expense Breakdown */}
      <ExpenseBreakdown
        data={expenseData}
      />

      {/* Recent Transactions */}
      <RecentTransactions />
    </ScrollView>
  );
}