import { useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { router, useLocalSearchParams } from "expo-router";

import AuthHeader from "../components/auth/AuthHeader";
import OTPInput from "../components/auth/OTPInput";
import AuthButton from "../components/auth/AuthButton";

export default function OTPVerificationScreen() {
  const params = useLocalSearchParams<{
    email?: string;
    purpose?: string;
  }>();

  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);

  const handleVerify = async () => {
    setLoading(true);

    try {
      // Verify OTP with backend.

      await new Promise((resolve) =>
        setTimeout(resolve, 1000)
      );

      router.push({
        pathname: "/(auth)/reset-password",
        params: {
          email: params.email,
          otp,
        },
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      className="flex-1 bg-white"
      behavior={
        Platform.OS === "ios" ? "padding" : undefined
      }
    >
      <ScrollView
        contentContainerClassName="px-6 pb-10 pt-16"
      >
        <TouchableOpacity
          onPress={() => router.back()}
          className="mb-8"
        >
          <Text className="font-semibold text-blue-600">
            ← Back
          </Text>
        </TouchableOpacity>

        <AuthHeader
          title="Verify your account"
          subtitle={`Enter the 6-digit code sent to ${
            params.email || "your email"
          }.`}
        />

        <OTPInput
          value={otp}
          onChangeText={setOtp}
        />

        <AuthButton
          title="Verify Code"
          onPress={handleVerify}
          loading={loading}
          disabled={otp.length !== 6}
        />

        <View className="mt-6 items-center">
          <Text className="text-sm text-slate-500">
            Didn't receive the code?
          </Text>

          <TouchableOpacity className="mt-2">
            <Text className="font-bold text-blue-600">
              Resend Code
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}