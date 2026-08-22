import { useState } from "react";
import {
  Text,
} from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

import AuthHeader from "../components/auth/AuthHeader";
import PasswordInput from "../components/auth/PasswordInput";
import AuthButton from "../components/auth/AuthButton";

import { useAuthStore } from "../../store/auth.store";

export default function ResetPasswordScreen() {
  const params = useLocalSearchParams<{
    email?: string;
    otp?: string;
  }>();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] =
    useState("");

  const updatePassword = useAuthStore(
    (state) => state.updatePassword,
  );
  
  const loading = useAuthStore(
    (state) => state.loading,
  );

  
  const handleResetPassword = async () => {
    if (password !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    if (password.length < 8) {
      alert(
        "Password must contain at least 8 characters",
      );
      return;
    }

    try {
      await updatePassword(password);

      alert("Password reset successfully");

      await useAuthStore.getState().signOut();

      router.replace("/(auth)/sign-in");
    } catch (error) {
      alert(
        error instanceof Error
          ? error.message
          : "Unable to reset password",
      );
    }
  };


  return (
    <KeyboardAwareScrollView
      className="flex-1 bg-white"
      contentContainerClassName="grow px-6 pb-20 pt-16"
      enableOnAndroid
      extraScrollHeight={40}
      extraHeight={100}
      keyboardShouldPersistTaps="handled"
      showsVerticalScrollIndicator={false}
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
      />
    </KeyboardAwareScrollView>
  );
}