import { useState } from "react";
import {
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

interface PasswordInputProps {
  label: string;
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  error?: string;
}

export default function PasswordInput({
  label,
  value,
  onChangeText,
  placeholder = "Enter your password",
  error,
}: PasswordInputProps) {
  const [visible, setVisible] = useState(false);

  return (
    <View className="mb-4">
      <Text className="mb-2 text-sm font-semibold text-slate-700">
        {label}
      </Text>

      <View
        className={`h-14 flex-row items-center rounded-xl border bg-slate-50 ${
          error ? "border-red-500" : "border-slate-200"
        }`}
      >
        <TextInput
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor="#94A3B8"
          secureTextEntry={!visible}
          className="flex-1 px-4 text-base text-slate-900"
          autoCapitalize="none"
        />

        <TouchableOpacity
          onPress={() => setVisible(!visible)}
          className="px-4"
        >
          <Text className="font-semibold text-blue-600">
            {visible ? "Hide" : "Show"}
          </Text>
        </TouchableOpacity>
      </View>

      {error && (
        <Text className="mt-1 text-xs text-red-500">
          {error}
        </Text>
      )}
    </View>
  );
}