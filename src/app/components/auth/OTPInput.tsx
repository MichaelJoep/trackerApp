import { useRef } from "react";
import {
  TextInput,
  View,
} from "react-native";

interface OTPInputProps {
  value: string;
  onChangeText: (value: string) => void;
}

export default function OTPInput({
  value,
  onChangeText,
}: OTPInputProps) {
  const inputRef = useRef<TextInput>(null);

  return (
    <View className="mb-8">
      <TextInput
        ref={inputRef}
        value={value}
        onChangeText={(text) => {
          const cleaned = text
            .replace(/[^0-9]/g, "")
            .slice(0, 6);

          onChangeText(cleaned);
        }}
        keyboardType="number-pad"
        maxLength={6}
        autoFocus
        className="h-16 rounded-xl border border-slate-200 bg-slate-50 text-center text-2xl font-bold tracking-[12px] text-slate-900"
      />
    </View>
  );
}