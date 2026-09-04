import { useState } from "react";
import {
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Feather } from "@expo/vector-icons";

export type TransactionFilter =
  | "All"
  | "Expense"
  | "Income"
  | "Cash"
  | "Earnings";

export type TransactionView =
  | "transactions"
  | "history";

interface TransactionFiltersProps {
  activeFilter: TransactionFilter;
  onFilterChange: (
    filter: TransactionFilter,
  ) => void;

  activeView: TransactionView;
  onViewChange: (
    view: TransactionView,
  ) => void;
}

const filters: TransactionFilter[] = [
  "All",
  "Expense",
  "Income",
  "Cash",
  "Earnings",
];

export default function TransactionFilters({
  activeFilter,
  onFilterChange,
  activeView,
  onViewChange,
}: TransactionFiltersProps) {
  const [
    dropdownVisible,
    setDropdownVisible,
  ] = useState(false);

  return (
    <View className="relative z-20 mb-6">
      {/* Top controls */}
      <View className="mb-4 flex-row items-center justify-between">
        {/* Transactions / History */}
        <View className="flex-row rounded-xl bg-slate-100 p-1">
          <TouchableOpacity
            onPress={() =>
              onViewChange("transactions")
            }
            activeOpacity={0.8}
            className={`rounded-lg px-4 py-2.5 ${
              activeView === "transactions"
                ? "bg-white"
                : ""
            }`}
          >
            <Text
              className={`text-sm font-bold ${
                activeView === "transactions"
                  ? "text-slate-900"
                  : "text-slate-500"
              }`}
            >
              Transactions
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() =>
              onViewChange("history")
            }
            activeOpacity={0.8}
            className={`rounded-lg px-4 py-2.5 ${
              activeView === "history"
                ? "bg-white"
                : ""
            }`}
          >
            <Text
              className={`text-sm font-semibold ${
                activeView === "history"
                  ? "text-slate-900"
                  : "text-slate-500"
              }`}
            >
              History
            </Text>
          </TouchableOpacity>
        </View>

        {/* Filter dropdown */}
        <TouchableOpacity
          onPress={() =>
            setDropdownVisible(
              (previous) => !previous,
            )
          }
          activeOpacity={0.8}
          className="ml-3 flex-row items-center rounded-xl border border-slate-200 bg-white px-3 py-2.5"
        >
          <Feather
            name="filter"
            size={16}
            color="#475569"
          />

          <Text className="ml-2 text-sm font-semibold text-slate-700">
            {activeFilter}
          </Text>

          <Feather
            name={
              dropdownVisible
                ? "chevron-up"
                : "chevron-down"
            }
            size={15}
            color="#64748B"
            style={{
              marginLeft: 6,
            }}
          />
        </TouchableOpacity>
      </View>

      {/* Filter dropdown */}
      {dropdownVisible && (
        <View
          className="absolute right-0 top-14 w-44 rounded-2xl border border-slate-100 bg-white p-2"
          style={{
            elevation: 8,
            shadowColor: "#000",
            shadowOffset: {
              width: 0,
              height: 4,
            },
            shadowOpacity: 0.1,
            shadowRadius: 10,
          }}
        >
          {filters.map((filter) => {
            const active =
              filter === activeFilter;

            return (
              <TouchableOpacity
                key={filter}
                onPress={() => {
                  onFilterChange(filter);
                  setDropdownVisible(false);
                }}
                activeOpacity={0.8}
                className={`flex-row items-center justify-between rounded-xl px-3 py-3 ${
                  active
                    ? "bg-blue-50"
                    : ""
                }`}
              >
                <Text
                  className={`text-sm font-semibold ${
                    active
                      ? "text-blue-600"
                      : "text-slate-700"
                  }`}
                >
                  {filter}
                </Text>

                {active && (
                  <Feather
                    name="check"
                    size={16}
                    color="#2563EB"
                  />
                )}
              </TouchableOpacity>
            );
          })}
        </View>
      )}
    </View>
  );
}