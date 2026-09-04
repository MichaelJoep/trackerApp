import { APP_CONFIG } from "../config/app.config";

/*
 * ----------------------------------------------------
 * AI SCANNER TYPES
 * ----------------------------------------------------
 */

export interface AIReceiptScanResult {
  title: string;
  amount: number;
  category: string;
  type: "income" | "expense";
  date?: string;
  note?: string;

  /*
   * Original receipt image.
   */
  receiptUri: string;

  /*
   * Optional confidence score returned by AI.
   *
   * Example:
   * 0.94 = 94%
   */
  confidence?: number;

  /*
   * Indicates how the transaction was created.
   */
  inputMethod: "scan";
}

/*
 * ----------------------------------------------------
 * MOCK RECEIPT SCANNER
 * ----------------------------------------------------
 *
 * This allows the complete frontend to work before
 * the AI backend exists.
 * ----------------------------------------------------
 */

async function mockScanReceipt(
  imageUri: string,
): Promise<AIReceiptScanResult> {
  await new Promise((resolve) =>
    setTimeout(resolve, 1600),
  );

  return {
    title: "Grocery Shopping",

    amount: 18500,

    category: "Food",

    type: "expense",

    date: "Today",

    note: "Receipt scanned using AI",

    receiptUri: imageUri,

    confidence: 0.94,

    inputMethod: "scan",
  };
}

/*
 * ----------------------------------------------------
 * SCAN RECEIPT
 * ----------------------------------------------------
 *
 * Frontend calls this function.
 *
 * When backend is ready, only this function needs to
 * be changed.
 * ----------------------------------------------------
 */

export async function scanReceipt(
  imageUri: string,
): Promise<AIReceiptScanResult> {
  if (!imageUri) {
    throw new Error(
      "Receipt image is required.",
    );
  }

  /*
   * ------------------------------------------------
   * TEMPORARY FRONTEND MODE
   * ------------------------------------------------
   */

  if (!APP_CONFIG.USE_BACKEND) {
    return mockScanReceipt(imageUri);
  }

  /*
   * ------------------------------------------------
   * BACKEND MODE
   * ------------------------------------------------
   *
   * Expected future endpoint:
   *
   * POST /ai/transactions/scan
   *
   * The actual upload implementation should be
   * connected here when your Express backend is ready.
   * ------------------------------------------------
   */

  throw new Error(
    "AI receipt scanner backend is not connected yet.",
  );
}