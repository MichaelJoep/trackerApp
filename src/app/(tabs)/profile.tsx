import {
  Alert,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import {
  useMemo,
  useState,
} from "react";

import { router } from "expo-router";

import { Feather } from "@expo/vector-icons";

import { useAuthStore } from "../../store/auth.store";

import ProfileHeader from "../../components/profile/ProfileHeader";
import ProfileEditModal from "../../components/profile/ProfileEditModal";
import CurrencyPicker from "../../components/profile/CurrencyPicker";
import ProfileSettingRow from "../../components/profile/ProfileSettingRow";
import ProfileSettingsMenu from "../../components/profile/ProfileSettingsMenu";

import {
  getProfile,
  pickProfilePhoto,
  uploadProfilePhoto,
} from "../../services/profile.api";

export default function ProfileScreen() {
  const user =
    useAuthStore(
      (state) => state.user,
    );

  const signOut =
    useAuthStore(
      (state) => state.signOut,
    );

  const updateProfile =
    useAuthStore(
      (state) =>
        state.updateProfile,
    );

  const loading =
    useAuthStore(
      (state) => state.loading,
    );

  /*
   * ------------------------------------------------
   * USER DATA
   * ------------------------------------------------
   */

  const firstName =
    user?.user_metadata
      ?.first_name ?? "";

  const lastName =
    user?.user_metadata
      ?.last_name ?? "";

  const phone =
    user?.user_metadata
      ?.phone ?? "";

  const avatarUrl =
    user?.user_metadata
      ?.avatar_url ?? null;

  const currency =
    user?.user_metadata
      ?.currency ?? "NGN";

  const fullName =
    `${firstName} ${lastName}`.trim() ||
    "Tracker User";

  const initials =
    useMemo(() => {
      const first =
        firstName
          .charAt(0)
          .toUpperCase();

      const last =
        lastName
          .charAt(0)
          .toUpperCase();

      return (
        `${first}${last}` ||
        "U"
      );
    }, [
      firstName,
      lastName,
    ]);

  /*
   * ------------------------------------------------
   * UI STATE
   * ------------------------------------------------
   */

  const [editVisible, setEditVisible] = useState(false);
  const [currencyVisible, setCurrencyVisible] = useState(false);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const [settingsVisible, setSettingsVisible] = useState(false);

  /*
   * ------------------------------------------------
   * CHANGE PROFILE PHOTO
   * ------------------------------------------------
   */

  const handleChangePhoto =
    async () => {
      if (uploadingPhoto) {
        return;
      }

      try {
        setUploadingPhoto(true);

        const asset =
          await pickProfilePhoto();

        if (!asset) {
          return;
        }

        await uploadProfilePhoto(
          asset.uri,
          asset.mimeType ||
            "image/jpeg",
        );

        /*
         * Refresh local auth user so the new
         * avatar appears immediately.
         */

        const refreshedUser = await getProfile();

        /*
         * Update Zustand using the latest
         * Supabase metadata.
         */

        await updateProfile({
          firstName:
            refreshedUser
              .user_metadata
              ?.first_name ??
            "",

          lastName:
            refreshedUser
              .user_metadata
              ?.last_name ??
            "",

          phone:
            refreshedUser
              .user_metadata
              ?.phone ??
            "",

          currency:
            refreshedUser
              .user_metadata
              ?.currency ??
            "NGN",

          avatarUrl:
            refreshedUser
              .user_metadata
              ?.avatar_url ??
            null,
        });

        Alert.alert(
          "Profile Photo Updated",
          "Your profile picture has been saved successfully.",
        );
      } catch (error) {
        console.error(
          "Profile photo error:",
          error,
        );

        Alert.alert(
          "Upload Failed",
          error instanceof Error
            ? error.message
            : "Unable to update your profile picture.",
        );
      } finally {
        setUploadingPhoto(false);
      }
    };

  /*
   * ------------------------------------------------
   * SAVE PROFILE
   * ------------------------------------------------
   */

  const handleSaveProfile =
    async (input: {
      firstName: string;
      lastName: string;
      phone: string;
    }) => {
      try {
        await updateProfile({
          firstName:
            input.firstName,

          lastName:
            input.lastName,

          phone:
            input.phone,

          currency,
        });

        setEditVisible(false);

        Alert.alert(
          "Profile Updated",
          "Your personal information has been saved.",
        );
      } catch (error) {
        Alert.alert(
          "Update Failed",
          error instanceof Error
            ? error.message
            : "Unable to update your profile.",
        );
      }
    };

  /*
   * ------------------------------------------------
   * CURRENCY
   * ------------------------------------------------
   */

  const handleCurrencySelect =
    async (selected: {
      code: string;
      name: string;
      symbol: string;
    }) => {
      try {
        setCurrencyVisible(
          false,
        );

        await updateProfile({
          firstName,
          lastName,
          phone,
          currency:
            selected.code,
          avatarUrl,
        });

        Alert.alert(
          "Currency Updated",
          `Your preferred currency is now ${selected.code}.`,
        );
      } catch (error) {
        Alert.alert(
          "Currency Update Failed",
          error instanceof Error
            ? error.message
            : "Unable to save your preferred currency.",
        );
      }
    };

  /*
   * ------------------------------------------------
   * SIGN OUT
   * ------------------------------------------------
   */

  const handleSignOut =
    () => {
      Alert.alert(
        "Sign Out",
        "Are you sure you want to sign out?",
        [
          {
            text: "Cancel",
            style: "cancel",
          },
          {
            text: "Sign Out",
            style: "destructive",
            onPress:
              async () => {
                try {
                  await signOut();

                  router.replace(
                    "/(auth)/sign-in",
                  );
                } catch {
                  Alert.alert(
                    "Error",
                    "Unable to sign out. Please try again.",
                  );
                }
              },
          },
        ],
      );
    };

  /*
   * ------------------------------------------------
   * RENDER
   * ------------------------------------------------
   */

  return (
    <>
      <ScrollView
        className="flex-1 bg-slate-50"
        contentContainerClassName="px-6 pb-10 pt-14"
        showsVerticalScrollIndicator={
          false
        }
      >
        {/* -------------------------------------- */}
        {/* HEADER */}
        {/* -------------------------------------- */}

        <View className="mb-6 flex-row items-center justify-between">
          <View>
            <Text className="text-3xl font-bold text-slate-900">
              Profile
            </Text>

            <Text className="mt-1 text-sm text-slate-500">
              Manage your account and preferences
            </Text>
          </View>

          <View className="h-11 w-11 items-center justify-center rounded-full bg-white">
          <TouchableOpacity
             activeOpacity={0.75}
             onPress={() =>
              setSettingsVisible(true)
            }
            className="h-11 w-11 items-center justify-center rounded-full bg-white"
             >
            <Feather
              name="settings"
              size={20}
              color="#475569"
            />
        </TouchableOpacity>
          </View>
        </View>

        {/* -------------------------------------- */}
        {/* PROFILE HEADER */}
        {/* -------------------------------------- */}

        <ProfileHeader
          fullName={fullName}
          email={user?.email}
          avatarUrl={avatarUrl}
          initials={initials}
          uploading={
            uploadingPhoto
          }
          onChangePhoto={
            handleChangePhoto
          }
        />

        {/* -------------------------------------- */}
        {/* PERSONAL INFORMATION */}
        {/* -------------------------------------- */}

        <Text className="mb-3 text-sm font-bold tracking-wide text-slate-500">
          PERSONAL INFORMATION
        </Text>

        <View className="mb-7 overflow-hidden rounded-2xl bg-white">
          <ProfileSettingRow
            icon="user"
            title="Edit Profile"
            description="Update your name and phone number"
            onPress={() =>
              setEditVisible(
                true,
              )
            }
          />

          <ProfileSettingRow
            icon="mail"
            title="Email Address"
            description={
              user?.email ||
              "No email available"
            }
            onPress={() =>
              Alert.alert(
                "Email Address",
                "Your email address is managed by Supabase Authentication.",
              )
            }
            showChevron={false}
          />

          <ProfileSettingRow
            icon="phone"
            title="Phone Number"
            description={
              phone ||
              "No phone number added"
            }
            onPress={() =>
              setEditVisible(
                true,
              )
            }
          />
        </View>

        {/* -------------------------------------- */}
        {/* PREFERENCES */}
        {/* -------------------------------------- */}

        <Text className="mb-3 text-sm font-bold tracking-wide text-slate-500">
          PREFERENCES
        </Text>

        <View className="mb-7 overflow-hidden rounded-2xl bg-white">
          <ProfileSettingRow
            icon="globe"
            title="Preferred Currency"
            description="Used for displaying account balances and transactions"
            value={
              currency ===
              "NGN"
                ? "₦ Nigerian Naira (NGN)"
                : currency
            }
            onPress={() =>
              setCurrencyVisible(
                true,
              )
            }
          />
        </View>

        {/* -------------------------------------- */}
        {/* SECURITY */}
        {/* -------------------------------------- */}

        <Text className="mb-3 text-sm font-bold tracking-wide text-slate-500">
          SECURITY
        </Text>

        <View className="mb-7 overflow-hidden rounded-2xl bg-white">
          <ProfileSettingRow
            icon="lock"
            title="Change Password"
            description="Update your account password"
            onPress={() =>
              Alert.alert(
                "Change Password",
                "Use the password recovery flow to create a new password.",
              )
            }
          />
        </View>

        {/* -------------------------------------- */}
        {/* SIGN OUT */}
        {/* -------------------------------------- */}

        <TouchableOpacity
          onPress={
            handleSignOut
          }
          activeOpacity={0.85}
          disabled={loading}
          className="mb-4 flex-row items-center justify-center rounded-2xl border border-red-200 bg-red-50 py-4"
        >
          <Feather
            name="log-out"
            size={18}
            color="#DC2626"
          />

          <Text className="ml-2 font-bold text-red-600">
            Sign Out
          </Text>
        </TouchableOpacity>

        <Text className="text-center text-xs text-slate-400">
          Tracker · Your finances, simplified
        </Text>
      </ScrollView>

      {/* ---------------------------------------- */}
      {/* EDIT PROFILE MODAL */}
      {/* ---------------------------------------- */}

      <ProfileEditModal
        visible={editVisible}
        firstName={
          firstName
        }
        lastName={
          lastName
        }
        phone={phone}
        saving={loading}
        onClose={() =>
          setEditVisible(
            false,
          )
        }
        onSave={
          handleSaveProfile
        }
      />

      {/* ---------------------------------------- */}
      {/* CURRENCY PICKER */}
      {/* ---------------------------------------- */}

      <CurrencyPicker
        visible={
          currencyVisible
        }
        value={currency}
        onSelect={
          handleCurrencySelect
        }
        onClose={() =>
          setCurrencyVisible(
            false,
          )
        }
      />

      <ProfileSettingsMenu
        visible={settingsVisible}
        onClose={() =>
          setSettingsVisible(false)
        }
        onEditProfile={() =>
          setEditVisible(true)
        }
        onCurrency={() =>
          setCurrencyVisible(true)
        }
        onChangePassword={() => {
          Alert.alert(
            "Change Password",
            "Use the password recovery flow to create a new password.",
          );
        }}
        onSignOut={handleSignOut}
      />
    </>
  );
}