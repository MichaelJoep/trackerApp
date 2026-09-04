import {
    ReactNode,
  } from "react";
  import {
    Text,
    View,
  } from "react-native";
  
  interface SummaryCardProps {
    title: string;
    amount: number;
    icon: ReactNode;
    amountClassName: string;
  }
  
  export default function SummaryCard({
    title,
    amount,
    icon,
    amountClassName,
  }: SummaryCardProps) {
    const formattedAmount =
      new Intl.NumberFormat("en-NG", {
        style: "currency",
        currency: "NGN",
        maximumFractionDigits: 0,
      }).format(amount);
  
    return (
      <View className="flex-1 rounded-2xl bg-white p-4">
        <View className="flex-row items-center">
          {icon}
  
          <Text className="ml-2 text-sm text-slate-500">
            {title}
          </Text>
        </View>
  
        <Text
          className={`mt-3 text-lg font-bold ${amountClassName}`}
        >
          {formattedAmount}
        </Text>
      </View>
    );
  }