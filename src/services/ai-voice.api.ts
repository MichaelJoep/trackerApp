import { APP_CONFIG } from "../config/app.config";

/*
 * ----------------------------------------------------
 * AI VOICE TYPES
 * ----------------------------------------------------
 */

export interface AIVoiceTransactionResult {
  transcription: string;

  title: string;

  amount: number;

  category: string;

  type: "income" | "expense";

  date?: string;

  note?: string;

  inputMethod: "voice";
}

/*
 * ----------------------------------------------------
 * MOCK VOICE TRANSCRIPTION
 * ----------------------------------------------------
 */

async function mockTranscribeVoice(
  audioUri: string,
): Promise<AIVoiceTransactionResult> {
  if (!audioUri) {
    throw new Error(
      "Audio recording is required.",
    );
  }

  await new Promise((resolve) =>
    setTimeout(resolve, 1500),
  );

  return {
    transcription:
      "I spent 8500 naira on transportation today.",

    title: "Transportation",

    amount: 8500,

    category: "Transport",

    type: "expense",

    date: "Today",

    note: "Added using voice input",

    inputMethod: "voice",
  };
}

/*
 * ----------------------------------------------------
 * TRANSCRIBE VOICE
 * ----------------------------------------------------
 */

export async function transcribeVoice(
  audioUri: string,
): Promise<AIVoiceTransactionResult> {
  if (!audioUri) {
    throw new Error(
      "Audio recording is required.",
    );
  }

  /*
   * TEMPORARY MOCK MODE
   */

  if (!APP_CONFIG.USE_BACKEND) {
    return mockTranscribeVoice(audioUri);
  }

  /*
   * ------------------------------------------------
   * FUTURE BACKEND
   * ------------------------------------------------
   *
   * POST /ai/transactions/voice
   *
   * The audio file will be uploaded to Express,
   * which will handle speech-to-text/AI processing.
   * ------------------------------------------------
   */

  throw new Error(
    "AI voice backend is not connected yet.",
  );
}