import { Feather } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import * as ImageManipulator from "expo-image-manipulator";
import * as FileSystem from "expo-file-system/legacy";

import {
  ActivityIndicator,
  Alert,
  Image,
  Platform,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";

import {
  scanReceipt,
  AIReceiptScanResult,
} from "../../services/ai-scanner.api";

interface AITransactionScannerProps {
  onScanned: (
    result: AIReceiptScanResult,
  ) => void;
}

export default function AITransactionScanner({
  onScanned,
}: AITransactionScannerProps) {
  const [imageUri, setImageUri] =
    useState<string | null>(null);

  const [processing, setProcessing] =
    useState(false);

  /*
   * ------------------------------------------------
   * LIFECYCLE
   * ------------------------------------------------
   */

  const mountedRef =
    useRef(true);

  /*
   * ------------------------------------------------
   * PROCESSING LOCK
   * ------------------------------------------------
   */

  const processingRef =
    useRef(false);

  /*
   * ------------------------------------------------
   * PENDING RESULT LOCK
   * ------------------------------------------------
   */

  const pendingCheckedRef =
    useRef(false);

  /*
   * ------------------------------------------------
   * COMPONENT LIFECYCLE
   * ------------------------------------------------
   */

  useEffect(() => {
    mountedRef.current = true;

    return () => {
      mountedRef.current = false;
    };
  }, []);

  /*
   * ------------------------------------------------
   * NORMALIZE IMAGE
   * ------------------------------------------------
   *
   * Uses the CURRENT SDK 57 ImageManipulator API.
   *
   * manipulate()
   *      ↓
   * renderAsync()
   *      ↓
   * saveAsync()
   *
   * We intentionally do NOT use the deprecated
   * manipulateAsync() method.
   * ------------------------------------------------
   */

  const normalizeImage = useCallback(
    async (
      uri: string,
    ): Promise<string> => {
      if (!uri) {
        throw new Error(
          "Image URI is missing.",
        );
      }

      let context:
        | ImageManipulator.ImageManipulatorContext
        | null = null;

      try {
        /*
         * Create the modern image manipulation
         * context.
         */
        context =
          ImageManipulator.manipulate(
            uri,
          );

        /*
         * Resize the image to a maximum width
         * of 1600px.
         *
         * Height remains automatic so the aspect
         * ratio is preserved.
         */
        context.resize({
          width: 1600,
          height: null,
        });

        /*
         * Render the transformation.
         */
        const rendered =
          await context.renderAsync();

        /*
         * Save a compressed JPEG to cache.
         */
        const saved =
          await rendered.saveAsync({
            compress: 0.7,
            format:
              ImageManipulator.SaveFormat.JPEG,
          });

        /*
         * We now have a normalized local image.
         */
        return saved.uri;
      } catch (error) {
        console.warn(
          "Image normalization failed:",
          error,
        );

        /*
         * Do NOT attempt another image manipulation
         * if the first one fails.
         *
         * Return the original URI so the transaction
         * flow can continue.
         */
        return uri;
      }
    },
    [],
  );

  /*
   * ------------------------------------------------
   * PROCESS IMAGE
   * ------------------------------------------------
   */

  const processImage = useCallback(
    async (
      uri: string,
    ) => {
      if (!uri) {
        return;
      }

      /*
       * Prevent duplicate processing.
       */
      if (processingRef.current) {
        return;
      }

      processingRef.current = true;

      if (mountedRef.current) {
        setProcessing(true);
      }

      let normalizedUri:
        | string
        | null = null;

      try {
        /*
         * ------------------------------------------
         * NORMALIZE IMAGE
         * ------------------------------------------
         */

        normalizedUri =
          await normalizeImage(uri);

        if (!mountedRef.current) {
          return;
        }

        /*
         * ------------------------------------------
         * SHOW IMAGE
         * ------------------------------------------
         */

        setImageUri(
          normalizedUri,
        );

        /*
         * ------------------------------------------
         * AI PROCESSING
         * ------------------------------------------
         *
         * USE_BACKEND=false currently means this
         * remains local mock processing.
         * ------------------------------------------
         */

        const result =
          await scanReceipt(
            normalizedUri,
          );

        if (!mountedRef.current) {
          return;
        }

        /*
         * ------------------------------------------
         * RETURN RESULT
         * ------------------------------------------
         */

        onScanned(result);
      } catch (error) {
        console.error(
          "Receipt processing error:",
          error,
        );

        if (mountedRef.current) {
          Alert.alert(
            "Scan failed",
            "We could not read this receipt. Please try another image.",
          );
        }
      } finally {
        processingRef.current =
          false;

        if (mountedRef.current) {
          setProcessing(false);
        }

        /*
         * ------------------------------------------
         * TEMP FILE CLEANUP
         * ------------------------------------------
         *
         * The normalized image is stored in the
         * cache directory.
         *
         * We intentionally DON'T delete it while
         * the preview may still be displayed.
         *
         * The system is allowed to clear cache files.
         *
         * If you later want persistent receipt
         * storage, we will move the confirmed image
         * into documentDirectory instead.
         * ------------------------------------------
         */
      }
    },
    [
      normalizeImage,
      onScanned,
    ],
  );

  /*
   * ------------------------------------------------
   * ANDROID PENDING RESULT
   * ------------------------------------------------
   */

  useEffect(() => {
    if (
      Platform.OS !==
      "android"
    ) {
      return;
    }

    if (
      pendingCheckedRef.current
    ) {
      return;
    }

    pendingCheckedRef.current =
      true;

    let cancelled = false;

    const recoverPendingResult =
      async () => {
        try {
          const pending =
            await ImagePicker.getPendingResultAsync();

          if (
            cancelled ||
            !mountedRef.current
          ) {
            return;
          }

          if (!pending) {
            return;
          }

          /*
           * Handle ImagePickerErrorResult.
           */
          if (
            "code" in pending
          ) {
            console.warn(
              "Pending ImagePicker error:",
              pending,
            );

            return;
          }

          /*
           * User cancelled.
           */
          if (
            pending.canceled
          ) {
            return;
          }

          /*
           * Extract URI.
           */
          const uri =
            pending.assets?.[0]?.uri;

          if (!uri) {
            return;
          }

          /*
           * Process recovered image.
           */
          await processImage(uri);
        } catch (error) {
          console.error(
            "Pending ImagePicker recovery error:",
            error,
          );
        }
      };

    recoverPendingResult();

    return () => {
      cancelled = true;
    };
  }, [processImage]);

  /*
   * ------------------------------------------------
   * CAMERA
   * ------------------------------------------------
   */

  const openCamera = async () => {
    if (
      processingRef.current
    ) {
      return;
    }

    try {
      /*
       * ------------------------------------------
       * CAMERA PERMISSION
       * ------------------------------------------
       */

      const permission =
        await ImagePicker.requestCameraPermissionsAsync();

      if (!permission.granted) {
        Alert.alert(
          "Camera permission required",
          "Allow camera access to scan receipts.",
        );

        return;
      }

      /*
       * ------------------------------------------
       * CAMERA
       * ------------------------------------------
       *
       * IMPORTANT:
       *
       * We intentionally DO NOT enable the native
       * Android crop/editor.
       *
       * This avoids the known crop-activity crash
       * path.
       * ------------------------------------------
       */

      const result =
        await ImagePicker.launchCameraAsync({
          mediaTypes: ["images"],

          /*
           * CRITICAL:
           *
           * Don't invoke the native crop activity.
           */
          allowsEditing: false,

          /*
           * Reduce camera output.
           */
          quality: 0.7,

          /*
           * Don't request unnecessary metadata.
           */
          exif: false,

          /*
           * Never create base64 image data.
           */
          base64: false,
        });

      /*
       * ------------------------------------------
       * CANCELLED
       * ------------------------------------------
       */

      if (
        result.canceled
      ) {
        return;
      }

      /*
       * ------------------------------------------
       * IMAGE
       * ------------------------------------------
       */

      const asset =
        result.assets?.[0];

      if (!asset?.uri) {
        Alert.alert(
          "Camera error",
          "The camera did not return a valid image.",
        );

        return;
      }

      /*
       * ------------------------------------------
       * PROCESS
       * ------------------------------------------
       */

      await processImage(
        asset.uri,
      );
    } catch (error) {
      console.error(
        "Camera error:",
        error,
      );

      if (mountedRef.current) {
        Alert.alert(
          "Camera error",
          "Unable to process the captured receipt image.",
        );
      }
    }
  };

  /*
   * ------------------------------------------------
   * GALLERY
   * ------------------------------------------------
   */

  const openGallery = async () => {
    if (
      processingRef.current
    ) {
      return;
    }

    try {
      const result =
        await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ["images"],

          /*
           * Gallery editing remains enabled.
           */
          allowsEditing: true,

          quality: 0.7,

          exif: false,

          base64: false,
        });

      if (
        result.canceled
      ) {
        return;
      }

      const asset =
        result.assets?.[0];

      if (!asset?.uri) {
        Alert.alert(
          "Gallery error",
          "The selected image is not valid.",
        );

        return;
      }

      await processImage(
        asset.uri,
      );
    } catch (error) {
      console.error(
        "Gallery error:",
        error,
      );

      if (mountedRef.current) {
        Alert.alert(
          "Gallery error",
          "Unable to select the receipt image.",
        );
      }
    }
  };

  /*
   * ------------------------------------------------
   * RESET
   * ------------------------------------------------
   */

  const resetScanner = () => {
    if (
      processingRef.current
    ) {
      return;
    }

    setImageUri(null);
  };

  /*
   * ------------------------------------------------
   * UI
   * ------------------------------------------------
   *
   * EXISTING UI PRESERVED.
   * ------------------------------------------------
   */

  return (
    <View>
      {imageUri ? (
        <View className="mb-5 overflow-hidden rounded-2xl bg-slate-100">
          <Image
            source={{
              uri: imageUri,
            }}
            className="h-56 w-full"
            resizeMode="cover"
          />

          {processing && (
            <View className="absolute inset-0 items-center justify-center bg-black/45">
              <ActivityIndicator
                size="large"
                color="#FFFFFF"
              />

              <Text className="mt-3 font-semibold text-white">
                AI is reading your receipt...
              </Text>

              <Text className="mt-1 text-xs text-white/80">
                Extracting amount and transaction details
              </Text>
            </View>
          )}
        </View>
      ) : (
        <View className="mb-5 items-center rounded-3xl border border-dashed border-slate-300 bg-slate-50 px-6 py-9">
          <View className="h-16 w-16 items-center justify-center rounded-full bg-blue-100">
            <Feather
              name="camera"
              size={28}
              color="#2563EB"
            />
          </View>

          <Text className="mt-4 text-lg font-bold text-slate-900">
            Scan a receipt
          </Text>

          <Text className="mt-2 text-center text-sm leading-5 text-slate-500">
            Take a picture of your receipt and let AI
            extract the transaction information.
          </Text>
        </View>
      )}

      <TouchableOpacity
        onPress={openCamera}
        disabled={processing}
        activeOpacity={0.85}
        className={`mb-3 h-14 flex-row items-center justify-center rounded-2xl ${
          processing
            ? "bg-blue-300"
            : "bg-blue-600"
        }`}
      >
        <Feather
          name="camera"
          size={19}
          color="#FFFFFF"
        />

        <Text className="ml-2 font-bold text-white">
          Scan Receipt
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={openGallery}
        disabled={processing}
        activeOpacity={0.85}
        className={`h-14 flex-row items-center justify-center rounded-2xl border border-slate-200 bg-white ${
          processing
            ? "opacity-50"
            : ""
        }`}
      >
        <Feather
          name="image"
          size={19}
          color="#475569"
        />

        <Text className="ml-2 font-bold text-slate-700">
          Choose From Gallery
        </Text>
      </TouchableOpacity>

      {imageUri &&
        !processing && (
          <TouchableOpacity
            onPress={
              resetScanner
            }
            className="mt-3 h-11 items-center justify-center"
          >
            <Text className="font-semibold text-slate-500">
              Scan Another Receipt
            </Text>
          </TouchableOpacity>
        )}
    </View>
  );
}