import { useState } from "react";
import {
  Text,
  View,
} from "react-native";
import { router } from "expo-router";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

import AuthHeader from "../../components/auth/AuthHeader";
import AuthInput from "../../components/auth/AuthInput";
import PasswordInput from "../../components/auth/PasswordInput";
import AuthButton from "../../components/auth/AuthButton";
import AuthFooter from "../../components/auth/AuthFooter";

import { useAuthStore } from "../../store/auth.store";

import {
  FieldErrors,
  validateEmail,
  validateName,
  validatePassword,
  validatePhone,
} from "../../utils/validation";

export default function SignUpScreen() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");

  const [errors, setErrors] = useState<FieldErrors>({});

  const loading = useAuthStore(
    (state) => state.loading,
  );

  const signUp = useAuthStore(
    (state) => state.signUp,
  );

  const clearError = (field: string) => {
    setErrors((currentErrors) => ({
      ...currentErrors,
      [field]: undefined,
    }));
  };

  const handleSignUp = async () => {
    const newErrors: FieldErrors = {};

    const firstNameError = validateName(
      firstName,
      "First name",
    );

    const lastNameError = validateName(
      lastName,
      "Last name",
    );

    const emailError = validateEmail(email);

    const phoneError = validatePhone(phone);

    const passwordError = validatePassword(password);

    if (firstNameError) {
      newErrors.firstName = firstNameError;
    }

    if (lastNameError) {
      newErrors.lastName = lastNameError;
    }

    if (emailError) {
      newErrors.email = emailError;
    }

    if (phoneError) {
      newErrors.phone = phoneError;
    }

    if (passwordError) {
      newErrors.password = passwordError;
    }

    setErrors(newErrors);

    // Stop before sending invalid data to Supabase.
    if (Object.keys(newErrors).length > 0) {
      return;
    }

    const normalizedEmail =
      email.trim().toLowerCase();

    try {
      await signUp({
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        email: normalizedEmail,
        phone: phone.trim(),
        password,
      });

      router.push({
        pathname: "/(auth)/otp-verification",
        params: {
          email: normalizedEmail,
          purpose: "signup",
        },
      });
    } catch (error) {
      alert(
        error instanceof Error
          ? error.message
          : "Unable to create account",
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
      <AuthHeader
        title="Create account"
        subtitle="Create an account to start tracking your activities."
      />

      <View className="flex-row">
        <View className="mr-2 flex-1">
          <AuthInput
            label="First name"
            value={firstName}
            onChangeText={(text) => {
              setFirstName(text);
              clearError("firstName");
            }}
            placeholder="First name"
            error={errors.firstName}
            autoCapitalize="words"
          />
        </View>

        <View className="ml-2 flex-1">
          <AuthInput
            label="Last name"
            value={lastName}
            onChangeText={(text) => {
              setLastName(text);
              clearError("lastName");
            }}
            placeholder="Last name"
            error={errors.lastName}
            autoCapitalize="words"
          />
        </View>
      </View>

      <AuthInput
        label="Email address"
        value={email}
        onChangeText={(text) => {
          setEmail(text);
          clearError("email");
        }}
        placeholder="you@example.com"
        error={errors.email}
        keyboardType="email-address"
        autoCapitalize="none"
        autoCorrect={false}
      />

      <AuthInput
        label="Phone number"
        value={phone}
        onChangeText={(text) => {
          setPhone(text);
          clearError("phone");
        }}
        placeholder="08012345678"
        error={errors.phone}
        keyboardType="phone-pad"
      />

      <PasswordInput
        label="Password"
        value={password}
        onChangeText={(text) => {
          setPassword(text);
          clearError("password");
        }}
        error={errors.password}
      />

      <Text className="mb-6 text-xs leading-5 text-slate-500">
        Your password should contain at least 8 characters.
      </Text>

      <Text className="mb-6 text-xs leading-5 text-slate-500">
        By creating an account, you agree to our Terms of
        Service and Privacy Policy.
      </Text>

      <AuthButton
        title="Create Account"
        onPress={handleSignUp}
        loading={loading}
      />

      <AuthFooter
        message="Already have an account?"
        actionText="Sign In"
        onPress={() => router.push("/(auth)/sign-in")}
      />
    </KeyboardAwareScrollView>
  );
}