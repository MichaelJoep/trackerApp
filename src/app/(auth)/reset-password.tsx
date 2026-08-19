import { useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
} from "react-native";
import { router, useLocalSearchParams } from "expo-router";

import AuthHeader from "../components/auth/AuthHeader";
import PasswordInput from "../components/auth/PasswordInput";
import AuthButton from "../components/auth/AuthButton";

export default function ResetPasswordScreen() {
  const params = useLocalSearchParams<{
    email?: string;
    otp?: string;
  }>();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] =
    useState("");

  const [loading, setLoading] = useState(false);

  const handleResetPassword = async () => {
    if (password !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    setLoading(true);

    try {
      // Call reset-password API here.
      // email: params.email
      // otp: params.otp
      // password

      await new Promise((resolve) =>
        setTimeout(resolve, 1000)
      );

      alert("Password reset successfully");

      router.replace("/(auth)/sign-in");
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
        keyboardShouldPersistTaps="handled"
      >
        <AuthHeader
          title="Reset password"
          subtitle="Create a new password for your account."
        />

        <PasswordInput
          label="New password"
          value={password}
          onChangeText={setPassword}
          placeholder="Enter new password"
        />

        <PasswordInput
          label="Confirm password"
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          placeholder="Confirm new password"
        />

        <Text className="mb-6 text-xs leading-5 text-slate-500">
          Your password should contain at least 8 characters.
        </Text>

        <AuthButton
          title="Reset Password"
          onPress={handleResetPassword}
          loading={loading}
        />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}