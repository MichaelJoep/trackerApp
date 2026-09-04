import { useState } from "react";
import {
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import { router } from "expo-router";

import { useAuthStore } from "../../store/auth.store";

interface UserMenuDropdownProps {
  onClose: () => void;
}

export default function UserMenuDropdown({
  onClose,
}: UserMenuDropdownProps) {
  const user = useAuthStore(
    (state) => state.user,
  );

  const signOut = useAuthStore(
    (state) => state.signOut,
  );

  const [signingOut, setSigningOut] =
    useState(false);

  const firstName =
    user?.user_metadata?.first_name || "User";

  const lastName =
    user?.user_metadata?.last_name || "";

  const email =
    user?.email || "No email address";

  const handleSignOut = async () => {
    try {
      setSigningOut(true);

      await signOut();

      router.replace("/(auth)/sign-in");
    } catch (error) {
      alert(
        error instanceof Error
          ? error.message
          : "Unable to sign out",
      );
    } finally {
      setSigningOut(false);
    }
  };

  return (
    <View
      className="absolute right-0 top-12 z-50 w-72 rounded-2xl bg-white p-4"
      style={{
        elevation: 10,
        shadowColor: "#000",
        shadowOffset: {
          width: 0,
          height: 6,
        },
        shadowOpacity: 0.12,
        shadowRadius: 12,
      }}
    >
      {/* User information */}
      <View className="mb-4 flex-row items-center border-b border-slate-100 pb-4">
        <View className="mr-3 h-11 w-11 items-center justify-center rounded-full bg-blue-100">
          <Text className="text-base font-bold text-blue-600">
            {firstName.charAt(0).toUpperCase()}
          </Text>
        </View>

        <View className="flex-1">
          <Text
            className="text-base font-bold text-slate-900"
            numberOfLines={1}
          >
            {firstName} {lastName}
          </Text>

          <Text
            className="mt-1 text-xs text-slate-500"
            numberOfLines={1}
          >
            {email}
          </Text>
        </View>

        <TouchableOpacity
          onPress={onClose}
          className="p-1"
        >
          <Feather
            name="x"
            size={18}
            color="#64748B"
          />
        </TouchableOpacity>
      </View>

      {/* Profile */}
      <TouchableOpacity
        onPress={() => {
          onClose();
          router.push("/(root)/(tabs)/profile");
        }}
        className="flex-row items-center rounded-xl px-3 py-3 active:bg-slate-50"
      >
        <Feather
          name="user"
          size={19}
          color="#475569"
        />

        <Text className="ml-3 font-medium text-slate-700">
          My Profile
        </Text>
      </TouchableOpacity>

      {/* Settings */}
      <TouchableOpacity
        onPress={() => {
          onClose();

          /*
           * A dedicated settings screen can be
           * connected here later.
           */
        }}
        className="flex-row items-center rounded-xl px-3 py-3"
      >
        <Feather
          name="settings"
          size={19}
          color="#475569"
        />

        <Text className="ml-3 font-medium text-slate-700">
          Settings
        </Text>
      </TouchableOpacity>

      {/* Sign out */}
      <View className="my-2 h-px bg-slate-100" />

      <TouchableOpacity
        onPress={handleSignOut}
        disabled={signingOut}
        className="flex-row items-center rounded-xl px-3 py-3"
      >
        <Feather
          name="log-out"
          size={19}
          color="#EF4444"
        />

        <Text className="ml-3 font-semibold text-red-500">
          {signingOut
            ? "Signing out..."
            : "Sign Out"}
        </Text>
      </TouchableOpacity>
    </View>
  );
}