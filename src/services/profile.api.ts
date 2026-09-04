import * as ImagePicker from "expo-image-picker";

import { supabase } from "../lib/supabase";

/*
 * ----------------------------------------------------
 * PROFILE TYPES
 * ----------------------------------------------------
 */

export interface ProfileUpdateInput {
  firstName: string;
  lastName: string;
  phone: string;
  currency: string;
  avatarUrl?: string | null;
}

/*
 * ----------------------------------------------------
 * GET PROFILE
 * ----------------------------------------------------
 */

export async function getProfile() {
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error) {
    throw error;
  }

  if (!user) {
    throw new Error(
      "No authenticated user found.",
    );
  }

  return user;
}

/*
 * ----------------------------------------------------
 * UPDATE PROFILE
 * ----------------------------------------------------
 *
 * Profile information is stored directly in
 * Supabase Auth user_metadata.
 * ----------------------------------------------------
 */

export async function updateProfile(
  input: ProfileUpdateInput,
) {
  const {
    data,
    error,
  } = await supabase.auth.updateUser({
    data: {
      first_name:
        input.firstName.trim(),

      last_name:
        input.lastName.trim(),

      phone:
        input.phone.trim(),

      currency:
        input.currency.trim().toUpperCase(),

      ...(input.avatarUrl !== undefined
        ? {
            avatar_url:
              input.avatarUrl,
          }
        : {}),
    },
  });

  if (error) {
    throw error;
  }

  return data.user;
}

/*
 * ----------------------------------------------------
 * PICK PROFILE PHOTO
 * ----------------------------------------------------
 *
 * We intentionally use the gallery here.
 *
 * This avoids reopening the native Android camera
 * flow that is currently causing your transaction
 * scanner to terminate the application.
 * ----------------------------------------------------
 */

export async function pickProfilePhoto() {
  const permission =
    await ImagePicker.requestMediaLibraryPermissionsAsync();

  if (!permission.granted) {
    throw new Error(
      "Photo library permission is required.",
    );
  }

  const result =
    await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],

      allowsMultipleSelection: false,

      allowsEditing: true,

      aspect: [1, 1],

      quality: 0.8,

      exif: false,

      base64: false,
    });

  if (result.canceled) {
    return null;
  }

  const asset =
    result.assets?.[0];

  if (!asset?.uri) {
    throw new Error(
      "The selected image is invalid.",
    );
  }

  return asset;
}

/*
 * ----------------------------------------------------
 * UPLOAD PROFILE PHOTO
 * ----------------------------------------------------
 */

export async function uploadProfilePhoto(
  uri: string,
  mimeType = "image/jpeg",
) {
  if (!uri) {
    throw new Error(
      "Profile image is required.",
    );
  }

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError) {
    throw userError;
  }

  if (!user) {
    throw new Error(
      "You must be signed in to upload a profile photo.",
    );
  }

  /*
   * Convert the local React Native file URI
   * into an ArrayBuffer.
   *
   * Supabase recommends ArrayBuffer for React
   * Native file uploads rather than Blob/File/FormData.
   */

  const response =
    await fetch(uri);

  if (!response.ok) {
    throw new Error(
      "Unable to read the selected image.",
    );
  }

  const arrayBuffer =
    await response.arrayBuffer();

  /*
   * One stable file per user.
   *
   * upsert=true means changing the profile picture
   * replaces the previous one.
   */

  const filePath =
    `${user.id}/avatar.jpg`;

  const {
    data,
    error,
  } =
    await supabase.storage
      .from("avatars")
      .upload(
        filePath,
        arrayBuffer,
        {
          contentType:
            mimeType ||
            "image/jpeg",

          cacheControl:
            "3600",

          upsert: true,
        },
      );

  if (error) {
    throw error;
  }

  /*
   * ------------------------------------------------
   * GET PUBLIC URL
   * ------------------------------------------------
   *
   * This assumes the avatars bucket is public.
   * ------------------------------------------------
   */

  const {
    data: publicUrlData,
  } =
    supabase.storage
      .from("avatars")
      .getPublicUrl(
        data.path,
      );

  if (
    !publicUrlData?.publicUrl
  ) {
    throw new Error(
      "Unable to generate profile image URL.",
    );
  }

  /*
   * Cache-busting is important when replacing
   * avatar.jpg with another image.
   */

  const avatarUrl =
    `${publicUrlData.publicUrl}?v=${Date.now()}`;

  /*
   * Store the URL directly in Auth metadata.
   */

  const {
    data: updatedUser,
    error: updateError,
  } =
    await supabase.auth.updateUser({
      data: {
        avatar_url:
          avatarUrl,
      },
    });

  if (updateError) {
    throw updateError;
  }

  return {
    user: updatedUser.user,
    path: data.path,
    avatarUrl,
  };
}

/*
 * ----------------------------------------------------
 * REMOVE PROFILE PHOTO
 * ----------------------------------------------------
 */

export async function removeProfilePhoto() {
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError) {
    throw userError;
  }

  if (!user) {
    throw new Error(
      "No authenticated user found.",
    );
  }

  const filePath =
    `${user.id}/avatar.jpg`;

  /*
   * Remove Storage object.
   */

  const {
    error: storageError,
  } =
    await supabase.storage
      .from("avatars")
      .remove([
        filePath,
      ]);

  if (storageError) {
    throw storageError;
  }

  /*
   * Remove avatar URL from metadata.
   */

  const {
    data,
    error,
  } =
    await supabase.auth.updateUser({
      data: {
        avatar_url: null,
      },
    });

  if (error) {
    throw error;
  }

  return data.user;
}