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
  const inputRefs =
    useRef<Array<TextInput | null>>([]);

  const digits = Array.from(
    { length: 6 },
    (_, index) => value[index] ?? "",
  );

  const handleChange = (
    text: string,
    index: number,
  ) => {
    const cleaned = text.replace(
      /[^0-9]/g,
      "",
    );

    // Handles pasted OTP.
    if (cleaned.length > 1) {
      const pasted = cleaned.slice(0, 6);

      onChangeText(pasted);

      const focusIndex =
        Math.min(pasted.length, 5);

      inputRefs.current[focusIndex]?.focus();

      return;
    }

    const updatedDigits = [...digits];

    updatedDigits[index] = cleaned;

    const newValue =
      updatedDigits.join("").slice(0, 6);

    onChangeText(newValue);

    if (cleaned && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyPress = (
    event: NativeSyntheticEvent<TextInputKeyPressEventData>,
    index: number,
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
      {digits.map((digit, index) => (
        <TextInput
          key={index}
          ref={(ref) => {
            inputRefs.current[index] = ref;
          }}
          value={digit}
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