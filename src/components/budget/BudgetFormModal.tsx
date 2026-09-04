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
import { useEffect, useState } from "react";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

interface BudgetFormModalProps {
  visible: boolean;
  amount?: number | null;
  saving?: boolean;
  onClose: () => void;
  onSubmit: (amount: number) => Promise<void>;
}

export default function BudgetFormModal({
  visible,
  amount,
  saving = false,
  onClose,
  onSubmit,
}: BudgetFormModalProps) {
  const editing = amount !== null && amount !== undefined;

  const [budgetAmount, setBudgetAmount] = useState("");
  const [formError, setFormError] = useState<string | null>(
    null,
  );

  /**
   * Populate the form when opening in add/edit mode.
   */
  useEffect(() => {
    if (!visible) return;

    setBudgetAmount(
      amount !== null && amount !== undefined
        ? String(amount)
        : "",
    );

    setFormError(null);
  }, [visible, amount]);

  /**
   * Validate and submit the monthly budget.
   */
  const handleSubmit = async () => {
    const normalized = budgetAmount
      .replace(/,/g, "")
      .trim();

    if (!normalized) {
      setFormError("Please enter your monthly budget.");
      return;
    }

    const numericAmount = Number(normalized);

    if (
      Number.isNaN(numericAmount) ||
      !Number.isFinite(numericAmount) ||
      numericAmount <= 0
    ) {
      setFormError(
        "Please enter a valid budget greater than ₦0.",
      );
      return;
    }

    setFormError(null);

    try {
      await onSubmit(numericAmount);
      onClose();
    } catch {
      setFormError(
        "Unable to save the budget. Please try again.",
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
        {/* Dismiss modal by tapping outside */}
        <Pressable
          className="flex-1 bg-black/40"
          onPress={onClose}
        />

        <View className="max-h-[75%] rounded-t-3xl bg-white">
          {/* Modal header */}
          <View className="px-6 pb-3 pt-5">
            <View className="flex-row items-center justify-between">
              <View className="flex-1">
                <Text className="text-xl font-bold text-slate-900">
                  {editing
                    ? "Edit Budget"
                    : "Create Budget"}
                </Text>

                <Text className="mt-1 text-sm text-slate-500">
                  {editing
                    ? "Update your monthly spending limit"
                    : "Set a spending limit for this month"}
                </Text>
              </View>

              <TouchableOpacity
                onPress={onClose}
                disabled={saving}
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

          {/* Keyboard-aware form */}
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
            {/* Amount field */}
            <View className="mt-4">
              <Text className="mb-2 text-sm font-semibold text-slate-700">
                Monthly Budget
              </Text>

              <View className="flex-row items-center rounded-2xl border border-slate-200 bg-slate-50 px-4">
                <Text className="mr-2 text-lg font-bold text-slate-500">
                  ₦
                </Text>

                <TextInput
                  value={budgetAmount}
                  onChangeText={(value) => {
                    setBudgetAmount(value);
                    setFormError(null);
                  }}
                  placeholder="500,000"
                  placeholderTextColor="#94A3B8"
                  keyboardType="decimal-pad"
                  editable={!saving}
                  className="flex-1 py-4 text-base font-semibold text-slate-900"
                />
              </View>

              <Text className="mt-2 text-xs leading-5 text-slate-400">
                Set the maximum amount you plan to spend
                during the month.
              </Text>
            </View>

            {/* Validation error */}
            {formError && (
              <View className="mt-4 flex-row items-start rounded-2xl border border-red-100 bg-red-50 p-4">
                <Feather
                  name="alert-circle"
                  size={17}
                  color="#DC2626"
                />

                <Text className="ml-3 flex-1 text-xs leading-5 text-red-600">
                  {formError}
                </Text>
              </View>
            )}

            {/* Save button */}
            <TouchableOpacity
              onPress={handleSubmit}
              disabled={saving}
              activeOpacity={0.85}
              className={`mt-6 h-14 flex-row items-center justify-center rounded-2xl ${
                saving
                  ? "bg-blue-300"
                  : "bg-blue-600"
              }`}
            >
              {saving ? (
                <ActivityIndicator color="#FFFFFF" />
              ) : (
                <>
                  <Feather
                    name={editing ? "check" : "plus"}
                    size={18}
                    color="#FFFFFF"
                  />

                  <Text className="ml-2 font-bold text-white">
                    {editing
                      ? "Update Budget"
                      : "Create Budget"}
                  </Text>
                </>
              )}
            </TouchableOpacity>
          </KeyboardAwareScrollView>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}