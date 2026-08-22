import { useRef } from "react";
import {
  NativeSyntheticEvent,
  TextInput,
  TextInputKeyPressEventData,
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
  const inputRefs = useRef<Array<TextInput | null>>([]);

  const digits = value.padEnd(6, "").split("").slice(0, 6);

  const handleChange = (
    text: string,
    index: number
  ) => {
    const cleaned = text.replace(/[^0-9]/g, "");

    // Handle pasted OTP e.g. 123456
    if (cleaned.length > 1) {
      const pasted = cleaned.slice(0, 6);

      onChangeText(pasted);

      const nextIndex = Math.min(
        pasted.length,
        5
      );

      inputRefs.current[nextIndex]?.focus();

      return;
    }

    const currentDigits = value
      .replace(/[^0-9]/g, "")
      .split("");

    currentDigits[index] = cleaned;

    const newValue = currentDigits
      .join("")
      .slice(0, 6);

    onChangeText(newValue);

    if (
      cleaned &&
      index < 5
    ) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyPress = (
    event: NativeSyntheticEvent<TextInputKeyPressEventData>,
    index: number
  ) => {
    if (
      event.nativeEvent.key === "Backspace" &&
      !digits[index] &&
      index > 0
    ) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  return (
    <View className="mb-8 flex-row justify-between">
      {Array.from({ length: 6 }).map((_, index) => (
        <TextInput
          key={index}
          ref={(ref) => {
            inputRefs.current[index] = ref;
          }}
          value={digits[index] || ""}
          onChangeText={(text) =>
            handleChange(text, index)
          }
          onKeyPress={(event) =>
            handleKeyPress(event, index)
          }
          keyboardType="number-pad"
          maxLength={6}
          selectTextOnFocus
          className="h-14 w-12 rounded-xl border border-slate-300 bg-slate-50 text-center text-xl font-bold text-slate-900"
        />
      ))}
    </View>
  );
}