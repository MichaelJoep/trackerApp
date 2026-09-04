import { Feather } from "@expo/vector-icons";
import {
  ActivityIndicator,
  Alert,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useEffect, useState } from "react";

import {
  AudioModule,
  RecordingPresets,
  setAudioModeAsync,
  useAudioRecorder,
  useAudioRecorderState,
} from "expo-audio";

import {
  transcribeVoice,
  AIVoiceTransactionResult,
} from "../../services/ai-voice.api";

interface VoiceTransactionInputProps {onTranscribed: (
    result: AIVoiceTransactionResult,) => void;
}

export default function VoiceTransactionInput({
  onTranscribed,
}: VoiceTransactionInputProps) {
  const recorder =
    useAudioRecorder(
      RecordingPresets.HIGH_QUALITY,
    );

  const recorderState =
    useAudioRecorderState(
      recorder,
    );

  const [processing, setProcessing] =
    useState(false);

  const [permissionGranted, setPermissionGranted] =
    useState(false);

  /*
   * ------------------------------------------------
   * MICROPHONE SETUP
   * ------------------------------------------------
   */

  useEffect(() => {
    let mounted = true;

    const setup = async () => {
      try {
        const status =
          await AudioModule.requestRecordingPermissionsAsync();

        if (!mounted) {
          return;
        }

        if (!status.granted) {
          setPermissionGranted(false);

          return;
        }

        setPermissionGranted(true);

        await setAudioModeAsync({
          allowsRecording: true,
          playsInSilentMode: true,
        });
      } catch (error) {
        console.error(
          "Microphone setup error:",
          error,
        );

        if (mounted) {
          setPermissionGranted(false);
        }
      }
    };

    setup();

    return () => {
      mounted = false;
    };
  }, []);

  /*
   * ------------------------------------------------
   * START RECORDING
   * ------------------------------------------------
   */

  const startRecording = async () => {
    if (!permissionGranted) {
      Alert.alert(
        "Microphone permission required",
        "Please allow microphone access to use voice transactions.",
      );

      return;
    }

    try {
      await recorder.prepareToRecordAsync();

      recorder.record();
    } catch (error) {
      console.error(
        "Recording start error:",
        error,
      );

      Alert.alert(
        "Recording error",
        "Unable to start recording.",
      );
    }
  };

  /*
   * ------------------------------------------------
   * STOP + TRANSCRIBE
   * ------------------------------------------------
   */

  const stopRecording = async () => {
    try {
      await recorder.stop();

      const uri =
        recorder.uri;

      if (!uri) {
        Alert.alert(
          "Recording unavailable",
          "No recording was created.",
        );

        return;
      }

      setProcessing(true);

      const result =
        await transcribeVoice(uri);

      onTranscribed(result);
    } catch (error) {
      console.error(
        "Voice processing error:",
        error,
      );

      Alert.alert(
        "Voice processing failed",
        "We could not understand your transaction. Please try again.",
      );
    } finally {
      setProcessing(false);
    }
  };

  const recording =
    recorderState.isRecording;

  return (
    <View>
      <View className="items-center rounded-3xl bg-slate-50 px-6 py-10">
        <View
          className={`h-24 w-24 items-center justify-center rounded-full ${
            recording
              ? "bg-red-100"
              : "bg-blue-100"
          }`}
        >
          <Feather
            name={
              recording
                ? "square"
                : "mic"
            }
            size={34}
            color={
              recording
                ? "#DC2626"
                : "#2563EB"
            }
          />
        </View>

        <Text className="mt-5 text-lg font-bold text-slate-900">
          {processing
            ? "Processing your voice..."
            : recording
              ? "Listening..."
              : "Describe your transaction"}
        </Text>

        <Text className="mt-2 text-center text-sm leading-5 text-slate-500">
          {recording
            ? "Speak naturally. Tap the button when you are finished."
            : 'For example: "I spent ₦8,500 on transport today."'}
        </Text>

        {processing && (
          <View className="mt-5 flex-row items-center">
            <ActivityIndicator
              size="small"
              color="#2563EB"
            />

            <Text className="ml-2 text-xs font-medium text-slate-500">
              AI is extracting the transaction...
            </Text>
          </View>
        )}
      </View>

      {!processing && (
        <TouchableOpacity
          onPress={
            recording
              ? stopRecording
              : startRecording
          }
          activeOpacity={0.85}
          className={`mt-5 h-14 items-center justify-center rounded-2xl ${
            recording
              ? "bg-red-600"
              : "bg-blue-600"
          }`}
        >
          <View className="flex-row items-center">
            <Feather
              name={
                recording
                  ? "square"
                  : "mic"
              }
              size={19}
              color="#FFFFFF"
            />

            <Text className="ml-2 font-bold text-white">
              {recording
                ? "Stop Recording"
                : "Start Recording"}
            </Text>
          </View>
        </TouchableOpacity>
      )}
    </View>
  );
}