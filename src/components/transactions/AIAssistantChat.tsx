import { Feather } from "@expo/vector-icons";
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useRef, useState } from "react";

import {
  askAIAssistant,
} from "../../services/ai-assistant.api";

interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
}

const suggestions = [
  "How much did I spend this month?",
  "Where am I spending the most?",
  "Can I reduce my expenses?",
  "How much should I save?",
];

export default function AIAssistantChat() {
  const scrollViewRef =
    useRef<ScrollView>(null);

  const [messages, setMessages] =
    useState<ChatMessage[]>([
      {
        id: "welcome",
        role: "assistant",
        content:
          "Hello! I'm your finance assistant. I can help you understand your spending, budgets, savings, income and transactions.",
      },
    ]);

  const [input, setInput] =
    useState("");

  const [sending, setSending] =
    useState(false);

  /*
   * ------------------------------------------------
   * SCROLL TO BOTTOM
   * ------------------------------------------------
   */

  const scrollToBottom = () => {
    setTimeout(() => {
      scrollViewRef.current?.scrollToEnd({
        animated: true,
      });
    }, 100);
  };

  /*
   * ------------------------------------------------
   * SEND MESSAGE
   * ------------------------------------------------
   */

  const sendMessage = async (
    suggestedMessage?: string,
  ) => {
    const text =
      (
        suggestedMessage ??
        input
      ).trim();

    if (!text || sending) {
      return;
    }

    const userMessage: ChatMessage = {
      id:
        `user-${Date.now()}`,
      role: "user",
      content: text,
    };

    const previousMessages =
      messages;

    setMessages((current) => [
      ...current,
      userMessage,
    ]);

    setInput("");

    setSending(true);

    scrollToBottom();

    try {
      const result =
        await askAIAssistant({
          message: text,

          conversation:
            previousMessages.map(
              (message) => ({
                role:
                  message.role,
                content:
                  message.content,
              }),
            ),
        });

      const assistantMessage:
        ChatMessage = {
          id:
            `assistant-${Date.now()}`,
          role: "assistant",
          content:
            result.message,
        };

      setMessages((current) => [
        ...current,
        assistantMessage,
      ]);

      scrollToBottom();
    } catch (error) {
      console.error(
        "AI assistant error:",
        error,
      );

      setMessages((current) => [
        ...current,
        {
          id:
            `assistant-error-${Date.now()}`,
          role: "assistant",
          content:
            "Sorry, I couldn't process that request right now. Please try again.",
        },
      ]);

      scrollToBottom();
    } finally {
      setSending(false);
    }
  };

  return (
    <KeyboardAvoidingView
      className="flex-1"
      behavior={
        Platform.OS === "ios"
          ? "padding"
          : "height"
      }
      keyboardVerticalOffset={90}
    >
      {/* Messages */}
      <ScrollView
        ref={scrollViewRef}
        className="flex-1"
        contentContainerClassName="px-5 pt-5 pb-4"
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        onContentSizeChange={
          scrollToBottom
        }
      >
        {messages.map(
          (message) => (
            <View
              key={message.id}
              className={`mb-4 max-w-[88%] rounded-2xl px-4 py-3 ${
                message.role ===
                "user"
                  ? "self-end rounded-br-md bg-blue-600"
                  : "self-start rounded-bl-md bg-slate-100"
              }`}
            >
              <Text
                className={`text-sm leading-6 ${
                  message.role ===
                  "user"
                    ? "text-white"
                    : "text-slate-800"
                }`}
              >
                {message.content}
              </Text>
            </View>
          ),
        )}

        {sending && (
          <View className="self-start rounded-2xl rounded-bl-md bg-slate-100 px-4 py-3">
            <View className="flex-row items-center">
              <ActivityIndicator
                size="small"
                color="#64748B"
              />

              <Text className="ml-2 text-xs text-slate-500">
                Analysing your finances...
              </Text>
            </View>
          </View>
        )}
      </ScrollView>

      {/* Suggestions */}
      {messages.length === 1 &&
        !sending && (
          <View className="px-5 pb-3">
            <Text className="mb-3 text-xs font-semibold text-slate-400">
              Try asking
            </Text>

            <View className="flex-row flex-wrap">
              {suggestions.map(
                (suggestion) => (
                  <TouchableOpacity
                    key={
                      suggestion
                    }
                    onPress={() =>
                      sendMessage(
                        suggestion,
                      )
                    }
                    className="mb-2 mr-2 rounded-full border border-slate-200 bg-white px-4 py-2.5"
                  >
                    <Text className="text-xs font-medium text-slate-600">
                      {suggestion}
                    </Text>
                  </TouchableOpacity>
                ),
              )}
            </View>
          </View>
        )}

      {/* Composer */}
      <View className="border-t border-slate-100 bg-white px-5 py-3">
        <View className="flex-row items-end">
          {/* AI indicator */}
          <View className="mr-2 h-11 w-11 items-center justify-center rounded-full bg-blue-50">
            <Feather
              name="cpu"
              size={18}
              color="#2563EB"
            />
          </View>

          {/* Input */}
          <View className="min-h-11 flex-1 flex-row items-center rounded-2xl bg-slate-100 px-4">
            <TextInput
              value={input}
              onChangeText={setInput}
              placeholder="Ask about your finances..."
              placeholderTextColor="#94A3B8"
              multiline
              maxLength={1000}
              className="max-h-28 flex-1 py-2.5 text-sm text-slate-900"
              editable={!sending}
              onFocus={
                scrollToBottom
              }
            />
          </View>

          {/* Send */}
          <TouchableOpacity
            onPress={() =>
              sendMessage()
            }
            disabled={
              !input.trim() ||
              sending
            }
            activeOpacity={0.85}
            className={`ml-2 h-11 w-11 items-center justify-center rounded-full ${
              input.trim() &&
              !sending
                ? "bg-blue-600"
                : "bg-slate-200"
            }`}
          >
            <Feather
              name="arrow-up"
              size={19}
              color={
                input.trim() &&
                !sending
                  ? "#FFFFFF"
                  : "#94A3B8"
              }
            />
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}