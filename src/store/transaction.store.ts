import { create } from "zustand";

/*
 * ----------------------------------------------------
 * TRANSACTION TYPES
 * ----------------------------------------------------
 */

export type TransactionType =
  | "income"
  | "expense"
  | "cash"
  | "earnings";

export type TransactionInputMethod =
  | "manual"
  | "scan"
  | "voice"
  | "assistant";

/*
 * ----------------------------------------------------
 * TRANSACTION
 * ----------------------------------------------------
 */

export interface Transaction {
  id: string;
  title: string;
  category: string;
  amount: number;
  type: TransactionType;
  account: string;
  date: string;
  time: string;
  note?: string;
  input_method?: TransactionInputMethod;
  voice_transcription?: string | null;
  receipt_uri?: string | null;
}

/*
 * ----------------------------------------------------
 * HISTORY
 * ----------------------------------------------------
 */

export interface HistoryRecord {
  id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  action:
    | "created"
    | "edited"
    | "deleted";
}

/*
 * ----------------------------------------------------
 * ADD INPUT
 * ----------------------------------------------------
 */

export interface AddTransactionInput {
  title: string;
  amount: number;
  type: TransactionType;
  category?: string;
  account?: string;
  date?: string;
  time?: string;
  note?: string;
  inputMethod?: TransactionInputMethod;
  voiceTranscription?: string | null;
  receiptUri?: string | null;
}

/*
 * ----------------------------------------------------
 * HELPER
 * ----------------------------------------------------
 */

const getCurrentTime = () =>
  new Date().toLocaleTimeString(
    [],
    {
      hour: "2-digit",
      minute: "2-digit",
    },
  );

/*
 * ----------------------------------------------------
 * INITIAL DATA
 * ----------------------------------------------------
 */

const initialTransactions: Transaction[] = [
  {
    id: "1",
    title: "Grocery Shopping",
    category: "Food",
    amount: 18500,
    type: "expense",
    account: "Main Account",
    date: "Today",
    time: "10:42 AM",
    note: "Weekly groceries",
    input_method: "manual",
  },
  {
    id: "2",
    title: "Salary",
    category: "Salary",
    amount: 350000,
    type: "income",
    account: "Main Account",
    date: "Today",
    time: "8:15 AM",
    note: "Monthly salary",
    input_method: "manual",
  },
  {
    id: "3",
    title: "Uber Ride",
    category: "Transport",
    amount: 4500,
    type: "cash",
    account: "Cash",
    date: "Yesterday",
    time: "6:20 SPM",
    note: "Trip to office",
    input_method: "manual",
  },
  {
    id: "4",
    title: "Freelance Project",
    category: "Earnings",
    amount: 85000,
    type: "earnings",
    account: "Main Account",
    date: "Yesterday",
    time: "2:10 PM",
    note: "Website project",
    input_method: "manual",
  },
  {
    id: "5",
    title: "Electricity Bill",
    category: "Bills",
    amount: 22000,
    type: "expense",
    account: "Main Account",
    date: "Aug 29",
    time: "11:30 AM",
    input_method: "manual",
  },
  {
    id: "6",
    title: "Restaurant",
    category: "Food",
    amount: 12500,
    type: "expense",
    account: "Main Account",
    date: "Aug 28",
    time: "7:45 PM",
    input_method: "manual",
  },
];

/*
 * ----------------------------------------------------
 * HISTORY
 * ----------------------------------------------------
 */

const initialHistory: HistoryRecord[] = [
  {
    id: "history-1",
    title: "Transaction edited",
    description:
      "Grocery Shopping was updated",
    date: "Today",
    time: "11:05 AM",
    action: "edited",
  },
  {
    id: "history-2",
    title: "Transaction created",
    description:
      "Freelance Project was added",
    date: "Yesterday",
    time: "2:10 PM",
    action: "created",
  },
];

/*
 * ----------------------------------------------------
 * STORE
 * ----------------------------------------------------
 */

interface TransactionStore {
  transactions: Transaction[];

  history: HistoryRecord[];

  addTransaction: (
    input: AddTransactionInput,
  ) => void;

  deleteTransaction: (
    transactionId: string,
  ) => void;

  deleteHistory: (
    historyId: string,
  ) => void;

  clearHistory: () => void;
}

/*
 * ----------------------------------------------------
 * ZUSTAND
 * ----------------------------------------------------
 */

export const useTransactionStore =
  create<TransactionStore>((set) => ({
    transactions:
      initialTransactions,

    history:
      initialHistory,

    /*
     * ADD
     */

    addTransaction: (input) => {
      const now = new Date();

      const time =
        input.time ??
        getCurrentTime();

      const newTransaction: Transaction = {
        id:
          `${Date.now()}-${Math.random()
            .toString(36)
            .slice(2)}`,

        title:
          input.title.trim(),

        category:
          input.category?.trim() ||
          (input.type === "income"
            ? "Income"
            : "General"),

        amount:
          Number(input.amount),

        type:
          input.type,

        account:
          input.account?.trim() ||
          "Main Account",

        date:
          input.date ||
          "Today",

        time,

        note:
          input.note?.trim(),

        input_method:
          input.inputMethod ||
          "manual",

        voice_transcription:
          input.voiceTranscription ||
          null,

        receipt_uri:
          input.receiptUri ||
          null,
      };

      set((state) => ({
        transactions: [
          newTransaction,
          ...state.transactions,
        ],

        history: [
          {
            id:
              `history-${Date.now()}`,

            title:
              "Transaction created",

            description:
              `${newTransaction.title} was added`,

            date: "Today",

            time,

            action:
              "created",
          },

          ...state.history,
        ],
      }));
    },

    /*
     * DELETE TRANSACTION
     */

    deleteTransaction: (
      transactionId,
    ) => {
      set((state) => {
        const transaction =
          state.transactions.find(
            (item) =>
              item.id ===
              transactionId,
          );

        if (!transaction) {
          return state;
        }

        const time =
          getCurrentTime();

        return {
          transactions:
            state.transactions.filter(
              (item) =>
                item.id !==
                transactionId,
            ),

          history: [
            {
              id:
                `history-${Date.now()}`,

              title:
                "Transaction deleted",

              description:
                `${transaction.title} was removed`,

              date: "Today",

              time,

              action:
                "deleted",
            },

            ...state.history,
          ],
        };
      });
    },

    /*
     * DELETE HISTORY
     */

    deleteHistory: (
      historyId,
    ) => {
      set((state) => ({
        history:
          state.history.filter(
            (item) =>
              item.id !==
              historyId,
          ),
      }));
    },

    /*
     * CLEAR HISTORY
     */

    clearHistory: () => {
      set({
        history: [],
      });
    },
  }));