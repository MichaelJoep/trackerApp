import { useState } from "react";
import {
  Text,
  TouchableOpacity,
} from "react-native";
import { router } from "expo-router";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

import AuthHeader from "../../components/auth/AuthHeader";
import AuthInput from "../../components/auth/AuthInput";
import PasswordInput from "../../components/auth/PasswordInput";
import AuthButton from "../../components/auth/AuthButton";
import AuthDivider from "../../components/auth/AuthDivider";
import SocialButton from "../../components/auth/SocialButton";
import AuthFooter from "../../components/auth/AuthFooter";

import { useAuthStore } from "../../store/auth.store";

export default function SignInScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const signIn = useAuthStore(
    (state) => state.signIn,
  );

  const loading = useAuthStore(
    (state) => state.loading,
  );

  
  const handleSignIn = async () => {
    try {
      await signIn(email, password);

      router.replace("/(tabs)");
    } catch (error) {
      alert(
        error instanceof Error
          ? error.message
          : "Unable to sign in",
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
        title="Welcome back"
        subtitle="Sign in to continue to your account."
      />

      {/* Email */}
      <AuthInput
        label="Email address"
        value={email}
        onChangeText={setEmail}
        placeholder="you@example.com"
        keyboardType="email-address"
        autoCapitalize="none"
        autoCorrect={false}
      />

      {/* Password */}
      <PasswordInput
        label="Password"
        value={password}
        onChangeText={setPassword}
      />

      {/* Forgot Password */}
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
    </KeyboardAwareScrollView>
  );
}