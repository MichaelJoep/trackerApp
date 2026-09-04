import { Feather } from "@expo/vector-icons";
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

import {
  KeyboardAwareScrollView,
} from "react-native-keyboard-aware-scroll-view";

import { useEffect, useState } from "react";

import {
  Account,
  AccountType,
} from "../../services/account.api";

interface AccountFormModalProps {
  visible: boolean;
  account?: Account | null;
  saving?: boolean;
  onClose: () => void;
  onSubmit: (input: {
    name: string;
    type: AccountType;
    balance: number;
    isDefault: boolean;
  }) => Promise<void>;
}

const accountTypes: {
  value: AccountType;
  label: string;
  icon: keyof typeof Feather.glyphMap;
}[] = [
  {
    value: "bank",
    label: "Bank",
    icon: "home",
  },
  {
    value: "cash",
    label: "Cash",
    icon: "dollar-sign",
  },
  {
    value: "savings",
    label: "Savings",
    icon: "archive",
  },
  {
    value: "credit",
    label: "Credit",
    icon: "credit-card",
  },
  {
    value: "investment",
    label: "Investment",
    icon: "trending-up",
  },
  {
    value: "wallet",
    label: "Wallet",
    icon: "briefcase",
  },
  {
    value: "other",
    label: "Other",
    icon: "more-horizontal",
  },
];

export default function AccountFormModal({
  visible,
  account,
  saving = false,
  onClose,
  onSubmit,
}: AccountFormModalProps) {
  const editing = Boolean(account);

  const [name, setName] = useState("");
  const [type, setType] = useState<AccountType>("bank");
  const [balance, setBalance] = useState("");
  const [isDefault, setIsDefault] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  useEffect(() => {
    if (!visible) {
      return;
    }

    setName(account?.name ?? "");
    setType(
      account?.type ?? "bank",
    );

    setBalance(
      account
        ? String(account.balance)
        : "",
    );

    setIsDefault(
      account?.is_default ?? false,
    );

    setFormError(null);
  }, [visible, account]);


  const handleSubmit = async () => {
    const trimmedName =
      name.trim();

    if (!trimmedName) {
      setFormError(
        "Please enter an account name.",
      );

      return;
    }

    const numericBalance =
      balance.trim() === ""
        ? 0
        : Number(balance.replace(/,/g, ""),);

    if (
      Number.isNaN(numericBalance) ||
      numericBalance < 0
    ) {
      setFormError(
        "Please enter a valid balance.",
      );

      return;
    }

    setFormError(null);

    try {
      await onSubmit({
        name: trimmedName,
        type,
        balance: numericBalance,
        isDefault,
      });

      onClose();
    } catch {
      setFormError(
        "Unable to save the account. Please try again.",
      );
    }
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <KeyboardAvoidingView
        className="flex-1 justify-end"
        behavior={
          Platform.OS === "ios"
            ? "padding"
            : "height"
        }
      >
        <Pressable
          className="flex-1 bg-black/40"
          onPress={onClose}
        />

        <View className="max-h-[88%] rounded-t-3xl bg-white">
          {/* Modal Header */}
          <View className="px-6 pb-3 pt-5">
            <View className="mb-5 flex-row items-center justify-between">
              <View className="flex-1">
                <Text className="text-xl font-bold text-slate-900">
                  {editing
                    ? "Edit Account"
                    : "Add Account"}
                </Text>

                <Text className="mt-1 text-sm text-slate-500">
                  {editing
                    ? "Update your account details"
                    : "Add an account to track your money"}
                </Text>
              </View>

              <TouchableOpacity
                onPress={onClose}
                disabled={saving}
                activeOpacity={0.8}
                className="ml-4 h-10 w-10 items-center justify-center rounded-full bg-slate-100"
              >
                <Feather
                  name="x"
                  size={19}
                  color="#475569"
                />
              </TouchableOpacity>
            </View>
          </View>

          {/* Keyboard Aware Form */}
          <KeyboardAwareScrollView
            enableOnAndroid
            extraScrollHeight={24}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{
              paddingHorizontal: 24,
              paddingBottom: 40,
            }}
          >
            {/* Account Name */}
            <Text className="mb-2 text-sm font-semibold text-slate-700">
              Account Name
            </Text>

            <TextInput
              value={name}
              onChangeText={setName}
              placeholder="e.g. Main Account"
              placeholderTextColor="#94A3B8"
              returnKeyType="next"
              className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4 text-base text-slate-900"
            />

            {/* Account Type */}
            <Text className="mb-3 mt-5 text-sm font-semibold text-slate-700">
              Account Type
            </Text>

            <View className="flex-row flex-wrap">
              {accountTypes.map(
                (item) => {
                  const selected =
                    type ===
                    item.value;

                  return (
                    <TouchableOpacity
                      key={
                        item.value
                      }
                      onPress={() =>
                        setType(
                          item.value,
                        )
                      }
                      activeOpacity={0.8}
                      disabled={saving}
                      className={`mb-3 mr-2 flex-row items-center rounded-xl border px-3 py-3 ${
                        selected
                          ? "border-blue-600 bg-blue-50"
                          : "border-slate-200 bg-white"
                      }`}
                    >
                      <Feather
                        name={
                          item.icon
                        }
                        size={15}
                        color={
                          selected
                            ? "#2563EB"
                            : "#64748B"
                        }
                      />

                      <Text
                        className={`ml-2 text-xs font-semibold ${
                          selected
                            ? "text-blue-700"
                            : "text-slate-600"
                        }`}
                      >
                        {
                          item.label
                        }
                      </Text>
                    </TouchableOpacity>
                  );
                },
              )}
            </View>

            {/* Balance */}
            <Text className="mb-2 mt-2 text-sm font-semibold text-slate-700">
              Current Balance
            </Text>

            <View className="flex-row items-center rounded-2xl border border-slate-200 bg-slate-50 px-4">
              <Text className="mr-2 text-base font-semibold text-slate-500">
                ₦
              </Text>

              <TextInput
                value={balance}
                onChangeText={
                  setBalance
                }
                placeholder="0"
                placeholderTextColor="#94A3B8"
                keyboardType="decimal-pad"
                className="flex-1 py-4 text-base text-slate-900"
              />
            </View>

            {/* Default */}
            <TouchableOpacity
              onPress={() =>
                setIsDefault(
                  (previous) =>
                    !previous,
                )
              }
              disabled={saving}
              activeOpacity={0.8}
              className="mt-5 flex-row items-center rounded-2xl bg-slate-50 p-4"
            >
              <View
                className={`h-6 w-6 items-center justify-center rounded-md border ${
                  isDefault
                    ? "border-blue-600 bg-blue-600"
                    : "border-slate-300 bg-white"
                }`}
              >
                {isDefault && (
                  <Feather
                    name="check"
                    size={15}
                    color="#FFFFFF"
                  />
                )}
              </View>

              <View className="ml-3 flex-1">
                <Text className="text-sm font-semibold text-slate-800">
                  Make this the default account
                </Text>

                <Text className="mt-1 text-xs text-slate-500">
                  Use this account as your primary account.
                </Text>
              </View>
            </TouchableOpacity>

            {/* Error */}
            {formError && (
              <View className="mt-4 rounded-xl bg-red-50 p-3">
                <Text className="text-sm text-red-600">
                  {formError}
                </Text>
              </View>
            )}

            {/* Submit */}
            <TouchableOpacity
              onPress={
                handleSubmit
              }
              disabled={saving}
              activeOpacity={0.85}
              className={`mt-6 items-center rounded-2xl py-4 ${
                saving
                  ? "bg-blue-300"
                  : "bg-blue-600"
              }`}
            >
              {saving ? (
                <ActivityIndicator
                  color="#FFFFFF"
                />
              ) : (
                <Text className="text-base font-bold text-white">
                  {editing
                    ? "Save Changes"
                    : "Add Account"}
                </Text>
              )}
            </TouchableOpacity>
          </KeyboardAwareScrollView>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}