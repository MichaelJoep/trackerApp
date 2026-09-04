import { Feather } from "@expo/vector-icons";
import {
  Alert,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import {
  Account,
  AccountType,
} from "../../services/account.api";

interface AccountCardProps {
  account: Account;
  onEdit: () => void;
  onDelete: () => void;
  onSetDefault: () => void;
  deleting?: boolean;
}

const accountConfig: Record<
  AccountType,
  {
    icon: keyof typeof Feather.glyphMap;
    label: string;
  }
> = {
  bank: {
    icon: "home",
    label: "Bank Account",
  },
  cash: {
    icon: "dollar-sign",
    label: "Cash",
  },
  savings: {
    icon: "archive",
    label: "Savings",
  },
  credit: {
    icon: "credit-card",
    label: "Credit",
  },
  investment: {
    icon: "trending-up",
    label: "Investment",
  },
  wallet: {
    icon: "briefcase",
    label: "Wallet",
  },
  other: {
    icon: "more-horizontal",
    label: "Other",
  },
};

export default function AccountCard({
  account,
  onEdit,
  onDelete,
  onSetDefault,
  deleting = false,
}: AccountCardProps) {
  const config =
    accountConfig[account.type] ??
    accountConfig.other;

  const confirmDelete = () => {
    Alert.alert(
      "Delete Account",
      `Are you sure you want to delete "${account.name}"?`,
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Delete",
          style: "destructive",
          onPress: onDelete,
        },
      ],
    );
  };

  return (
    <View className="mb-4 rounded-3xl bg-white p-5">
      <View className="flex-row items-start justify-between">
        <View className="flex-1 flex-row items-center">
          <View className="mr-4 h-12 w-12 items-center justify-center rounded-2xl bg-blue-50">
            <Feather
              name={config.icon}
              size={21}
              color="#2563EB"
            />
          </View>

          <View className="flex-1">
            <View className="flex-row items-center">
              <Text
                numberOfLines={1}
                className="mr-2 flex-shrink text-base font-bold text-slate-900"
              >
                {account.name}
              </Text>

              {account.is_default && (
                <View className="rounded-full bg-green-50 px-2 py-1">
                  <Text className="text-[10px] font-bold text-green-700">
                    DEFAULT
                  </Text>
                </View>
              )}
            </View>

            <Text className="mt-1 text-sm text-slate-500">
              {config.label}
            </Text>
          </View>
        </View>

        <TouchableOpacity
          onPress={onEdit}
          activeOpacity={0.7}
          className="h-9 w-9 items-center justify-center rounded-full bg-slate-50"
        >
          <Feather
            name="more-horizontal"
            size={19}
            color="#64748B"
          />
        </TouchableOpacity>
      </View>

      <View className="mt-6">
        <Text className="text-xs font-medium text-slate-400">
          Available Balance
        </Text>

        <Text className="mt-1 text-2xl font-bold text-slate-900">
          ₦{Number(
            account.balance,
          ).toLocaleString()}
        </Text>
      </View>

      <View className="mt-5 flex-row">
        {!account.is_default && (
          <TouchableOpacity
            onPress={onSetDefault}
            disabled={deleting}
            activeOpacity={0.8}
            className="mr-2 flex-1 flex-row items-center justify-center rounded-xl border border-slate-200 py-3"
          >
            <Feather
              name="check-circle"
              size={15}
              color="#475569"
            />

            <Text className="ml-2 text-xs font-semibold text-slate-600">
              Set Default
            </Text>
          </TouchableOpacity>
        )}

        <TouchableOpacity
          onPress={confirmDelete}
          disabled={deleting}
          activeOpacity={0.8}
          className={`${
            account.is_default
              ? "flex-1"
              : "w-12"
          } items-center justify-center rounded-xl bg-red-50 py-3`}
        >
          <Feather
            name="trash-2"
            size={16}
            color="#EF4444"
          />
        </TouchableOpacity>
      </View>
    </View>
  );
}