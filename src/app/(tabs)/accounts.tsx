import { Feather } from "@expo/vector-icons";
import { useCallback, useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  RefreshControl,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import AccountCard from "../../components/accounts/AccountCard";
import AccountFormModal from "../../components/accounts/AccountFormModal";
import AccountSummary from "../../components/accounts/AccountSummary";
import {Account, AccountType} from "../../services/account.api";
import { useAccountStore } from "../../store/account.store";


export default function AccountsScreen() {
  const accounts = useAccountStore(
    (state) => state.accounts,
  );

  const loading = useAccountStore(
    (state) => state.loading,
  );

  const saving = useAccountStore(
    (state) => state.saving,
  );

  const deleting = useAccountStore(
    (state) => state.deleting,
  );

  const error = useAccountStore(
    (state) => state.error,
  );

  const fetchAccounts = useAccountStore(
    (state) => state.fetchAccounts,
  );

  const addAccount = useAccountStore(
    (state) => state.addAccount,
  );

  const editAccount = useAccountStore(
    (state) => state.editAccount,
  );

  const removeAccount = useAccountStore(
    (state) => state.removeAccount,
  );

  const setDefaultAccount =
    useAccountStore(
      (state) =>
        state.setDefaultAccount,
    );

  const clearError = useAccountStore(
    (state) => state.clearError,
  );

  const [modalVisible, setModalVisible] =
    useState(false);

  const [selectedAccount, setSelectedAccount] =
    useState<Account | null>(null);

  const [refreshing, setRefreshing] =
    useState(false);

  useEffect(() => {
    fetchAccounts();
  }, [fetchAccounts]);

  const totalBalance = useMemo(() => {
    return accounts.reduce(
      (total, account) =>
        total + Number(account.balance || 0),
      0,
    );
  }, [accounts]);

  const openAddModal = useCallback(() => {
    clearError();
    setSelectedAccount(null);
    setModalVisible(true);
  }, [clearError]);

  const openEditModal = useCallback(
    (account: Account) => {
      clearError();
      setSelectedAccount(account);
      setModalVisible(true);
    },
    [clearError],
  );

  const closeModal = useCallback(() => {
    setModalVisible(false);
    setSelectedAccount(null);
  }, []);

  const handleSubmit = async (input: {
    name: string;
    type: AccountType;
    balance: number;
    isDefault: boolean;
  }) => {
    if (selectedAccount) {
      await editAccount(
        selectedAccount.id,
        input,
      );
    } else {
      await addAccount(input);
    }
  };

  const handleDelete = async (
    account: Account,
  ) => {
    await removeAccount(account.id);
  };

  const handleSetDefault = async (
    account: Account,
  ) => {
    if (account.is_default) {
      return;
    }

    await setDefaultAccount(
      account.id,
    );
  };

  const handleRefresh = async () => {
    setRefreshing(true);

    try {
      await fetchAccounts();
    } finally {
      setRefreshing(false);
    }
  };

  return (
    <>
      <ScrollView
        className="flex-1 bg-slate-50"
        contentContainerClassName="px-6 pb-10 pt-14"
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
          />
        }
      >
        {/* Header */}
        <View className="mb-7 flex-row items-center justify-between">
          <View className="flex-1">
            <Text className="text-2xl font-bold text-slate-900">
              My Accounts
            </Text>

            <Text className="mt-1 text-sm text-slate-500">
              Manage your money in one place
            </Text>
          </View>

          <TouchableOpacity
            onPress={openAddModal}
            activeOpacity={0.85}
            className="ml-4 h-11 flex-row items-center rounded-full bg-blue-600 px-5"
          >
            <Feather
              name="plus"
              size={18}
              color="#FFFFFF"
            />

            <Text className="ml-1.5 font-bold text-white">
              Add
            </Text>
          </TouchableOpacity>
        </View>

        {/* Summary */}
        <AccountSummary
          totalBalance={totalBalance}
          accountCount={accounts.length}
        />

        {/* Error */}
        {error && (
          <View className="mb-5 rounded-2xl border border-red-100 bg-red-50 p-4">
            <View className="flex-row items-start">
              <Feather
                name="alert-circle"
                size={18}
                color="#DC2626"
              />

              <View className="ml-3 flex-1">
                <Text className="text-sm font-semibold text-red-700">
                  Something went wrong
                </Text>

                <Text className="mt-1 text-xs leading-5 text-red-600">
                  {error}
                </Text>

                <TouchableOpacity
                  onPress={() => {
                    clearError();
                    fetchAccounts();
                  }}
                  className="mt-3 self-start"
                >
                  <Text className="text-xs font-bold text-red-700">
                    Try Again
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        )}

        {/* Loading */}
        {loading &&
        accounts.length === 0 ? (
          <View className="items-center rounded-3xl bg-white py-12">
            <ActivityIndicator
              size="large"
              color="#2563EB"
            />

            <Text className="mt-4 text-sm text-slate-500">
              Loading your accounts...
            </Text>
          </View>
        ) : accounts.length === 0 ? (
          /* Empty state */
          <View className="items-center rounded-3xl bg-white px-7 py-12">
            <View className="h-16 w-16 items-center justify-center rounded-2xl bg-blue-50">
              <Feather
                name="credit-card"
                size={28}
                color="#2563EB"
              />
            </View>

            <Text className="mt-5 text-center text-lg font-bold text-slate-900">
              No accounts yet
            </Text>

            <Text className="mt-2 max-w-xs text-center text-sm leading-5 text-slate-500">
              Add your bank account, cash wallet,
              savings, or other account to start
              tracking your money.
            </Text>

            <TouchableOpacity
              onPress={openAddModal}
              activeOpacity={0.85}
              className="mt-6 flex-row items-center rounded-2xl bg-blue-600 px-6 py-4"
            >
              <Feather
                name="plus"
                size={17}
                color="#FFFFFF"
              />

              <Text className="ml-2 font-bold text-white">
                Add Your First Account
              </Text>
            </TouchableOpacity>
          </View>
        ) : (
          /* Accounts */
          <View>
            <View className="mb-4 flex-row items-center justify-between">
              <Text className="text-lg font-bold text-slate-900">
                Your Accounts
              </Text>

              <Text className="text-xs font-medium text-slate-400">
                {accounts.length}{" "}
                {accounts.length === 1
                  ? "account"
                  : "accounts"}
              </Text>
            </View>

            {accounts.map(
              (account) => (
                <AccountCard
                  key={account.id}
                  account={account}
                  deleting={deleting}
                  onEdit={() =>
                    openEditModal(
                      account,
                    )
                  }
                  onDelete={() =>
                    handleDelete(
                      account,
                    )
                  }
                  onSetDefault={() =>
                    handleSetDefault(
                      account,
                    )
                  }
                />
              ),
            )}
          </View>
        )}
      </ScrollView>

      <AccountFormModal
        visible={modalVisible}
        account={selectedAccount}
        saving={saving}
        onClose={closeModal}
        onSubmit={handleSubmit}
      />
    </>
  );
}