import { Feather } from "@expo/vector-icons";
import { Text, View } from "react-native";

export interface SpendingCategory {
  category: string;
  amount: number;
  percentage: number;
  count: number;
}

interface SpendingByCategoryProps {
  categories: SpendingCategory[];
}

/**
 * Converts a category name into a suitable Feather icon.
 */
const getCategoryIcon = (
  category: string,
): keyof typeof Feather.glyphMap => {
  const normalized = category.toLowerCase();

  if (normalized.includes("food")) return "coffee";
  if (normalized.includes("transport")) return "truck";
  if (normalized.includes("bill")) return "file-text";
  if (normalized.includes("shopping")) return "shopping-bag";
  if (normalized.includes("health")) return "heart";
  if (normalized.includes("education")) return "book";
  if (normalized.includes("entertainment")) return "film";
  if (normalized.includes("rent")) return "home";

  return "tag";
};

const formatCurrency = (value: number) =>
  `₦${value.toLocaleString("en-NG", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;

export default function SpendingByCategory({
  categories,
}: SpendingByCategoryProps) {
  return (
    <View className="mb-6 rounded-3xl bg-white p-6">
      {/* Header */}
      <View className="mb-5 flex-row items-center justify-between">
        <View>
          <Text className="text-lg font-bold text-slate-900">
            Spending by Category
          </Text>

          <Text className="mt-1 text-xs text-slate-500">
            Where your money is going
          </Text>
        </View>

        <Feather
          name="bar-chart-2"
          size={20}
          color="#64748B"
        />
      </View>

      {categories.length === 0 ? (
        <View className="items-center py-6">
          <View className="h-12 w-12 items-center justify-center rounded-2xl bg-slate-100">
            <Feather
              name="pie-chart"
              size={21}
              color="#64748B"
            />
          </View>

          <Text className="mt-3 text-sm font-semibold text-slate-800">
            No spending yet
          </Text>

          <Text className="mt-1 text-center text-xs leading-5 text-slate-500">
            Your expense categories will appear here
            when you record transactions.
          </Text>
        </View>
      ) : (
        <View>
          {categories.map((item, index) => (
            <View
              key={item.category}
              className={
                index === categories.length - 1
                  ? ""
                  : "mb-5"
              }
            >
              {/* Category heading */}
              <View className="flex-row items-center">
                <View className="h-10 w-10 items-center justify-center rounded-xl bg-slate-100">
                  <Feather
                    name={getCategoryIcon(item.category)}
                    size={17}
                    color="#475569"
                  />
                </View>

                <View className="ml-3 flex-1">
                  <View className="flex-row items-center justify-between">
                    <Text className="text-sm font-semibold text-slate-800">
                      {item.category}
                    </Text>

                    <Text className="text-sm font-bold text-slate-900">
                      {formatCurrency(item.amount)}
                    </Text>
                  </View>

                  <Text className="mt-1 text-xs text-slate-400">
                    {item.count}{" "}
                    {item.count === 1
                      ? "transaction"
                      : "transactions"}{" "}
                    · {Math.round(item.percentage)}%
                  </Text>
                </View>
              </View>

              {/* Category percentage bar */}
              <View className="ml-[52px] mt-3 h-2 overflow-hidden rounded-full bg-slate-100">
                <View
                  className="h-full rounded-full bg-blue-500"
                  style={{
                    width: `${Math.min(
                      Math.max(item.percentage, 0),
                      100,
                    )}%`,
                  }}
                />
              </View>
            </View>
          ))}
        </View>
      )}
    </View>
  );
}