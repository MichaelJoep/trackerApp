import { apiRequest } from "../lib/api";

export type AccountType =
  | "bank"
  | "cash"
  | "savings"
  | "credit"
  | "investment"
  | "wallet"
  | "other";

export interface Account {
  id: string;
  name: string;
  type: AccountType;
  balance: number;
  is_default: boolean;
  user_id: string;
  created_at: string;
  updated_at?: string;
}

export interface CreateAccountInput {
  name: string;
  type: AccountType;
  balance?: number;
  isDefault?: boolean;
}

export interface UpdateAccountInput {
  name?: string;
  type?: AccountType;
  balance?: number;
  isDefault?: boolean;
}

interface AccountsResponse {
  success: boolean;
  data: Account[];
}

interface AccountResponse {
  success: boolean;
  data: Account;
}

interface DeleteAccountResponse {
  success: boolean;
  message: string;
}

export function getAccounts() {
  return apiRequest<AccountsResponse>("/accounts");
}

export function getAccount(id: string) {
  return apiRequest<AccountResponse>(
    `/accounts/${id}`,
  );
}

export function createAccount(
  input: CreateAccountInput,
) {
  return apiRequest<AccountResponse>("/accounts", {
    method: "POST",
    body: JSON.stringify(input),
  });
}

export function updateAccount(
  id: string,
  input: UpdateAccountInput,
) {
  return apiRequest<AccountResponse>(
    `/accounts/${id}`,
    {
      method: "PATCH",
      body: JSON.stringify(input),
    },
  );
}

export function deleteAccount(id: string) {
  return apiRequest<DeleteAccountResponse>(
    `/accounts/${id}`,
    {
      method: "DELETE",
    },
  );
}