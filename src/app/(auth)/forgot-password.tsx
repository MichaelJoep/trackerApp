import { useState } from "react";
import {
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { router } from "expo-router";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import {
  FieldErrors,
  validateEmail,
} from "../../utils/validation";

import AuthHeader from "../../components/auth/AuthHeader";
import AuthInput from "../../components/auth/AuthInput";
import AuthButton from "../../components/auth/AuthButton";

import { useAuthStore } from "../../store/auth.store";

export default function ForgotPasswordScreen() {
  const [email, setEmail] = useState("");
  const [errors, setErrors] = useState<FieldErrors>({});

  const forgotPassword = useAuthStore(
    (state) => state.forgotPassword,
  );

  const loading = useAuthStore(
    (state) => state.loading,
  );


  const handleSendCode = async () => {
    const emailError = validateEmail(email);
  
    if (emailError) {
      setErrors({
        email: emailError,
      });
  
      return;
    }
  
    const normalizedEmail =
      email.trim().toLowerCase();
  
    setErrors({});
  
    try {
      await forgotPassword(normalizedEmail);
  
      router.push({
        pathname: "/(auth)/otp-verification",
        params: {
          email: normalizedEmail,
          purpose: "forgot-password",
        },
      });
    } catch (error) {
      alert(
        error instanceof Error
          ? error.message
          : "Unable to send verification code",
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
        onChangeText={(text) => {
          setEmail(text);

          setErrors((currentErrors) => ({
            ...currentErrors,
            email: undefined,
          }));
        }}
        placeholder="you@example.com"
        error={errors.email}
        keyboardType="email-address"
        autoCapitalize="none"
        autoCorrect={false}
      />

      <AuthButton
        title="Send Verification Code"
        onPress={handleSendCode}
        loading={loading}
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