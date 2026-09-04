import { Feather } from "@expo/vector-icons";
import { Text, View } from "react-native";

interface AccountSummaryProps {
  totalBalance: number;
  accountCount: number;
}

export default function AccountSummary({
  totalBalance,
  accountCount,
}: AccountSummaryProps) {
  return (
    <View className="mb-6 overflow-hidden rounded-3xl bg-slate-900 p-6">
      <View className="mb-6 flex-row items-center justify-between">
        <View>
          <Text className="text-sm font-medium text-slate-300">
            Total Balance
          </Text>

          <Text className="mt-2 text-3xl font-bold text-white">
            ₦{totalBalance.toLocaleString()}
          </Text>
        </View>

        <View className="h-12 w-12 items-center justify-center rounded-2xl bg-white/10">
          <Feather
            name="credit-card"
            size={23}
            color="#FFFFFF"
          />
        </View>
      </View>

      <View className="h-px bg-white/10" />

      <View className="mt-5 flex-row items-center">
        <View className="mr-3 h-9 w-9 items-center justify-center rounded-full bg-white/10">
          <Feather
            name="layers"
            size={17}
            color="#CBD5E1"
          />
        </View>

        <View>
          <Text className="text-sm font-semibold text-white">
            {accountCount}{" "}
            {accountCount === 1
              ? "Account"
              : "Accounts"}
          </Text>

          <Text className="mt-0.5 text-xs text-slate-400">
            Connected to your finances
          </Text>
        </View>
      </View>
    </View>
  );
}