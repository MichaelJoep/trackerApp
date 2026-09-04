import {
    FlatList,
    Modal,
    Pressable,
    Text,
    TextInput,
    TouchableOpacity,
    View,
  } from "react-native";
  
  import {
    useEffect,
    useMemo,
    useState,
  } from "react";
  
  import { Feather } from "@expo/vector-icons";
  
  import {
    CURRENCIES,
    DEFAULT_CURRENCY,
    type CurrencyOption,
  } from "../../constants/currencies";
  
  interface CurrencyPickerProps {
    visible: boolean;
    value: string;
    onSelect: (
      currency: CurrencyOption,
    ) => void;
    onClose: () => void;
  }
  
  export default function CurrencyPicker({
    visible,
    value,
    onSelect,
    onClose,
  }: CurrencyPickerProps) {
    const [search, setSearch] =
      useState("");
  
    useEffect(() => {
      if (visible) {
        setSearch("");
      }
    }, [visible]);
  
    const selectedValue =
      value || DEFAULT_CURRENCY;
  
    const filteredCurrencies =
      useMemo(() => {
        const query =
          search.trim().toLowerCase();
  
        if (!query) {
          return CURRENCIES;
        }
  
        return CURRENCIES.filter(
          (currency) =>
            currency.code
              .toLowerCase()
              .includes(query) ||
            currency.name
              .toLowerCase()
              .includes(query) ||
            currency.symbol
              .toLowerCase()
              .includes(query),
        );
      }, [search]);
  
    const handleClose = () => {
      setSearch("");
      onClose();
    };
  
    const handleSelect = (
      currency: CurrencyOption,
    ) => {
      setSearch("");
      onSelect(currency);
    };
  
    const renderCurrency = ({
      item,
    }: {
      item: CurrencyOption;
    }) => {
      const selected =
        item.code === selectedValue;
  
      return (
        <TouchableOpacity
          onPress={() =>
            handleSelect(item)
          }
          activeOpacity={0.75}
          className={`mb-3 flex-row items-center rounded-2xl border px-4 py-4 ${
            selected
              ? "border-blue-600 bg-blue-50"
              : "border-slate-200 bg-white"
          }`}
        >
          <View
            className={`h-12 w-12 items-center justify-center rounded-xl ${
              selected
                ? "bg-blue-600"
                : "bg-slate-100"
            }`}
          >
            <Text
              className={`text-lg font-bold ${
                selected
                  ? "text-white"
                  : "text-slate-700"
              }`}
            >
              {item.symbol}
            </Text>
          </View>
  
          <View className="ml-4 flex-1">
            <Text className="text-base font-bold text-slate-900">
              {item.name}
            </Text>
  
            <Text className="mt-1 text-sm text-slate-500">
              {item.code}
            </Text>
          </View>
  
          {selected && (
            <View className="h-7 w-7 items-center justify-center rounded-full bg-blue-600">
              <Feather
                name="check"
                size={16}
                color="#FFFFFF"
              />
            </View>
          )}
        </TouchableOpacity>
      );
    };
  
    return (
      <Modal
        visible={visible}
        transparent
        animationType="slide"
        onRequestClose={
          handleClose
        }
      >
        <Pressable
          className="flex-1 justify-end bg-black/40"
          onPress={handleClose}
        >
          <Pressable
            onPress={() => {}}
            className="max-h-[85%] rounded-t-3xl bg-white"
          >
            {/* Header */}
            <View className="flex-row items-center justify-between border-b border-slate-100 px-6 py-5">
              <View className="flex-1 pr-4">
                <Text className="text-xl font-bold text-slate-900">
                  Preferred Currency
                </Text>
  
                <Text className="mt-1 text-sm text-slate-500">
                  Choose the currency used throughout Tracker.
                </Text>
              </View>
  
              <TouchableOpacity
                onPress={handleClose}
                className="h-10 w-10 items-center justify-center rounded-full bg-slate-100"
              >
                <Feather
                  name="x"
                  size={20}
                  color="#475569"
                />
              </TouchableOpacity>
            </View>
  
            {/* Search */}
            <View className="px-5 pt-4">
              <View className="flex-row items-center rounded-2xl bg-slate-100 px-4">
                <Feather
                  name="search"
                  size={18}
                  color="#64748B"
                />
  
                <TextInput
                  value={search}
                  onChangeText={setSearch}
                  placeholder="Search currency..."
                  placeholderTextColor="#94A3B8"
                  autoCapitalize="none"
                  autoCorrect={false}
                  className="ml-3 flex-1 py-4 text-base text-slate-900"
                />
  
                {search.length > 0 && (
                  <TouchableOpacity
                    onPress={() =>
                      setSearch("")
                    }
                  >
                    <Feather
                      name="x-circle"
                      size={18}
                      color="#94A3B8"
                    />
                  </TouchableOpacity>
                )}
              </View>
            </View>
  
            {/* Currency count */}
            <View className="px-5 pb-2 pt-4">
              <Text className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                {filteredCurrencies.length} currencies
              </Text>
            </View>
  
            {/* List */}
            {filteredCurrencies.length ===
            0 ? (
              <View className="items-center px-5 py-10">
                <View className="mb-3 h-14 w-14 items-center justify-center rounded-full bg-slate-100">
                  <Feather
                    name="search"
                    size={24}
                    color="#94A3B8"
                  />
                </View>
  
                <Text className="text-base font-semibold text-slate-700">
                  No currency found
                </Text>
  
                <Text className="mt-1 text-sm text-slate-400">
                  Try another currency name or code.
                </Text>
              </View>
            ) : (
              <FlatList
                data={
                  filteredCurrencies
                }
                keyExtractor={(item) =>
                  item.code
                }
                renderItem={
                  renderCurrency
                }
                keyboardShouldPersistTaps="handled"
                showsVerticalScrollIndicator={
                  false
                }
                contentContainerStyle={{
                  paddingHorizontal: 20,
                  paddingBottom: 40,
                }}
                initialNumToRender={20}
                maxToRenderPerBatch={20}
                windowSize={7}
                removeClippedSubviews
              />
            )}
          </Pressable>
        </Pressable>
      </Modal>
    );
  }