import { useState } from "react";
import {
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import {
  Feather,
  Ionicons,
} from "@expo/vector-icons";

import QuickAction from "./QuickAction";
import UserMenuDropdown from "./UserMenuDropdown";

interface BalanceCardProps {
  balance?: number;
}

export default function BalanceCard({
  balance = 0,
}: BalanceCardProps) {
  const [
    balanceVisible,
    setBalanceVisible,
  ] = useState(true);

  const [
    userMenuVisible,
    setUserMenuVisible,
  ] = useState(false);

  const formattedBalance =
    new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
      minimumFractionDigits: 2,
    }).format(balance);

  return (
    <View className="relative mb-6 rounded-3xl bg-blue-600 p-6">
      {/* Balance header */}
      <View className="flex-row items-center justify-between">
        {/* Total balance and visibility */}
        <View className="flex-row items-center">
          <Text className="text-sm font-medium text-blue-100">
            Total Balance
          </Text>

          <TouchableOpacity
            onPress={() =>
              setBalanceVisible(
                (previous) => !previous,
              )
            }
            className="ml-2 h-8 w-8 items-center justify-center rounded-full bg-white/15"
          >
            <Feather
              name={
                balanceVisible
                  ? "eye"
                  : "eye-off"
              }
              size={16}
              color="#FFFFFF"
            />
          </TouchableOpacity>
        </View>

        {/* User menu */}
        <View className="relative">
          <TouchableOpacity
            onPress={() =>
              setUserMenuVisible(
                (previous) => !previous,
              )
            }
            className="h-10 w-10 items-center justify-center rounded-full bg-white/15"
          >
            <Feather
              name="user"
              size={20}
              color="#FFFFFF"
            />
          </TouchableOpacity>

          {/* Dropdown */}
          {userMenuVisible && (
            <UserMenuDropdown
              onClose={() =>
                setUserMenuVisible(false)
              }
            />
          )}
        </View>
      </View>

      {/* Balance */}
      <Text className="mt-3 text-3xl font-bold text-white">
        {balanceVisible
          ? formattedBalance
          : "••••••••"}
      </Text>

      <Text className="mt-2 text-sm text-blue-100">
        Your combined account balance
      </Text>

      {/* Divider */}
      <View className="my-6 h-px bg-white/20" />

      {/* Quick actions */}
      <View className="flex-row justify-between">
        <QuickAction
          label="AI Receipt"
          icon={
            <Feather
              name="camera"
              size={22}
              color="#FFFFFF"
            />
          }
          onPress={() => {
            // Connect AI receipt feature later.
          }}
        />

        <QuickAction
          label="Voice Entry"
          icon={
            <Feather
              name="mic"
              size={22}
              color="#FFFFFF"
            />
          }
          onPress={() => {
            // Connect voice entry feature later.
          }}
        />

        <QuickAction
          label="Add Manually"
          icon={
            <Ionicons
              name="add"
              size={26}
              color="#FFFFFF"
            />
          }
          onPress={() => {
            // Open transaction creation later.
          }}
        />
      </View>
    </View>
  );
}