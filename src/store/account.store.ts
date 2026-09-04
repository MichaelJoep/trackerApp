import { create } from "zustand";

import {
  Account,
  CreateAccountInput,
  UpdateAccountInput,
  createAccount,
  deleteAccount,
  getAccounts,
  updateAccount,
} from "../services/account.api";

import { MOCK_ACCOUNTS } from "../data/mock-accounts";
import { APP_CONFIG } from "../config/app.config";

interface AccountState {
  accounts: Account[];

  loading: boolean;
  saving: boolean;
  deleting: boolean;

  error: string | null;

  fetchAccounts: () => Promise<void>;

  addAccount: (
    input: CreateAccountInput,
  ) => Promise<Account>;

  editAccount: (
    id: string,
    input: UpdateAccountInput,
  ) => Promise<Account>;

  removeAccount: (
    id: string,
  ) => Promise<void>;

  setDefaultAccount: (
    id: string,
  ) => Promise<void>;

  clearError: () => void;
}

function normalizeAccounts(
  accounts: Account[],
): Account[] {
  const defaultAccount = accounts.find(
    (account) => account.is_default,
  );

  if (!defaultAccount) {
    return accounts;
  }

  return accounts.map((account) => ({
    ...account,
    is_default:
      account.id === defaultAccount.id,
  }));
}

function createMockAccount(
  input: CreateAccountInput,
): Account {
  return {
    id: `mock-account-${Date.now()}`,
    name: input.name,
    type: input.type,
    balance: input.balance ?? 0,
    is_default: input.isDefault ?? false,
    user_id: "mock-user",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };
}

export const useAccountStore =
  create<AccountState>((set) => ({
    accounts: [],

    loading: false,
    saving: false,
    deleting: false,

    error: null,

    // ==========================================
    // FETCH ACCOUNTS
    // ==========================================

    fetchAccounts: async () => {
      set({
        loading: true,
        error: null,
      });

      try {
        // --------------------------------------
        // MOCK MODE
        // --------------------------------------

        if (!APP_CONFIG.USE_BACKEND) {
          await new Promise((resolve) =>
            setTimeout(resolve, 400),
          );

          set({
            accounts: normalizeAccounts([
              ...MOCK_ACCOUNTS,
            ]),
          });

          return;
        }

        // --------------------------------------
        // BACKEND MODE
        // --------------------------------------

        const result =
          await getAccounts();

        set({
          accounts: normalizeAccounts(
            result.data ?? [],
          ),
        });
      } catch (error) {
        set({
          error:
            error instanceof Error
              ? error.message
              : "Unable to load accounts.",
        });
      } finally {
        set({
          loading: false,
        });
      }
    },

    // ==========================================
    // ADD ACCOUNT
    // ==========================================

    addAccount: async (input) => {
      set({
        saving: true,
        error: null,
      });

      try {
        // --------------------------------------
        // MOCK MODE
        // --------------------------------------

        if (!APP_CONFIG.USE_BACKEND) {
          await new Promise((resolve) =>
            setTimeout(resolve, 300),
          );

          const newAccount =
            createMockAccount(input);

          set((state) => {
            let accounts = [
              newAccount,
              ...state.accounts,
            ];

            if (newAccount.is_default) {
              accounts = accounts.map(
                (account) => ({
                  ...account,
                  is_default:
                    account.id ===
                    newAccount.id,
                }),
              );
            }

            return {
              accounts,
            };
          });

          return newAccount;
        }

        // --------------------------------------
        // BACKEND MODE
        // --------------------------------------

        const result =
          await createAccount(input);

        set((state) => {
          let accounts = [
            result.data,
            ...state.accounts,
          ];

          if (result.data.is_default) {
            accounts = accounts.map(
              (account) => ({
                ...account,
                is_default:
                  account.id ===
                  result.data.id,
              }),
            );
          }

          return {
            accounts,
          };
        });

        return result.data;
      } catch (error) {
        const message =
          error instanceof Error
            ? error.message
            : "Unable to create account.";

        set({
          error: message,
        });

        throw error;
      } finally {
        set({
          saving: false,
        });
      }
    },

    // ==========================================
    // EDIT ACCOUNT
    // ==========================================

    editAccount: async (id, input) => {
      set({
        saving: true,
        error: null,
      });

      try {
        // --------------------------------------
        // MOCK MODE
        // --------------------------------------

        if (!APP_CONFIG.USE_BACKEND) {
          await new Promise((resolve) =>
            setTimeout(resolve, 300),
          );

          let updatedAccount: Account | null =
            null;

          set((state) => {
            let accounts =
              state.accounts.map(
                (account) => {
                  if (account.id !== id) {
                    return account;
                  }

                  updatedAccount = {
                    ...account,
                    name:
                      input.name ??
                      account.name,
                    type:
                      input.type ??
                      account.type,
                    balance:
                      input.balance ??
                      account.balance,
                    is_default:
                      input.isDefault ??
                      account.is_default,
                    updated_at:
                      new Date().toISOString(),
                  };

                  return updatedAccount;
                },
              );

            if (
              updatedAccount?.is_default
            ) {
              accounts = accounts.map(
                (account) => ({
                  ...account,
                  is_default:
                    account.id === id,
                }),
              );
            }

            return {
              accounts,
            };
          });

          if (!updatedAccount) {
            throw new Error(
              "Account not found.",
            );
          }

          return updatedAccount;
        }

        // --------------------------------------
        // BACKEND MODE
        // --------------------------------------

        const result =
          await updateAccount(
            id,
            input,
          );

        set((state) => {
          let accounts =
            state.accounts.map(
              (account) =>
                account.id === id
                  ? result.data
                  : account,
            );

          if (result.data.is_default) {
            accounts = accounts.map(
              (account) => ({
                ...account,
                is_default:
                  account.id ===
                  result.data.id,
              }),
            );
          }

          return {
            accounts,
          };
        });

        return result.data;
      } catch (error) {
        const message =
          error instanceof Error
            ? error.message
            : "Unable to update account.";

        set({
          error: message,
        });

        throw error;
      } finally {
        set({
          saving: false,
        });
      }
    },

    // ==========================================
    // DELETE ACCOUNT
    // ==========================================

    removeAccount: async (id) => {
      set({
        deleting: true,
        error: null,
      });

      try {
        // --------------------------------------
        // MOCK MODE
        // --------------------------------------

        if (!APP_CONFIG.USE_BACKEND) {
          await new Promise((resolve) =>
            setTimeout(resolve, 300),
          );

          set((state) => {
            const deletedAccount =
              state.accounts.find(
                (account) =>
                  account.id === id,
              );

            let remaining =
              state.accounts.filter(
                (account) =>
                  account.id !== id,
              );

            if (
              deletedAccount?.is_default &&
              remaining.length > 0
            ) {
              remaining =
                remaining.map(
                  (account, index) => ({
                    ...account,
                    is_default:
                      index === 0,
                  }),
                );
            }

            return {
              accounts: remaining,
            };
          });

          return;
        }

        // --------------------------------------
        // BACKEND MODE
        // --------------------------------------

        await deleteAccount(id);

        set((state) => {
          const deletedAccount =
            state.accounts.find(
              (account) =>
                account.id === id,
            );

          let remaining =
            state.accounts.filter(
              (account) =>
                account.id !== id,
            );

          if (
            deletedAccount?.is_default &&
            remaining.length > 0
          ) {
            remaining =
              remaining.map(
                (account, index) => ({
                  ...account,
                  is_default:
                    index === 0,
                }),
              );
          }

          return {
            accounts: remaining,
          };
        });
      } catch (error) {
        const message =
          error instanceof Error
            ? error.message
            : "Unable to delete account.";

        set({
          error: message,
        });

        throw error;
      } finally {
        set({
          deleting: false,
        });
      }
    },

    // ==========================================
    // SET DEFAULT ACCOUNT
    // ==========================================

    setDefaultAccount: async (id) => {
      set({
        saving: true,
        error: null,
      });

      try {
        // --------------------------------------
        // MOCK MODE
        // --------------------------------------

        if (!APP_CONFIG.USE_BACKEND) {
          await new Promise((resolve) =>
            setTimeout(resolve, 250),
          );

          set((state) => ({
            accounts:
              state.accounts.map(
                (account) => ({
                  ...account,
                  is_default:
                    account.id === id,
                }),
              ),
          }));

          return;
        }

        // --------------------------------------
        // BACKEND MODE
        // --------------------------------------

        const result =
          await updateAccount(id, {
            isDefault: true,
          });

        set((state) => ({
          accounts:
            state.accounts.map(
              (account) => ({
                ...account,
                is_default:
                  account.id ===
                  result.data.id,
              }),
            ),
        }));
      } catch (error) {
        const message =
          error instanceof Error
            ? error.message
            : "Unable to set default account.";

        set({
          error: message,
        });

        throw error;
      } finally {
        set({
          saving: false,
        });
      }
    },

    // ==========================================
    // CLEAR ERROR
    // ==========================================

    clearError: () => {
      set({
        error: null,
      });
    },
  }));