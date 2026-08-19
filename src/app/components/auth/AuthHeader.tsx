import { Text, View } from "react-native";

interface AuthHeaderProps {
  title: string;
  subtitle?: string;
}

export default function AuthHeader({
  title,
  subtitle,
}: AuthHeaderProps) {
  return (
    <View className="mb-4 mt-16">
      <Text className="text-3xl font-bold text-slate-900 text-center">
        {title}
      </Text>

      {subtitle && (
        <Text className="mt-2 text-base leading-6 text-slate-500 text-center mb-10">
          {subtitle}
        </Text>
      )}
    </View>
  );
}