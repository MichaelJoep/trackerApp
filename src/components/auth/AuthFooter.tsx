import { Text, TouchableOpacity, View } from "react-native";

interface AuthFooterProps {
  message: string;
  actionText: string;
  onPress: () => void;
}

export default function AuthFooter({
  message,
  actionText,
  onPress,
}: AuthFooterProps) {
  return (
    <View className="mt-8 flex-row justify-center">
      <Text className="text-sm text-slate-500">
        {message}{" "}
      </Text>

      <TouchableOpacity onPress={onPress}>
        <Text className="text-sm font-bold text-blue-600">
          {actionText}
        </Text>
      </TouchableOpacity>
    </View>
  );
}