import { apiRequest } from "../lib/api";

/**
 * Supported monthly budget returned by the backend.
 */
export interface Budget {
  id: string;
  user_id: string;
  amount: number;
  last_alert_send: string | null;
  last_alert_threshold: number | null;
  created_at: string;
  updated_at: string;
}

/**
 * Data required to create a budget.
 */
export interface CreateBudgetInput {
  amount: number;
}

/**
 * Data allowed when updating a budget.
 */
export interface UpdateBudgetInput {
  amount: number;
}

/**
 * GET /budgets
 */
export async function getBudgets() {
  return apiRequest<{
    success: boolean;
    data: Budget[];
  }>("/budgets");
}

/**
 * POST /budgets
 */
export async function createBudget(amount: number) {
  return apiRequest<{
    success: boolean;
    data: Budget;
  }>("/budgets", {
    method: "POST",
    body: JSON.stringify({
      amount,
    }),
  });
}

/**
 * PATCH /budgets/:id
 *
 * Add this endpoint to the backend when backend
 * budget editing is implemented.
 */
export async function updateBudget(
  id: string,
  input: UpdateBudgetInput,
) {
  return apiRequest<{
    success: boolean;
    data: Budget;
  }>(`/budgets/${id}`, {
    method: "PATCH",
    body: JSON.stringify(input),
  });
}

/**
 * DELETE /budgets/:id
 *
 * Add this endpoint to the backend when backend
 * budget deletion is implemented.
 */
export async function deleteBudget(id: string) {
  return apiRequest<{
    success: boolean;
    message: string;
  }>(`/budgets/${id}`, {
    method: "DELETE",
  });
}