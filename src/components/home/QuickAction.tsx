import { ReactNode } from "react";
import {
  Text,
  TouchableOpacity,
  View,
} from "react-native";

interface QuickActionProps {
  icon: ReactNode;
  label: string;
  onPress?: () => void;
}

export default function QuickAction({
  icon,
  label,
  onPress,
}: QuickActionProps) {
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.8}
      className="flex-1 items-center"
    >
      <View className="h-12 w-12 items-center justify-center rounded-2xl bg-white/20">
        {icon}
      </View>

      <Text
        numberOfLines={1}
        className="mt-2 text-center text-xs font-medium text-white"
      >
        {label}
      </Text>
    </TouchableOpacity>
  );
}