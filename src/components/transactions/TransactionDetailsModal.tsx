import {
    Modal,
    Text,
    TouchableOpacity,
    View,
  } from "react-native";
  import { Feather } from "@expo/vector-icons";
  
  import {
    Transaction,
  } from "./TransactionItem";
  
  interface TransactionDetailsModalProps {
    visible: boolean;
    transaction: Transaction | null;
    onClose: () => void;
  }
  
  export default function TransactionDetailsModal({
    visible,
    transaction,
    onClose,
  }: TransactionDetailsModalProps) {
    if (!transaction) {
      return null;
    }
  
    const positive =
      transaction.type === "income" ||
      transaction.type === "earnings";
  
    return (
      <Modal
        visible={visible}
        transparent
        animationType="slide"
        onRequestClose={onClose}
      >
        <View className="flex-1 justify-end bg-black/40">
          <View className="rounded-t-3xl bg-white px-6 pb-10 pt-5">
            {/* Handle */}
            <View className="mb-5 items-center">
              <View className="h-1.5 w-12 rounded-full bg-slate-200" />
            </View>
  
            {/* Header */}
            <View className="mb-6 flex-row items-center justify-between">
              <Text className="text-xl font-bold text-slate-900">
                Transaction details
              </Text>
  
              <TouchableOpacity
                onPress={onClose}
                className="h-9 w-9 items-center justify-center rounded-full bg-slate-100"
              >
                <Feather
                  name="x"
                  size={18}
                  color="#475569"
                />
              </TouchableOpacity>
            </View>
  
            {/* Icon */}
            <View className="items-center">
              <View className="h-16 w-16 items-center justify-center rounded-full bg-blue-50">
                <Feather
                  name={
                    positive
                      ? "arrow-down-left"
                      : "arrow-up-right"
                  }
                  size={27}
                  color={
                    positive
                      ? "#16A34A"
                      : "#EF4444"
                  }
                />
              </View>
  
              <Text className="mt-4 text-lg font-bold text-slate-900">
                {transaction.title}
              </Text>
  
              <Text
                className={`mt-2 text-2xl font-bold ${
                  positive
                    ? "text-green-600"
                    : "text-red-500"
                }`}
              >
                {positive ? "+" : "-"}
                {new Intl.NumberFormat(
                  "en-NG",
                  {
                    style: "currency",
                    currency: "NGN",
                    minimumFractionDigits: 2,
                  },
                ).format(
                  Math.abs(transaction.amount),
                )}
              </Text>
            </View>
  
            {/* Details */}
            <View className="mt-8 rounded-2xl bg-slate-50 p-4">
              <Detail
                label="Category"
                value={transaction.category}
              />
  
              <Detail
                label="Account"
                value={transaction.account}
              />
  
              <Detail
                label="Date"
                value={transaction.date}
              />
  
              <Detail
                label="Time"
                value={transaction.time}
              />
  
              {transaction.note && (
                <Detail
                  label="Note"
                  value={transaction.note}
                />
              )}
            </View>
  
            <TouchableOpacity
              onPress={onClose}
              className="mt-5 h-14 items-center justify-center rounded-xl bg-blue-600"
            >
              <Text className="font-bold text-white">
                Done
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    );
  }
  
  function Detail({
    label,
    value,
  }: {
    label: string;
    value: string;
  }) {
    return (
      <View className="mb-4 flex-row justify-between">
        <Text className="text-sm text-slate-500">
          {label}
        </Text>
  
        <Text className="max-w-[60%] text-right text-sm font-semibold text-slate-800">
          {value}
        </Text>
      </View>
    );
  }