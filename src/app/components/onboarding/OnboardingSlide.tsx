import { Text, View } from "react-native";

interface OnboardingSlideProps {
  icon: string;
  title: string;
  description: string;
}

export default function OnboardingSlide({
  icon,
  title,
  description,
}: OnboardingSlideProps) {
  return (
    <View className="flex-1 items-center justify-center px-8">
      <View className="mb-10 h-40 w-40 items-center justify-center rounded-full bg-blue-100">
        <Text className="text-6xl font-bold text-blue-600">
          {icon}
        </Text>
      </View>

      <Text className="text-center text-3xl font-bold text-slate-900">
        {title}
      </Text>

      <Text className="mt-4 text-center text-base leading-6 text-slate-500">
        {description}
      </Text>
    </View>
  );
}