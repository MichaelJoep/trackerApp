import { Text, TouchableOpacity } from "react-native";

interface SocialButtonProps {
  title: string;
  onPress: () => void;
}

export default function SocialButton({
  title,
  onPress,
}: SocialButtonProps) {
  return (
    <TouchableOpacity
      onPress={onPress}
      className="h-14 items-center justify-center rounded-xl border border-slate-200 bg-white"
    >
      <Text className="font-semibold text-slate-700">
        {title}
      </Text>
    </TouchableOpacity>
  );
}