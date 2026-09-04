import {
    Text,
    View,
  } from "react-native";
  import { Feather } from "@expo/vector-icons";
  
  interface TransactionSummaryProps {
    income: number;
    expenses: number;
  }
  
  function formatCurrency(
    amount: number,
  ) {
    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
      minimumFractionDigits: 2,
    }).format(amount);
  }
  
  export default function TransactionSummary({
    income,
    expenses,
  }: TransactionSummaryProps) {
    return (
      <View className="mb-7 flex-row">
        {/* Income */}
        <View className="mr-2 flex-1 rounded-2xl bg-white p-4">
          <View className="flex-row items-center">
            <View className="h-9 w-9 items-center justify-center rounded-full bg-green-50">
              <Feather
                name="arrow-down-left"
                size={17}
                color="#16A34A"
              />
            </View>
  
            <Text className="ml-2 text-xs font-semibold text-slate-500">
              Income
            </Text>
          </View>
  
          <Text className="mt-3 text-lg font-bold text-green-600">
            {formatCurrency(income)}
          </Text>
        </View>
  
        {/* Expenses */}
        <View className="ml-2 flex-1 rounded-2xl bg-white p-4">
          <View className="flex-row items-center">
            <View className="h-9 w-9 items-center justify-center rounded-full bg-red-50">
              <Feather
                name="arrow-up-right"
                size={17}
                color="#EF4444"
              />
            </View>
  
            <Text className="ml-2 text-xs font-semibold text-slate-500">
              Expenses
            </Text>
          </View>
  
          <Text className="mt-3 text-lg font-bold text-red-500">
            {formatCurrency(expenses)}
          </Text>
        </View>
      </View>
    );
  }