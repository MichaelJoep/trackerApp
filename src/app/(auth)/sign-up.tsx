import { useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  View,
} from "react-native";
import { router } from "expo-router";

import AuthHeader from "../components/auth/AuthHeader";
import AuthInput from "../components/auth/AuthInput";
import PasswordInput from "../components/auth/PasswordInput";
import AuthButton from "../components/auth/AuthButton";
import AuthFooter from "../components/auth/AuthFooter";

export default function SignUpScreen() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSignUp = async () => {
    setLoading(true);

    try {
      // Connect registration API here.

      await new Promise((resolve) =>
        setTimeout(resolve, 1000)
      );

      router.push("/(auth)/otp-verification");
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
        contentContainerClassName="px-6 pb-10 pt-12"
        keyboardShouldPersistTaps="handled"
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
              onChangeText={setFirstName}
              placeholder="First name"
            />
          </View>

          <View className="ml-2 flex-1">
            <AuthInput
              label="Last name"
              value={lastName}
              onChangeText={setLastName}
              placeholder="Last name"
            />
          </View>
        </View>

        <AuthInput
          label="Email address"
          value={email}
          onChangeText={setEmail}
          placeholder="you@example.com"
          keyboardType="email-address"
          autoCapitalize="none"
        />

        <AuthInput
          label="Phone number"
          value={phone}
          onChangeText={setPhone}
          placeholder="08012345678"
          keyboardType="phone-pad"
        />

        <PasswordInput
          label="Password"
          value={password}
          onChangeText={setPassword}
        />

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
      </ScrollView>
    </KeyboardAvoidingView>
  );
}