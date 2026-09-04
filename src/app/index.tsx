import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  View,
} from "react-native";
import { Redirect } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";

import { useAuthStore } from "../store/auth.store";

const ONBOARDING_COMPLETED_KEY =
  "tracker_onboarding_completed";

export default function Index() {
  const initialized = useAuthStore(
    (state) => state.initialized,
  );

  const session = useAuthStore(
    (state) => state.session,
  );

  const user = useAuthStore(
    (state) => state.user,
  );

  const pendingVerificationEmail =
    useAuthStore(
      (state) =>
        state.pendingVerificationEmail,
    );

  const [
    onboardingCompleted,
    setOnboardingCompleted,
  ] = useState<boolean | null>(null);

  useEffect(() => {
    const checkAppState = async () => {
      try {
        const onboardingValue =
          await AsyncStorage.getItem(
            ONBOARDING_COMPLETED_KEY,
          );

        const isVerifiedUser =
          Boolean(
            session &&
              user?.email_confirmed_at,
          );

        /*
         * BACKWARD COMPATIBILITY:
         *
         * An existing verified user may have been
         * using an older version of the app before
         * the onboarding flag was introduced.
         *
         * If we detect such a user, automatically
         * mark onboarding as completed.
         */
        if (
          isVerifiedUser &&
          onboardingValue !== "true"
        ) {
          await AsyncStorage.setItem(
            ONBOARDING_COMPLETED_KEY,
            "true",
          );

          setOnboardingCompleted(true);
          return;
        }

        setOnboardingCompleted(
          onboardingValue === "true",
        );
      } catch (error) {
        console.error(
          "Failed to check app startup state:",
          error,
        );

        setOnboardingCompleted(false);
      }
    };

    void checkAppState();
  }, [
    session,
    user?.email_confirmed_at,
  ]);

  /*
   * Wait until both Supabase authentication and
   * local onboarding state have been restored.
   */
  if (
    !initialized ||
    onboardingCompleted === null
  ) {
    return (
      <View className="flex-1 items-center justify-center bg-white">
        <ActivityIndicator size="large" />
      </View>
    );
  }

  /*
   * 1. Registered but not verified.
   *
   * Pending verification takes priority because
   * the user must finish account confirmation.
   */
  if (pendingVerificationEmail) {
    return (
      <Redirect
        href={{
          pathname:
            "/(auth)/otp-verification",
          params: {
            email:
              pendingVerificationEmail,
            purpose: "signup",
          },
        }}
      />
    );
  }

  /*
   * 2. Verified user with an active session.
   *
   * This includes old accounts created before
   * the onboarding implementation.
   */
  if (
    session &&
    user?.email_confirmed_at
  ) {
    return (
      <Redirect
        href="/(tabs)"
      />
    );
  }

  /*
   * 3. A user has previously completed onboarding
   * but is currently signed out.
   */
  if (onboardingCompleted) {
    return (
      <Redirect
        href="/(auth)/sign-in"
      />
    );
  }

  /*
   * 4. Completely new installation/user.
   *
   * Show splash → onboarding flow.
   */
  return (
    <Redirect
      href="/(root)/splash"
    />
  );
}