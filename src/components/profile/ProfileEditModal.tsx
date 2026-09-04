import {
    ActivityIndicator,
    KeyboardAvoidingView,
    Modal,
    Platform,
    Text,
    TextInput,
    TouchableOpacity,
    View,
  } from "react-native";
  
  import { Feather } from "@expo/vector-icons";
  
  import {
    useEffect,
    useState,
  } from "react";
  
  interface ProfileEditModalProps {
    visible: boolean;
  
    firstName: string;
    lastName: string;
    phone: string;
  
    saving: boolean;
  
    onClose: () => void;
  
    onSave: (input: {
      firstName: string;
      lastName: string;
      phone: string;
    }) => Promise<void>;
  }
  
  export default function ProfileEditModal({
    visible,
    firstName,
    lastName,
    phone,
    saving,
    onClose,
    onSave,
  }: ProfileEditModalProps) {
    const [
      firstNameValue,
      setFirstNameValue,
    ] = useState(firstName);
  
    const [
      lastNameValue,
      setLastNameValue,
    ] = useState(lastName);
  
    const [
      phoneValue,
      setPhoneValue,
    ] = useState(phone);
  
    useEffect(() => {
      if (!visible) {
        return;
      }
  
      setFirstNameValue(
        firstName,
      );
  
      setLastNameValue(
        lastName,
      );
  
      setPhoneValue(phone);
    }, [
      visible,
      firstName,
      lastName,
      phone,
    ]);
  
    const handleSave = async () => {
      if (!firstNameValue.trim()) {
        return;
      }
  
      if (!lastNameValue.trim()) {
        return;
      }
  
      await onSave({
        firstName:
          firstNameValue.trim(),
  
        lastName:
          lastNameValue.trim(),
  
        phone:
          phoneValue.trim(),
      });
    };
  
    return (
      <Modal
        visible={visible}
        transparent
        animationType="slide"
        onRequestClose={onClose}
      >
        <KeyboardAvoidingView
          className="flex-1 justify-end bg-black/40"
          behavior={
            Platform.OS === "ios"
              ? "padding"
              : "height"
          }
        >
          <View className="rounded-t-3xl bg-white px-6 pb-8 pt-5">
            {/* Header */}
            <View className="mb-6 flex-row items-center justify-between">
              <View>
                <Text className="text-xl font-bold text-slate-900">
                  Edit Profile
                </Text>
  
                <Text className="mt-1 text-sm text-slate-500">
                  Update your personal information.
                </Text>
              </View>
  
              <TouchableOpacity
                onPress={onClose}
                disabled={saving}
                className="h-10 w-10 items-center justify-center rounded-full bg-slate-100"
              >
                <Feather
                  name="x"
                  size={20}
                  color="#475569"
                />
              </TouchableOpacity>
            </View>
  
            {/* First name */}
            <Text className="mb-2 text-sm font-semibold text-slate-700">
              First Name
            </Text>
  
            <TextInput
              value={firstNameValue}
              onChangeText={
                setFirstNameValue
              }
              placeholder="First name"
              placeholderTextColor="#94A3B8"
              autoCapitalize="words"
              className="mb-4 h-14 rounded-2xl border border-slate-200 bg-slate-50 px-4 text-base text-slate-900"
            />
  
            {/* Last name */}
            <Text className="mb-2 text-sm font-semibold text-slate-700">
              Last Name
            </Text>
  
            <TextInput
              value={lastNameValue}
              onChangeText={
                setLastNameValue
              }
              placeholder="Last name"
              placeholderTextColor="#94A3B8"
              autoCapitalize="words"
              className="mb-4 h-14 rounded-2xl border border-slate-200 bg-slate-50 px-4 text-base text-slate-900"
            />
  
            {/* Phone */}
            <Text className="mb-2 text-sm font-semibold text-slate-700">
              Phone Number
            </Text>
  
            <TextInput
              value={phoneValue}
              onChangeText={
                setPhoneValue
              }
              placeholder="Phone number"
              placeholderTextColor="#94A3B8"
              keyboardType="phone-pad"
              className="mb-6 h-14 rounded-2xl border border-slate-200 bg-slate-50 px-4 text-base text-slate-900"
            />
  
            {/* Save */}
            <TouchableOpacity
              onPress={handleSave}
              disabled={
                saving ||
                !firstNameValue.trim() ||
                !lastNameValue.trim()
              }
              activeOpacity={0.85}
              className={`h-14 flex-row items-center justify-center rounded-2xl ${
                saving ||
                !firstNameValue.trim() ||
                !lastNameValue.trim()
                  ? "bg-blue-300"
                  : "bg-blue-600"
              }`}
            >
              {saving ? (
                <ActivityIndicator
                  color="#FFFFFF"
                />
              ) : (
                <>
                  <Feather
                    name="save"
                    size={18}
                    color="#FFFFFF"
                  />
  
                  <Text className="ml-2 font-bold text-white">
                    Save Changes
                  </Text>
                </>
              )}
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </Modal>
    );
  }