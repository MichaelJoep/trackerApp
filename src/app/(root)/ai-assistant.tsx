import {
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import { router } from "expo-router";
import {SafeAreaView,} from "react-native-safe-area-context";
import { Feather } from "@expo/vector-icons";
import AIAssistantChat from "../../components/transactions/AIAssistantChat";


export default function AIAssistantScreen() {
  return (
    <SafeAreaView
      className="flex-1 bg-white"
      edges={["top", "bottom"]}
    >
      {/* Header */}
      <View className="flex-row items-center border-b border-slate-100 px-5 py-4">
        <TouchableOpacity
          onPress={() => router.back()}
          activeOpacity={0.8}
          className="mr-4 h-10 w-10 items-center justify-center rounded-full bg-slate-100"
        >
          <Feather
            name="arrow-left"
            size={20}
            color="#0F172A"
          />
        </TouchableOpacity>

        <View className="h-10 w-10 items-center justify-center rounded-full bg-blue-100">
          <Feather
            name="message-circle"
            size={21}
            color="#2563EB"
          />
        </View>

        <View className="ml-3 flex-1">
          <Text className="text-lg font-bold text-slate-900">
            AI Assistant
          </Text>

          <View className="mt-0.5 flex-row items-center">
            <View className="mr-1.5 h-2 w-2 rounded-full bg-green-500" />

            <Text className="text-xs text-slate-500">
              Your personal finance assistant
            </Text>
          </View>
        </View>
      </View>

      {/* Chat */}
      <AIAssistantChat />
    </SafeAreaView>
  );
}