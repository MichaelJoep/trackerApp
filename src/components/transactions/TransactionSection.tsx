import {
    Text,
    View,
  } from "react-native";
  
  import TransactionItem, {
    Transaction,
  } from "./TransactionItem";
  
  interface TransactionSectionProps {
    title: string;
    transactions: Transaction[];
    onTransactionPress: (
      transaction: Transaction,
    ) => void;
    onTransactionDelete: (
      transaction: Transaction,
    ) => void;
  }
  
  export default function TransactionSection({
    title,
    transactions,
    onTransactionPress,
    onTransactionDelete,
  }: TransactionSectionProps) {
    return (
      <View className="mb-6">
        {/* Date */}
        <View className="mb-3 flex-row items-center justify-between">
          <Text className="text-sm font-bold text-slate-500">
            {title}
          </Text>
  
          <Text className="text-xs text-slate-400">
            {transactions.length} item
            {transactions.length !== 1
              ? "s"
              : ""}
          </Text>
        </View>
  
        {transactions.map(
          (transaction) => (
            <TransactionItem
              key={transaction.id}
              transaction={transaction}
              onPress={() =>
                onTransactionPress(
                  transaction,
                )
              }
              onDelete={() =>
                onTransactionDelete(
                  transaction,
                )
              }
            />
          ),
        )}
      </View>
    );
  }