import {
    TextInput,
    TouchableOpacity,
    View,
  } from "react-native";
  import { Feather } from "@expo/vector-icons";
  
  interface TransactionSearchProps {
    value: string;
    onChangeText: (value: string) => void;
  }
  
  export default function TransactionSearch({
    value,
    onChangeText,
  }: TransactionSearchProps) {
    return (
      <View className="mb-5 h-14 flex-row items-center rounded-2xl border border-slate-200 bg-white px-4">
        <Feather
          name="search"
          size={20}
          color="#94A3B8"
        />
  
        <TextInput
          value={value}
          onChangeText={onChangeText}
          placeholder="Search transactions..."
          placeholderTextColor="#94A3B8"
          className="ml-3 flex-1 text-base text-slate-900"
          autoCapitalize="none"
          autoCorrect={false}
        />
  
        {value.length > 0 && (
          <TouchableOpacity
            onPress={() => onChangeText("")}
            className="h-8 w-8 items-center justify-center rounded-full bg-slate-100"
          >
            <Feather
              name="x"
              size={16}
              color="#64748B"
            />
          </TouchableOpacity>
        )}
      </View>
    );
  }