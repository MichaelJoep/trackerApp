import { View } from "react-native";

interface PaginationDotsProps {
  currentIndex: number;
  total: number;
}

export default function PaginationDots({
  currentIndex,
  total,
}: PaginationDotsProps) {
  return (
    <View className="mb-8 flex-row justify-center">
      {Array.from({ length: total }).map((_, index) => (
        <View
          key={index}
          className={`mx-1 h-2 rounded-full ${
            index === currentIndex
              ? "w-8 bg-blue-600"
              : "w-2 bg-slate-300"
          }`}
        />
      ))}
    </View>
  );
}