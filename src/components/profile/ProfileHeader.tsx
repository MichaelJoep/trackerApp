import {
    ActivityIndicator,
    Image,
    Text,
    TouchableOpacity,
    View,
  } from "react-native";
  
  import { Feather } from "@expo/vector-icons";
  
  interface ProfileHeaderProps {
    fullName: string;
    email?: string;
    avatarUrl?: string | null;
    initials: string;
    uploading?: boolean;
    onChangePhoto: () => void;
  }
  
  export default function ProfileHeader({
    fullName,
    email,
    avatarUrl,
    initials,
    uploading = false,
    onChangePhoto,
  }: ProfileHeaderProps) {
    return (
      <View className="mb-7 overflow-hidden rounded-3xl bg-white p-6">
        <View className="items-center">
          {/* Avatar */}
          <View className="relative">
            <View className="h-28 w-28 overflow-hidden rounded-full bg-blue-100">
              {avatarUrl ? (
                <Image
                  source={{
                    uri: avatarUrl,
                  }}
                  className="h-full w-full"
                  resizeMode="cover"
                />
              ) : (
                <View className="h-full w-full items-center justify-center">
                  <Text className="text-4xl font-bold text-blue-600">
                    {initials}
                  </Text>
                </View>
              )}
  
              {uploading && (
                <View className="absolute inset-0 items-center justify-center bg-black/45">
                  <ActivityIndicator
                    size="small"
                    color="#FFFFFF"
                  />
                </View>
              )}
            </View>
  
            {/* Edit button */}
            <TouchableOpacity
              onPress={onChangePhoto}
              disabled={uploading}
              activeOpacity={0.85}
              className="absolute bottom-0 right-0 h-10 w-10 items-center justify-center rounded-full border-4 border-white bg-blue-600"
            >
              <Feather
                name="camera"
                size={17}
                color="#FFFFFF"
              />
            </TouchableOpacity>
          </View>
  
          <Text className="mt-5 text-2xl font-bold text-slate-900">
            {fullName}
          </Text>
  
          <Text className="mt-1 text-sm text-slate-500">
            {email || "No email available"}
          </Text>
  
          <TouchableOpacity
            onPress={onChangePhoto}
            disabled={uploading}
            activeOpacity={0.8}
            className="mt-4 rounded-xl bg-blue-50 px-4 py-2.5"
          >
            <Text className="text-sm font-bold text-blue-600">
              {uploading
                ? "Uploading..."
                : "Change Profile Photo"}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }