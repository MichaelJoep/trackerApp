import { useEffect } from "react";
import {
  ActivityIndicator,
  View,
} from "react-native";
import { Stack } from "expo-router";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { GestureHandlerRootView } from "react-native-gesture-handler";

import { useAuthStore } from "../store/auth.store";

import "../../global.css";

export default function RootLayout() {
  const initialize = useAuthStore(
    (state) => state.initialize,
  );

  const initialized = useAuthStore(
    (state) => state.initialized,
  );

  useEffect(() => {
    void initialize();
  }, [initialize]);

  if (!initialized) {
    return (
      <GestureHandlerRootView
        style={{ flex: 1 }}
      >
        <SafeAreaProvider>
          <StatusBar style="dark" />

          <View className="flex-1 items-center justify-center bg-white">
            <ActivityIndicator size="large" />
          </View>
        </SafeAreaProvider>
      </GestureHandlerRootView>
    );
  }

  return (
    <GestureHandlerRootView
      style={{ flex: 1 }}
    >
      <SafeAreaProvider>
        <StatusBar style="dark" />

        <Stack
          screenOptions={{
            headerShown: false,
          }}
        />
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}