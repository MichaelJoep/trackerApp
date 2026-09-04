import {
    Text,
    TouchableOpacity,
    View,
  } from "react-native";
  import { Feather } from "@expo/vector-icons";
  import { router } from "expo-router";
  
  export default function AIAssistantCard() {
    return (
      <TouchableOpacity
        activeOpacity={0.85}
        onPress={() =>
          router.push("/(root)/ai-assistant")
        }
        className="mb-8 flex-row items-center rounded-2xl border border-blue-100 bg-blue-50 p-4"
      >
        {/* AI Icon */}
        <View className="h-12 w-12 items-center justify-center rounded-2xl bg-blue-600">
          <Feather
            name="message-circle"
            size={23}
            color="#FFFFFF"
          />
        </View>
  
        {/* Text */}
        <View className="ml-4 flex-1">
          <Text className="text-base font-bold text-slate-900">
            AI Assistant
          </Text>
  
          <Text className="mt-1 text-sm text-slate-500">
            Ask AI anything
          </Text>
        </View>
  
        {/* Forward arrow */}
        <Feather
          name="arrow-right"
          size={22}
          color="#2563EB"
        />
      </TouchableOpacity>
    );
  }