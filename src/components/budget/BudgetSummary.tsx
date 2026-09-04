import { Feather } from "@expo/vector-icons";
import { Text, View } from "react-native";

interface BudgetSummaryProps {
  budgetAmount: number;
  spentAmount: number;
  remainingAmount: number;
  percentageUsed: number;
}

/**
 * Formats a number as Nigerian Naira.
 */
const formatCurrency = (value: number) =>
  `₦${Math.abs(value).toLocaleString("en-NG", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;

export default function BudgetSummary({
  budgetAmount,
  spentAmount,
  remainingAmount,
  percentageUsed,
}: BudgetSummaryProps) {
  const isOverBudget = remainingAmount < 0;

  return (
    <View className="mb-6 overflow-hidden rounded-3xl bg-slate-900 p-6">
      {/* Header */}
      <View className="flex-row items-start justify-between">
        <View className="flex-1">
          <Text className="text-sm font-medium text-slate-300">
            Monthly Budget
          </Text>

          <Text className="mt-2 text-3xl font-bold text-white">
            {formatCurrency(budgetAmount)}
          </Text>
        </View>

        <View className="h-12 w-12 items-center justify-center rounded-2xl bg-white/10">
          <Feather
            name="pie-chart"
            size={22}
            color="#FFFFFF"
          />
        </View>
      </View>

      {/* Spending and remaining values */}
      <View className="mt-7 flex-row">
        <View className="flex-1">
          <Text className="text-xs text-slate-400">
            Spent
          </Text>

          <Text className="mt-1 text-base font-bold text-white">
            {formatCurrency(spentAmount)}
          </Text>
        </View>

        <View className="flex-1">
          <Text className="text-xs text-slate-400">
            {isOverBudget ? "Over budget" : "Remaining"}
          </Text>

          <Text
            className={`mt-1 text-base font-bold ${
              isOverBudget
                ? "text-red-400"
                : "text-emerald-400"
            }`}
          >
            {isOverBudget ? "-" : ""}
            {formatCurrency(remainingAmount)}
          </Text>
        </View>
      </View>

      {/* Divider */}
      <View className="my-5 h-px bg-white/10" />

      {/* Percentage */}
      <View className="flex-row items-center justify-between">
        <Text className="text-sm text-slate-300">
          Budget used
        </Text>

        <Text className="text-sm font-bold text-white">
          {Math.round(percentageUsed)}%
        </Text>
      </View>
    </View>
  );
}