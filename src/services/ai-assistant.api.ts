import { APP_CONFIG } from "../config/app.config";

/*
 * ----------------------------------------------------
 * TYPES
 * ----------------------------------------------------
 */

export interface AIAssistantMessage {
  role: "user" | "assistant";

  content: string;
}

export interface AIAssistantRequest {
  message: string;

  conversation?: AIAssistantMessage[];
}

export interface AIAssistantResponse {
  message: string;
}

/*
 * ----------------------------------------------------
 * MOCK AI ASSISTANT
 * ----------------------------------------------------
 *
 * This provides useful frontend behaviour while the
 * backend is still being developed.
 * ----------------------------------------------------
 */

async function mockAskAssistant(
  request: AIAssistantRequest,
): Promise<AIAssistantResponse> {
  await new Promise((resolve) =>
    setTimeout(resolve, 1100),
  );

  const message =
    request.message.toLowerCase();

  if (
    message.includes("spent") ||
    message.includes("spending")
  ) {
    return {
      message:
        "Based on the transactions currently available, I can help you calculate your total spending, identify your biggest spending categories, and compare your expenses against your budget.",
    };
  }

  if (
    message.includes("save") ||
    message.includes("saving")
  ) {
    return {
      message:
        "A good starting point is to review your recurring expenses first. I can help you identify areas where you may be spending more than necessary and create a realistic savings target.",
    };
  }

  if (
    message.includes("budget")
  ) {
    return {
      message:
        "Your budget should be based on your actual income and spending patterns. Once your budget data is connected, I can compare your current spending against each budget and alert you when you're approaching a limit.",
    };
  }

  if (
    message.includes("food")
  ) {
    return {
      message:
        "Food is one of the categories I can analyse for you. Once the AI backend is connected, I will be able to calculate exactly how much you spend on food and identify spending trends.",
    };
  }

  return {
    message:
      "I understand your question. Once the finance AI backend is connected, I will be able to analyse your transactions, accounts and budgets and give you a personalized answer.",
  };
}

/*
 * ----------------------------------------------------
 * ASK AI ASSISTANT
 * ----------------------------------------------------
 */

export async function askAIAssistant(
  request: AIAssistantRequest,
): Promise<AIAssistantResponse> {
  const message =
    request.message.trim();

  if (!message) {
    throw new Error(
      "Message cannot be empty.",
    );
  }

  /*
   * MOCK MODE
   */

  if (!APP_CONFIG.USE_BACKEND) {
    return mockAskAssistant({
      ...request,
      message,
    });
  }

  /*
   * ------------------------------------------------
   * FUTURE BACKEND
   * ------------------------------------------------
   *
   * POST /ai/assistant/chat
   *
   * The backend should receive:
   *
   * {
   *   message,
   *   conversation
   * }
   *
   * It can then load the authenticated user's:
   *
   * - transactions
   * - accounts
   * - budgets
   *
   * before asking the AI model.
   * ------------------------------------------------
   */

  throw new Error(
    "AI assistant backend is not connected yet.",
  );
}