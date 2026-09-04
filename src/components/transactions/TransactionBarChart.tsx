import { Feather } from "@expo/vector-icons";
import { Text, View } from "react-native";

import Svg, {
  Line,
  Rect,
  Text as SvgText,
} from "react-native-svg";

interface TransactionBarChartProps {
  transactions: {
    date: string;
    amount: number;
    type: string;
  }[];
}

interface ChartEntry {
  date: string;
  income: number;
  expense: number;
}

const formatAmount = (amount: number) => {
  if (amount >= 1_000_000) {
    return `${(amount / 1_000_000).toFixed(1)}M`;
  }

  if (amount >= 1_000) {
    return `${(amount / 1_000).toFixed(0)}K`;
  }

  return String(Math.round(amount));
};

export default function TransactionBarChart({
  transactions,
}: TransactionBarChartProps) {
  /*
   * ------------------------------------------------
   * GROUP TRANSACTIONS BY DATE
   * ------------------------------------------------
   */

  const grouped = transactions.reduce<
    Record<
      string,
      {
        income: number;
        expense: number;
      }
    >
  >((result, transaction) => {
    if (!result[transaction.date]) {
      result[transaction.date] = {
        income: 0,
        expense: 0,
      };
    }

    const isIncome =
      transaction.type === "income" ||
      transaction.type === "earnings";

    if (isIncome) {
      result[transaction.date].income += transaction.amount;
    } else {
      result[transaction.date].expense += transaction.amount;
    }

    return result;
  }, {});

  /*
   * ------------------------------------------------
   * KEEP RECENT SEVEN DATE GROUPS
   *
   * Object.entries() follows the order in which the
   * dates were encountered in the transactions array.
   * Your transaction store is newest-first, so taking
   * the first seven gives us the latest seven groups.
   * ------------------------------------------------
   */

  const entries: ChartEntry[] = Object.entries(grouped)
    .slice(0, 7)
    .reverse()
    .map(([date, values]) => ({
      date,
      income: values.income,
      expense: values.expense,
    }));

  /*
   * ------------------------------------------------
   * EMPTY STATE
   * ------------------------------------------------
   */

  if (!entries.length) {
    return null;
  }

  /*
   * ------------------------------------------------
   * FIND MAXIMUM VALUE
   * ------------------------------------------------
   */

  const maximum = Math.max(
    ...entries.map((entry) =>
      Math.max(entry.income, entry.expense),
    ),
    1,
  );

  /*
   * ------------------------------------------------
   * CHART DIMENSIONS
   * ------------------------------------------------
   */

  const width = 320;
  const height = 190;

  /*
   * Area where the bars are displayed.
   */
  const chartHeight = 125;

  /*
   * Individual bar width.
   */
  const barWidth = 11;

  /*
   * Space allocated to each date.
   */
  const groupWidth =
    width / Math.max(entries.length, 1);

  return (
    <View className="mb-6 overflow-hidden rounded-3xl bg-white p-5">
      {/* ------------------------------------------------
          HEADER
          ------------------------------------------------ */}

      <View className="mb-5 flex-row items-center justify-between">
        <View>
          <Text className="text-lg font-bold text-slate-900">
            Transaction activity
          </Text>

          <Text className="mt-1 text-xs text-slate-400">
            Income vs expenses
          </Text>
        </View>

        <View className="h-10 w-10 items-center justify-center rounded-xl bg-blue-50">
          <Feather
            name="bar-chart-2"
            size={19}
            color="#2563EB"
          />
        </View>
      </View>

      {/* ------------------------------------------------
          LEGEND
          ------------------------------------------------ */}

      <View className="mb-3 flex-row">
        {/* Income */}

        <View className="mr-5 flex-row items-center">
          <View className="mr-2 h-2.5 w-2.5 rounded-full bg-green-500" />

          <Text className="text-xs text-slate-500">
            Income
          </Text>
        </View>

        {/* Expenses */}

        <View className="flex-row items-center">
          <View className="mr-2 h-2.5 w-2.5 rounded-full bg-red-500" />

          <Text className="text-xs text-slate-500">
            Expenses
          </Text>
        </View>
      </View>

      {/* ------------------------------------------------
          SVG CHART
          ------------------------------------------------ */}

      <Svg
        width="100%"
        height={height}
        viewBox={`0 0 ${width} ${height}`}
      >
        {/* Baseline */}

        <Line
          x1="0"
          y1={chartHeight}
          x2={width}
          y2={chartHeight}
          stroke="#E2E8F0"
          strokeWidth="1"
        />

        {entries.map((entry, index) => {
          /*
           * Center position for this date group.
           */

          const x =
            index * groupWidth +
            groupWidth / 2;

          /*
           * Calculate bar heights.
           */

          const incomeHeight =
            (entry.income / maximum) *
            chartHeight;

          const expenseHeight =
            (entry.expense / maximum) *
            chartHeight;

          /*
           * Position bars side-by-side.
           */

          const incomeX =
            x - barWidth - 2;

          const expenseX =
            x + 2;

          /*
           * Position bars from the baseline upward.
           */

          const incomeY =
            chartHeight - incomeHeight;

          const expenseY =
            chartHeight - expenseHeight;

          /*
           * Keep labels short.
           */

          const label =
            entry.date.length > 8
              ? entry.date.slice(0, 8)
              : entry.date;

          /*
           * Highest value in this date group.
           */

          const highestValue = Math.max(
            entry.income,
            entry.expense,
          );

          const highestHeight = Math.max(
            incomeHeight,
            expenseHeight,
          );

          /*
           * IMPORTANT:
           *
           * Do NOT use <View> or <React.Fragment>
           * inside <Svg>.
           *
           * We return an array of SVG elements instead.
           */

          return [
            /* ------------------------------------------------
               INCOME BAR
               ------------------------------------------------ */

            <Rect
              key={`income-${entry.date}-${index}`}
              x={incomeX}
              y={incomeY}
              width={barWidth}
              height={Math.max(
                incomeHeight,
                2,
              )}
              rx={4}
              fill="#22C55E"
            />,

            /* ------------------------------------------------
               EXPENSE BAR
               ------------------------------------------------ */

            <Rect
              key={`expense-${entry.date}-${index}`}
              x={expenseX}
              y={expenseY}
              width={barWidth}
              height={Math.max(
                expenseHeight,
                2,
              )}
              rx={4}
              fill="#EF4444"
            />,

            /* ------------------------------------------------
               DATE LABEL
               ------------------------------------------------ */

            <SvgText
              key={`date-${entry.date}-${index}`}
              x={x}
              y={chartHeight + 22}
              fontSize="9"
              fill="#94A3B8"
              textAnchor="middle"
            >
              {label}
            </SvgText>,

            /* ------------------------------------------------
               VALUE LABEL
               ------------------------------------------------ */

            highestValue > 0 ? (
              <SvgText
                key={`value-${entry.date}-${index}`}
                x={x}
                y={
                  chartHeight -
                  highestHeight -
                  6
                }
                fontSize="8"
                fill="#64748B"
                textAnchor="middle"
              >
                {formatAmount(highestValue)}
              </SvgText>
            ) : null,
          ];
        })}
      </Svg>
    </View>
  );
}