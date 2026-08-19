import { Text, View } from "react-native";

export default function AuthDivider() {
  return (
    <View className="my-6 flex-row items-center">
      <View className="h-px flex-1 bg-slate-200" />

      <Text className="mx-4 text-sm text-slate-400">
        OR
      </Text>

      <View className="h-px flex-1 bg-slate-200" />
    </View>
  );
}