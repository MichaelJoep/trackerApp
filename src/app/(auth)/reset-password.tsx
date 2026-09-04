import { useState } from "react";
import {
  Text,
} from "react-native";
import { router } from "expo-router";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

import AuthHeader from "../../components/auth/AuthHeader";
import PasswordInput from "../../components/auth/PasswordInput";
import AuthButton from "../../components/auth/AuthButton";

import { useAuthStore } from "../../store/auth.store";

import {
  FieldErrors,
  validateConfirmPassword,
  validatePassword,
} from "../../utils/validation";

export default function ResetPasswordScreen() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] =
    useState("");

  const [errors, setErrors] = useState<FieldErrors>({});

  const updatePassword = useAuthStore(
    (state) => state.updatePassword,
  );

  const loading = useAuthStore(
    (state) => state.loading,
  );

  const clearError = (field: string) => {
    setErrors((currentErrors) => ({
      ...currentErrors,
      [field]: undefined,
    }));
  };

  const handleResetPassword = async () => {
    const newErrors: FieldErrors = {};

    const passwordError =
      validatePassword(password);

    const confirmPasswordError =
      validateConfirmPassword(
        password,
        confirmPassword,
      );

    if (passwordError) {
      newErrors.password = passwordError;
    }

    if (confirmPasswordError) {
      newErrors.confirmPassword =
        confirmPasswordError;
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) {
      return;
    }

    try {
      await updatePassword(password);

      alert("Password reset successfully");

      await useAuthStore
        .getState()
        .signOut();

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
        onChangeText={(text) => {
          setPassword(text);
          clearError("password");
        }}
        placeholder="Enter new password"
        error={errors.password}
      />

      <PasswordInput
        label="Confirm password"
        value={confirmPassword}
        onChangeText={(text) => {
          setConfirmPassword(text);
          clearError("confirmPassword");
        }}
        placeholder="Confirm new password"
        error={errors.confirmPassword}
      />

      <Text className="mb-6 text-xs leading-5 text-slate-500">
        Your password should contain at least 8 characters.
      </Text>

      <AuthButton
        title="Reset Password"
        onPress={handleResetPassword}
        loading={loading}
      />
    </KeyboardAwareScrollView>
  );
}