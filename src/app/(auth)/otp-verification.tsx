import {useState} from "react";
import {Text, TouchableOpacity, View } from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import {validateOtp,} from "../../utils/validation";
  
import AuthHeader from "../../components/auth/AuthHeader";
import OTPInput from "../../components/auth/OTPInput";
import AuthButton from "../../components/auth/AuthButton";
import { useAuthStore } from "../../store/auth.store";
  
export default function OTPVerificationScreen() {
    const params = useLocalSearchParams<{
      email?: string;
      purpose?: string;
    }>();

    const [otp, setOtp] = useState("");

    const verifyOtp = useAuthStore((state) => state.verifyOtp,);
    const resendOtp = useAuthStore((state) => state.resendOtp,);
    const loading = useAuthStore((state) => state.loading,);
    const isForgotPassword = params.purpose === "forgot-password";
  

    const handleVerify = async () => {
      if (!params.email) {
        alert("Email address is missing");
        return;
      }
    
      const otpError = validateOtp(otp);
    
      if (otpError) {
        alert(otpError);
        return;
      }
    
      try {
        await verifyOtp(
          params.email.trim().toLowerCase(),
          otp,
          isForgotPassword
            ? "forgot-password"
            : "signup",
        );
    
        if (isForgotPassword) {
          router.push({
            pathname: "/(auth)/reset-password",
            params: {
              email: params.email,
            },
          });
    
          return;
        }
    
        router.replace("/(tabs)");
      } catch (error) {
        alert(
          error instanceof Error
            ? error.message
            : "Invalid verification code",
        );
      }
    };


  const handleResendCode = async () => {
    if (!params.email) {
      alert("Email address is missing");
      return;
    }

    try {
      await resendOtp(
        params.email,
        isForgotPassword
          ? "forgot-password"
          : "signup",
      );

      setOtp("");

      alert(
        "A new verification code has been sent to your email.",
      );
    } catch (error) {
      alert(
        error instanceof Error
          ? error.message
          : "Unable to resend verification code",
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
        <TouchableOpacity
          onPress={() => router.back()}
          className="mb-8"
        >
          <Text className="font-semibold text-blue-600">
            ← Back
          </Text>
        </TouchableOpacity>
  
        <AuthHeader
          title="Verify your account"
          subtitle={`Enter the 6-digit code sent to ${
            params.email || "your email"
          }.`}
        />
  
        <OTPInput
          value={otp}
          onChangeText={setOtp}
        />
  
        <AuthButton
          title="Verify Code"
          onPress={handleVerify}
          loading={loading}
          disabled={otp.length !== 6}
        />
  
        <View className="mt-6 items-center">
          <Text className="text-sm text-slate-500">
            Didn't receive the code?
          </Text>
  
          <TouchableOpacity
            onPress={handleResendCode}
            disabled={loading}
            className="mt-2"
          >
          <Text className="font-bold text-blue-600">
            {loading
              ? "Sending..."
              : "Resend Code"}
          </Text>
        </TouchableOpacity>
        </View>
      </KeyboardAwareScrollView>
    );
  }