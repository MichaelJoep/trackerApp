import { Feather } from "@expo/vector-icons";
import {
  Modal,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useEffect, useState } from "react";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import AITransactionScanner from "./AITransactionScanner";
import VoiceTransactionInput from "./VoiceTransactionInput";
import AITransactionReview from "./AITransactionReview";

import {
  AddTransactionInput,
  TransactionInputMethod,
  TransactionType,
} from "../../store/transaction.store";

import {
  AIReceiptScanResult,
} from "../../services/ai-scanner.api";

import {
  AIVoiceTransactionResult,
} from "../../services/ai-voice.api";

interface AddTransactionModalProps {
  visible: boolean;

  onClose: () => void;

  onAdd: (
    transaction: AddTransactionInput,
  ) => void;
}

type InputMode =
  | "manual"
  | "scan"
  | "voice";

const categories = [
  "Food",
  "Transport",
  "Bills",
  "Shopping",
  "Entertainment",
  "Health",
  "Education",
  "Salary",
  "Freelance",
  "Other",
];

export default function AddTransactionModal({
  visible,
  onClose,
  onAdd,
}: AddTransactionModalProps) {
  /*
   * ------------------------------------------------
   * STATE
   * ------------------------------------------------
   */

  const [mode, setMode] =
    useState<InputMode>(
      "manual",
    );

  const [type, setType] =
    useState<TransactionType>(
      "expense",
    );

  const [title, setTitle] =
    useState("");

  const [amount, setAmount] =
    useState("");

  const [category, setCategory] =
    useState("General");

  const [account, setAccount] =
    useState("Main Account");

  const [note, setNote] =
    useState("");

  const [aiResult, setAIResult] =
    useState<
      AIReceiptScanResult |
      AIVoiceTransactionResult |
      null
    >(null);

  /*
   * ------------------------------------------------
   * RESET
   * ------------------------------------------------
   */

  const reset = () => {
    setMode("manual");
    setType("expense");
    setTitle("");
    setAmount("");
    setCategory("General");
    setAccount("Main Account");
    setNote("");
    setAIResult(null);
  };

  useEffect(() => {
    if (!visible) {
      reset();
    }
  }, [visible]);

  /*
   * ------------------------------------------------
   * MANUAL SAVE
   * ------------------------------------------------
   */

  const handleManualSave = () => {
    const numericAmount =
      Number(
        amount.replace(/,/g, ""),
      );

    if (!title.trim()) {
      return;
    }

    if (
      !Number.isFinite(
        numericAmount,
      ) ||
      numericAmount <= 0
    ) {
      return;
    }

    onAdd({
      title: title.trim(),
      amount: numericAmount,
      type,
      category:
        category.trim() ||
        "General",
      account:
        account.trim() ||
        "Main Account",
      note:
        note.trim(),
      inputMethod:
        "manual",
    });

    reset();
    onClose();
  };

  /*
   * ------------------------------------------------
   * AI SCAN RESULT
   * ------------------------------------------------
   */

  const handleScanned = (
    result: AIReceiptScanResult,
  ) => {
    setAIResult(result);
  };

  /*
   * ------------------------------------------------
   * VOICE RESULT
   * ------------------------------------------------
   */

  const handleTranscribed = (
    result: AIVoiceTransactionResult,
  ) => {
    setAIResult(result);
  };

  /*
   * ------------------------------------------------
   * CONFIRM AI RESULT
   * ------------------------------------------------
   */

  const handleAIConfirm = (
    result: any,
  ) => {
    const inputMethod =
      result.inputMethod as TransactionInputMethod;

    onAdd({
      title:
        result.title,

      amount:
        result.amount,

      type:
        result.type ||
        "expense",

      category:
        result.category ||
        "General",

      account:
        account,

      date:
        result.date,

      note:
        result.note,

      inputMethod,

      voiceTranscription:
        result.voiceTranscription ||
        null,

      receiptUri:
        result.receiptUri ||
        null,
    });

    reset();

    onClose();
  };

  /*
   * ------------------------------------------------
   * RENDER
   * ------------------------------------------------
   */

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent
      onRequestClose={onClose}
    >
      <View className="flex-1 justify-end bg-black/40">
        <View className="max-h-[94%] rounded-t-[32px] bg-white">
          {/* Header */}
          <View className="flex-row items-center justify-between border-b border-slate-100 px-6 py-5">
            <View>
              <Text className="text-xl font-bold text-slate-900">
                Add Transaction
              </Text>

              <Text className="mt-1 text-xs text-slate-400">
                Choose how you want to add it
              </Text>
            </View>

            <TouchableOpacity
              onPress={onClose}
              className="h-10 w-10 items-center justify-center rounded-full bg-slate-100"
            >
              <Feather
                name="x"
                size={20}
                color="#475569"
              />
            </TouchableOpacity>
          </View>

          <KeyboardAwareScrollView
            enableOnAndroid
            extraScrollHeight={24}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{
              paddingHorizontal: 24,
              paddingBottom: 40,
              paddingTop: 20,
            }}
          >
            {/* Input method */}
            <View className="mb-6 flex-row rounded-2xl bg-slate-100 p-1">
              <TouchableOpacity
                onPress={() => {
                  setMode("manual");
                  setAIResult(null);
                }}
                className={`flex-1 flex-row items-center justify-center rounded-xl py-3 ${
                  mode === "manual"
                    ? "bg-white"
                    : ""
                }`}
              >
                <Feather
                  name="edit-3"
                  size={15}
                  color={
                    mode === "manual"
                      ? "#2563EB"
                      : "#64748B"
                  }
                />

                <Text
                  className={`ml-2 text-xs font-bold ${
                    mode ===
                    "manual"
                      ? "text-blue-600"
                      : "text-slate-500"
                  }`}
                >
                  Manual
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => {
                  setMode("scan");
                  setAIResult(null);
                }}
                className={`flex-1 flex-row items-center justify-center rounded-xl py-3 ${
                  mode === "scan"
                    ? "bg-white"
                    : ""
                }`}
              >
                <Feather
                  name="camera"
                  size={15}
                  color={
                    mode === "scan"
                      ? "#2563EB"
                      : "#64748B"
                  }
                />

                <Text
                  className={`ml-2 text-xs font-bold ${
                    mode ===
                    "scan"
                      ? "text-blue-600"
                      : "text-slate-500"
                  }`}
                >
                  AI Scan
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => {
                  setMode("voice");
                  setAIResult(null);
                }}
                className={`flex-1 flex-row items-center justify-center rounded-xl py-3 ${
                  mode === "voice"
                    ? "bg-white"
                    : ""
                }`}
              >
                <Feather
                  name="mic"
                  size={15}
                  color={
                    mode === "voice"
                      ? "#2563EB"
                      : "#64748B"
                  }
                />

                <Text
                  className={`ml-2 text-xs font-bold ${
                    mode ===
                    "voice"
                      ? "text-blue-600"
                      : "text-slate-500"
                  }`}
                >
                  Voice
                </Text>
              </TouchableOpacity>
            </View>

            {/* -------------------------------------- */}
            {/* MANUAL */}
            {/* -------------------------------------- */}

            {mode === "manual" && (
              <View>
                {/* Type */}
                <Text className="mb-2 text-sm font-semibold text-slate-700">
                  Transaction Type
                </Text>

                <View className="mb-5 flex-row">
                  {[
                    {
                      label: "Expense",
                      value: "expense" as const,
                      selectedBorder: "border-red-500",
                      selectedBackground: "bg-red-50",
                      selectedText: "text-red-600",
                    },
                    {
                      label: "Income",
                      value: "income" as const,
                      selectedBorder: "border-green-500",
                      selectedBackground: "bg-green-50",
                      selectedText: "text-green-600",
                    },
                  ].map((item) => {
                    const selected = type === item.value;

                    return (
                      <TouchableOpacity
                        key={item.value}
                        onPress={() => setType(item.value)}
                        activeOpacity={0.8}
                        className={`mr-2 rounded-xl border px-5 py-3 ${
                          selected
                            ? `${item.selectedBorder} ${item.selectedBackground}`
                            : "border-slate-200 bg-white"
                        }`}
                      >
                        <Text
                          className={`text-xs font-bold ${
                            selected
                              ? item.selectedText
                              : "text-slate-500"
                          }`}
                        >
                          {item.label}
                        </Text>
                      </TouchableOpacity>
                    );
                  })}
                </View>

                {/* Title */}
                <Text className="mb-2 text-sm font-semibold text-slate-700">
                  Description
                </Text>

                <TextInput
                  value={title}
                  onChangeText={
                    setTitle
                  }
                  placeholder="e.g. Grocery Shopping"
                  placeholderTextColor="#94A3B8"
                  className="mb-4 h-14 rounded-xl border border-slate-200 bg-slate-50 px-4 text-slate-900"
                />

                {/* Amount */}
                <Text className="mb-2 text-sm font-semibold text-slate-700">
                  Amount
                </Text>

                <TextInput
                  value={amount}
                  onChangeText={
                    setAmount
                  }
                  keyboardType="decimal-pad"
                  placeholder="0.00"
                  placeholderTextColor="#94A3B8"
                  className="mb-4 h-14 rounded-xl border border-slate-200 bg-slate-50 px-4 text-slate-900"
                />

                {/* Category */}
                <Text className="mb-2 text-sm font-semibold text-slate-700">
                  Category
                </Text>

                <View className="mb-4 flex-row flex-wrap">
                  {categories.map(
                    (item) => (
                      <TouchableOpacity
                        key={item}
                        onPress={() =>
                          setCategory(
                            item,
                          )
                        }
                        className={`mb-2 mr-2 rounded-full border px-4 py-2.5 ${
                          category ===
                          item
                            ? "border-blue-600 bg-blue-50"
                            : "border-slate-200 bg-white"
                        }`}
                      >
                        <Text
                          className={`text-xs font-semibold ${
                            category ===
                            item
                              ? "text-blue-600"
                              : "text-slate-500"
                          }`}
                        >
                          {item}
                        </Text>
                      </TouchableOpacity>
                    ),
                  )}
                </View>

                {/* Account */}
                <Text className="mb-2 text-sm font-semibold text-slate-700">
                  Account
                </Text>

                <TextInput
                  value={account}
                  onChangeText={
                    setAccount
                  }
                  placeholder="Main Account"
                  placeholderTextColor="#94A3B8"
                  className="mb-4 h-14 rounded-xl border border-slate-200 bg-slate-50 px-4 text-slate-900"
                />

                {/* Note */}
                <Text className="mb-2 text-sm font-semibold text-slate-700">
                  Note
                </Text>

                <TextInput
                  value={note}
                  onChangeText={
                    setNote
                  }
                  placeholder="Optional note"
                  placeholderTextColor="#94A3B8"
                  multiline
                  className="mb-6 min-h-20 rounded-xl border border-slate-200 bg-slate-50 px-4 py-4 text-slate-900"
                  textAlignVertical="top"
                />

                {/* Save */}
                <TouchableOpacity
                  onPress={
                    handleManualSave
                  }
                  activeOpacity={0.85}
                  className="h-14 items-center justify-center rounded-2xl bg-blue-600"
                >
                  <Text className="font-bold text-white">
                    Save Transaction
                  </Text>
                </TouchableOpacity>
              </View>
            )}

            {/* -------------------------------------- */}
            {/* SCAN */}
            {/* -------------------------------------- */}

            {mode === "scan" &&
              !aiResult && (
                <AITransactionScanner
                  onScanned={
                    handleScanned
                  }
                />
              )}

            {/* -------------------------------------- */}
            {/* VOICE */}
            {/* -------------------------------------- */}

            {mode === "voice" &&
              !aiResult && (
                <VoiceTransactionInput
                  onTranscribed={
                    handleTranscribed
                  }
                />
              )}

            {/* -------------------------------------- */}
            {/* AI REVIEW */}
            {/* -------------------------------------- */}

            {aiResult && (
              <AITransactionReview
                result={{
                  title:
                    aiResult.title,

                  amount:
                    aiResult.amount,

                  category:
                    aiResult.category,

                  type:
                    aiResult.type,

                  date:
                    aiResult.date,

                  note:
                    aiResult.note,

                  receiptUri:
                    "receiptUri" in
                    aiResult
                      ? aiResult.receiptUri
                      : null,

                  voiceTranscription:
                    "transcription" in
                    aiResult
                      ? aiResult.transcription
                      : null,

                  inputMethod:
                    aiResult.inputMethod,
                }}
                onConfirm={
                  handleAIConfirm
                }
                onCancel={() =>
                  setAIResult(
                    null,
                  )
                }
              />
            )}
          </KeyboardAwareScrollView>
        </View>
      </View>
    </Modal>
  );
}