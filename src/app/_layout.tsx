import { useEffect } from "react";
import { Stack } from "expo-router";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { useAuthStore } from "../store/auth.store";
import "../../global.css";

export default function RootLayout() {
  const initialize = useAuthStore(
    (state) => state.initialize,
  );

  useEffect(() => {
    initialize();
  }, [initialize]);
  
  return (
    <SafeAreaProvider>
      <StatusBar style="dark" />

      <Stack
        screenOptions={{
          headerShown: false,
        }}
      />
    </SafeAreaProvider>
  );
}