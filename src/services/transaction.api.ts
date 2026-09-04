import {apiRequest} from "../lib/api";
  
  export interface Transaction {
    id: string;
    account_id: string;
    type: string;
    amount: number;
    category: string | null;
    description: string | null;
    date: string;
    user_id: string;
    status: string;
    input_method: string;
    voice_transcription: string | null;
    is_flagged: boolean;
    flag_reason: string | null;
    created_at: string;
    updated_at: string;
  }
  
  export async function getTransactions() {
    return apiRequest<{
      success: boolean;
      data: Transaction[];
    }>("/transactions");
  }
  
  export async function createTransaction(
    input: {
      accountId: string;
      type: string;
      amount: number;
      category?: string;
      description?: string;
      date?: string;
      inputMethod?: string;
    },
  ) {
    return apiRequest<{
      success: boolean;
      data: Transaction;
    }>("/transactions", {
      method: "POST",
      body: JSON.stringify(input),
    });
  }