import { Text, View } from "react-native";
import Svg, {
  Circle,
} from "react-native-svg";

interface ExpenseCategory {
  label: string;
  amount: number;
  color: string;
}

interface ExpenseBreakdownProps {
  data?: ExpenseCategory[];
}

export default function ExpenseBreakdown({
  data = [],
}: ExpenseBreakdownProps) {
  const total = data.reduce(
    (sum, item) => sum + item.amount,
    0,
  );

  const radius = 54;
  const circumference =
    2 * Math.PI * radius;

  let accumulatedPercentage = 0;

  return (
    <View className="mb-8 rounded-2xl bg-white p-5">
      <Text className="text-lg font-bold text-slate-900">
        Expense Breakdown
      </Text>

      {total <= 0 ? (
        <View className="items-center py-10">
          <View className="h-28 w-28 items-center justify-center rounded-full border-8 border-slate-100">
            <Text className="text-sm font-semibold text-slate-400">
              No data
            </Text>
          </View>

          <Text className="mt-4 text-center text-sm text-slate-500">
            Your expense categories will appear here.
          </Text>
        </View>
      ) : (
        <>
          <View className="my-6 items-center justify-center">
            <Svg
              width={160}
              height={160}
              viewBox="0 0 140 140"
            >
              <Circle
                cx="70"
                cy="70"
                r={radius}
                stroke="#E2E8F0"
                strokeWidth="18"
                fill="transparent"
              />

              {data.map((item, index) => {
                const percentage =
                  item.amount / total;

                const dashLength =
                  circumference * percentage;

                const offset =
                  -circumference *
                  accumulatedPercentage;

                accumulatedPercentage +=
                  percentage;

                return (
                  <Circle
                    key={`${item.label}-${index}`}
                    cx="70"
                    cy="70"
                    r={radius}
                    stroke={item.color}
                    strokeWidth="18"
                    fill="transparent"
                    strokeDasharray={`${dashLength} ${circumference}`}
                    strokeDashoffset={offset}
                    strokeLinecap="butt"
                    rotation="-90"
                    origin="70,70"
                  />
                );
              })}
            </Svg>

            <View className="absolute items-center">
              <Text className="text-xs text-slate-400">
                Total
              </Text>

              <Text className="mt-1 text-lg font-bold text-slate-900">
                ₦
                {total.toLocaleString()}
              </Text>
            </View>
          </View>

          {/* Chart legend */}
          {data.map((item) => (
            <View
              key={item.label}
              className="mb-3 flex-row items-center justify-between"
            >
              <View className="flex-row items-center">
                <View
                  className="mr-3 h-3 w-3 rounded-full"
                  style={{
                    backgroundColor:
                      item.color,
                  }}
                />

                <Text className="text-sm text-slate-600">
                  {item.label}
                </Text>
              </View>

              <Text className="font-semibold text-slate-900">
                ₦{item.amount.toLocaleString()}
              </Text>
            </View>
          ))}
        </>
      )}
    </View>
  );
}