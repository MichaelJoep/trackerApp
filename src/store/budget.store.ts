import { create } from "zustand";

import { APP_CONFIG } from "../config/app.config";
import { MOCK_BUDGETS } from "../data/mock-budgets";
import {
  Budget,
  createBudget,
  deleteBudget,
  getBudgets,
  updateBudget,
} from "../services/budget.api";

interface BudgetState {
  // Currently loaded monthly budget.
  budget: Budget | null;

  // Loading state for fetching budget.
  loading: boolean;

  // Saving state for create/update.
  saving: boolean;

  // Deleting state.
  deleting: boolean;

  // Store-level error.
  error: string | null;

  // Fetch the current user's budget.
  fetchBudget: () => Promise<void>;

  // Create a new budget.
  addBudget: (amount: number) => Promise<void>;

  // Update an existing budget.
  editBudget: (id: string, amount: number) => Promise<void>;

  // Delete the current budget.
  removeBudget: (id: string) => Promise<void>;

  // Clear current error.
  clearError: () => void;
}

/**
 * Creates a short delay so mock mode behaves
 * more like a real asynchronous data source.
 */
const mockDelay = (milliseconds = 350) =>
  new Promise((resolve) => {
    setTimeout(resolve, milliseconds);
  });

/**
 * Create a mock budget object.
 */
const createMockBudget = (amount: number): Budget => {
  const now = new Date().toISOString();

  return {
    id: `mock-budget-${Date.now()}`,
    user_id: "mock-user",
    amount,
    last_alert_send: null,
    last_alert_threshold: null,
    created_at: now,
    updated_at: now,
  };
};

export const useBudgetStore = create<BudgetState>((set, get) => ({
  budget: null,
  loading: false,
  saving: false,
  deleting: false,
  error: null,

  /**
   * Fetch budget from either mock data or backend.
   */
  fetchBudget: async () => {
    set({
      loading: true,
      error: null,
    });

    try {
      // Use local mock data while backend is disabled.
      if (!APP_CONFIG.USE_BACKEND) {
        await mockDelay();

        const firstBudget = MOCK_BUDGETS[0] ?? null;

        set({
          budget: firstBudget,
          loading: false,
        });

        return;
      }

      // Backend mode.
      const response = await getBudgets();
      const firstBudget = response.data?.[0] ?? null;
      set({
        budget: firstBudget,
        loading: false,
      });
    } catch (error) {
      set({
        loading: false,
        error:
          error instanceof Error
            ? error.message
            : "Unable to load your budget.",
      });
    }
  },

  /**
   * Create a new monthly budget.
   */
  addBudget: async (amount) => {
    set({
      saving: true,
      error: null,
    });

    try {
      // Mock mode.
      if (!APP_CONFIG.USE_BACKEND) {
        await mockDelay();

        const newBudget = createMockBudget(amount);

        set({
          budget: newBudget,
          saving: false,
        });

        return;
      }

      // Backend mode.
      const response = await createBudget(amount);

      set({
        budget: response.data,
        saving: false,
      });
    } catch (error) {
      set({
        saving: false,
        error:
          error instanceof Error
            ? error.message
            : "Unable to create your budget.",
      });

      throw error;
    }
  },

  /**
   * Update an existing monthly budget.
   */
  editBudget: async (id, amount) => {
    set({
      saving: true,
      error: null,
    });

    try {
      // Mock mode.
      if (!APP_CONFIG.USE_BACKEND) {
        await mockDelay();

        const currentBudget = get().budget;

        if (!currentBudget || currentBudget.id !== id) {
          throw new Error("Budget could not be found.");
        }

        const updatedBudget: Budget = {
          ...currentBudget,
          amount,
          updated_at: new Date().toISOString(),
        };

        set({
          budget: updatedBudget,
          saving: false,
        });

        return;
      }

      // Backend mode.
      const response = await updateBudget(id, {
        amount,
      });

      set({
        budget: response.data,
        saving: false,
      });
    } catch (error) {
      set({
        saving: false,
        error:
          error instanceof Error
            ? error.message
            : "Unable to update your budget.",
      });

      throw error;
    }
  },

  /**
   * Remove the current budget.
   */
  removeBudget: async (id) => {
    set({
      deleting: true,
      error: null,
    });

    try {
      // Mock mode.
      if (!APP_CONFIG.USE_BACKEND) {
        await mockDelay();

        const currentBudget = get().budget;

        if (!currentBudget || currentBudget.id !== id) {
          throw new Error("Budget could not be found.");
        }

        set({
          budget: null,
          deleting: false,
        });

        return;
      }

      // Backend mode.
      await deleteBudget(id);

      set({
        budget: null,
        deleting: false,
      });
    } catch (error) {
      set({
        deleting: false,
        error:
          error instanceof Error
            ? error.message
            : "Unable to delete your budget.",
      });

      throw error;
    }
  },

  /**
   * Clear store-level errors.
   */
  clearError: () => {
    set({
      error: null,
    });
  },
}));