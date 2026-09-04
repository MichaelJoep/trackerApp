import { Account } from "../services/account.api";

export const MOCK_ACCOUNTS: Account[] = [
  {
    id: "mock-account-1",
    name: "Main Account",
    type: "bank",
    balance: 350000,
    is_default: true,
    user_id: "mock-user",
    created_at: "2026-09-01T08:00:00.000Z",
    updated_at: "2026-09-01T08:00:00.000Z",
  },

  {
    id: "mock-account-2",
    name: "Cash Wallet",
    type: "cash",
    balance: 42500,
    is_default: false,
    user_id: "mock-user",
    created_at: "2026-09-01T08:05:00.000Z",
    updated_at: "2026-09-01T08:05:00.000Z",
  },

  {
    id: "mock-account-3",
    name: "Savings",
    type: "savings",
    balance: 120000,
    is_default: false,
    user_id: "mock-user",
    created_at: "2026-09-01T08:10:00.000Z",
    updated_at: "2026-09-01T08:10:00.000Z",
  },

  {
    id: "mock-account-4",
    name: "Investment",
    type: "investment",
    balance: 85000,
    is_default: false,
    user_id: "mock-user",
    created_at: "2026-09-01T08:15:00.000Z",
    updated_at: "2026-09-01T08:15:00.000Z",
  },
];