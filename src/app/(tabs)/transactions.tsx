import {
  useMemo,
  useState,
} from "react";

import {
  Alert,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import { Feather } from "@expo/vector-icons";

import { router } from "expo-router";

import TransactionSearch from "../../components/transactions/TransactionSearch";
import TransactionFilters, {
  TransactionFilter,
  TransactionView,
} from "../../components/transactions/TransactionFilters";
import TransactionSummary from "../../components/transactions/TransactionSummary";
import TransactionSection from "../../components/transactions/TransactionSection";
import TransactionDetailsModal from "../../components/transactions/TransactionDetailsModal";
import AddTransactionModal from "../../components/transactions/AddTransactionModal";
import HistoryItem from "../../components/transactions/HistoryItem";
import TransactionBarChart from "../../components/transactions/TransactionBarChart";

import {
  useTransactionStore,
  Transaction,
} from "../../store/transaction.store";

/*
 * ----------------------------------------------------
 * TRANSACTIONS SCREEN
 * ----------------------------------------------------
 */

export default function TransactionsScreen() {
  /*
   * ------------------------------------------------
   * STORE
   * ------------------------------------------------
   */

  const transactions = useTransactionStore((state) => state.transactions);
  const history = useTransactionStore((state) => state.history);
  const addTransaction = useTransactionStore((state) => state.addTransaction);
  const deleteTransaction = useTransactionStore((state) => state.deleteTransaction);
  const deleteHistory = useTransactionStore((state) => state.deleteHistory);

  /*
   * ------------------------------------------------
   * SEARCH
   * ------------------------------------------------
   */

  const [search, setSearch] = useState("");

  /*
   * ------------------------------------------------
   * FILTER
   * ------------------------------------------------
   */

  const [activeFilter, setActiveFilter] = useState<TransactionFilter>("All");

  /*
   * ------------------------------------------------
   * VIEW
   * ------------------------------------------------
   */

  const [activeView, setActiveView] = useState<TransactionView>("transactions");

  /*
   * ------------------------------------------------
   * MODALS
   * ------------------------------------------------
   */

  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);
  const [detailsVisible, setDetailsVisible] = useState(false);
  const [addModalVisible, setAddModalVisible] = useState(false);

  /*
   * ------------------------------------------------
   * FILTER TRANSACTIONS
   * ------------------------------------------------
   */

  const filteredTransactions =
    useMemo(() => {
      const query =
        search
          .trim()
          .toLowerCase();

      return transactions.filter(
        (transaction) => {
          const matchesSearch =
            !query ||
            transaction.title
              .toLowerCase()
              .includes(query) ||
            transaction.category
              .toLowerCase()
              .includes(query) ||
            transaction.account
              .toLowerCase()
              .includes(query);

          if (!matchesSearch) {
            return false;
          }

          switch (
            activeFilter
          ) {
            case "Expense":
              return (
                transaction.type ===
                  "expense" ||
                transaction.type ===
                  "cash"
              );

            case "Income":
              return (
                transaction.type ===
                  "income" ||
                transaction.type ===
                  "earnings"
              );

            case "Cash":
              return (
                transaction.type ===
                "cash"
              );

            case "Earnings":
              return (
                transaction.type ===
                "earnings"
              );

            default:
              return true;
          }
        },
      );
    }, [
      transactions,
      search,
      activeFilter,
    ]);

  /*
   * ------------------------------------------------
   * SUMMARY
   * ------------------------------------------------
   */

  const income =
    useMemo(
      () =>
        filteredTransactions
          .filter(
            (item) =>
              item.type ===
                "income" ||
              item.type ===
                "earnings",
          )
          .reduce(
            (
              total,
              item,
            ) =>
              total +
              item.amount,
            0,
          ),
      [filteredTransactions],
    );

  const expenses =
    useMemo(
      () =>
        filteredTransactions
          .filter(
            (item) =>
              item.type ===
                "expense" ||
              item.type ===
                "cash",
          )
          .reduce(
            (
              total,
              item,
            ) =>
              total +
              item.amount,
            0,
          ),
      [filteredTransactions],
    );

  /*
   * ------------------------------------------------
   * GROUP BY DATE
   * ------------------------------------------------
   */

  const groupedTransactions =
    useMemo(() => {
      return filteredTransactions.reduce<
        Record<
          string,
          Transaction[]
        >
      >(
        (
          groups,
          transaction,
        ) => {
          if (
            !groups[
              transaction.date
            ]
          ) {
            groups[
              transaction.date
            ] = [];
          }

          groups[
            transaction.date
          ].push(
            transaction,
          );

          return groups;
        },
        {},
      );
    }, [
      filteredTransactions,
    ]);

  /*
   * ------------------------------------------------
   * ADD TRANSACTION
   * ------------------------------------------------
   */

  const handleAddTransaction =
    (input: {
      title: string;
      amount: number;
      type:
        | "income"
        | "expense";
    }) => {
      addTransaction({
        ...input,

        inputMethod:
          "manual",
      });
    };

  /*
   * ------------------------------------------------
   * TRANSACTION DETAILS
   * ------------------------------------------------
   */

  const handleTransactionPress =
    (
      transaction: Transaction,
    ) => {
      setSelectedTransaction(
        transaction,
      );

      setDetailsVisible(
        true,
      );
    };

  /*
   * ------------------------------------------------
   * DELETE TRANSACTION
   * ------------------------------------------------
   */

  const handleDeleteTransaction =
    (
      transaction: Transaction,
    ) => {
      Alert.alert(
        "Delete transaction",
        `Delete "${transaction.title}"?`,
        [
          {
            text: "Cancel",
            style: "cancel",
          },
          {
            text: "Delete",
            style: "destructive",
            onPress: () => {
              deleteTransaction(
                transaction.id,
              );

              if (
                selectedTransaction?.id ===
                transaction.id
              ) {
                setSelectedTransaction(
                  null,
                );

                setDetailsVisible(
                  false,
                );
              }
            },
          },
        ],
      );
    };

  /*
   * ------------------------------------------------
   * RENDER
   * ------------------------------------------------
   */

  return (
    <>
      <ScrollView
        className="flex-1 bg-slate-50"
        contentContainerClassName="px-6 pb-12 pt-14"
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View className="mb-7 flex-row items-center justify-between">
          <View className="flex-1">
            <Text className="text-2xl font-bold text-slate-900">
              Transactions
            </Text>

            <Text className="mt-1 text-sm text-slate-500">
              Track your income and expenses
            </Text>
          </View>

          <View className="ml-4 flex-row">
            {/* AI assistant */}
            <TouchableOpacity
              onPress={() =>
                router.push(
                  "/ai-assistant",
                )
              }
              activeOpacity={0.8}
              className="mr-2 h-11 w-11 items-center justify-center rounded-full bg-blue-50"
            >
              <Feather
                name="message-circle"
                size={19}
                color="#2563EB"
              />
            </TouchableOpacity>

            {/* Add */}
            <TouchableOpacity
              onPress={() =>
                setAddModalVisible(
                  true,
                )
              }
              activeOpacity={0.8}
              className="h-11 w-11 items-center justify-center rounded-full bg-blue-600"
            >
              <Feather
                name="plus"
                size={22}
                color="#FFFFFF"
              />
            </TouchableOpacity>
          </View>
        </View>

        {/* Search */}
        <TransactionSearch
          value={search}
          onChangeText={
            setSearch
          }
        />

        {/* Summary */}
        <TransactionSummary
          income={income}
          expenses={expenses}
        />

        {/* Bar chart */}
        <TransactionBarChart
          transactions={
            filteredTransactions
          }
        />

        {/* Filters */}
        <TransactionFilters
          activeFilter={
            activeFilter
          }
          onFilterChange={
            setActiveFilter
          }
          activeView={
            activeView
          }
          onViewChange={
            setActiveView
          }
        />

        {/* Transactions */}
        {activeView ===
        "transactions" ? (
          <>
            <View className="mb-4 flex-row items-center justify-between">
              <Text className="text-lg font-bold text-slate-900">
                Recent activity
              </Text>

              <Text className="text-xs font-medium text-slate-400">
                {
                  filteredTransactions.length
                }{" "}
                transaction
                {filteredTransactions.length !==
                1
                  ? "s"
                  : ""}
              </Text>
            </View>

            {Object.keys(
              groupedTransactions,
            ).length > 0 ? (
              Object.entries(
                groupedTransactions,
              ).map(
                ([
                  date,
                  dateTransactions,
                ]) => (
                  <TransactionSection
                    key={date}
                    title={date}
                    transactions={
                      dateTransactions
                    }
                    onTransactionPress={
                      handleTransactionPress
                    }
                    onTransactionDelete={
                      handleDeleteTransaction
                    }
                  />
                ),
              )
            ) : (
              <View className="rounded-3xl bg-white px-6 py-12">
                <View className="mx-auto h-14 w-14 items-center justify-center rounded-full bg-slate-100">
                  <Feather
                    name="search"
                    size={24}
                    color="#94A3B8"
                  />
                </View>

                <Text className="mt-5 text-center text-lg font-bold text-slate-900">
                  No transactions found
                </Text>

                <Text className="mt-2 text-center text-sm leading-5 text-slate-500">
                  Try changing your
                  search or filter.
                </Text>
              </View>
            )}
          </>
        ) : (
          <>
            {/* History */}
            <View className="mb-4 flex-row items-center justify-between">
              <View>
                <Text className="text-lg font-bold text-slate-900">
                  History
                </Text>

                <Text className="mt-1 text-xs text-slate-400">
                  Your recent activity
                </Text>
              </View>

              <Text className="text-xs font-medium text-slate-400">
                {history.length} record
                {history.length !==
                1
                  ? "s"
                  : ""}
              </Text>
            </View>

            {history.length >
            0 ? (
              history.map(
                (item) => (
                  <HistoryItem
                    key={item.id}
                    item={item}
                    onDelete={() =>
                      deleteHistory(
                        item.id,
                      )
                    }
                  />
                ),
              )
            ) : (
              <View className="rounded-3xl bg-white px-6 py-12">
                <View className="mx-auto h-14 w-14 items-center justify-center rounded-full bg-slate-100">
                  <Feather
                    name="clock"
                    size={24}
                    color="#94A3B8"
                  />
                </View>

                <Text className="mt-5 text-center text-lg font-bold text-slate-900">
                  No history yet
                </Text>
              </View>
            )}
          </>
        )}

        {/* Bottom add action */}
        {activeView ===
          "transactions" && (
          <TouchableOpacity
            onPress={() =>
              setAddModalVisible(
                true,
              )
            }
            activeOpacity={0.8}
            className="mt-2 flex-row items-center justify-center py-4"
          >
            <View className="mr-2 h-8 w-8 items-center justify-center rounded-full bg-blue-50">
              <Feather
                name="plus"
                size={17}
                color="#2563EB"
              />
            </View>

            <Text className="font-bold text-blue-600">
              Add a transaction
            </Text>
          </TouchableOpacity>
        )}
      </ScrollView>

      {/* Transaction details */}
      <TransactionDetailsModal
        visible={
          detailsVisible
        }
        transaction={
          selectedTransaction
        }
        onClose={() => {
          setDetailsVisible(
            false,
          );

          setSelectedTransaction(
            null,
          );
        }}
      />
      
      {/* Add transaction */}
      <AddTransactionModal
        visible={
          addModalVisible
        }
        onClose={() =>
          setAddModalVisible(
            false,
          )
        }
        onAdd={
          handleAddTransaction
        }
      />
    </>
  );
}