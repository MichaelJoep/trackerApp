import {
    Text,
    TouchableOpacity,
    View,
  } from "react-native";
  import { Feather } from "@expo/vector-icons";
  import { router } from "expo-router";
  
  export default function RecentTransactions() {
    return (
      <View className="mb-6">
        <View className="mb-4 flex-row items-center justify-between">
          <Text className="text-lg font-bold text-slate-900">
            Recent Transactions
          </Text>
  
          <TouchableOpacity
            onPress={() =>
              router.push("/(root)/(tabs)/transactions")
            }
          >
            <Text className="font-semibold text-blue-600">
              See all
            </Text>
          </TouchableOpacity>
        </View>
  
        <View className="rounded-2xl bg-white px-5 py-8">
          <View className="items-center">
            <View className="h-12 w-12 items-center justify-center rounded-full bg-slate-100">
              <Feather
                name="receipt"
                size={22}
                color="#64748B"
              />
            </View>
  
            <Text className="mt-4 font-semibold text-slate-700">
              No transactions yet
            </Text>
  
            <Text className="mt-2 text-center text-sm text-slate-400">
              Your recent activity will appear here.
            </Text>
          </View>
        </View>
      </View>
    );
  }