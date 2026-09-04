import { Budget } from "../services/budget.api";

/**
 * Temporary budget data used while the backend is disabled.
 */
export const MOCK_BUDGETS: Budget[] = [
  {
    id: "mock-budget-1",
    user_id: "mock-user",
    amount: 500000,
    last_alert_send: null,
    last_alert_threshold: null,
    created_at: "2026-09-01T08:00:00.000Z",
    updated_at: "2026-09-01T08:00:00.000Z",
  },
];