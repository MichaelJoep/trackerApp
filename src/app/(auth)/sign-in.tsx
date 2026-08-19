import { useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { router } from "expo-router";

import AuthHeader from "../components/auth/AuthHeader";
import AuthInput from "../components/auth/AuthInput";
import PasswordInput from "../components/auth/PasswordInput";
import AuthButton from "../components/auth/AuthButton";
import AuthDivider from "../components/auth/AuthDivider";
import SocialButton from "../components/auth/SocialButton";
import AuthFooter from "../components/auth/AuthFooter";

export default function SignInScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSignIn = async () => {
    setLoading(true);

    try {
      // Connect your API here.

      await new Promise((resolve) =>
        setTimeout(resolve, 1000)
      );

      router.replace("/");
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
        contentContainerClassName="flex-grow px-6 pb-10 pt-16"
        keyboardShouldPersistTaps="handled"
      >
        <AuthHeader
          title="Welcome back"
          subtitle="Sign in to continue to your account."
        />

        <AuthInput
          label="Email address"
          value={email}
          onChangeText={setEmail}
          placeholder="you@example.com"
          keyboardType="email-address"
          autoCapitalize="none"
        />

        <PasswordInput
          label="Password"
          value={password}
          onChangeText={setPassword}
        />

        <TouchableOpacity
          onPress={() => router.push("/(auth)/forgot-password")}
          className="mb-6 self-end"
        >
          <Text className="font-semibold text-blue-600">
            Forgot password?
          </Text>
        </TouchableOpacity>

        <AuthButton
          title="Sign In"
          onPress={handleSignIn}
          loading={loading}
        />

        <AuthDivider />

        <SocialButton
          title="Continue with Google"
          onPress={() => {}}
        />

        <AuthFooter
          message="Don't have an account?"
          actionText="Sign Up"
          onPress={() => router.push("/(auth)/sign-up")}
        />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}