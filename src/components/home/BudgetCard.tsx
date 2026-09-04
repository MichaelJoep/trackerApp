import { Text, View } from "react-native";

interface BudgetCardProps {
  spent?: number;
  budget?: number;
}

export default function BudgetCard({
  spent = 0,
  budget = 0,
}: BudgetCardProps) {
  const percentage =
    budget > 0
      ? Math.min((spent / budget) * 100, 100)
      : 0;

  const remaining =
    Math.max(budget - spent, 0);

  const formatCurrency = (amount: number) =>
    new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
      maximumFractionDigits: 0,
    }).format(amount);

  return (
    <View className="mb-8 rounded-2xl bg-white p-5">
      <View className="flex-row items-center justify-between">
        <Text className="text-lg font-bold text-slate-900">
          Monthly Budget
        </Text>

        <Text className="text-sm font-semibold text-blue-600">
          {percentage.toFixed(0)}%
        </Text>
      </View>

      <Text className="mt-2 text-sm text-slate-500">
        {formatCurrency(spent)} spent of{" "}
        {formatCurrency(budget)}
      </Text>

      {/* Progress track */}
      <View className="mt-5 h-3 overflow-hidden rounded-full bg-slate-100">
        <View
          className="h-full rounded-full bg-blue-600"
          style={{
            width: `${percentage}%`,
          }}
        />
      </View>

      <View className="mt-4 flex-row items-center justify-between">
        <Text className="text-sm text-slate-500">
          Remaining
        </Text>

        <Text className="text-base font-bold text-slate-900">
          {formatCurrency(remaining)}
        </Text>
      </View>
    </View>
  );
}