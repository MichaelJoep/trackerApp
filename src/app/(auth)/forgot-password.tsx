import { useState } from "react";
import {
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { router } from "expo-router";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

import AuthHeader from "../components/auth/AuthHeader";
import AuthInput from "../components/auth/AuthInput";
import AuthButton from "../components/auth/AuthButton";

import { useAuthStore } from "../../store/auth.store";

export default function ForgotPasswordScreen() {
  const [email, setEmail] = useState("");

  const forgotPassword = useAuthStore(
    (state) => state.forgotPassword,
  );

  const handleSendCode = async () => {
    try {
      await forgotPassword(email);
  
      router.push({
        pathname: "/(auth)/otp-verification",
        params: {
          email,
          purpose: "forgot-password",
        },
      });
    } catch (error) {
      alert(
        error instanceof Error
          ? error.message
          : "Unable to send reset code",
      );
    }
  };


  return (
    <KeyboardAwareScrollView
      className="flex-1 bg-white"
      contentContainerClassName="grow px-6 pb-20 pt-12"
      enableOnAndroid
      extraScrollHeight={40}
      extraHeight={100}
      keyboardShouldPersistTaps="handled"
      showsVerticalScrollIndicator={false}
    >
      {/* Back */}
      <TouchableOpacity
        onPress={() => router.back()}
        className="mb-8"
      >
        <Text className="font-semibold text-blue-600">
          ← Back
        </Text>
      </TouchableOpacity>

      <AuthHeader
        title="Forgot password?"
        subtitle="Enter your email address and we'll send you a verification code to reset your password."
      />

      <AuthInput
        label="Email address"
        value={email}
        onChangeText={setEmail}
        placeholder="you@example.com"
        keyboardType="email-address"
        autoCapitalize="none"
        autoCorrect={false}
      />

      <AuthButton
        title="Send Verification Code"
        onPress={handleSendCode}
      />

      <View className="mt-8 items-center">
        <Text className="text-sm text-slate-500">
          Remember your password?
        </Text>

        <TouchableOpacity
          onPress={() => router.push("/(auth)/sign-in")}
          className="mt-2"
        >
          <Text className="font-bold text-blue-600">
            Sign In
          </Text>
        </TouchableOpacity>
      </View>
    </KeyboardAwareScrollView>
  );
}