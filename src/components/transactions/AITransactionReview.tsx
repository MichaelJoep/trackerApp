import { Feather } from "@expo/vector-icons";
import {
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useState } from "react";

interface AITransactionReviewProps {
  result: {
    title: string;
    amount: number;
    category: string;
    date?: string;
    receiptUri: string;
  };

  onConfirm: (data: {
    title: string;
    amount: number;
    category: string;
  }) => void;

  onCancel: () => void;
}

export default function AITransactionReview({
  result,
  onConfirm,
  onCancel,
}: AITransactionReviewProps) {
  const [title, setTitle] =
    useState(result.title);

  const [amount, setAmount] =
    useState(String(result.amount));

  const [category, setCategory] =
    useState(result.category);

  const handleConfirm = () => {
    const numericAmount =
      Number(
        amount.replace(/,/g, ""),
      );

    if (
      !title.trim() ||
      !numericAmount ||
      numericAmount <= 0
    ) {
      return;
    }

    onConfirm({
      title: title.trim(),
      amount: numericAmount,
      category: category.trim(),
    });
  };

  return (
    <View>
      {/* AI result indicator */}
      <View className="mb-5 flex-row items-center rounded-2xl bg-blue-50 p-4">
        <View className="h-10 w-10 items-center justify-center rounded-full bg-blue-100">
          <Feather
            name="check"
            size={20}
            color="#2563EB"
          />
        </View>

        <View className="ml-3 flex-1">
          <Text className="font-bold text-blue-900">
            Receipt scanned
          </Text>

          <Text className="mt-1 text-xs text-blue-700">
            Review the extracted information before saving.
          </Text>
        </View>
      </View>

      {/* Merchant */}
      <Text className="mb-2 text-sm font-semibold text-slate-700">
        Merchant / Description
      </Text>

      <TextInput
        value={title}
        onChangeText={setTitle}
        className="mb-4 h-14 rounded-xl border border-slate-200 bg-slate-50 px-4 text-slate-900"
        placeholder="Merchant"
        placeholderTextColor="#94A3B8"
      />

      {/* Amount */}
      <Text className="mb-2 text-sm font-semibold text-slate-700">
        Amount
      </Text>

      <TextInput
        value={amount}
        onChangeText={setAmount}
        keyboardType="decimal-pad"
        className="mb-4 h-14 rounded-xl border border-slate-200 bg-slate-50 px-4 text-slate-900"
        placeholder="0.00"
        placeholderTextColor="#94A3B8"
      />

      {/* Category */}
      <Text className="mb-2 text-sm font-semibold text-slate-700">
        Category
      </Text>

      <TextInput
        value={category}
        onChangeText={setCategory}
        className="mb-6 h-14 rounded-xl border border-slate-200 bg-slate-50 px-4 text-slate-900"
        placeholder="Food"
        placeholderTextColor="#94A3B8"
      />

      {/* Confirm */}
      <TouchableOpacity
        onPress={handleConfirm}
        className="h-14 items-center justify-center rounded-2xl bg-blue-600"
      >
        <Text className="font-bold text-white">
          Save Transaction
        </Text>
      </TouchableOpacity>

      {/* Cancel */}
      <TouchableOpacity
        onPress={onCancel}
        className="mt-3 h-12 items-center justify-center"
      >
        <Text className="font-semibold text-slate-500">
          Scan Again
        </Text>
      </TouchableOpacity>
    </View>
  );
}