import {
    Text,
    TextInput,
    View,
    TextInputProps,
  } from "react-native";
  
  interface AuthInputProps extends TextInputProps {
    label: string;
    error?: string;
  }
  
  export default function AuthInput({
    label,
    error,
    ...props
  }: AuthInputProps) {
    return (
      <View className="mb-4">
        <Text className="mb-2 text-sm font-semibold text-slate-700">
          {label}
        </Text>
  
        <TextInput
          {...props}
          className={`h-14 rounded-xl border bg-slate-50 px-4 text-base text-slate-900 ${
            error ? "border-red-500" : "border-slate-200"
          }`}
          placeholderTextColor="#94A3B8"
        />
  
        {error && (
          <Text className="mt-1 text-xs text-red-500">
            {error}
          </Text>
        )}
      </View>
    );
  }