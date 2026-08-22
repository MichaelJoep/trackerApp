import { useState } from "react";
import {
  Text,
  View,
} from "react-native";
import { router } from "expo-router";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

import AuthHeader from "../components/auth/AuthHeader";
import AuthInput from "../components/auth/AuthInput";
import PasswordInput from "../components/auth/PasswordInput";
import AuthButton from "../components/auth/AuthButton";
import AuthFooter from "../components/auth/AuthFooter";
import { useAuthStore } from "../../store/auth.store";

export default function SignUpScreen() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");

  const loading = useAuthStore(
    (state) => state.loading,
  );

  const signUp = useAuthStore(
    (state) => state.signUp,
  );


  const handleSignUp = async () => {
    try {
      await signUp({
        firstName,
        lastName,
        email,
        phone,
        password,
      });

      router.push({
        pathname: "/(auth)/otp-verification",
        params: {
          email,
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

      {/* First + Last Name */}
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

      {/* Phone */}
      <AuthInput
        label="Phone number"
        value={phone}
        onChangeText={setPhone}
        placeholder="08012345678"
        keyboardType="phone-pad"
      />

      {/* Password */}
      <PasswordInput
        label="Password"
        value={password}
        onChangeText={setPassword}
      />

      {/* Terms */}
      <Text className="mb-6 text-xs leading-5 text-slate-500">
        By creating an account, you agree to our Terms of
        Service and Privacy Policy.
      </Text>

      {/* Create Account */}
      <AuthButton
        title="Create Account"
        onPress={handleSignUp}
      />

      {/* Footer */}
      <AuthFooter
        message="Already have an account?"
        actionText="Sign In"
        onPress={() => router.push("/(auth)/sign-in")}
      />
    </KeyboardAwareScrollView>
  );
}