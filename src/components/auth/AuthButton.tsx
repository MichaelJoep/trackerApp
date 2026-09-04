import {
    ActivityIndicator,
    Text,
    TouchableOpacity,
  } from "react-native";
  
  interface AuthButtonProps {
    title: string;
    onPress: () => void;
    loading?: boolean;
    disabled?: boolean;
  }
  
  export default function AuthButton({
    title,
    onPress,
    loading = false,
    disabled = false,
  }: AuthButtonProps) {
    return (
      <TouchableOpacity
        disabled={disabled || loading}
        onPress={onPress}
        className={`h-14 items-center justify-center rounded-xl bg-blue-600 ${
          disabled || loading ? "opacity-50" : ""
        }`}
      >
        {loading ? (
          <ActivityIndicator color="#FFFFFF" />
        ) : (
          <Text className="text-base font-bold text-white">
            {title}
          </Text>
        )}
      </TouchableOpacity>
    );
  }