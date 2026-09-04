import {
    Text,
    TouchableOpacity,
    View,
  } from "react-native";
  
  import { Feather } from "@expo/vector-icons";
  
  interface ProfileSettingRowProps {
    icon: keyof typeof Feather.glyphMap;
    title: string;
    description: string;
    value?: string;
    onPress: () => void;
    destructive?: boolean;
    showChevron?: boolean;
  }
  
  export default function ProfileSettingRow({
    icon,
    title,
    description,
    value,
    onPress,
    destructive = false,
    showChevron = true,
  }: ProfileSettingRowProps) {
    return (
      <TouchableOpacity
        onPress={onPress}
        activeOpacity={0.75}
        className="flex-row items-center border-b border-slate-100 px-5 py-4"
      >
        <View
          className={`h-11 w-11 items-center justify-center rounded-xl ${
            destructive
              ? "bg-red-50"
              : "bg-slate-100"
          }`}
        >
          <Feather
            name={icon}
            size={19}
            color={
              destructive
                ? "#DC2626"
                : "#475569"
            }
          />
        </View>
  
        <View className="ml-4 flex-1">
          <Text
            className={`text-base font-semibold ${
              destructive
                ? "text-red-600"
                : "text-slate-800"
            }`}
          >
            {title}
          </Text>
  
          <Text className="mt-1 text-sm text-slate-500">
            {description}
          </Text>
  
          {value ? (
            <Text className="mt-1 text-sm font-semibold text-blue-600">
              {value}
            </Text>
          ) : null}
        </View>
  
        {showChevron && (
          <Feather
            name="chevron-right"
            size={19}
            color="#94A3B8"
          />
        )}
      </TouchableOpacity>
    );
  }