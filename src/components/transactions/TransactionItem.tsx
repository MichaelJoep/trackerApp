import {
    Text,
    TouchableOpacity,
    View,
  } from "react-native";
  import {Feather} from "@expo/vector-icons";
  import {Swipeable} from "react-native-gesture-handler";
  import {Transaction} from "../../store/transaction.store";
  
  export type {Transaction} from "../../store/transaction.store";

  // export interface Transaction {
  //   id: string;
  //   title: string;
  //   category: string;
  //   amount: number;
  //   type:
  //     | "income"
  //     | "expense"
  //     | "cash"
  //     | "earnings";
  //   account: string;
  //   date: string;
  //   time: string;
  //   note?: string;
  // }
  
  interface TransactionItemProps {
    transaction: Transaction;
    onPress: () => void;
    onDelete: () => void;
  }
  
  function getIcon(
    type: Transaction["type"],
  ) {
    switch (type) {
      case "income":
        return "arrow-down-left";
  
      case "earnings":
        return "trending-up";
  
      case "cash":
        return "dollar-sign";
  
      default:
        return "arrow-up-right";
    }
  }
  
  function getIconBackground(
    type: Transaction["type"],
  ) {
    switch (type) {
      case "income":
      case "earnings":
        return "bg-green-50";
  
      case "cash":
        return "bg-blue-50";
  
      default:
        return "bg-red-50";
    }
  }
  
  function getIconColor(
    type: Transaction["type"],
  ) {
    switch (type) {
      case "income":
      case "earnings":
        return "#16A34A";
  
      case "cash":
        return "#2563EB";
  
      default:
        return "#EF4444";
    }
  }
  
  function DeleteAction({
    onDelete,
  }: {
    onDelete: () => void;
  }) {
    return (
      <TouchableOpacity
        onPress={onDelete}
        activeOpacity={0.85}
        className="mb-2 ml-2 w-20 items-center justify-center"
      >
        <Feather
          name="trash-2"
          size={16}
          color="red"
        />
  
        <Text className="mt-1 text-xs font-bold text-red-400">
          Delete
        </Text>
      </TouchableOpacity>
    );
  }
  
  export default function TransactionItem({
    transaction,
    onPress,
    onDelete,
  }: TransactionItemProps) {
    const positive =
      transaction.type === "income" ||
      transaction.type === "earnings";
  
    return (
      <Swipeable
        renderRightActions={() => (
          <DeleteAction
            onDelete={onDelete}
          />
        )}
        overshootRight={false}
        rightThreshold={40}
      >
        <TouchableOpacity
          onPress={onPress}
          activeOpacity={0.7}
          className="mb-2 flex-row items-center rounded-2xl bg-white p-4"
        >
          {/* Icon */}
          <View
            className={`h-11 w-11 items-center justify-center rounded-full ${getIconBackground(
              transaction.type,
            )}`}
          >
            <Feather
              name={
                getIcon(
                  transaction.type,
                ) as any
              }
              size={19}
              color={getIconColor(
                transaction.type,
              )}
            />
          </View>
  
          {/* Information */}
          <View className="ml-3 flex-1">
            <Text
              className="text-sm font-bold text-slate-900"
              numberOfLines={1}
            >
              {transaction.title}
            </Text>
  
            <Text
              className="mt-1 text-xs text-slate-500"
              numberOfLines={1}
            >
              {transaction.category} •{" "}
              {transaction.account}
            </Text>
          </View>
  
          {/* Amount */}
          <View className="items-end">
            <Text
              className={`text-sm font-bold ${
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
                Math.abs(
                  transaction.amount,
                ),
              )}
            </Text>
  
            <Text className="mt-1 text-[11px] text-slate-400">
              {transaction.time}
            </Text>
          </View>
        </TouchableOpacity>
      </Swipeable>
    );
  }