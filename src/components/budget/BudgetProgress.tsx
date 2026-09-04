import { Feather } from "@expo/vector-icons";
import { Text, View } from "react-native";

interface BudgetProgressProps {
  percentageUsed: number;
  spentAmount: number;
  budgetAmount: number;
}

/**
 * Formats currency for display.
 */
const formatCurrency = (value: number) =>
  `₦${value.toLocaleString("en-NG", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;

export default function BudgetProgress({
  percentageUsed,
  spentAmount,
  budgetAmount,
}: BudgetProgressProps) {
  const isOverBudget = spentAmount > budgetAmount;

  const status =
    percentageUsed >= 100
      ? "Budget exceeded"
      : percentageUsed >= 90
        ? "Almost at your limit"
        : percentageUsed >= 75
          ? "Approaching your limit"
          : "You're within your budget";

  const statusIcon =
    percentageUsed >= 100
      ? "alert-circle"
      : percentageUsed >= 75
        ? "alert-triangle"
        : "check-circle";

  // Cap visual progress at 100%.
  const progressWidth = Math.min(
    Math.max(percentageUsed, 0),
    100,
  );

  return (
    <View className="mb-6 rounded-3xl bg-white p-6">
      {/* Section title */}
      <View className="flex-row items-center justify-between">
        <View>
          <Text className="text-lg font-bold text-slate-900">
            Spending Progress
          </Text>

          <Text className="mt-1 text-xs text-slate-500">
            {status}
          </Text>
        </View>

        <View
          className={`h-10 w-10 items-center justify-center rounded-full ${
            percentageUsed >= 100
              ? "bg-red-50"
              : percentageUsed >= 75
                ? "bg-amber-50"
                : "bg-emerald-50"
          }`}
        >
          <Feather
            name={statusIcon}
            size={18}
            color={
              percentageUsed >= 100
                ? "#DC2626"
                : percentageUsed >= 75
                  ? "#D97706"
                  : "#059669"
            }
          />
        </View>
      </View>

      {/* Progress bar */}
      <View className="mt-6 h-3 overflow-hidden rounded-full bg-slate-100">
        <View
          className={`h-full rounded-full ${
            percentageUsed >= 100
              ? "bg-red-500"
              : percentageUsed >= 90
                ? "bg-orange-500"
                : percentageUsed >= 75
                  ? "bg-amber-500"
                  : "bg-blue-600"
          }`}
          style={{
            width: `${progressWidth}%`,
          }}
        />
      </View>

      {/* Amount information */}
      <View className="mt-4 flex-row justify-between">
        <Text className="text-xs text-slate-500">
          {formatCurrency(spentAmount)} spent
        </Text>

        <Text
          className={`text-xs font-semibold ${
            isOverBudget
              ? "text-red-600"
              : "text-slate-500"
          }`}
        >
          {formatCurrency(budgetAmount)} limit
        </Text>
      </View>
    </View>
  );
}