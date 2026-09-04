import {
    Modal,
    Pressable,
    Text,
    TouchableOpacity,
    View,
  } from "react-native";
  
  import { Feather } from "@expo/vector-icons";
  
  export interface ProfileSettingsItem {
    key: string;
    title: string;
    description: string;
    icon: keyof typeof Feather.glyphMap;
  }
  
  interface ProfileSettingsMenuProps {
    visible: boolean;
    onClose: () => void;
  
    onEditProfile: () => void;
    onCurrency: () => void;
    onChangePassword: () => void;
    onSignOut: () => void;
  }
  
  export default function ProfileSettingsMenu({
    visible,
    onClose,
    onEditProfile,
    onCurrency,
    onChangePassword,
    onSignOut,
  }: ProfileSettingsMenuProps) {
    const settings = [
      {
        key: "profile",
        title: "Edit Profile",
        description:
          "Update your personal information",
        icon: "user" as const,
        onPress: onEditProfile,
      },
      {
        key: "currency",
        title: "Preferred Currency",
        description:
          "Choose your default currency",
        icon: "globe" as const,
        onPress: onCurrency,
      },
      {
        key: "password",
        title: "Change Password",
        description:
          "Update your account password",
        icon: "lock" as const,
        onPress: onChangePassword,
      },
      {
        key: "signout",
        title: "Sign Out",
        description:
          "Sign out of your Tracker account",
        icon: "log-out" as const,
        onPress: onSignOut,
      },
    ];
  
    const handlePress = (
      callback: () => void,
    ) => {
      onClose();
  
      setTimeout(() => {
        callback();
      }, 150);
    };
  
    return (
      <Modal
        visible={visible}
        transparent
        animationType="fade"
        onRequestClose={onClose}
      >
        <Pressable
          className="flex-1 bg-black/30"
          onPress={onClose}
        >
          <Pressable
            onPress={() => {}}
            className="absolute right-5 top-24 w-[300px] overflow-hidden rounded-3xl bg-white shadow-xl"
          >
            {/* Header */}
            <View className="border-b border-slate-100 px-5 py-4">
              <View className="flex-row items-center justify-between">
                <View>
                  <Text className="text-lg font-bold text-slate-900">
                    Settings
                  </Text>
  
                  <Text className="mt-1 text-xs text-slate-500">
                    Manage your account
                  </Text>
                </View>
  
                <TouchableOpacity
                  onPress={onClose}
                  className="h-9 w-9 items-center justify-center rounded-full bg-slate-100"
                >
                  <Feather
                    name="x"
                    size={18}
                    color="#475569"
                  />
                </TouchableOpacity>
              </View>
            </View>
  
            {/* Items */}
            <View className="px-3 py-3">
              {settings.map(
                (item, index) => {
                  const isLast =
                    index ===
                    settings.length - 1;
  
                  const isDanger =
                    item.key ===
                    "signout";
  
                  return (
                    <TouchableOpacity
                      key={item.key}
                      activeOpacity={0.75}
                      onPress={() =>
                        handlePress(
                          item.onPress,
                        )
                      }
                      className={`flex-row items-center rounded-2xl px-3 py-3 ${
                        !isLast
                          ? "mb-1"
                          : ""
                      }`}
                    >
                      <View
                        className={`h-10 w-10 items-center justify-center rounded-xl ${
                          isDanger
                            ? "bg-red-50"
                            : "bg-slate-100"
                        }`}
                      >
                        <Feather
                          name={item.icon}
                          size={18}
                          color={
                            isDanger
                              ? "#DC2626"
                              : "#475569"
                          }
                        />
                      </View>
  
                      <View className="ml-3 flex-1">
                        <Text
                          className={`text-sm font-bold ${
                            isDanger
                              ? "text-red-600"
                              : "text-slate-800"
                          }`}
                        >
                          {item.title}
                        </Text>
  
                        <Text className="mt-0.5 text-xs text-slate-400">
                          {
                            item.description
                          }
                        </Text>
                      </View>
  
                      <Feather
                        name="chevron-right"
                        size={17}
                        color="#94A3B8"
                      />
                    </TouchableOpacity>
                  );
                },
              )}
            </View>
          </Pressable>
        </Pressable>
      </Modal>
    );
  }